/**
 * GET /api/report/preview/pdf
 *
 * Development-only endpoint that renders the premium PDF with the same
 * synthetic input set used by `/report/preview`. In production it returns
 * 404 — paying users must never see synthetic data on the real PDF
 * download endpoint.
 *
 * Use it to eyeball PDF layout changes without going through Stripe
 * Checkout. Pair with `/report/preview` for the web-view counterpart.
 */
import { ReportPdf } from "@/components/report-pdf";
import { pdf } from "@react-pdf/renderer";
import { predictStepScore, type PracticeExam } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREVIEW_EXAMS: PracticeExam[] = [
  { id: "p1", source: "NBME", formNumber: 30, score: 234, takenDaysAgo: 28 },
  { id: "p2", source: "UWSA1", formNumber: 1, score: 242, takenDaysAgo: 14 },
  { id: "p3", source: "NBME", formNumber: 31, score: 250, takenDaysAgo: 4 },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const result = predictStepScore(PREVIEW_EXAMS, "step2", 12, {
    targetScore: 255,
    selfReportedWeakSubjects: ["Biostatistics", "Pharmacology", "Pathology"],
  });

  let blob: Blob;
  try {
    blob = await pdf(
      ReportPdf({
        result,
        exams: PREVIEW_EXAMS,
        sessionId: "cs_preview_dev_only",
        purchasedAt: new Date(),
      })
    ).toBlob();
  } catch (err) {
    console.error("[pdf-preview] render failed", err);
    return new Response(
      JSON.stringify({
        error: "Preview PDF generation failed",
        detail: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // `inline` so the browser previews it in-tab instead of forcing a
      // download — much faster iteration loop when tweaking PDF layout.
      "Content-Disposition": 'inline; filename="nbmecalc-preview.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
