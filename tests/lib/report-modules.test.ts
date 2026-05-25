/**
 * Unit tests for `lib/report-modules.ts` — the seven decision-grade modules
 * that turn the same calculator inputs into the paid report.
 *
 * Like the data.ts tests, we don't snapshot human-readable copy. We assert on
 * the structural fields the UI / PDF actually branch on:
 *
 *   - RiskProfile.shape
 *   - OneDecision.recommendation
 *   - AntiPatterns.items[].title (for presence checks, not exact text)
 *   - HighLeverageMoves.items[].rank
 *   - TestDayProtocol.show
 *   - CohortMirror buckets sum to ~1, isYourProjection on exactly one bucket
 *   - HonestUncertainty has non-empty arrays
 *
 * These are also the contracts that downstream modules (PDF, web view,
 * paywall CTA copy) lock against.
 */
import { describe, expect, it } from "vitest";
import {
  buildAntiPatterns,
  buildCohortMirror,
  buildHighLeverageMoves,
  buildHonestUncertainty,
  buildOneDecision,
  buildRiskProfile,
  buildTestDayProtocol,
  predictStepScore,
  type PracticeExam,
  type ScoreTrajectory,
  type SourceInsight,
  type PostponeRecommendation,
} from "@/lib/data";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const flatTrajectory: ScoreTrajectory = {
  points: [],
  slopePer30Days: 0,
  trend: "stable",
  insight: "",
};

const improvingTrajectory: ScoreTrajectory = {
  points: [],
  slopePer30Days: 5,
  trend: "improving",
  insight: "",
};

const decliningTrajectory: ScoreTrajectory = {
  points: [],
  slopePer30Days: -4,
  trend: "declining",
  insight: "",
};

const insufficientTrajectory: ScoreTrajectory = {
  points: [],
  slopePer30Days: null,
  trend: "insufficient_data",
  insight: "",
};

const noSourceInsight: SourceInsight = { rows: [], insight: null };

function postponeStub(passProb: number, lift14 = 0.05, lift28 = 0.1): PostponeRecommendation {
  return {
    show: passProb < 0.7,
    onSchedule: { daysAdded: 0, projectedScore: 250, projectedPassProbability: passProb },
    postponed14d: {
      daysAdded: 14,
      projectedScore: 252,
      projectedPassProbability: Math.min(0.99, passProb + lift14),
    },
    postponed28d: {
      daysAdded: 28,
      projectedScore: 254,
      projectedPassProbability: Math.min(0.99, passProb + lift28),
    },
    insight: "",
  };
}

// ---------------------------------------------------------------------------
// buildRiskProfile
// ---------------------------------------------------------------------------

describe("buildRiskProfile", () => {
  it("returns tight_balanced when sources agree and CI is narrow", () => {
    const r = buildRiskProfile({
      point: 248,
      ciLower: 244,
      ciUpper: 252,
      exams: [],
      step: "step2",
      sourceInsight: {
        rows: [
          { source: "NBME", label: "NBME", count: 2, averageEquated: 248 },
          { source: "UWSA2", label: "UWSA 2", count: 1, averageEquated: 247 },
        ],
        insight: null,
      },
      inputCount: 3,
    });
    expect(r.shape).toBe("tight_balanced");
    expect(r.spread).toBe(8);
  });

  it("flags asymmetric_downside when UWSA1 sits well above NBME", () => {
    const r = buildRiskProfile({
      point: 240,
      ciLower: 232,
      ciUpper: 248,
      exams: [],
      step: "step2",
      sourceInsight: {
        rows: [
          { source: "UWSA1", label: "UWSA 1", count: 1, averageEquated: 250 },
          { source: "NBME", label: "NBME", count: 1, averageEquated: 240 },
        ],
        insight: null,
      },
      inputCount: 2,
    });
    expect(r.shape).toBe("asymmetric_downside");
    expect(r.rootCause).toMatch(/UWSA/);
  });

  it("flags asymmetric_downside when AMBOSS sits well above NBME", () => {
    const r = buildRiskProfile({
      point: 245,
      ciLower: 237,
      ciUpper: 253,
      exams: [],
      step: "step2",
      sourceInsight: {
        rows: [
          { source: "AMBOSS", label: "AMBOSS SA", count: 1, averageEquated: 252 },
          { source: "NBME", label: "NBME", count: 1, averageEquated: 240 },
        ],
        insight: null,
      },
      inputCount: 2,
    });
    expect(r.shape).toBe("asymmetric_downside");
  });

  it("flags asymmetric_upside when NBME is the strongest source", () => {
    const r = buildRiskProfile({
      point: 245,
      ciLower: 237,
      ciUpper: 253,
      exams: [],
      step: "step2",
      sourceInsight: {
        rows: [
          { source: "NBME", label: "NBME", count: 2, averageEquated: 250 },
          { source: "FREE120", label: "Free 120", count: 1, averageEquated: 240 },
        ],
        insight: null,
      },
      inputCount: 3,
    });
    expect(r.shape).toBe("asymmetric_upside");
  });

  it("flags wide_balanced when CI is wide and only one input", () => {
    const r = buildRiskProfile({
      point: 240,
      ciLower: 220,
      ciUpper: 260,
      exams: [],
      step: "step2",
      sourceInsight: noSourceInsight,
      inputCount: 1,
    });
    expect(r.shape).toBe("wide_balanced");
    expect(r.spread).toBe(40);
  });

  it("computes spread from ciLower/ciUpper exactly", () => {
    const r = buildRiskProfile({
      point: 230,
      ciLower: 220,
      ciUpper: 240,
      exams: [],
      step: "step2",
      sourceInsight: noSourceInsight,
      inputCount: 2,
    });
    expect(r.spread).toBe(20);
    expect(r.floor).toBe(220);
    expect(r.ceiling).toBe(240);
  });
});

