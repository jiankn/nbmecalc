import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs PredictMyStepScore — Which Predicts Better? | 2026 Comparison",
  description:
    "Side-by-side comparison of NBMEcalc and PredictMyStepScore. Accuracy, features, pricing, and UX reviewed by the NBMEcalc team.",
  keywords: [
    "nbmecalc vs predictmystepscore",
    "predictmystepscore alternative",
    "predictmystepscore review",
    "step 2 predictor comparison",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/vs-predictmystepscore" },
  openGraph: {
    title: "NBMEcalc vs PredictMyStepScore — 2026 Comparison",
    description:
      "Honest head-to-head between NBMEcalc and PredictMyStepScore: features, accuracy, pricing, UX.",
    url: "https://nbmecalc.com/compare/vs-predictmystepscore",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc vs PredictMyStepScore",
      },
    ],
  },
};

const competitors = ["NBMEcalc", "PredictMyStepScore"];

const rows: CompareRow[] = [
  { feature: "Free unlimited predictions", values: ["yes", "partial"] },
  { feature: "Multi-source aggregation (NBME + UWSA + Free 120 + AMBOSS + CMS)", values: ["yes", "no"] },
  { feature: "95% confidence interval", values: ["yes", "no"] },
  { feature: "Pass probability for Step 1 P/F", values: ["yes", "partial"] },
  { feature: "Per-subject weakness map", values: ["yes", "no"] },
  { feature: "Personalized 14-day study plan", values: ["yes", "no"] },
  { feature: "Downloadable PDF report", values: ["yes", "yes"] },
  { feature: "Mobile-optimized (responsive)", values: ["yes", "partial"] },
  { feature: "Real medical reviewer signoff", values: ["yes", "no"] },
  { feature: "Transparent methodology document", values: ["yes", "no"] },
  { feature: "Single-Report price", values: ["yes", "yes"] },
  { feature: "Multi-Step tracking", values: ["partial", "no"] },
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
            headline: "NBMEcalc vs PredictMyStepScore — 2026 Comparison",
            url: "https://nbmecalc.com/compare/vs-predictmystepscore",
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-17",
          }),
        }}
      />

      <PageHero
        badge="Head-to-head review"
        title="NBMEcalc vs PredictMyStepScore"
        description="PredictMyStepScore has been around longer. We launched in 2026 with a more modern stack. Here is the unvarnished comparison."
        size="md"
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8">
            Feature-by-feature
          </h2>
          <CompareTable competitors={competitors} rows={rows} />
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Where PredictMyStepScore wins
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>Six years of brand recognition on Reddit r/Step2</li>
            <li>Larger historical dataset (claimed)</li>
            <li>Familiar to attending physicians who recommend it to clerks</li>
          </ul>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-12">
            Where NBMEcalc wins
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>Multi-source aggregation (5 input types vs 2)</li>
            <li>95% confidence interval — no other tool offers this</li>
            <li>Free unlimited predictions without signup</li>
            <li>Per-subject weakness map with a personalized 14-day plan</li>
            <li>Modern mobile UX — install as a PWA</li>
            <li>Methodology document with reviewer signoff</li>
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-mint-300 bg-white p-6">
            <h3 className="font-bold text-lg mb-2">Bottom line</h3>
            <p className="text-gray-700">
              If you want a single-source NBME → Step 2 CK lookup, both work.
              If you want multi-source aggregation, a confidence interval, and
              a study plan tailored to your weak rotations, choose NBMEcalc.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Try NBMEcalc free
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Predict my Step score</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/compare/best-usmle-score-predictor">See full comparison</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
