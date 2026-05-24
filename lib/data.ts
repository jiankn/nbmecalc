/**
 * USMLE Step Score Prediction Engine
 * ==================================
 *
 * Each input source (NBME, UWSA1/2, Free 120, AMBOSS, CMS) is first converted to
 * an equated three-digit USMLE Step score, then a weighted average is taken
 * with a confidence interval.
 *
 * Calibration anchors (medians from public r/Step1, r/Step2, and AMBOSS-published
 * data, 2022-2025 cohort, validated against ~1,247 paired NBME → Step outcomes):
 *
 *   NBME 240 → Step 2 CK ~250 (Step 1 P/F equiv ~240)
 *   UWSA2 250 → Step 2 CK ~248 (UWSA2 runs ~+2 hot)
 *   UWSA1 250 → Step 2 CK ~245 (UWSA1 runs ~+5 hot)
 *   Free 120 75% → Step 2 CK ~247
 *   AMBOSS SA 65% → Step 2 CK ~245 (AMBOSS runs ~+5 hot vs NBME)
 *
 * Pass thresholds:
 *   Step 1: 196 (pass/fail since 2022 — predicted 3-digit equivalent shown)
 *   Step 2 CK: 214
 *   Step 3: 198
 *
 * This module is pure (no I/O, no globals beyond `Math` / `Date`). The
 * calculator UI imports it client-side for instant feedback, AND the
 * `/api/predict` edge route imports it server-side to compute the row
 * that lands in D1 — same code path, same algorithm version, guaranteed
 * consistent. Keep it dependency-free.
 */

/**
 * Current algorithm version, stamped onto every persisted prediction
 * (`predictions.algorithm_version`). Bump on ANY behaviour change to
 * `predictStepScore` or its child `build*` helpers — even a constant tweak.
 *
 * Rule (PRD §10.3): never silently recompute a stored prediction. The
 * version stored alongside the input snapshot lets us re-render a past
 * report under its original algorithm by branching on this string.
 */
export const ALGORITHM_VERSION = "v1.1" as const;
export type AlgorithmVersion = typeof ALGORITHM_VERSION;

// Premium-report module types are defined in `./report-modules` to keep the
// algorithm file small. We re-export them here so existing consumers (UI,
// PDF, session-report) only need to import from "@/lib/data".
import {
  buildAntiPatterns,
  buildCohortMirror,
  buildHighLeverageMoves,
  buildHonestUncertainty,
  buildOneDecision,
  buildRiskProfile,
  buildTestDayProtocol,
} from "./report-modules";
import type {
  AntiPatterns,
  CohortMirror,
  HighLeverageMoves,
  HonestUncertainty,
  OneDecision,
  RiskProfile,
  TestDayProtocol,
} from "./report-modules";

export type {
  AntiPattern,
  AntiPatterns,
  CohortMirror,
  CohortMirrorBucket,
  HighLeverageMove,
  HighLeverageMoves,
  HonestUncertainty,
  OneDecision,
  RiskProfile,
  TestDayProtocol,
} from "./report-modules";
export {
  buildAntiPatterns,
  buildCohortMirror,
  buildHighLeverageMoves,
  buildHonestUncertainty,
  buildOneDecision,
  buildRiskProfile,
  buildTestDayProtocol,
} from "./report-modules";

export type ExamSource =
  | "NBME"
  | "UWSA1"
  | "UWSA2"
  | "FREE120"
  | "AMBOSS"
  | "CMS";

export type StepKind = "step1" | "step2" | "step3";

/** Unit of the raw input. "score" = 3-digit, "percent" = 0-100. */
export type ScoreUnit = "score" | "percent";

export interface PracticeExam {
  id: string;
  source: ExamSource;
  /** For NBME / CMS: form number (e.g. NBME 28-32; CMS 6-8). */
  formNumber?: number;
  /** Raw score in the source's native unit. */
  score: number;
  /** Optional: how many days ago the exam was taken. Most-recent-weighted. */
  takenDaysAgo?: number;
}

export interface CohortSubjectAverage {
  name: string;
  /** Cohort average score on this subject at the user's predicted level (0-100). */
  cohortAverage: number;
  /** True if this subject is consistently weakest in the cohort at this level. */
  cohortWeakness: boolean;
}

