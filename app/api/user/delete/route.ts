/**
 * POST /api/user/delete
 *
 * Hard-deletes the authenticated user's account and all associated personal
 * data. This is the GDPR Article 17 / CCPA / 个保法 right-to-erasure
 * endpoint — it MUST result in personal data being unrecoverable.
 *
 * What's deleted:
 *   - users row (the account itself)
 *   - all predictions for this user (their score data)
 *   - all events for this user (analytics trail)
 *   - all sessions for this user (signs them out everywhere)
 *   - all magic_links for this user's email (so old links stop working)
 *
 * What's NOT deleted (and why):
 *   - reports rows: kept for accounting/tax purposes (financial records).
 *     The personal link is removed by nulling user_id.
 *   - Stripe customer data: lives at Stripe; user can delete via portal.
 *     We DO cancel any active subscription before account removal so they
 *     don't get billed after deletion.
 *
 * Confirmation: requires `{ confirm: true }` in body to prevent CSRF /
 * accidental clicks. Sign-in cookies are HttpOnly, so a CSRF still needs
 * cookies — but the explicit confirm token gives us a second factor.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  users,
  predictions,
  events,
  sessions,
  magicLinks,
  reports,
} from "@/lib/db/schema";
import { buildClearSessionCookie, loadSession } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";

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

  // Require explicit confirm flag in body. Belt-and-suspenders against
  // accidental POSTs.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body must include { confirm: true }." },
      { status: 400 }
    );
  }
  const b = (body ?? {}) as Record<string, unknown>;
  if (b.confirm !== true) {
    return NextResponse.json(
      { error: "Account deletion requires explicit confirmation." },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email;
  const stripeCustomerId = session.user.stripeCustomerId;

  // 1. Cancel any active Stripe subscription so user isn't billed after delete.
  //    Best-effort: a Stripe failure shouldn't block account deletion (user
  //    can self-serve cancellation later via the Stripe portal if needed).
  if (stripeCustomerId) {
    try {
      const stripe = getStripe();
      const subs = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "active",
        limit: 100,
      });
      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id).catch((err) => {
          console.error("[delete] subscription cancel failed", { sub: sub.id, err });
        });
      }
    } catch (err) {
      console.error("[delete] stripe cancellation block failed", err);
    }
  }

  // 2. Delete personal data. Run as a batch so partial failures roll back.
  //    Reports are kept for financial-record retention but de-identified
  //    by nulling the user_id link.
  try {
    await db.batch([
      // De-identify reports (keep row for accounting, drop the user link).
      db
        .update(reports)
        .set({ userId: null })
        .where(eq(reports.userId, userId)),

      db.delete(predictions).where(eq(predictions.userId, userId)),
      db.delete(events).where(eq(events.userId, userId)),
      db.delete(sessions).where(eq(sessions.userId, userId)),
      db.delete(magicLinks).where(eq(magicLinks.email, userEmail)),
      db.delete(users).where(eq(users.id, userId)),
    ]);
  } catch (err) {
    console.error("[delete] D1 batch failed", err);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support." },
      { status: 500 }
    );
  }

  // 3. Clear session cookie so the next request from this browser goes to /login.
  const url = new URL(req.url);
  return NextResponse.json(
    { ok: true, message: "Account deleted." },
    {
      status: 200,
      headers: {
        "Set-Cookie": buildClearSessionCookie(url.protocol === "https:"),
      },
    }
  );
}
