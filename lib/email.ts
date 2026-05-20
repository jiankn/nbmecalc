/**
 * Email transport.
 *
 * Runs on Cloudflare Workers (Edge runtime) so we cannot use nodemailer / raw
 * TCP. We POST to a Postal server's HTTP API (https://docs.postalserver.io/
 * developer/api).
 *
 * Required env vars (set as Cloudflare Pages secrets):
 *   POSTAL_API_URL  Full URL to the Postal `send/message` endpoint,
 *                   e.g. https://mail.removexif.com/api/v1/send/message
 *   POSTAL_API_KEY  Postal API credential value (the X-Server-API-Key header)
 *   SMTP_FROM       Verified sender address, e.g. noreply@nbmecalc.com
 *
 * Postal returns 200 with { status: "success", data: { message_id, messages } }
 * on success, or { status: "error", data: { code, message } } on failure.
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

interface PostalResponse {
  status?: string;
  data?: {
    message_id?: string;
    code?: string;
    message?: string;
    messages?: Record<string, { id: number; token: string }>;
  };
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function toRecipientArray(to: EmailRecipient): string[] {
  return Array.isArray(to) ? to : [to];
}

/**
 * Sends an email through Postal. Always resolves — never throws — so callers
 * can decide whether to surface failures to the end user.
 */
export async function sendEmail(message: EmailMessage): Promise<SendEmailResult> {
  const endpoint = readEnv("POSTAL_API_URL");
  const apiKey = readEnv("POSTAL_API_KEY");
  const fromAddress = readEnv("SMTP_FROM") ?? "noreply@nbmecalc.com";

  if (!endpoint || !apiKey) {
    const missing = !endpoint ? "POSTAL_API_URL" : "POSTAL_API_KEY";
    console.error(`[email] missing required env var: ${missing}`);
    return {
      ok: false,
      delivered: false,
      error: `Email transport not configured (missing ${missing})`,
    };
  }

  const payload = {
    from: `NBMEcalc <${fromAddress}>`,
    to: toRecipientArray(message.to),
    subject: message.subject,
    html_body: message.html,
    ...(message.text ? { plain_body: message.text } : {}),
    ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    ...(message.headers ? { headers: message.headers } : {}),
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Server-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const body = (await res.json().catch(() => null)) as PostalResponse | null;

    // Postal returns HTTP 200 even on logical failures; the real status lives
    // in the JSON body's `status` field.
    if (!res.ok || !body || body.status !== "success") {
      const code = body?.data?.code ?? `http_${res.status}`;
      const detail = body?.data?.message ?? "Postal API rejected message";
      console.error("[email] Postal rejected message", { code, detail });
      return {
        ok: false,
        delivered: false,
        error: `${code}: ${detail}`,
      };
    }

    return {
      ok: true,
      delivered: true,
      messageId: body.data?.message_id,
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
