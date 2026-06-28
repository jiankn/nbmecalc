/**
 * Short-lived signed tokens that let the headless-Chrome PDF worker render a
 * Pro subscriber's report page.
 *
 * Paid reports (`/report/cs_...`) need no token: the Stripe session id in the
 * URL is itself the bearer credential, so the worker can fetch the page
 * server-to-server. A Pro report is keyed by a prediction id and gated on the
 * user's login cookie — which the worker (a separate service) can't carry.
 *
 * To get the worker the SAME colorful page a logged-in user sees on screen,
 * the PDF route (which HAS already authenticated the user) mints an HMAC token
 * binding the prediction id + user id + a short expiry, and appends it to the
 * report URL it hands the worker. The report page verifies the token and
 * renders without a cookie. The signing key never leaves the server, the token
 * expires in minutes, and an invalid/expired token is simply ignored.
 */
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes — only needs to outlive one render.

export interface ReportTokenClaims {
  predictionId: string;
  userId: string;
}

interface ReportTokenPayload {
  /** prediction id */
  p: string;
  /** user id */
  u: string;
  /** expiry (ms since epoch) */
  e: number;
}

/**
 * Read the shared PDF-renderer secret. Reused as the HMAC signing key so we
 * don't introduce another secret to provision. Same lookup order as the PDF
 * route: process env first (local dev), then the Cloudflare runtime binding.
 */
export function getPdfRendererSecret(): string | undefined {
  const fromProcess = process.env.PDF_RENDERER_SECRET;
  if (fromProcess) return fromProcess;
  const env = getOptionalRequestContext()?.env as
    | Record<string, unknown>
    | undefined;
  const value = env?.PDF_RENDERER_SECRET;
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): Uint8Array {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const binary = atob(s);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return new Uint8Array(sig);
}

/** Sign a `<payload>.<sig>` token authorizing a worker render of one report. */
export async function signReportToken(
  secret: string,
  claims: ReportTokenClaims,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<string> {
  const payload: ReportTokenPayload = {
    p: claims.predictionId,
    u: claims.userId,
    e: Date.now() + ttlMs,
  };
  const body = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const sig = base64UrlEncode(await hmacSha256(secret, body));
  return `${body}.${sig}`;
}

/**
 * Verify a token. Returns the claims when the signature is valid and the token
 * hasn't expired, otherwise null. Constant-time signature comparison.
 */
export async function verifyReportToken(
  secret: string,
  token: string
): Promise<ReportTokenClaims | null> {
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = base64UrlEncode(await hmacSha256(secret, body));
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return null;

  let payload: ReportTokenPayload;
  try {
    payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(body))
    ) as ReportTokenPayload;
  } catch {
    return null;
  }
  if (
    !payload ||
    typeof payload.p !== "string" ||
    typeof payload.u !== "string" ||
    typeof payload.e !== "number"
  ) {
    return null;
  }
  if (Date.now() > payload.e) return null;

  return { predictionId: payload.p, userId: payload.u };
}
