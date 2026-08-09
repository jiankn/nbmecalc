import type { Metadata } from "next";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How to Compare USMLE Score Predictors in 2026 | NBMEcalc",
  description:
    "A source-checked framework for comparing USMLE score predictors by input fit, uncertainty, evidence disclosure, and the decision you need to make.",
  keywords: [
    "best usmle score predictor",
    "usmle score calculator comparison",
    "step 2 predictor review",
    "nbme calculator comparison",
  ],
  alternates: {
    canonical: "https://nbmecalc.com/compare/best-usmle-score-predictor",
  },
  openGraph: {
    title: "How to Compare USMLE Score Predictors in 2026",
    description:
      "Compare predictor claims without treating a feature checklist as an accuracy study.",
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

const criteria = [
  {
    title: "Input fit",
    body: "Confirm that the tool accepts the exact assessment family and target Step exam you are using. Form names that look similar are not automatically interchangeable.",
  },
  {
    title: "Uncertainty",
    body: "Prefer a disclosed range and limitations over a precise-looking number with no explanation of model uncertainty.",
  },
  {
    title: "Evidence status",
    body: "Separate official product facts, internal model assumptions, user reports, and reproducible validation results. They are different levels of evidence.",
  },
  {
    title: "Decision value",
    body: "Choose the tool whose output answers a real planning question. No independent calculator should replace an official score report or institutional guidance.",
  },
];

const publicProductPages = [
  {
    name: "NBMEcalc",
    href: "/methodology",
    body: "Publishes its current source adjustments, planning-range assumptions, limitations, correction history, and validation status.",
    external: false,
  },
  {
    name: "PredictMyStepScore",
    href: "https://predictmystepscore.com/",
    body: "Its public homepage describes support for Step 1, Step 2, and Step 3 and names NBME, UWorld, AMBOSS, and Free 120 among supported inputs.",
    external: true,
  },
  {
    name: "AMBOSS Step 2 CK",
    href: "https://www.amboss.com/us/usmle/step2",
    body: "AMBOSS publishes its Step 2 CK study-product information on this official page. Verify current inclusions and terms there because product details can change.",
    external: true,
  },
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
            headline: "How to Compare USMLE Score Predictors in 2026",
            url: "https://nbmecalc.com/compare/best-usmle-score-predictor",
            author: { "@type": "Organization", name: "NBMEcalc Editorial Team" },
            datePublished: "2026-05-17",
            dateModified: "2026-08-09",
            mainEntityOfPage:
              "https://nbmecalc.com/compare/best-usmle-score-predictor",
          }),
        }}
      />

      <PageHero
        badge="Source-checked comparison"
        title="How to Compare USMLE Score Predictors"
        description="There is no verified universal winner. Compare input fit, uncertainty, evidence disclosure, and decision value—and verify product facts at their current public sources."
        size="md"
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-100">
              <Award className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              Four checks that matter more than a winner badge
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {criteria.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="text-lg font-bold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint-50/40 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-800">
            Sources checked August 9, 2026
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950">
            Start with each product&apos;s current public page
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-700">
            This is a product-information review, not an accuracy study. A
            feature is not evidence that a predicted score is calibrated.
            Unknown or unverified details stay unknown rather than being filled
            with assumptions.
          </p>

          <div className="mt-8 space-y-4">
            {publicProductPages.map((product) => {
              const content = (
                <>
                  <span className="flex items-center gap-2 font-bold text-gray-950">
                    {product.name}
                    {product.external && <ExternalLink className="h-4 w-4" />}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-gray-700">
                    {product.body}
                  </span>
                </>
              );

              return product.external ? (
                <a
                  key={product.name}
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  data-evidence-source="primary"
                  className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={product.name}
                  href={product.href}
                  data-indexing-context="related"
                  className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          <p className="mt-7 text-sm leading-relaxed text-gray-700">
            For a narrower claim-by-claim review, see our{" "}
            <Link
              href="/compare/vs-predictmystepscore"
              data-indexing-context="related"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              source-checked PredictMyStepScore comparison
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Test the workflow, then inspect the limits
          </h2>
          <p className="mx-auto mb-8 mt-3 max-w-2xl text-gray-600">
            Run an estimate with fictional or your own practice values, then
            read what the model can and cannot support before using the result.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Use NBMEcalc free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="/validation"
                data-indexing-context="related"
              >
                View validation status
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
