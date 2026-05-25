/**
 * Report delivery email — sent after purchase and on resend.
 *
 * Contains:
 *  - Branded header (logo + wordmark)
 *  - Quick prediction summary (score, CI, pass %)
 *  - "View Report" CTA button
 *  - "Download PDF" secondary link
 *  - Footer with support info
 */
import { sendEmail, type SendEmailResult } from "@/lib/email";

export interface ReportEmailData {
  /** Stripe checkout session id — used to build report URL */
  sessionId: string;
  /** Recipient email */
  to: string;
  /** e.g. "Step 1", "Step 2 CK", "Step 3" */
  stepLabel: string;
  /** Predicted score */
  pointEstimate: number;
  /** 95% CI bounds */
  ciLower: number;
  ciUpper: number;
  /** Pass probability 0–1 */
  passProbability: number;
  /** Site origin, e.g. https://nbmecalc.com */
  siteUrl: string;
}

export function renderReportEmail(data: ReportEmailData): {
  html: string;
  text: string;
  subject: string;
} {
  const {
    sessionId,
    stepLabel,
    pointEstimate,
    ciLower,
    ciUpper,
    passProbability,
    siteUrl,
  } = data;

  const passPercent = Math.round(passProbability * 100);
  const reportUrl = `${siteUrl}/report/${encodeURIComponent(sessionId)}`;
  const pdfUrl = `${siteUrl}/api/report/${encodeURIComponent(sessionId)}/pdf`;
  const logoUrl = `${siteUrl}/brand/oauth-logo.png`;

  const subject = `Your ${stepLabel} Report Is Ready — ${pointEstimate} (${ciLower}–${ciUpper})`;

  const text = [
    `Your ${stepLabel} Report Is Ready`,
    "",
    `Predicted Score: ${pointEstimate} (95% CI: ${ciLower}–${ciUpper})`,
    `Pass Probability: ${passPercent}%`,
    "",
    `View your full report: ${reportUrl}`,
    `Download PDF: ${pdfUrl}`,
    "",
    "Bookmark the report URL — you can return to it anytime.",
    "",
    "If you didn't make this purchase, please contact hello@nbmecalc.com.",
    "",
    "— The NBMEcalc team",
    "https://nbmecalc.com",
  ].join("\n");

  const html = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your ${stepLabel} score prediction: ${pointEstimate} (${ciLower}\u2013${ciUpper}), ${passPercent}% pass probability.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
        <tr><td style="padding:32px;">
          <!-- Brand header -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
            <tr>
              <td style="vertical-align:middle;padding:0 12px 0 0;">
                <img src="${logoUrl}" width="44" height="44" alt="NBMEcalc" style="display:block;border:0;outline:none;text-decoration:none;border-radius:12px;"/>
              </td>
              <td style="vertical-align:middle;font-size:24px;line-height:1;font-weight:800;letter-spacing:-0.4px;color:#0f172a;">
                NBMEcalc
              </td>
            </tr>
          </table>

          <h1 style="margin:0 0 8px;font-size:22px;line-height:1.25;font-weight:800;color:#111827;">Your ${stepLabel} Report Is Ready</h1>
          <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
            Thank you for your purchase. Here\u2019s your prediction summary and links to access your full report.
          </p>

          <!-- Score summary card -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;border:1px solid #d1fae5;border-radius:12px;background:#ecfdf5;">
            <tr>
              <td style="padding:20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="text-align:center;padding:0 8px;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#047857;margin-bottom:4px;">Predicted</div>
                      <div style="font-size:32px;font-weight:900;color:#111827;">${pointEstimate}</div>
                    </td>
                    <td style="text-align:center;padding:0 8px;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#047857;margin-bottom:4px;">95% CI</div>
                      <div style="font-size:20px;font-weight:800;color:#111827;">${ciLower}\u2013${ciUpper}</div>
                    </td>
                    <td style="text-align:center;padding:0 8px;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#047857;margin-bottom:4px;">Pass</div>
                      <div style="font-size:32px;font-weight:900;color:#111827;">${passPercent}%</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA buttons -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px;">
            <tr>
              <td style="padding-right:12px;">
                <a href="${reportUrl}" style="display:inline-block;background:#34D399;color:#000;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:9999px;font-size:15px;">View Full Report</a>
              </td>
              <td>
                <a href="${pdfUrl}" style="display:inline-block;background:#fff;color:#111827;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:9999px;font-size:15px;border:1px solid #d1d5db;">Download PDF</a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 16px;color:#6b7280;font-size:13px;line-height:1.6;">
            <strong>Bookmark this link</strong> \u2014 you can return to your report anytime:<br/>
            <a href="${reportUrl}" style="color:#047857;word-break:break-all;">${reportUrl}</a>
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>

          <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.5;">
            <strong>Your report includes:</strong> full prediction breakdown, sit-or-postpone recommendation, 3 highest-leverage study moves, anti-patterns to avoid, and cohort comparison.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.5;">
            If you didn\u2019t make this purchase, contact <a href="mailto:hello@nbmecalc.com" style="color:#047857;">hello@nbmecalc.com</a>. This email was sent by NBMEcalc.
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;">\u00a9 2026 nbmecalc.com</p>
    </td></tr>
  </table>
</body></html>`;

  return { html, text, subject };
}

/**
 * Send the report delivery email. Returns the result from the transport.
 */
export async function sendReportEmail(
  data: ReportEmailData
): Promise<SendEmailResult> {
  const { html, text, subject } = renderReportEmail(data);
  return sendEmail({ to: data.to, subject, html, text });
}
