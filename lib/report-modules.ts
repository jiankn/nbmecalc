/**
 * Premium Report Modules
 * ======================
 *
 * Seven decision-grade modules that turn the same inputs the free calculator
 * receives into a paid report users will recommend to their study group.
 *
 * Design principle (PRD §4 + product strategy review):
 *   The report does NOT sell "a prettier prediction". It sells:
 *     1. A fact the user can't find on Reddit (Risk Profile, Cohort Mirror)
 *     2. A decision the user has been agonizing over (One Decision)
 *     3. Today's specific moves (High-Leverage Moves, Anti-Patterns)
 *     4. Pre-flight protocol (Test Day Protocol)
 *     5. Honest limitations that build trust (Honest Uncertainty)
 *
 * All builders are pure functions. They read pre-computed signals from
 * `predictStepScore` (point estimate, CI, trajectory, source insight, etc.)
 * and never re-run the prediction. This guarantees report content stays
 * consistent with the headline number across web view, PDF, and rate-limited
 * server logs.
 *
 * Cohort numbers are MODEL-PROJECTED, not real-user-derived. The disclaimer
 * is part of every cohort-touching output — see `buildCohortMirror`.
 */
import type {
  ExamSource,
  PracticeExam,
  StepKind,
  ScoreTrajectory,
  SourceInsight,
  TargetGap,
  PostponeRecommendation,
  PersonalizedWeakSubjects,
} from "./data";

// ---------------------------------------------------------------------------
// 1. Risk Profile — answers "what's my real downside?" beyond pass/fail.
// ---------------------------------------------------------------------------

export interface RiskProfile {
  /**
   * Shape of the prediction band. Used by UI to pick tone + headline.
   * - asymmetric_downside: a known-hot source (UWSA1, AMBOSS) is inflating
   *   the ceiling, so the floor is more credible than the ceiling.
   * - asymmetric_upside: NBME (most trustworthy) is the top source while
   *   weaker sources drag the floor down — the ceiling is more credible.
   * - tight_balanced: sources agree, narrow CI.
   * - wide_balanced: sources roughly agree, but few inputs → wide CI.
   */
  shape: "asymmetric_downside" | "asymmetric_upside" | "tight_balanced" | "wide_balanced";
  floor: number;
  ceiling: number;
  spread: number;
  /** Whether `spread` is meaningfully wider/tighter than the n-input baseline. */
  spreadVsTypical: "tighter" | "typical" | "wider";
  /** Single-sentence verdict the report can render as a headline. */
  headline: string;
  /** Which input pattern is driving the asymmetry — names the root cause. */
  rootCause: string;
}

