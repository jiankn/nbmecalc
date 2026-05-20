/**
 * Email transport.
 *
 * Runs on Cloudflare Workers (Edge runtime) so we cannot use nodemailer / raw
 * TCP. Instead we POST to MailChannels (free for Cloudflare Workers) and fall
 * back to logging the message if MailChannels rejects it (e.g. domain DKIM/SPF
 * not yet configured during early bootstrap).
 *
 * MailChannels docs:
 *   https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
 *   https://api.mailchannels.net/tx/v1/documentation
 *
 * Production checklist:
 *   1. Add SPF record to nbmecalc.com:
 *        v=spf1 include:relay.mailchannels.net ~all
 *   2. (Recommended) Add DKIM via MailChannels' DKIM API; otherwise messages
 *      may be flagged as spam by Gmail/Outlook.
 *   3. Verify SMTP_FROM points to a noreply@ address on the verified domain.
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
  /** true when the message was queued upstream; false when we logged-only. */
  delivered: boolean;
  /** Provider message id, when available. */
  messageId?: string;
  /** Upstream error if the send failed. */
  error?: string;
}

const MAILCHANNELS_ENDPOINT = "https://api.mailchannels.net/tx/v1/send";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function toRecipientArray(to: EmailRecipient): Array<{ email: string }> {
  if (Array.isArray(to)) return to.map((email) => ({ email }));
  return [{ email: to }];
}

/**
 * Sends an email through MailChannels. Always resolves — never throws — so
 * callers can decide whether to surface the failure to the end user (e.g. show
 * a generic "we'll be in touch" message) or block the response.
 */
export async function sendEmail(message: EmailMessage): Promise<SendEmailResult> {
  const fromAddress = readEnv("SMTP_FROM") ?? "noreply@nbmecalc.com";
  const fromName = "NBMEcalc";

  const payload = {
    personalizations: [
      {
        to: toRecipientArray(message.to),
        ...(message.headers ? { headers: message.headers } : {}),
      },
    ],
    from: { email: fromAddress, name: fromName },
    ...(message.replyTo ? { reply_to: { email: message.replyTo } } : {}),
    subject: message.subject,
    content: [
      ...(message.text
        ? [{ type: "text/plain", value: message.text }]
        : []),
      { type: "text/html", value: message.html },
    ],
  };

  try {
    const res = await fetch(MAILCHANNELS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(
        "[email] MailChannels rejected message",
        res.status,
        errorText.slice(0, 500)
      );
      return {
        ok: false,
        delivered: false,
        error: `MailChannels ${res.status}: ${errorText.slice(0, 200)}`,
      };
    }

    const messageId =
      res.headers.get("x-message-id") ??
      res.headers.get("message-id") ??
      undefined;

    return { ok: true, delivered: true, messageId };
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
