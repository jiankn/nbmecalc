import { describe, expect, it } from "vitest";
import {
  getLifetimeOffer,
  isLifetimeFoundingOfferEnabled,
} from "@/lib/lifetime-offer";

describe("Lifetime founding offer", () => {
  it("defaults to the $19.99 founding price for the current launch", () => {
    expect(isLifetimeFoundingOfferEnabled(undefined)).toBe(true);
    expect(getLifetimeOffer(true)).toEqual({
      active: true,
      priceCents: 1999,
      regularPriceCents: 3499,
    });
  });

  it("has no automatic member-count or time-based ending condition", () => {
    expect(getLifetimeOffer(true).active).toBe(true);
    expect(getLifetimeOffer(true).priceCents).toBe(1999);
  });

  it("switches future purchases to $34.99 only when manually disabled", () => {
    expect(isLifetimeFoundingOfferEnabled("false")).toBe(false);
    expect(isLifetimeFoundingOfferEnabled(" FALSE ")).toBe(false);
    expect(getLifetimeOffer(false)).toEqual({
      active: false,
      priceCents: 3499,
      regularPriceCents: 3499,
    });
  });
});
