/**
 * USMLE 出分时间推算。
 *
 * 官方口径（2026-10-03 核对原网页）：
 * - examination-results-and-scoring：成绩"typically available within four weeks of your test date"，
 *   选考期时"allow at least eight weeks"。
 * - 2024-03-06 公告：不再设置专门的出分延迟期（dedicated score delay periods）。
 * 官方没有公布固定的出分星期几，所以这里只给"通常最晚"和"官方建议预留"两个日期，不预测具体某天。
 * 日期一律按 UTC 的纯日期计算，避免时区把日期算偏一天。
 */

export const SCORE_RELEASE_SOURCES = {
  scoring: {
    title: "USMLE examination results and scoring",
    url: "https://www.usmle.org/scores-transcripts/examination-results-and-scoring",
  },
  timeline: {
    title: "USMLE score reporting timeline update (March 6, 2024)",
    url: "https://www.usmle.org/usmle-score-reporting-timeline-update",
  },
  checkedLabel: "October 3, 2026",
} as const;

/** 官方"通常"出分时间：4 周内。 */
export const TYPICAL_DAYS = 28;
/** 官方建议预留：至少 8 周。 */
export const ALLOW_DAYS = 56;

export type ReleaseExam = "step1" | "step2ck" | "step3";

export const RELEASE_EXAMS: { value: ReleaseExam; label: string }[] = [
  { value: "step1", label: "Step 1" },
  { value: "step2ck", label: "Step 2 CK" },
  { value: "step3", label: "Step 3" },
];

const DAY_MS = 86_400_000;

/** 解析 <input type="date"> 的 "YYYY-MM-DD"，返回 UTC 零点；格式不对返回 null。 */
export function parseDateInput(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) || d.getUTCDate() !== Number(m[3]) ? null : d;
}

export function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** 今天（按用户本地日历日）对应的 UTC 零点。 */
export function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export type ReleaseStatus = "not-taken" | "waiting" | "late-typical" | "past-allowance";

export type ReleaseEstimate = {
  /** 计分的起点：Step 3 是第 2 天考完的日期。 */
  completed: Date;
  typicalBy: Date;
  allowUntil: Date;
  /** 考完到今天过了几天（未考时为负数）。 */
  elapsed: number;
  status: ReleaseStatus;
};

export function estimateRelease(completed: Date, today: Date = todayUtc()): ReleaseEstimate {
  const elapsed = daysBetween(completed, today);
  const status: ReleaseStatus =
    elapsed < 0
      ? "not-taken"
      : elapsed <= TYPICAL_DAYS
        ? "waiting"
        : elapsed <= ALLOW_DAYS
          ? "late-typical"
          : "past-allowance";
  return {
    completed,
    typicalBy: addDays(completed, TYPICAL_DAYS),
    allowUntil: addDays(completed, ALLOW_DAYS),
    elapsed,
    status,
  };
}

export type DeadlinePlan = {
  deadline: Date;
  /** 按官方建议预留 8 周：最晚这天考完。 */
  safeTestBy: Date;
  /** 只按"通常 4 周"倒推：最晚这天考完，有风险。 */
  typicalTestBy: Date;
};

/** 反推：要在某个截止日前拿到成绩，最晚哪天考完。 */
export function planForDeadline(deadline: Date): DeadlinePlan {
  return {
    deadline,
    safeTestBy: addDays(deadline, -ALLOW_DAYS),
    typicalTestBy: addDays(deadline, -TYPICAL_DAYS),
  };
}
