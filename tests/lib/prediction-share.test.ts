import { describe, expect, it } from "vitest";
import {
  getPredictionShareText,
  getRedditShareUrl,
  getXShareUrl,
  hashShareManageToken,
  parsePredictionShareInput,
} from "@/lib/prediction-share";

const share = {
  step: "step2" as const,
  pointEstimate: 248,
  ciLower: 241,
  ciUpper: 255,
};

describe("prediction share helpers", () => {
  it("accepts a privacy-safe prediction summary", () => {
    expect(parsePredictionShareInput(share)).toEqual(share);
  });

  it("rejects an estimate outside its confidence interval", () => {
    expect(
      parsePredictionShareInput({
        ...share,
        pointEstimate: 260,
      })
    ).toEqual({
      error: "The most likely score must fall inside the 95% CI.",
    });
  });

  it("builds editable platform composer URLs", () => {
    const publicUrl = "https://nbmecalc.com/share/public-token";
    const xUrl = new URL(getXShareUrl(share, publicUrl));
    const redditUrl = new URL(getRedditShareUrl(share, publicUrl));

    expect(xUrl.origin + xUrl.pathname).toBe(
      "https://twitter.com/intent/tweet"
    );
    expect(xUrl.searchParams.get("url")).toBe(publicUrl);
    expect(xUrl.searchParams.get("text")).toBe(getPredictionShareText(share));
    expect(redditUrl.origin + redditUrl.pathname).toBe(
      "https://www.reddit.com/submit"
    );
    expect(redditUrl.searchParams.get("url")).toBe(publicUrl);
  });

  it("hashes management tokens without storing the secret", async () => {
    const hash = await hashShareManageToken("manage-secret");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain("manage-secret");
  });
});
