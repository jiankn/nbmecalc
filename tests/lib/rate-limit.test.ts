/**
 * Unit tests for `lib/rate-limit.ts`.
 *
 * The limiter has two non-negotiable behaviours:
 *
 *   1. FAIL OPEN when the DB is unreachable — never convert a backend
 *      incident into a user-visible outage.
 *
 *   2. Bucket keys MUST include the truncated window start, so two calls
 *      in the same hour share a row and two calls across hours don't.
 *
 * The tests use a small in-memory fake that implements just enough of the
 * Drizzle insert/onConflict/returning chain to exercise the counter, so we
 * don't need a live D1 instance. If you ever need to verify the real SQL
 * (e.g. after changing the upsert), run the route end-to-end under
 * `wrangler pages dev` against a `--local` D1.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

/** Minimal in-memory stand-in for Drizzle's D1 client. Only the methods the
 *  limiter actually uses are implemented; anything else throws so we notice
 *  if we accidentally lean on a new DB call without porting the fake. */
function createFakeDb(): {
  db: Db;
  /** Map of every row written. Test-side inspection helper. */
  rows: Map<string, { count: number; resetAt: number }>;
  /** Force the next upsert to throw, simulating a D1 incident. */
  failNext: () => void;
} {
  const rows = new Map<string, { count: number; resetAt: number }>();
  let throwOnce = false;

  const fakeDb = {
    insert(_table: unknown) {
      return {
        values(row: { key: string; count: number; resetAt: number }) {
          return {
            onConflictDoUpdate(_arg: unknown) {
              return {
                async returning(_cols: unknown) {
                  if (throwOnce) {
                    throwOnce = false;
                    throw new Error("Simulated D1 failure");
                  }
                  const existing = rows.get(row.key);
                  if (!existing) {
                    rows.set(row.key, {
                      count: row.count,
                      resetAt: row.resetAt,
                    });
                    return [{ count: row.count }];
                  }
                  existing.count += 1;
                  return [{ count: existing.count }];
                },
              };
            },
          };
        },
      };
    },
  };

  return {
    db: fakeDb as unknown as Db,
    rows,
    failNext: () => {
      throwOnce = true;
    },
  };
}

describe("checkRateLimit — fail-open semantics", () => {
  // Silence the intentional `console.error` from the fail-open path so test
  // output stays clean. Each `it` restores the spy through `afterEach`.
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns allowed=true when db is null (next dev / no binding)", async () => {
    const v = await checkRateLimit(null, {
      bucket: "predict",
      identifier: "ip:1.2.3.4",
      limit: 20,
    });
    expect(v.allowed).toBe(true);
    expect(v.limit).toBe(20);
    expect(v.remaining).toBe(19);
    expect(v.resetAt).toBeGreaterThan(Date.now() - 60 * 60 * 1000);
  });

  it("returns allowed=true when the DB throws (simulated incident)", async () => {
    const { db, failNext } = createFakeDb();
    failNext();
    const v = await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:1.2.3.4",
      limit: 20,
    });
    expect(v.allowed).toBe(true);
    expect(v.remaining).toBe(19);
  });
});

describe("checkRateLimit — bucketing + counting", () => {
  const t0 = new Date("2026-05-19T00:30:00Z").getTime();
  const oneHourMs = 60 * 60 * 1000;

  it("first call sets count=1 and remaining=limit-1", async () => {
    const { db, rows } = createFakeDb();
    const v = await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:1.1.1.1",
      limit: 5,
      now: t0,
    });
    expect(v.allowed).toBe(true);
    expect(v.remaining).toBe(4);
    expect(rows.size).toBe(1);
  });

  it("consecutive calls within the same window share a row", async () => {
    const { db, rows } = createFakeDb();
    const calls = await Promise.all(
      Array.from({ length: 3 }, () =>
        checkRateLimit(db, {
          bucket: "predict",
          identifier: "ip:2.2.2.2",
          limit: 5,
          now: t0,
        })
      )
    );
    // All hits, single row, monotonic remaining.
    expect(rows.size).toBe(1);
    const remainings = calls.map((c) => c.remaining).sort((a, b) => b - a);
    expect(remainings).toEqual([4, 3, 2]);
  });

  it("blocks once the count exceeds the limit", async () => {
    const { db } = createFakeDb();
    let last;
    for (let i = 0; i < 6; i++) {
      last = await checkRateLimit(db, {
        bucket: "predict",
        identifier: "ip:3.3.3.3",
        limit: 5,
        now: t0,
      });
    }
    expect(last!.allowed).toBe(false);
    expect(last!.remaining).toBe(0);
  });

  it("a different identifier never collides with another", async () => {
    const { db, rows } = createFakeDb();
    await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:a",
      limit: 5,
      now: t0,
    });
    await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:b",
      limit: 5,
      now: t0,
    });
    expect(rows.size).toBe(2);
  });

  it("crossing into a new window starts a fresh row + count", async () => {
    const { db, rows } = createFakeDb();
    await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:4.4.4.4",
      limit: 5,
      now: t0,
    });
    const next = await checkRateLimit(db, {
      bucket: "predict",
      identifier: "ip:4.4.4.4",
      limit: 5,
      now: t0 + oneHourMs + 1, // safely into the next bucket
    });
    expect(rows.size).toBe(2);
    expect(next.remaining).toBe(4);
    expect(next.allowed).toBe(true);
  });

  it("resetAt aligns to the window boundary, not 'now + window'", async () => {
    // t0 is 00:30 UTC → bucket starts at 00:00, resets at 01:00.
    const v = await checkRateLimit(null, {
      bucket: "predict",
      identifier: "ip:x",
      limit: 5,
      now: t0,
    });
    const expectedResetAt = new Date("2026-05-19T01:00:00Z").getTime();
    expect(v.resetAt).toBe(expectedResetAt);
  });
});

describe("rateLimitHeaders", () => {
  it("renders the standard X-RateLimit-* tuple", () => {
    const headers = rateLimitHeaders({
      allowed: true,
      limit: 20,
      remaining: 7,
      resetAt: 1716076800000, // 2024-05-18T22:40:00Z
    });
    expect(headers["X-RateLimit-Limit"]).toBe("20");
    expect(headers["X-RateLimit-Remaining"]).toBe("7");
    // Reset is in seconds, as is the de-facto convention.
    expect(headers["X-RateLimit-Reset"]).toBe("1716076800");
  });
});
