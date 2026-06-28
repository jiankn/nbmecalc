import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs nbcalc.netlify.app — Modern Alternative | 2026",
  description:
    "Compare NBMEcalc and the original nbcalc.netlify.app. Modern UI, multi-source inputs, confidence intervals, and study plans vs a basic lookup table.",
  keywords: [
    "nbmecalc vs nbcalc",
    "nbcalc alternative",
    "nbcalc netlify alternative",
    "modern nbme calculator",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/vs-nbcalc" },
  openGraph: {
    title: "NBMEcalc vs nbcalc.netlify.app — 2026 Comparison",
    description:
      "Modern multi-source predictor vs the original basic NBME lookup table.",
    url: "https://nbmecalc.com/compare/vs-nbcalc",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc vs nbcalc",
      },
    ],
  },
};

const competitors = ["NBMEcalc", "nbcalc.netlify.app"];

const rows: CompareRow[] = [
  { feature: "Exam-specific NBME forms", values: ["yes", "yes"] },
  { feature: "UWSA / Free 120 / AMBOSS / CMS input", values: ["yes", "no"] },
  { feature: "Multi-input weighted aggregation", values: ["yes", "no"] },
  { feature: "95% confidence interval", values: ["yes", "no"] },
  { feature: "Pass probability for Step 1 P/F", values: ["yes", "no"] },
  { feature: "Per-subject weakness map", values: ["yes", "no"] },
  { feature: "Sit-or-postpone recommendation + reverse triggers", values: ["yes", "no"] },
  { feature: "3 highest-leverage moves for your input pattern", values: ["yes", "no"] },
  { feature: "Downloadable PDF report", values: ["yes", "no"] },
  { feature: "Mobile-optimized", values: ["yes", "no"] },
  { feature: "Methodology document + reviewer signoff", values: ["yes", "no"] },
  { feature: "Free to use", values: ["yes", "yes"] },
  { feature: "Modern UI", values: ["yes", "no"] },
];

export default function VsNbcalcPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "NBMEcalc vs nbcalc.netlify.app — 2026 Comparison",
            url: "https://nbmecalc.com/compare/vs-nbcalc",
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-17",
          }),
        }}
      />

      <PageHero
        badge="Modern alternative"
        title="NBMEcalc vs nbcalc.netlify.app"
        description="nbcalc.netlify.app is the legacy NBME lookup tool that ranks #1 in Google. It works, but its UI is from 2018 and offers only a basic single-source table. NBMEcalc is the modern multi-source rebuild."
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
            Why nbcalc still ranks #1 in Google
          </h2>
          <p className="text-gray-700 leading-relaxed">
            nbcalc has been around since ~2018 and accumulated backlinks from
            Reddit, Student Doctor Network, and dozens of medical school
            subreddits. SEO rewards age. We respect that — and we&apos;re working
            on closing the gap with better content + better tools.
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-12">
            Why we built NBMEcalc anyway
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>nbcalc&apos;s table covers only NBME 18-30, ignoring NBMEs 31 and 32</li>
            <li>No UWSA, Free 120, AMBOSS, or CMS Form support</li>
            <li>No confidence interval — students get a single misleading number</li>
            <li>Bounce rate 82% (per public Ahrefs data) — UI clearly fails users</li>
            <li>No mobile version; the lookup table doesn&apos;t scroll on phones</li>
            <li>No methodology disclosed; you have to trust an unsigned table</li>
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-mint-300 bg-white p-6">
            <h3 className="font-bold text-lg mb-2">Bottom line</h3>
            <p className="text-gray-700">
              If you only have an NBME score and want a 5-second lookup,
              nbcalc works. If you have multiple sources and want a confidence
              interval, weakness map, and study plan, NBMEcalc is the modern
              alternative.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Try the modern alternative
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Predict my Step score</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion">Full NBME conversion table</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
