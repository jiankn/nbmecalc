/**
 * Unit tests for the personalized-analytics layer in `lib/data.ts`.
 *
 * These are the functions that turn the same inputs the free calculator
 * receives into the premium-report-only insights. They must stay pure,
 * deterministic, and never throw on degenerate inputs — the report page
 * renders them unconditionally.
 *
 * We deliberately don't snapshot the human-readable `insight` strings:
 * those are tuned for marketing and change over time. We assert on the
 * structural fields (`trend`, `slopePer30Days`, `gap`, `show`, etc.) that
 * the report UI / PDF actually branch on.
 */
import { describe, expect, it } from "vitest";
import {
  buildPersonalizedWeakSubjects,
  buildPostponeRecommendation,
  buildScoreTrajectory,
  buildSourceInsight,
  buildTargetGap,
  predictStepScore,
  type CohortSubjectAverage,
  type PracticeExam,
} from "@/lib/data";

// ---------------------------------------------------------------------------
// buildScoreTrajectory
// ---------------------------------------------------------------------------

describe("buildScoreTrajectory", () => {
  it("returns insufficient_data when no exams are provided", () => {
    const r = buildScoreTrajectory([], "step2");
    expect(r.points).toHaveLength(0);
    expect(r.trend).toBe("insufficient_data");
    expect(r.slopePer30Days).toBeNull();
  });

  it("returns insufficient_data with only one exam", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 0 },
    ];
    const r = buildScoreTrajectory(exams, "step2");
    expect(r.points).toHaveLength(1);
    expect(r.trend).toBe("insufficient_data");
    expect(r.slopePer30Days).toBeNull();
  });

  it("returns insufficient_data when ≥2 exams exist but none are dated", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 220 },
      { id: "b", source: "NBME", formNumber: 31, score: 240 },
    ];
    const r = buildScoreTrajectory(exams, "step2");
    expect(r.points).toHaveLength(2);
    expect(r.trend).toBe("insufficient_data");
    expect(r.slopePer30Days).toBeNull();
  });

  it("detects an improving trend with positive slope ≥ 1.5", () => {
    // 30 days apart, +20 raw NBME points → ~+14 equated points / 30 days.
    const exams: PracticeExam[] = [
      { id: "old", source: "NBME", formNumber: 30, score: 220, takenDaysAgo: 30 },
      { id: "new", source: "NBME", formNumber: 30, score: 260, takenDaysAgo: 0 },
    ];
    const r = buildScoreTrajectory(exams, "step2");
    expect(r.trend).toBe("improving");
    expect(r.slopePer30Days).not.toBeNull();
    expect(r.slopePer30Days as number).toBeGreaterThan(1.5);
    // Oldest first → newest last.
    expect(r.points[0].daysAgo).toBeGreaterThan(
      r.points[r.points.length - 1].daysAgo as number
    );
  });

  it("detects a declining trend with negative slope", () => {
    const exams: PracticeExam[] = [
      { id: "old", source: "NBME", formNumber: 30, score: 260, takenDaysAgo: 30 },
      { id: "new", source: "NBME", formNumber: 30, score: 220, takenDaysAgo: 0 },
    ];
    const r = buildScoreTrajectory(exams, "step2");
    expect(r.trend).toBe("declining");
    expect(r.slopePer30Days as number).toBeLessThan(0);
  });

  it("treats |slope| < 1.5 pts/month as stable, not noise-as-trend", () => {
    // Both 240 → identical NBME-equated, slope = 0.
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 30 },
      { id: "b", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 0 },
    ];
    const r = buildScoreTrajectory(exams, "step2");
    expect(r.trend).toBe("stable");
    expect(Math.abs(r.slopePer30Days as number)).toBeLessThan(1.5);
  });
});

// ---------------------------------------------------------------------------
// buildSourceInsight
// ---------------------------------------------------------------------------

