import { NBME_FORM_NUMBERS_BY_STEP } from "@/lib/data";
import { parseExamDate } from "@/lib/score-feedback";

/**
 * 自愿提交 CCMSA 成绩（研究数据收集）的纯逻辑部分：入参校验和会话 id 约定。
 *
 * 这里只做收集，不产生任何换算结果。NBME 官方说明 CCMSA 不用于预测 Step 3，
 * 只有攒够“CCMSA 成绩 + 真实 Step 3 分数”的配对样本后才可能评估换算。
 */

export const CCMSA_FORMS = NBME_FORM_NUMBERS_BY_STEP.step3;
export const CCMSA_SCORE_MIN = 10;
export const CCMSA_SCORE_MAX = 800;

/** score_reports.stripe_session_id 的前缀，用来区分 CCMSA 研究提交和预测记录。 */
export const CCMSA_SESSION_PREFIX = "ccmsa_";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CcmsaSubmissionInput {
  form: number;
  assessmentScore: number;
  /** unix ms；没填时为 null。 */
  examDate: number | null;
  /** 已转小写；没填时为 null。 */
  email: string | null;
}

export function ccmsaSessionId(submissionId: string): string {
  return `${CCMSA_SESSION_PREFIX}${submissionId}`;
}

export function isCcmsaSessionId(sessionId: string | null | undefined): boolean {
  return typeof sessionId === "string" && sessionId.startsWith(CCMSA_SESSION_PREFIX);
}

export function ccmsaSubmissionIdFromSession(sessionId: string): string | null {
  return isCcmsaSessionId(sessionId) ? sessionId.slice(CCMSA_SESSION_PREFIX.length) : null;
}

/**
 * 校验前端提交的表单。规则：
 * - 表单号必须是当前 CCMSA 表单之一；
 * - Assessment Score 是 10–800 的整数；
 * - 必须勾选同意；
 * - 邮箱可选，但留了邮箱就必须填考试日期（用来估算出分日、安排唯一一封提醒邮件）；
 * - 考试日期限制在前后一年内。
 */
export function parseCcmsaSubmission(
  raw: unknown,
  now = Date.now()
): CcmsaSubmissionInput | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "Body must be a JSON object." };
  const value = raw as Record<string, unknown>;

  const form = typeof value.form === "string" ? Number(value.form) : value.form;
  if (typeof form !== "number" || !CCMSA_FORMS.includes(form)) {
    return { error: `Form must be one of ${CCMSA_FORMS.join(", ")}.` };
  }

  const score =
    typeof value.assessmentScore === "string" && value.assessmentScore.trim() !== ""
      ? Number(value.assessmentScore)
      : value.assessmentScore;
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < CCMSA_SCORE_MIN ||
    score > CCMSA_SCORE_MAX
  ) {
    return {
      error: `Assessment Score must be a whole number from ${CCMSA_SCORE_MIN} to ${CCMSA_SCORE_MAX}.`,
    };
  }

  if (value.consent !== true) {
    return { error: "Please confirm you agree to share these scores for research." };
  }

  let email: string | null = null;
  if (typeof value.email === "string" && value.email.trim() !== "") {
    const trimmed = value.email.trim().toLowerCase();
    if (trimmed.length > 254 || !EMAIL_PATTERN.test(trimmed)) {
      return { error: "Please enter a valid email, or leave it blank." };
    }
    email = trimmed;
  } else if (value.email !== undefined && value.email !== null && typeof value.email !== "string") {
    return { error: "Please enter a valid email, or leave it blank." };
  }

  let examDate: number | null = null;
  if (typeof value.examDate === "string" && value.examDate.trim() !== "") {
    examDate = parseExamDate(value.examDate.trim());
    if (!examDate) return { error: "Invalid exam date." };
    if (examDate < now - YEAR_MS || examDate > now + YEAR_MS) {
      return { error: "Exam date must be within one year." };
    }
  }

  if (email && !examDate) {
    return { error: "Add your Step 3 exam date so we know when to send the reminder." };
  }

  return { form, assessmentScore: score, examDate, email };
}
