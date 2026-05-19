/**
 * POST /api/predict
 *
 * Server-side prediction endpoint. The same `predictStepScore` engine runs
 * client-side for the live calculator UX (instant feedback on every input
 * tweak), but every time the user clicks the primary "Predict" button the
 * client also POSTs here. Three reasons:
 *
 *   1. Funnel observability. We can't measure conversion if we don't know
 *      how many people predicted in the first place. Predictions land in
 *      D1 with anonymous IP/UA metadata.
 *
 *   2. Abuse control. The bare client function is trivial to scrape; the
 *      server endpoint is the only place we can apply per-IP rate limits.
 *
 *   3. A canonical predictionId. The client gets back a stable id it can
 *      forward to /api/checkout so the eventual order row links back to
 *      exactly which inputs produced the predicted score.
 *
 * Failure modes are deliberately soft:
 *
 *   - Rate limiter unavailable → fail open (allow).
 *   - DB write fails           → log + still return result with a
 *                                client-generated id so the UI doesn't break.
 *
 * The endpoint is intentionally idempotent on input only when the *client*
 * dedupes — we DO NOT hash inputs server-side to deduplicate, because two
 * users entering identical practice scores must produce two funnel rows.
 */
import { NextResponse } from "next/server";
import {
  ALGORITHM_VERSION,
  predictStepScore,
  type ExamSource,
  type PracticeExam,
  type PredictionResult,
  type StepKind,
} from "@/lib/data";
import { getDb } from "@/lib/db/client";
import { events, predictions } from "@/lib/db/schema";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Limits — single source of truth for the route. PRD §9.1.
// ---------------------------------------------------------------------------
const PREDICT_LIMIT_PER_HOUR = 20;
const MAX_EXAMS_PER_REQUEST = 25; // 用户极少 >10 个，25 给足缓冲并防 DoS

// ---------------------------------------------------------------------------
// Request body shape + validation. Hand-rolled to avoid pulling in zod for a
// single endpoint — keep an eye on size and migrate when we have 3+.
// ---------------------------------------------------------------------------

interface PredictBody {
  step: StepKind;
  exams: PracticeExam[];
  daysUntilExam?: number;
  options?: {
    targetScore?: number;
    selfReportedWeakSubjects?: string[];
  };
}

const STEP_VALUES: ReadonlySet<StepKind> = new Set([
  "step1",
  "step2",
  "step3",
]);
const SOURCE_VALUES: ReadonlySet<ExamSource> = new Set([
  "NBME",
  "UWSA1",
  "UWSA2",
  "FREE120",
  "AMBOSS",
  "CMS",
]);

function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

