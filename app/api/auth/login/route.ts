/**
 * POST /api/auth/login
 *
 * Issues a Magic Link to the supplied email. Always returns 200 with
 * `{ sent: true }` even when the email rate-limit kicks in — never leak
 * whether a magic link was actually sent (timing/enumeration defense).
 *
 * Rate limits (PRD §7.4):
 *   - 1 minute per email (enforced in `issueMagicLink`)
 *   - 10 per hour per IP (via `checkRateLimit`)
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { issueMagicLink, renderMagicLinkEmail } from "@/lib/auth/magic-link";
import { sendMagicLinkEmail } from "@/lib/email";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "edge";

const LOGIN_LIMIT_PER_HOUR = 10;

function isValidEmail(s: string): boolean {
  // Lightweight RFC 5321 check — we don't try to validate every edge case.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function getSiteUrl(req: Request): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  // Derive from the request as a fallback (dev / preview deploys).
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request): Promise<Response> {
  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const nextPath = typeof b.next === "string" ? b.next : undefined;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  // Constrain nextPath to a safe same-origin pathname.
  const safeNext =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : undefined;

  const ip = getClientIp(req);
  const db = getDb();

  // IP-level rate limit (DB-backed; fail-open if D1 down)
  const verdict = await checkRateLimit(db, {
    bucket: "auth_login",
    identifier: `ip:${ip}`,
    limit: LOGIN_LIMIT_PER_HOUR,
  });
  if (!verdict.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429, headers: rateLimitHeaders(verdict) }
    );
  }

  if (!db) {
    // Without D1 we can't issue tokens; respond with a soft error so dev
    // environments don't lie about emails being sent.
    return NextResponse.json(
      { error: "Auth service unavailable. Try again shortly." },
      { status: 503 }
    );
  }

  const issued = await issueMagicLink(db, {
    email,
    nextPath: safeNext,
    ip,
    userAgent: req.headers.get("user-agent"),
  });

  if (!issued.ok) {
    // Don't expose rate_limited specifics to caller — keep response uniform.
    return NextResponse.json(
      { sent: true, message: "Check your email" },
      { status: 200, headers: rateLimitHeaders(verdict) }
    );
  }

  // Build verify URL and dispatch the email.
  const verifyUrl = new URL(`${getSiteUrl(req)}/verify`);
  verifyUrl.searchParams.set("token", issued.token);
  if (safeNext) verifyUrl.searchParams.set("next", safeNext);

  const { html, text } = renderMagicLinkEmail({
    verifyUrl: verifyUrl.toString(),
    expiresInMinutes: 60,
  });

  try {
    await sendMagicLinkEmail({
      to: email,
      subject: "Sign in to NBMEcalc",
      html,
      text,
    });
  } catch (err) {
    console.error("[/api/auth/login] email dispatch failed", err);
    // Don't blow up the user — they can retry. Reveal-soft.
  }

  return NextResponse.json(
    { sent: true, message: "Check your email" },
    { status: 200, headers: rateLimitHeaders(verdict) }
  );
}
