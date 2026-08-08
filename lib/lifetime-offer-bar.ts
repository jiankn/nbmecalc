const EXCLUDED_PATH_PREFIXES = [
  "/dashboard",
  "/checkout",
  "/report",
  "/share",
  "/feedback",
  "/login",
  "/recover",
  "/verify",
  "/privacy",
  "/terms",
  "/dmca",
  "/affiliate-disclosure",
] as const;

export const LIFETIME_OFFER_BAR_PLACEMENT = "nav_announcement";
export const LIFETIME_OFFER_BAR_SOURCE = "founding_nav";

export function isLifetimeOfferBarPathEligible(pathname: string): boolean {
  return !EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function shouldShowLifetimeOfferBar(args: {
  pathname: string;
  foundingOfferActive: boolean;
  hasLifetimeAccess: boolean;
}): boolean {
  return (
    args.foundingOfferActive &&
    !args.hasLifetimeAccess &&
    isLifetimeOfferBarPathEligible(args.pathname)
  );
}
