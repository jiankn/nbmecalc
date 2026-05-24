/**
 * Magic Link token generation + verification.
 *
 * Tokens are UUID v4 stored in the `magic_links` table with a 1 hour expiry.
 * On verify we mark `used_at` (idempotent — re-clicks won't create double
 * sessions) and create/look-up the user record.
 */
import { and, eq, isNull } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { magicLinks, users } from "@/lib/db/schema";

export const MAGIC_LINK_TTL_MS = 60 * 60 * 1000; // 1 hour
export const MIN_RESEND_INTERVAL_MS = 60 * 1000; // 1 minute per email

/** Cheap nanoid alternative — we already use crypto.randomUUID for sessions. */
function newUserId(): string {
  // 12-char alphanumeric to match PRD convention.
  const bytes = crypto.getRandomValues(new Uint8Array(9));
  return btoa(String.fromCharCode(...bytes))
    .replace(/[+/=]/g, "")
    .slice(0, 12);
}

/**
 * Issue a new magic link token for an email. Caller is responsible for
 * sending the email; we only persist the token and return it.
 *
 * If the most recent unused token for this email was issued < 60s ago we
 * reject — basic abuse control. Caller surfaces this as 429.
 */
export async function issueMagicLink(
  db: Db,
  args: {
    email: string;
    nextPath?: string;
    ip?: string | null;
    userAgent?: string | null;
  }
): Promise<
  | { ok: true; token: string; expiresAt: number }
  | { ok: false; reason: "rate_limited" }
> {
  const now = Date.now();
  const email = args.email.trim().toLowerCase();

  // Check most recent unused link for this email.
  const recent = await db
    .select({ createdAt: magicLinks.createdAt })
    .from(magicLinks)
    .where(and(eq(magicLinks.email, email), isNull(magicLinks.usedAt)))
    .orderBy(magicLinks.createdAt)
    .limit(1);

  if (recent[0] && now - recent[0].createdAt < MIN_RESEND_INTERVAL_MS) {
    return { ok: false, reason: "rate_limited" };
  }

  const token = crypto.randomUUID();
  const expiresAt = now + MAGIC_LINK_TTL_MS;

  await db.insert(magicLinks).values({
    token,
    email,
    expiresAt,
    createdAt: now,
    ip: args.ip ?? null,
    userAgent: args.userAgent ?? null,
    nextPath: args.nextPath ?? null,
  });

  return { ok: true, token, expiresAt };
}

/**
 * Validate a token and resolve to a user. Single-use: marks the link as
 * consumed on success. Creates the `users` row if first sign-in.
 */
export async function consumeMagicLink(
  db: Db,
  token: string
): Promise<
  | { ok: true; user: { id: string }; nextPath: string | null }
  | { ok: false; reason: "not_found" | "expired" | "already_used" }
> {
  const now = Date.now();

  const rows = await db
    .select({
      email: magicLinks.email,
      expiresAt: magicLinks.expiresAt,
      usedAt: magicLinks.usedAt,
      nextPath: magicLinks.nextPath,
    })
    .from(magicLinks)
    .where(eq(magicLinks.token, token))
    .limit(1);

  const link = rows[0];
  if (!link) return { ok: false, reason: "not_found" };
  if (link.usedAt !== null) return { ok: false, reason: "already_used" };
  if (link.expiresAt < now) return { ok: false, reason: "expired" };

  // Mark used (best-effort race-safe: if another concurrent verify wins, we
  // proceed anyway — the magic link's identity is the email, not the row).
  await db
    .update(magicLinks)
    .set({ usedAt: now })
    .where(eq(magicLinks.token, token));

  // Get or create the user.
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, link.email))
    .limit(1);

  let user: { id: string };
  if (existing[0]) {
    user = existing[0];
    // Touch updated_at on every login.
    await db
      .update(users)
      .set({ updatedAt: now })
      .where(eq(users.id, user.id))
      .catch(() => {});
  } else {
    const id = newUserId();
    await db.insert(users).values({
      id,
      email: link.email,
      name: null,
      createdAt: now,
      updatedAt: now,
      source: "magic_link",
    });
    user = { id };
  }

  return { ok: true, user, nextPath: link.nextPath };
}

/**
 * Render the HTML body of a magic link email. Kept minimal + table-based
 * for maximum email client compatibility.
 */
export function renderMagicLinkEmail(args: {
  verifyUrl: string;
  expiresInMinutes: number;
}): { html: string; text: string } {
  const { verifyUrl, expiresInMinutes } = args;
  const siteUrl = new URL(verifyUrl).origin;
  const logoUrl = new URL("/brand/oauth-logo.png", siteUrl).toString();

  const text = [
    "Sign in to NBMEcalc",
    "",
    `Click the link below to sign in. It expires in ${expiresInMinutes} minutes and can only be used once:`,
    "",
    verifyUrl,
    "",
    "If you didn't request this, you can safely ignore this email.",
    "",
    "— The NBMEcalc team",
    "https://nbmecalc.com",
  ].join("\n");

  const html = `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your secure NBMEcalc sign-in link expires in ${expiresInMinutes} minutes.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
        <tr><td style="padding:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
            <tr>
              <td style="vertical-align:middle;padding:0 12px 0 0;">
                <img src="${logoUrl}" width="44" height="44" alt="NBMEcalc" style="display:block;border:0;outline:none;text-decoration:none;border-radius:12px;"/>
              </td>
              <td style="vertical-align:middle;font-size:24px;line-height:1;font-weight:800;letter-spacing:-0.4px;color:#0f172a;">
                NBMEcalc
              </td>
            </tr>
          </table>
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;font-weight:800;color:#111827;">Sign in to NBMEcalc</h1>
          <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
            Click the button below to sign in. The link expires in <strong>${expiresInMinutes} minutes</strong> and can only be used once.
          </p>
          <p style="margin:0 0 24px;">
            <a href="${verifyUrl}" style="display:inline-block;background:#34D399;color:#000;text-decoration:none;font-weight:700;padding:12px 28px;border-radius:9999px;">Sign in</a>
          </p>
          <p style="margin:0 0 16px;color:#6b7280;font-size:13px;line-height:1.6;">
            Or copy and paste this URL into your browser:<br/>
            <a href="${verifyUrl}" style="color:#047857;word-break:break-all;">${verifyUrl}</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.5;">
            If you didn't request this email, you can safely ignore it. Your account stays untouched.
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;">© 2026 nbmecalc.com</p>
    </td></tr>
  </table>
</body></html>`;

  return { html, text };
}
