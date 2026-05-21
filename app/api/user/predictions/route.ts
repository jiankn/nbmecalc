/**
 * GET /api/user/predictions
 *
 * Returns the authenticated user's prediction history, ordered newest first.
 * Pagination via `?limit` and `?offset` query params.
 *
 * 401 if no valid session.
 */
import { NextResponse } from "next/server";
import { desc, eq, isNull, isNotNull, and } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { predictions } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";

export const runtime = "edge";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: Request): Promise<Response> {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const session = await loadSession(db, req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const url = new URL(req.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
  const offsetRaw = Number(url.searchParams.get("offset") ?? 0);
  const limit = Math.max(1, Math.min(MAX_LIMIT, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT));
  const offset = Math.max(0, Number.isFinite(offsetRaw) ? offsetRaw : 0);
  // ?archived=true returns only archived predictions; default returns only active.
  const showArchived = url.searchParams.get("archived") === "true";

  const rows = await db
    .select({
      id: predictions.id,
      step: predictions.step,
      pointEstimate: predictions.pointEstimate,
      ciLower: predictions.ciLower,
      ciUpper: predictions.ciUpper,
      passProbability: predictions.passProbability,
      createdAt: predictions.createdAt,
      archivedAt: predictions.archivedAt,
    })
    .from(predictions)
    .where(
      and(
        eq(predictions.userId, session.user.id),
        showArchived ? isNotNull(predictions.archivedAt) : isNull(predictions.archivedAt)
      )
    )
    .orderBy(desc(predictions.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(
    {
      predictions: rows,
      count: rows.length,
      limit,
      offset,
    },
    { status: 200 }
  );
}
