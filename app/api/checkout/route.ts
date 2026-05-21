import { NextResponse } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";
import { getPlan, type PlanKey } from "@/lib/plans";
import type { PracticeExam, StepKind, ExamSource } from "@/lib/data";
import { getDb } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";

export const runtime = "edge";

/**
 * Request body shape.
 *
 * We only persist the *inputs* (exams + step + daysUntil) in Stripe metadata,
 * never the prediction output. The /report page re-runs predictStepScore()
 * with the same lib/data.ts — guaranteeing the report always reflects the
 * latest model. Side benefit: metadata stays small (well under Stripe's
 * 500-char-per-key limit) and there's one source of truth.
 */
type CheckoutRequest = {
  plan: PlanKey;
  exams?: PracticeExam[];
  step?: StepKind;
  daysUntil?: number;
  /** Optional Step score the user is aiming for; powers Target Gap card. */
  targetScore?: number;
  /** Optional user-stated weak subjects; powers personalized priority card. */
  selfReportedWeakSubjects?: string[];
  /** Optional id returned by /api/predict. Lets the eventual order row
   *  (written by the webhook) link back to the exact prediction. */
  predictionId?: string;
};

const VALID_SOURCES: ExamSource[] = [
  "NBME",
  "UWSA1",
  "UWSA2",
  "FREE120",
  "AMBOSS",
  "CMS",
];
const VALID_STEPS: StepKind[] = ["step1", "step2", "step3"];

/**
 * Defensive validator — we never trust the client. If anything is off we
 * return 400 rather than passing garbage to Stripe.
 */
