import { describe, expect, it } from "vitest";
import {
  SPECIALTY_STEP2,
  countAtOrAboveMedian,
  positionInSpecialty,
  specialtiesByMedian,
} from "@/lib/nrmp-step2-specialty";

describe("NRMP Step 2 CK specialty data", () => {
  it("keeps quartiles ordered for every specialty", () => {
    for (const sp of SPECIALTY_STEP2) {
      expect(sp.matched.q1).toBeLessThanOrEqual(sp.matched.median);
      expect(sp.matched.median).toBeLessThanOrEqual(sp.matched.q3);
      expect(sp.matched.n).toBeGreaterThanOrEqual(40);
    }
  });

  it("uses unique slugs", () => {
    expect(new Set(SPECIALTY_STEP2.map((sp) => sp.slug)).size).toBe(SPECIALTY_STEP2.length);
  });

  it("sorts by matched median, highest first", () => {
    const sorted = specialtiesByMedian();
    expect(sorted[0].name).toBe("Otolaryngology (ENT)");
    expect(sorted[sorted.length - 1].name).toBe("Family Medicine");
  });

  it("places a score within a specialty's quartiles", () => {
    const derm = SPECIALTY_STEP2.find((sp) => sp.slug === "dermatology")!; // 251 / 258 / 266
    expect(positionInSpecialty(250, derm)).toBe("below-q1");
    expect(positionInSpecialty(251, derm)).toBe("q1-to-median");
    expect(positionInSpecialty(258, derm)).toBe("median-to-q3");
    expect(positionInSpecialty(267, derm)).toBe("above-q3");
  });

  it("counts specialties at or above the matched median", () => {
    expect(countAtOrAboveMedian(300)).toBe(SPECIALTY_STEP2.length);
    expect(countAtOrAboveMedian(200)).toBe(0);
  });
});
