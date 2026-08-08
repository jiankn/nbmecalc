-- Lifetime access is independent from the legacy Pro subscription columns.
CREATE TABLE IF NOT EXISTS `lifetime_entitlements` (
	`user_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL,
	`stripe_checkout_session_id` text NOT NULL,
	`stripe_payment_intent` text,
	`amount_paid` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`promotion_applied` integer DEFAULT 0 NOT NULL,
	`purchased_at` integer NOT NULL,
	`revoked_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_lifetime_entitlements_checkout` ON `lifetime_entitlements` (`stripe_checkout_session_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_lifetime_entitlements_payment_intent` ON `lifetime_entitlements` (`stripe_payment_intent`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_lifetime_entitlements_status` ON `lifetime_entitlements` (`status`);
