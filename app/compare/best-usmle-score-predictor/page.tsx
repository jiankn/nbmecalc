import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Best USMLE Score Predictor 2026 — Honest Comparison | NBMEcalc",
  description:
    "We compared every major USMLE score predictor — nbcalc, PredictMyStepScore, AMBOSS Predictor, and NBMEcalc — using public product information. Honest head-to-head feature matrix.",
  keywords: [
    "best usmle score predictor",
    "usmle score calculator comparison",
    "step 2 predictor review",
    "nbme calculator comparison",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/best-usmle-score-predictor" },
  openGraph: {
    title: "Best USMLE Score Predictor 2026 — Honest Comparison",
    description:
      "Head-to-head comparison of all major USMLE score predictors with a transparent feature matrix.",
    url: "https://nbmecalc.com/compare/best-usmle-score-predictor",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "USMLE score predictor comparison",
      },
    ],
  },
};

const competitors = ["NBMEcalc", "PredictMyStepScore", "AMBOSS", "nbcalc"];

const rows: CompareRow[] = [
  { feature: "NBME forms (28-32)", values: ["yes", "yes", "yes", "yes"] },
  { feature: "UWSA 1 & 2", values: ["yes", "yes", "no", "yes"] },
  { feature: "Free 120", values: ["yes", "no", "yes", "no"] },
  { feature: "AMBOSS SA conversion", values: ["yes", "no", "yes", "no"] },
  { feature: "CMS Form support", values: ["yes", "no", "no", "no"] },
  { feature: "95% confidence interval", values: ["yes", "no", "no", "no"] },
  { feature: "Personalized 14-day study plan", values: ["yes", "no", "no", "no"] },
  { feature: "Downloadable PDF report", values: ["yes", "yes", "no", "no"] },
  { feature: "Mobile-optimized", values: ["yes", "partial", "partial", "no"] },
  { feature: "Free unlimited use", values: ["yes", "partial", "yes", "yes"] },
  { feature: "Multi-Step tracking dashboard", values: ["partial", "no", "no", "no"] },
];

export default function BestPredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Best USMLE Score Predictor 2026 — Honest Comparison",
            url: "https://nbmecalc.com/compare/best-usmle-score-predictor",
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-17",
          }),
        }}
      />

      <PageHero
        badge="USMLE predictor comparison"
        title="Best USMLE Score Predictor 2026"
        description="We compared every major USMLE Step score predictor on 12 features that matter — accuracy, multi-source support, confidence intervals, mobile UX, and trust signals. Here is the honest matrix."
        size="md"
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Feature comparison matrix
            </h2>
          </div>
          <CompareTable competitors={competitors} rows={rows} />
          <p className="text-xs text-gray-500 mt-6">
            Last updated May 2026. Data sourced from public product pages.
            Brand names are property of their respective owners.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl space-y-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Who wins — and where each tool falls short
          </h2>

          <div>
            <h3 className="text-xl font-bold mb-2 text-mint-800">NBMEcalc (us)</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Strongest at:</strong> multi-source aggregation, 95%
              confidence intervals, and personalized study plans.
              <strong>Weakest at:</strong> Pro dashboard timeline still
              in beta. Recommended if you need an end-to-end Step prep tool.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">PredictMyStepScore</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Strongest at:</strong> brand recognition, 6+ year track
              record. <strong>Weakest at:</strong> no confidence intervals,
              limited input sources, paywall before basic prediction.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">AMBOSS Predictor</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Strongest at:</strong> direct integration with AMBOSS
              SA. <strong>Weakest at:</strong> only works inside the AMBOSS
              ecosystem; no UWSA / NBME-only path.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">nbcalc.netlify.app</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Strongest at:</strong> top Google search ranking. <strong>Weakest at:</strong>{" "}
              dated UI, no functionality beyond a basic lookup table, no mobile
              version, no methodology disclosure.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Try the best one free
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            No signup. Multi-source aggregation, 95% CI, and a personalized
            study plan — all free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Use NBMEcalc free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
