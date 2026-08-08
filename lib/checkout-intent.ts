import type { PlanKey } from "@/lib/plans";

export const CHECKOUT_INTENT_PARAM = "checkout";

export const CHECKOUT_SOURCES = [
  "founding_nav",
  "pricing_card",
  "calculator_paywall",
  "single_pricing_card",
] as const;

export type CheckoutSource = (typeof CHECKOUT_SOURCES)[number];

export const SINGLE_REPORT_CALCULATOR_PATH =
  "/?checkout=single&source=single_pricing_card#calculator";

export function isCheckoutSource(value: unknown): value is CheckoutSource {
  return (
    typeof value === "string" &&
    CHECKOUT_SOURCES.includes(value as CheckoutSource)
  );
}

export function getCheckoutIntent(search: string): PlanKey | null {
  const value = new URLSearchParams(search).get(CHECKOUT_INTENT_PARAM);
  return value === "single" || value === "lifetime" ? value : null;
}

export function getCheckoutSource(search: string): CheckoutSource | undefined {
  const value = new URLSearchParams(search).get("source");
  return isCheckoutSource(value) ? value : undefined;
}

export function buildLifetimeResumePath(source: CheckoutSource): string {
  const params = new URLSearchParams({ plan: "lifetime", source });
  return `/checkout/resume?${params.toString()}`;
}

export function stripCheckoutIntent(relativeUrl: string): string {
  const url = new URL(relativeUrl, "https://nbmecalc.local");
  url.searchParams.delete(CHECKOUT_INTENT_PARAM);
  url.searchParams.delete("source");
  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
}
