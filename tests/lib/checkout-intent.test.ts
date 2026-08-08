import { describe, expect, it } from "vitest";
import {
  buildLifetimeResumePath,
  getCheckoutIntent,
  getCheckoutSource,
  isCheckoutSource,
  SINGLE_REPORT_CALCULATOR_PATH,
  stripCheckoutIntent,
} from "@/lib/checkout-intent";

describe("checkout intent helpers", () => {
  it("recognizes only supported plans and sources", () => {
    expect(getCheckoutIntent("?checkout=lifetime")).toBe("lifetime");
    expect(getCheckoutIntent("?checkout=single")).toBe("single");
    expect(getCheckoutIntent("?checkout=subscription")).toBeNull();
    expect(getCheckoutSource("?source=calculator_paywall")).toBe(
      "calculator_paywall"
    );
    expect(getCheckoutSource("?source=unknown")).toBeUndefined();
    expect(isCheckoutSource("pricing_card")).toBe(true);
    expect(isCheckoutSource(123)).toBe(false);
  });

  it("builds a post-login Lifetime resume destination", () => {
    expect(buildLifetimeResumePath("founding_nav")).toBe(
      "/checkout/resume?plan=lifetime&source=founding_nav"
    );
  });

  it("sends Single Report buyers to the required calculation first", () => {
    expect(SINGLE_REPORT_CALCULATOR_PATH).toBe(
      "/?checkout=single&source=single_pricing_card#calculator"
    );
  });

  it("consumes checkout intent without dropping unrelated URL state", () => {
    expect(
      stripCheckoutIntent(
        "/?checkout=single&source=single_pricing_card&utm_source=email#calculator"
      )
    ).toBe("/?utm_source=email#calculator");
  });
});
