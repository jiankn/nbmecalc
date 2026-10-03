/**
 * NRMP Charting Outcomes 2026（U.S. MD Seniors）Table 5：按首选专科与匹配结果统计的 Step 2 CK 分数。
 *
 * 来源 PDF 第 17–19 页，2026-10-03 逐行核对。PDF 注明"Reproduction is prohibited without the written
 * permission of the NRMP"，所以这里只摘录少量事实性数字（人数、四分位、中位数），不照搬整张表；
 * 页面上必须注明出处并链接原文。人数 < 5 的组 NRMP 不公布（null）。
 * 口径：只含同意数据用于研究的美国 MD 应届生，不含 DO 和 IMG。下一版发布时整体替换本文件。
 */

export const NRMP_SOURCE = {
  title: "NRMP Charting Outcomes: Characteristics of U.S. MD Seniors Who Matched to Their Preferred Specialty, 2026 Main Residency Match",
  shortTitle: "NRMP Charting Outcomes 2026 (U.S. MD seniors), Table 5",
  pageUrl:
    "https://www.nrmp.org/match-data/2026/07/charting-outcomes-characteristics-of-u-s-md-seniors-who-matched-to-their-preferred-specialty-2026-main-residency-match/",
  checkedLabel: "October 3, 2026",
} as const;

export type SpecialtyStep2 = {
  slug: string;
  name: string;
  matched: { n: number; q1: number; median: number; q3: number };
  /** 首选该专科但没匹配上的人；人数 < 5 时为 null。 */
  notMatched: { n: number; median: number } | null;
};

const s = (
  slug: string,
  name: string,
  n: number,
  q1: number,
  median: number,
  q3: number,
  nmN: number | null,
  nmMedian: number | null
): SpecialtyStep2 => ({
  slug,
  name,
  matched: { n, q1, median, q3 },
  notMatched: nmN !== null && nmMedian !== null ? { n: nmN, median: nmMedian } : null,
});

// 只收录匹配人数 ≥ 40 的专科（Public Health 只有 1 人，不收）。
export const SPECIALTY_STEP2: SpecialtyStep2[] = [
  s("anesthesiology", "Anesthesiology", 1219, 247, 255, 263, 167, 239),
  s("child-neurology", "Child Neurology", 111, 240, 251, 260, null, null),
  s("dermatology", "Dermatology", 356, 251, 258, 266, 181, 252),
  s("emergency-medicine", "Emergency Medicine", 1176, 240, 249, 258, 41, 229),
  s("family-medicine", "Family Medicine", 1148, 233, 244, 254, 11, 230),
  s("internal-medicine", "Internal Medicine", 3236, 243, 254, 262, 84, 233),
  s("med-peds", "Internal Medicine/Pediatrics", 264, 246, 255, 262, 29, 249),
  s("interventional-radiology", "Interventional Radiology (Integrated)", 128, 246, 255, 264, 15, 252),
  s("neurosurgery", "Neurological Surgery", 192, 249, 256, 264, 72, 244),
  s("neurology", "Neurology", 571, 242, 252, 261, 36, 232),
  s("ob-gyn", "Obstetrics and Gynecology", 942, 244, 253, 261, 135, 245),
  s("orthopaedic-surgery", "Orthopaedic Surgery", 628, 250, 259, 266, 245, 251),
  s("otolaryngology", "Otolaryngology (ENT)", 289, 250, 261, 266, 74, 249),
  s("pathology", "Pathology (Anatomic and Clinical)", 210, 240, 247, 258, 16, 237),
  s("pediatrics", "Pediatrics", 1127, 239, 249, 259, 6, 243),
  s("pmr", "Physical Medicine and Rehabilitation", 235, 241, 251, 259, 45, 237),
  s("plastic-surgery", "Plastic Surgery (Integrated)", 159, 250, 259, 265, 82, 251),
  s("psychiatry", "Psychiatry", 1075, 236, 247, 256, 74, 234),
  s("radiation-oncology", "Radiation Oncology", 108, 238, 251, 261, null, null),
  s("diagnostic-radiology", "Radiology (Diagnostic)", 629, 249, 257, 265, 37, 242),
  s("general-surgery", "Surgery (General)", 882, 245, 255, 262, 202, 238),
  s("thoracic-surgery", "Thoracic Surgery (Integrated)", 40, 256, 260, 265, 22, 257),
  s("vascular-surgery", "Vascular Surgery (Integrated)", 64, 248, 256, 264, 8, 235),
];

/** 按匹配者中位数从高到低。 */
export function specialtiesByMedian(): SpecialtyStep2[] {
  return [...SPECIALTY_STEP2].sort((a, b) => b.matched.median - a.matched.median || a.name.localeCompare(b.name));
}

export type SpecialtyPosition = "below-q1" | "q1-to-median" | "median-to-q3" | "above-q3";

/** 某个分数落在该专科匹配者分布的哪一段（四分位）。 */
export function positionInSpecialty(score: number, sp: SpecialtyStep2): SpecialtyPosition {
  const { q1, median, q3 } = sp.matched;
  if (score < q1) return "below-q1";
  if (score < median) return "q1-to-median";
  if (score <= q3) return "median-to-q3";
  return "above-q3";
}

export const POSITION_LABEL: Record<SpecialtyPosition, string> = {
  "below-q1": "Below the middle half",
  "q1-to-median": "Lower middle",
  "median-to-q3": "Upper middle",
  "above-q3": "Top quarter",
};

/** 分数达到或超过匹配者中位数的专科数。 */
export function countAtOrAboveMedian(score: number): number {
  return SPECIALTY_STEP2.filter((sp) => score >= sp.matched.median).length;
}