export function buildRiskProfile(input: {
  point: number;
  ciLower: number;
  ciUpper: number;
  exams: PracticeExam[];
  step: StepKind;
  sourceInsight: SourceInsight;
  inputCount: number;
}): RiskProfile {
  const floor = input.ciLower;
  const ceiling = input.ciUpper;
  const spread = ceiling - floor;

  // Typical CI half-width is calibrated against ~16/√n in `predictStepScore`.
  // For n=2 that's ~22 pts spread; for n=3 ~18 pts; for n=4 ~16 pts.
  const n = Math.max(1, input.inputCount);
  const typicalSpread = Math.round((16 / Math.sqrt(n)) * 2);
  const spreadVsTypical: RiskProfile["spreadVsTypical"] =
    spread <= typicalSpread - 3
      ? "tighter"
      : spread >= typicalSpread + 3
        ? "wider"
        : "typical";

  // Asymmetry detection: which side of the CI is being pulled?
  const sourceRows = input.sourceInsight.rows;
  const sourceSpread =
    sourceRows.length >= 2
      ? sourceRows[0].averageEquated -
        sourceRows[sourceRows.length - 1].averageEquated
      : 0;

  let shape: RiskProfile["shape"] = "tight_balanced";
  let rootCause: string;

  if (sourceSpread >= 6 && sourceRows.length >= 2) {
    const top = sourceRows[0];
    const bottom = sourceRows[sourceRows.length - 1];
    const hotSources: ExamSource[] = ["UWSA1", "AMBOSS"];

    if (hotSources.includes(top.source)) {
      shape = "asymmetric_downside";
      rootCause = `Your ${top.label} average (${top.averageEquated}) sits ${sourceSpread} pts above your ${bottom.label} average (${bottom.averageEquated}). ${top.label} is known to over-predict the real exam. Your floor is the more credible read.`;
    } else if (top.source === "NBME" && !hotSources.includes(bottom.source)) {
      shape = "asymmetric_upside";
      rootCause = `Your NBME average (${top.averageEquated}) is your strongest signal — and it sits ${sourceSpread} pts above your other inputs. NBME is the gold standard for prediction; the ceiling is more trustworthy than the spread suggests.`;
    } else if (bottom.source === "NBME" && !hotSources.includes(top.source)) {
      shape = "asymmetric_downside";
      rootCause = `Your NBME numbers (${bottom.averageEquated}) sit ${sourceSpread} pts below your other sources. NBME is the most trustworthy single signal — your real ceiling is closer to that lower number, not the higher ones.`;
    } else {
      shape = spread >= typicalSpread + 3 ? "wide_balanced" : "tight_balanced";
      rootCause = `Your sources span ${sourceSpread} pts but no single source is clearly more reliable than the others. Treat the point estimate as the honest middle.`;
    }
  } else if (spread >= typicalSpread + 3) {
    shape = "wide_balanced";
    rootCause = `Your CI spans ${spread} pts mostly because you have ${input.inputCount} input${input.inputCount === 1 ? "" : "s"}. One or two more inputs from a different source would tighten this materially.`;
  } else {
    shape = "tight_balanced";
    rootCause = `Your sources agree within a narrow band — that's a strong signal that this prediction is well-supported, not a single-exam fluke.`;
  }

  const headlineByShape: Record<RiskProfile["shape"], string> = {
    asymmetric_downside: `You have more downside risk than upside. Plan for your floor (${floor}), not your ceiling (${ceiling}).`,
    asymmetric_upside: `Your ceiling (${ceiling}) is well-supported. Lower-quality inputs are dragging your floor down — trust the higher number.`,
    tight_balanced: `Your prediction band is tight (${floor}–${ceiling}). The model has high confidence in this estimate.`,
    wide_balanced: `Your prediction spans ${spread} pts (${floor}–${ceiling}). This wider band reflects genuine uncertainty in your inputs.`,
  };

  return {
    shape,
    floor,
    ceiling,
    spread,
    spreadVsTypical,
    headline: headlineByShape[shape],
    rootCause,
  };
}

// ---------------------------------------------------------------------------
// 2. The One Decision — replace selectable options with one clear recommendation
//    plus the conditions under which we'd reverse it. This is the headline
//    payoff for users paralyzed between sit/postpone.
// ---------------------------------------------------------------------------

export interface OneDecision {
  recommendation:
    | "sit_as_scheduled"
    | "postpone_14d"
    | "postpone_28d"
    | "need_more_data";
  /** Confidence in the recommendation, NOT in the score. */
  confidence: "high" | "moderate" | "low";
  headline: string;
  /** 2-4 reasons supporting the recommendation. Always populated. */
  reasons: string[];
  /** Conditions under which we'd flip the recommendation. Always populated. */
  reverseTriggers: string[];
}

