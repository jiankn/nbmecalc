/**
 * Drizzle ORM schema for the nbmecalc D1 database.
 *
 * Design principles enforced here:
 *
 *   1. SHIP THE MINIMUM. Every table we add costs migration overhead and
 *      future-archaeology cost. This file only contains tables that the
 *      currently-deployed code paths actually read or write. The PRD §8
 *      schema is the long-term target; we land it in slices alongside the
 *      features that consume it (e.g. `users` ships with Magic Link).
 *
 *   2. USER-ID NULLABLE EVERYWHERE. Pre-auth, every row is anonymous and
 *      keyed by the request's `session_id` or a UUID. When Magic Link lands,
 *      we'll backfill `user_id` from the email at sign-up. This avoids
 *      forcing auth before users see value.
 *
 *   3. EVENTS-FIRST ANALYTICS. We don't pre-materialize aggregate columns
 *      (e.g. `users.last_predicted_at`). Instead every action writes to
 *      `events`. Drives a server-side funnel without locking us into a
 *      specific dashboard schema.
 *
 *   4. INPUT/OUTPUT SNAPSHOTS ARE JSON. `predictions.input_exams` and
 *      `predictions.result_snapshot` are TEXT (JSON-serialized). This lets
 *      us re-render any past prediction's PDF after an algorithm version
 *      bump without re-running the model — important because the algorithm
 *      version is recorded alongside, and we promised users we'd "never
 *      silently change your past prediction" (PRD §10.3).
 */
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// predictions — every calculator submission lands here, anonymous or not.
// ---------------------------------------------------------------------------

export const predictions = sqliteTable(
  "predictions",
  {
    /** nanoid(12). Also used as the `session_id` in /report/[session_id]. */
    id: text("id").primaryKey(),

    /** Nullable until Magic Link. FK added when `users` ships. */
    userId: text("user_id"),

    step: text("step", { enum: ["step1", "step2", "step3"] }).notNull(),

    /** PracticeExam[] JSON. Source of truth for re-rendering the report. */
    inputExams: text("input_exams").notNull(),

    /** Optional opt-ins from the calculator. JSON: { targetScore?, selfReportedWeakSubjects? } */
    inputOptions: text("input_options"),

    /** Days until exam at the time of submission. Null if user didn't specify. */
    daysUntilExam: integer("days_until_exam"),

    // --- Output fields denormalized for cheap querying ---
    // Full PredictionResult is also stored in result_snapshot below, but
    // these columns let us run aggregate queries (e.g. mean pass_probability
    // by step over last 7 days) without parsing JSON in SQL.
    pointEstimate: integer("point_estimate").notNull(),
    ciLower: integer("ci_lower").notNull(),
    ciUpper: integer("ci_upper").notNull(),
    passProbability: real("pass_probability").notNull(),

    /** Full PredictionResult JSON. Source for rendering report / PDF. */
    resultSnapshot: text("result_snapshot").notNull(),

    /** "v1.0" today. Bumped on algorithm changes (PRD §10.3). */
    algorithmVersion: text("algorithm_version").notNull(),

    // --- Request metadata ---
    createdAt: integer("created_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),

    // --- UTM / source attribution. Useful for ROAS analysis later. ---
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
    utmMedium: text("utm_medium"),
  },
  (t) => ({
    byUser: index("idx_predictions_user").on(t.userId),
    byCreated: index("idx_predictions_created").on(t.createdAt),
  })
);

export type PredictionRow = typeof predictions.$inferSelect;
export type NewPredictionRow = typeof predictions.$inferInsert;

// ---------------------------------------------------------------------------
// reports — a row is created when Stripe Checkout completes. The PDF itself
// is currently re-rendered on demand from the linked prediction; this table
// tracks "did the user pay" and "when did we email them".
// ---------------------------------------------------------------------------

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),
    predictionId: text("prediction_id").notNull(),

    /** Stripe Checkout Session id. The public `/report/[session_id]` token. */
    stripeSessionId: text("stripe_session_id").notNull(),
    stripePaymentIntent: text("stripe_payment_intent"),

    /** cents */
    amountPaid: integer("amount_paid").notNull(),
    currency: text("currency").notNull().default("usd"),

    emailSentAt: integer("email_sent_at"),
    downloadCount: integer("download_count").notNull().default(0),

    createdAt: integer("created_at").notNull(),
  },
  (t) => ({
    byUser: index("idx_reports_user").on(t.userId),
    byPrediction: index("idx_reports_prediction").on(t.predictionId),
    byStripeSession: index("idx_reports_stripe_session").on(t.stripeSessionId),
  })
);