function parseBody(raw: unknown): PredictBody | { error: string } {
  if (!raw || typeof raw !== "object") {
    return { error: "Body must be a JSON object." };
  }
  const b = raw as Record<string, unknown>;

  if (typeof b.step !== "string" || !STEP_VALUES.has(b.step as StepKind)) {
    return { error: "`step` must be one of step1, step2, step3." };
  }
  if (!Array.isArray(b.exams) || b.exams.length === 0) {
    return { error: "`exams` must be a non-empty array." };
  }
  if (b.exams.length > MAX_EXAMS_PER_REQUEST) {
    return {
      error: `Too many exams (max ${MAX_EXAMS_PER_REQUEST} per request).`,
    };
  }

  const exams: PracticeExam[] = [];
  for (let i = 0; i < b.exams.length; i++) {
    const e = b.exams[i] as Record<string, unknown>;
    if (!e || typeof e !== "object") {
      return { error: `exams[${i}] must be an object.` };
    }
    if (typeof e.id !== "string" || e.id.length === 0) {
      return { error: `exams[${i}].id must be a non-empty string.` };
    }
    if (
      typeof e.source !== "string" ||
      !SOURCE_VALUES.has(e.source as ExamSource)
    ) {
      return { error: `exams[${i}].source is invalid.` };
    }
    if (!isFiniteNumber(e.score)) {
      return { error: `exams[${i}].score must be a number.` };
    }
    if (e.formNumber !== undefined && !isFiniteNumber(e.formNumber)) {
      return { error: `exams[${i}].formNumber must be a number when present.` };
    }
    if (e.takenDaysAgo !== undefined && !isFiniteNumber(e.takenDaysAgo)) {
      return {
        error: `exams[${i}].takenDaysAgo must be a number when present.`,
      };
    }
    exams.push({
      id: String(e.id),
      source: e.source as ExamSource,
      score: e.score as number,
      formNumber: e.formNumber as number | undefined,
      takenDaysAgo: e.takenDaysAgo as number | undefined,
    });
  }

  let daysUntilExam: number | undefined;
  if (b.daysUntilExam !== undefined) {
    if (!isFiniteNumber(b.daysUntilExam) || b.daysUntilExam < 0) {
      return { error: "`daysUntilExam` must be a non-negative number." };
    }
    daysUntilExam = b.daysUntilExam;
  }

  let options: PredictBody["options"];
  if (b.options !== undefined) {
    if (typeof b.options !== "object" || b.options === null) {
      return { error: "`options` must be an object when present." };
    }
    const o = b.options as Record<string, unknown>;
    const targetScore =
      o.targetScore === undefined
        ? undefined
        : isFiniteNumber(o.targetScore)
          ? o.targetScore
          : null;
    if (targetScore === null) {
      return { error: "`options.targetScore` must be a number when present." };
    }
    let selfReportedWeakSubjects: string[] | undefined;
    if (o.selfReportedWeakSubjects !== undefined) {
      if (
        !Array.isArray(o.selfReportedWeakSubjects) ||
        o.selfReportedWeakSubjects.some((s) => typeof s !== "string")
      ) {
        return {
          error: "`options.selfReportedWeakSubjects` must be string[].",
        };
      }
      selfReportedWeakSubjects = o.selfReportedWeakSubjects as string[];
    }
    options = { targetScore, selfReportedWeakSubjects };
  }

  return { step: b.step as StepKind, exams, daysUntilExam, options };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Cloudflare puts the real client IP in `cf-connecting-ip`; we fall back
 *  through standard headers so this works equally well behind any proxy. */
function getClientIp(req: Request): string {
  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];
  for (const c of candidates) {
    if (c && c.length > 0) return c;
  }
  return "unknown";
}

interface PredictResponse {
  predictionId: string;
  result: PredictionResult;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }
  const parsed = parseBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // 2. Rate limit
  const ip = getClientIp(req);
  const db = getDb();
  const verdict = await checkRateLimit(db, {
    bucket: "predict",
    identifier: `ip:${ip}`,
    limit: PREDICT_LIMIT_PER_HOUR,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Try again later.",
        resetAt: verdict.resetAt,
      },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  // 3. Compute the prediction. Same engine the client just ran — by design,
  //    so the persisted row matches what the user saw on screen.
  const result = predictStepScore(
    parsed.exams,
    parsed.step,
    parsed.daysUntilExam,
    parsed.options
  );

  // 4. Persist (best-effort). A failed write must NOT block the response.
  const predictionId = crypto.randomUUID();
  const now = Date.now();

  if (db) {
    try {
      await db.batch([
        db.insert(predictions).values({
          id: predictionId,
          userId: null,
          step: parsed.step,
          inputExams: JSON.stringify(parsed.exams),
          inputOptions: parsed.options ? JSON.stringify(parsed.options) : null,
          daysUntilExam: parsed.daysUntilExam ?? null,
          pointEstimate: result.pointEstimate,
          ciLower: result.ciLower,
          ciUpper: result.ciUpper,
          passProbability: result.passProbability,
          resultSnapshot: JSON.stringify(result),
          algorithmVersion: ALGORITHM_VERSION,
          createdAt: now,
          ip,
          userAgent: req.headers.get("user-agent") ?? null,
          referrer: req.headers.get("referer") ?? null,
          utmSource: null,
          utmCampaign: null,
          utmMedium: null,
        }),
        db.insert(events).values({
          id: crypto.randomUUID(),
          userId: null,
          type: "predict",
          payload: JSON.stringify({
            predictionId,
            step: parsed.step,
            point: result.pointEstimate,
            inputCount: parsed.exams.length,
          }),
          ip,
          createdAt: now,
        }),
      ]);
    } catch (err) {
      console.error("[/api/predict] D1 persist failed", err);
      // Swallow — UX must not depend on analytics writes succeeding.
    }
  }

  const payload: PredictResponse = { predictionId, result };
  return NextResponse.json(payload, {
    status: 200,
    headers: rateLimitHeaders(verdict),
  });
}
