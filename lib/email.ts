/**
 * Email transport.
 *
 * Runs on Cloudflare Workers (Edge runtime) so we cannot use nodemailer / raw
 * TCP. We POST to Resend's HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * 2026-11 起从 Postal 换成 Resend：原 Postal 服务器域名 removexif.com 已过期。
 *
 * Required env vars (set as Cloudflare Pages secrets):
 *   RESEND_API_KEY  Resend API key (re_...), sent as a Bearer token
 *   EMAIL_FROM      Sender address on a domain verified in Resend,
 *                   e.g. noreply@nbmecalc.com (falls back to legacy SMTP_FROM)
 *
 * Resend returns 200 with { id } on success, or a 4xx/5xx with
 * { statusCode, name, message } on failure.
 */

export type EmailRecipient = string | string[];

export interface EmailMessage {
  to: EmailRecipient;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendEmailResult {
  ok: boolean;
  /** true when the message was accepted by the upstream API. */
  delivered: boolean;
  /** Provider message id, when available. */
  messageId?: string;
  /** Upstream error if the send failed. */
  error?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface ResendResponse {
  id?: string;
  statusCode?: number;
  name?: string;
  message?: string;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function toRecipientArray(to: EmailRecipient): string[] {
  return Array.isArray(to) ? to : [to];
}

/**
 * Sends an email through Resend. Always resolves — never throws — so callers
 * can decide whether to surface failures to the end user.
 */
export async function sendEmail(message: EmailMessage): Promise<SendEmailResult> {
  const apiKey = readEnv("RESEND_API_KEY");
  const fromAddress =
    readEnv("EMAIL_FROM") ?? readEnv("SMTP_FROM") ?? "noreply@nbmecalc.com";

  if (!apiKey) {
    console.error("[email] missing required env var: RESEND_API_KEY");
    return {
      ok: false,
      delivered: false,
      error: "Email transport not configured (missing RESEND_API_KEY)",
    };
  }

  const payload = {
    from: `NBMEcalc <${fromAddress}>`,
    to: toRecipientArray(message.to),
    subject: message.subject,
    html: message.html,
    ...(message.text ? { text: message.text } : {}),
    ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    ...(message.headers ? { headers: message.headers } : {}),
  };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Resend 拒绝没有 User-Agent 的请求，Workers 的 fetch 默认不带
        "User-Agent": "nbmecalc/1.0",
      },
      body: JSON.stringify(payload),
    });

    const body = (await res.json().catch(() => null)) as ResendResponse | null;

    if (!res.ok || !body?.id) {
      const code = body?.name ?? `http_${res.status}`;
      const detail = body?.message ?? "Resend API rejected message";
      console.error("[email] Resend rejected message", { code, detail });
      return {
        ok: false,
        delivered: false,
        error: `${code}: ${detail}`,
      };
    }

    return {
      ok: true,
      delivered: true,
      messageId: body.id,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[email] send failed", error);
    return { ok: false, delivered: false, error };
  }
}

export async function sendMagicLinkEmail(
  message: EmailMessage
): Promise<SendEmailResult> {
  return sendEmail(message);
}
