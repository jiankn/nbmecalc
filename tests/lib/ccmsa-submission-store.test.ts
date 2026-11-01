/**
 * 用真实 SQLite（node:sqlite）跑一遍仓库里的 D1 迁移，再通过 drizzle 的 sqlite-proxy
 * 驱动执行存储代码，验证 CCMSA 提交确实落库、并能走通出分提醒回填流程。
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { describe, expect, it, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

const loadReportFromSessionMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/session-report", () => ({
  loadReportFromSession: loadReportFromSessionMock,
}));

import { saveCcmsaSubmission } from "@/lib/ccmsa-submission-store";
import {
  loadScoreFeedbackRecord,
  submitScoreFeedback,
} from "@/lib/score-feedback-store";
import { estimateScoreReleaseDate } from "@/lib/score-feedback";

const NOW = Date.parse("2026-11-01T12:00:00.000Z");
const EXAM_DATE = Date.parse("2026-11-20T12:00:00.000Z");

function createSqliteDb(): { db: Db; sqlite: DatabaseSync } {
  const sqlite = new DatabaseSync(":memory:");
  const dir = path.resolve(__dirname, "../../lib/db/migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    const sql = readFileSync(path.join(dir, file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) sqlite.exec(statement);
    }
  }

  const db = drizzle(
    async (query, params, method) => {
      const stmt = sqlite.prepare(query);
      const args = params as Array<string | number | null>;
      if (method === "run") {
        stmt.run(...args);
        return { rows: [] };
      }
      const rows = (stmt.all(...args) as Record<string, unknown>[]).map((row) =>
        Object.values(row)
      );
      return { rows: method === "get" ? (rows[0] ?? []) : rows };
    },
    { schema }
  );
  return { db: db as unknown as Db, sqlite };
}

describe("CCMSA submission store (SQLite)", () => {
  it("stores an anonymous submission without scheduling a reminder", async () => {
    const { db, sqlite } = createSqliteDb();

    const saved = await saveCcmsaSubmission({
      db,
      input: { form: 6, assessmentScore: 430, examDate: null, email: null },
      ip: "203.0.113.10",
      userAgent: "test-agent",
      now: NOW,
    });

    expect(saved.scoreFeedbackSessionId).toBeNull();
    expect(sqlite.prepare("SELECT * FROM ccmsa_submissions").all()).toEqual([
      expect.objectContaining({
        id: saved.id,
        form: 6,
        assessment_score: 430,
        email: null,
        score_feedback_session_id: null,
        consented_at: NOW,
      }),
    ]);
    expect(sqlite.prepare("SELECT COUNT(*) AS n FROM score_reports").get()).toEqual({ n: 0 });
    expect(
      sqlite.prepare("SELECT type FROM events").all()
    ).toEqual([{ type: "ccmsa_submitted" }]);
  });

  it("schedules one reminder and accepts the real Step 3 score", async () => {
    const { db, sqlite } = createSqliteDb();

    const saved = await saveCcmsaSubmission({
      db,
      input: {
        form: 7,
        assessmentScore: 512,
        examDate: EXAM_DATE,
        email: "student@example.com",
      },
      ip: "203.0.113.10",
      userAgent: "test-agent",
      now: NOW,
    });
    const sessionId = `ccmsa_${saved.id}`;
    expect(saved.scoreFeedbackSessionId).toBe(sessionId);

    // 提醒 cron 依赖这几列：opted_in_at、email、score_release_date，且 submitted_at 为空
    expect(
      sqlite
        .prepare(
          "SELECT step, email, predicted_score, score_release_date, opted_in_at, opt_in_source, submitted_at FROM score_reports WHERE stripe_session_id = ?"
        )
        .get(sessionId)
    ).toEqual({
      step: "step3",
      email: "student@example.com",
      predicted_score: null,
      score_release_date: estimateScoreReleaseDate(EXAM_DATE),
      opted_in_at: NOW,
      opt_in_source: "ccmsa_research",
      submitted_at: null,
    });

    const loaded = await loadScoreFeedbackRecord(db, sessionId);
    expect(loaded).toMatchObject({
      status: "ok",
      record: {
        sessionId,
        step: "step3",
        predictedScore: null,
        ccmsa: { form: 7, assessmentScore: 512 },
      },
    });

    const submitted = await submitScoreFeedback({
      db,
      sessionId,
      actualScore: 231,
      ip: "203.0.113.10",
      userAgent: "test-agent",
      source: "feedback_page",
    });
    expect(submitted).toMatchObject({
      status: "ok",
      record: { actualScore: 231, passFail: "pass", ccmsa: { form: 7, assessmentScore: 512 } },
    });

    // 配对数据：CCMSA 成绩 + 真实 Step 3 分数可以按会话 id 连起来
    expect(
      sqlite
        .prepare(
          `SELECT c.form, c.assessment_score, s.actual_score
           FROM ccmsa_submissions c
           JOIN score_reports s ON s.stripe_session_id = c.score_feedback_session_id`
        )
        .all()
    ).toEqual([{ form: 7, assessment_score: 512, actual_score: 231 }]);
    expect(loadReportFromSessionMock).not.toHaveBeenCalled();
  });

  it("does not fall back to Stripe for an unknown CCMSA session", async () => {
    const { db } = createSqliteDb();
    await expect(loadScoreFeedbackRecord(db, "ccmsa_missing")).resolves.toEqual({
      status: "not_found",
    });
    expect(loadReportFromSessionMock).not.toHaveBeenCalled();
  });
});
