import { describe, expect, it } from "vitest";
import {
  NORM_TABLE,
  formatPercentile,
  lookupPercentile,
  summarizeScore,
} from "@/lib/usmle-norms";

describe("lookupPercentile", () => {
  it("returns the official values at 5-point rows", () => {
    // 官方文件里的示例：Step 2 CK 240 = 第 23 百分位
    expect(lookupPercentile("step2ck", 240)).toEqual({ percentile: 23, exact: true });
    expect(lookupPercentile("step2ck", 250)).toEqual({ percentile: 44, exact: true });
    expect(lookupPercentile("step3", 230)).toEqual({ percentile: 56, exact: true });
  });

  it("interpolates between official rows", () => {
    // 250 → 44，255 → 58：252 ≈ 44 + 0.4 × 14 = 49.6 → 50
    expect(lookupPercentile("step2ck", 252)).toEqual({ percentile: 50, exact: false });
  });

  it("clamps above the top and below the bottom row", () => {
    expect(lookupPercentile("step2ck", 300).percentile).toBe(100);
    expect(lookupPercentile("step2ck", 120).percentile).toBe(0);
    expect(lookupPercentile("step3", 150).percentile).toBe(0);
  });

  it("is monotonic across the full score range", () => {
    for (const step of ["step2ck", "step3"] as const) {
      let prev = -1;
      for (let s = 1; s <= 300; s++) {
        const p = lookupPercentile(step, s).percentile;
        expect(p).toBeGreaterThanOrEqual(prev);
        prev = p;
      }
    }
  });

  it("keeps the table sorted and within 0-100", () => {
    for (let i = 1; i < NORM_TABLE.length; i++) {
      expect(NORM_TABLE[i][0]).toBeLessThan(NORM_TABLE[i - 1][0]);
    }
    for (const [, a, b] of NORM_TABLE) {
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(100);
    }
  });
});

describe("summarizeScore", () => {
  it("compares against the current passing standard and mean", () => {
    const r = summarizeScore("step2ck", 218);
    expect(r.passes).toBe(true);
    expect(r.pointsVsPassing).toBe(0);
    expect(summarizeScore("step2ck", 217).passes).toBe(false);
    expect(summarizeScore("step2ck", 251).pointsVsMean).toBe(0);
    expect(summarizeScore("step3", 199).passes).toBe(false);
  });

  it("returns a percentile band for score ± 1 SEM", () => {
    const r = summarizeScore("step2ck", 250);
    expect(r.semRange).toEqual([244, 256]);
    expect(r.semLow).toBeLessThan(r.percentile);
    expect(r.semHigh).toBeGreaterThan(r.percentile);
  });
});

describe("formatPercentile", () => {
  it("formats ordinal suffixes and rounded extremes", () => {
    expect(formatPercentile(1)).toBe("1st");
    expect(formatPercentile(2)).toBe("2nd");
    expect(formatPercentile(23)).toBe("23rd");
    expect(formatPercentile(11)).toBe("11th");
    expect(formatPercentile(44)).toBe("44th");
    expect(formatPercentile(100)).toBe(">99th");
    expect(formatPercentile(0)).toBe("<1st");
  });
});