describe("buildSourceInsight", () => {
  it("returns empty rows + null insight on empty input", () => {
    const r = buildSourceInsight([], "step2");
    expect(r.rows).toHaveLength(0);
    expect(r.insight).toBeNull();
  });

  it("returns one row but no insight when only one source is present", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240 },
      { id: "b", source: "NBME", formNumber: 31, score: 250 },
    ];
    const r = buildSourceInsight(exams, "step2");
    expect(r.rows).toHaveLength(1);
    expect(r.rows[0].source).toBe("NBME");
    expect(r.rows[0].count).toBe(2);
    expect(r.insight).toBeNull();
  });

  it("sorts rows by averageEquated descending and emits a comparison insight when spread ≥ 4", () => {
    const exams: PracticeExam[] = [
      // UWSA1 runs hot vs NBME → should land above NBME for the same raw input.
      { id: "u", source: "UWSA1", score: 260 },
      { id: "n", source: "NBME", formNumber: 30, score: 220 },
    ];
    const r = buildSourceInsight(exams, "step2");
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].averageEquated).toBeGreaterThanOrEqual(
      r.rows[1].averageEquated
    );
    expect(r.insight).not.toBeNull();
    expect(typeof r.insight).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// buildTargetGap
// ---------------------------------------------------------------------------

