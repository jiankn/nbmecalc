import { describe, expect, it } from "vitest";
import {
  isLifetimeOfferBarPathEligible,
  shouldShowLifetimeOfferBar,
} from "@/lib/lifetime-offer-bar";

describe("Lifetime founding offer bar", () => {
  it("shows on public acquisition pages while the founding offer is active", () => {
    expect(isLifetimeOfferBarPathEligible("/")).toBe(true);
    expect(isLifetimeOfferBarPathEligible("/pricing")).toBe(true);
    expect(isLifetimeOfferBarPathEligible("/step-2-predictor")).toBe(true);
    expect(isLifetimeOfferBarPathEligible("/blog/how-to-prepare")).toBe(true);
    expect(
      shouldShowLifetimeOfferBar({
        pathname: "/pricing",
        foundingOfferActive: true,
        hasLifetimeAccess: false,
      })
    ).toBe(true);
  });

  it("stays out of account, transaction, report, and legal flows", () => {
    expect(isLifetimeOfferBarPathEligible("/dashboard")).toBe(false);
    expect(isLifetimeOfferBarPathEligible("/dashboard/billing")).toBe(false);
    expect(isLifetimeOfferBarPathEligible("/checkout/success")).toBe(false);
    expect(isLifetimeOfferBarPathEligible("/report/session-123")).toBe(false);
    expect(isLifetimeOfferBarPathEligible("/login")).toBe(false);
    expect(isLifetimeOfferBarPathEligible("/privacy")).toBe(false);
  });

  it("hides when the offer is disabled or Lifetime is already active", () => {
    expect(
      shouldShowLifetimeOfferBar({
        pathname: "/pricing",
        foundingOfferActive: false,
        hasLifetimeAccess: false,
      })
    ).toBe(false);

    expect(
      shouldShowLifetimeOfferBar({
        pathname: "/pricing",
        foundingOfferActive: true,
        hasLifetimeAccess: true,
      })
    ).toBe(false);
  });
});
