-- Add Magic Link auth tables (users, magic_links, sessions)
-- Per PRD §7.4 + §8.1
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`pro_tier` text,
	`pro_started_at` integer,
	`pro_expires_at` integer,
	`stripe_customer_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`source` text,
	`utm_source` text,
	`utm_campaign` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_pro_tier` ON `users` (`pro_tier`);--> statement-breakpoint
CREATE TABLE `magic_links` (
	`token` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`ip` text,
	`user_agent` text,
	`next_path` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_magic_links_email` ON `magic_links` (`email`);--> statement-breakpoint
CREATE INDEX `idx_magic_links_expires` ON `magic_links` (`expires_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`ip` text,
	`user_agent` text
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_expires` ON `sessions` (`expires_at`);
