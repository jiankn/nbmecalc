interface Env {
  SITE_URL: string;
  SCORE_FEEDBACK_SECRET?: string;
  PDF_RENDERER_SECRET?: string;
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    await runReminderJob(env);
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true }, 200);
    }
    if (request.method !== "POST" || url.pathname !== "/run") {
      return new Response("Not found", { status: 404 });
    }
    const result = await runReminderJob(env);
    return json(result, result.ok ? 200 : 502);
  },
};

async function runReminderJob(env: Env): Promise<{ ok: boolean; status?: number; body?: string }> {
  const secret = readSecret(env);
  if (!secret) return { ok: false, body: "missing secret" };

  const endpoint = new URL("/api/score-feedback/reminders", env.SITE_URL);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "X-Score-Feedback-Secret": secret },
  });
  const body = await res.text();
  if (!res.ok) {
    console.error("[score-feedback-cron] reminder job failed", res.status, body);
  }
  return { ok: res.ok, status: res.status, body };
}

function readSecret(env: Env): string | null {
  if (env.SCORE_FEEDBACK_SECRET) return env.SCORE_FEEDBACK_SECRET;
  if (env.PDF_RENDERER_SECRET) return `score-feedback:${env.PDF_RENDERER_SECRET}`;
  return null;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
