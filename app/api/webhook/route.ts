import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "edge";

/**
 * Stripe webhook handler — stub for C2-A.
 *
 * In C2-A this endpoint is non-essential: the /report page verifies payment
 * directly against the Stripe Session, so we don't strictly need webhooks
 * to deliver the unlocked report. But:
 *
 *   1. Stripe requires a webhook endpoint for subscription lifecycle events
 *      (renewals, cancellations, failed payments) — needed in C2-B.
 *   2. Webhooks are a more reliable source of truth for "did this payment
 *      land?" than the redirect-based flow alone — they fire even if the
 *      user closes the tab after paying.
 *
 * For now this just verifies the signature and logs the event. C2-B will
 * extend `handleEvent()` to update KV-backed entitlements.
 *
 * Signature verification uses `constructEventAsync` because Edge runtime
 * doesn't expose Node's sync crypto. The async version uses SubtleCrypto.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    // 503 (Service Unavailable) rather than 500 — the endpoint is up but
    // not yet provisioned. Stripe will retry on 5xx, which is what we want
    // during initial setup.
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

  // IMPORTANT: We must read the raw body, not parsed JSON — the signature
  // is computed over the byte stream Stripe sent, so any re-serialization
  // would break verification.
  const body = await req.text();

  const stripe = getStripe();
  let event: Awaited<
    ReturnType<typeof stripe.webhooks.constructEventAsync>
  >;
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
    // Returning 500 makes Stripe retry, which we want for transient
    // failures (e.g. KV write blip in C2-B). Log so we can diagnose.
    console.error("[stripe-webhook] handler failed", err);
    return NextResponse.json(
      { error: "Handler failed; will retry." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

/**
 * Event dispatcher. C2-B will fill in the real handlers for entitlement
 * writes; for now we just log and ack.
 */
async function handleEvent(
  event: Awaited<
    ReturnType<ReturnType<typeof getStripe>["webhooks"]["constructEventAsync"]>
  >
): Promise<void> {
  // Concise structured log so we can grep in `wrangler tail` later.
  console.log(
    `[stripe-webhook] id=${event.id} type=${event.type} livemode=${event.livemode}`
  );

  switch (event.type) {
    case "checkout.session.completed": {
      // Single Report payments land here. C2-B: write report entitlement to KV.
      // For C2-A the /report page already handles this via direct lookup.
      const session = event.data.object;
      console.log(
        `  checkout.session.completed: id=${session.id} plan=${
          session.metadata?.plan ?? "unknown"
        } mode=${session.mode} payment_status=${session.payment_status}`
      );
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // Pro subscription lifecycle. C2-B: sync tier into KV.
      const sub = event.data.object;
      console.log(`  ${event.type}: id=${sub.id} status=${sub.status}`);
      break;
    }
    case "invoice.payment_failed": {
      // Pro renewal failed. C2-B: mark account as past_due in KV.
      const invoice = event.data.object;
      console.log(
        `  invoice.payment_failed: id=${invoice.id} customer=${invoice.customer}`
      );
      break;
    }
    default:
      // Unhandled event types are normal — Stripe sends many. Logging the
      // type makes it easy to spot if a new lifecycle event needs wiring.
      console.log(`  (unhandled event type)`);
  }
}
