/**
 * Google OAuth 2.0 helpers.
 *
 * Flow (server-side, no JS SDK):
 *
 *   1. User clicks "Continue with Google" → GET /api/auth/google/start
 *   2. We mint a short-lived state token (CSRF), set it as an HttpOnly cookie,
 *      and 302 to Google's authorization endpoint with our redirect_uri.
 *   3. User consents at Google → Google 302s back to /api/auth/google/callback
 *      with `?code=…&state=…`.
 *   4. We compare `state` against the cookie, exchange `code` for an id_token,
 *      pull the email/name, find-or-create the user, mint a session.
 *
 * Why no JWT verification of the id_token?
 *   The id_token from the *token endpoint* (not the implicit flow) is
 *   delivered over a TLS-mutual-auth channel using our client_secret. Google
 *   guarantees authenticity of the body without us re-verifying the JWS
 *   signature. We still parse the JWT body for the claims (sub, email,
 *   email_verified, name, picture) — but skipping signature verification
 *   here saves us a JWKS fetch in the hot path.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *
 * The redirect URI is derived from the request origin so we don't have to
 * keep N URI variants in env vars; whichever origin the user is on, the
 * callback lives at `<origin>/api/auth/google/callback`. Each origin we
 * support must be registered in the GCP console anyway (Google enforces
 * exact-string match on redirect_uri).
 */

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const OAUTH_STATE_COOKIE = "nb_oauth_state";
const STATE_TTL_SECONDS = 600; // 10 minutes — covers slow consent on phones

export interface GoogleProfile {
  /** Google's stable user id ("sub"). Useful for analytics; we still key on email. */
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
}

function readEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export function getGoogleClientId(): string | undefined {
  return readEnv("GOOGLE_CLIENT_ID");
}

export function getGoogleClientSecret(): string | undefined {
  return readEnv("GOOGLE_CLIENT_SECRET");
}

/** Whether Google OAuth is configured at all (both env vars present). */
export function isGoogleOAuthEnabled(): boolean {
  return !!getGoogleClientId() && !!getGoogleClientSecret();
}

/** Build the redirect URI for this origin. Must be one of the registered URIs in GCP. */
export function buildRedirectUri(req: Request): string {
  return new URL("/api/auth/google/callback", req.url).toString();
}

/**
 * Build the URL to send the user to. `state` is opaque; we'll verify it
 * matches the cookie on callback. `next` is round-tripped through state via
 * a separate cookie (kept off the URL to keep state short and unguessable).
 */
export function buildAuthorizeUrl(args: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set("client_id", args.clientId);
  url.searchParams.set("redirect_uri", args.redirectUri);
  url.searchParams.set("response_type", "code");
  // openid: returns id_token claims. email/profile: name + picture.
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", args.state);
  // Always show the account chooser. Otherwise users with multiple Google
  // accounts get silently logged in as whichever one Google last picked,
  // which is a frequent "wrong account" support ticket.
  url.searchParams.set("prompt", "select_account");
  // Don't ask for offline access — we never need to call Google APIs
  // on the user's behalf, just prove identity once.
  url.searchParams.set("access_type", "online");
  return url.toString();
}

/** Exchange the auth code for tokens. Returns the parsed id_token claims. */
export async function exchangeCodeForProfile(args: {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<GoogleProfile> {
  const body = new URLSearchParams({
    code: args.code,
    client_id: args.clientId,
    client_secret: args.clientSecret,
    redirect_uri: args.redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`google token exchange failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    id_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (json.error) {
    throw new Error(
      `google token error: ${json.error} ${json.error_description ?? ""}`.trim()
    );
  }

  if (!json.id_token) {
    throw new Error("google token response missing id_token");
  }

  return decodeIdToken(json.id_token);
}

/**
 * Decode a JWT id_token without signature verification. See module docstring
 * for the rationale. We DO re-validate iss/aud/exp/email_verified to defend
 * against accidentally trusting a token that was issued for a different
 * client or that has expired in flight.
 */
function decodeIdToken(idToken: string): GoogleProfile {
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("malformed id_token");
  }
  // Base64URL → Base64 → string (works in edge runtime; no Buffer needed).
  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
  let claims: Record<string, unknown>;
  try {
    claims = JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    throw new Error("id_token payload is not valid JSON");
  }

  const iss = claims.iss as string | undefined;
  if (iss !== "https://accounts.google.com" && iss !== "accounts.google.com") {
    throw new Error(`unexpected id_token issuer: ${iss ?? "(missing)"}`);
  }

  // Verify the audience matches our client. Without this, in theory a
  // token issued to a *different* GCP project could be replayed against us.
  const aud = claims.aud as string | undefined;
  const expectedAud = getGoogleClientId();
  if (!aud || (expectedAud && aud !== expectedAud)) {
    throw new Error(`id_token aud mismatch: ${aud ?? "(missing)"}`);
  }

  const exp = typeof claims.exp === "number" ? claims.exp : 0;
  if (exp * 1000 < Date.now()) {
    throw new Error("id_token expired");
  }

  const email = claims.email as string | undefined;
  if (!email) throw new Error("id_token missing email");

  // Trust only verified emails. Otherwise an attacker with control over a
  // SMTP-only mailbox could conceivably claim someone else's NBMEcalc account.
  const emailVerified =
    claims.email_verified === true || claims.email_verified === "true";
  if (!emailVerified) {
    throw new Error("google account email not verified");
  }

  return {
    sub: String(claims.sub ?? ""),
    email: email.toLowerCase().trim(),
    emailVerified: true,
    name: typeof claims.name === "string" ? claims.name : null,
    picture: typeof claims.picture === "string" ? claims.picture : null,
  };
}

/** Build a Set-Cookie value for the OAuth state nonce. */
export function buildStateCookie(
  value: string,
  opts: { secure: boolean; ttlSeconds?: number } = { secure: true }
): string {
  const maxAge = opts.ttlSeconds ?? STATE_TTL_SECONDS;
  return [
    `${OAUTH_STATE_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    opts.secure ? "Secure" : "",
    // Lax (not Strict) so the cookie survives the cross-site redirect from
    // Google back to us — Strict would drop it on the inbound request.
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ]
    .filter(Boolean)
    .join("; ");
}

/** Build a clear-cookie header for the state once we're done with it. */
export function buildClearStateCookie(secure: boolean): string {
  return [
    `${OAUTH_STATE_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Lax",
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

/** Read the state nonce we set on `/start`. */
export function readStateCookie(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === OAUTH_STATE_COOKIE) return rest.join("=") || null;
  }
  return null;
}

/**
 * Pack the state cookie value as `<nonce>:<urlencoded-next-path>` so the
 * callback knows where to redirect post-login without trusting a query
 * param. Splitter is `:` because our nonces are UUIDs (no colon).
 */
export function packState(nonce: string, nextPath: string | undefined): string {
  return nextPath ? `${nonce}:${encodeURIComponent(nextPath)}` : nonce;
}

export function unpackState(value: string): {
  nonce: string;
  nextPath: string | undefined;
} {
  const idx = value.indexOf(":");
  if (idx === -1) return { nonce: value, nextPath: undefined };
  return {
    nonce: value.slice(0, idx),
    nextPath: decodeURIComponent(value.slice(idx + 1)),
  };
}