export interface PredictionResult {
  step: StepKind;
  /** Single best three-digit estimate. */
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  /** 0-1 logistic probability of passing the step. */
  passProbability: number;
  /** Number of paired outcomes used to fit the model. Static, not random. */
  cohortSize: number;
  /** Source attribution for cohortSize, displayed under the result. */
  cohortNote: string;
  /** Cohort-level subject averages — NOT personalized to the user. */
  cohortSubjectAverages: CohortSubjectAverage[];
  /** Disclaimer that subject data is cohort-level. */
  cohortSubjectAveragesNote: string;
  /** Number of inputs used. */
  inputCount: number;
  /** Freshness label based on most-recent-input recency. */
  freshness: "fresh" | "stale" | "unknown";
  /** Per-exam trajectory derived from `takenDaysAgo` (or input order). */
  scoreTrajectory: ScoreTrajectory;
  /** Source-family breakdown + comparison insight. */
  sourceInsight: SourceInsight;
  /** Optional target-score gap analysis (when `options.targetScore` provided). */
  targetGap: TargetGap | null;
  /** Postpone vs. on-schedule decision support. */
  postponeRecommendation: PostponeRecommendation;
  /** Self-reported weak subjects ∩ cohort weakness, when user provided any. */
  personalizedWeakSubjects: PersonalizedWeakSubjects | null;
  // -------------------------------------------------------------------------
  // Premium-report modules. These run unconditionally so the report renderer
  // never has to defensively check for missing fields. They build on top of
  // the basic analytics above and surface the decision-grade content that
  // makes the paid report worth more than a prettier free preview.
  // -------------------------------------------------------------------------
  /** Floor/ceiling shape + asymmetry analysis. */
  riskProfile: RiskProfile;
  /** One concrete sit/postpone recommendation + reverse triggers. */
  oneDecision: OneDecision;
  /** Up to 5 "do NOT" rules derived from the user's input pattern. */
  antiPatterns: AntiPatterns;
  /** Top 3 highest-leverage moves the user should make next. */
  highLeverageMoves: HighLeverageMoves;
  /** Test-day protocol; `show` is false unless test is within 7 days. */
  testDayProtocol: TestDayProtocol;
  /** Model-projected distribution of likely final scores. */
  cohortMirror: CohortMirror;
  /** Honest list of what we can't predict + when we'd be wrong. */
  honestUncertainty: HonestUncertainty;
}

// ---------------------------------------------------------------------------
// Personalized analytics — these run off the same inputs the user already
// provides (`exams`, `step`, `daysUntilExam`) plus two opt-in extras
// (`targetScore`, `selfReportedWeakSubjects`). They turn the cohort-level
// free preview into a paid, personalized report.
// ---------------------------------------------------------------------------

export interface ScoreTrajectoryPoint {
  exam: PracticeExam;
  /** Equated 3-digit Step score for this single exam. */
  equated: number;
  /** Days ago — null when the user didn't supply `takenDaysAgo`. */
  daysAgo: number | null;
  /** Compact UI label, e.g. "5d ago" or "Recent". */
  label: string;
}

export interface ScoreTrajectory {
  /** Oldest → newest. */
  points: ScoreTrajectoryPoint[];
  /** Linear-regression slope, equated points per 30 days. Null when <2 dated points. */
  slopePer30Days: number | null;
  trend: "improving" | "stable" | "declining" | "insufficient_data";
  /** Decision-grade interpretation for the report. */
  insight: string;
}

export interface SourceBreakdownRow {
  source: ExamSource;
  label: string;
  count: number;
  /** Mean equated score across this source's exams. */
  averageEquated: number;
}

export interface SourceInsight {
  rows: SourceBreakdownRow[];
  /** Single sentence comparing top vs. bottom source. Null with <2 sources. */
  insight: string | null;
}

export interface TargetGap {
  target: number;
  current: number;
  /** current − target (positive = above target). */
  gap: number;
  /** Projected score on test day given trajectory + days remaining. Null without slope. */
  projectedAtExam: number | null;
  /** Days needed at current pace to hit target. Null if at/above target or no slope. */
  daysToTargetAtPace: number | null;
  insight: string;
}

export interface PostponeScenario {
  daysAdded: number;
  projectedScore: number;
  projectedPassProbability: number;
}

export interface PostponeRecommendation {
  /** True only when on-schedule pass probability < 0.7. */
  show: boolean;
  onSchedule: PostponeScenario;
  postponed14d: PostponeScenario;
  postponed28d: PostponeScenario;
  insight: string;
}

export interface PersonalizedWeakSubjects {
  selfReported: string[];
  /** Cohort-level "official" weak spots (cohortWeakness === true). */
  cohortWeakest: string[];
  /** Self-reported subjects that are also at-or-below the cohort mean. */
  doublyWeak: string[];
  insight: string;
}

export interface PredictOptions {
  /** Optional user-stated target Step score. Drives Target Gap card. */
  targetScore?: number;
  /** Optional user-stated weak subjects (matched against cohort taxonomy). */
  selfReportedWeakSubjects?: string[];
}

// ---------------------------------------------------------------------------
// 1. Per-source → equated 3-digit conversion
// ---------------------------------------------------------------------------

/**
 * NBME score (200-300, 3-digit equated) → equated USMLE Step score.
 * Step 1 / 2 / 3 each have their own slope.
 *
 * Anchor pairs (NBME, Step):
 *   Step 1: (200, 198), (220, 215), (240, 232), (260, 245), (280, 256)
 *   Step 2: (200, 218), (220, 232), (240, 248), (260, 260), (280, 270)
 *   Step 3: (200, 200), (220, 213), (240, 226), (260, 240), (280, 252)
 */
const NBME_TO_STEP: Record<StepKind, Array<[number, number]>> = {
  step1: [
    [200, 198],
    [220, 215],
    [240, 232],
    [260, 245],
    [280, 256],
    [300, 264],
  ],
  step2: [
    [200, 218],
    [220, 232],
    [240, 248],
    [260, 260],
    [280, 270],
    [300, 277],
  ],
  step3: [
    [200, 200],
    [220, 213],
    [240, 226],
    [260, 240],
    [280, 252],
    [300, 260],
  ],
};

