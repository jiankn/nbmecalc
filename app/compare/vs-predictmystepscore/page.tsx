import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const REVIEWED_AT = "2026-08-09";
const PMSS_URL = "https://predictmystepscore.com/";

export const metadata: Metadata = {
  title: "NBMEcalc vs PredictMyStepScore — Source-Checked Comparison",
  description:
    "A neutral comparison of NBMEcalc and PredictMyStepScore using features each product currently documents publicly, with unknowns left as unknowns.",
  alternates: { canonical: "https://nbmecalc.com/compare/vs-predictmystepscore" },
  openGraph: {
    title: "NBMEcalc vs PredictMyStepScore — Source-Checked Comparison",
    description:
      "Compare public exam coverage, inputs, outputs, evidence boundaries, and next steps without unsupported accuracy claims.",
    url: "https://nbmecalc.com/compare/vs-predictmystepscore",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc and PredictMyStepScore comparison",
      },
    ],
  },
};

const evidenceRows = [
  {
    criterion: "Public exam scope",
    nbmecalc: "Step 1, Step 2 CK, and Step 3 planning tools",
    pmss: "Its homepage states that it supports Step 1, Step 2 CK, and Step 3 predictions",
  },
  {
    criterion: "Publicly described inputs",
    nbmecalc: "NBME, UWSA, Free 120, AMBOSS, and CMS inputs where compatible",
    pmss: "Its homepage lists NBME, UWorld, AMBOSS, and Free 120 correlations or conversions",
  },
  {
    criterion: "How uncertainty is presented",
    nbmecalc: "Shows an experimental planning range and publishes its current limitations",
    pmss: "Describes results as estimates, not guarantees; the public homepage does not document a shared validation comparison",
  },
  {
    criterion: "Public methodology detail",
    nbmecalc: "Publishes assumptions, model boundaries, validation status, and a correction log",
    pmss: "Provides a high-level algorithm description on its homepage; detailed implementation was not confirmed there",
  },
  {
    criterion: "Price comparison",
    nbmecalc: "The predictor is free; optional paid report and Lifetime access are listed on the pricing page",
    pmss: "No price was visible on the public homepage during this review; verify the current flow directly before purchasing",
  },
];

export default function VsPMSSPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "NBMEcalc vs PredictMyStepScore — Source-Checked Comparison",
            url: "https://nbmecalc.com/compare/vs-predictmystepscore",
            author: {
              "@type": "Organization",
              name: "NBMEcalc Editorial Team",
              url: "https://nbmecalc.com/about",
            },
            datePublished: "2026-05-17",
            dateModified: REVIEWED_AT,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://nbmecalc.com/compare/vs-predictmystepscore",
            },
          }),
        }}
      />

      <PageHero
        badge="Source-checked comparison"
        title="NBMEcalc vs PredictMyStepScore"
        description="This comparison records only what each product currently documents in public. A missing public detail is marked as unconfirmed—not treated as evidence that a feature does not exist."
        size="md"
      />

      <section className="py-10 bg-white border-b border-gray-200">
        <div className="container max-w-4xl">
          <div className="rounded-3xl border border-mint-200 bg-mint-50 p-6 text-sm text-gray-700">
            <strong className="text-gray-950">Review method:</strong> checked against the public PredictMyStepScore homepage on {REVIEWED_AT}. This is not an accuracy study, a hands-on product test, or a claim that either estimate is validated against the same holdout dataset.
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Evidence table
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Use this table to decide what to verify next. It does not rank the tools by accuracy.
          </p>
          <div className="overflow-x-auto rounded-3xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 text-left font-bold">Criterion</th>
                  <th className="px-5 py-4 text-left font-bold text-mint-800">NBMEcalc</th>
                  <th className="px-5 py-4 text-left font-bold">PredictMyStepScore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white align-top">
                {evidenceRows.map((row) => (
                  <tr key={row.criterion}>
                    <th className="px-5 py-4 text-left font-semibold text-gray-950">{row.criterion}</th>
                    <td className="px-5 py-4 text-gray-700 bg-mint-50/30">{row.nbmecalc}</td>
                    <td className="px-5 py-4 text-gray-700">{row.pmss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl space-y-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Which one should you use?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Choose the workflow whose inputs and output explanation match the decision you need to make. Run the same recent practice history only when both tools accept it, record the outputs, and read each product&apos;s limitations before changing an exam plan.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            Neither product should be the sole basis for sitting, postponing, or making an academic decision. Use current official assessment feedback and your school or advisor&apos;s process alongside any independent estimate.
          </div>
          <div>
            <h2 className="text-2xl font-extrabold mb-3">Primary source</h2>
            <a
              href={PMSS_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              PredictMyStepScore public homepage
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Inspect the methods before comparing outputs
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Try NBMEcalc</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/methodology" data-indexing-context="related">Read the methodology</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/compare/best-usmle-score-predictor" data-indexing-context="related">Comparison hub</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
