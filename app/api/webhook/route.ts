import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getDb, type Db } from "@/lib/db/client";
import { events, users, reports, predictions } from "@/lib/db/schema";
import { getPlan, type PlanKey } from "@/lib/plans";
import { sendReportEmail } from "@/lib/email-report";

export const runtime = "edge";

/**
 * Stripe webhook handler.
 *
 * This is the source of truth for entitlement state. Stripe Checkout
 * redirects are best-effort UI; webhooks are the durable signal that says
 * "the money landed". Anything that grants access (Pro tier, etc.) MUST
 * flow through here, never through the redirect handlers.
 *
 * Signature verification uses `constructEventAsync` because Edge runtime
 * doesn't expose Node's sync crypto. The async version uses SubtleCrypto.
 *
 * Idempotency: Stripe retries on 5xx, so handlers must be safe to run
 * multiple times for the same event id. We rely on the fact that all our
 * writes are last-writer-wins UPDATEs against a row keyed on user id, and
 * we record the source `event.id` in the `events` table for audit.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured." },
      { status: 503 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  // IMPORTANT: read the raw bytes — the signature is computed over them,
  // any re-serialization (JSON.parse / .stringify) would break verification.
  const body = await req.text();

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Invalid signature: ${msg}` },
      { status: 400 }
    );
  }

  try {
    await handleEvent(event);
  } catch (err) {
    // 5xx → Stripe retries. Good for transient DB blips, harmful only if
    // we have a permanent bug (then we'll see it loop in the dashboard).
    console.error("[stripe-webhook] handler failed", {
      eventId: event.id,
      type: event.type,
      err,
    });
    return NextResponse.json(
      { error: "Handler failed; will retry." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  console.log(
    `[stripe-webhook] id=${event.id} type=${event.type} livemode=${event.livemode}`
  );

  const db = getDb();
  if (!db) {
    // No DB binding (e.g. preview env) — log and ack so Stripe stops
    // retrying. We deliberately ack rather than 503-loop: in a non-prod
    // environment without D1, there's nothing useful for us to do.
    console.warn(
      "[stripe-webhook] no DB binding; acknowledging event without persistence"
    );
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan ?? "unknown";

      // Write a reports row for Single Report purchases so the dashboard
      // can link back to the full report page.
      if (plan === "single" && session.payment_status === "paid") {
        const predictionId = session.metadata?.predictionId;
        const userId = session.metadata?.userId ?? null;
        if (predictionId) {
          try {
            await db.insert(reports).values({
              id: crypto.randomUUID(),
              userId,
              predictionId,
              stripeSessionId: session.id,
              stripePaymentIntent:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              amountPaid: session.amount_total ?? 1499,
              currency: session.currency ?? "usd",
              customerEmail:
                session.customer_details?.email ?? session.customer_email ?? null,
              createdAt: Date.now(),
            });
          } catch (err) {
            // Idempotent: if the row already exists (retry), swallow.
            console.error("[stripe-webhook] reports insert failed", err);
          }

          // Send the report delivery email (best-effort, never blocks webhook ack).
          const buyerEmail =
            session.customer_details?.email ?? session.customer_email ?? null;
          if (buyerEmail) {
            try {
              const predRows = await db
                .select({
                  step: predictions.step,
                  pointEstimate: predictions.pointEstimate,
                  ciLower: predictions.ciLower,
                  ciUpper: predictions.ciUpper,
                  passProbability: predictions.passProbability,
                })
                .from(predictions)
                .where(eq(predictions.id, predictionId))
                .limit(1);

              const pred = predRows[0];
              if (pred) {
                const STEP_LABELS: Record<string, string> = {
                  step1: "Step 1",
                  step2: "Step 2 CK",
                  step3: "Step 3",
                };
                const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://nbmecalc.com";
                const emailResult = await sendReportEmail({
                  sessionId: session.id,
                  to: buyerEmail,
                  stepLabel: STEP_LABELS[pred.step] ?? pred.step,
                  pointEstimate: pred.pointEstimate,
                  ciLower: pred.ciLower,
                  ciUpper: pred.ciUpper,
                  passProbability: pred.passProbability,
                  siteUrl,
                });
                if (emailResult.ok) {
                  await db
                    .update(reports)
                    .set({ emailSentAt: Date.now() })
                    .where(eq(reports.stripeSessionId, session.id))
                    .catch(() => {});
                } else {
                  console.error("[stripe-webhook] report email failed", emailResult.error);
                }
              }
            } catch (emailErr) {
              console.error("[stripe-webhook] report email error", emailErr);
            }
          }
        }
      }

      await recordEvent(db, {
        userId: (session.metadata?.userId as string | undefined) ?? null,
        type: "checkout_completed",
        payload: {
          eventId: event.id,
          stripeSessionId: session.id,
          plan,
          mode: session.mode,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          customer:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id ?? null,
        },
      });
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await applySubscriptionState(db, sub, event.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await clearSubscriptionState(db, sub, event.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // We don't immediately revoke on the first failed payment — Stripe
      // dunning will retry over ~3 weeks before flipping the subscription
      // to `canceled`. The `customer.subscription.updated` webhook for the
      // status change will reach `clearSubscriptionState` via the normal
      // path. For now just log + analytics.
      await recordEvent(db, {
        userId: null,
        type: "invoice_payment_failed",
        payload: {
          eventId: event.id,
          invoiceId: invoice.id,
          customer:
            typeof invoice.customer === "string"
              ? invoice.customer
              : invoice.customer?.id ?? null,
          amountDue: invoice.amount_due,
        },
      });
      break;
    }

    default:
      // Unhandled types are normal — Stripe sends many. Log so we can
      // discover any new ones we should wire up.
      console.log(`[stripe-webhook] unhandled type=${event.type}`);
  }
}

/**
 * Update the user's `pro_tier` / `pro_expires_at` based on a Stripe
 * subscription's current state. Called for both `created` and `updated`.
 *
 * Resolution order for finding which user this is for:
 *   1. `subscription.metadata.userId` — set by /api/checkout when the
 *      subscription was created. This is the canonical link.
 *   2. Fall back to `users.stripeCustomerId == subscription.customer` —
 *      handles older subscriptions or any drift.
 *   3. Last resort: `customer.email` lookup. Fragile, but better than
 *      a silent miss.
 */
