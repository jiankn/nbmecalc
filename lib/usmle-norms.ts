/**
 * USMLE 官方百分位（norm table）数据与查表逻辑。
 *
 * 来源：USMLE Score Interpretation Guidelines，文件内标注 "Updated 17-August-2026"。
 * 官方表只给 5 分一档的百分位；档位之间用线性插值估算，页面上要明确标注。
 * 每年 USMLE 会滚动更新这张表，更新时只需替换本文件的数据与日期。
 */

export type NormStep = "step2ck" | "step3";

export const USMLE_NORMS_SOURCE = {
  title: "USMLE Score Interpretation Guidelines",
  url: "https://www.usmle.org/sites/default/files/2022-05/USMLE%20Step%20Examination%20Score%20Interpretation%20Guidelines_5_24_22_0.pdf",
  updated: "2026-08-17",
  updatedLabel: "August 17, 2026",
} as const;

export const USMLE_SCORING_URL =
  "https://www.usmle.org/scores-transcripts/examination-results-and-scoring";

type NormInfo = {
  label: string;
  cohort: string;
  n: number;
  passingScore: number;
  passingNote: string;
  sem: number;
  means: { period: string; mean: number; sd: number }[];
};

export const NORM_INFO: Record<NormStep, NormInfo> = {
  step2ck: {
    label: "Step 2 CK",
    cohort:
      "First-takers from LCME-accredited medical schools testing July 1, 2023 – June 30, 2026",
    n: 67824,
    passingScore: 218,
    passingNote: "for exams administered on or after July 1, 2025",
    sem: 6,
    means: [
      { period: "2023-2024", mean: 249, sd: 15 },
      { period: "2024-2025", mean: 250, sd: 15 },
      { period: "2025-2026", mean: 251, sd: 15 },
    ],
  },
  step3: {
    label: "Step 3",
    cohort:
      "First-takers from LCME-accredited medical schools testing January 1, 2023 – December 31, 2025",
    n: 64576,
    passingScore: 200,
    passingNote: "for exams administered on or after January 1, 2024",
    sem: 5,
    means: [
      { period: "2023", mean: 227, sd: 15 },
      { period: "2024", mean: 227, sd: 15 },
      { period: "2025", mean: 227, sd: 15 },
    ],
  },
};

/** 官方 Table 2：[分数, Step 2 CK 百分位, Step 3 百分位]，300 到 155（"155 and below"）。 */
export const NORM_TABLE: ReadonlyArray<readonly [number, number, number]> = [
  [300, 100, 100],
  [295, 100, 100],
  [290, 100, 100],
  [285, 100, 100],
  [280, 100, 100],
  [275, 98, 100],
  [270, 93, 100],
  [265, 83, 100],
  [260, 71, 99],
  [255, 58, 97],
  [250, 44, 93],
  [245, 32, 88],
  [240, 23, 80],
  [235, 15, 69],
  [230, 9, 56],
  [225, 6, 43],
  [220, 3, 31],
  [215, 2, 20],
  [210, 1, 12],
  [205, 0, 7],
  [200, 0, 4],
  [195, 0, 2],
  [190, 0, 1],
  [185, 0, 0],
  [180, 0, 0],
  [175, 0, 0],
  [170, 0, 0],
  [165, 0, 0],
  [160, 0, 0],
  [155, 0, 0],
];

export const MIN_SCORE = 1;
export const MAX_SCORE = 300;

function columnFor(step: NormStep) {
  return step === "step2ck" ? 1 : 2;
}

export type PercentileResult = {
  /** 四舍五入后的百分位（0–100）。 */
  percentile: number;
  /** 分数正好落在官方 5 分档位上时为 true，否则为插值估算。 */
  exact: boolean;
};

/** 查某个分数的百分位：官方档位直接取值，档位之间线性插值。 */
export function lookupPercentile(step: NormStep, score: number): PercentileResult {
  const col = columnFor(step);
  const s = Math.round(score);
  if (s >= NORM_TABLE[0][0]) return { percentile: NORM_TABLE[0][col], exact: true };
  const last = NORM_TABLE[NORM_TABLE.length - 1];
  if (s <= last[0]) return { percentile: last[col], exact: s === last[0] };

  for (let i = 0; i < NORM_TABLE.length - 1; i++) {
    const hi = NORM_TABLE[i];
    const lo = NORM_TABLE[i + 1];
    if (s === hi[0]) return { percentile: hi[col], exact: true };
    if (s < hi[0] && s > lo[0]) {
      const t = (s - lo[0]) / (hi[0] - lo[0]);
      return { percentile: Math.round(lo[col] + t * (hi[col] - lo[col])), exact: false };
    }
  }
  return { percentile: last[col], exact: false };
}

/** 页面展示用：官方表里的 100 / 0 是四舍五入值，显示成 ">99" / "<1"。 */
export function formatPercentile(p: number) {
  if (p >= 100) return ">99th";
  if (p <= 0) return "<1st";
  const mod100 = p % 100;
  const mod10 = p % 10;
  const suffix =
    mod100 >= 11 && mod100 <= 13 ? "th" : mod10 === 1 ? "st" : mod10 === 2 ? "nd" : mod10 === 3 ? "rd" : "th";
  return `${p}${suffix}`;
}

export type PercentileSummary = PercentileResult & {
  score: number;
  step: NormStep;
  passes: boolean;
  pointsVsPassing: number;
  pointsVsMean: number;
  /** 分数 ± 1 个 SEM 对应的百分位区间。 */
  semLow: number;
  semHigh: number;
  semRange: [number, number];
};

export function summarizeScore(step: NormStep, score: number): PercentileSummary {
  const info = NORM_INFO[step];
  const s = Math.round(score);
  const latestMean = info.means[info.means.length - 1].mean;
  const low = Math.max(MIN_SCORE, s - info.sem);
  const high = Math.min(MAX_SCORE, s + info.sem);
  return {
    ...lookupPercentile(step, s),
    score: s,
    step,
    passes: s >= info.passingScore,
    pointsVsPassing: s - info.passingScore,
    pointsVsMean: s - latestMean,
    semLow: lookupPercentile(step, low).percentile,
    semHigh: lookupPercentile(step, high).percentile,
    semRange: [low, high],
  };
}
