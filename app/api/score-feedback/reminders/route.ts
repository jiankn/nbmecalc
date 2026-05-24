import { and, eq, isNotNull, isNull, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db/client";
import { reports, scoreReports } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import {
  createScoreFeedbackToken,
  getScoreFeedbackSecret,
  scoreFeedbackSubmitUrl,
  scoreFeedbackSummaryUrl,
  type ScoreFeedbackAction,
} from "@/lib/score-feedback";
import { getSiteUrlFromRuntime, readRuntimeEnv } from "@/lib/runtime-env";

export const runtime = "edge";

const BATCH_LIMIT = 25;
const ACTIONS: Array<{ action: ScoreFeedbackAction; label: string }> = [
  { action: "pass_240_plus", label: "Pass · 240+" },
  { action: "pass_220_239", label: "Pass · 220–239" },
  { action: "pass_200_219", label: "Pass · 200–219" },
  { action: "pass_under_200", label: "Pass · <200" },
  { action: "fail", label: "Fail" },
];

export async function POST(req: Request) {
  const secret = getScoreFeedbackSecret({
    SCORE_FEEDBACK_SECRET: readRuntimeEnv("SCORE_FEEDBACK_SECRET"),
    PDF_RENDERER_SECRET: readRuntimeEnv("PDF_RENDERER_SECRET"),
  });
  if (!secret) {
    return NextResponse.json({ error: "SCORE_FEEDBACK_SECRET missing." }, { status: 503 });
  }

  const provided = req.headers.get("x-score-feedback-secret") ?? "";
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let db;
  try {
    db = requireDb();
  } catch {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  const now = Date.now();
  const rows = await db
    .select()
    .from(scoreReports)
    .where(
      and(
        isNotNull(scoreReports.optedInAt),
        isNotNull(scoreReports.email),
        isNotNull(scoreReports.scoreReleaseDate),
        lte(scoreReports.scoreReleaseDate, now),
        isNull(scoreReports.reminderSentAt),
        isNull(scoreReports.submittedAt)
      )
    )
    .limit(BATCH_LIMIT);

  const siteUrl = getSiteUrlFromRuntime(req);
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    if (!row.email) continue;
    const email = await buildReminderEmail({
      siteUrl,
      secret,
      sessionId: row.stripeSessionId,
      step: row.step ?? "step3",
      predictedScore: row.predictedScore,
      ciLower: row.ciLower,
      ciUpper: row.ciUpper,
    });

    const result = await sendEmail({
      to: row.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: "hello@nbmecalc.com",
      headers: { "X-NBMEcalc-Email-Type": "score-feedback-reminder" },
    });

    if (result.delivered) {
      sent += 1;
      await db
        .update(scoreReports)
        .set({
          reminderSentAt: Date.now(),
          reminderEmailId: result.messageId ?? null,
          lastReminderError: null,
          updatedAt: Date.now(),
        })
        .where(eq(scoreReports.id, row.id));
      await db
        .update(reports)
        .set({ scoreFeedbackReminderSentAt: Date.now() })
        .where(eq(reports.stripeSessionId, row.stripeSessionId));
    } else {
      failed += 1;
      await db
        .update(scoreReports)
        .set({
          lastReminderError: result.error ?? "unknown email error",
          updatedAt: Date.now(),
        })
        .where(eq(scoreReports.id, row.id));
    }
  }

  return NextResponse.json({ ok: true, scanned: rows.length, sent, failed });
}

async function buildReminderEmail(args: {
  siteUrl: string;
  secret: string;
  sessionId: string;
  step: string;
  predictedScore: number | null;
  ciLower: number | null;
  ciUpper: number | null;
}) {
  const baseToken = await createScoreFeedbackToken(args.sessionId, args.secret);
  const exactUrl = scoreFeedbackSummaryUrl(args.siteUrl, baseToken);
  const actionLinks = await Promise.all(
    ACTIONS.map(async (item) => ({
      label: item.label,
      url: scoreFeedbackSubmitUrl(
        args.siteUrl,
        await createScoreFeedbackToken(args.sessionId, args.secret, {
          action: item.action,
        })
      ),
    }))
  );

  const stepLabel = args.step.toUpperCase().replace("STEP", "Step ");
  const predicted = args.predictedScore
    ? `${args.predictedScore}${args.ciLower && args.ciUpper ? ` (${args.ciLower}–${args.ciUpper} 95% CI)` : ""}`
    : "your predicted score";
  const subject = `Your ${stepLabel} prediction was ${args.predictedScore ?? "ready"}. How did you actually do?`;
  const buttons = actionLinks
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" style="display:inline-block;margin:6px 6px 6px 0;padding:11px 16px;border-radius:999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px">${escapeHtml(link.label)}</a>`
    )
    .join("");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#111827;max-width:640px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px">How did your real score compare?</h1>
      <p style="font-size:16px;margin:0 0 16px">Your NBMEcalc ${escapeHtml(stepLabel)} prediction was <strong>${escapeHtml(predicted)}</strong>.</p>
      <p style="font-size:16px;margin:0 0 18px">One tap is enough. Failed outcomes are especially valuable because they keep pass-risk calibration honest for future students.</p>
      <div style="margin:16px 0 22px">${buttons}</div>
      <p style="font-size:14px;color:#4b5563;margin:0 0 16px">Want to enter the exact score instead? <a href="${escapeHtml(exactUrl)}" style="color:#047857;font-weight:700">Open the exact-score form</a>.</p>
      <p style="font-size:12px;color:#6b7280;margin:24px 0 0">No login required. This link is tied only to your paid report session.</p>
    </div>`;

  const text = `Your ${stepLabel} prediction was ${predicted}. How did you actually do?\n\n${actionLinks.map((l) => `${l.label}: ${l.url}`).join("\n")}\n\nExact score form: ${exactUrl}`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
