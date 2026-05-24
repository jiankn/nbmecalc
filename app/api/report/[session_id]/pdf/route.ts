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
import { loadReportFromSession } from "@/lib/session-report";
import { createReportPdf } from "@/lib/report-pdf-edge";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ session_id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { session_id } = await context.params;

  let loaded;
  try {
    loaded = await loadReportFromSession(session_id);
  } catch (err) {
    console.error("[pdf] loadReportFromSession failed", err);
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

  // Filename embeds the predicted score so users can find their report in
  // their Downloads folder months later. We sanitise to ASCII only.
  const stepLabel = data.step.toUpperCase();
  const filename = `nbmecalc-${stepLabel}-${data.result.pointEstimate}.pdf`;
  const body = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Private because each PDF is keyed to a specific paid session.
      // 1-hour browser cache so the second click is instant if they're on
      // a flaky connection; the data is regenerated server-side after that.
      "Cache-Control": "private, max-age=3600",
    },
  });
}
