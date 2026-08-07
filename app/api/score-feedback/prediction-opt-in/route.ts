import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db/client";
import { optInPredictionScoreFeedback } from "@/lib/score-feedback-store";
import { parseExamDate } from "@/lib/score-feedback";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "edge";

function getClientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }
  const parsed = parseBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let db;
  try {
    db = requireDb();
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  const ip = getClientIp(req);
  const verdict = await checkRateLimit(db, {
    bucket: "prediction-feedback-opt-in",
    identifier: `ip:${ip}`,
    limit: 10,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  const result = await optInPredictionScoreFeedback({
    db,
    predictionId: parsed.predictionId,
    email: parsed.email,
    examDate: parsed.examDate,
    ip,
    userAgent: req.headers.get("user-agent"),
  });
  if (result.status !== "ok") {
    return NextResponse.json({ error: result.status }, { status: 404 });
  }
  return NextResponse.json(
    { ok: true, record: result.record },
    { headers: rateLimitHeaders(verdict) }
  );
}

function parseBody(body: unknown):
  | { predictionId: string; email: string; examDate: number }
  | { error: string } {
  if (!body || typeof body !== "object") return { error: "Body must be an object." };
  const value = body as Record<string, unknown>;
  if (
    typeof value.predictionId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(value.predictionId)
  ) {
    return { error: "Invalid prediction id." };
  }
  if (
    typeof value.email !== "string" ||
    value.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  ) {
    return { error: "A valid email is required." };
  }
  if (typeof value.examDate !== "string") return { error: "Exam date is required." };
  const examDate = parseExamDate(value.examDate);
  if (!examDate) return { error: "Invalid exam date." };
  const max = Date.now() + 365 * 24 * 60 * 60 * 1000;
  if (examDate < Date.now() - 365 * 24 * 60 * 60 * 1000 || examDate > max) {
    return { error: "Exam date must be within one year." };
  }
  return { predictionId: value.predictionId, email: value.email, examDate };
}
