/**
 * Full USMLE Step prediction engine — SERVER ONLY.
 *
 * Why this is separate from `@/lib/data`:
 *   The public marketing calculator imports the lightweight `predictPreview`
 *   from `@/lib/data` to render its instant client-side preview. The full
 *   report — every paid module (risk profile, one-decision, anti-patterns,
 *   high-leverage moves, test-day protocol, cohort mirror, honest uncertainty,
 *   sit-or-postpone, etc.) — must NOT ship in the browser bundle, or a
 *   non-paying visitor could read the entire $14.99 report straight out of the
 *   page's JavaScript.
 *
 *   `predictStepScore` (and its `./report-modules` dependency) therefore lives
 *   here, in a module the client never imports. The headline math is shared
 *   with the preview via `computeBaseline` in `@/lib/data`, so both code paths
 *   stay on the same algorithm version — no duplicated scoring logic.
 */
import {
  COHORT_NOTE,
  COHORT_SIZE,
  COHORT_SUBJECT_NOTE,
  buildPersonalizedWeakSubjects,
  buildPostponeRecommendation,
  buildScoreTrajectory,
  buildSourceInsight,
  buildTargetGap,
  computeBaseline,
  emptyResult,
  type PracticeExam,
  type PredictOptions,
  type PredictionResult,
  type StepKind,
} from "./data";
import {
  buildAntiPatterns,
  buildCohortMirror,
  buildHighLeverageMoves,
  buildHonestUncertainty,
  buildOneDecision,
  buildRiskProfile,
  buildTestDayProtocol,
} from "./report-modules";

/**
 * Aggregate multiple practice exams into a full prediction, including every
 * paid-report module. Server-side counterpart of the client's
 * `predictPreview` — both share `computeBaseline` for the headline number.
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

  const {
    point,
    ciHalfWidth,
    ciLower,
    ciUpper,
    passProb,
    freshness,
    inputCount,
    cohortSubjectAverages,
  } = computeBaseline(exams, step, daysUntilExam);

  // Personalized analytics.
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

  // Premium-report modules (always computed; UI gates on `show` flags).
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
  const cohortMirror =
    COHORT_SIZE > 0
      ? buildCohortMirror({
          point,
          ciLower,
          ciUpper,
          step,
          exams,
          daysUntilExam,
          scoreTrajectory,
          inputCount,
        })
      : {
          cohortDescription:
            "Cohort comparison is unavailable until a reproducible validation dataset is published.",
          buckets: [],
          median: 0,
          yourPercentile: 0,
          disclaimer:
            "No cohort percentile is reported from unpublished synthetic data.",
        };
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
    cohortSubjectAveragesNote: COHORT_SUBJECT_NOTE,
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
