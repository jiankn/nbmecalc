/**
 * GET /api/auth/google/start?next=/dashboard
 *
 * Kicks off the Google OAuth flow:
 *   - Mints a CSRF-bound state nonce
 *   - Sets it as an HttpOnly, SameSite=Lax cookie (must survive the cross-
 *     site redirect back from Google, which is why Strict won't work)
 *   - 302s the user to Google's authorize endpoint
 *
 * The `next` query param is preserved by packing it INTO the state cookie,
 * not the state URL param. That way Google sees only an opaque random nonce
 * and has nothing to log/leak about where we'll send the user.
 */
import { NextResponse } from "next/server";
import {
  buildAuthorizeUrl,
  buildRedirectUri,
  buildStateCookie,
  getGoogleClientId,
  isGoogleOAuthEnabled,
  packState,
} from "@/lib/auth/google-oauth";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (!isGoogleOAuthEnabled()) {
    // Don't 500 — fall back to the email path. This makes preview/dev
    // environments without secrets degrade gracefully.
    const back = new URL("/login", req.url);
    back.searchParams.set("error", "google_unavailable");
    return NextResponse.redirect(back, 302);
  }

  const clientId = getGoogleClientId()!;
  const redirectUri = buildRedirectUri(req);

  // Constrain `next` to a same-origin pathname.
  const nextRaw = url.searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/dashboard";

  const nonce = crypto.randomUUID();
  const stateValue = packState(nonce, nextPath);

  const authorizeUrl = buildAuthorizeUrl({
    clientId,
    redirectUri,
    state: nonce, // only the nonce is exposed to Google
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl,
      "Set-Cookie": buildStateCookie(stateValue, {
        secure: url.protocol === "https:",
      }),
    },
  });
}
