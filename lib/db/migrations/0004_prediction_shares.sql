CREATE TABLE IF NOT EXISTS `prediction_shares` (
	`token` text PRIMARY KEY NOT NULL,
	`manage_token_hash` text NOT NULL,
	`user_id` text,
	`step` text NOT NULL,
	`point_estimate` integer NOT NULL,
	`ci_lower` integer NOT NULL,
	`ci_upper` integer NOT NULL,
	`created_at` integer NOT NULL,
	`revoked_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_prediction_shares_user` ON `prediction_shares` (`user_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_prediction_shares_created` ON `prediction_shares` (`created_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_prediction_shares_revoked` ON `prediction_shares` (`revoked_at`);
