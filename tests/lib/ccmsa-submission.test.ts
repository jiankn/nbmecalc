import { describe, expect, it } from "vitest";
import {
  CCMSA_FORMS,
  ccmsaSessionId,
  ccmsaSubmissionIdFromSession,
  isCcmsaSessionId,
  parseCcmsaSubmission,
} from "@/lib/ccmsa-submission";
import { NBME_FORM_NUMBERS_BY_STEP } from "@/lib/data";
import { createScoreFeedbackToken, verifyScoreFeedbackToken } from "@/lib/score-feedback";
import { buildCcmsaReminderEmail } from "@/lib/ccmsa-reminder-email";

const NOW = Date.parse("2026-11-01T12:00:00.000Z");

describe("parseCcmsaSubmission", () => {
  it("uses the Step 3 NBME form list from lib/data", () => {
    expect(CCMSA_FORMS).toEqual(NBME_FORM_NUMBERS_BY_STEP.step3);
  });

  it("accepts a minimal anonymous submission", () => {
    expect(
      parseCcmsaSubmission({ form: 7, assessmentScore: 512, consent: true }, NOW)
    ).toEqual({ form: 7, assessmentScore: 512, examDate: null, email: null });
  });

  it("normalizes email and parses the exam date", () => {
    const parsed = parseCcmsaSubmission(
      {
        form: "6",
        assessmentScore: "430",
        examDate: "2026-11-20",
        email: "  Student@Example.com ",
        consent: true,
      },
      NOW
    );
    expect(parsed).toEqual({
      form: 6,
      assessmentScore: 430,
      examDate: Date.parse("2026-11-20T12:00:00.000Z"),
      email: "student@example.com",
    });
  });

  it.each([
    [{ form: 8, assessmentScore: 500, consent: true }, /Form must be one of/],
    [{ form: 7, assessmentScore: 9, consent: true }, /10 to 800/],
    [{ form: 7, assessmentScore: 801, consent: true }, /10 to 800/],
    [{ form: 7, assessmentScore: 500.5, consent: true }, /whole number/],
    [{ form: 7, assessmentScore: 500 }, /agree/],
    [{ form: 7, assessmentScore: 500, consent: "yes" }, /agree/],
    [{ form: 7, assessmentScore: 500, consent: true, email: "nope" }, /valid email/],
    [{ form: 7, assessmentScore: 500, consent: true, email: "a@b.co" }, /exam date/],
    [
      { form: 7, assessmentScore: 500, consent: true, examDate: "2028-01-01" },
      /within one year/,
    ],
    [{ form: 7, assessmentScore: 500, consent: true, examDate: "11/20/2026" }, /Invalid exam date/],
  ])("rejects invalid input %#", (body, message) => {
    const parsed = parseCcmsaSubmission(body, NOW);
    expect("error" in parsed && parsed.error).toMatch(message);
  });
});

describe("CCMSA session ids", () => {
  it("round-trips the submission id", () => {
    const session = ccmsaSessionId("abc-123");
    expect(session).toBe("ccmsa_abc-123");
    expect(isCcmsaSessionId(session)).toBe(true);
    expect(isCcmsaSessionId("pred_abc")).toBe(false);
    expect(ccmsaSubmissionIdFromSession(session)).toBe("abc-123");
    expect(ccmsaSubmissionIdFromSession("cs_test")).toBeNull();
  });

  it("is accepted by score feedback tokens", async () => {
    const token = await createScoreFeedbackToken("ccmsa_abc-123", "secret", { now: NOW });
    const verified = await verifyScoreFeedbackToken(token, "secret", NOW + 1000);
    expect(verified).toMatchObject({ ok: true, payload: { sessionId: "ccmsa_abc-123" } });
  });
});

describe("buildCcmsaReminderEmail", () => {
  it("asks for the real Step 3 score without showing any conversion", async () => {
    const email = await buildCcmsaReminderEmail({
      siteUrl: "https://nbmecalc.com",
      secret: "secret",
      sessionId: "ccmsa_abc-123",
      ccmsa: { form: 7, assessmentScore: 512 },
    });
    expect(email.subject).toMatch(/Step 3 score/);
    expect(email.html).toContain("CCMSA Form 7 Assessment Score of 512");
    expect(email.html).toContain("https://nbmecalc.com/feedback/");
    expect(email.text).toContain("There is no CCMSA-to-Step 3 conversion today");
    // 不能出现预测分数或“换算后约 xxx 分”之类的说法
    expect(email.html).not.toMatch(/predict(ed|ion)|estimated|equivalent/i);
    expect(email.text).not.toMatch(/predict(ed|ion)|estimated|equivalent/i);
  });
});
