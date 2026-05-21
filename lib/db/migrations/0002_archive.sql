-- Add `archived_at` column to predictions for soft-archive (user-initiated
-- "delete" that's actually a hide). True deletion happens via /api/user/delete.
--
-- Idempotent: column may already exist from a manual run.
ALTER TABLE `predictions` ADD COLUMN `archived_at` integer;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_predictions_archived` ON `predictions` (`archived_at`);
