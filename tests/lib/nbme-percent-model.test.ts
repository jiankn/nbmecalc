import { describe, expect, it } from "vitest";
import {
  CONVERSION_CHART_PERCENTS,
  EPC_ANCHORS,
  estimateStep2FromPercent,
  percentFromCorrect,
} from "@/lib/nbme-percent-model";

describe("estimateStep2FromPercent", () => {
  it("reproduces both official sample-report anchors exactly", () => {
    expect(estimateStep2FromPercent(EPC_ANCHORS.low.epc, "epc").midpoint).toBe(201);
    expect(estimateStep2FromPercent(EPC_ANCHORS.mean.epc, "epc").midpoint).toBe(249);
  });

  it("is monotonic and stays on the 1-300 scale", () => {
    let prev = 0;
    for (let p = 0; p <= 100; p++) {
      const r = estimateStep2FromPercent(p, "epc");
      expect(r.midpoint).toBeGreaterThanOrEqual(prev);
      expect(r.low).toBeGreaterThanOrEqual(1);
      expect(r.high).toBeLessThanOrEqual(300);
      expect(r.low).toBeLessThanOrEqual(r.midpoint);
      expect(r.high).toBeGreaterThanOrEqual(r.midpoint);
      prev = r.midpoint;
    }
  });

  it("widens the range outside the anchors and for self-counted percent", () => {
    const inside = estimateStep2FromPercent(70, "epc");
    const outside = estimateStep2FromPercent(88, "epc");
    const raw = estimateStep2FromPercent(70, "raw");
    expect(inside.extrapolated).toBe(false);
    expect(outside.extrapolated).toBe(true);
    expect(outside.high - outside.low).toBeGreaterThan(inside.high - inside.low);
    expect(raw.high - raw.low).toBeGreaterThan(inside.high - inside.low);
  });

  it("clamps percent input to 0-100", () => {
    expect(estimateStep2FromPercent(140, "epc").percent).toBe(100);
    expect(estimateStep2FromPercent(-5, "epc").percent).toBe(0);
  });
});

describe("percentFromCorrect", () => {
  it("converts number correct out of 200", () => {
    expect(percentFromCorrect(150)).toBe(75);
    expect(percentFromCorrect(250)).toBe(100);
  });
});

describe("CONVERSION_CHART_PERCENTS", () => {
  it("covers 50% to 90% in 2-point steps", () => {
    expect(CONVERSION_CHART_PERCENTS[0]).toBe(50);
    expect(CONVERSION_CHART_PERCENTS.at(-1)).toBe(90);
    expect(CONVERSION_CHART_PERCENTS).toHaveLength(21);
  });
});

describe("percentForScore", () => {
  it("returns the lowest percent whose midpoint reaches the score", async () => {
    const { percentForScore, estimateStep2FromPercent } = await import("@/lib/nbme-percent-model");
    const p = percentForScore(218);
    expect(estimateStep2FromPercent(p, "epc").midpoint).toBeGreaterThanOrEqual(218);
    expect(estimateStep2FromPercent(p - 1, "epc").midpoint).toBeLessThan(218);
  });
});
