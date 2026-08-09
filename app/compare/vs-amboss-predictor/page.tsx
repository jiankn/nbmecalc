import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs AMBOSS Predictor — 2026 Comparison",
  description:
    "Compare NBMEcalc and AMBOSS Step 2 CK Predictor. Multi-source input vs ecosystem lock-in, confidence intervals, mobile UX, and pricing compared.",
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
const REVIEWED_AT = "August 10, 2026";

const rows: CompareRow[] = [
  { feature: "Use without a paid subscription", values: ["yes", "no"] },
  { feature: "Accepts multiple practice results", values: ["yes", "yes"] },
  { feature: "NBME form inputs", values: ["yes", "yes"] },
  { feature: "Free 120 input", values: ["yes", "yes"] },
  { feature: "UWSA input named on public product page", values: ["yes", "partial"] },
  { feature: "CMS subject-form input", values: ["yes", "partial"] },
  { feature: "Planning range shown", values: ["yes", "yes"] },
  { feature: "Passing probability shown", values: ["yes", "yes"] },
  { feature: "Public evidence / methodology material", values: ["yes", "yes"] },
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
        description="A source-labeled comparison of access, supported inputs, output ranges, and published evidence. Product facts were checked against AMBOSS's public Score Predictor page."
        size="md"
      />

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
            <strong className="text-gray-950">Review method:</strong> public
            product information checked {REVIEWED_AT}. A partial mark means the
            feature was not clearly confirmed on the reviewed public page; it
            does not prove the feature is absent. This is not an accuracy study.
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
            When the AMBOSS workflow may fit
          </h2>
          <p className="text-gray-700 leading-relaxed">
            AMBOSS states that its Score Predictor accepts practice-exam
            results, updates as results are added, displays a score range and
            passing probability, and connects the output with its study tools.
            It also states that submitting results for a prediction requires
            an active subscription. Verify current access and inclusions on
            the official page before choosing it.
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-12">
            When the NBMEcalc workflow may fit
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>You want to calculate without an account or subscription</li>
            <li>You want to enter the source types explicitly supported here</li>
            <li>You want the internal adjustments and limitations published alongside the tool</li>
            <li>You accept that NBMEcalc has not published a holdout validation report</li>
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-mint-300 bg-white p-6">
            <h3 className="font-bold text-lg mb-2">Bottom line</h3>
            <p className="text-gray-700">
              Choose based on input compatibility, access, evidence disclosure,
              and the decision you need to make—not a winner label. Neither
              product should replace official assessment feedback or an
              institution&apos;s test-date process.
            </p>
          </div>

          <div className="mt-8 text-sm font-semibold">
            <a
              href="https://www.amboss.com/us/usmle/score-predictor"
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              AMBOSS Score Predictor — official product page
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Try the source-agnostic alternative
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Works with UWorld, NBME, UWSA, Free 120, and CMS forms — run the{" "}
            <Link
              href="/step-2-predictor"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              Step 2 CK predictor
            </Link>{" "}
            or the{" "}
            <Link
              href="/step-1-predictor"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              Step 1 predictor
            </Link>
            .
          </p>
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
