/**
 * Step 1 Free 120 正确率 → 就绪度参考。
 *
 * 依据与边界（2026-10-03 核对）：
 * - USMLE 官方样题页：Step 1 样题"More than 100"道，提供 PDF 与在线版；没有给分数，也没说能预测成绩。
 * - Free 120 只显示原始正确率，不是等值分数（EPC），NBME 也没有公布 Free 120 的及格线或通过概率。
 * - 所以这里不输出"通过概率"。只做两件可以说清依据的事：
 *   1. 按题数算统计误差：正确率的标准误 = sqrt(p(1-p)/n)，取 ±1 个标准误作为"可能范围"，
 *      与 NBME 对 CBSSA 用的"重测 2/3 概率落在 ±4 内"是同一种口径。
 *   2. 拿这个范围去对照 NBME CBSSA 官方样例报告上的低通过区间（约 62–68%，见 cbssa-readiness.ts），
 *      并在页面上写明：两者不是同一把尺子，只能当粗略参照。
 */

import { DEFAULT_LOW_PASS, classifyReadiness, type ReadinessState } from "@/lib/cbssa-readiness";

export const FREE120_DEFAULT_ITEMS = 120;

export const FREE120_SOURCES = {
  sample: {
    label: "USMLE Step 1 sample test questions",
    href: "https://www.usmle.org/exam-resources/step-1-materials/step-1-sample-test-questions",
  },
} as const;

/** 正确率的 ±1 标准误（百分点），题数越少越宽。 */
export function samplingHalfWidth(percent: number, items: number): number {
  const p = Math.min(1, Math.max(0, percent / 100));
  if (items <= 0) return 0;
  return Math.sqrt((p * (1 - p)) / items) * 100;
}

export type Free120Estimate = {
  percent: number;
  correct: number;
  items: number;
  halfWidth: number;
  likelyLow: number;
  likelyHigh: number;
  state: ReadinessState;
};

export function estimateFree120Step1(
  correct: number,
  items: number = FREE120_DEFAULT_ITEMS,
  lowPass: { low: number; high: number } = DEFAULT_LOW_PASS
): Free120Estimate {
  const n = Math.max(1, Math.round(items));
  const c = Math.min(n, Math.max(0, Math.round(correct)));
  const percent = (c / n) * 100;
  const halfWidth = samplingHalfWidth(percent, n);
  const likelyLow = Math.max(0, Math.round(percent - halfWidth));
  const likelyHigh = Math.min(100, Math.round(percent + halfWidth));
  return {
    percent: Math.round(percent * 10) / 10,
    correct: c,
    items: n,
    halfWidth: Math.round(halfWidth * 10) / 10,
    likelyLow,
    likelyHigh,
    state: classifyReadiness(likelyLow, likelyHigh, lowPass.low, lowPass.high),
  };
}

/** 页面文案：措辞上始终说"对照 CBSSA 低通过区间"，不说"你会过/不会过"。 */
export const FREE120_STATE_COPY: Record<ReadinessState, { title: string; body: string; tone: string }> = {
  below: {
    title: "Below the reference band",
    body: "Your likely range sits entirely below the low-pass range NBME prints on CBSSA reports. Treat this as a warning sign and confirm with a full NBME CBSSA before you keep your test date.",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
  },
  "overlap-below": {
    title: "Borderline: part of your range is below the reference band",
    body: "Some of your likely range falls below the CBSSA low-pass range. One Free 120 cannot settle this; take a CBSSA and use its official pass probability.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  near: {
    title: "Close: your range sits in or just above the reference band",
    body: "You are near the level NBME describes as a low pass on CBSSA reports. A recent CBSSA result in the same zone or higher gives far more reassurance than this one sample test.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  above: {
    title: "Above the reference band",
    body: "Your whole likely range is above the CBSSA low-pass range. That is a good sign, but Free 120 is not a scored exam, so pair it with a recent CBSSA before test day.",
    tone: "border-mint-200 bg-mint-50 text-gray-950",
  },
};
