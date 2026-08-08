import { describe, expect, it } from "vitest";
import { getPlan } from "@/lib/plans";

describe("plan catalog", () => {
  it("offers Lifetime as a one-time payment", () => {
    expect(getPlan("lifetime")).toMatchObject({
      name: "Lifetime",
      displayPrice: "$34.99",
      mode: "payment",
    });
  });

  it("no longer accepts legacy Pro subscription plan keys", () => {
    expect(getPlan("pro_monthly")).toBeNull();
    expect(getPlan("pro_annual")).toBeNull();
  });

  it("keeps Single Report unchanged", () => {
    expect(getPlan("single")).toMatchObject({
      displayPrice: "$14.99",
      mode: "payment",
    });
  });
});
