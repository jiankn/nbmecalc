/**
 * USMLE 官方通过率数据，逐项抄自 https://www.usmle.org/performance-data（2026-09-29 核对原始网页）。
 * 注意口径变化：2025 年（Step 2 CK 为 2024-2025 学年）起，加拿大医学院考生从"美国"组移到"非美国"组。
 * 每年 USMLE 更新时，只替换这里的数字和年份。
 */

export const PASS_RATES_SOURCE = {
  url: "https://www.usmle.org/performance-data",
  checked: "2026-09-29",
  checkedLabel: "September 29, 2026",
} as const;

export type PassRateRow = {
  group: string;
  /** 缩进显示的子行（首考 / 重考）。 */
  sub?: boolean;
  prev: { n: number | null; pct: number | null };
  curr: { n: number | null; pct: number | null };
};

export type StepPassRates = {
  step: "Step 1" | "Step 2 CK" | "Step 3";
  prevLabel: string;
  currLabel: string;
  us: PassRateRow[];
  nonUs: PassRateRow[];
};

const r = (group: string, pn: number | null, pp: number | null, cn: number | null, cp: number | null, sub = false): PassRateRow => ({
  group,
  sub,
  prev: { n: pn, pct: pp },
  curr: { n: cn, pct: cp },
});

export const PASS_RATES: StepPassRates[] = [
  {
    step: "Step 1",
    prevLabel: "2024",
    currLabel: "2025",
    us: [
      r("MD degree", 25702, 89, 25126, 91),
      r("1st takers", 23280, 91, 23028, 93, true),
      r("Repeaters", 2422, 70, 2098, 71, true),
      r("DO degree", 4988, 86, 4744, 89),
      r("1st takers", 4873, 86, 4623, 89, true),
      r("Repeaters", 115, 86, 121, 79, true),
      r("Total", 30690, 88, 29870, 91),
    ],
    nonUs: [
      r("1st takers", 22713, 73, 22066, 75),
      r("Repeaters", 3921, 52, 3594, 54),
      r("Total", 26634, 70, 25660, 72),
    ],
  },
  {
    step: "Step 2 CK",
    prevLabel: "2023–2024",
    currLabel: "2024–2025",
    us: [
      r("MD degree", 22890, 98, 22689, 98),
      r("1st takers", 22439, 98, 22249, 98, true),
      r("Repeaters", 451, 74, 440, 70, true),
      r("DO degree", 5354, 96, 5057, 96),
      r("1st takers", 5318, 96, 5025, 96, true),
      r("Repeaters", 36, 72, 32, 69, true),
      r("Total", 28244, 97, 27746, 97),
    ],
    nonUs: [
      r("1st takers", 15064, 89, 16186, 90),
      r("Repeaters", 1573, 61, 1762, 64),
      r("Total", 16637, 87, 17948, 87),
    ],
  },
  {
    step: "Step 3",
    prevLabel: "2024",
    currLabel: "2025",
    us: [
      r("MD degree", 21988, 96, 22499, 96),
      r("1st takers", 21213, 97, 21589, 96, true),
      r("Repeaters", 775, 73, 910, 77, true),
      r("DO degree", 115, 91, 131, 97),
      r("1st takers", 110, 93, 129, 97, true),
      // 2025 年人数少于 5 人，官方不报告
      r("Repeaters", 5, 60, null, null, true),
      r("Total", 22103, 96, 22630, 96),
    ],
    nonUs: [
      r("1st takers", 12134, 89, 12480, 88),
      r("Repeaters", 1835, 64, 1824, 63),
      r("Total", 13969, 85, 14304, 85),
    ],
  },
];

export function getPassRates(step: StepPassRates["step"]) {
  return PASS_RATES.find((s) => s.step === step)!;
}

/** 取某一步某组首考的当年通过率，文案里用。 */
export function firstTakerRate(step: StepPassRates["step"], group: "us-md" | "non-us") {
  const s = getPassRates(step);
  if (group === "non-us") return s.nonUs[0].curr.pct!;
  return s.us[1].curr.pct!;
}
