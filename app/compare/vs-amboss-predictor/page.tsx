import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs AMBOSS: 2026 Comparison",
  description:
    "Compare NBMEcalc and the AMBOSS Score Predictor on inputs, planning ranges, published evidence, and access. This page does not calculate a score.",
  keywords: [
    "nbmecalc vs amboss",
    "nbmecalc vs amboss predictor",
    "amboss predictor alternative",
    "amboss vs nbme calculator",
  ],
  alternates: { canonical: "https://nbmecalc.com/compare/vs-amboss-predictor" },
  openGraph: {
    title: "NBMEcalc vs AMBOSS: 2026 Comparison",
    description:
      "Side-by-side comparison of inputs, ranges, evidence, and access. Score entry lives on the AMBOSS score predictor.",
    url: "https://nbmecalc.com/compare/vs-amboss-predictor",
    type: "article",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc vs AMBOSS comparison",
      },
    ],
  },
};

const competitors = ["NBMEcalc", "AMBOSS Predictor"];
const REVIEWED_AT = "September 6, 2026";

const rows: CompareRow[] = [
  { feature: "Use without a paid subscription", values: ["yes", "no"] },
  { feature: "Accepts multiple practice results", values: ["yes", "yes"] },
  { feature: "NBME form inputs", values: ["yes", "yes"] },
  { feature: "Free 120 input", values: ["yes", "yes"] },
  { feature: "UWSA input named on public product page", values: ["yes", "partial"] },
  { feature: "CMS subject-score guidance", values: ["partial", "partial"] },
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
            headline: "NBMEcalc vs AMBOSS: 2026 Comparison",
            url: "https://nbmecalc.com/compare/vs-amboss-predictor",
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-17",
          }),
        }}
      />

      <PageHero
        badge="Head-to-head review"
        title="NBMEcalc vs AMBOSS: 2026 Comparison"
        description="A source-labeled comparison of access, supported inputs, output ranges, and published evidence. To enter an AMBOSS Step 2 score, use the AMBOSS score predictor. Product facts were checked against AMBOSS's public Score Predictor page."
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
            Already have an AMBOSS score?
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            This page only compares the two products. Enter a 3-digit AMBOSS
            Step 2 result on the{" "}
            <Link
              href="/amboss-converter"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              AMBOSS score predictor
            </Link>
            . For several practice tests, use the{" "}
            <Link
              href="/step-2-predictor"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              Step 2 CK predictor
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button variant="primary" size="lg" asChild>
              <Link href="/amboss-converter">AMBOSS score predictor</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">Step 2 CK predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
