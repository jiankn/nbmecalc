import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { loadSession } from "@/lib/auth/session";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "edge";

const ALLOWED_TYPES = new Set([
  "landing_view",
  "calculator_started",
  "result_viewed",
  "paywall_opened",
  "report_viewed",
]);
const ALLOWED_PAYLOAD_KEYS = new Set([
  "path",
  "step",
  "predictionId",
  "inputCount",
  "plan",
]);

function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body must be an object." }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;
  if (typeof raw.type !== "string" || !ALLOWED_TYPES.has(raw.type)) {
    return NextResponse.json({ error: "Unsupported event type." }, { status: 400 });
  }

  const cleanPayload: Record<string, string | number | boolean | null> = {};
  if (raw.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)) {
    for (const [key, value] of Object.entries(raw.payload as Record<string, unknown>)) {
      if (!ALLOWED_PAYLOAD_KEYS.has(key)) continue;
      if (
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        cleanPayload[key] = typeof value === "string" ? value.slice(0, 160) : value;
      }
    }
  }

  const db = getDb();
  const ip = getClientIp(req);
  const verdict = await checkRateLimit(db, {
    bucket: "product-event",
    identifier: `ip:${ip}`,
    limit: 120,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Too many events." },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  if (!db) {
    return NextResponse.json(
      { ok: true, persisted: false },
      { status: 202, headers: rateLimitHeaders(verdict) }
    );
  }

  let userId: string | null = null;
  try {
    userId = (await loadSession(db, req))?.user.id ?? null;
  } catch {
    // Anonymous events are still useful when auth lookup is unavailable.
  }

  try {
    await db.insert(events).values({
      id: crypto.randomUUID(),
      userId,
      type: raw.type,
      payload: JSON.stringify(cleanPayload),
      ip,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("[/api/events] D1 persist failed", error);
    return NextResponse.json(
      { ok: true, persisted: false },
      { status: 202, headers: rateLimitHeaders(verdict) }
    );
  }

  return NextResponse.json(
    { ok: true, persisted: true },
    { headers: rateLimitHeaders(verdict) }
  );
}
