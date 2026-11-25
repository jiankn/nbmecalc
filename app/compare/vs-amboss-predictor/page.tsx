import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CompareTable, type CompareRow } from "@/components/sections/compare-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBMEcalc vs AMBOSS: 2026 Comparison",
  description:
    "Find the official AMBOSS Score Predictor for Step 1 or Step 3 and compare its inputs, results, and access requirements with NBMEcalc.",
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
      "Find AMBOSS's official Step 1 and Step 3 predictors and compare the two tools' inputs, results, and access requirements.",
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
const REVIEWED_AT = "November 25, 2026";
const AMBOSS_PREDICTOR_URL = "https://www.amboss.com/us/score-predictor";
const AMBOSS_PREDICTOR_HELP_URL =
  "https://support.amboss.com/hc/en-us/articles/25051203159313-USMLE-Score-Predictor";

const rows: CompareRow[] = [
  { feature: "Use without a paid subscription", values: ["yes", "no"] },
  { feature: "Accepts multiple practice results", values: ["yes", "yes"] },
  { feature: "NBME form inputs", values: ["yes", "yes"] },
  { feature: "Free 120 input", values: ["yes", "yes"] },
  { feature: "UWorld Self-Assessment inputs", values: ["yes", "yes"] },
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
            dateModified: "2026-11-25",
          }),
        }}
      />

      <PageHero
        badge="Head-to-head review"
        title="NBMEcalc vs AMBOSS: 2026 Comparison"
        description="Compare access, practice inputs, score ranges, and published evidence. Find the official AMBOSS tool for Step 1 or Step 3, or open NBMEcalc's converter for a Step 2 Self-Assessment score."
        size="md"
      />

      <section id="amboss-step-1-and-step-3" className="scroll-mt-24 border-b border-gray-200 bg-white py-12 lg:py-16">
        <div className="container max-w-3xl space-y-5">
          <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
            How to use the AMBOSS Score Predictor for Step 1 or Step 3
          </h2>
          <p className="leading-relaxed text-gray-700">
            AMBOSS offers its own Score Predictor for both exams. Open the{" "}
            <a href={AMBOSS_PREDICTOR_URL} data-evidence-source="primary" className="font-semibold text-mint-800 underline underline-offset-4">
              official AMBOSS Score Predictor
            </a>
            , sign in with an active membership, and set your study objective to the Step
            you plan to take. AMBOSS requires a target exam date and at least two supported
            practice results, including one taken within four weeks of that date.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-extrabold text-gray-950">Step 1</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Read the passing likelihood alongside your recent NBME CBSSA reports.
                The official Step 1 result is pass/fail. If you have a CBSSA report,
                use the{" "}
                <Link href="/nbme-step-1-score-conversion" className="font-semibold text-mint-800 underline underline-offset-4">
                  Step 1 readiness check
                </Link>{" "}
                to compare your reported range with the low-pass band.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5">
              <h3 className="font-extrabold text-gray-950">Step 3</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                AMBOSS lists both UWorld Step 3 self-assessments among its inputs.
                If you already have one of those reports, the{" "}
                <Link href="/step-3-predictor#uwsa-step-3" className="font-semibold text-mint-800 underline underline-offset-4">
                  UWorld Step 3 score guide
                </Link>{" "}
                explains which score to use for a separate NBMEcalc estimate.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            See the full list of accepted results in the{" "}
            <a href={AMBOSS_PREDICTOR_HELP_URL} data-evidence-source="primary" className="font-semibold text-mint-800 underline underline-offset-4">
              AMBOSS Score Predictor help guide
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
            <strong className="text-gray-950">Review method:</strong> public
            product information checked {REVIEWED_AT}. A partial mark means
            support is limited or unclear in the product documentation.
            The table compares features and access.
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
              href={AMBOSS_PREDICTOR_URL}
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
              NBMEcalc AMBOSS Step 2 converter
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
              <Link href="/amboss-converter">AMBOSS Step 2 converter</Link>
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
