import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { events, reports, scoreReports } from "@/lib/db/schema";
import { loadReportFromSession } from "@/lib/session-report";
import type { StepKind } from "@/lib/data";
import {
  estimateScoreReleaseDate,
  inferOutcomeFromScore,
  outcomeFromAction,
  type ScoreFeedbackAction,
} from "@/lib/score-feedback";

export type ScoreFeedbackLoadResult =
  | { status: "ok"; record: ScoreFeedbackRecordView }
  | { status: "not_found" | "pending" | "needs_inputs" };

export interface ScoreFeedbackRecordView {
  sessionId: string;
  step: StepKind;
  predictedScore: number;
  ciLower: number;
  ciUpper: number;
  passProbability: number;
  examDate: number | null;
  scoreReleaseDate: number | null;
  submittedAt: number | null;
  actualScore: number | null;
  passFail: "pass" | "fail" | null;
  scoreBand: string | null;
}

export async function loadScoreFeedbackRecord(
  db: Db,
  sessionId: string
): Promise<ScoreFeedbackLoadResult> {
  const loaded = await loadReportFromSession(sessionId);
  if (loaded.status !== "ok") return { status: loaded.status };

  const existing = await db
    .select()
    .from(scoreReports)
    .where(eq(scoreReports.stripeSessionId, sessionId))
    .limit(1);

  const row = existing[0];
  const data = loaded.data;
  return {
    status: "ok",
    record: {
      sessionId,
      step: data.step,
      predictedScore: data.result.pointEstimate,
      ciLower: data.result.ciLower,
      ciUpper: data.result.ciUpper,
      passProbability: data.result.passProbability,
      examDate: row?.examDate ?? null,
      scoreReleaseDate: row?.scoreReleaseDate ?? null,
      submittedAt: row?.submittedAt ?? null,
      actualScore: row?.actualScore ?? null,
      passFail: row?.passFail ?? null,
      scoreBand: row?.scoreBand ?? null,
    },
  };
}

export async function optInScoreFeedback(args: {
  db: Db;
  sessionId: string;
  examDate: number;
  ip: string | null;
  userAgent: string | null;
  source: string;
}): Promise<ScoreFeedbackLoadResult> {
  const loaded = await loadReportFromSession(args.sessionId);
  if (loaded.status !== "ok") return { status: loaded.status };

  const data = loaded.data;
  const now = Date.now();
  const scoreReleaseDate = estimateScoreReleaseDate(args.examDate);
  const reportRow = await findReport(args.db, args.sessionId);

  if (reportRow) {
    await args.db
      .update(reports)
      .set({
        customerEmail: data.customerEmail ?? reportRow.customerEmail ?? null,
        examDate: args.examDate,
        scoreReleaseDate,
        scoreFeedbackOptIn: 1,
      })
      .where(eq(reports.id, reportRow.id));
  }

  const existing = await args.db
    .select({ id: scoreReports.id })
    .from(scoreReports)
    .where(eq(scoreReports.stripeSessionId, args.sessionId))
    .limit(1);

  const values = {
    reportId: reportRow?.id ?? null,
    predictionId: data.predictionId ?? reportRow?.predictionId ?? null,
    userId: reportRow?.userId ?? null,
    email: data.customerEmail ?? reportRow?.customerEmail ?? null,
    step: data.step,
    predictedScore: data.result.pointEstimate,
    ciLower: data.result.ciLower,
    ciUpper: data.result.ciUpper,
    passProbability: data.result.passProbability,
    examDate: args.examDate,
    scoreReleaseDate,
    optedInAt: now,
    optInSource: args.source,
    ip: args.ip,
    userAgent: args.userAgent,
    updatedAt: now,
  };

  if (existing[0]) {
    await args.db
      .update(scoreReports)
      .set(values)
      .where(eq(scoreReports.id, existing[0].id));
  } else {
    await args.db.insert(scoreReports).values({
      id: crypto.randomUUID(),
      stripeSessionId: args.sessionId,
      tier: "self_reported",
      createdAt: now,
      ...values,
    });
  }

  await recordScoreFeedbackEvent(args.db, {
    type: "score_feedback_opted_in",
    userId: reportRow?.userId ?? null,
    payload: {
      stripeSessionId: args.sessionId,
      predictionId: data.predictionId ?? reportRow?.predictionId ?? null,
      examDate: args.examDate,
      scoreReleaseDate,
      source: args.source,
    },
    ip: args.ip,
  });

  return loadScoreFeedbackRecord(args.db, args.sessionId);
}

