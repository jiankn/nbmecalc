import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getDb, type Db } from "@/lib/db/client";
import {
  events,
  lifetimeEntitlements,
  reports,
  predictions,
} from "@/lib/db/schema";
import { sendReportEmail } from "@/lib/email-report";

export const runtime = "edge";

/**
 * Stripe webhook handler.
 *
 * This is the source of truth for entitlement state. Stripe Checkout
 * redirects are best-effort UI; webhooks are the durable signal that says
 * "the money landed". Anything that grants access MUST
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

      if (plan === "lifetime" && session.payment_status === "paid") {
        await grantLifetimeAccess(db, session, event.id);
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
          checkoutSource: session.metadata?.checkoutSource ?? null,
          customer:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id ?? null,
        },
      });
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.plan === "lifetime") {
        await grantLifetimeAccess(db, session, event.id);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.amount_refunded >= charge.amount) {
        await revokeLifetimeAccess(
          db,
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id ?? null,
          event.id,
          "refunded"
        );
      }
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      const expandedCharge =
        typeof dispute.charge === "string"
          ? await getStripe().charges.retrieve(dispute.charge)
          : dispute.charge;
      await revokeLifetimeAccess(
        db,
        typeof expandedCharge.payment_intent === "string"
          ? expandedCharge.payment_intent
          : expandedCharge.payment_intent?.id ?? null,
        event.id,
        "disputed"
      );
      break;
    }

    default:
      // Unhandled types are normal — Stripe sends many. Log so we can
      // discover any new ones we should wire up.
      console.log(`[stripe-webhook] unhandled type=${event.type}`);
  }
}

async function grantLifetimeAccess(
  db: Db,
  session: Stripe.Checkout.Session,
  eventId: string
): Promise<void> {
  const userId = session.metadata?.userId;
  if (!userId) {
    await recordEvent(db, {
      userId: null,
      type: "lifetime_entitlement_orphaned",
      payload: { eventId, stripeSessionId: session.id },
    });
    return;
  }

  const now = Date.now();
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const founding = session.metadata?.lifetimeOffer === "founding";
  const entitlementValues = {
    userId,
    status: "active" as const,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntent: paymentIntent,
    amountPaid: session.amount_total ?? (founding ? 1999 : 3499),
    currency: session.currency ?? "usd",
    promotionApplied: founding ? 1 : 0,
    purchasedAt: now,
    revokedAt: null,
    updatedAt: now,
  };

  const restoreRevoked = db
    .update(lifetimeEntitlements)
    .set(entitlementValues)
    .where(
      and(
        eq(lifetimeEntitlements.userId, userId),
        ne(lifetimeEntitlements.status, "active")
      )
    );
  const insertNew = db
    .insert(lifetimeEntitlements)
    .values(entitlementValues)
    .onConflictDoNothing();
  await db.batch([restoreRevoked, insertNew]);

  await recordEvent(db, {
    userId,
    type: "lifetime_granted",
    payload: {
      eventId,
      stripeSessionId: session.id,
      paymentIntent,
      founding,
      amountPaid: entitlementValues.amountPaid,
    },
  });
}

async function revokeLifetimeAccess(
  db: Db,
  paymentIntent: string | null,
  eventId: string,
  reason: "refunded" | "disputed"
): Promise<void> {
  if (!paymentIntent) return;
  const rows = await db
    .select()
    .from(lifetimeEntitlements)
    .where(
      and(
        eq(lifetimeEntitlements.stripePaymentIntent, paymentIntent),
        eq(lifetimeEntitlements.status, "active")
      )
    )
    .limit(1);
  const entitlement = rows[0];
  if (!entitlement) return;

  const now = Date.now();
  const revoke = db
    .update(lifetimeEntitlements)
    .set({ status: "revoked", revokedAt: now, updatedAt: now })
    .where(
      and(
        eq(lifetimeEntitlements.userId, entitlement.userId),
        eq(lifetimeEntitlements.status, "active")
      )
    );
  await revoke;

  await recordEvent(db, {
    userId: entitlement.userId,
    type: "lifetime_revoked",
    payload: { eventId, paymentIntent, reason },
  });
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
