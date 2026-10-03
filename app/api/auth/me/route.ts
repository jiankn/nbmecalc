/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's public-safe profile, or 401.
 *
 * Used by:
 *   - <Nav> on the marketing site to decide between "Sign in" and "Dashboard"
 *   - <DashboardShell> for greeting / access badge / settings prefill
 *
 * We deliberately do NOT include sensitive fields (deletedAt, ip, audit
 * timestamps). The shape here is the contract the client can rely on.
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { loadSession } from "@/lib/auth/session";
import { buildAdFreeCookie, buildClearAdFreeCookie, hasAdFreeCookie } from "@/lib/ad-free";

export const runtime = "edge";

export async function GET(req: Request): Promise<Response> {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const secure = new URL(req.url).protocol === "https:";
  const hadAdFree = hasAdFreeCookie(req.headers.get("cookie"));

  const session = await loadSession(db, req);
  if (!session) {
    // 未登录时清掉免广告标记（如果有），广告照常显示。
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401, headers: hadAdFree ? { "Set-Cookie": buildClearAdFreeCookie(secure) } : undefined }
    );
  }

  const u = session.user;
  return NextResponse.json(
    {
      user: {
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        lifetimeAccess: u.lifetimeAccess,
        lifetimePurchasedAt: u.lifetimePurchasedAt,
        createdAt: u.createdAt,
      },
    },
    {
      status: 200,
      // Hint to the browser/CDN: cookies make this per-user, never share.
      headers: {
        "Cache-Control": "private, no-store",
        // Lifetime 会员续写免广告标记；不是会员但带着标记（退款、伪造）则清除。
        ...(u.lifetimeAccess
          ? { "Set-Cookie": buildAdFreeCookie(secure) }
          : hadAdFree
            ? { "Set-Cookie": buildClearAdFreeCookie(secure) }
            : {}),
      },
    }
  );
}
