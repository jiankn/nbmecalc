/**
 * POST /api/ccmsa-submissions
 *
 * /step-3-predictor 的 CCMSA 小节下方“自愿提交 CCMSA 成绩”表单的落库入口。
 * 只收集研究数据，不返回任何换算结果。留了邮箱的提交会进入出分提醒流程，
 * 之后请用户回填真实 Step 3 三位数分数。
 */
import { NextResponse } from "next/server";
import { requireDb } from "@/lib/db/client";
import { parseCcmsaSubmission } from "@/lib/ccmsa-submission";
import { saveCcmsaSubmission } from "@/lib/ccmsa-submission-store";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "edge";

const SUBMIT_LIMIT_PER_HOUR = 10;

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
  const parsed = parseCcmsaSubmission(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  let db;
  try {
    db = requireDb();
  } catch {
    return NextResponse.json(
      { error: "Could not save right now. Please try again in a minute." },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const verdict = await checkRateLimit(db, {
    bucket: "ccmsa-submission",
    identifier: `ip:${ip}`,
    limit: SUBMIT_LIMIT_PER_HOUR,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  try {
    const saved = await saveCcmsaSubmission({
      db,
      input: parsed,
      ip,
      userAgent: req.headers.get("user-agent"),
    });
    return NextResponse.json(
      { ok: true, reminderScheduled: Boolean(saved.scoreFeedbackSessionId) },
      { headers: rateLimitHeaders(verdict) }
    );
  } catch (err) {
    console.error("[/api/ccmsa-submissions] D1 persist failed", err);
    return NextResponse.json(
      { error: "Could not save right now. Please try again in a minute." },
      { status: 500 }
    );
  }
}
