import { describe, expect, it } from "vitest";
import {
  createScoreFeedbackToken,
  estimateScoreReleaseDate,
  outcomeFromAction,
  parseExamDate,
  verifyScoreFeedbackToken,
} from "@/lib/score-feedback";

describe("score feedback tokens", () => {
  it("signs and verifies a session token", async () => {
    const token = await createScoreFeedbackToken("cs_test_123", "secret", {
      action: "pass_220_239",
      now: 1_000,
    });

    const verified = await verifyScoreFeedbackToken(token, "secret", 2_000);
    expect(verified.ok).toBe(true);
    if (verified.ok) {
      expect(verified.payload.sessionId).toBe("cs_test_123");
      expect(verified.payload.action).toBe("pass_220_239");
    }
  });

  it("rejects a token with the wrong secret", async () => {
    const token = await createScoreFeedbackToken("cs_test_123", "secret");
    const verified = await verifyScoreFeedbackToken(token, "wrong-secret");
    expect(verified).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("maps one-click actions to outcomes", () => {
    expect(outcomeFromAction("fail")).toEqual({ passFail: "fail", scoreBand: "fail" });
    expect(outcomeFromAction("pass_240_plus")).toEqual({ passFail: "pass", scoreBand: "240+" });
  });
});

describe("score feedback dates", () => {
  it("parses yyyy-mm-dd dates at UTC noon", () => {
    expect(parseExamDate("2026-05-24")).toBe(Date.parse("2026-05-24T12:00:00.000Z"));
  });

  it("estimates release date as a Wednesday after three weeks", () => {
    const examDate = Date.parse("2026-05-24T12:00:00.000Z");
    const releaseDate = new Date(estimateScoreReleaseDate(examDate));
    expect(releaseDate.getUTCDay()).toBe(3);
    expect(releaseDate.getTime()).toBeGreaterThan(examDate);
  });
});