export function buildOneDecision(input: {
  point: number;
  passProbability: number;
  postponeRecommendation: PostponeRecommendation;
  inputCount: number;
  freshness: "fresh" | "stale" | "unknown";
  daysUntilExam?: number;
  scoreTrajectory: ScoreTrajectory;
  targetGap: TargetGap | null;
  step: StepKind;
}): OneDecision {
  // Need more data — we won't recommend a sit/postpone with one input.
  if (input.inputCount < 2) {
    return {
      recommendation: "need_more_data",
      confidence: "low",
      headline:
        "Add a second practice exam before we make a sit/postpone call.",
      reasons: [
        "A single input can't tell us whether your score is stable or noisy.",
        "Single-source predictions widen our CI by ~25%.",
        "The cheapest move you can make right now is one more NBME or UWSA.",
      ],
      reverseTriggers: [
        "Once you add a second input, refresh this report — we'll re-evaluate.",
      ],
    };
  }

  const passProb = input.passProbability;
  const lift14 =
    input.postponeRecommendation.postponed14d.projectedPassProbability -
    passProb;
  const lift28 =
    input.postponeRecommendation.postponed28d.projectedPassProbability -
    passProb;

  // Strong postpone signal: pass probability < 0.5 AND 28-day lift is meaningful
  if (passProb < 0.5 && lift28 >= 0.15) {
    return {
      recommendation: "postpone_28d",
      // <= 0.3 (not <) so 30% lands in "high confidence postpone" — the
      // user's intuition matches: a 30% pass probability is decisively low.
      confidence: passProb <= 0.3 ? "high" : "moderate",
      headline: `Postpone 28 days. Your on-schedule pass probability (${Math.round(passProb * 100)}%) is below the safety threshold.`,
      reasons: [
        `Pushing back 28 days lifts your pass probability from ${Math.round(passProb * 100)}% to ${Math.round((passProb + lift28) * 100)}%.`,
        input.scoreTrajectory.trend === "improving"
          ? "Your trajectory is still improving — more time = real gains."
          : "Your scores aren't yet stable — sitting now is unnecessary risk.",
        "The financial and timeline cost of postponing is small compared to the cost of a failed attempt and forced retake.",
      ],
      reverseTriggers: [
        "Your next NBME comes in significantly higher than your trajectory predicts (+10 pts or more).",
        "You can guarantee >= 4 hours/day of uninterrupted study during the postponement window.",
      ],
    };
  }

  // Moderate postpone signal: borderline + meaningful 14-day lift
  if (passProb < 0.7 && lift14 >= 0.08) {
    return {
      recommendation: "postpone_14d",
      confidence: "moderate",
      headline: `Consider postponing 14 days. Pass probability lifts from ${Math.round(passProb * 100)}% to ${Math.round((passProb + lift14) * 100)}%.`,
      reasons: [
        "14 days is enough to consolidate weak areas without losing momentum.",
        input.scoreTrajectory.trend === "improving"
          ? "Your trajectory suggests there's more score still to extract."
          : "Sitting at borderline pass probability is a high-variance bet on test-day luck.",
        "The marginal gain from 14 more days exceeds the marginal cost for most candidates.",
      ],
      reverseTriggers: [
        "Your next NBME drops below your current floor estimate.",
        "You experience >5 consecutive days of disrupted study.",
      ],
    };
  }

  // Default: sit as scheduled
  const reverseTriggers: string[] = [
    "Your next NBME drops more than 5 pts below your current floor estimate.",
    "You experience >5 consecutive days of disrupted study.",
  ];
  if (input.daysUntilExam && input.daysUntilExam >= 14) {
    reverseTriggers.push(
      "Your Free 120 (recommended ~7 days out) comes back below 70%.",
    );
  }

  const confidence: OneDecision["confidence"] =
    passProb >= 0.9 ? "high" : passProb >= 0.75 ? "moderate" : "low";

  const reasons: string[] = [];
  if (input.scoreTrajectory.trend === "improving") {
    reasons.push("Your trajectory is positive — your score is still climbing.");
  } else if (input.scoreTrajectory.trend === "stable") {
    reasons.push(
      "Your scores are stable — the model has high confidence in your estimate.",
    );
  }
  if (lift14 < 0.05) {
    reasons.push(
      `Postponing 14 days only lifts your pass probability by ${Math.round(lift14 * 100)} pts. The marginal gain doesn't justify the cost.`,
    );
  }
  if (input.daysUntilExam !== undefined && input.daysUntilExam <= 7) {
    reasons.push(
      "With less than 7 days left, your prediction is at peak freshness — postponing is no longer the high-leverage move.",
    );
  }
  if (input.targetGap && input.targetGap.gap >= 0) {
    reasons.push(
      `You're at or above your target score (${input.targetGap.target}).`,
    );
  }
  if (reasons.length === 0) {
    reasons.push("Your inputs support sitting as scheduled.");
  }

  return {
    recommendation: "sit_as_scheduled",
    confidence,
    headline: "Sit as scheduled. Your inputs support taking the exam on your current date.",
    reasons,
    reverseTriggers,
  };
}

