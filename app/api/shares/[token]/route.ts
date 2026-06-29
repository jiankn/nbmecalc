import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { loadSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { events, predictionShares } from "@/lib/db/schema";
import { hashShareManageToken } from "@/lib/prediction-share";
import { isPredictionShareToken } from "@/lib/public-prediction-share";

export const runtime = "edge";

type RouteParams = Promise<{ token: string }>;

export async function DELETE(
  req: Request,
  { params }: { params: RouteParams }
): Promise<Response> {
  const { token } = await params;
  if (!isPredictionShareToken(token)) {
    return NextResponse.json({ error: "Share link not found." }, { status: 404 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Sharing is temporarily unavailable." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const manageToken =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).manageToken
      : null;

  const rows = await db
    .select()
    .from(predictionShares)
    .where(eq(predictionShares.token, token))
    .limit(1);
  const share = rows[0];
  if (!share) {
    return NextResponse.json({ error: "Share link not found." }, { status: 404 });
  }

  let sessionUserId: string | null = null;
  try {
    const session = await loadSession(db, req);
    sessionUserId = session?.user.id ?? null;
  } catch {
    // The management secret below remains sufficient for anonymous users.
  }

  const validManageToken =
    typeof manageToken === "string" &&
    manageToken.length === 32 &&
    (await hashShareManageToken(manageToken)) === share.manageTokenHash;
  const signedInOwner =
    Boolean(share.userId) && sessionUserId === share.userId;

  if (!validManageToken && !signedInOwner) {
    return NextResponse.json(
      { error: "You do not have permission to stop this share." },
      { status: 403 }
    );
  }

  const now = Date.now();
  await db.batch([
    db
      .update(predictionShares)
      .set({ revokedAt: now })
      .where(eq(predictionShares.token, token)),
    db.insert(events).values({
      id: crypto.randomUUID(),
      userId: share.userId,
      type: "share_link_revoked",
      payload: null,
      ip: null,
      createdAt: now,
    }),
  ]);

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