export type ReportRow = typeof reports.$inferSelect;
export type NewReportRow = typeof reports.$inferInsert;

// ---------------------------------------------------------------------------
// rate_limits — fixed-window counter keyed by an arbitrary string.
// Sized for tens of QPS; if we ever need more we'd swap to Cloudflare's
// Rate Limiting binding. The schema is intentionally generic ("key", not
// "ip") so the same table serves predict-by-IP, login-by-email, etc.
// ---------------------------------------------------------------------------

export const rateLimits = sqliteTable("rate_limits", {
  /** e.g. "predict:ip:1.2.3.4:2026051912" — bucket = key + truncated hour. */
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  /** unix ms — row is safe to delete after this. */
  resetAt: integer("reset_at").notNull(),
});

export type RateLimitRow = typeof rateLimits.$inferSelect;

// ---------------------------------------------------------------------------
// events — append-only business event log. Drives the conversion funnel
// without us having to invent a new schema for each metric.
// ---------------------------------------------------------------------------

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"),

    /** "predict", "checkout_started", "checkout_completed", "pdf_downloaded", ... */
    type: text("type").notNull(),

    /** JSON payload. Schema is type-specific and intentionally loose. */
    payload: text("payload"),

    ip: text("ip"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => ({
    byUser: index("idx_events_user").on(t.userId),
    byType: index("idx_events_type").on(t.type),
    byCreated: index("idx_events_created").on(t.createdAt),
  })
);

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;

// ---------------------------------------------------------------------------
// users — Magic Link accounts. Created lazily on first successful verify.
// ---------------------------------------------------------------------------

export const users = sqliteTable(
  "users",
  {
    /** nanoid(12). */
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),

    /** NULL | "monthly" | "annual". Updated by Stripe webhook. */
    proTier: text("pro_tier"),
    proStartedAt: integer("pro_started_at"),
    proExpiresAt: integer("pro_expires_at"),
    stripeCustomerId: text("stripe_customer_id"),

    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    deletedAt: integer("deleted_at"),

    /** Attribution (best-effort, captured at first login). */
    source: text("source"),
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
  },
  (t) => ({
    byEmail: index("idx_users_email").on(t.email),
    byProTier: index("idx_users_pro_tier").on(t.proTier),
  })
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

// ---------------------------------------------------------------------------
// magic_links — one-time login tokens. Consumed on verify, then deleted.
// ---------------------------------------------------------------------------

export const magicLinks = sqliteTable(
  "magic_links",
  {
    /** UUID v4. Sent in the email link. */
    token: text("token").primaryKey(),
    email: text("email").notNull(),
    /** unix ms — link must be verified before this time. */
    expiresAt: integer("expires_at").notNull(),
    /** unix ms when consumed; null means still active. */
    usedAt: integer("used_at"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    /** Optional next path so user lands where they intended. */
    nextPath: text("next_path"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => ({
    byEmail: index("idx_magic_links_email").on(t.email),
    byExpires: index("idx_magic_links_expires").on(t.expiresAt),
  })
);

export type MagicLinkRow = typeof magicLinks.$inferSelect;
export type NewMagicLinkRow = typeof magicLinks.$inferInsert;

// ---------------------------------------------------------------------------
// sessions — HttpOnly cookie sessions. Server-side state for revocability.
// ---------------------------------------------------------------------------

export const sessions = sqliteTable(
  "sessions",
  {
    /** Opaque session id stored in `nb_session` cookie. */
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    /** unix ms */
    expiresAt: integer("expires_at").notNull(),
    createdAt: integer("created_at").notNull(),
    lastSeenAt: integer("last_seen_at").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
  },
  (t) => ({
    byUser: index("idx_sessions_user").on(t.userId),
    byExpires: index("idx_sessions_expires").on(t.expiresAt),
  })
);

export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Marker used by Drizzle when we want SQLite's CURRENT_TIMESTAMP. We mostly
 *  prefer passing `Date.now()` explicitly from app code — it makes time
 *  travel in tests trivial — but the helper is here when we need it. */
export const nowMs = sql`(strftime('%s','now') * 1000)`;

// Re-export a unified "tables" namespace so callers don't have to remember
// each table's exact import name.
export const tables = {
  predictions,
  reports,
  rateLimits,
  events,
  users,
  magicLinks,
  sessions,
};