export async function submitScoreFeedback(args: {
  db: Db;
  sessionId: string;
  action?: ScoreFeedbackAction;
  actualScore?: number;
  passFail?: "pass" | "fail";
  scoreReportUrl?: string | null;
  ip: string | null;
  userAgent: string | null;
  source: string;
}): Promise<ScoreFeedbackLoadResult> {
  const loaded = await loadReportFromSession(args.sessionId);
  if (loaded.status !== "ok") return { status: loaded.status };

  const data = loaded.data;
  const now = Date.now();
  const reportRow = await findReport(args.db, args.sessionId);
  const actionOutcome = args.action ? outcomeFromAction(args.action) : null;
  const scoreOutcome =
    typeof args.actualScore === "number"
      ? inferOutcomeFromScore(args.actualScore, data.step)
      : null;

  const passFail = args.passFail ?? scoreOutcome?.passFail ?? actionOutcome?.passFail;
  const scoreBand = scoreOutcome?.scoreBand ?? actionOutcome?.scoreBand ?? null;
  if (!passFail) return { status: "needs_inputs" };

  const existing = await args.db
    .select({ id: scoreReports.id })
    .from(scoreReports)
    .where(eq(scoreReports.stripeSessionId, args.sessionId))
    .limit(1);

  const values = {
    reportId: reportRow?.id ?? null,
    predictionId: data.predictionId ?? reportRow?.predictionId ?? null,
    userId: reportRow?.userId ?? null,
    email: data.customerEmail ?? reportRow?.customerEmail ?? null,
    step: data.step,
    predictedScore: data.result.pointEstimate,
    ciLower: data.result.ciLower,
    ciUpper: data.result.ciUpper,
    passProbability: data.result.passProbability,
    actualScore: args.actualScore ?? null,
    passFail,
    scoreBand,
    scoreReportUrl: args.scoreReportUrl ?? null,
    tier: args.scoreReportUrl ? "self_reported_with_url" : "self_reported",
    source: args.source,
    ip: args.ip,
    userAgent: args.userAgent,
    submittedAt: now,
    updatedAt: now,
  };

  if (existing[0]) {
    await args.db
      .update(scoreReports)
      .set(values)
      .where(eq(scoreReports.id, existing[0].id));
  } else {
    await args.db.insert(scoreReports).values({
      id: crypto.randomUUID(),
      stripeSessionId: args.sessionId,
      examDate: null,
      scoreReleaseDate: null,
      createdAt: now,
      ...values,
    });
  }

  if (reportRow) {
    await args.db
      .update(reports)
      .set({ scoreFeedbackLastSubmittedAt: now })
      .where(eq(reports.id, reportRow.id));
  }

  await recordScoreFeedbackEvent(args.db, {
    type: "score_feedback_submitted",
    userId: reportRow?.userId ?? null,
    payload: {
      stripeSessionId: args.sessionId,
      predictionId: data.predictionId ?? reportRow?.predictionId ?? null,
      actualScore: args.actualScore ?? null,
      passFail,
      scoreBand,
      source: args.source,
    },
    ip: args.ip,
  });

  return loadScoreFeedbackRecord(args.db, args.sessionId);
}

async function findReport(db: Db, sessionId: string) {
  const rows = await db
    .select()
    .from(reports)
    .where(eq(reports.stripeSessionId, sessionId))
    .limit(1);
  return rows[0] ?? null;
}

async function recordScoreFeedbackEvent(
  db: Db,
  args: {
    userId: string | null;
    type: string;
    payload: Record<string, unknown>;
    ip: string | null;
  }
): Promise<void> {
  try {
    await db.insert(events).values({
      id: crypto.randomUUID(),
      userId: args.userId,
      type: args.type,
      payload: JSON.stringify(args.payload),
      ip: args.ip,
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("[score-feedback] event write failed", err);
  }
}
