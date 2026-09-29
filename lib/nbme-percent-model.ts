/**
 * NBME CCSSA 正确率 → Step 2 CK 三位数分数的估算模型。
 *
 * NBME 没有公开"正确率 → 分数"的换算表。本模型只用 NBME 官方 2026 版
 * CCSSA 样例成绩报告里能直接读到的两个锚点做线性连接：
 *
 *   1. 参照组（LCME 首考生）：报告标注的 Step 2 CK 平均分 249（2023-07 至 2024-06 队列），
 *      各学科 "Comparison Group Average EPC" 为 Medicine 76%、Surgery 76%、Pediatrics 78%、
 *      OB/GYN 78%、Psychiatry 81%。按报告给出的题量占比中点（55%、27.5%、22.5%、15%、12.5%）
 *      加权 ≈ 77.0%。
 *   2. 样例考生 "Student A"：Total CCSSA Score 201，各学科 EPC 为 55%、58%、59%、61%、66%，
 *      同样加权 ≈ 58.0%。
 *
 * 因此：分数 ≈ 201 + (EPC − 58) × 48 / 19（约每 1% 对应 2.5 分）。
 *
 * 局限（页面上必须如实展示）：
 * - 只有两个锚点，线性关系是近似；58%–77% 之外属于外推，区间要放宽。
 * - EPC 已按表单难度做等值，所以各表单可以共用一条曲线；自己数的原始正确率
 *   可能比 EPC 略高或略低（NBME 原话），区间再放宽。
 * - 这是 NBMEcalc 的独立估算，不是 NBME 官方换算，也未经外部验证。
 */

export const NBME_PERCENT_MODEL_SOURCE = {
  title: "NBME Comprehensive Clinical Science Self-Assessment sample score report",
  url: "https://www.nbme.org/wp-content/uploads/2026/04/Comprehensive_Clinical_Science_Self-Assessment_Sample.pdf",
  label: "April 2026 sample report",
} as const;

/** 两个官方锚点：[EPC 百分比, Step 2 CK 刻度分数]。 */
export const EPC_ANCHORS = {
  low: { epc: 58, score: 201 },
  mean: { epc: 77, score: 249 },
} as const;

export const POINTS_PER_PERCENT =
  (EPC_ANCHORS.mean.score - EPC_ANCHORS.low.score) / (EPC_ANCHORS.mean.epc - EPC_ANCHORS.low.epc);

/** 报告写明 CCSSA 分数重测时 2/3 概率落在 ±8 分内。 */
export const REPORT_SCORE_PRECISION = 8;

export const CCSSA_QUESTIONS = 200;

export const CCSSA_FORMS = [9, 10, 11, 12, 13, 14, 15, 16] as const;
export type CcssaForm = (typeof CCSSA_FORMS)[number];

export type PercentInputKind = "epc" | "raw";

export type PercentEstimate = {
  percent: number;
  midpoint: number;
  low: number;
  high: number;
  /** 输入落在两个锚点之外，属于外推。 */
  extrapolated: boolean;
};

const clampScore = (s: number) => Math.min(300, Math.max(1, Math.round(s)));

export function estimateStep2FromPercent(percent: number, kind: PercentInputKind): PercentEstimate {
  const p = Math.min(100, Math.max(0, percent));
  const raw = EPC_ANCHORS.low.score + (p - EPC_ANCHORS.low.epc) * POINTS_PER_PERCENT;
  const midpoint = clampScore(raw);

  // 区间 = 报告本身的精度 ±8 + 模型误差余量；外推和原始正确率各自再放宽。
  const outside =
    p < EPC_ANCHORS.low.epc
      ? EPC_ANCHORS.low.epc - p
      : p > EPC_ANCHORS.mean.epc
        ? p - EPC_ANCHORS.mean.epc
        : 0;
  let half = REPORT_SCORE_PRECISION + 4 + Math.min(8, outside * 0.5);
  if (kind === "raw") half += 4;
  half = Math.round(half);

  return {
    percent: p,
    midpoint,
    low: clampScore(raw - half),
    high: clampScore(raw + half),
    extrapolated: outside > 0,
  };
}

export function percentFromCorrect(correct: number, total = CCSSA_QUESTIONS) {
  return (Math.min(total, Math.max(0, correct)) / total) * 100;
}

/** 换算对照表的行：50%–90%，每 2 个百分点一行。 */
export const CONVERSION_CHART_PERCENTS = Array.from({ length: 21 }, (_, i) => 50 + i * 2);