// ---------------------------------------------------------------------------
// 3. Anti-Patterns — what NOT to do, derived from input pattern.
//    This is the section users screenshot and share, because nobody on
//    Reddit will tell them "stop taking more NBMEs".
// ---------------------------------------------------------------------------

export interface AntiPattern {
  title: string;
  reason: string;
  basedOn: string;
}

export interface AntiPatterns {
  items: AntiPattern[];
}

export function buildAntiPatterns(input: {
  exams: PracticeExam[];
  step: StepKind;
  daysUntilExam?: number;
  scoreTrajectory: ScoreTrajectory;
  passProbability: number;
  inputCount: number;
}): AntiPatterns {
  const items: AntiPattern[] = [];
  const days = input.daysUntilExam ?? 21;
  const sources = new Set(input.exams.map((e) => e.source));

  // Final week: no full exams. Highest priority — overrides earlier rules.
  if (days <= 5) {
    items.push({
      title: "Do not take another full-length practice exam",
      reason:
        "At <5 days, fatigue from a 4-hour form costs more than any signal it provides. Light review only.",
      basedOn: `${days} days until test day.`,
    });
  }

  // Enough inputs already → don't over-test
  if (input.inputCount >= 3 && days >= 6 && days < 21) {
    items.push({
      title: "Do not take another full NBME before day 18",
      reason:
        "Your 3+ exam input is statistically sufficient. Another full form adds noise, not signal, and burns 4 hours you'd spend better on targeted review.",
      basedOn: `${input.inputCount} exams already submitted, ${days} days to test day.`,
    });
  }

  // Late stage: don't switch banks
  if (days <= 21 && days > 5) {
    items.push({
      title: "Do not switch question banks now",
      reason:
        "Resource switching at <21 days has negative expected value. The unfamiliarity penalty exceeds any incremental content gain.",
      basedOn: `${days} days until test day.`,
    });
  }

  // Late stage: no new resources
  if (days <= 14 && days > 5) {
    items.push({
      title: "Do not start new content resources",
      reason:
        "Anki decks, video series, and new books at <14 days compound fatigue without proportional gain. Stick with what you've internalized.",
      basedOn: `${days} days until test day.`,
    });
  }

  // Stable/improving trajectory: don't chase 100%
  if (
    input.scoreTrajectory.trend === "stable" ||
    input.scoreTrajectory.trend === "improving"
  ) {
    items.push({
      title: "Do not chase 'feeling 100% confident'",
      reason:
        "Top scorers consistently report 70-80% confidence walking in. Calibration matters more than perfection — chasing certainty leads to over-study and burnout.",
      basedOn: `Your trajectory is ${input.scoreTrajectory.trend}.`,
    });
  }

  // Hot source in inputs → don't anchor expectations to it
  if (sources.has("UWSA1") || sources.has("AMBOSS")) {
    const inflated: ExamSource = sources.has("UWSA1") ? "UWSA1" : "AMBOSS";
    const label = inflated === "UWSA1" ? "UWSA1" : "AMBOSS Self-Assessment";
    items.push({
      title: `Do not anchor your expectations to your ${label} score`,
      reason: `${label} receives an internal source adjustment that is not an official conversion. Do not anchor a high-stakes decision to one input.`,
      basedOn: `You submitted a ${label} score.`,
    });
  }

  // Free 120 not yet taken AND we're not in the right window
  if (!sources.has("FREE120") && days > 14 && days <= 28) {
    items.push({
      title: "Do not take Free 120 yet",
      reason:
        "Save an official-style sample for a point when the result can still inform review. There is no verified universal timing window.",
      basedOn: "Free 120 not yet taken; test day still >14 days away.",
    });
  }

  // CMS only → not enough signal
  if (input.exams.every((e) => e.source === "CMS")) {
    items.push({
      title: "Do not rely on CMS forms alone",
      reason:
        "CMS forms are subject-focused and do not replace the comprehensive assessment aligned with your target exam.",
      basedOn: "Your inputs are all CMS forms.",
    });
  }

  // Cap at 5; we want decisive copy, not a wall of text
  return { items: items.slice(0, 5) };
}

