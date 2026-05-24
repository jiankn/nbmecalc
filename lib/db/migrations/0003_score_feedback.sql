ALTER TABLE `reports` ADD COLUMN `customer_email` text;
--> statement-breakpoint
ALTER TABLE `reports` ADD COLUMN `exam_date` integer;
--> statement-breakpoint
ALTER TABLE `reports` ADD COLUMN `score_release_date` integer;
--> statement-breakpoint
ALTER TABLE `reports` ADD COLUMN `score_feedback_opt_in` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `reports` ADD COLUMN `score_feedback_reminder_sent_at` integer;
--> statement-breakpoint
ALTER TABLE `reports` ADD COLUMN `score_feedback_last_submitted_at` integer;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `score_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text,
	`prediction_id` text,
	`stripe_session_id` text NOT NULL,
	`user_id` text,
	`email` text,
	`step` text,
	`predicted_score` integer,
	`ci_lower` integer,
	`ci_upper` integer,
	`pass_probability` real,
	`exam_date` integer,
	`score_release_date` integer,
	`opted_in_at` integer,
	`opt_in_source` text,
	`reminder_sent_at` integer,
	`reminder_email_id` text,
	`last_reminder_error` text,
	`actual_score` integer,
	`pass_fail` text,
	`score_band` text,
	`score_report_url` text,
	`tier` text DEFAULT 'self_reported' NOT NULL,
	`source` text,
	`ip` text,
	`user_agent` text,
	`submitted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_score_reports_stripe_session` ON `score_reports` (`stripe_session_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_score_reports_prediction` ON `score_reports` (`prediction_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_score_reports_release` ON `score_reports` (`score_release_date`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_score_reports_submitted` ON `score_reports` (`submitted_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_score_reports_email` ON `score_reports` (`email`);
