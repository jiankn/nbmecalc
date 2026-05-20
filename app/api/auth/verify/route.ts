/**
 * GET /api/auth/verify?token=...&next=/dashboard
 *
 * Consumes a magic link token, creates the user if first sign-in, mints a
 * session cookie, and redirects to `next` (or `/dashboard`).
 *
 * GET (not POST) is deliberate: magic links are clicked from email clients,
 * which can only initiate GET. We accept the CSRF tradeoff because the token
 * itself is the auth secret (one-time, time-bound).
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { consumeMagicLink } from "@/lib/auth/magic-link";
import { buildSessionCookie, createSession } from "@/lib/auth/session";

export const runtime = "edge";

function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function redirect(req: Request, path: string, errorCode?: string): Response {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, req.url);
  if (errorCode) url.searchParams.set("error", errorCode);
  return NextResponse.redirect(url, { status: 302 });
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const token = url.searchParams.get("token")?.trim();
  const nextParam = url.searchParams.get("next");
  const safeNext =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  if (!token) {
    return redirect(req, "/login", "missing_token");
  }

  const db = getDb();
  if (!db) {
    return redirect(req, "/login", "service_unavailable");
  }

  const result = await consumeMagicLink(db, token);
  if (!result.ok) {
    return redirect(req, "/login", result.reason);
  }

  const sid = await createSession(db, result.user.id, {
    ip: getClientIp(req),
    userAgent: req.headers.get("user-agent"),
  });

  // Build redirect with Set-Cookie. NextResponse.redirect doesn't easily
  // accept extra headers in all runtimes, so use the lower-level form.
  const dest = new URL(result.nextPath ?? safeNext, req.url);
  return new Response(null, {
    status: 302,
    headers: {
      Location: dest.toString(),
      "Set-Cookie": buildSessionCookie(sid, {
        secure: url.protocol === "https:",
      }),
    },
  });
}
