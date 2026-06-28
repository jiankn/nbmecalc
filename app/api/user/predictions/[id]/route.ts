/**
 * GET /api/user/predictions/[id]
 *
 * Returns a single prediction's full data for the authenticated user.
 * Includes input_exams and result_snapshot so the dashboard detail page
 * can render the complete prediction without re-running the model.
 *
 * 401 if not authenticated, 404 if the prediction doesn't exist or
 * doesn't belong to this user.
 */
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { predictions, reports } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";
import type { PredictionResult } from "@/lib/data";

// Free accounts may preview at most this many (weakest) cohort subjects.
// Full 14-subject breakdown is a paid feature (PRD §5.2 / §7.1).
const FREE_SUBJECT_PREVIEW = 2;

export const runtime = "edge";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext): Promise<Response> {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const session = await loadSession(db, req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "Invalid prediction id." }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(predictions)
    .where(and(eq(predictions.id, id), eq(predictions.userId, session.user.id)))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Prediction not found." }, { status: 404 });
  }

  // Check if there's a paid report linked to this prediction.
  let reportSessionId: string | null = null;
  try {
    const reportRows = await db
      .select({ stripeSessionId: reports.stripeSessionId })
      .from(reports)
      .where(eq(reports.predictionId, id))
      .limit(1);
    if (reportRows[0]) {
      reportSessionId = reportRows[0].stripeSessionId;
    }
  } catch {
    // Non-critical — if reports table doesn't exist yet, just skip.
  }

  // Entitlement to the full subject-level breakdown: Pro subscribers, or a
  // one-off purchase (a paid report exists for this prediction). Everyone
  // else gets a free preview of just the weakest subjects. Cropping here —
  // not only in the UI — stops a non-paying user from pulling all 14 subjects
  // straight from the API.
  const entitledToFullReport =
    Boolean(session.user.proTier) || reportSessionId !== null;

  const resultSnapshot = JSON.parse(row.resultSnapshot) as PredictionResult;
  const subjectsTotal = resultSnapshot.cohortSubjectAverages?.length ?? 0;
  let subjectsTruncated = false;
  if (!entitledToFullReport && subjectsTotal > FREE_SUBJECT_PREVIEW) {
    resultSnapshot.cohortSubjectAverages = [...resultSnapshot.cohortSubjectAverages]
      .sort((a, b) => a.cohortAverage - b.cohortAverage)
      .slice(0, FREE_SUBJECT_PREVIEW);
    subjectsTruncated = true;
  }

  return NextResponse.json({
    prediction: {
      id: row.id,
      step: row.step,
      pointEstimate: row.pointEstimate,
      ciLower: row.ciLower,
      ciUpper: row.ciUpper,
      passProbability: row.passProbability,
      createdAt: row.createdAt,
      inputExams: JSON.parse(row.inputExams),
      inputOptions: row.inputOptions ? JSON.parse(row.inputOptions) : null,
      daysUntilExam: row.daysUntilExam,
      resultSnapshot,
      algorithmVersion: row.algorithmVersion,
      reportSessionId,
      archivedAt: row.archivedAt,
      pro: Boolean(session.user.proTier),
      subjectsTotal,
      subjectsTruncated,
    },
  });
}
