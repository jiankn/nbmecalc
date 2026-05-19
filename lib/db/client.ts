/**
 * D1 client factory.
 *
 * Why this looks the way it does:
 *
 *   - In production (Cloudflare Pages) and under `wrangler pages dev`, the
 *     D1 binding is exposed via `getRequestContext().env.DB`. This is the
 *     happy path.
 *
 *   - Under `next dev` (the dev loop we use for UI work) the request
 *     context is NOT installed and `getRequestContext()` throws. That
 *     would kill every API route that touches the DB. To preserve the
 *     fast UI dev loop, `getDb()` returns `null` in that environment
 *     and callers are expected to degrade gracefully (log + skip persist).
 *
 *   - `@cloudflare/next-on-pages` ships `getOptionalRequestContext()`
 *     specifically for this case — it returns `undefined` instead of
 *     throwing when no context is installed.
 *
 * Augmenting `CloudflareEnv` here keeps the binding types co-located
 * with the schema they belong to.
 */
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import * as schema from "./schema";

declare global {
  interface CloudflareEnv {
    /** D1 binding declared in wrangler.toml as `binding = "DB"`. */
    DB?: D1Database;
  }
}

export type Db = DrizzleD1Database<typeof schema>;

/**
 * Returns a Drizzle client bound to the request's D1 binding, or `null`
 * when no D1 binding is available (typically `next dev` without a wrangler
 * shell).
 *
 * Callers MUST handle the `null` case explicitly — silently dropping writes
 * is dangerous, so we surface the absence and let the route decide whether
 * to 503, log-and-continue, or stub.
 */
export function getDb(): Db | null {
  const ctx = getOptionalRequestContext();
  const binding = ctx?.env.DB;
  if (!binding) return null;
  return drizzle(binding, { schema });
}

/**
 * Strict variant: throws if D1 isn't available. Use this from code paths
 * where the DB is non-negotiable (e.g. webhook entitlement writes). Plain
 * `getDb()` is the right call from user-facing read paths that should
 * stay responsive even if the DB is briefly unreachable.
 */
export function requireDb(): Db {
  const db = getDb();
  if (!db) {
    throw new Error(
      "D1 binding `DB` is not available. " +
        "Make sure wrangler.toml declares the binding and you're running " +
        "via `wrangler pages dev` or a deployed Pages environment."
    );
  }
  return db;
}

export { schema };