function validateBody(body: unknown): CheckoutRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.plan !== "string" || !getPlan(b.plan)) {
    return { error: "Invalid `plan`." };
  }

  // exams + step + daysUntil are all optional (Pro signup doesn't need them).
  if (b.exams !== undefined) {
    if (!Array.isArray(b.exams) || b.exams.length === 0 || b.exams.length > 10) {
      return { error: "`exams` must be a non-empty array of ≤10 items." };
    }
    for (const e of b.exams as Record<string, unknown>[]) {
      if (
        typeof e.id !== "string" ||
        typeof e.source !== "string" ||
        !VALID_SOURCES.includes(e.source as ExamSource) ||
        typeof e.score !== "number" ||
        !Number.isFinite(e.score)
      ) {
        return { error: "Invalid exam entry." };
      }
      if (
        e.takenDaysAgo !== undefined &&
        (typeof e.takenDaysAgo !== "number" ||
          !Number.isFinite(e.takenDaysAgo) ||
          e.takenDaysAgo < 0 ||
          e.takenDaysAgo > 365)
      ) {
        return { error: "Invalid `takenDaysAgo` on an exam entry." };
      }
    }
  }

  if (b.step !== undefined && !VALID_STEPS.includes(b.step as StepKind)) {
    return { error: "Invalid `step`." };
  }

  if (
    b.daysUntil !== undefined &&
    (typeof b.daysUntil !== "number" || b.daysUntil < 0 || b.daysUntil > 365)
  ) {
    return { error: "Invalid `daysUntil`." };
  }

  if (
    b.targetScore !== undefined &&
    (typeof b.targetScore !== "number" ||
      !Number.isFinite(b.targetScore) ||
      b.targetScore < 150 ||
      b.targetScore > 300)
  ) {
    return { error: "Invalid `targetScore` (must be 150–300)." };
  }

  if (b.selfReportedWeakSubjects !== undefined) {
    if (
      !Array.isArray(b.selfReportedWeakSubjects) ||
      b.selfReportedWeakSubjects.length > 6 ||
      !b.selfReportedWeakSubjects.every(
        (s) => typeof s === "string" && s.length > 0 && s.length <= 60
      )
    ) {
      return { error: "Invalid `selfReportedWeakSubjects`." };
    }
  }

  if (b.predictionId !== undefined) {
    if (
      typeof b.predictionId !== "string" ||
      b.predictionId.length === 0 ||
      b.predictionId.length > 64
    ) {
      return { error: "Invalid `predictionId`." };
    }
  }

  return {
    plan: b.plan as PlanKey,
    exams: b.exams as PracticeExam[] | undefined,
    step: b.step as StepKind | undefined,
    daysUntil: b.daysUntil as number | undefined,
    targetScore: b.targetScore as number | undefined,
    selfReportedWeakSubjects: b.selfReportedWeakSubjects as
      | string[]
      | undefined,
    predictionId: b.predictionId as string | undefined,
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = validateBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const plan = getPlan(parsed.plan);
  // Above getPlan already nullchecked inside validator, but TS doesn't know.
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  // Pro subscriptions REQUIRE an authenticated user. Without a user id we
  // can't grant the Pro entitlement when the webhook fires (we'd have a
  // paid customer with nowhere to attach the tier). Single Report stays
  // anonymous-friendly because the `/report/<session_id>` URL is itself
  // the bearer token for that purchase.
  const db = getDb();
  let authedUser:
    | { id: string; email: string; stripeCustomerId: string | null }
    | null = null;
  if (plan.mode === "subscription") {
    if (!db) {
      return NextResponse.json(
        { error: "Service unavailable. Try again shortly." },
        { status: 503 }
      );
    }
    const session = await loadSession(db, req);
    if (!session) {
      // Front-end will catch this and bounce to /login?next=/pricing.
      return NextResponse.json(
        { error: "Sign in to subscribe to Pro." },
        { status: 401 }
      );
    }
    authedUser = {
      id: session.user.id,
      email: session.user.email,
      stripeCustomerId: session.user.stripeCustomerId,
    };
  }

  const priceId = process.env[plan.stripePriceEnvKey];
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Server misconfigured: ${plan.stripePriceEnvKey} is not set.`,
      },
      { status: 500 }
    );
  }

  // Build minimal input payload for /report page. Stripe metadata values
  // are strings only, so we JSON-stringify.
  const metadata: Record<string, string> = { plan: plan.key };
  if (parsed.exams) metadata.exams = JSON.stringify(parsed.exams);
  if (parsed.step) metadata.step = parsed.step;
  if (typeof parsed.daysUntil === "number") {
    metadata.daysUntil = String(parsed.daysUntil);
  }
  if (typeof parsed.targetScore === "number") {
    metadata.targetScore = String(parsed.targetScore);
  }
  if (parsed.selfReportedWeakSubjects && parsed.selfReportedWeakSubjects.length > 0) {
    metadata.weakSubjects = JSON.stringify(parsed.selfReportedWeakSubjects);
  }
  if (parsed.predictionId) {
    metadata.predictionId = parsed.predictionId;
  }
  // For Pro subscriptions we MUST pass through the user id — the webhook
  // uses it to find which row to flip `pro_tier` on. (We don't trust
  // customer_email matching alone: a user could subscribe with a different
  // payment-time email than their account email.)
  if (authedUser) {
    metadata.userId = authedUser.id;
  }

  // Sanity-check size limit (Stripe enforces 500 chars/key).
  for (const [k, v] of Object.entries(metadata)) {
    if (v.length > 500) {
      return NextResponse.json(
        { error: `Internal: metadata key "${k}" exceeds 500 chars.` },
        { status: 500 }
      );
    }
  }

  const site = getSiteUrl();
  const stripe = getStripe();

  try {
    // Build the Checkout session params, branching on subscription vs
    // one-time. Subscriptions need to bind to a Stripe Customer so the
    // webhook can find us later; one-time payments stay anonymous.
    const sessionParams: Parameters<
      typeof stripe.checkout.sessions.create
    >[0] = {
      mode: plan.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        plan.key === "single"
          ? `${site}/report/{CHECKOUT_SESSION_ID}`
          : `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/checkout/cancel`,
      metadata,
      allow_promotion_codes: true,
    };

    if (authedUser) {
      // Subscription path: reuse the existing Stripe Customer if we already
      // created one; otherwise prefill the email and Stripe will create a
      // new customer (returned in the webhook). We also stash userId on
      // the subscription itself, since the `customer.subscription.*`
      // webhook events don't include the parent checkout's metadata.
      if (authedUser.stripeCustomerId) {
        sessionParams.customer = authedUser.stripeCustomerId;
      } else {
        sessionParams.customer_email = authedUser.email;
      }
      sessionParams.subscription_data = {
        metadata: { userId: authedUser.id, plan: plan.key },
      };
      // Help users self-serve receipts; Stripe will email a receipt for the
      // initial subscription invoice automatically when this is on.
      sessionParams.client_reference_id = authedUser.id;
    } else if (plan.mode === "payment") {
      sessionParams.customer_creation = "if_required";
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL." },
        { status: 502 }
      );
    }

    // Funnel event — best-effort, never blocks the redirect.
    if (db) {
      try {
        await db.insert(events).values({
          id: crypto.randomUUID(),
          userId: authedUser?.id ?? null,
          type: "checkout_started",
          payload: JSON.stringify({
            plan: plan.key,
            stripeSessionId: session.id,
            predictionId: parsed.predictionId ?? null,
          }),
          ip: req.headers.get("cf-connecting-ip") ?? null,
          createdAt: Date.now(),
        });
      } catch (err) {
        console.error("[/api/checkout] event write failed", err);
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Stripe error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
