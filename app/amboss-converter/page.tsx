import type { Metadata } from "next";
import Link from "next/link";
import { FileInput, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Use Your AMBOSS Step 2 Score — Free Planning Range",
  description:
    "Enter the 3-digit score from your AMBOSS Step 2 Self-Assessment report and get an independent planning range. Free, no login, with clear limitations.",
  keywords: [
    "amboss score predictor step 2",
    "amboss step 2 score predictor",
    "amboss predictor step 2",
    "amboss calculator step 2",
    "amboss to step",
    "amboss to step 2",
    "amboss self assessment",
    "amboss converter",
    "amboss step 2 prediction",
  ],
  alternates: { canonical: "https://nbmecalc.com/amboss-converter" },
  openGraph: {
    title: "Use Your AMBOSS Step 2 Score — Free Planning Range",
    description:
      "Enter the 3-digit score from your AMBOSS Step 2 Self-Assessment report and review it in an independent planning range.",
    url: "https://nbmecalc.com/amboss-converter",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "AMBOSS to Step 2 CK conversion",
      },
    ],
  },
};

const inputGuide = [
  {
    reportValue: "3-digit score",
    action: "Enter this value",
    example: "245",
  },
  {
    reportValue: "Percent correct",
    action: "Do not enter it here",
    example: "Use the 3-digit report score",
  },
  {
    reportValue: "Percentile",
    action: "Do not enter it here",
    example: "Percentile is a different scale",
  },
];

const faqs = [
  {
    q: "How accurate is AMBOSS Self-Assessment for Step 2 CK?",
    a: "NBMEcalc preserves the 3-digit AMBOSS estimate and gives it a lower internal weight when combining sources, but a reproducible validation study is not published. Compare it with a recent CCSSA or Free 120 and use the full planning range.",
  },
  {
    q: "Should I enter my AMBOSS percent correct or 3-digit score?",
    a: "Enter the 3-digit score shown in your AMBOSS Step 2 Self-Assessment report. Do not enter a block percentage or percentile, because those values use different scales.",
  },
  {
    q: "Should I take AMBOSS Self-Assessment if I have NBMEs?",
    a: "Choose an assessment based on the decision it would change, timing, cost, and whether you need another comprehensive result. Compare any AMBOSS result with current official assessment feedback rather than using a universal hierarchy.",
  },
  {
    q: "What AMBOSS score predicts a 250 Step 2 CK?",
    a: "AMBOSS already reports its own 3-digit estimate. NBMEcalc preserves that value as the AMBOSS input, applies a lower internal source weight when combining assessments, and displays an unvalidated planning range rather than claiming a universal point correction.",
  },
];

export default function AmbossConverterPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AMBOSS to Step 2 CK Converter",
            url: "https://nbmecalc.com/amboss-converter",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Independent planning estimate from an AMBOSS Self-Assessment input to a Step 2 CK range.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <PageHero
        badge="AMBOSS → Step 2 CK"
        title="Use Your AMBOSS Step 2 Score Predictor Result"
        description="Enter the 3-digit score from your AMBOSS Step 2 Self-Assessment report. NBMEcalc keeps that reported estimate as the input and shows an independent planning range with explicit limitations."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Enter your 3-digit AMBOSS Step 2 score
          </h2>
          <p className="text-gray-600">
            Use the 3-digit score from the AMBOSS report—not percent correct or
            percentile. Add a recent CCSSA or Free 120 later if you want to
            compare independent signals.
          </p>
        </div>
        <Calculator
          defaultStep="step2"
          defaultSource="AMBOSS"
          singleAssessment
        />
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
              <FileInput className="h-5 w-5 text-amber-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Which AMBOSS report value should I enter?
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            The AMBOSS Step 2 Self-Assessment already provides a 3-digit score.
            Enter that score unchanged. NBMEcalc uses its own weighting and
            planning-range assumptions when you combine it with other sources.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Report value</th>
                  <th className="text-left px-5 py-3 font-bold text-mint-700">What to do</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {inputGuide.map((row) => (
                  <tr key={row.reportValue}>
                    <td className="px-5 py-3 font-bold text-gray-950">{row.reportValue}</td>
                    <td className="px-5 py-3 text-gray-700">{row.action}</td>
                    <td className="px-5 py-3 text-gray-700">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <strong>Evidence limit:</strong> NBMEcalc has not published a
              reproducible validation study for its AMBOSS weighting or planning
              range. Use the official AMBOSS report as the source of the 3-digit
              input and compare high-stakes decisions with current official
              assessment guidance.
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-700">
            See how AMBOSS describes its 3-digit Self-Assessment report in its{" "}
            <a
              href="https://www.amboss.com/us/usmle/self-assessment/step2"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              official Step 2 Self-Assessment page
            </a>
            . For NBMEcalc&apos;s internal handling, read the{" "}
            <Link
              href="/methodology"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              methodology and limitations
            </Link>
            .
          </p>

          <p className="mt-4 text-sm text-gray-700">
            Choosing between study platforms? Read the{" "}
            <Link
              href="/blog/amboss-vs-uworld-which-qbank-wins"
              data-indexing-context="related"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              source-checked AMBOSS vs UWorld decision guide
            </Link>
            , which separates verified product features from personal study
            preferences.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            AMBOSS → Step 2 CK FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-950 list-none">
                  <span>{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What does my AMBOSS score really mean?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Convert my AMBOSS score</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="/step-2-predictor"
                data-indexing-context="related"
              >
                Step 2 CK predictor
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
