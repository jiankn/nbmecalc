/**
 * Session helpers for the Magic Link auth flow.
 *
 * Strategy:
 * - HttpOnly cookie `nb_session` holds an opaque session id.
 * - Server-side `sessions` table is the source of truth; we look up on every
 *   protected request. This costs one D1 read per request but gives us
 *   instant revocation (logout, ban) without JWT key rotation pain.
 * - 30-day sliding expiry: every successful lookup bumps `lastSeenAt` and
 *   optionally `expiresAt`.
 *
 * Cookie attributes intentionally strict:
 *   HttpOnly: true     — JS can't read
 *   Secure: true       — HTTPS only (Cloudflare Pages enforces TLS)
 *   SameSite: "lax"    — survives top-level GET nav (magic link click)
 *   Path: "/"          — site-wide
 */
import { and, eq, gt } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { sessions, users, type UserRow } from "@/lib/db/schema";

export const SESSION_COOKIE = "nb_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Build the `Set-Cookie` value for a fresh or refreshed session. */
export function buildSessionCookie(
  sessionId: string,
  opts: { maxAgeSeconds?: number; secure?: boolean } = {}
): string {
  const maxAge = opts.maxAgeSeconds ?? SESSION_TTL_MS / 1000;
  const secure = opts.secure ?? true;
  return [
    `${SESSION_COOKIE}=${sessionId}`,
    "Path=/",
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ]
    .filter(Boolean)
    .join("; ");
}

/** Build a clear-cookie header for logout. */
export function buildClearSessionCookie(secure: boolean = true): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Lax",
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

/** Extract session id from `Cookie` header. Returns null if absent. */
export function readSessionCookie(req: Request): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      return rest.join("=") || null;
    }
  }
  return null;
}

export interface AuthenticatedSession {
  sessionId: string;
  user: UserRow;
}

/**
 * Load + validate the active session for this request. Returns null if no
 * session cookie, expired session, or user soft-deleted. Side effect:
 * bumps `lastSeenAt` (best-effort).
 */
export async function loadSession(
  db: Db,
  req: Request
): Promise<AuthenticatedSession | null> {
  const sid = readSessionCookie(req);
  if (!sid) return null;

  const now = Date.now();
  const rows = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sid), gt(sessions.expiresAt, now)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (row.user.deletedAt) return null;

  // Bump last-seen (best-effort, swallow errors).
  void db
    .update(sessions)
    .set({ lastSeenAt: now })
    .where(eq(sessions.id, sid))
    .catch(() => {});

  return { sessionId: sid, user: row.user };
}

/** Create a new session row. Returns the new id (also the cookie value). */
export async function createSession(
  db: Db,
  userId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {}
): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await db.insert(sessions).values({
    id,
    userId,
    expiresAt: now + SESSION_TTL_MS,
    createdAt: now,
    lastSeenAt: now,
    ip: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  });
  return id;
}

/** Delete a session row (used on logout). */
export async function destroySession(db: Db, sid: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sid));
}