describe("buildTargetGap", () => {
  it("reports a positive gap when current > target", () => {
    const r = buildTargetGap(240, 250, null);
    expect(r.target).toBe(240);
    expect(r.current).toBe(250);
    expect(r.gap).toBe(10);
    expect(r.daysToTargetAtPace).toBeNull();
    expect(r.projectedAtExam).toBeNull();
  });

  it("reports a negative gap when current < target", () => {
    const r = buildTargetGap(260, 240, null);
    expect(r.gap).toBe(-20);
    expect(r.daysToTargetAtPace).toBeNull();
  });

  it("projects forward when slope + daysUntilExam are provided", () => {
    // +6 pts/month over 60 days = +12 pts on test day.
    const r = buildTargetGap(260, 240, 6, 60);
    expect(r.projectedAtExam).toBe(252);
  });

  it("calculates daysToTargetAtPace only when slope > 0 and gap < 0", () => {
    // Need +10 at +5 pts/month → 60 days.
    const r = buildTargetGap(250, 240, 5, 90);
    expect(r.daysToTargetAtPace).toBe(60);
  });

  it("returns null daysToTargetAtPace when slope ≤ 0 or already on target", () => {
    const overshot = buildTargetGap(240, 250, 5, 60);
    expect(overshot.daysToTargetAtPace).toBeNull();

    const flat = buildTargetGap(250, 240, 0, 60);
    expect(flat.daysToTargetAtPace).toBeNull();

    const declining = buildTargetGap(250, 240, -3, 60);
    expect(declining.daysToTargetAtPace).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// buildPostponeRecommendation
// ---------------------------------------------------------------------------

describe("buildPostponeRecommendation", () => {
  it("hides the card when on-schedule pass probability ≥ 0.7", () => {
    const r = buildPostponeRecommendation(250, 0.9, 4, "step2", 4);
    expect(r.show).toBe(false);
    expect(r.onSchedule.daysAdded).toBe(0);
    expect(r.onSchedule.projectedScore).toBe(250);
  });

  it("shows the card when pass probability < 0.7", () => {
    const r = buildPostponeRecommendation(210, 0.4, 4, "step2", 6);
    expect(r.show).toBe(true);
    expect(r.postponed14d.daysAdded).toBe(14);
    expect(r.postponed28d.daysAdded).toBe(28);
  });

  it("projects higher scores for longer postponement windows (monotonic)", () => {
    const r = buildPostponeRecommendation(210, 0.4, 6, "step2", 6);
    expect(r.postponed14d.projectedScore).toBeGreaterThanOrEqual(
      r.onSchedule.projectedScore
    );
    expect(r.postponed28d.projectedScore).toBeGreaterThanOrEqual(
      r.postponed14d.projectedScore
    );
  });

  it("caps the per-window uplift at +12 pts to avoid runaway optimism", () => {
    // 100 pts/month slope is absurd; the cap must hold.
    const r = buildPostponeRecommendation(200, 0.3, 100, "step2", 6);
    expect(r.postponed28d.projectedScore - 200).toBeLessThanOrEqual(12);
  });

  it("falls back to a conservative slope when none is measured", () => {
    const r = buildPostponeRecommendation(210, 0.5, null, "step2", 5);
    // Still produces non-null scenarios with finite numbers.
    expect(Number.isFinite(r.postponed14d.projectedScore)).toBe(true);
    expect(Number.isFinite(r.postponed28d.projectedScore)).toBe(true);
    expect(r.postponed28d.projectedScore).toBeGreaterThanOrEqual(210);
  });
});

// ---------------------------------------------------------------------------
// buildPersonalizedWeakSubjects
// ---------------------------------------------------------------------------

describe("buildPersonalizedWeakSubjects", () => {
  const cohort: CohortSubjectAverage[] = [
    { name: "OB/GYN", cohortAverage: 55, cohortWeakness: true },
    { name: "Psychiatry", cohortAverage: 58, cohortWeakness: true },
    { name: "Internal Medicine", cohortAverage: 70, cohortWeakness: false },
    { name: "Surgery", cohortAverage: 65, cohortWeakness: false },
  ];

  it("returns null when the user provided no self-reported subjects", () => {
    expect(buildPersonalizedWeakSubjects(undefined, cohort)).toBeNull();
    expect(buildPersonalizedWeakSubjects([], cohort)).toBeNull();
  });

  it("flags a self-reported subject as doublyWeak when it's also at-or-below cohort mean", () => {
    const r = buildPersonalizedWeakSubjects(["OB/GYN"], cohort);
    expect(r).not.toBeNull();
    expect(r!.selfReported).toEqual(["OB/GYN"]);
    expect(r!.doublyWeak).toContain("OB/GYN");
    expect(r!.cohortWeakest).toEqual(["OB/GYN", "Psychiatry"]);
  });

  it("excludes self-reported subjects that are above cohort mean from doublyWeak", () => {
    const r = buildPersonalizedWeakSubjects(["Internal Medicine"], cohort);
    expect(r).not.toBeNull();
    expect(r!.doublyWeak).not.toContain("Internal Medicine");
    expect(r!.doublyWeak).toHaveLength(0);
  });

  it("survives an empty cohort gracefully", () => {
    const r = buildPersonalizedWeakSubjects(["OB/GYN"], []);
    expect(r).not.toBeNull();
    expect(r!.cohortWeakest).toHaveLength(0);
    expect(r!.doublyWeak).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// predictStepScore — top-level contract
// ---------------------------------------------------------------------------

describe("predictStepScore", () => {
  it("returns a well-formed empty result on no exams", () => {
    const r = predictStepScore([], "step2");
    expect(r.step).toBe("step2");
    expect(r.inputCount).toBe(0);
    // The empty result must still expose the new analytics fields so the
    // report UI / PDF can render unconditionally without optional chaining.
    expect(r.scoreTrajectory).toBeDefined();
    expect(r.sourceInsight).toBeDefined();
    expect(r.postponeRecommendation).toBeDefined();
    expect(r.targetGap).toBeNull();
    expect(r.personalizedWeakSubjects).toBeNull();
  });

  it("wires options.targetScore through to a non-null targetGap", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 0 },
    ];
    const r = predictStepScore(exams, "step2", 30, { targetScore: 260 });
    expect(r.targetGap).not.toBeNull();
    expect(r.targetGap!.target).toBe(260);
    expect(r.targetGap!.current).toBe(r.pointEstimate);
  });

  it("wires options.selfReportedWeakSubjects through to personalizedWeakSubjects", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 0 },
    ];
    const r = predictStepScore(exams, "step2", 30, {
      selfReportedWeakSubjects: ["OB/GYN"],
    });
    expect(r.personalizedWeakSubjects).not.toBeNull();
    expect(r.personalizedWeakSubjects!.selfReported).toEqual(["OB/GYN"]);
  });

  it("produces a point estimate inside its own CI", () => {
    const exams: PracticeExam[] = [
      { id: "a", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 0 },
      { id: "b", source: "NBME", formNumber: 31, score: 250, takenDaysAgo: 14 },
    ];
    const r = predictStepScore(exams, "step2");
    expect(r.pointEstimate).toBeGreaterThanOrEqual(r.ciLower);
    expect(r.pointEstimate).toBeLessThanOrEqual(r.ciUpper);
    expect(r.passProbability).toBeGreaterThanOrEqual(0);
    expect(r.passProbability).toBeLessThanOrEqual(1);
  });
});
