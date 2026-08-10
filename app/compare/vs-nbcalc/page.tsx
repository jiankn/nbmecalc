import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "nbcalc.netlify.app Alternative — Adds CMS, Free 120 & UWSA",
  description:
    "Looking for nbcalc? See how it compares with NBMEcalc: the same free NBME lookup, plus CMS forms, Free 120, UWSA, and a planning range. No signup.",
  keywords: [
    "nbcalc",
    "nbcalc netlify",
    "nbcalc alternative",
    "nbcalc netlify alternative",
    "nbmecalc vs nbcalc",
    "modern nbme calculator",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/vs-nbcalc" },
  openGraph: {
    title: "nbcalc.netlify.app Alternative — Adds CMS, Free 120 & UWSA",
    description:
      "Looking for nbcalc? See how it compares with NBMEcalc: the same free NBME lookup, plus CMS forms, Free 120, UWSA, and a planning range.",
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
const REVIEWED_AT = "August 10, 2026";

const rows: CompareRow[] = [
  { feature: "Works in a browser without login", values: ["yes", "yes"] },
  { feature: "Step 2 NBME form input", values: ["yes", "yes"] },
  { feature: "UWSA input", values: ["yes", "yes"] },
  { feature: "Free 120 input confirmed on reviewed page", values: ["yes", "partial"] },
  { feature: "CMS subject-form input confirmed on reviewed page", values: ["yes", "partial"] },
  { feature: "Multi-input weighted aggregation", values: ["yes", "no"] },
  { feature: "Model-generated planning range", values: ["yes", "partial"] },
  { feature: "Public methodology and limitations page", values: ["yes", "partial"] },
  { feature: "Free to use", values: ["yes", "yes"] },
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
        description="A direct comparison of the inputs and outputs visible on each public calculator. This review avoids search-ranking claims and does not treat a feature table as an accuracy study."
        size="md"
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
            <strong className="text-gray-950">Review method:</strong> the public
            nbcalc calculator was checked {REVIEWED_AT}. A partial mark means a
            feature was not clearly confirmed in the reviewed public interface;
            it does not prove the feature is absent. No outcome dataset was
            available here for a head-to-head accuracy comparison.
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8">
            Feature-by-feature
          </h2>
          <CompareTable competitors={competitors} rows={rows} />
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            What the reviewed nbcalc page provides
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The reviewed page presents a browser-based Step 2 calculator with
            selectable NBME and UWSA inputs and a clear notice that calculations
            are estimates. It is useful when that visible input list matches the
            result you want to inspect.
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-12">
            What NBMEcalc adds
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>Several compatible inputs can be combined in one model run</li>
            <li>The result includes a model-generated planning range and uncertainty warning</li>
            <li>Internal adjustments, validation limits, and material corrections are public</li>
            <li>Official assessment feedback remains the primary source for readiness decisions</li>
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-mint-300 bg-white p-6">
            <h3 className="font-bold text-lg mb-2">Bottom line</h3>
            <p className="text-gray-700">
              If a single supported input answers your question, inspect the
              simpler calculator directly. If you need to summarize several
              sources and audit the model&apos;s assumptions, NBMEcalc provides that
              workflow. Neither interface establishes accuracy by itself.
            </p>
          </div>

          <div className="mt-8 text-sm font-semibold">
            <a
              href="https://nbcalc.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              Open the reviewed nbcalc calculator
            </a>
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
