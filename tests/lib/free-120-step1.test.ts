import { describe, expect, it } from "vitest";
import { estimateFree120Step1, samplingHalfWidth } from "@/lib/free-120-step1";

describe("samplingHalfWidth", () => {
  it("matches the binomial standard error", () => {
    // sqrt(0.65 * 0.35 / 120) = 0.04354
    expect(samplingHalfWidth(65, 120)).toBeCloseTo(4.354, 2);
  });

  it("widens with fewer questions", () => {
    expect(samplingHalfWidth(65, 60)).toBeGreaterThan(samplingHalfWidth(65, 120));
  });
});

describe("estimateFree120Step1", () => {
  it("builds a ±1 SE range around the percent", () => {
    const e = estimateFree120Step1(78, 120); // 65%
    expect(e.percent).toBe(65);
    expect(e.likelyLow).toBe(61);
    expect(e.likelyHigh).toBe(69);
  });

  it("classifies against the default 62–68% CBSSA low-pass band", () => {
    expect(estimateFree120Step1(66, 120).state).toBe("below"); // 55%: 50–60
    expect(estimateFree120Step1(72, 120).state).toBe("overlap-below"); // 60%: 56–64
    expect(estimateFree120Step1(84, 120).state).toBe("near"); // 70%: 66–74
    expect(estimateFree120Step1(96, 120).state).toBe("above"); // 80%: 76–84
  });

  it("clamps impossible inputs", () => {
    const e = estimateFree120Step1(150, 120);
    expect(e.correct).toBe(120);
    expect(e.likelyHigh).toBe(100);
  });
});
