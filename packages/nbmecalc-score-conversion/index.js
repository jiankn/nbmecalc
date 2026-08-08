/**
 * NBMEcalc score conversion core.
 *
 * These mappings are independent planning assumptions, not official NBME or
 * USMLE conversions and not a published validation result.
 */

export const ALGORITHM_VERSION = "v1.1";

const SOURCES = new Set(["NBME", "UWSA1", "UWSA2", "FREE120", "AMBOSS", "CMS"]);
const STEPS = new Set(["step1", "step2", "step3"]);

const NBME_TO_STEP = {
  step1: [[200, 198], [220, 215], [240, 232], [260, 245], [280, 256], [300, 264]],
  step2: [[200, 218], [220, 232], [240, 248], [260, 260], [280, 270], [300, 277]],
  step3: [[200, 200], [220, 213], [240, 226], [260, 240], [280, 252], [300, 260]],
};

const NBME_FORM_BIAS = { 28: -3, 29: -1, 30: 0, 31: 0, 32: 1 };
const SOURCE_QUALITY = {
  NBME: 1,
  UWSA1: 0.85,
  UWSA2: 1,
  FREE120: 1,
  AMBOSS: 0.75,
  CMS: 0.6,
};
const PASS_THRESHOLDS = { step1: 196, step2: 218, step3: 198 };

function assertStep(step) {
  if (!STEPS.has(step)) throw new TypeError(`Unsupported step: ${step}`);
}

function assertExam(exam) {
  if (!exam || typeof exam !== "object") throw new TypeError("exam must be an object");
  if (!SOURCES.has(exam.source)) throw new TypeError(`Unsupported source: ${exam.source}`);
  if (!Number.isFinite(exam.score)) throw new TypeError("exam.score must be a finite number");
  if (exam.takenDaysAgo !== undefined && (!Number.isFinite(exam.takenDaysAgo) || exam.takenDaysAgo < 0)) {
    throw new TypeError("exam.takenDaysAgo must be a non-negative number");
  }
  if (exam.formNumber !== undefined && (!Number.isInteger(exam.formNumber) || exam.formNumber < 1)) {
    throw new TypeError("exam.formNumber must be a positive integer");
  }
}

function interpolate(anchors, value) {
  if (value <= anchors[0][0]) return anchors[0][1];
  if (value >= anchors.at(-1)[0]) return anchors.at(-1)[1];
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (value >= x0 && value <= x1) {
      return Math.round(y0 + ((value - x0) / (x1 - x0)) * (y1 - y0));
    }
  }
  return anchors.at(-1)[1];
}

function percentToEquated(percent, step, source) {
  const baseAt75 = { step1: 232, step2: 248, step3: 226 }[step];
  return Math.round(baseAt75 + (percent - 75) - (source === "AMBOSS" ? 5 : 0));
}

/** Convert one practice-assessment result to the internal three-digit scale. */
export function convertExam(exam, step) {
  assertStep(step);
  assertExam(exam);

  switch (exam.source) {
    case "NBME": {
      const bias = exam.formNumber === undefined ? 0 : (NBME_FORM_BIAS[exam.formNumber] ?? 0);
      return interpolate(NBME_TO_STEP[step], exam.score + bias);
    }
    case "UWSA1":
      return interpolate(NBME_TO_STEP[step], exam.score - 5);
    case "UWSA2":
      return interpolate(NBME_TO_STEP[step], exam.score - 2);
    case "FREE120":
      return percentToEquated(exam.score, step, "FREE120");
    case "AMBOSS":
      return percentToEquated(exam.score, step, "AMBOSS");
    case "CMS":
      return exam.score >= 150
        ? interpolate(NBME_TO_STEP[step], exam.score)
        : percentToEquated(exam.score, step, "FREE120");
    default:
      throw new TypeError(`Unsupported source: ${exam.source}`);
  }
}

function passProbability(point, step, ciHalfWidth) {
  const sigma = Math.max(8, ciHalfWidth * 0.7);
  const z = (point - PASS_THRESHOLDS[step]) / sigma;
  const raw = 1 / (1 + Math.exp(-z));
  return Math.min(0.99, Math.max(0.01, raw));
}

/**
 * Combine one or more inputs into a planning estimate and model-generated
 * interval. The interval and pass probability are not empirically validated.
 */
export function computeEstimate(exams, step) {
  assertStep(step);
  if (!Array.isArray(exams) || exams.length === 0) {
    throw new TypeError("exams must contain at least one result");
  }

  const converted = exams.map((exam) => ({
    source: exam.source,
    score: exam.score,
    formNumber: exam.formNumber,
    equated: convertExam(exam, step),
  }));
  const weights = exams.map((exam, index) => {
    const recency = exam.takenDaysAgo === undefined
      ? 1.15 ** index
      : Math.exp(-exam.takenDaysAgo / 30);
    return recency * SOURCE_QUALITY[exam.source];
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const pointEstimate = Math.round(
    converted.reduce((sum, item, index) => sum + item.equated * weights[index], 0) / totalWeight,
  );

  let ciHalfWidth = 16 / Math.sqrt(exams.length);
  if (exams.every((exam) => SOURCE_QUALITY[exam.source] < 0.85)) ciHalfWidth *= 1.25;
  const dated = exams
    .map((exam) => exam.takenDaysAgo)
    .filter((days) => typeof days === "number");
  let freshness = "unknown";
  if (dated.length > 0) {
    const mostRecent = Math.min(...dated);
    if (mostRecent <= 7) {
      ciHalfWidth *= 0.85;
      freshness = "fresh";
    } else if (mostRecent > 30) {
      ciHalfWidth *= 1.2;
      freshness = "stale";
    } else {
      freshness = "fresh";
    }
  }
  ciHalfWidth = Math.max(3, Math.round(ciHalfWidth));

  return {
    algorithmVersion: ALGORITHM_VERSION,
    step,
    pointEstimate,
    ciLower: pointEstimate - ciHalfWidth,
    ciUpper: pointEstimate + ciHalfWidth,
    ciHalfWidth,
    passProbability: passProbability(pointEstimate, step, ciHalfWidth),
    freshness,
    inputCount: exams.length,
    converted,
  };
}
