/**
 * POST /api/user/predictions/[id]/archive   — archive (hide) a prediction
 * DELETE /api/user/predictions/[id]/archive — unarchive (restore) a prediction
 *
 * Archived predictions are hidden from the dashboard list but NOT deleted.
 * True deletion happens via /api/user/delete (GDPR right-to-erasure).
 *
 * 401 if not authenticated, 404 if prediction doesn't belong to this user.
 */
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { predictions } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";

export const runtime = "edge";

type RouteContext = { params: Promise<{ id: string }> };

async function getAuthedPrediction(req: Request, id: string) {
  const db = getDb();
  if (!db) return { error: "Service unavailable.", status: 503, db: null, userId: null };

  const session = await loadSession(db, req);
  if (!session) return { error: "Not authenticated.", status: 401, db: null, userId: null };

  const rows = await db
    .select({ id: predictions.id })
    .from(predictions)
    .where(and(eq(predictions.id, id), eq(predictions.userId, session.user.id)))
    .limit(1);

  if (!rows[0]) return { error: "Prediction not found.", status: 404, db: null, userId: null };

  return { error: null, status: 200, db, userId: session.user.id };
}

/** Archive (hide) */
export async function POST(req: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const { error, status, db } = await getAuthedPrediction(req, id);
  if (error || !db) {
    return NextResponse.json({ error }, { status });
  }

  await db
    .update(predictions)
    .set({ archivedAt: Date.now() })
    .where(eq(predictions.id, id));

  return NextResponse.json({ ok: true, archived: true });
}

/** Unarchive (restore) */
export async function DELETE(req: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const { error, status, db } = await getAuthedPrediction(req, id);
  if (error || !db) {
    return NextResponse.json({ error }, { status });
  }

  await db
    .update(predictions)
    .set({ archivedAt: null })
    .where(eq(predictions.id, id));

  return NextResponse.json({ ok: true, archived: false });
}
