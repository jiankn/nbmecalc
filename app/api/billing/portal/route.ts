/**
 * POST /api/billing/portal
 *
 * Returns a Stripe Customer Portal URL for the signed-in user. The user
 * goes there to update their card, view invoices, or cancel their
 * subscription. Stripe handles all the UI; we just authenticate and mint
 * the URL.
 *
 * 401 when not signed in, 409 when the user has never paid us anything
 * (no Stripe Customer Id on file), 502 if Stripe rejects the request.
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { loadSession } from "@/lib/auth/session";
import { getStripe, getSiteUrl } from "@/lib/stripe";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const session = await loadSession(db, req);
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const customerId = session.user.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json(
      {
        error:
          "No billing account on file. Subscribe to Pro first to manage billing.",
      },
      { status: 409 }
    );
  }

  const stripe = getStripe();
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getSiteUrl()}/dashboard/billing`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Stripe error.";
    console.error("[/api/billing/portal] failed", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