async function applySubscriptionState(
  db: Db,
  sub: Stripe.Subscription,
  eventId: string
): Promise<void> {
  const userId = await resolveUserId(db, sub);
  if (!userId) {
    console.error(
      "[stripe-webhook] could not resolve user for subscription",
      { subId: sub.id, customer: sub.customer }
    );
    // Don't 500 — that triggers retries. A missing user is a permanent
    // miss; we record it for offline reconciliation.
    await recordEvent(db, {
      userId: null,
      type: "subscription_orphaned",
      payload: {
        eventId,
        subId: sub.id,
        status: sub.status,
        customer:
          typeof sub.customer === "string"
            ? sub.customer
            : sub.customer.id,
      },
    });
    return;
  }

  // Map Stripe price → our plan key, so we know whether this is monthly
  // or annual. We keep the mapping loose: any unrecognized price still
  // grants Pro (the user paid us; surely we should honor it) but logs
  // a warning so we notice misconfigured price IDs.
  const planKey = inferPlanKeyFromSubscription(sub);

  // Active states give Pro; everything else clears it. Stripe's full
  // status enum: trialing | active | past_due | canceled | unpaid |
  // incomplete | incomplete_expired | paused
  const grantPro =
    sub.status === "active" ||
    sub.status === "trialing" ||
    // past_due users still have access during dunning grace.
    sub.status === "past_due";

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const now = Date.now();
  // current_period_end is unix seconds; convert to ms. Some Stripe API
  // versions ship it on the subscription, others on items.data[0]; check
  // both. (Note the loose typing — Stripe's TS types vary by version.)
  const periodEndSec =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    sub.items?.data?.[0]?.current_period_end ??
    null;
  const proExpiresAt =
    typeof periodEndSec === "number" && periodEndSec > 0
      ? periodEndSec * 1000
      : null;

  if (grantPro) {
    await db
      .update(users)
      .set({
        proTier: planKey ?? "monthly", // fallback label if mapping missed
        proStartedAt:
          // Only set on first grant; preserve original on subsequent updates.
          // Drizzle doesn't expose COALESCE concisely here, so we read first.
          await getExistingProStartedAt(db, userId, now),
        proExpiresAt,
        stripeCustomerId: customerId,
        updatedAt: now,
      })
      .where(eq(users.id, userId));
  } else {
    await db
      .update(users)
      .set({
        proTier: null,
        proExpiresAt: null,
        stripeCustomerId: customerId,
        updatedAt: now,
      })
      .where(eq(users.id, userId));
  }

  await recordEvent(db, {
    userId,
    type: grantPro ? "pro_granted" : "pro_revoked",
    payload: {
      eventId,
      subId: sub.id,
      status: sub.status,
      planKey,
      proExpiresAt,
    },
  });
}

