import { describe, expect, it } from "vitest";
import {
  SAMPLE_REFERENCE,
  classifyReadiness,
  estimateCbssaReadiness,
} from "@/lib/cbssa-readiness";

describe("classifyReadiness", () => {
  it("follows NBME's four scenarios", () => {
    expect(classifyReadiness(50, 58, 62, 68)).toBe("below");
    expect(classifyReadiness(58, 66, 62, 68)).toBe("overlap-below");
    expect(classifyReadiness(64, 72, 62, 68)).toBe("near");
    expect(classifyReadiness(70, 78, 62, 68)).toBe("above");
  });
});

describe("estimateCbssaReadiness", () => {
  it("reproduces the official sample report's likely range", () => {
    const r = estimateCbssaReadiness(SAMPLE_REFERENCE.epc, "epc");
    expect(r.likelyLow).toBe(SAMPLE_REFERENCE.likelyLow);
    expect(r.likelyHigh).toBe(SAMPLE_REFERENCE.likelyHigh);
    expect(r.state).toBe("above");
  });

  it("widens the range for a self-counted percent", () => {
    const r = estimateCbssaReadiness(73, "raw");
    expect(r.likelyHigh - r.likelyLow).toBe(12);
    expect(r.state).toBe("near");
  });

  it("respects a low-pass range copied from the user's own report", () => {
    expect(estimateCbssaReadiness(70, "epc", { low: 60, high: 65 }).state).toBe("above");
  });

  it("clamps to 0-100", () => {
    expect(estimateCbssaReadiness(99, "epc").likelyHigh).toBe(100);
    expect(estimateCbssaReadiness(1, "epc").likelyLow).toBe(0);
  });
});
