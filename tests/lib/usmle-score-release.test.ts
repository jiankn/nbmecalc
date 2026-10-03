import { describe, expect, it } from "vitest";
import {
  estimateRelease,
  formatLongDate,
  parseDateInput,
  planForDeadline,
  toDateInput,
} from "@/lib/usmle-score-release";

const d = (s: string) => parseDateInput(s)!;

describe("parseDateInput", () => {
  it("parses a valid date as UTC midnight", () => {
    expect(d("2026-10-03").toISOString()).toBe("2026-10-03T00:00:00.000Z");
  });

  it("rejects malformed and impossible dates", () => {
    expect(parseDateInput("")).toBeNull();
    expect(parseDateInput("10/03/2026")).toBeNull();
    expect(parseDateInput("2026-02-30")).toBeNull();
  });
});

describe("estimateRelease", () => {
  it("adds 4 and 8 weeks to the test date", () => {
    const r = estimateRelease(d("2026-09-15"), d("2026-09-20"));
    expect(toDateInput(r.typicalBy)).toBe("2026-10-13");
    expect(toDateInput(r.allowUntil)).toBe("2026-11-10");
    expect(r.elapsed).toBe(5);
    expect(r.status).toBe("waiting");
  });

  it("crosses a leap day correctly", () => {
    expect(toDateInput(estimateRelease(d("2028-02-15"), d("2028-02-15")).typicalBy)).toBe("2028-03-14");
  });

  it("classifies the waiting status at each boundary", () => {
    const test = d("2026-01-01");
    expect(estimateRelease(test, d("2025-12-31")).status).toBe("not-taken");
    expect(estimateRelease(test, d("2026-01-29")).status).toBe("waiting");
    expect(estimateRelease(test, d("2026-01-30")).status).toBe("late-typical");
    expect(estimateRelease(test, d("2026-02-26")).status).toBe("late-typical");
    expect(estimateRelease(test, d("2026-02-27")).status).toBe("past-allowance");
  });
});

describe("planForDeadline", () => {
  it("works backward 8 weeks (safe) and 4 weeks (risky)", () => {
    const p = planForDeadline(d("2026-12-31"));
    expect(toDateInput(p.safeTestBy)).toBe("2026-11-05");
    expect(toDateInput(p.typicalTestBy)).toBe("2026-12-03");
  });
});

describe("formatLongDate", () => {
  it("formats in UTC so the day never shifts", () => {
    expect(formatLongDate(d("2026-10-13"))).toBe("Tue, October 13, 2026");
  });
});
