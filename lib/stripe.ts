import Stripe from "stripe";

/**
 * Edge-runtime-safe Stripe client.
 *
 * Cloudflare Workers / Pages Functions do not expose Node's `http` module,
 * so we must use Stripe's fetch-based HTTP client. The official SDK ships
 * a factory for this — see https://github.com/stripe/stripe-node#usage-with-cloudflare-workers
 *
 * `apiVersion` is pinned so a future Stripe dashboard change cannot
 * silently break our integration. Bump deliberately, after testing.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and fill it in."
    );
  }

  _stripe = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
    // Keep retries low so the Edge function doesn't time out on transient
    // network blips — better to fail fast and let the client retry.
    maxNetworkRetries: 1,
    typescript: true,
  });

  return _stripe;
}

/**
 * Site URL used to construct Stripe success / cancel URLs.
 *
 * In dev, falls back to localhost; in prod, must come from env so we don't
 * accidentally redirect users to localhost after a real payment.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3000";
}
