/**
 * NBME CBSSA（Step 1 自测）等值正确率 → Step 1 就绪度判断。
 *
 * 全部依据 NBME 官方材料，不编造及格概率：
 * - 误差区间 ±4：NBME "Gauging Readiness for USMLE Step 1"（2024-10）原文，
 *   重测时 2/3 概率落在报告分数 ±4 以内。
 * - 低通过区间约 62%–68%：从 NBME 2026 年 4 月版 CBSSA 官方样例报告首页图表上
 *   按坐标量出的近似值（2023 年 LCME 队列；区间右缘在 69% 虚线之前结束）。
 *   用户可以改成自己报告上印的区间。
 * - 四种情况的判断规则：照搬上面那份 NBME 指南的 "Guidance by scenario"。
 * - 样例报告上的另一个参考点：EPC 73%（区间 69–77）→ 官方估算及格概率 99%。
 */

export const CBSSA_SOURCES = {
  guidance: {
    label: "NBME: Gauging Readiness for USMLE Step 1 (CBSSA/CBSE)",
    href: "https://www.nbme.org/wp-content/uploads/2026/04/CBSSA_CBSE_Guidance.pdf",
  },
  sample: {
    label: "NBME CBSSA sample score report (April 2026)",
    href: "https://www.nbme.org/wp-content/uploads/2026/04/Comprehensive_Basic_Science_Self-Assessment_Sample.pdf",
  },
} as const;

export const CBSSA_FORMS = [26, 27, 28, 29, 30, 31, 32, 33] as const;
export type CbssaForm = (typeof CBSSA_FORMS)[number];

export const CBSSA_QUESTIONS = 200;
export const CBSSA_REPORT_PRECISION = 4;
/** 自己数的正确率不是等值分数，区间额外放宽。 */
export const SELF_COUNTED_EXTRA = 2;
export const DEFAULT_LOW_PASS = { low: 62, high: 68 } as const;
export const SAMPLE_REFERENCE = { epc: 73, likelyLow: 69, likelyHigh: 77, passProbability: 99 } as const;

export type ReadinessState = "below" | "overlap-below" | "near" | "above";

export function classifyReadiness(
  likelyLow: number,
  likelyHigh: number,
  lowPassLow: number,
  lowPassHigh: number
): ReadinessState {
  if (likelyHigh < lowPassLow) return "below";
  if (likelyLow < lowPassLow) return "overlap-below";
  if (likelyLow > lowPassHigh) return "above";
  return "near";
}

export type CbssaEstimate = {
  percent: number;
  likelyLow: number;
  likelyHigh: number;
  state: ReadinessState;
};

export function estimateCbssaReadiness(
  percent: number,
  kind: "epc" | "raw",
  lowPass: { low: number; high: number } = DEFAULT_LOW_PASS
): CbssaEstimate {
  const p = Math.min(100, Math.max(0, percent));
  const half = CBSSA_REPORT_PRECISION + (kind === "raw" ? SELF_COUNTED_EXTRA : 0);
  const likelyLow = Math.max(0, Math.round(p - half));
  const likelyHigh = Math.min(100, Math.round(p + half));
  return {
    percent: p,
    likelyLow,
    likelyHigh,
    state: classifyReadiness(likelyLow, likelyHigh, lowPass.low, lowPass.high),
  };
}

export const READINESS_COPY: Record<ReadinessState, { title: string; body: string; tone: string }> = {
  below: {
    title: "At risk: likely range is completely below the low-pass range",
    body: "NBME's guidance calls this a risk of failing Step 1 and strongly recommends additional preparation.",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
  },
  "overlap-below": {
    title: "Borderline: likely range is partly below the low-pass range",
    body: "NBME's guidance says you may still be at risk of failing and strongly recommends additional preparation.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  near: {
    title: "Close to passing: likely range sits within or just above the low-pass range",
    body: "NBME's guidance says performance is still close to the minimum level and additional preparation may be recommended. Two or more results in this zone give more reassurance than one.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  above: {
    title: "Likely ready: likely range is completely above the low-pass range",
    body: "NBME's guidance treats this as likely ready to take Step 1, while noting it is not a guarantee.",
    tone: "border-mint-200 bg-mint-50 text-gray-950",
  },
};
