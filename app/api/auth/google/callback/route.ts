/**
 * GET /api/auth/google/callback?code=…&state=…
 *
 * Receives the OAuth redirect from Google, validates state, exchanges the
 * code for an id_token, find-or-creates the user (by email — same canonical
 * key as magic link), mints a session cookie, and redirects to `next`.
 *
 * Errors all redirect to /login?error=… instead of throwing — anything that
 * surfaces here as a bare 500 destroys conversion.
 */
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { buildSessionCookie, createSession } from "@/lib/auth/session";
import {
  buildClearStateCookie,
  buildRedirectUri,
  exchangeCodeForProfile,
  getGoogleClientId,
  getGoogleClientSecret,
  isGoogleOAuthEnabled,
  readStateCookie,
  unpackState,
} from "@/lib/auth/google-oauth";

export const runtime = "edge";

function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function newUserId(): string {
  // Match magic-link user id format (12-char alphanumeric).
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  return btoa(String.fromCharCode(...bytes))
    .replace(/[+/=]/g, "")
    .slice(0, 12);
}

function loginRedirect(req: Request, errorCode: string): Response {
  const url = new URL("/login", req.url);
  url.searchParams.set("error", errorCode);
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      // Always clear the state cookie on exit — single-use.
      "Set-Cookie": buildClearStateCookie(url.protocol === "https:"),
    },
  });
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const isSecure = url.protocol === "https:";

  // ── 1. Surface OAuth provider errors ───────────────────────────────────
  const providerError = url.searchParams.get("error");
  if (providerError) {
    // user closed the consent screen, denied access, etc.
    console.warn("[google-oauth] provider returned error", { providerError });
    return loginRedirect(req, "google_denied");
  }

  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  if (!code || !stateParam) {
    return loginRedirect(req, "google_missing_code");
  }

  // ── 2. CSRF: state in URL must match nonce in cookie ───────────────────
  const cookieValue = readStateCookie(req);
  if (!cookieValue) {
    return loginRedirect(req, "google_state_missing");
  }
  const { nonce, nextPath } = unpackState(cookieValue);
  if (nonce !== stateParam) {
    console.warn("[google-oauth] state mismatch");
    return loginRedirect(req, "google_state_mismatch");
  }

  if (!isGoogleOAuthEnabled()) {
    return loginRedirect(req, "google_unavailable");
  }

  // ── 3. Exchange code → id_token claims ─────────────────────────────────
  let profile;
  try {
    profile = await exchangeCodeForProfile({
      code,
      redirectUri: buildRedirectUri(req),
      clientId: getGoogleClientId()!,
      clientSecret: getGoogleClientSecret()!,
    });
  } catch (err) {
    console.error("[google-oauth] code exchange failed", err);
    return loginRedirect(req, "google_exchange_failed");
  }

  // ── 4. find-or-create user, then mint session ──────────────────────────
  const db = getDb();
  if (!db) {
    console.error("[google-oauth] D1 binding missing");
    return loginRedirect(req, "service_unavailable");
  }

  let userId: string;
  try {
    const now = Date.now();
    const existing = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(eq(users.email, profile.email))
      .limit(1);

    if (existing[0]) {
      userId = existing[0].id;
      // Don't overwrite a real name with empty Google name; only fill if blank.
      const updates: Partial<typeof users.$inferInsert> = { updatedAt: now };
      if (!existing[0].name && profile.name) {
        updates.name = profile.name;
      }
      await db.update(users).set(updates).where(eq(users.id, userId)).catch(() => {});
    } else {
      userId = newUserId();
      await db.insert(users).values({
        id: userId,
        email: profile.email,
        name: profile.name,
        createdAt: now,
        updatedAt: now,
        source: "google",
      });
    }

    const sid = await createSession(db, userId, {
      ip: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
    });

    const dest = new URL(nextPath ?? "/dashboard", req.url);

    // Set both the session cookie AND clear the state cookie. We use a
    // multi-value Set-Cookie via headers.append since fetch's Headers
    // collapses duplicate headers in some runtimes.
    const headers = new Headers();
    headers.set("Location", dest.toString());
    headers.append(
      "Set-Cookie",
      buildSessionCookie(sid, { secure: isSecure })
    );
    headers.append("Set-Cookie", buildClearStateCookie(isSecure));

    return new Response(null, { status: 302, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[google-oauth] callback unhandled error", {
      message,
      stack,
      email: profile.email,
    });
    return loginRedirect(req, "internal");
  }
}
