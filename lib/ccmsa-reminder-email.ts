import {
  createScoreFeedbackToken,
  scoreFeedbackSummaryUrl,
} from "@/lib/score-feedback";

/**
 * CCMSA 研究提交的出分提醒邮件：只请用户回填真实 Step 3 三位数分数，
 * 不出现任何换算或预测数字。回填链接复用 /feedback/[token] 的精确分数表单。
 */
export async function buildCcmsaReminderEmail(args: {
  siteUrl: string;
  secret: string;
  sessionId: string;
  ccmsa: { form: number; assessmentScore: number } | null;
}): Promise<{ subject: string; html: string; text: string }> {
  const token = await createScoreFeedbackToken(args.sessionId, args.secret);
  const formUrl = scoreFeedbackSummaryUrl(args.siteUrl, token);
  const submitted = args.ccmsa
    ? `a CCMSA Form ${args.ccmsa.form} Assessment Score of ${args.ccmsa.assessmentScore}`
    : "your CCMSA Assessment Score";

  const subject = "Your Step 3 score should be out. Would you share it?";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#111827;max-width:640px;margin:0 auto;padding:24px">
      <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px">What was your real Step 3 score?</h1>
      <p style="font-size:16px;margin:0 0 16px">You shared ${escapeHtml(submitted)} with NBMEcalc's CCMSA research dataset and asked for one reminder after your Step 3 result.</p>
      <p style="font-size:16px;margin:0 0 18px">There is no CCMSA-to-Step 3 conversion today. Adding your real three-digit Step 3 score turns your CCMSA result into a paired data point, and enough paired results are what it would take to test whether a conversion is possible at all. Failing results matter just as much as high scores.</p>
      <div style="margin:16px 0 22px"><a href="${escapeHtml(formUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px">Add my Step 3 score</a></div>
      <p style="font-size:14px;color:#4b5563;margin:0 0 16px">Only know pass/fail? You can share that on the same form.</p>
      <p style="font-size:12px;color:#6b7280;margin:24px 0 0">This is the only reminder we send for this submission. No login required. Results are used only in aggregate. To delete your submission, reply to this email or write to privacy@nbmecalc.com.</p>
    </div>`;

  const text = [
    "What was your real Step 3 score?",
    "",
    `You shared ${submitted} with NBMEcalc's CCMSA research dataset. There is no CCMSA-to-Step 3 conversion today. Adding your real three-digit Step 3 score turns your CCMSA result into a paired data point.`,
    "",
    `Add your Step 3 score: ${formUrl}`,
    "",
    "This is the only reminder we send for this submission. To delete your submission, reply to this email or write to privacy@nbmecalc.com.",
  ].join("\n");

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
