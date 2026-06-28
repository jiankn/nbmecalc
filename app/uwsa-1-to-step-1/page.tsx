import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, Target, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "UWSA 1 to Step 1 Predictor — Free Pass Probability Calculator | NBMEcalc",
  description:
    "Free UWSA 1 to USMLE Step 1 converter. Adjusts for UWSA 1's known +3 point inflation and outputs your Step 1 pass probability with 95% confidence interval.",
  keywords: [
    "uwsa 1 to step 1",
    "uwsa 1 step 1 conversion",
    "uworld self assessment 1",
    "uwsa 1 predictor",
    "step 1 pass probability uwsa",
  ],
  alternates: { canonical: "https://nbmecalc.com/uwsa-1-to-step-1" },
  openGraph: {
    title: "UWSA 1 to Step 1 Predictor — Free Pass Probability Calculator",
    description:
      "Convert your UWSA 1 score into a USMLE Step 1 pass probability. Auto-corrects UWSA 1's known inflation bias.",
    url: "https://nbmecalc.com/uwsa-1-to-step-1",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "UWSA 1 to Step 1 conversion",
      },
    ],
  },
};

const conversionTable = [
  { uwsa: 170, step1Equiv: 167, passProb: 0.18, label: "High risk" },
  { uwsa: 180, step1Equiv: 177, passProb: 0.42, label: "High risk" },
  { uwsa: 190, step1Equiv: 187, passProb: 0.7, label: "Borderline" },
  { uwsa: 200, step1Equiv: 197, passProb: 0.88, label: "Likely pass" },
  { uwsa: 210, step1Equiv: 207, passProb: 0.96, label: "Strong pass" },
  { uwsa: 220, step1Equiv: 217, passProb: 0.99, label: "Strong pass" },
  { uwsa: 230, step1Equiv: 227, passProb: 0.99, label: "Strong pass" },
  { uwsa: 240, step1Equiv: 237, passProb: 0.99, label: "Strong pass" },
];

const faqs = [
  {
    q: "Is UWSA 1 accurate for Step 1?",
    a: "The calculator applies an internal UWSA 1 source adjustment, but it is not an official conversion or a published validation result. Use it with the official readiness guidance from a current CBSSA.",
  },
  {
    q: "When should I take UWSA 1?",
    a: "About 6 weeks before test day. UWSA 1 is best as a mid-dedicated checkpoint after content review and one round of UWorld blocks. Save UWSA 2 for 2-3 weeks out.",
  },
  {
    q: "What UWSA 1 score corresponds to passing Step 1?",
    a: "A UWSA 1 of 199-200 corresponds to roughly the Step 1 pass threshold equivalent (196). Above 210 your pass probability exceeds 95%.",
  },
  {
    q: "Should I rely on UWSA 1 alone?",
    a: "No. Combine UWSA 1 with at least 2 NBMEs for a tight confidence interval. The calculator below accepts multiple sources and weights recent inputs higher.",
  },
  {
    q: "How does UWSA 1 differ from UWSA 2?",
    a: "The two assessments use different forms and may produce different results. This calculator models them separately, but does not claim a verified universal offset between them.",
  },
];

export default function UWSA1ToStep1Page() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UWSA 1 to Step 1 Predictor",
            url: "https://nbmecalc.com/uwsa-1-to-step-1",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free converter from UWorld Self-Assessment 1 to USMLE Step 1 pass probability with 95% confidence interval.",
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
        badge="UWSA 1 → Step 1 conversion"
        title="UWSA 1 to Step 1: Free Pass Probability Predictor"
        description="Your UWSA 1 score over-predicts your real Step 1 equivalent by ~3 points. We correct that automatically and output a calibrated pass probability with a 95% confidence interval."
        size="md"
      />

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert UWSA 1 to Step 1
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 1</strong> below and enter your UWSA 1 score. Add
            NBME or Free 120 inputs for a tighter prediction.
          </p>
        </div>
        <Calculator defaultStep="step1" />
      </section>

      {/* Conversion table */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              UWSA 1 → Step 1 conversion table
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Lookup your UWSA 1 score and read across to see your equated Step 1
            three-digit equivalent and pass probability.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    UWSA 1 score
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">
                    Step 1 equivalent
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    Pass probability
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conversionTable.map((row) => (
                  <tr key={row.uwsa}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">
                      {row.uwsa}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">
                      {row.step1Equiv}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700 tabular-nums">
                      {(row.passProb * 100).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          row.passProb >= 0.95
                            ? "inline-flex items-center rounded-full bg-mint-100 text-mint-800 px-2.5 py-0.5 text-xs font-bold"
                            : row.passProb >= 0.85
                              ? "inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold"
                              : row.passProb >= 0.6
                                ? "inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold"
                                : "inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-bold"
                        }
                      >
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * UWSA 1 systematically over-predicts by 3 points. Step 1 equivalent
            column already applies that correction. Pass threshold = 196.
          </p>
        </div>
      </section>

      {/* Bias explanation */}
      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-amber-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Why UWSA 1 over-predicts
            </h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              UWorld Self-Assessment 1 was originally calibrated against an
              older Step 1 cohort that scored, on average, lower than today&apos;s
              testers. UWorld has not re-calibrated UWSA 1 since 2020, leaving a
              persistent inflation of about <strong>+3 points</strong> compared
              to the real Step 1 equivalent score.
            </p>
            <p>
              The calculator applies an internal UWSA 1 source adjustment.
              This adjustment is a model assumption, not an official UWorld,
              NBME, or USMLE conversion and not a published validation result.
            </p>
            <p>
              The fix: <strong>subtract 3 points</strong> from your UWSA 1 score
              before reading any conversion table. Our calculator does this for
              you automatically.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-white border border-amber-200 p-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <strong>Caveat:</strong> recent UWorld content updates may have
              tightened UWSA 1&apos;s alignment. We re-validate every quarter
              with fresh r/Step1 outcome submissions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            UWSA 1 → Step 1 FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-950 list-none">
                  <span>{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mint-50/40">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Will I pass Step 1?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Free, no signup. Add your UWSA 1 plus any NBMEs you have for a
            tight pass probability estimate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 1</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-1-predictor">Full Step 1 predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