// ---------------------------------------------------------------------------
// buildOneDecision
// ---------------------------------------------------------------------------

describe("buildOneDecision", () => {
  it("returns need_more_data when only one input is provided", () => {
    const r = buildOneDecision({
      point: 240,
      passProbability: 0.85,
      postponeRecommendation: postponeStub(0.85),
      inputCount: 1,
      freshness: "fresh",
      daysUntilExam: 21,
      scoreTrajectory: insufficientTrajectory,
      targetGap: null,
      step: "step2",
    });
    expect(r.recommendation).toBe("need_more_data");
    expect(r.confidence).toBe("low");
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.reverseTriggers.length).toBeGreaterThan(0);
  });

  it("recommends postpone_28d when pass probability is very low and 28d lift is large", () => {
    const r = buildOneDecision({
      point: 200,
      passProbability: 0.3,
      postponeRecommendation: postponeStub(0.3, 0.1, 0.25),
      inputCount: 3,
      freshness: "fresh",
      daysUntilExam: 30,
      scoreTrajectory: improvingTrajectory,
      targetGap: null,
      step: "step2",
    });
    expect(r.recommendation).toBe("postpone_28d");
    expect(r.confidence).toBe("high");
  });

  it("recommends postpone_14d for borderline pass probability with meaningful 14d lift", () => {
    const r = buildOneDecision({
      point: 215,
      passProbability: 0.6,
      postponeRecommendation: postponeStub(0.6, 0.1, 0.15),
      inputCount: 3,
      freshness: "fresh",
      daysUntilExam: 28,
      scoreTrajectory: improvingTrajectory,
      targetGap: null,
      step: "step2",
    });
    expect(r.recommendation).toBe("postpone_14d");
  });

  it("recommends sit_as_scheduled for high pass probability", () => {
    const r = buildOneDecision({
      point: 250,
      passProbability: 0.95,
      postponeRecommendation: postponeStub(0.95, 0.01, 0.02),
      inputCount: 3,
      freshness: "fresh",
      daysUntilExam: 14,
      scoreTrajectory: improvingTrajectory,
      targetGap: null,
      step: "step2",
    });
    expect(r.recommendation).toBe("sit_as_scheduled");
    expect(r.confidence).toBe("high");
  });

  it("always returns at least one reason and one reverse trigger when not need_more_data", () => {
    const r = buildOneDecision({
      point: 240,
      passProbability: 0.85,
      postponeRecommendation: postponeStub(0.85),
      inputCount: 3,
      freshness: "fresh",
      daysUntilExam: 21,
      scoreTrajectory: flatTrajectory,
      targetGap: null,
      step: "step2",
    });
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.reverseTriggers.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// buildAntiPatterns
// ---------------------------------------------------------------------------

describe("buildAntiPatterns", () => {
  it("never returns more than 5 items", () => {
    const r = buildAntiPatterns({
      exams: [
        { id: "1", source: "UWSA1", score: 250 },
        { id: "2", source: "AMBOSS", score: 70 },
        { id: "3", source: "CMS", score: 70 },
      ],
      step: "step2",
      daysUntilExam: 10,
      scoreTrajectory: improvingTrajectory,
      passProbability: 0.7,
      inputCount: 3,
    });
    expect(r.items.length).toBeLessThanOrEqual(5);
  });

  it("flags 'don't take another full exam' when within 5 days", () => {
    const r = buildAntiPatterns({
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      step: "step2",
      daysUntilExam: 3,
      scoreTrajectory: flatTrajectory,
      passProbability: 0.85,
      inputCount: 3,
    });
    expect(r.items.some((i) => i.title.includes("full-length"))).toBe(true);
  });

  it("flags hot-source anchoring when UWSA1 is in inputs", () => {
    const r = buildAntiPatterns({
      exams: [
        { id: "1", source: "UWSA1", score: 250 },
        { id: "2", source: "NBME", formNumber: 30, score: 240 },
      ],
      step: "step2",
      daysUntilExam: 21,
      scoreTrajectory: flatTrajectory,
      passProbability: 0.85,
      inputCount: 2,
    });
    expect(r.items.some((i) => i.title.toLowerCase().includes("uwsa1"))).toBe(true);
  });

  it("flags 'CMS only' when every exam is CMS", () => {
    const r = buildAntiPatterns({
      exams: [
        { id: "1", source: "CMS", formNumber: 6, score: 70 },
        { id: "2", source: "CMS", formNumber: 7, score: 72 },
      ],
      step: "step2",
      daysUntilExam: 21,
      scoreTrajectory: flatTrajectory,
      passProbability: 0.7,
      inputCount: 2,
    });
    expect(r.items.some((i) => i.title.toLowerCase().includes("cms"))).toBe(true);
  });

  it("returns at least one item for a typical user", () => {
    const r = buildAntiPatterns({
      exams: [
        { id: "1", source: "NBME", formNumber: 30, score: 240 },
        { id: "2", source: "NBME", formNumber: 31, score: 245 },
        { id: "3", source: "UWSA2", score: 250 },
      ],
      step: "step2",
      daysUntilExam: 14,
      scoreTrajectory: improvingTrajectory,
      passProbability: 0.85,
      inputCount: 3,
    });
    expect(r.items.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// buildHighLeverageMoves
// ---------------------------------------------------------------------------

describe("buildHighLeverageMoves", () => {
  it("returns exactly 3 moves at most, with sequential ranks", () => {
    const r = buildHighLeverageMoves({
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      step: "step2",
      daysUntilExam: 21,
      scoreTrajectory: improvingTrajectory,
      passProbability: 0.85,
      inputCount: 1,
      personalizedWeakSubjects: null,
    });
    expect(r.items.length).toBeLessThanOrEqual(3);
    r.items.forEach((m, i) => expect(m.rank).toBe(i + 1));
  });

  it("recommends taking Free 120 when not yet taken and within window", () => {
    const r = buildHighLeverageMoves({
      exams: [
        { id: "1", source: "NBME", formNumber: 30, score: 240 },
        { id: "2", source: "NBME", formNumber: 31, score: 245 },
      ],
      step: "step2",
      daysUntilExam: 14,
      scoreTrajectory: improvingTrajectory,
      passProbability: 0.85,
      inputCount: 2,
      personalizedWeakSubjects: null,
    });
    expect(r.items.some((m) => m.title.toLowerCase().includes("free 120"))).toBe(true);
  });

  it("recommends adding a second input when only one is provided", () => {
    const r = buildHighLeverageMoves({
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      step: "step2",
      daysUntilExam: 21,
      scoreTrajectory: insufficientTrajectory,
      passProbability: 0.8,
      inputCount: 1,
      personalizedWeakSubjects: null,
    });
    expect(r.items.some((m) => m.title.toLowerCase().includes("second"))).toBe(true);
  });

  it("recommends a re-test when trajectory is declining", () => {
    const r = buildHighLeverageMoves({
      exams: [
        { id: "1", source: "NBME", formNumber: 30, score: 250, takenDaysAgo: 30 },
        { id: "2", source: "NBME", formNumber: 31, score: 230, takenDaysAgo: 0 },
      ],
      step: "step2",
      daysUntilExam: 14,
      scoreTrajectory: decliningTrajectory,
      passProbability: 0.6,
      inputCount: 2,
      personalizedWeakSubjects: null,
    });
    expect(r.items.some((m) => m.title.toLowerCase().includes("re-test"))).toBe(true);
  });

  it("always returns at least one item even on degenerate input", () => {
    const r = buildHighLeverageMoves({
      exams: [],
      step: "step2",
      daysUntilExam: undefined,
      scoreTrajectory: insufficientTrajectory,
      passProbability: 0,
      inputCount: 0,
      personalizedWeakSubjects: null,
    });
    expect(r.items.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// buildTestDayProtocol
// ---------------------------------------------------------------------------

describe("buildTestDayProtocol", () => {
  it("hides the protocol when test is more than 7 days away", () => {
    const r = buildTestDayProtocol({ daysUntilExam: 14, step: "step2" });
    expect(r.show).toBe(false);
  });

  it("hides the protocol when daysUntilExam is undefined", () => {
    const r = buildTestDayProtocol({ daysUntilExam: undefined, step: "step2" });
    expect(r.show).toBe(false);
  });

  it("shows the protocol when test is within 7 days", () => {
    const r = buildTestDayProtocol({ daysUntilExam: 5, step: "step2" });
    expect(r.show).toBe(true);
    expect(r.dayMinusOne.length).toBeGreaterThan(0);
    expect(r.dayZero.length).toBeGreaterThan(0);
    expect(r.doNots.length).toBeGreaterThan(0);
  });

  it("returns content arrays in stable shape", () => {
    const r = buildTestDayProtocol({ daysUntilExam: 1, step: "step2" });
    expect(Array.isArray(r.dayMinusOne)).toBe(true);
    expect(Array.isArray(r.dayZero)).toBe(true);
    expect(Array.isArray(r.doNots)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildCohortMirror
// ---------------------------------------------------------------------------

describe("buildCohortMirror", () => {
  it("produces 5 buckets with exactly one isYourProjection = true", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [
        { id: "1", source: "NBME", formNumber: 30, score: 240 },
        { id: "2", source: "NBME", formNumber: 31, score: 248 },
      ],
      daysUntilExam: 14,
      scoreTrajectory: improvingTrajectory,
      inputCount: 2,
    });
    expect(r.buckets).toHaveLength(5);
    const projected = r.buckets.filter((b) => b.isYourProjection);
    expect(projected).toHaveLength(1);
  });

  it("bucket percentages sum to ~1 (within 0.05)", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      daysUntilExam: 14,
      scoreTrajectory: flatTrajectory,
      inputCount: 1,
    });
    const sum = r.buckets.reduce((s, b) => s + b.percentage, 0);
    expect(sum).toBeGreaterThan(0.95);
    expect(sum).toBeLessThan(1.05);
  });

  it("yourPercentile is in [0, 100]", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      daysUntilExam: 14,
      scoreTrajectory: flatTrajectory,
      inputCount: 1,
    });
    expect(r.yourPercentile).toBeGreaterThanOrEqual(0);
    expect(r.yourPercentile).toBeLessThanOrEqual(100);
  });

  it("median equals point estimate when no trajectory", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      daysUntilExam: 0,
      scoreTrajectory: insufficientTrajectory,
      inputCount: 1,
    });
    expect(r.median).toBe(245);
  });

  it("median shifts upward when trajectory is improving and days remain", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      daysUntilExam: 30,
      scoreTrajectory: { ...improvingTrajectory, slopePer30Days: 4 },
      inputCount: 1,
    });
    expect(r.median).toBeGreaterThan(245);
  });

  it("always includes the model-projected disclaimer", () => {
    const r = buildCohortMirror({
      point: 245,
      ciLower: 239,
      ciUpper: 251,
      step: "step2",
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      daysUntilExam: 0,
      scoreTrajectory: insufficientTrajectory,
      inputCount: 1,
    });
    expect(r.disclaimer.toLowerCase()).toContain("model");
  });
});

// ---------------------------------------------------------------------------
// buildHonestUncertainty
// ---------------------------------------------------------------------------

describe("buildHonestUncertainty", () => {
  it("always returns non-empty cannotPredict and whenWedBeWrong", () => {
    const r = buildHonestUncertainty({
      exams: [],
      scoreTrajectory: insufficientTrajectory,
      sourceInsight: noSourceInsight,
    });
    expect(r.cannotPredict.length).toBeGreaterThan(0);
    expect(r.whenWedBeWrong.length).toBeGreaterThan(0);
  });

  it("includes a NBME-specific caveat when NBME is present", () => {
    const r = buildHonestUncertainty({
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      scoreTrajectory: flatTrajectory,
      sourceInsight: noSourceInsight,
    });
    expect(r.whenWedBeWrong.some((s) => s.toLowerCase().includes("nbme"))).toBe(true);
  });

  it("flags the single-input wider-variance caveat when only 1 exam", () => {
    const r = buildHonestUncertainty({
      exams: [{ id: "1", source: "NBME", formNumber: 30, score: 240 }],
      scoreTrajectory: insufficientTrajectory,
      sourceInsight: noSourceInsight,
    });
    expect(r.whenWedBeWrong.some((s) => s.toLowerCase().includes("single"))).toBe(true);
  });

  it("includes the not-affiliated note", () => {
    const r = buildHonestUncertainty({
      exams: [],
      scoreTrajectory: insufficientTrajectory,
      sourceInsight: noSourceInsight,
    });
    expect(r.notAffiliatedNote.toLowerCase()).toContain("nbme");
    expect(r.notAffiliatedNote.toLowerCase()).toContain("not affiliated");
  });
});

// ---------------------------------------------------------------------------
// End-to-end: predictStepScore should produce all 7 modules
// ---------------------------------------------------------------------------

describe("predictStepScore — premium modules wiring", () => {
  it("populates all 7 premium-report module fields", () => {
    const exams: PracticeExam[] = [
      { id: "1", source: "NBME", formNumber: 30, score: 240, takenDaysAgo: 21 },
      { id: "2", source: "NBME", formNumber: 31, score: 248, takenDaysAgo: 7 },
      { id: "3", source: "UWSA2", score: 252, takenDaysAgo: 3 },
    ];
    const r = predictStepScore(exams, "step2", 14, { targetScore: 250 });
    expect(r.riskProfile).toBeDefined();
    expect(r.oneDecision).toBeDefined();
    expect(r.antiPatterns).toBeDefined();
    expect(r.highLeverageMoves).toBeDefined();
    expect(r.testDayProtocol).toBeDefined();
    expect(r.cohortMirror).toBeDefined();
    expect(r.honestUncertainty).toBeDefined();
  });

  it("RiskProfile.floor/ceiling stay aligned with ciLower/ciUpper", () => {
    const exams: PracticeExam[] = [
      { id: "1", source: "NBME", formNumber: 30, score: 240 },
      { id: "2", source: "NBME", formNumber: 31, score: 245 },
    ];
    const r = predictStepScore(exams, "step2");
    expect(r.riskProfile.floor).toBe(r.ciLower);
    expect(r.riskProfile.ceiling).toBe(r.ciUpper);
    expect(r.riskProfile.spread).toBe(r.ciUpper - r.ciLower);
  });

  it("TestDayProtocol.show is true only when daysUntilExam ≤ 7", () => {
    const exams: PracticeExam[] = [
      { id: "1", source: "NBME", formNumber: 30, score: 240 },
      { id: "2", source: "NBME", formNumber: 31, score: 245 },
    ];
    const farOut = predictStepScore(exams, "step2", 21);
    const close = predictStepScore(exams, "step2", 5);
    expect(farOut.testDayProtocol.show).toBe(false);
    expect(close.testDayProtocol.show).toBe(true);
  });

  it("OneDecision returns need_more_data with one input", () => {
    const exams: PracticeExam[] = [
      { id: "1", source: "NBME", formNumber: 30, score: 240 },
    ];
    const r = predictStepScore(exams, "step2", 21);
    expect(r.oneDecision.recommendation).toBe("need_more_data");
  });
});