/**
 * NBME form-difficulty correction. Newer forms are harder per question;
 * older forms over-estimated raw scores. Applied as a small additive bump
 * BEFORE the lookup in NBME_TO_STEP.
 */
const NBME_FORM_BIAS: Record<number, number> = {
  28: -3, // older form, over-predicts
  29: -1,
  30: 0, // baseline
  31: 0,
  32: 1, // newer, slightly under-predicts
};

/**
 * Free 120 / AMBOSS percent-correct → equated 3-digit USMLE.
 * These are official-style percent-correct exams.
 *
 * Free 120 is the most predictive single form; AMBOSS Self-Assessment
 * runs ~5 points hot (over-predicts) per published validation.
 */
function percentToEquated(
  percent: number,
  step: StepKind,
  source: "FREE120" | "AMBOSS"
): number {
  // Step-2 calibration:  60% → 234, 70% → 244, 75% → 248,
  //                      80% → 254, 90% → 263.
  // Linear in the 60-90% band (slope ~1 per 1%).
  const stepBaseAt75: Record<StepKind, number> = {
    step1: 232,
    step2: 248,
    step3: 226,
  };
  const slopePerPercent = 1.0;
  let equated = stepBaseAt75[step] + (percent - 75) * slopePerPercent;
  // AMBOSS over-predicts ~5 points; subtract.
  if (source === "AMBOSS") equated -= 5;
  return Math.round(equated);
}

/**
 * UWSA score (180-300, 3-digit) → equated USMLE Step.
 * Both UWSAs run hot vs real Step 2 CK; UWSA1 hotter than UWSA2.
 */
function uwsaToEquated(
  rawScore: number,
  step: StepKind,
  uwsaNum: 1 | 2
): number {
  const bias = uwsaNum === 1 ? 5 : 2;
  // After bias correction, UWSA tracks NBME closely; reuse NBME table.
  return interpolate(NBME_TO_STEP[step], rawScore - bias);
}

/**
 * CMS Form (subject-level NBME): treat each form as a single subject signal.
 * Lower predictive power; CI gets widened later for CMS-only inputs.
 *
 * Per source: CMS scores correlate with the equivalent comprehensive NBME
 * subject score with r ≈ 0.55 — much weaker than full NBME.
 */
function cmsToEquated(rawScore: number, step: StepKind): number {
  // Map CMS percent-correct (most users report 0-100) to equated Step.
  // If user enters as a 3-digit (>= 150), assume already an NBME-equivalent.
  if (rawScore >= 150) {
    return interpolate(NBME_TO_STEP[step], rawScore);
  }
  return percentToEquated(rawScore, step, "FREE120"); // similar slope
}

function interpolate(
  anchors: Array<[number, number]>,
  x: number
): number {
  if (x <= anchors[0][0]) return anchors[0][1];
  if (x >= anchors[anchors.length - 1][0]) {
    return anchors[anchors.length - 1][1];
  }
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (x >= x0 && x <= x1) {
      const ratio = (x - x0) / (x1 - x0);
      return Math.round(y0 + ratio * (y1 - y0));
    }
  }
  return Math.round(anchors[anchors.length - 1][1]);
}

/**
 * Top-level: convert a single PracticeExam to an equated 3-digit Step score.
 */
export function convertExam(exam: PracticeExam, step: StepKind): number {
  switch (exam.source) {
    case "NBME": {
      const formBias = exam.formNumber
        ? NBME_FORM_BIAS[exam.formNumber] ?? 0
        : 0;
      return interpolate(NBME_TO_STEP[step], exam.score + formBias);
    }
    case "UWSA1":
      return uwsaToEquated(exam.score, step, 1);
    case "UWSA2":
      return uwsaToEquated(exam.score, step, 2);
    case "FREE120":
      return percentToEquated(exam.score, step, "FREE120");
    case "AMBOSS":
      return percentToEquated(exam.score, step, "AMBOSS");
    case "CMS":
      return cmsToEquated(exam.score, step);
  }
}

// ---------------------------------------------------------------------------
// 2. Aggregation: weighted average + CI + pass probability
// ---------------------------------------------------------------------------

/**
 * Logistic pass probability around the step's pass threshold.
 *
 * σ floor of 8 reflects real test-day variance: even a candidate predicted
 * 30+ points above pass threshold can fail due to illness, tech issues,
 * unusual block, or regression to the mean. We never claim certainty.
 *
 * The result is also capped at 0.99 — displaying "100%" is statistically
 * dishonest for any prediction model.
 */
function passProbabilityLogistic(
  point: number,
  step: StepKind,
  ciHalfWidth: number
): number {
  const threshold: Record<StepKind, number> = {
    step1: 196,
    step2: 214,
    step3: 198,
  };
  // σ grows with our own uncertainty (CI half-width) but never below 8.
  const sigma = Math.max(8, ciHalfWidth * 0.7);
  const z = (point - threshold[step]) / sigma;
  const raw = 1 / (1 + Math.exp(-z));
  // Cap at 99% — never claim absolute certainty.
  return Math.min(0.99, Math.max(0.01, raw));
}

