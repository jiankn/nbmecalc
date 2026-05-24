import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db/client";
import { submitScoreFeedback } from "@/lib/score-feedback-store";
import {
  getScoreFeedbackSecret,
  verifyScoreFeedbackToken,
  type ScoreFeedbackAction,
} from "@/lib/score-feedback";
import { readRuntimeEnv, getSiteUrlFromRuntime } from "@/lib/runtime-env";

export const runtime = "edge";

const VALID_ACTIONS: ScoreFeedbackAction[] = [
  "pass_240_plus",
  "pass_220_239",
  "pass_200_219",
  "pass_under_200",
  "fail",
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const result = await submitFromToken(req, token, "email_one_click");
  const site = getSiteUrlFromRuntime(req);

  if (!result.ok) {
    return NextResponse.redirect(
      new URL(`/feedback/error?reason=${encodeURIComponent(result.reason)}`, site)
    );
  }

  return NextResponse.redirect(
    new URL(`/feedback/${encodeURIComponent(token ?? "")}?thanks=1`, site)
  );
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let token: string | null = null;
  let actualScore: number | undefined;
  let passFail: "pass" | "fail" | undefined;
  let scoreReportUrl: string | null = null;

  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    token = typeof body?.token === "string" ? body.token : null;
    actualScore = parseScore(body?.actualScore);
    passFail = parsePassFail(body?.passFail);
    scoreReportUrl = parseOptionalUrl(body?.scoreReportUrl);
  } else {
    const form = await req.formData();
    token = getFormString(form, "token");
    actualScore = parseScore(getFormString(form, "actualScore"));
    passFail = parsePassFail(getFormString(form, "passFail"));
    scoreReportUrl = parseOptionalUrl(getFormString(form, "scoreReportUrl"));
  }

  const result = await submitFromToken(req, token, "feedback_page", {
    actualScore,
    passFail,
    scoreReportUrl,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: result.status });
  }

  if (!contentType.includes("application/json")) {
    const site = getSiteUrlFromRuntime(req);
    return NextResponse.redirect(
      new URL(`/feedback/${encodeURIComponent(token ?? "")}?thanks=1`, site),
      303
    );
  }

  return NextResponse.json({ ok: true, record: result.record });
}

async function submitFromToken(
  req: Request,
  token: string | null,
  source: string,
  body: {
    actualScore?: number;
    passFail?: "pass" | "fail";
    scoreReportUrl?: string | null;
  } = {}
): Promise<
  | { ok: true; record: unknown }
  | { ok: false; reason: string; status: number }
> {
  const secret = getScoreFeedbackSecret({
    SCORE_FEEDBACK_SECRET: readRuntimeEnv("SCORE_FEEDBACK_SECRET"),
    PDF_RENDERER_SECRET: readRuntimeEnv("PDF_RENDERER_SECRET"),
  });
  if (!secret) return { ok: false, reason: "missing-secret", status: 503 };
  if (!token) return { ok: false, reason: "missing-token", status: 400 };

  const verified = await verifyScoreFeedbackToken(token, secret);
  if (!verified.ok) return { ok: false, reason: verified.reason, status: 400 };

  const action = verified.payload.action;
  if (action && !VALID_ACTIONS.includes(action)) {
    return { ok: false, reason: "invalid-action", status: 400 };
  }
  if (!action && typeof body.actualScore !== "number" && !body.passFail) {
    return { ok: false, reason: "missing-outcome", status: 400 };
  }

  let db;
  try {
    db = requireDb();
  } catch {
    return { ok: false, reason: "database-unavailable", status: 503 };
  }

  const result = await submitScoreFeedback({
    db,
    sessionId: verified.payload.sessionId,
    action,
    actualScore: body.actualScore,
    passFail: body.passFail,
    scoreReportUrl: body.scoreReportUrl,
    source,
    ip: req.headers.get("cf-connecting-ip"),
    userAgent: req.headers.get("user-agent"),
  });

  if (result.status !== "ok") {
    return {
      ok: false,
      reason: result.status,
      status: result.status === "pending" ? 409 : 422,
    };
  }

  return { ok: true, record: result.record };
}

function getFormString(form: FormData, name: string): string | null {
  const value = form.get(name);
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function parseScore(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num < 120 || num > 300) return undefined;
  return Math.round(num);
}

function parsePassFail(value: unknown): "pass" | "fail" | undefined {
  return value === "pass" || value === "fail" ? value : undefined;
}

function parseOptionalUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  try {
    const url = new URL(value.trim());
    return url.toString();
  } catch {
    return null;
  }
}
