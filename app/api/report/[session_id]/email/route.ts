/**
 * POST /api/report/[session_id]/email
 *
 * Sends (or resends) the report delivery email to the buyer.
 * Rate limited: max 3 per hour per session_id.
 *
 * Used by:
 *  - Stripe webhook (first send, internal)
 *  - Checkout success page resend button (client)
 *  - Dashboard prediction detail resend button (client)
 */
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { reports, predictions } from "@/lib/db/schema";
import { sendReportEmail } from "@/lib/email-report";

export const runtime = "edge";

const STEP_LABELS: Record<string, string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

type RouteContext = { params: Promise<{ session_id: string }> };

export async function POST(
  req: Request,
  context: RouteContext
): Promise<Response> {
  const { session_id } = await context.params;
  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 }
    );
  }

  // Look up the report row.
  const reportRows = await db
    .select({
      id: reports.id,
      predictionId: reports.predictionId,
      customerEmail: reports.customerEmail,
      emailSentAt: reports.emailSentAt,
      stripeSessionId: reports.stripeSessionId,
    })
    .from(reports)
    .where(eq(reports.stripeSessionId, session_id))
    .limit(1);

  const report = reportRows[0];
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  // Determine recipient: prefer body.email override (for webhook first-send),
  // fall back to stored customerEmail.
  let recipientEmail: string | null = report.customerEmail;
  try {
    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (body && typeof body.email === "string" && body.email.includes("@")) {
      recipientEmail = body.email.trim().toLowerCase();
    }
  } catch {
    // No body is fine — use stored email.
  }

  if (!recipientEmail) {
    return NextResponse.json(
      { error: "No email address on file for this report." },
      { status: 422 }
    );
  }

  // Rate limit: simple check using emailSentAt (last send timestamp).
  // For a more robust approach we'd use a dedicated counter, but for MVP
  // we just block if last send was < 20 minutes ago (effectively ~3/hour).
  const now = Date.now();
  if (report.emailSentAt && now - report.emailSentAt < 20 * 60 * 1000) {
    return NextResponse.json(
      { error: "Email was sent recently. Please wait a few minutes." },
      { status: 429 }
    );
  }

  // Load prediction data for email content.
  const predRows = await db
    .select({
      step: predictions.step,
      pointEstimate: predictions.pointEstimate,
      ciLower: predictions.ciLower,
      ciUpper: predictions.ciUpper,
      passProbability: predictions.passProbability,
    })
    .from(predictions)
    .where(eq(predictions.id, report.predictionId))
    .limit(1);

  const pred = predRows[0];
  if (!pred) {
    return NextResponse.json(
      { error: "Prediction data not found." },
      { status: 404 }
    );
  }

  // Determine site URL.
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;

  // Send the email.
  const result = await sendReportEmail({
    sessionId: session_id,
    to: recipientEmail,
    stepLabel: STEP_LABELS[pred.step] ?? pred.step,
    pointEstimate: pred.pointEstimate,
    ciLower: pred.ciLower,
    ciUpper: pred.ciUpper,
    passProbability: pred.passProbability,
    siteUrl,
  });

  if (!result.ok) {
    console.error("[report-email] send failed", {
      sessionId: session_id,
      error: result.error,
    });
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 502 }
    );
  }

  // Update emailSentAt.
  await db
    .update(reports)
    .set({ emailSentAt: now })
    .where(eq(reports.id, report.id))
    .catch((err) => {
      console.error("[report-email] failed to update emailSentAt", err);
    });

  return NextResponse.json({ sent: true });
}
