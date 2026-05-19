import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit config. Only used by the `drizzle-kit` CLI (migration codegen),
 * never at runtime. Runtime uses `drizzle-orm/d1` directly against the
 * `DB` binding wired in `wrangler.toml`.
 *
 * We commit migrations to `lib/db/migrations/` so production deploys can
 * apply them via `npx wrangler d1 migrations apply nbmecalc-prod` without
 * needing drizzle-kit on the server.
 */
export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "sqlite",
  // D1's CLI exports a SQLite file we can diff against during local dev.
  // For now we generate migrations without a live DB (introspect:false).
  verbose: true,
  strict: true,
} satisfies Config;
