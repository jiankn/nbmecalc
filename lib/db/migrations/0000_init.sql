CREATE TABLE IF NOT EXISTS `events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`payload` text,
	`ip` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_events_user` ON `events` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_events_type` ON `events` (`type`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_events_created` ON `events` (`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `predictions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`step` text NOT NULL,
	`input_exams` text NOT NULL,
	`input_options` text,
	`days_until_exam` integer,
	`point_estimate` integer NOT NULL,
	`ci_lower` integer NOT NULL,
	`ci_upper` integer NOT NULL,
	`pass_probability` real NOT NULL,
	`result_snapshot` text NOT NULL,
	`algorithm_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`ip` text,
	`user_agent` text,
	`referrer` text,
	`utm_source` text,
	`utm_campaign` text,
	`utm_medium` text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_predictions_user` ON `predictions` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_predictions_created` ON `predictions` (`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`prediction_id` text NOT NULL,
	`stripe_session_id` text NOT NULL,
	`stripe_payment_intent` text,
	`amount_paid` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`email_sent_at` integer,
	`download_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_reports_user` ON `reports` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_reports_prediction` ON `reports` (`prediction_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_reports_stripe_session` ON `reports` (`stripe_session_id`);
