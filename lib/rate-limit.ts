/**
 * Fixed-window rate limiter, backed by D1.
 *
 * Design choices:
 *
 *   1. Buckets are encoded in the key itself ("predict:ip:1.2.3.4:202605191200").
 *      That makes every row strictly append/increment — no time-conditional
 *      UPDATE logic — which means a single UPSERT does the job atomically.
 *      Old rows naturally stop being read once the bucket rolls over; a
 *      periodic cleanup can sweep them but isn't required for correctness.
 *
 *   2. We FAIL OPEN. If D1 is unavailable (next dev without a wrangler
 *      shell, or a regional D1 incident) the limiter must NOT block the
 *      user — that would convert a backend incident into a frontend outage.
 *      The route is welcome to log a metric so we know we're flying blind.
 *
 *   3. The signature returns the standard rate-limit headers' raw values
 *      (`remaining`, `resetAt`) so the route handler can attach
 *      `X-RateLimit-*` headers without re-deriving them.
 */
import { sql } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";

export interface RateLimitVerdict {
  /** False ⇒ the caller should reject the request (typically 429). */
  allowed: boolean;
  /** Total allowed in the current window. */
  limit: number;
  /** Remaining attempts in the current window after this one was counted. */
  remaining: number;
  /** unix ms when the current window resets. */
  resetAt: number;
}

export interface RateLimitOptions {
  /** Logical bucket name, e.g. "predict". Combined with `identifier`. */
  bucket: string;
  /** Caller-supplied identity. Usually an IP or email. */
  identifier: string;
  /** Maximum hits allowed in `windowMs`. */
  limit: number;
  /** Window size in milliseconds. Default 1 hour. */
  windowMs?: number;
  /** Override `Date.now()` for tests. */
  now?: number;
}

/**
 * Check + increment in one trip. Returns whether the call is allowed.
 *
 * `db` is nullable on purpose — see "FAIL OPEN" above. When `db` is null
 * we return `allowed: true` and a synthetic `remaining: limit - 1` so
 * the response headers still look sensible to clients.
 */
export async function checkRateLimit(
  db: Db | null,
  opts: RateLimitOptions
): Promise<RateLimitVerdict> {
  const windowMs = opts.windowMs ?? 60 * 60 * 1000;
  const now = opts.now ?? Date.now();
  const bucketStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = bucketStart + windowMs;
  const key = `${opts.bucket}:${opts.identifier}:${bucketStart}`;

  // Fail open when D1 isn't wired up (next dev, regional incident, etc.).
  if (!db) {
    return {
      allowed: true,
      limit: opts.limit,
      remaining: opts.limit - 1,
      resetAt,
    };
  }

  try {
    // Single UPSERT — keeps the increment atomic at the row level. D1 (and
    // SQLite generally) serializes writes to the same row, so we don't need
    // a transaction here.
    const result = await db
      .insert(rateLimits)
      .values({ key, count: 1, resetAt })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: { count: sql`${rateLimits.count} + 1` },
      })
      .returning({ count: rateLimits.count });

    const count = result[0]?.count ?? 1;
    const remaining = Math.max(0, opts.limit - count);
    return {
      allowed: count <= opts.limit,
      limit: opts.limit,
      remaining,
      resetAt,
    };
  } catch (err) {
    // Treat any DB error as "limiter unavailable" — fail open.
    console.error("[rate-limit] D1 upsert failed; failing open.", err);
    return {
      allowed: true,
      limit: opts.limit,
      remaining: opts.limit - 1,
      resetAt,
    };
  }
}

/**
 * Build the standard `X-RateLimit-*` headers from a verdict. Use these on
 * BOTH allowed and rejected responses so well-behaved clients can self-pace.
 */
export function rateLimitHeaders(verdict: RateLimitVerdict): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(verdict.limit),
    "X-RateLimit-Remaining": String(verdict.remaining),
    "X-RateLimit-Reset": String(Math.floor(verdict.resetAt / 1000)),
  };
}
