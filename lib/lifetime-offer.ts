export const LIFETIME_FOUNDING_PRICE_CENTS = 1999;
export const LIFETIME_REGULAR_PRICE_CENTS = 3499;

export type LifetimeOffer = {
  active: boolean;
  priceCents: number;
  regularPriceCents: number;
};

/**
 * A deliberate manual switch for the long-running founding offer.
 *
 * The public env name lets the pricing UI and the checkout server render the
 * same state from one deployment setting. Checkout still chooses and verifies
 * the Stripe Price server-side, so changing browser data cannot change the
 * amount charged.
 *
 * The offer defaults to enabled for the current launch. Set the variable to
 * `false` and redeploy when the founding stage ends.
 */
export function isLifetimeFoundingOfferEnabled(
  value = process.env.NEXT_PUBLIC_LIFETIME_FOUNDING_OFFER_ENABLED
): boolean {
  return value?.trim().toLowerCase() !== "false";
}

export function getLifetimeOffer(
  enabled = isLifetimeFoundingOfferEnabled()
): LifetimeOffer {
  return {
    active: enabled,
    priceCents: enabled
      ? LIFETIME_FOUNDING_PRICE_CENTS
      : LIFETIME_REGULAR_PRICE_CENTS,
    regularPriceCents: LIFETIME_REGULAR_PRICE_CENTS,
  };
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
