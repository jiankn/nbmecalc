/**
 * Shared loader for premium-report data keyed by Stripe Checkout session.
 *
 * Both the report page (`app/report/[session_id]/page.tsx`) and the PDF
 * download route (`app/api/report/[session_id]/pdf/route.ts`) need exactly
 * the same auth + metadata parsing. Keeping it in one place means the model
 * stays in sync between the on-screen render and the file the user
 * downloads — they will literally never disagree.
 *
 * The discriminated return value lets each caller render its own
 * tier-appropriate error UI (full HTML page vs HTTP status code) without
 * sharing presentation logic.
 */
import { getStripe } from "@/lib/stripe";
import {
  type PracticeExam,
  type PredictionResult,
  type StepKind,
} from "@/lib/data";
import { predictStepScore } from "@/lib/predict";

export type ReportLoadResult =
  | { status: "ok"; data: ReportData }
  | { status: "not_found" }
  | { status: "pending"; sessionId: string }
  | { status: "needs_inputs"; sessionId: string };

export interface ReportData {
  sessionId: string;
  result: PredictionResult;
  exams: PracticeExam[];
  step: StepKind;
  daysUntil?: number;
  targetScore?: number;
  weakSubjects?: string[];
  predictionId?: string;
  customerEmail?: string;
  /** Stripe session creation timestamp (ms since epoch). Used as "issued at". */
  purchasedAt: Date;
}

/**
 * Look up a Stripe Checkout session, validate payment, parse the calculator
 * metadata stored on it, and re-run the prediction model. The model runs
 * server-side every call so any algorithm improvements made after purchase
 * are reflected in the saved report and the PDF.
 */
export async function loadReportFromSession(
  sessionIdRaw: string
): Promise<ReportLoadResult> {
  // Cheap shape check before hitting Stripe — saves a network round-trip on
  // obviously bogus URLs from crawlers / bad referrers.
  if (!sessionIdRaw || !sessionIdRaw.startsWith("cs_")) {
    return { status: "not_found" };
  }

  const stripe = getStripe();
  let session: Awaited<
    ReturnType<typeof stripe.checkout.sessions.retrieve>
  > | null = null;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionIdRaw);
  } catch {
    return { status: "not_found" };
  }

  // Payment must be confirmed. Stripe's `payment_status` is "paid" for
  // one-time AND for the first subscription invoice — both qualify.
  if (session.payment_status !== "paid") {
    return { status: "pending", sessionId: sessionIdRaw };
  }

  const metadata = session.metadata ?? {};

  // Edge case: user reached /pricing → bought Single → had no inputs in
  // metadata because they didn't run the calculator first.
  if (!metadata.exams || !metadata.step) {
    return { status: "needs_inputs", sessionId: sessionIdRaw };
  }

  let exams: PracticeExam[];
  let step: StepKind;
  let daysUntil: number | undefined;
  let targetScore: number | undefined;
  let weakSubjects: string[] | undefined;
  try {
    exams = JSON.parse(metadata.exams) as PracticeExam[];
    step = metadata.step as StepKind;
    daysUntil = metadata.daysUntil ? Number(metadata.daysUntil) : undefined;
    targetScore = metadata.targetScore
      ? Number(metadata.targetScore)
      : undefined;
    weakSubjects = metadata.weakSubjects
      ? (JSON.parse(metadata.weakSubjects) as string[])
      : undefined;
  } catch {
    return { status: "not_found" };
  }

  const result = predictStepScore(exams, step, daysUntil, {
    targetScore,
    selfReportedWeakSubjects: weakSubjects,
  });

  return {
    status: "ok",
    data: {
      sessionId: sessionIdRaw,
      result,
      exams,
      step,
      daysUntil,
      targetScore,
      weakSubjects,
      predictionId: metadata.predictionId,
      customerEmail:
        session.customer_details?.email ?? session.customer_email ?? undefined,
      purchasedAt: new Date(session.created * 1000),
    },
  };
}
