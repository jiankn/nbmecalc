import { NextResponse } from "next/server";
import { getStripe, getSiteUrl } from "@/lib/stripe";
import {
  getPlan,
  STRIPE_PRICE_LIFETIME_FOUNDING_ENV,
  type PlanKey,
} from "@/lib/plans";
import type { PracticeExam, StepKind, ExamSource } from "@/lib/data";
import { getDb } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";
import { getLifetimeOffer } from "@/lib/lifetime-offer";
import {
  isCheckoutSource,
  type CheckoutSource,
} from "@/lib/checkout-intent";

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
  checkoutSource?: CheckoutSource;
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

  if (
    b.checkoutSource !== undefined &&
    !isCheckoutSource(b.checkoutSource)
  ) {
    return { error: "Invalid `checkoutSource`." };
  }

  // exams + step + daysUntil are optional (Lifetime checkout needs no inputs).
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
    checkoutSource: b.checkoutSource as CheckoutSource | undefined,
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

  // Lifetime purchases REQUIRE an authenticated user. Without a user id we
  // cannot attach the durable entitlement. Single Report stays
  // anonymous-friendly because the `/report/<session_id>` URL is itself
  // the bearer token for that purchase.
  //
  // However, for BOTH paths we attempt to load the session (best-effort)
  // so we can prefill the email on the Stripe Checkout page — saves the
  // user from typing it again.
  const db = getDb();
  let authedUser:
    | {
        id: string;
        email: string;
        lifetimeAccess: boolean;
      }
    | null = null;

  if (db) {
    const session = await loadSession(db, req);
    if (session) {
      authedUser = {
        id: session.user.id,
        email: session.user.email,
        lifetimeAccess: session.user.lifetimeAccess,
      };
    }
  }

  if (plan.key === "lifetime" && !authedUser) {
    return NextResponse.json(
      { error: "Sign in to purchase Lifetime access." },
      { status: 401 }
    );
  }

  if (plan.key === "lifetime" && authedUser?.lifetimeAccess) {
    return NextResponse.json(
      { error: "Lifetime access is already active on this account." },
      { status: 409 }
    );
  }

  let lifetimeFoundingPrice = false;
  let expectedAmountCents = 1499;
  if (plan.key === "lifetime") {
    const offer = getLifetimeOffer();
    lifetimeFoundingPrice = offer.active;
    expectedAmountCents = offer.priceCents;
  }

  const priceEnvKey = lifetimeFoundingPrice
    ? STRIPE_PRICE_LIFETIME_FOUNDING_ENV
    : plan.stripePriceEnvKey;
  const priceId = process.env[priceEnvKey];
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Server misconfigured: ${priceEnvKey} is not set.`,
      },
      { status: 500 }
    );
  }

  // Build minimal input payload for /report page. Stripe metadata values
  // are strings only, so we JSON-stringify.
  const metadata: Record<string, string> = { plan: plan.key };
  if (parsed.checkoutSource) metadata.checkoutSource = parsed.checkoutSource;
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
  if (authedUser) {
    metadata.userId = authedUser.id;
  }
  if (plan.key === "lifetime") {
    metadata.lifetimeOffer = lifetimeFoundingPrice ? "founding" : "regular";
    metadata.expectedAmountCents = String(expectedAmountCents);
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
    const stripePrice = await stripe.prices.retrieve(priceId);
    if (
      !stripePrice.active ||
      stripePrice.currency !== "usd" ||
      stripePrice.unit_amount !== expectedAmountCents
    ) {
      return NextResponse.json(
        { error: "Server misconfigured: Stripe Price amount does not match the selected plan." },
        { status: 500 }
      );
    }

    const sessionParams: Parameters<
      typeof stripe.checkout.sessions.create
    >[0] = {
      mode: plan.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan.key}`,
      cancel_url: `${site}/checkout/cancel`,
      metadata,
      allow_promotion_codes: plan.key === "single",
      custom_text: {
        submit: {
          message:
            "All sales are final. This digital product is delivered immediately and is non-refundable.",
        },
      },
    };

    if (authedUser) {
      // Prefill email on the Checkout page so the user doesn't retype it.
      sessionParams.customer_email = authedUser.email;
      sessionParams.client_reference_id = authedUser.id;

    } else if (plan.mode === "payment") {
      // Anonymous single-report purchase — let Stripe create a customer
      // record so receipts can be emailed.
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
            checkoutSource: parsed.checkoutSource ?? null,
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
