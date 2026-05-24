import puppeteer from "@cloudflare/puppeteer";

interface Env {
  BROWSER: any;
  PDF_RENDERER_SECRET?: string;
  SITE_URL: string;
}

interface RenderRequest {
  reportUrl?: string;
  filename?: string;
}

const PDF_ROUTE_BASE = "/api/_pdf-renderer";
const PDF_RENDER_ROUTE = `${PDF_ROUTE_BASE}/render`;
const PDF_HEALTH_ROUTE = `${PDF_ROUTE_BASE}/health`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === PDF_HEALTH_ROUTE) {
      return json(
        {
          ok: true,
          browserBinding: Boolean(env.BROWSER),
        },
        200
      );
    }

    if (request.method !== "POST" || !isRenderPath(url.pathname)) {
      return new Response("Not found", { status: 404 });
    }

    if (!env.PDF_RENDERER_SECRET) {
      return json({ error: "PDF renderer secret is not configured" }, 503);
    }

    const provided = request.headers.get("x-pdf-renderer-secret");
    if (!provided || provided !== env.PDF_RENDERER_SECRET) {
      return json({ error: "Unauthorized" }, 401);
    }

    let payload: RenderRequest;
    try {
      payload = (await request.json()) as RenderRequest;
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const reportUrl = validateReportUrl(payload.reportUrl, env.SITE_URL);
    if (!reportUrl) {
      return json({ error: "Invalid reportUrl" }, 400);
    }

    const filename = sanitizeFilename(payload.filename ?? "nbmecalc-report.pdf");
    let browser: any;

    try {
      browser = await puppeteer.launch(env.BROWSER);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 1 });
      await page.goto(reportUrl.toString(), {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForSelector("article", { timeout: 20_000 });
      await page.emulateMediaType("print");

      const pdf = await page.pdf({
        format: "Letter",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
          top: "0.45in",
          right: "0.45in",
          bottom: "0.45in",
          left: "0.45in",
        },
      });

      return new Response(pdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    } catch (err) {
      console.error("[pdf-renderer] render failed", err);
      return json(
        {
          error: "PDF render failed",
          detail: err instanceof Error ? err.message : String(err),
        },
        500
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
};

function validateReportUrl(value: string | undefined, siteUrl: string): URL | null {
  if (!value) return null;

  let parsed: URL;
  let site: URL;
  try {
    parsed = new URL(value);
    site = new URL(siteUrl);
  } catch {
    return null;
  }

  if (parsed.origin !== site.origin) return null;
  if (!parsed.pathname.startsWith("/report/cs_")) return null;
  return parsed;
}

function isRenderPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "");
  return (
    normalized === "" ||
    normalized === PDF_ROUTE_BASE ||
    normalized === PDF_RENDER_ROUTE
  );
}

function sanitizeFilename(value: string): string {
  const cleaned = value
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned.endsWith(".pdf") ? cleaned : `${cleaned || "nbmecalc-report"}.pdf`;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
