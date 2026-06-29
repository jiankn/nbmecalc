import type { StepKind } from "@/lib/data";

export interface PredictionShareInput {
  step: StepKind;
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
}

const STEP_VALUES: ReadonlySet<StepKind> = new Set([
  "step1",
  "step2",
  "step3",
]);

export function getStepLabel(step: StepKind): string {
  if (step === "step1") return "Step 1";
  if (step === "step2") return "Step 2 CK";
  return "Step 3";
}

export function parsePredictionShareInput(
  raw: unknown
): PredictionShareInput | { error: string } {
  if (!raw || typeof raw !== "object") {
    return { error: "Body must be a JSON object." };
  }

  const body = raw as Record<string, unknown>;
  if (
    typeof body.step !== "string" ||
    !STEP_VALUES.has(body.step as StepKind)
  ) {
    return { error: "`step` must be one of step1, step2, step3." };
  }

  const values = [body.pointEstimate, body.ciLower, body.ciUpper];
  if (
    values.some(
      (value) =>
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 100 ||
        value > 400
    )
  ) {
    return {
      error:
        "`pointEstimate`, `ciLower`, and `ciUpper` must be whole numbers between 100 and 400.",
    };
  }

  const pointEstimate = body.pointEstimate as number;
  const ciLower = body.ciLower as number;
  const ciUpper = body.ciUpper as number;
  if (ciLower > pointEstimate || pointEstimate > ciUpper) {
    return { error: "The most likely score must fall inside the 95% CI." };
  }
  if (ciUpper - ciLower > 100) {
    return { error: "The shared confidence interval is too wide." };
  }

  return {
    step: body.step as StepKind,
    pointEstimate,
    ciLower,
    ciUpper,
  };
}

export function getPredictionShareTitle(
  share: PredictionShareInput
): string {
  return `My ${getStepLabel(share.step)} prediction: ${share.ciLower}–${share.ciUpper}`;
}

export function getPredictionShareText(
  share: PredictionShareInput
): string {
  return `My NBMEcalc ${getStepLabel(share.step)} estimate is ${share.ciLower}–${share.ciUpper} (most likely ${share.pointEstimate}).`;
}

export function getXShareUrl(
  share: PredictionShareInput,
  publicUrl: string
): string {
  const params = new URLSearchParams({
    text: getPredictionShareText(share),
    url: publicUrl,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getRedditShareUrl(
  share: PredictionShareInput,
  publicUrl: string
): string {
  const params = new URLSearchParams({
    title: getPredictionShareTitle(share),
    url: publicUrl,
  });
  return `https://www.reddit.com/submit?${params.toString()}`;
}

export async function hashShareManageToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
