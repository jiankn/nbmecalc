import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { ccmsaSubmissions, events, scoreReports } from "@/lib/db/schema";
import {
  ccmsaSessionId,
  ccmsaSubmissionIdFromSession,
  type CcmsaSubmissionInput,
} from "@/lib/ccmsa-submission";
import { estimateScoreReleaseDate } from "@/lib/score-feedback";

export const CCMSA_OPT_IN_SOURCE = "ccmsa_research";

export interface SavedCcmsaSubmission {
  id: string;
  /** 留了邮箱才有，对应 score_reports.stripe_session_id。 */
  scoreFeedbackSessionId: string | null;
  scoreReleaseDate: number | null;
}

/**
 * 保存一条自愿提交的 CCMSA 成绩。
 * 留了邮箱时，同时在 score_reports 建一行（没有预测分数，step 固定 step3），
 * 这样现有的出分提醒 cron 会在估算出分日之后发一封邮件，请用户回填真实 Step 3 分数。
 */
export async function saveCcmsaSubmission(args: {
  db: Db;
  input: CcmsaSubmissionInput;
  ip: string | null;
  userAgent: string | null;
  now?: number;
}): Promise<SavedCcmsaSubmission> {
  const now = args.now ?? Date.now();
  const id = crypto.randomUUID();
  const { input } = args;
  const sessionId = input.email ? ccmsaSessionId(id) : null;
  const scoreReleaseDate =
    input.email && input.examDate ? estimateScoreReleaseDate(input.examDate) : null;

  await args.db.insert(ccmsaSubmissions).values({
    id,
    form: input.form,
    assessmentScore: input.assessmentScore,
    examDate: input.examDate,
    email: input.email,
    scoreFeedbackSessionId: sessionId,
    consentedAt: now,
    ip: args.ip,
    userAgent: args.userAgent,
    createdAt: now,
  });

  if (sessionId && input.email) {
    await args.db.insert(scoreReports).values({
      id: crypto.randomUUID(),
      stripeSessionId: sessionId,
      email: input.email,
      step: "step3",
      // 研究提交没有预测分数，这几列保持 null，提醒邮件据此走 CCMSA 文案。
      predictedScore: null,
      ciLower: null,
      ciUpper: null,
      passProbability: null,
      examDate: input.examDate,
      scoreReleaseDate,
      optedInAt: now,
      optInSource: CCMSA_OPT_IN_SOURCE,
      tier: "self_reported",
      ip: args.ip,
      userAgent: args.userAgent,
      createdAt: now,
      updatedAt: now,
    });
  }

  try {
    await args.db.insert(events).values({
      id: crypto.randomUUID(),
      userId: null,
      type: "ccmsa_submitted",
      payload: JSON.stringify({
        submissionId: id,
        form: input.form,
        hasEmail: Boolean(input.email),
        hasExamDate: Boolean(input.examDate),
      }),
      ip: args.ip,
      createdAt: now,
    });
  } catch (err) {
    console.error("[ccmsa-submission] event write failed", err);
  }

  return { id, scoreFeedbackSessionId: sessionId, scoreReleaseDate };
}

/** 按 score_reports 的会话 id 取回用户当初提交的 CCMSA 表单号和成绩（邮件和回填页展示用）。 */
export async function loadCcmsaSubmissionForSession(
  db: Db,
  sessionId: string
): Promise<{ form: number; assessmentScore: number } | null> {
  const id = ccmsaSubmissionIdFromSession(sessionId);
  if (!id) return null;
  const rows = await db
    .select({
      form: ccmsaSubmissions.form,
      assessmentScore: ccmsaSubmissions.assessmentScore,
    })
    .from(ccmsaSubmissions)
    .where(eq(ccmsaSubmissions.id, id))
    .limit(1);
  return rows[0] ?? null;
}
