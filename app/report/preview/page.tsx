/**
 * Development-only preview route for the premium report.
 *
 * Hitting `/report/preview` in `next dev` renders the full ReportView with a
 * synthetic but realistic input set (3 dated NBME forms with an improving
 * trajectory, a target score, self-reported weak subjects, and 12 days to
 * exam). This exercises every one of the seven decision-grade modules
 * (RiskProfile, OneDecision, CohortMirror, HighLeverageMoves, AntiPatterns,
 * TestDayProtocol, HonestUncertainty) plus the legacy supporting analytics.
 *
 * In production this route returns 404 — it must NEVER be reachable by a
 * paying user, because they would otherwise see a fake report keyed to fake
 * inputs instead of their own purchased data.
 */
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ReportView } from "@/components/report-view";
import { predictStepScore, type PracticeExam } from "@/lib/data";

export const dynamic = "force-dynamic";

const PREVIEW_EXAMS: PracticeExam[] = [
  // Ordered oldest → newest so the trajectory module reads as "improving".
  // Spread of equated scores (~234 → ~250) puts the user near the pass
  // threshold but with real upside — that's the most informative scenario
  // for stress-testing OneDecision and RiskProfile copy.
  { id: "p1", source: "NBME", formNumber: 30, score: 234, takenDaysAgo: 28 },
  { id: "p2", source: "UWSA1", formNumber: 1, score: 242, takenDaysAgo: 14 },
  { id: "p3", source: "NBME", formNumber: 31, score: 250, takenDaysAgo: 4 },
];

export default function PreviewReportPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const result = predictStepScore(PREVIEW_EXAMS, "step2", 12, {
    targetScore: 255,
    selfReportedWeakSubjects: ["Biostatistics", "Pharmacology", "Pathology"],
  });

  return (
    <PageShell>
      <div className="bg-amber-50 border-y-2 border-amber-300 py-2 text-center text-xs font-bold uppercase tracking-widest text-amber-800 print:hidden">
        Development preview · synthetic inputs · NEVER reachable in production
      </div>
      <ReportView
        result={result}
        exams={PREVIEW_EXAMS}
        sessionId="cs_preview_dev_only"
        purchasedAt={new Date()}
      />
    </PageShell>
  );
}
