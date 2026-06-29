/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's public-safe profile, or 401.
 *
 * Used by:
 *   - <Nav> on the marketing site to decide between "Sign in" and "Dashboard"
 *   - <DashboardShell> for greeting / pro-tier badge / settings prefill
 *
 * We deliberately do NOT include sensitive fields (deletedAt, ip, audit
 * timestamps). The shape here is the contract the client can rely on.
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { loadSession } from "@/lib/auth/session";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const session = await loadSession(db, req);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const u = session.user;
  return NextResponse.json(
    {
      user: {
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        proTier: u.proTier,
        proExpiresAt: u.proExpiresAt,
        createdAt: u.createdAt,
      },
    },
    {
      status: 200,
      // Hint to the browser/CDN: cookies make this per-user, never share.
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}
