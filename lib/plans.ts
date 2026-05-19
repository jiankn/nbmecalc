/**
 * Central plan catalog.
 *
 * The display layer (Pricing component, PaywallModal) reads `displayPrice`
 * and `period` from here so a price change only requires one edit.
 *
 * The checkout layer (/api/checkout) reads `stripePriceEnvKey` and looks up
 * the actual Stripe Price ID from env. We never hard-code Stripe IDs in
 * source — they live in env so test vs live can be swapped without a deploy.
 */

export type PlanKey = "single" | "pro_monthly" | "pro_annual";

export type Plan = {
  key: PlanKey;
  /** Human-readable name shown in UI. */
  name: string;
  /** Display price, exactly as shown on the pricing page. */
  displayPrice: string;
  /** Period suffix, e.g. "/mo", "/yr", or "" for one-time. */
  period: string;
  /** Stripe Checkout mode. */
  mode: "payment" | "subscription";
  /**
   * Name of the env var holding the Stripe Price ID for this plan.
   * The actual ID lives in env so we can swap test/live keys per deploy.
   */
  stripePriceEnvKey: string;
  /** Whether this plan unlocks the PDF / full report immediately. */
  unlocksReport: boolean;
};

export const PLANS: Record<PlanKey, Plan> = {
  single: {
    key: "single",
    name: "Single Report",
    displayPrice: "$14.99",
    period: "one-time",
    mode: "payment",
    stripePriceEnvKey: "STRIPE_PRICE_SINGLE",
    unlocksReport: true,
  },
  pro_monthly: {
    key: "pro_monthly",
    name: "Pro (Monthly)",
    displayPrice: "$9.99",
    period: "/mo",
    mode: "subscription",
    stripePriceEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
    unlocksReport: true,
  },
  pro_annual: {
    key: "pro_annual",
    name: "Pro (Annual)",
    displayPrice: "$79",
    period: "/yr",
    mode: "subscription",
    stripePriceEnvKey: "STRIPE_PRICE_PRO_ANNUAL",
    unlocksReport: true,
  },
};

export function getPlan(key: string): Plan | null {
  if (key in PLANS) return PLANS[key as PlanKey];
  return null;
}