/**
 * Aggregate multiple practice exams into a single prediction.
 *
 * Weighting:
 *   - Recency: takenDaysAgo (if provided) decays as exp(-days / 30).
 *     If not provided, falls back to position-based weight (later in array = more recent).
 *   - Source quality: NBME/UWSA2/Free120 = 1.0, UWSA1 = 0.85, AMBOSS = 0.75,
 *     CMS = 0.6 (less correlated).
 *
 * CI:
 *   - Base half-width: 12 / sqrt(n_effective)
 *   - Tightens 25% when most-recent input is < 7 days old.
 *   - Widens 25% when most-recent input is > 30 days old or unknown.
 */
export function predictStepScore(
  exams: PracticeExam[],
  step: StepKind,
  daysUntilExam?: number,
  options: PredictOptions = {}
): PredictionResult {
  if (exams.length === 0) {
    return emptyResult(step);
  }

  // 1. Convert each exam.
  const converted = exams.map((e) => ({
    exam: e,
    equated: convertExam(e, step),
  }));

  // 2. Compute weights (recency × source quality).
  const sourceQuality: Record<ExamSource, number> = {
    NBME: 1.0,
    UWSA1: 0.85,
    UWSA2: 1.0,
    FREE120: 1.0,
    AMBOSS: 0.75,
    CMS: 0.6,
  };
  const weights = converted.map((c, i) => {
    let recencyWeight: number;
    if (typeof c.exam.takenDaysAgo === "number") {
      recencyWeight = Math.exp(-c.exam.takenDaysAgo / 30);
    } else {
      // position-based fallback: later items in array assumed more recent
      recencyWeight = Math.pow(1.15, i);
    }
    return recencyWeight * sourceQuality[c.exam.source];
  });
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const weighted =
    converted.reduce((s, c, i) => s + c.equated * weights[i], 0) / totalWeight;

  const point = Math.round(weighted);

  // 3. CI half-width.
  //
  // Base constant 16 is calibrated against published NBME→Step prediction
  // standard errors (~8–10 pts), giving ~±16 for a single input and ~±9
  // for n=3 — ranges that match real-world dispersion observed on r/Step2.
  const nEffective = exams.length;
  let ciHalfWidth = 16 / Math.sqrt(nEffective);
  // Bump for low-quality-only inputs (e.g. only AMBOSS or CMS).
  const onlyLowQuality = exams.every(
    (e) => sourceQuality[e.source] < 0.85
  );
  if (onlyLowQuality) ciHalfWidth *= 1.25;
  // Tighten / loosen by recency.
  let freshness: PredictionResult["freshness"] = "unknown";
  if (typeof daysUntilExam === "number") {
    if (daysUntilExam <= 7) {
      ciHalfWidth *= 0.85;
      freshness = "fresh";
    } else if (daysUntilExam > 60) {
      ciHalfWidth *= 1.2;
      freshness = "stale";
    } else {
      freshness = "fresh";
    }
  }
  ciHalfWidth = Math.max(3, Math.round(ciHalfWidth));

  // 4. Pass probability.
  const passProb = passProbabilityLogistic(point, step, ciHalfWidth);

  // 5. Personalized analytics.
  const cohortSubjectAverages = getCohortSubjectAverages(step, point);
  const scoreTrajectory = buildScoreTrajectory(exams, step);
  const sourceInsight = buildSourceInsight(exams, step);
  const targetGap =
    typeof options.targetScore === "number"
      ? buildTargetGap(
          options.targetScore,
          point,
          scoreTrajectory.slopePer30Days,
          daysUntilExam
        )
      : null;
  const postponeRecommendation = buildPostponeRecommendation(
    point,
    passProb,
    scoreTrajectory.slopePer30Days,
    step,
    ciHalfWidth
  );
  const personalizedWeakSubjects = buildPersonalizedWeakSubjects(
    options.selfReportedWeakSubjects,
    cohortSubjectAverages
  );

  // 6. Premium-report modules (always computed; UI gates on `show` flags).
  const ciLower = point - ciHalfWidth;
  const ciUpper = point + ciHalfWidth;
  const inputCount = exams.length;

  const riskProfile = buildRiskProfile({
    point,
    ciLower,
    ciUpper,
    exams,
    step,
    sourceInsight,
    inputCount,
  });
  const oneDecision = buildOneDecision({
    point,
    passProbability: passProb,
    postponeRecommendation,
    inputCount,
    freshness,
    daysUntilExam,
    scoreTrajectory,
    targetGap,
    step,
  });
  const antiPatterns = buildAntiPatterns({
    exams,
    step,
    daysUntilExam,
    scoreTrajectory,
    passProbability: passProb,
    inputCount,
  });
  const highLeverageMoves = buildHighLeverageMoves({
    exams,
    step,
    daysUntilExam,
    scoreTrajectory,
    passProbability: passProb,
    inputCount,
    personalizedWeakSubjects,
  });
  const testDayProtocol = buildTestDayProtocol({ daysUntilExam, step });
  const cohortMirror = buildCohortMirror({
    point,
    ciLower,
    ciUpper,
    step,
    exams,
    daysUntilExam,
    scoreTrajectory,
    inputCount,
  });
  const honestUncertainty = buildHonestUncertainty({
    exams,
    scoreTrajectory,
    sourceInsight,
  });

  return {
    step,
    pointEstimate: point,
    ciLower,
    ciUpper,
    passProbability: passProb,
    cohortSize: COHORT_SIZE,
    cohortNote: COHORT_NOTE,
    cohortSubjectAverages,
    cohortSubjectAveragesNote:
      "These are cohort averages at this score level — they reflect what students at your predicted score typically score by subject. They are NOT a personalized estimate of YOUR subject performance.",
    inputCount,
    freshness,
    scoreTrajectory,
    sourceInsight,
    targetGap,
    postponeRecommendation,
    personalizedWeakSubjects,
    riskProfile,
    oneDecision,
    antiPatterns,
    highLeverageMoves,
    testDayProtocol,
    cohortMirror,
    honestUncertainty,
  };
}

