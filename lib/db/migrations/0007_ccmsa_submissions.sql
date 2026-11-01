-- 用户自愿提交的 CCMSA（NBME Step 3 自测）成绩，用于将来研究 CCMSA 与真实 Step 3 分数的关系。
-- 留了邮箱的提交会在 score_reports 里另建一行（stripe_session_id = 'ccmsa_' || id），复用出分提醒邮件回填真实分数。
CREATE TABLE IF NOT EXISTS `ccmsa_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`form` integer NOT NULL,
	`assessment_score` integer NOT NULL,
	`exam_date` integer,
	`email` text,
	`score_feedback_session_id` text,
	`consented_at` integer NOT NULL,
	`ip` text,
	`user_agent` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_ccmsa_submissions_form` ON `ccmsa_submissions` (`form`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_ccmsa_submissions_created` ON `ccmsa_submissions` (`created_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_ccmsa_submissions_email` ON `ccmsa_submissions` (`email`);