// ---------------------------------------------------------------------------
// 4. High-Leverage Moves — exactly 3 actions ranked by expected impact.
//    Replaces the 14-day plan, which users skim and forget.
// ---------------------------------------------------------------------------

export interface HighLeverageMove {
  rank: number;
  title: string;
  expectedImpact: string;
  why: string;
  when: string;
}

export interface HighLeverageMoves {
  items: HighLeverageMove[];
}

export function buildHighLeverageMoves(input: {
  exams: PracticeExam[];
  step: StepKind;
  daysUntilExam?: number;
  scoreTrajectory: ScoreTrajectory;
  passProbability: number;
  inputCount: number;
  personalizedWeakSubjects: PersonalizedWeakSubjects | null;
}): HighLeverageMoves {
  const candidates: Omit<HighLeverageMove, "rank">[] = [];
  const days = input.daysUntilExam ?? 21;
  const sources = new Set(input.exams.map((e) => e.source));
  const hasNbme = sources.has("NBME");
  const hasFree120 = sources.has("FREE120");

  // Highest-impact universal move: schedule Free 120 at the right time
  if (!hasFree120 && days >= 5 && days <= 28) {
    const targetWindow = Math.min(days, 10);
    candidates.push({
      title: `Take Free 120 about ${targetWindow} days before exam`,
      expectedImpact: "Adds another official-style readiness signal",
      why: "A sample assessment can complement a recent comprehensive result. Use agreement across inputs rather than an unpublished accuracy ranking.",
      when: `Around ${days - targetWindow} days from now (with ${targetWindow} days remaining).`,
    });
  }

  // Trajectory declining → re-test to disambiguate
  if (input.scoreTrajectory.trend === "declining") {
    candidates.push({
      title: "Re-test on a fresh NBME within 7 days",
      expectedImpact: "Disambiguates a real trend from a single bad day",
      why: "A declining trajectory could be burnout, harder forms, or noise. One more NBME tells you which — and that determines whether you postpone or push.",
      when: "Within the next 7 days, on a form you haven't seen.",
    });
  }

  // Single input → add a second
  if (input.inputCount === 1) {
    candidates.push({
      title: "Add a second practice exam from a different source",
      expectedImpact: "Reduces reliance on one result",
      why: "A single input is fragile. Two inputs from different sources triangulate your real level and slash uncertainty.",
      when: "This week. Pick a different source than what you've already used.",
    });
  }

  // No NBME → take one
  if (!hasNbme && input.inputCount >= 1 && days >= 7) {
    candidates.push({
      title: "Take a comprehensive NBME assessment for your target Step exam",
      expectedImpact: "Adds official readiness and content-area feedback",
      why: "Choose CBSSA for Step 1, CCSSA for Step 2 CK, or CCMSA for Step 3. The assessment families and form numbers are not interchangeable.",
      when: "When the result can still change your review plan, using an unused form.",
    });
  }

  // Doubly-weak subject → concentrated reps
  if (input.personalizedWeakSubjects?.doublyWeak.length) {
    const subject = input.personalizedWeakSubjects.doublyWeak[0];
    candidates.push({
      title: `Focus 60% of your UWorld blocks on ${subject}`,
      expectedImpact: "Prioritizes a self-reported weak area",
      why: `${subject} is flagged BOTH by you and by the cohort at your score band — that's the highest-confidence weak signal we have. Concentrated reps move the needle here more than mixed blocks do.`,
      when: "Now through ~Day -7. Switch back to mixed blocks in the final week.",
    });
  }

  // Late stage + lots of exams → re-do error log instead of new resource
  if (input.inputCount >= 3 && days <= 14 && days > 5) {
    candidates.push({
      title: "Re-do your error log, NOT a new question bank",
      expectedImpact: "Reuses evidence from your own prior mistakes",
      why: "At your stage, your own previous errors carry more signal than fresh content. Each re-done wrong question forces a deeper trace than a brand-new one.",
      when: "Daily, in 30-minute blocks until test day.",
    });
  }

  // Tutored→timed switch when ready
  if (input.passProbability >= 0.7 && days >= 7 && hasNbme) {
    candidates.push({
      title: "Switch UWorld from tutored to timed mixed blocks",
      expectedImpact: "Shifts practice toward exam timing and mixed recall",
      why: "Your trajectory suggests endurance and pattern recognition, not content gaps, are the gating factor at your level. Tutored mode reinforces content; timed mixed mode trains exam stamina.",
      when: "Starting tomorrow, all UWorld blocks should be timed mixed.",
    });
  }

  // Final-week stamina
  if (days >= 5 && days <= 10 && input.passProbability >= 0.7) {
    candidates.push({
      title: "Run one full timed UWorld block per day this week",
      expectedImpact: "Maintains stamina without burnout",
      why: "Your knowledge is mostly locked in. The bottleneck this week is endurance: blocks 5-8 of test day are where scores drop.",
      when: "Every day this week. 40 questions, timed, no stopping.",
    });
  }

  // Improving trajectory + far out → don't change tactics
  if (input.scoreTrajectory.trend === "improving" && days >= 21) {
    candidates.push({
      title: "Do not change your study plan — preserve the upward trend",
      expectedImpact: "Locks in your existing trajectory",
      why: "You're improving on schedule. The most common mistake at this stage is changing what's working out of anxiety. Trust the data.",
      when: "Through the next 14 days.",
    });
  }

  // Always-available filler so we never return < 1 move
  if (candidates.length === 0) {
    candidates.push({
      title: "Take one full timed UWorld block per day until test week",
      expectedImpact: "Maintains stamina + knowledge consolidation",
      why: "Daily timed blocks keep you calibrated to test conditions. Review every wrong answer the same day.",
      when: "Daily until 7 days before test.",
    });
  }

  return {
    items: candidates.slice(0, 3).map((c, i) => ({ rank: i + 1, ...c })),
  };
}

