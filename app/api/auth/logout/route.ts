/**
 * POST /api/auth/logout
 *
 * Destroys the server-side session and clears the cookie. Always returns 200
 * — calling logout when not logged in is harmless and shouldn't error.
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import {
  buildClearSessionCookie,
  destroySession,
  readSessionCookie,
} from "@/lib/auth/session";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const sid = readSessionCookie(req);
  const db = getDb();

  if (sid && db) {
    try {
      await destroySession(db, sid);
    } catch (err) {
      console.error("[/api/auth/logout] destroy failed", err);
    }
  }

  const url = new URL(req.url);
  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: { "Set-Cookie": buildClearSessionCookie(url.protocol === "https:") },
    }
  );
}
