import { describe, expect, it } from "vitest";
import { predictStepScore, type PracticeExam } from "@/lib/data";
import { createReportPdf } from "@/lib/report-pdf-edge";

const exams: PracticeExam[] = [
  { id: "p1", source: "NBME", formNumber: 30, score: 234, takenDaysAgo: 28 },
  { id: "p2", source: "UWSA1", formNumber: 1, score: 242, takenDaysAgo: 14 },
  { id: "p3", source: "NBME", formNumber: 31, score: 250, takenDaysAgo: 4 },
];

describe("createReportPdf", () => {
  it("returns a valid PDF byte stream without React PDF", () => {
    const result = predictStepScore(exams, "step2", 12, {
      targetScore: 255,
      selfReportedWeakSubjects: ["Biostatistics", "Pharmacology"],
    });

    const bytes = createReportPdf({
      sessionId: "cs_test_pdf_generation",
      result,
      exams,
      step: "step2",
      daysUntil: 12,
      targetScore: 255,
      weakSubjects: ["Biostatistics", "Pharmacology"],
      purchasedAt: new Date("2026-05-24T00:00:00Z"),
    });

    const text = new TextDecoder().decode(bytes.slice(0, 64));
    const tail = new TextDecoder().decode(bytes.slice(-32));

    expect(text).toMatch(/^%PDF-1\.4/);
    expect(tail).toContain("%%EOF");
    expect(bytes.length).toBeGreaterThan(1000);
  });
});
