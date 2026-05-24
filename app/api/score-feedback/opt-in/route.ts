import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db/client";
import { optInScoreFeedback } from "@/lib/score-feedback-store";
import { parseExamDate } from "@/lib/score-feedback";

export const runtime = "edge";

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

  const result = await optInScoreFeedback({
    db,
    sessionId: parsed.sessionId,
    examDate: parsed.examDate,
    source: "checkout_success",
    ip: req.headers.get("cf-connecting-ip"),
    userAgent: req.headers.get("user-agent"),
  });

  if (result.status !== "ok") {
    return NextResponse.json({ error: result.status }, { status: result.status === "pending" ? 409 : 422 });
  }

  return NextResponse.json({ ok: true, record: result.record });
}

function parseBody(body: unknown):
  | { sessionId: string; examDate: number }
  | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Body must be a JSON object." };
  }
  const value = body as Record<string, unknown>;
  if (typeof value.sessionId !== "string" || !value.sessionId.startsWith("cs_")) {
    return { error: "Invalid checkout session." };
  }
  if (typeof value.examDate !== "string") {
    return { error: "Exam date is required." };
  }
  const examDate = parseExamDate(value.examDate);
  if (!examDate) return { error: "Invalid exam date." };

  const now = Date.now();
  const min = now - 365 * 24 * 60 * 60 * 1000;
  const max = now + 365 * 24 * 60 * 60 * 1000;
  if (examDate < min || examDate > max) {
    return { error: "Exam date must be within one year." };
  }

  return { sessionId: value.sessionId, examDate };
}
