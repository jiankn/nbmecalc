/**
 * POST /api/report/recover
 *
 * Anonymous recover: given an email address, re-sends all purchased report
 * links to that email. Rate limited to prevent abuse.
 *
 * Body: { email: string }
 * Response: { sent: true } — always success response (no email enumeration).
 */
import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { reports, predictions } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

export const runtime = "edge";

// Simple in-memory rate limit: 2 requests per email per 10 minutes.
const rateLimitMap = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(email);
  if (last && now - last < 10 * 60 * 1000) return true;
  rateLimitMap.set(email, now);
  return false;
}

export async function POST(req: Request): Promise<Response> {
  let email: string | null = null;
  try {
    const body = (await req.json()) as { email?: string };
    if (body.email && typeof body.email === "string" && body.email.includes("@")) {
      email = body.email.trim().toLowerCase();
    }
  } catch {
    // malformed body
  }

  // Always return success to prevent email enumeration.
  const okResponse = NextResponse.json({ sent: true });

  if (!email) return okResponse;
  if (isRateLimited(email)) return okResponse;

  const db = getDb();
  if (!db) return okResponse;

  // Find all reports for this email.
  const rows = await db
    .select({
      stripeSessionId: reports.stripeSessionId,
      predictionId: reports.predictionId,
    })
    .from(reports)
    .where(eq(reports.customerEmail, email))
    .limit(10);

  if (rows.length === 0) return okResponse;

  // Build a simple list of report links.
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://nbmecalc.com";

  // Load prediction labels
  const predIds = rows.map((r) => r.predictionId);
  const predRows = await db
    .select({ id: predictions.id, step: predictions.step })
    .from(predictions)
    .where(inArray(predictions.id, predIds))
    .limit(10);

  // For simplicity, grab all predictions one query per prediction (max 10).
  // Actually let's just map what we have.
  const STEP_LABELS: Record<string, string> = {
    step1: "Step 1",
    step2: "Step 2 CK",
    step3: "Step 3",
  };

  // Build links HTML
  const linksHtml = rows
    .map((r) => {
      const url = `${siteUrl}/report/${encodeURIComponent(r.stripeSessionId)}`;
      const pred = predRows.find((p) => p.id === r.predictionId);
      const label = pred ? STEP_LABELS[pred.step] ?? pred.step : "Report";
      return `<li style="margin-bottom:8px;"><a href="${url}" style="color:#047857;font-weight:600;">${label} Report</a></li>`;
    })
    .join("");

  const linksText = rows
    .map((r) => {
      const url = `${siteUrl}/report/${encodeURIComponent(r.stripeSessionId)}`;
      return `• ${url}`;
    })
    .join("\n");

  const logoUrl = `${siteUrl}/brand/oauth-logo.png`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
        <tr><td style="padding:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
            <tr>
              <td style="vertical-align:middle;padding:0 12px 0 0;">
                <img src="${logoUrl}" width="44" height="44" alt="NBMEcalc" style="display:block;border-radius:12px;"/>
              </td>
              <td style="vertical-align:middle;font-size:24px;font-weight:800;color:#0f172a;">NBMEcalc</td>
            </tr>
          </table>
          <h1 style="margin:0 0 12px;font-size:20px;font-weight:800;">Your Report Links</h1>
          <p style="margin:0 0 20px;color:#374151;line-height:1.6;">
            Here are the reports associated with <strong>${email}</strong>:
          </p>
          <ul style="padding-left:20px;margin:0 0 24px;">${linksHtml}</ul>
          <p style="margin:0;color:#6b7280;font-size:13px;">Bookmark these links for future access. If you didn\u2019t request this, you can ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="margin:0;color:#9ca3af;font-size:12px;">\u00a9 2026 nbmecalc.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    "Your NBMEcalc Report Links",
    "",
    `Reports associated with ${email}:`,
    "",
    linksText,
    "",
    "Bookmark these links for future access.",
    "If you didn't request this, you can ignore this email.",
    "",
    "— NBMEcalc",
  ].join("\n");

  await sendEmail({
    to: email,
    subject: "Your NBMEcalc Report Links",
    html,
    text,
  }).catch((err) => {
    console.error("[report-recover] email send failed", err);
  });

  return okResponse;
}
