/**
 * GET /api/report/[session_id]/pdf
 *
 * Generates the premium-report PDF on demand for a paid Stripe Checkout
 * session. We deliberately do NOT cache the PDF on disk / R2 yet — it's
 * cheap to re-render server-side, and any algorithm improvement made
 * after purchase is reflected on the next download.
 *
 * Auth: same as the on-screen report page — the session_id IS the auth
 * token. Anyone with the URL can download (intentional, matches "save the
 * report URL after purchase" UX).
 */
import {
  loadProPredictionReport,
  loadReportFromSession,
  type ReportLoadResult,
} from "@/lib/session-report";
import { createReportPdf } from "@/lib/report-pdf-edge";
import { getDb } from "@/lib/db/client";
import { loadSession } from "@/lib/auth/session";
import { getPdfRendererSecret, signReportToken } from "@/lib/report-token";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ session_id: string }> };

const PDF_RENDERER_PATH = "/api/_pdf-renderer/render";
const PDF_RENDERER_SERVICE_TARGET = `service-binding:PDF_RENDERER${PDF_RENDERER_PATH}`;

interface PdfRendererBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

type CloudflareRuntimeEnv = Record<string, unknown> & {
  PDF_RENDERER?: PdfRendererBinding;
};

export async function GET(_req: Request, context: RouteContext) {
  const { session_id } = await context.params;

  // Paid reports are keyed by a Stripe Checkout session (`cs_...`); Pro
  // subscribers reach the same PDF via one of their own prediction ids.
  const isProReport = !session_id.startsWith("cs_");

  let loaded;
  // For a Pro report we keep the authenticated user id around so we can mint
  // a short-lived token authorizing the (cookieless) renderer worker.
  let proUserId: string | null = null;
  try {
    if (isProReport) {
      const pro = await loadProReportForRequest(_req, session_id);
      loaded = pro.result;
      proUserId = pro.userId;
    } else {
      loaded = await loadReportFromSession(session_id);
    }
  } catch (err) {
    console.error("[pdf] load report data failed", err);
    return new Response(
      JSON.stringify({ error: "Failed to load report data", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (loaded.status === "not_found") {
    return new Response("Not found", { status: 404 });
  }
  if (loaded.status === "pending") {
    return new Response(
      "Payment still processing. Please retry in a moment.",
      { status: 409 }
    );
  }
  if (loaded.status === "needs_inputs") {
    return new Response(
      "Calculator inputs missing on this session — re-run the calculator.",
      { status: 422 }
    );
  }

  const { data } = loaded;

  // Filename embeds the predicted score so users can find their report in
  // their Downloads folder months later. We sanitise to ASCII only.
  const stepLabel = data.step.toUpperCase();
  const filename = `nbmecalc-${stepLabel}-${data.result.pointEstimate}.pdf`;

  // The headless PDF worker re-fetches `/report/<id>` server-to-server with no
  // user cookie. Paid reports authenticate via the `cs_` id in the URL; a Pro
  // prediction-id report instead gets a short-lived signed token (minted only
  // after we verified ownership above) so the worker can render the exact same
  // styled page. Without a signing secret we fall back to the edge generator.
  let rendered: PdfWorkerResult;
  if (isProReport) {
    const secret = getPdfRendererSecret();
    if (secret && proUserId) {
      const token = await signReportToken(secret, {
        predictionId: data.sessionId,
        userId: proUserId,
      });
      rendered = await renderWithPdfWorker(_req, data.sessionId, filename, token);
    } else {
      rendered = { ok: false, reason: "pro-no-secret", target: "edge" };
    }
  } else {
    rendered = await renderWithPdfWorker(_req, data.sessionId, filename);
  }
  if (rendered.ok) return rendered.response;

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = createReportPdf(data);
  } catch (err) {
    console.error("[pdf] render failed", err);
    return new Response(
      JSON.stringify({
        error: "PDF generation failed",
        detail: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-PDF-Renderer": "edge-fallback",
      "X-PDF-Fallback-Reason": rendered.reason,
      "X-PDF-Renderer-Target": rendered.target,
      // Private because each PDF is keyed to a specific paid session.
      // No-store prevents stale fallback PDFs from masking a fixed renderer.
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}

/**
 * Pro-report variant of the loader: authenticate the request, require an
 * active Pro subscription, and load the report from a prediction the user
 * owns. Returns `not_found` for anyone who isn't an entitled owner so the
 * route surfaces a plain 404 (same as a bad `cs_` id).
 */
async function loadProReportForRequest(
  req: Request,
  predictionId: string
): Promise<{ result: ReportLoadResult; userId: string | null }> {
  const db = getDb();
  if (!db) return { result: { status: "not_found" }, userId: null };

  const session = await loadSession(db, req);
  if (!session || !session.user.proTier) {
    return { result: { status: "not_found" }, userId: null };
  }
  return {
    result: await loadProPredictionReport(db, session.user.id, predictionId),
    userId: session.user.id,
  };
}

type PdfWorkerResult =
  | { ok: true; response: Response }
  | { ok: false; reason: string; target: string };

async function renderWithPdfWorker(
  req: Request,
  sessionId: string,
  filename: string,
  token?: string
): Promise<PdfWorkerResult> {
  const siteUrl =
    readRuntimeEnv("NEXT_PUBLIC_SITE_URL") ?? new URL(req.url).origin;
  const rendererUrl = resolveRendererUrl(siteUrl);
  const secret = readRuntimeEnv("PDF_RENDERER_SECRET");
  if (!secret) {
    return {
      ok: false,
      reason: "missing-secret",
      target: describeRendererTarget(rendererUrl),
    };
  }

  const reportUrl = new URL(`/report/${encodeURIComponent(sessionId)}`, siteUrl);
  // Pro reports include a signed token so the cookieless worker can render the
  // same styled page a logged-in user sees.
  if (token) reportUrl.searchParams.set("k", token);
  const body = JSON.stringify({
    reportUrl: reportUrl.toString(),
    filename,
  });
  const headers = {
    "Content-Type": "application/json",
    "X-PDF-Renderer-Secret": secret,
  };
  const binding = readPdfRendererBinding();

  if (binding) {
    try {
      const res = await binding.fetch(
        new Request(new URL(PDF_RENDERER_PATH, "https://pdf-renderer.internal"), {
          method: "POST",
          headers,
          body,
          signal: AbortSignal.timeout(30_000),
        })
      );

      if (res.ok) {
        return await pdfWorkerResponse(res, filename, PDF_RENDERER_SERVICE_TARGET);
      }

      console.error("[pdf] renderer service binding failed", res.status, await res.text());
    } catch (err) {
      console.error("[pdf] renderer service binding unavailable", err);
    }
  }

  try {
    const res = await fetch(rendererUrl, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.error("[pdf] renderer worker failed", res.status, await res.text());
      return {
        ok: false,
        reason: `renderer-http-${res.status}`,
        target: describeRendererTarget(rendererUrl),
      };
    }

    return await pdfWorkerResponse(res, filename, describeRendererTarget(rendererUrl));
  } catch (err) {
    console.error("[pdf] renderer worker unavailable", err);
    return {
      ok: false,
      reason: "renderer-unavailable",
      target: describeRendererTarget(rendererUrl),
    };
  }
}

function readRuntimeEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;

  const env = getRuntimeEnv();
  const value = env?.[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readPdfRendererBinding(): PdfRendererBinding | undefined {
  const binding = getRuntimeEnv()?.PDF_RENDERER;
  return binding && typeof binding.fetch === "function" ? binding : undefined;
}

function getRuntimeEnv(): CloudflareRuntimeEnv | undefined {
  return getOptionalRequestContext()?.env as CloudflareRuntimeEnv | undefined;
}

function resolveRendererUrl(siteUrl: string): string {
  const configured = readRuntimeEnv("PDF_RENDERER_URL");
  let url: URL;

  try {
    url = new URL(configured ?? PDF_RENDERER_PATH, siteUrl);
  } catch {
    url = new URL(PDF_RENDERER_PATH, siteUrl);
  }

  const normalizedPath = url.pathname.replace(/\/$/, "");
  if (!normalizedPath || normalizedPath === "/api/_pdf-renderer") {
    url.pathname = PDF_RENDERER_PATH;
  }

  return url.toString();
}

function describeRendererTarget(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "invalid-url";
  }
}

async function pdfWorkerResponse(
  res: Response,
  filename: string,
  target: string
): Promise<PdfWorkerResult> {
  const body = await res.arrayBuffer();
  return {
    ok: true,
    response: new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-PDF-Renderer": "browser-worker",
        "X-PDF-Renderer-Target": target,
      },
    }),
  };
}
