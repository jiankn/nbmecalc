import type { StepKind } from "@/lib/data";

export type ScoreFeedbackAction =
  | "pass_240_plus"
  | "pass_220_239"
  | "pass_200_219"
  | "pass_under_200"
  | "fail";

export interface ScoreFeedbackTokenPayload {
  v: 1;
  sessionId: string;
  action?: ScoreFeedbackAction;
  exp: number;
}

export interface ScoreFeedbackOutcome {
  passFail: "pass" | "fail";
  scoreBand?: string;
}

const TOKEN_VERSION = 1;
const TOKEN_TTL_MS = 540 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const PASS_THRESHOLDS: Record<StepKind, number> = {
  step1: 196,
  step2: 218,
  step3: 198,
};

export function getScoreFeedbackSecret(env: Record<string, unknown>): string | null {
  const explicit = env.SCORE_FEEDBACK_SECRET;
  if (typeof explicit === "string" && explicit.length > 0) return explicit;

  const pdfSecret = env.PDF_RENDERER_SECRET;
  if (typeof pdfSecret === "string" && pdfSecret.length > 0) {
    return `score-feedback:${pdfSecret}`;
  }

  return null;
}

export async function createScoreFeedbackToken(
  sessionId: string,
  secret: string,
  options: { action?: ScoreFeedbackAction; now?: number } = {}
): Promise<string> {
  const now = options.now ?? Date.now();
  const payload: ScoreFeedbackTokenPayload = {
    v: TOKEN_VERSION,
    sessionId,
    action: options.action,
    exp: now + TOKEN_TTL_MS,
  };
  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signature = await sign(`${encodedPayload}`, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifyScoreFeedbackToken(
  token: string,
  secret: string,
  now = Date.now()
): Promise<
  | { ok: true; payload: ScoreFeedbackTokenPayload }
  | { ok: false; reason: "malformed" | "bad-signature" | "expired" }
> {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, reason: "malformed" };
  }

  const expected = await sign(parts[0], secret);
  if (!constantTimeEqual(parts[1], expected)) {
    return { ok: false, reason: "bad-signature" };
  }

  let payload: ScoreFeedbackTokenPayload;
  try {
    payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(parts[0]))
    ) as ScoreFeedbackTokenPayload;
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (payload.v !== TOKEN_VERSION || !payload.sessionId?.startsWith("cs_")) {
    return { ok: false, reason: "malformed" };
  }
  if (payload.exp < now) return { ok: false, reason: "expired" };

  return { ok: true, payload };
}

export function outcomeFromAction(
  action: ScoreFeedbackAction
): ScoreFeedbackOutcome {
  switch (action) {
    case "pass_240_plus":
      return { passFail: "pass", scoreBand: "240+" };
    case "pass_220_239":
      return { passFail: "pass", scoreBand: "220-239" };
    case "pass_200_219":
      return { passFail: "pass", scoreBand: "200-219" };
    case "pass_under_200":
      return { passFail: "pass", scoreBand: "<200" };
    case "fail":
      return { passFail: "fail", scoreBand: "fail" };
  }
}

export function inferOutcomeFromScore(
  actualScore: number,
  step: StepKind | null | undefined
): ScoreFeedbackOutcome {
  const threshold = step ? PASS_THRESHOLDS[step] : 198;
  return {
    passFail: actualScore >= threshold ? "pass" : "fail",
    scoreBand: scoreBandFromScore(actualScore),
  };
}

export function scoreBandFromScore(score: number): string {
  if (score >= 240) return "240+";
  if (score >= 220) return "220-239";
  if (score >= 200) return "200-219";
  return "<200";
}

export function parseExamDate(value: string | null | undefined): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const ms = Date.parse(`${value}T12:00:00.000Z`);
  return Number.isFinite(ms) ? ms : null;
}

export function formatDateInput(ms: number | null | undefined): string {
  if (!ms) return "";
  return new Date(ms).toISOString().slice(0, 10);
}

export function estimateScoreReleaseDate(examDateMs: number): number {
  const target = new Date(examDateMs + 21 * DAY_MS);
  while (target.getUTCDay() !== 3) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  target.setUTCHours(14, 0, 0, 0);
  return target.getTime();
}

export function scoreFeedbackSummaryUrl(siteUrl: string, token: string): string {
  return new URL(`/feedback/${encodeURIComponent(token)}`, siteUrl).toString();
}

export function scoreFeedbackSubmitUrl(siteUrl: string, token: string): string {
  return new URL(`/api/score-feedback/submit?token=${encodeURIComponent(token)}`, siteUrl).toString();
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return base64UrlEncode(new Uint8Array(signature));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function constantTimeEqual(a: string, b: string): boolean {
  const max = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < max; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
