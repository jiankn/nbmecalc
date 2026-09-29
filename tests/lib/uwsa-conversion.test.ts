import { describe, expect, it } from "vitest";
import { convertExam, UWSA_BIAS } from "@/lib/data";

describe("UWSA conversion (v1.4)", () => {
  it("subtracts only the disclosed bias", () => {
    expect(convertExam({ id: "a", source: "UWSA1", score: 250 }, "step2")).toBe(245);
    expect(convertExam({ id: "a", source: "UWSA2", score: 250 }, "step2")).toBe(248);
  });

  it("never raises a low UWSA score toward the passing line", () => {
    // v1.3 turned a UWSA 1 of 200 into 218 via the legacy NBME curve.
    for (const score of [180, 190, 200, 210, 220]) {
      expect(convertExam({ id: "a", source: "UWSA1", score }, "step2")).toBe(score - UWSA_BIAS[1]);
      expect(convertExam({ id: "a", source: "UWSA2", score }, "step2")).toBe(score - UWSA_BIAS[2]);
    }
  });

  it("applies the same rule to Step 1 and Step 3 inputs", () => {
    expect(convertExam({ id: "a", source: "UWSA1", score: 240 }, "step1")).toBe(235);
    expect(convertExam({ id: "a", source: "UWSA2", score: 230 }, "step3")).toBe(228);
  });
});
