import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs AMBOSS Predictor — 2026 Comparison",
  description:
    "Compare NBMEcalc and AMBOSS Step 2 CK Predictor. Multi-source input vs ecosystem lock-in, confidence intervals, mobile UX, and pricing reviewed.",
  keywords: [
    "nbmecalc vs amboss",
    "amboss predictor alternative",
    "amboss step predictor",
    "amboss vs nbme calculator",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/vs-amboss-predictor" },
  openGraph: {
    title: "NBMEcalc vs AMBOSS Predictor — 2026 Comparison",
    description:
      "Side-by-side comparison: multi-source aggregation vs AMBOSS ecosystem.",
    url: "https://nbmecalc.com/compare/vs-amboss-predictor",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc vs AMBOSS Predictor",
      },
    ],
  },
};

const competitors = ["NBMEcalc", "AMBOSS Predictor"];

const rows: CompareRow[] = [
  { feature: "Works without AMBOSS subscription", values: ["yes", "no"] },
  { feature: "Exam-specific NBME forms", values: ["yes", "yes"] },
  { feature: "UWSA 1 & 2 input", values: ["yes", "no"] },
  { feature: "Free 120 input", values: ["yes", "yes"] },
  { feature: "CMS Form subject input", values: ["yes", "no"] },
  { feature: "Multi-input weighted aggregation", values: ["yes", "no"] },
  { feature: "95% confidence interval", values: ["yes", "no"] },
  { feature: "Personalized study plan", values: ["yes", "no"] },
  { feature: "Free unlimited use", values: ["yes", "yes"] },
  { feature: "Mobile / PWA", values: ["yes", "partial"] },
  { feature: "Detailed methodology document", values: ["yes", "no"] },
];

export default function VsAmbossPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "NBMEcalc vs AMBOSS Predictor — 2026 Comparison",
            url: "https://nbmecalc.com/compare/vs-amboss-predictor",
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-17",
          }),
        }}
      />

      <PageHero
        badge="Head-to-head review"
        title="NBMEcalc vs AMBOSS Step 2 CK Predictor"
        description="AMBOSS's predictor is a free hook to drive subscription upgrades — it only works inside their ecosystem. NBMEcalc is source-agnostic. Here is the comparison."
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
            When AMBOSS Predictor makes sense
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you are already a heavy AMBOSS user — questions, library, and SA
            — their built-in predictor is convenient and well-integrated. You
            get a quick estimate inside the same tab.
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-12">
            When NBMEcalc wins
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>You used UWorld + NBMEs (no AMBOSS subscription required)</li>
            <li>You want to combine multiple sources for a tighter prediction</li>
            <li>You want a 95% confidence interval (AMBOSS gives a point estimate only)</li>
            <li>You want a personalized study plan based on your weak rotations</li>
            <li>You don&apos;t want to be locked into a specific Q-bank brand</li>
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-mint-300 bg-white p-6">
            <h3 className="font-bold text-lg mb-2">Bottom line</h3>
            <p className="text-gray-700">
              AMBOSS Predictor is a feature, not a tool. NBMEcalc is a
              dedicated, source-agnostic predictor. If you use multiple Q-banks
              (most students do), NBMEcalc gives a more accurate aggregate.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Try the source-agnostic alternative
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Predict my Step score</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/amboss-converter">AMBOSS → Step 2 CK converter</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