/**
 * Subscription was deleted entirely (canceled at period end took effect,
 * or user hard-canceled). Mirror state: clear Pro.
 */
async function clearSubscriptionState(
  db: Db,
  sub: Stripe.Subscription,
  eventId: string
): Promise<void> {
  const userId = await resolveUserId(db, sub);
  if (!userId) return;

  const now = Date.now();
  await db
    .update(users)
    .set({
      proTier: null,
      proExpiresAt: null,
      updatedAt: now,
    })
    .where(eq(users.id, userId));

  await recordEvent(db, {
    userId,
    type: "pro_revoked",
    payload: { eventId, subId: sub.id, reason: "subscription_deleted" },
  });
}

/** Look up our user from a Stripe subscription. See applySubscriptionState. */
async function resolveUserId(
  db: Db,
  sub: Stripe.Subscription
): Promise<string | null> {
  const metaUserId = sub.metadata?.userId;
  if (typeof metaUserId === "string" && metaUserId.length > 0) {
    return metaUserId;
  }

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // Try by stripeCustomerId.
  const byCustomer = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  if (byCustomer[0]) return byCustomer[0].id;

  // Last resort: customer email. We'd have to expand the customer to read
  // email; the subscription event payload usually doesn't include it.
  // Skip in the edge runtime to avoid an extra Stripe round-trip per event.
  return null;
}

/**
 * Get the user's current `proStartedAt` if set, otherwise return `now`.
 * Used to preserve the original Pro start time across subscription updates.
 */
async function getExistingProStartedAt(
  db: Db,
  userId: string,
  fallbackNow: number
): Promise<number> {
  const rows = await db
    .select({ proStartedAt: users.proStartedAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0]?.proStartedAt ?? fallbackNow;
}

/**
 * Map a Stripe Subscription's price ID to our PlanKey. Reads the configured
 * env vars so it stays in sync with whatever /api/checkout sends. If the
 * price isn't one of ours (someone created a price directly in the Stripe
 * dashboard) we return null; caller decides how to handle.
 */
function inferPlanKeyFromSubscription(
  sub: Stripe.Subscription
): PlanKey | null {
  const priceId = sub.items?.data?.[0]?.price?.id;
  if (!priceId) return null;

  for (const key of ["pro_monthly", "pro_annual"] as const) {
    const plan = getPlan(key);
    if (!plan) continue;
    const expectedPriceId = process.env[plan.stripePriceEnvKey];
    if (expectedPriceId && expectedPriceId === priceId) return key;
  }
  return null;
}

/** Append-only audit log. Best-effort (failure logged but not propagated). */
async function recordEvent(
  db: Db,
  args: {
    userId: string | null;
    type: string;
    payload: Record<string, unknown>;
  }
): Promise<void> {
  try {
    await db.insert(events).values({
      id: crypto.randomUUID(),
      userId: args.userId,
      type: args.type,
      payload: JSON.stringify(args.payload),
      ip: null,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("[stripe-webhook] event write failed", err);
  }
}
