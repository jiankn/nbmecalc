import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { events, predictionShares } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import {
  hashShareManageToken,
  parsePredictionShareInput,
} from "@/lib/prediction-share";

export const runtime = "edge";

const SHARE_LIMIT_PER_HOUR = 20;

function getClientIp(req: Request): string {
  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];
  return candidates.find(Boolean) ?? "unknown";
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = parsePredictionShareInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Sharing is temporarily unavailable." },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  const verdict = await checkRateLimit(db, {
    bucket: "prediction-share",
    identifier: `ip:${ip}`,
    limit: SHARE_LIMIT_PER_HOUR,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Too many share links. Try again later." },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  let userId: string | null = null;
  try {
    const session = await loadSession(db, req);
    userId = session?.user.id ?? null;
  } catch {
    // Anonymous sharing remains available if session lookup fails.
  }

  const token = crypto.randomUUID().replaceAll("-", "");
  const manageToken = crypto.randomUUID().replaceAll("-", "");
  const manageTokenHash = await hashShareManageToken(manageToken);
  const now = Date.now();

  try {
    await db.batch([
      db.insert(predictionShares).values({
        token,
        manageTokenHash,
        userId,
        step: parsed.step,
        pointEstimate: parsed.pointEstimate,
        ciLower: parsed.ciLower,
        ciUpper: parsed.ciUpper,
        createdAt: now,
        revokedAt: null,
      }),
      db.insert(events).values({
        id: crypto.randomUUID(),
        userId,
        type: "share_link_created",
        // Deliberately excludes score data and the management secret.
        payload: JSON.stringify({ step: parsed.step }),
        ip,
        createdAt: now,
      }),
    ]);
  } catch (error) {
    console.error("[/api/shares] failed to create share", error);
    return NextResponse.json(
      { error: "Unable to create the share link. Please try again." },
      { status: 500, headers: rateLimitHeaders(verdict) }
    );
  }

  const publicUrl = `${new URL(req.url).origin}/share/${token}`;
  return NextResponse.json(
    { token, manageToken, publicUrl },
    {
      status: 201,
      headers: {
        ...rateLimitHeaders(verdict),
        "Cache-Control": "no-store",
      },
    }
  );
}