// ---------------------------------------------------------------------------
// 5. Test Day Protocol — appears only when test is within 7 days.
//    Specific enough to feel like a coach. Generic enough to be safe.
// ---------------------------------------------------------------------------

export interface TestDayProtocol {
  show: boolean;
  dayMinusOne: string[];
  dayZero: string[];
  doNots: string[];
}

export function buildTestDayProtocol(input: {
  daysUntilExam?: number;
  step: StepKind;
}): TestDayProtocol {
  const days = input.daysUntilExam;
  const show = typeof days === "number" && days <= 7;

  return {
    show,
    dayMinusOne: [
      "30 minutes ethics + biostats review only — high-yield, low-fatigue topics",
      "30 minutes outdoor walk to lock in tomorrow's circadian rhythm",
      "Confirm logistics: ID, route, snacks, water bottle, layers",
      "No new questions. No new content. No exam reviews.",
      "Sleep before 11pm. Aim for 8 hours.",
    ],
    dayZero: [
      "06:00 — Wake. Same breakfast you ate before your highest-scoring NBME.",
      "Arrive 30 min early. Use the bathroom before checking in.",
      "Block 1: do not change pace if you finish early — re-read flagged items.",
      "Mid-exam break (after Block 4): take the FULL 45 minutes. Eat. No studying.",
      "Blocks 6-8: caffeine if you're a regular drinker. Skip if not — first-timer caffeine on test day is a known disaster.",
      "After the exam: do NOT look up answers. Sleep.",
    ],
    doNots: [
      "Do not start new content the day before",
      "Do not take a full practice exam in the final 72 hours",
      "Do not change your sleep schedule the night before",
      "Do not check r/Step2 or USMLE forums during break — variance amplifier",
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. Cohort Mirror — model-projected distribution of likely final scores
//    for users with the same input pattern. Disclaimer is mandatory.
// ---------------------------------------------------------------------------

export interface CohortMirrorBucket {
  range: string;
  /** 0-1 share of the projected cohort landing in this band. */
  percentage: number;
  /** True for the band that contains the user's current point estimate. */
  isYourProjection: boolean;
}

export interface CohortMirror {
  cohortDescription: string;
  buckets: CohortMirrorBucket[];
  /** Median projected final score across the simulated cohort. */
  median: number;
  /** Where the user's CURRENT point estimate sits within the projected dist (0-100). */
  yourPercentile: number;
  /** Mandatory disclaimer that this is model-derived, not from real users. */
  disclaimer: string;
}

export function buildCohortMirror(input: {
  point: number;
  ciLower: number;
  ciUpper: number;
  step: StepKind;
  exams: PracticeExam[];
  daysUntilExam?: number;
  scoreTrajectory: ScoreTrajectory;
  inputCount: number;
}): CohortMirror {
  const point = input.point;
  const halfWidth = (input.ciUpper - input.ciLower) / 2;

  // Trajectory uplift: if improving, expect small additional rise by test day.
  // Capped at +6 pts to avoid runaway extrapolation.
  const days = Math.max(0, input.daysUntilExam ?? 0);
  const slope = input.scoreTrajectory.slopePer30Days ?? 0;
  const cappedSlope = Math.max(-3, Math.min(slope, 6));
  const expectedUplift = Math.round((cappedSlope * Math.min(days, 30)) / 30);
  const projectedMedian = point + expectedUplift;

  // Standard deviation of (real outcome | predicted = point) ≈ 6-8 for typical
  // multi-source predictions. We tie it to halfWidth so single-input users see
  // appropriately wider distributions.
  const sd = Math.max(5, halfWidth * 0.55);

  const cdf = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
  const pct = (lo: number, hi: number) => {
    const zLo = (lo - projectedMedian) / sd;
    const zHi = (hi - projectedMedian) / sd;
    return Math.max(0, Math.min(1, cdf(zHi) - cdf(zLo)));
  };

  // "Your" band: ± half of the half-width around the projected median.
  // We use a 5-bucket partition that strictly covers (-∞, +∞) with no gaps,
  // so bucket percentages always sum to 1 (modulo erf rounding).
  const bandHalf = Math.max(2, Math.ceil(halfWidth * 0.4));
  const yourLo = projectedMedian - bandHalf;
  const yourHi = projectedMedian + bandHalf;

  const buckets: CohortMirrorBucket[] = [
    {
      // (yourHi + 5, +∞)
      range: `${yourHi + 5}+`,
      percentage: pct(yourHi + 5, 999),
      isYourProjection: false,
    },
    {
      // (yourHi, yourHi + 5]
      range: `${yourHi + 1}–${yourHi + 5}`,
      percentage: pct(yourHi, yourHi + 5),
      isYourProjection: false,
    },
    {
      // [yourLo, yourHi] — the band containing the user's point estimate
      range: `${yourLo}–${yourHi}`,
      percentage: pct(yourLo, yourHi),
      isYourProjection: true,
    },
    {
      // [yourLo - 5, yourLo)
      range: `${yourLo - 5}–${yourLo - 1}`,
      percentage: pct(yourLo - 5, yourLo),
      isYourProjection: false,
    },
    {
      // (-∞, yourLo - 5)
      range: `<${yourLo - 5}`,
      percentage: pct(-999, yourLo - 5),
      isYourProjection: false,
    },
  ];

  // Where does the user's CURRENT point sit in the projected distribution?
  const zPoint = (point - projectedMedian) / sd;
  const yourPercentile = Math.round(cdf(zPoint) * 100);

  const examSummary = summarizeExamsForCohort(input.exams);
  const trajectoryNote =
    input.scoreTrajectory.trend === "improving"
      ? `with an improving trajectory (+${cappedSlope} pts/30d)`
      : input.scoreTrajectory.trend === "declining"
        ? "with a declining trajectory"
        : input.scoreTrajectory.trend === "stable"
          ? "with stable scores"
          : "with limited trajectory data";

  const daysNote = days > 0 ? `${days} days from test day` : "near test day";

  const cohortDescription = `Among model-projected outcomes for users with ${examSummary}, ${daysNote}, ${trajectoryNote}, here's the distribution of likely final scores:`;

  return {
    cohortDescription,
    buckets,
    median: projectedMedian,
    yourPercentile,
    disclaimer:
      "This distribution is model-projected from your input pattern using a simulation around your point estimate — it is NOT derived from named real-user outcomes. We will switch to live cohort data once we have ≥5,000 confirmed final scores in our database.",
  };
}

// Abramowitz & Stegun 7.1.26 — error function, accurate to ~1.5e-7.
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax);
  return sign * y;
}

function summarizeExamsForCohort(exams: PracticeExam[]): string {
  if (exams.length === 0) return "no inputs";
  const sources = Array.from(new Set(exams.map((e) => e.source)));
  if (exams.length === 1) return `1 ${sources[0]} input`;
  if (sources.length === 1) return `${exams.length} ${sources[0]} inputs`;
  return `${exams.length} inputs across ${sources.join(", ")}`;
}

// ---------------------------------------------------------------------------
// 7. Honest Uncertainty — what we can't predict, when we'd be wrong.
//    Counter-intuitive, but the highest-trust section: nobody else does this.
// ---------------------------------------------------------------------------

export interface HonestUncertainty {
  cannotPredict: string[];
  whenWedBeWrong: string[];
  notAffiliatedNote: string;
}

export function buildHonestUncertainty(input: {
  exams: PracticeExam[];
  scoreTrajectory: ScoreTrajectory;
  sourceInsight: SourceInsight;
}): HonestUncertainty {
  const cannotPredict: string[] = [
    "Your test-day adrenaline state — calm vs panicked is worth ±5 points",
    "Whether your assigned form skews easy or hard for your strengths",
    "Personal life disruptions in the days before the exam",
  ];

  const sources = new Set(input.exams.map((e) => e.source));
  const wedBeWrong: string[] = [];

  if (input.scoreTrajectory.trend === "improving") {
    wedBeWrong.push(
      "If your improving trajectory plateaus suddenly, we under-predict regression-to-the-mean noise.",
    );
  }
  if (input.scoreTrajectory.trend === "stable" && sources.has("UWSA1")) {
    wedBeWrong.push(
      "If your UWSA reflected an over-prepared peak rather than your true level, we over-predict.",
    );
  }
  if (sources.has("NBME")) {
    wedBeWrong.push(
      "If your NBME score reflected a single bad-day floor (illness, distraction), we under-predict.",
    );
  }
  if (input.exams.length === 1) {
    wedBeWrong.push(
      "Single-input predictions have ~25% wider real-world variance than the model reports.",
    );
  }
  if (input.sourceInsight.rows.length >= 2) {
    const top = input.sourceInsight.rows[0];
    const bottom =
      input.sourceInsight.rows[input.sourceInsight.rows.length - 1];
    if (top.averageEquated - bottom.averageEquated >= 6) {
      wedBeWrong.push(
        "If your weakness pattern is systematic (always missing the same content) rather than random, we under-estimate downside risk.",
      );
    }
  }
  if (wedBeWrong.length === 0) {
    wedBeWrong.push(
      "If your weakness pattern is systematic rather than random, our subject mapping under-estimates risk.",
    );
  }

  return {
    cannotPredict,
    whenWedBeWrong: wedBeWrong,
    notAffiliatedNote:
      "NBMEcalc is an independent tool. We are not affiliated with the NBME, USMLE, or FSMB. This report is decision support — not a guarantee, not medical advice, and not a substitute for the official NBME score report.",
  };
}