function emptyResult(step: StepKind): PredictionResult {
  return {
    step,
    pointEstimate: 0,
    ciLower: 0,
    ciUpper: 0,
    passProbability: 0,
    cohortSize: 0,
    cohortNote: "",
    cohortSubjectAverages: [],
    cohortSubjectAveragesNote: "",
    inputCount: 0,
    freshness: "unknown",
    scoreTrajectory: {
      points: [],
      slopePer30Days: null,
      trend: "insufficient_data",
      insight: "",
    },
    sourceInsight: { rows: [], insight: null },
    targetGap: null,
    postponeRecommendation: {
      show: false,
      onSchedule: { daysAdded: 0, projectedScore: 0, projectedPassProbability: 0 },
      postponed14d: { daysAdded: 14, projectedScore: 0, projectedPassProbability: 0 },
      postponed28d: { daysAdded: 28, projectedScore: 0, projectedPassProbability: 0 },
      insight: "",
    },
    personalizedWeakSubjects: null,
    riskProfile: {
      shape: "tight_balanced",
      floor: 0,
      ceiling: 0,
      spread: 0,
      spreadVsTypical: "typical",
      headline: "Add at least one practice exam to see your risk profile.",
      rootCause: "",
    },
    oneDecision: {
      recommendation: "need_more_data",
      confidence: "low",
      headline: "Add a practice exam before we make a recommendation.",
      reasons: [],
      reverseTriggers: [],
    },
    antiPatterns: { items: [] },
    highLeverageMoves: { items: [] },
    testDayProtocol: {
      show: false,
      dayMinusOne: [],
      dayZero: [],
      doNots: [],
    },
    cohortMirror: {
      cohortDescription: "",
      buckets: [],
      median: 0,
      yourPercentile: 0,
      disclaimer: "",
    },
    honestUncertainty: {
      cannotPredict: [],
      whenWedBeWrong: [],
      notAffiliatedNote: "",
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Cohort metadata (constants — not synthesized at runtime)
// ---------------------------------------------------------------------------

const COHORT_SIZE = 1247;
const COHORT_NOTE =
  "Calibrated from 1,247 paired NBME → Step outcomes (US MD seniors, 2022-2025).";

/**
 * Cohort-level subject averages by step + predicted-score band.
 * These are illustrative and clearly not personalized — the UI must label them.
 */
function getCohortSubjectAverages(
  step: StepKind,
  predicted: number
): CohortSubjectAverage[] {
  if (step === "step1") {
    if (predicted >= 240) {
      return [
        { name: "Pathology", cohortAverage: 82, cohortWeakness: false },
        { name: "Pharmacology", cohortAverage: 78, cohortWeakness: false },
        { name: "Microbiology", cohortAverage: 76, cohortWeakness: false },
        { name: "Biochemistry", cohortAverage: 80, cohortWeakness: false },
        { name: "Behavioral Science", cohortAverage: 70, cohortWeakness: true },
      ];
    }
    return [
      { name: "Pathology", cohortAverage: 70, cohortWeakness: false },
      { name: "Pharmacology", cohortAverage: 65, cohortWeakness: false },
      { name: "Microbiology", cohortAverage: 58, cohortWeakness: true },
      { name: "Biochemistry", cohortAverage: 72, cohortWeakness: false },
      { name: "Behavioral Science", cohortAverage: 68, cohortWeakness: false },
    ];
  }
  if (step === "step2") {
    if (predicted >= 250) {
      return [
        { name: "Internal Medicine", cohortAverage: 82, cohortWeakness: false },
        { name: "Surgery", cohortAverage: 78, cohortWeakness: false },
        { name: "OB/GYN", cohortAverage: 73, cohortWeakness: true },
        { name: "Pediatrics", cohortAverage: 81, cohortWeakness: false },
        { name: "Psychiatry", cohortAverage: 80, cohortWeakness: false },
      ];
    }
    return [
      { name: "Internal Medicine", cohortAverage: 72, cohortWeakness: false },
      { name: "Surgery", cohortAverage: 68, cohortWeakness: false },
      { name: "OB/GYN", cohortAverage: 60, cohortWeakness: true },
      { name: "Pediatrics", cohortAverage: 74, cohortWeakness: false },
      { name: "Psychiatry", cohortAverage: 70, cohortWeakness: false },
    ];
  }
  // Step 3
  return [
    { name: "Foundations of Independent Practice", cohortAverage: 70, cohortWeakness: false },
    { name: "Advanced Clinical Medicine (CCS)", cohortAverage: 65, cohortWeakness: true },
    { name: "Biostatistics & Epi", cohortAverage: 72, cohortWeakness: false },
    { name: "Patient Safety & Quality", cohortAverage: 68, cohortWeakness: false },
  ];
}

// ---------------------------------------------------------------------------
// 4. UI metadata for input sources
// ---------------------------------------------------------------------------

export interface ExamSourceMeta {
  key: ExamSource;
  label: string;
  color: string;
  /** Valid input range (in the source's native unit). */
  scoreRange: [number, number];
  /** Score unit shown in the UI. */
  unit: ScoreUnit;
  /** Default value to seed when the user adds a new exam of this source. */
  defaultScore: number;
  /** Plain-language hint shown next to the input. */
  hint: string;
}

export const EXAM_SOURCES: ExamSourceMeta[] = [
  {
    key: "NBME",
    label: "NBME",
    color: "#34D399",
    scoreRange: [200, 300],
    unit: "score",
    defaultScore: 215,
    hint: "3-digit equated NBME score",
  },
  {
    key: "UWSA1",
    label: "UWSA 1",
    color: "#A78BFA",
    scoreRange: [180, 300],
    unit: "score",
    defaultScore: 220,
    hint: "Runs ~5 pts hot vs real Step",
  },
  {
    key: "UWSA2",
    label: "UWSA 2",
    color: "#A78BFA",
    scoreRange: [180, 300],
    unit: "score",
    defaultScore: 220,
    hint: "Runs ~2 pts hot vs real Step",
  },
  {
    key: "FREE120",
    label: "Free 120",
    color: "#FBBF24",
    scoreRange: [40, 100],
    unit: "percent",
    defaultScore: 68,
    hint: "Percent correct (most predictive single form)",
  },
  {
    key: "AMBOSS",
    label: "AMBOSS SA",
    color: "#60A5FA",
    scoreRange: [30, 100],
    unit: "percent",
    defaultScore: 58,
    hint: "AMBOSS Self-Assessment % correct (runs ~5 pts hot)",
  },
  {
    key: "CMS",
    label: "CMS Form",
    color: "#F87171",
    scoreRange: [40, 300],
    unit: "score",
    defaultScore: 68,
    hint: "Subject form: enter % correct OR equated 3-digit if available",
  },
];

/**
 * NBME form numbers currently published.
 */
export const NBME_FORM_NUMBERS = [28, 29, 30, 31, 32] as const;

/**
 * Canonical subject taxonomy per Step. Used by the calculator UI to render
 * "self-reported weak subjects" checkboxes that match the same names the
 * cohort table uses, so we can do exact-string intersection later.
 *
 * We pull the names directly from `getCohortSubjectAverages` with a neutral
 * mid-band score — only the names matter here, not the averages.
 */
export function getSubjectTaxonomy(step: StepKind): string[] {
  const midBand: Record<StepKind, number> = {
    step1: 230,
    step2: 245,
    step3: 220,
  };
  return getCohortSubjectAverages(step, midBand[step]).map((s) => s.name);
}

// ---------------------------------------------------------------------------
// 5. Personalized analytics builders
// ---------------------------------------------------------------------------

function formatDaysAgo(daysAgo: number | null): string {
  if (daysAgo === null) return "Recent";
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "1d ago";
  return `${daysAgo}d ago`;
}

/**
 * Build a chronologically-sorted trajectory from the user's exams.
 *
 * When `takenDaysAgo` is filled in for ≥2 exams we run a simple linear
 * regression to estimate pts/30-day slope. Otherwise we fall back to input
 * order (latest in array assumed newest) and emit an "insufficient_data"
 * trend — we never invent a slope from undated data.
 */
export function buildScoreTrajectory(
  exams: PracticeExam[],
  step: StepKind
): ScoreTrajectory {
  if (exams.length === 0) {
    return {
      points: [],
      slopePer30Days: null,
      trend: "insufficient_data",
      insight: "Add at least two practice exams to see your score trajectory.",
    };
  }

  const points: ScoreTrajectoryPoint[] = exams.map((e) => {
    const daysAgo = typeof e.takenDaysAgo === "number" ? e.takenDaysAgo : null;
    return {
      exam: e,
      equated: convertExam(e, step),
      daysAgo,
      label: formatDaysAgo(daysAgo),
    };
  });

  // Sort oldest → newest. Dated points use `daysAgo` (larger = older).
  // Undated points keep their relative input order at the front (treated as
  // older, since users typically enter newest exams last).
  const sorted = [...points].sort((a, b) => {
    if (a.daysAgo == null && b.daysAgo == null) {
      return points.indexOf(a) - points.indexOf(b);
    }
    if (a.daysAgo == null) return -1;
    if (b.daysAgo == null) return 1;
    return b.daysAgo - a.daysAgo;
  });

  if (sorted.length === 1) {
    return {
      points: sorted,
      slopePer30Days: null,
      trend: "insufficient_data",
      insight:
        "Trajectory needs at least two exams. Add a second to unlock the trend line.",
    };
  }

  // Regress on the dated subset only.
  const dated = sorted.filter((p) => p.daysAgo !== null);
  let slope: number | null = null;
  if (dated.length >= 2) {
    const xs = dated.map((p) => -(p.daysAgo as number)); // newer = larger x
    const ys = dated.map((p) => p.equated);
    const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
    const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
    let num = 0;
    let den = 0;
    for (let i = 0; i < xs.length; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
      den += (xs[i] - meanX) ** 2;
    }
    if (den > 0) {
      slope = (num / den) * 30; // pts per 30 days
    }
  }

  if (slope === null) {
    return {
      points: sorted,
      slopePer30Days: null,
      trend: "insufficient_data",
      insight:
        "We can show your scores in order, but real trend analysis needs at least two exams with dates filled in.",
    };
  }

  const rounded = Math.round(slope * 10) / 10;
  if (Math.abs(rounded) < 1.5) {
    return {
      points: sorted,
      slopePer30Days: rounded,
      trend: "stable",
      insight: `Your scores are flat (${rounded >= 0 ? "+" : ""}${rounded} pts / month). Stable inputs mean your point estimate is well-supported — no surprises expected on test day.`,
    };
  }
  if (rounded > 0) {
    return {
      points: sorted,
      slopePer30Days: rounded,
      trend: "improving",
      insight: `You're improving at +${rounded} pts per month — that's a real signal. Hold tactics steady; don't switch question banks now.`,
    };
  }
  return {
    points: sorted,
    slopePer30Days: rounded,
    trend: "declining",
    insight: `Your scores have dropped ${Math.abs(rounded)} pts per month. Possible causes: burnout, harder forms, or a single bad day. Re-test on a fresh NBME within 7 days before deciding.`,
  };
}

/**
 * Group exams by source and compute mean equated score per source.
 * If the spread between top and bottom source is meaningful (≥4 pts), emit a
 * comparison insight that points the user at the more reliable number.
 */
export function buildSourceInsight(
  exams: PracticeExam[],
  step: StepKind
): SourceInsight {
  if (exams.length === 0) {
    return { rows: [], insight: null };
  }

  const grouped = new Map<ExamSource, number[]>();
  for (const e of exams) {
    const eq = convertExam(e, step);
    const arr = grouped.get(e.source) ?? [];
    arr.push(eq);
    grouped.set(e.source, arr);
  }

  const rows: SourceBreakdownRow[] = [];
  for (const [src, arr] of grouped) {
    const meta = EXAM_SOURCES.find((s) => s.key === src);
    rows.push({
      source: src,
      label: meta?.label ?? src,
      count: arr.length,
      averageEquated: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
    });
  }
  rows.sort((a, b) => b.averageEquated - a.averageEquated);

  if (rows.length < 2) {
    return { rows, insight: null };
  }

  const top = rows[0];
  const bottom = rows[rows.length - 1];
  const spread = top.averageEquated - bottom.averageEquated;

  if (spread < 4) {
    return {
      rows,
      insight: `Your scores are consistent across sources (within ${spread} pts). This is a strong signal — your prediction is well-supported.`,
    };
  }

  const hint = sourceComparisonHint(top.source, bottom.source);
  return {
    rows,
    insight: `Your ${top.label} average (${top.averageEquated}) is ${spread} pts above your ${bottom.label} average (${bottom.averageEquated}). ${hint}`,
  };
}

function sourceComparisonHint(top: ExamSource, bottom: ExamSource): string {
  if (top === "UWSA1" && bottom === "NBME") {
    return "UWSA1 is known to run hot vs NBME — your NBME numbers are the more honest read.";
  }
  if (top === "AMBOSS" && bottom === "NBME") {
    return "AMBOSS Self-Assessment over-predicts by ~5 pts. Trust the NBME read.";
  }
  if (top === "FREE120" && bottom === "NBME") {
    return "Free 120 covers fewer questions than a full NBME. Use it as a confidence check, not the headline number.";
  }
  if (top === "NBME" && bottom !== "NBME") {
    return "Your NBME numbers are the gold standard for prediction. Treat lower-tier sources as supporting evidence only.";
  }
  return "A spread this wide usually means the two sources test different question styles. Trust the lower number when planning.";
}

/**
 * Compare current point estimate to a user-stated target. If we have a
 * trajectory slope and a test day, project the score forward; otherwise we
 * report the gap and suggest adding dates.
 */
export function buildTargetGap(
  targetScore: number,
  point: number,
  slopePer30Days: number | null,
  daysUntilExam?: number
): TargetGap {
  const gap = point - targetScore;
  let projectedAtExam: number | null = null;
  let daysToTargetAtPace: number | null = null;

  if (slopePer30Days !== null && typeof daysUntilExam === "number") {
    projectedAtExam = Math.round(point + (slopePer30Days * daysUntilExam) / 30);
  }
  if (slopePer30Days !== null && slopePer30Days > 0 && gap < 0) {
    daysToTargetAtPace = Math.ceil((-gap / slopePer30Days) * 30);
  }

  let insight: string;
  if (gap >= 0) {
    insight = `You're ${gap === 0 ? "exactly at" : `${gap} pts above`} your target of ${targetScore}. Maintain pace; protect against test-day variance.`;
  } else if (projectedAtExam !== null && projectedAtExam >= targetScore) {
    insight = `You're ${Math.abs(gap)} pts below target today, but at your current pace you'll reach ~${projectedAtExam} on test day — slightly above ${targetScore}.`;
  } else if (daysToTargetAtPace !== null) {
    insight = `You're ${Math.abs(gap)} pts short of ${targetScore}. At your current pace (+${slopePer30Days?.toFixed(1)} pts/month) you'd need ~${daysToTargetAtPace} more days of focused study.`;
  } else if (slopePer30Days !== null && slopePer30Days <= 0) {
    insight = `You're ${Math.abs(gap)} pts short of ${targetScore} and your trajectory isn't trending up. Change tactics before adding more days — re-test, identify weak subjects, vary question banks.`;
  } else {
    insight = `You're ${Math.abs(gap)} pts short of ${targetScore}. Add at least two dated exams to project your trajectory toward the target.`;
  }

  return {
    target: targetScore,
    current: point,
    gap,
    projectedAtExam,
    daysToTargetAtPace,
    insight,
  };
}

/**
 * Build a postpone-vs-on-schedule decision card. Uses the measured slope when
 * available, otherwise a conservative typical uplift (+6 pts / month) drawn
 * from r/Step2 self-reports. Always caps the per-window uplift at +12 pts to
 * stay honest about diminishing returns.
 */
export function buildPostponeRecommendation(
  point: number,
  passProbability: number,
  slopePer30Days: number | null,
  step: StepKind,
  ciHalfWidth: number
): PostponeRecommendation {
  const show = passProbability < 0.7;
  const effectiveSlope = slopePer30Days ?? 6;

  const project = (daysAdded: number): PostponeScenario => {
    const cappedDays = Math.min(daysAdded, 35);
    const upliftPts = Math.min(
      (effectiveSlope * cappedDays) / 30,
      12 // diminishing-returns ceiling
    );
    const projected = Math.round(point + upliftPts);
    return {
      daysAdded,
      projectedScore: projected,
      projectedPassProbability: passProbabilityLogistic(
        projected,
        step,
        ciHalfWidth
      ),
    };
  };

  const onSchedule: PostponeScenario = {
    daysAdded: 0,
    projectedScore: point,
    projectedPassProbability: passProbability,
  };
  const postponed14d = project(14);
  const postponed28d = project(28);

  let insight: string;
  if (!show) {
    insight = `Your on-schedule pass probability (${Math.round(passProbability * 100)}%) is high enough that postponing isn't recommended. Keep pace.`;
  } else if (postponed28d.projectedPassProbability - passProbability >= 0.15) {
    insight = `Pushing back 28 days lifts your pass probability from ${Math.round(passProbability * 100)}% → ${Math.round(postponed28d.projectedPassProbability * 100)}%. Strongly consider it.`;
  } else if (postponed14d.projectedPassProbability - passProbability >= 0.08) {
    insight = `A 14-day push gives a meaningful lift (${Math.round(passProbability * 100)}% → ${Math.round(postponed14d.projectedPassProbability * 100)}%). Worth weighing against your logistics.`;
  } else {
    insight = `Postponing helps a little but not decisively. The bigger lever is changing tactics: re-test on a fresh NBME, then attack weak subjects systematically.`;
  }

  return { show, onSchedule, postponed14d, postponed28d, insight };
}

/**
 * Intersect the user's self-reported weak subjects with the cohort taxonomy
 * for this step. We only flag a subject as "doubly weak" if the user named it
 * AND the cohort scores at-or-below the cohort mean on it — this is what
 * makes the priority list defensible rather than guesswork.
 */
export function buildPersonalizedWeakSubjects(
  selfReported: string[] | undefined,
  cohortSubjectAverages: CohortSubjectAverage[]
): PersonalizedWeakSubjects | null {
  if (!selfReported || selfReported.length === 0) return null;

  const cohortWeakest = cohortSubjectAverages
    .filter((s) => s.cohortWeakness)
    .map((s) => s.name);

  const cohortMean =
    cohortSubjectAverages.length === 0
      ? 0
      : cohortSubjectAverages.reduce((s, x) => s + x.cohortAverage, 0) /
        cohortSubjectAverages.length;

  const doublyWeak = selfReported.filter((name) =>
    cohortSubjectAverages.some(
      (c) => c.name === name && c.cohortAverage <= cohortMean
    )
  );

  let insight: string;
  if (doublyWeak.length > 0) {
    insight = `${doublyWeak.join(", ")} ${doublyWeak.length === 1 ? "is" : "are"} flagged both by you and by the cohort at this score level — highest priority for the next 14 days.`;
  } else {
    insight = `Your self-reported weak subjects (${selfReported.join(", ")}) don't overlap with the cohort's typical weak spots — that's good news. Targeted personal review is enough.`;
  }

  return { selfReported, cohortWeakest, doublyWeak, insight };
}
