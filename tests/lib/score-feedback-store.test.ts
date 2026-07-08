import { afterEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/lib/db/client";
import {
  events,
  reports,
  scoreReports,
  type ScoreReportRow,
} from "@/lib/db/schema";

const loadReportFromSessionMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/session-report", () => ({
  loadReportFromSession: loadReportFromSessionMock,
}));

import {
  loadScoreFeedbackRecord,
  submitScoreFeedback,
} from "@/lib/score-feedback-store";

describe("score feedback store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads a stored feedback snapshot without requiring Stripe", async () => {
    const row = makeScoreReportRow();
    const { db } = createFakeDb({ scoreReportRows: [row] });

    loadReportFromSessionMock.mockResolvedValue({ status: "not_found" });

    const result = await loadScoreFeedbackRecord(db, row.stripeSessionId);

    expect(result).toMatchObject({
      status: "ok",
      record: {
        sessionId: row.stripeSessionId,
        step: "step2",
        predictedScore: 232,
        ciLower: 226,
        ciUpper: 238,
        passProbability: 0.82,
      },
    });
    expect(loadReportFromSessionMock).not.toHaveBeenCalled();
  });

  it("submits one-click feedback from a stored snapshot when Stripe cannot load the session", async () => {
    const row = makeScoreReportRow();
    const state = createFakeDb({ scoreReportRows: [row] });

    loadReportFromSessionMock.mockResolvedValue({ status: "not_found" });

    const result = await submitScoreFeedback({
      db: state.db,
      sessionId: row.stripeSessionId,
      action: "pass_220_239",
      ip: "203.0.113.10",
      userAgent: "test-agent",
      source: "email_one_click",
    });

    expect(result.status).toBe("ok");
    expect(state.scoreReportRows[0]).toMatchObject({
      passFail: "pass",
      scoreBand: "220-239",
      source: "email_one_click",
      ip: "203.0.113.10",
      userAgent: "test-agent",
    });
    expect(state.scoreReportRows[0].submittedAt).toEqual(expect.any(Number));
    expect(state.eventRows).toHaveLength(1);
    expect(loadReportFromSessionMock).not.toHaveBeenCalled();
  });
});

function makeScoreReportRow(
  overrides: Partial<ScoreReportRow> = {}
): ScoreReportRow {
  const now = Date.parse("2026-07-08T00:00:00.000Z");
  return {
    id: "score_report_1",
    reportId: null,
    predictionId: "prediction_1",
    stripeSessionId: "cs_test_feedback_session",
    userId: null,
    email: "student@example.com",
    step: "step2",
    predictedScore: 232,
    ciLower: 226,
    ciUpper: 238,
    passProbability: 0.82,
    examDate: now - 30 * 24 * 60 * 60 * 1000,
    scoreReleaseDate: now - 7 * 24 * 60 * 60 * 1000,
    optedInAt: now - 60 * 24 * 60 * 60 * 1000,
    optInSource: "checkout_success",
    reminderSentAt: now,
    reminderEmailId: "email_1",
    lastReminderError: null,
    actualScore: null,
    passFail: null,
    scoreBand: null,
    scoreReportUrl: null,
    tier: "self_reported",
    source: null,
    ip: null,
    userAgent: null,
    submittedAt: null,
    createdAt: now - 60 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    ...overrides,
  };
}

function createFakeDb({
  scoreReportRows,
}: {
  scoreReportRows: ScoreReportRow[];
}): {
  db: Db;
  scoreReportRows: ScoreReportRow[];
  eventRows: unknown[];
} {
  const eventRows: unknown[] = [];
  const reportRows: unknown[] = [];

  const fakeDb = {
    select(_shape?: unknown) {
      return {
        from(table: unknown) {
          return {
            where(_condition: unknown) {
              return {
                async limit(limit: number) {
                  if (table === scoreReports) {
                    return scoreReportRows.slice(0, limit);
                  }
                  if (table === reports) {
                    return reportRows.slice(0, limit);
                  }
                  return [];
                },
              };
            },
          };
        },
      };
    },
    update(table: unknown) {
      return {
        set(values: Record<string, unknown>) {
          return {
            async where(_condition: unknown) {
              if (table === scoreReports && scoreReportRows[0]) {
                Object.assign(scoreReportRows[0], values);
              }
              return [];
            },
          };
        },
      };
    },
    insert(table: unknown) {
      return {
        async values(row: unknown) {
          if (table === scoreReports) scoreReportRows.push(row as ScoreReportRow);
          if (table === events) eventRows.push(row);
          return [];
        },
      };
    },
  };

  return {
    db: fakeDb as unknown as Db,
    scoreReportRows,
    eventRows,
  };
}
