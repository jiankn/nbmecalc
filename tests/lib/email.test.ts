import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "@/lib/email";

const fetchMock = vi.fn();

describe("sendEmail (Resend)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "noreply@nbmecalc.com");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    fetchMock.mockReset();
  });

  it("posts the message to Resend and returns its id", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: "email_123" }), { status: 200 })
    );

    const result = await sendEmail({
      to: "student@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
      replyTo: "hello@nbmecalc.com",
      headers: { "X-NBMEcalc-Email-Type": "test" },
    });

    expect(result).toEqual({ ok: true, delivered: true, messageId: "email_123" });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer re_test_key",
      "Content-Type": "application/json",
      "User-Agent": expect.any(String),
    });
    expect(JSON.parse(init.body as string)).toEqual({
      from: "NBMEcalc <noreply@nbmecalc.com>",
      to: ["student@example.com"],
      subject: "Hello",
      html: "<p>Hi</p>",
      text: "Hi",
      reply_to: "hello@nbmecalc.com",
      headers: { "X-NBMEcalc-Email-Type": "test" },
    });
  });

  it("falls back to the legacy SMTP_FROM sender", async () => {
    vi.stubEnv("EMAIL_FROM", "");
    vi.stubEnv("SMTP_FROM", "legacy@nbmecalc.com");
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "x" }), { status: 200 }));

    await sendEmail({ to: "a@example.com", subject: "s", html: "h" });

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.from).toBe("NBMEcalc <legacy@nbmecalc.com>");
  });

  it("reports Resend validation errors without throwing", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 403,
          name: "validation_error",
          message: "The nbmecalc.com domain is not verified.",
        }),
        { status: 403 }
      )
    );

    await expect(
      sendEmail({ to: "a@example.com", subject: "s", html: "h" })
    ).resolves.toEqual({
      ok: false,
      delivered: false,
      error: "validation_error: The nbmecalc.com domain is not verified.",
    });
  });

  it("reports network failures without throwing", async () => {
    fetchMock.mockRejectedValue(new Error("fetch failed"));

    await expect(
      sendEmail({ to: "a@example.com", subject: "s", html: "h" })
    ).resolves.toEqual({ ok: false, delivered: false, error: "fetch failed" });
  });

  it("does not call Resend when the API key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const result = await sendEmail({ to: "a@example.com", subject: "s", html: "h" });

    expect(result).toMatchObject({ ok: false, delivered: false });
    expect(result.error).toMatch(/RESEND_API_KEY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
