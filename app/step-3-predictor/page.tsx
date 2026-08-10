import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CalendarClock, FileCheck2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME 6 & 7 Step 3 Score Conversion — Limits & Alternatives",
  description:
    "There is no official one-to-one CCMSA-to-Step 3 conversion. See the current 10-800 scale, why Forms 6 and 7 are not converted here, and what to use instead.",
  keywords: [
    "nbme 6 step 3 score conversion",
    "nbme 7 step 3 score conversion",
    "nbme step 3 score conversion",
    "step 3 nbme score conversion",
    "ccmsa score conversion",
    "step 3 score predictor",
    "usmle step 3 score predictor",
    "step 3 predictor",
    "step 3 score calculator",
    "usmle step 3 calculator",
    "step 3 ccs predictor",
    "uwsa step 3",
    "step 3 pass probability",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-3-predictor" },
  openGraph: {
    title: "NBME 6 & 7 Step 3 Score Conversion — Limits & Alternatives",
    description:
      "The current CCMSA report uses a 10-800 scale and is not intended to predict Step 3. See the supported alternatives.",
    url: "https://nbmecalc.com/step-3-predictor",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc USMLE Step score predictor",
      },
    ],
  },
};

const ccmsaReportFacts = [
  {
    field: "Assessment Score",
    currentReport: "10-800 scale",
    implication: "Do not enter it in a 1-300 CCSSA field.",
  },
  {
    field: "Reference distribution",
    currentReport: "Mean 500; standard deviation 100",
    implication: "This describes the CCMSA scale, not the Step 3 scale.",
  },
  {
    field: "Official intended use",
    currentReport: "Identify strengths and weaknesses",
    implication: "NBME says CCMSA is not intended to predict Step 3 performance.",
  },
  {
    field: "NBMEcalc handling",
    currentReport: "No CCMSA-to-Step 3 curve",
    implication: "The calculator accepts other supported Step 3 inputs instead.",
  },
];

const interpretationSteps = [
  {
    label: "Read the range",
    advice:
      "Treat the output as an estimated planning range. A single percentage is not a guarantee and has not been independently holdout-calibrated.",
  },
  {
    label: "Check the source family",
    advice:
      "Use Step 3-specific evidence. CCMSA is the relevant NBME family, but its current report explicitly says it is diagnostic rather than a Step 3 prediction.",
  },
  {
    label: "Separate MCQ and CCS preparation",
    advice:
      "The calculator does not ingest a scored CCS component. USMLE states that case-simulation performance affects the final Step 3 score, so practice the official interface separately.",
  },
  {
    label: "Confirm the decision",
    advice:
      "Use current official score standards, your program's guidance, and the full evidence set for scheduling decisions. NBMEcalc does not prescribe a delay interval.",
  },
];

const facts = [
  {
    icon: CalendarClock,
    title: "Two-day exam",
    body: "The current official format lists up to 232 items on Day 1 and up to 180 items plus 13 to 14 case simulations on Day 2.",
  },
  {
    icon: FileCheck2,
    title: "Official software matters",
    body: "USMLE tells examinees to run the current Step 3 interactive testing experience and become familiar with the CCS interface before test day.",
  },
  {
    icon: Briefcase,
    title: "Independent responsibility",
    body: "Step 3 assesses knowledge and skills for assuming independent responsibility for general medical care, with an emphasis on patient management.",
  },
];

const faqs = [
  {
    q: "What is the Step 3 passing score?",
    a: "The current official minimum passing score is 200 for exams administered on or after January 1, 2024. USMLE reviews standards periodically, so verify the current scoring page before relying on this number.",
  },
  {
    q: "Is Step 3 harder than Step 2 CK?",
    a: "The formats and assessed tasks differ, so there is no universal difficulty or score offset. Step 3 is a two-day exam that includes both multiple-choice items and computer-based case simulations.",
  },
  {
    q: "How is CCS scored?",
    a: "USMLE states that case-simulation performance affects the Step 3 score and can affect pass/fail. The official CCS materials show that orders, timing, sequencing, location, treatment, and monitoring can affect performance; there is no universal checklist for every case.",
  },
  {
    q: "How do I convert an NBME 6 score to a Step 3 score?",
    a: "There is no official one-to-one conversion. The current CCMSA report uses a 10-800 Assessment Score and states that CCMSA is not intended to predict Step 3 performance. NBMEcalc therefore does not convert a Form 6 score into an invented three-digit Step 3 midpoint.",
  },
  {
    q: "Is the NBME 7 conversion different from NBME 6?",
    a: "NBMEcalc does not publish a conversion curve for either form. A lack of public form-specific calibration is not evidence that Forms 6 and 7 predict Step 3 identically; use the diagnostic feedback on each official report instead.",
  },
  {
    q: "Which practice resources are predictive?",
    a: "No single practice resource guarantees a Step 3 result. NBME's current CCMSA report is diagnostic rather than predictive. If you use UWSA or sample-question results in NBMEcalc, treat the output as an independent planning estimate and compare it with your broader readiness evidence.",
  },
  {
    q: "When should I take Step 3?",
    a: "Timing depends on eligibility, licensing or visa needs, program requirements, and readiness evidence. Confirm current eligibility and scheduling rules with USMLE and your program rather than relying on a universal training-year window.",
  },
];

export default function Step3PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 3 Predictor",
            url: "https://nbmecalc.com/step-3-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free USMLE Step 3 predictor for residents and IMGs. Estimates a two-day Step 3 score from UWSA Step 3 and Free 120 inputs.",
            dateModified: "2026-08-11",
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
              acceptedAnswer: { "@type": "Answer", text: f.a.replace(/&apos;/g, "'") },
            })),
          }),
        }}
      />

      <PageHero
        badge="Predict your two-day exam"
        title="Step 3 Predictor: NBME 6 & 7 Conversion Limits"
        description="Combine supported UWSA and sample-question inputs into an independent Step 3 planning estimate. Read current CCMSA diagnostic feedback directly from the official report."
        size="md"
      />

      {/* Quick facts */}
      <section className="py-14 lg:py-16 bg-mint-50/40 border-b border-gray-200">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {facts.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <f.icon className="h-6 w-6 text-mint-600 mb-3" />
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-white">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the Step 3 calculator
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 3</strong> below, then enter your UWSA Step 3
            and Free 120 scores. The calculator outputs a three-digit
            estimate with a transparent planning range.
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Note: Step 3 data is sparser than Step 2 CK. Confidence intervals
            remain model-generated planning ranges, not a validated guarantee.
          </p>
        </div>
        <Calculator defaultStep="step3" />
      </section>

      {/* CCMSA score-scale answer */}
      <section id="ccmsa-conversion" className="py-16 lg:py-20 bg-white border-t border-gray-200">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
            How do you convert an NBME CCMSA score to a Step 3 score?
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            You cannot make a supported one-to-one conversion from the current
            CCMSA report to a Step 3 score. The report uses a 10-800 Assessment
            Score and explicitly says CCMSA is not intended to predict Step 3
            performance. NBMEcalc therefore does not accept that number as a
            three-digit NBME input or publish a substitute conversion curve.
          </p>

          <div className="rounded-3xl border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-bold text-gray-900">
                      Report item
                    </th>
                    <th className="text-left px-5 py-3 font-bold text-gray-900">
                      Current report
                    </th>
                    <th className="text-left px-5 py-3 font-bold text-gray-900">
                      Practical implication
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ccmsaReportFacts.map((row) => (
                    <tr key={row.field} className="hover:bg-mint-50/40 transition">
                      <td className="px-5 py-3 font-bold text-gray-950">
                        {row.field}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {row.currentReport}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {row.implication}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-12">
            Verify these fields in the{" "}
            <a
              href="https://www.nbme.org/wp-content/uploads/2026/05/Comprehensive_Medicine_Science_Self-Assessment_Sample.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              current official CCMSA sample score report
            </a>
            .
          </p>

          <h3 className="text-2xl font-extrabold tracking-tight mb-3">
            NBME 6 and NBME 7 Step 3 score conversion
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Searchers often ask for a single number for Form 6 or Form 7, but
            the current report does not provide a Step 3 prediction. NBMEcalc
            does not publish separate form curves, and it also does not assume
            the two forms have identical predictive behavior. Neither claim is
            supported by a public, reproducible calibration dataset.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            Use the report&apos;s content-area feedback to identify strengths and
            weaknesses. If you also have a supported UWSA or sample-question
            result, enter that separately in the calculator above. For the
            differences among NBME report families, use the{" "}
            <Link
              href="/nbme-score-conversion"
              className="text-mint-800 underline underline-offset-4 font-semibold"
            >
              NBME score report guide
            </Link>
            .
          </p>

          <h3 className="text-2xl font-extrabold tracking-tight mb-3">
            Why there is no CCMSA-to-Step 3 conversion table
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            A conversion table would need paired CCMSA and Step 3 outcomes,
            documented inclusion rules, enough observations across the score
            range, and out-of-sample error reporting. This repository currently
            contains none of those ingredients.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The absence of data supports a limit, not a numerical assumption.
            If a versioned, auditable calibration dataset becomes available,
            the model can be evaluated and this page can be revised with measured
            error. Until then, the useful answer is the score-scale distinction
            and the official report&apos;s stated purpose.
          </p>
        </div>
      </section>

      {/* Model interpretation */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            How to read a Step 3 model estimate
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            The calculator does not score CCS performance and does not replace
            official assessment feedback. Use these checks before acting on
            the displayed number.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {interpretationSteps.map((step) => (
              <div
                key={step.label}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-bold text-gray-950">{step.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {step.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCS focus */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            The CCS portion: what the official materials require
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            The current Step 3 format includes 13 to 14 computer-based case
            simulations. The software lets you enter orders, advance simulated
            time, and change the patient&apos;s location as the case evolves.
          </p>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>1. Learn the current interface.</strong> USMLE explicitly
              instructs examinees to run its interactive testing experience
              before test day; the live tutorial is less detailed.
            </p>
            <p>
              <strong>2. Think in a changing timeline.</strong> CCS is dynamic:
              orders, results, treatment, monitoring, and advancing time alter
              what information appears and what should happen next.
            </p>
            <p>
              <strong>3. Use case-specific feedback.</strong> The official
              sample cases explain actions that add to, subtract from, or do
              not affect performance for that scenario.
            </p>
            <p>
              <strong>4. Avoid universal checklists.</strong> USMLE says the CCS
              database contains thousands of possible tests and treatments,
              so no fixed list of orders applies to every case.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a
              href="https://www.usmle.org/exam-resources/step-3-materials/step-3-formats-questions"
              target="_blank"
              rel="noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              USMLE Step 3 formats and CCS samples
            </a>
            <Link
              href="/blog/step-3-ccs-cases-complete-walkthrough"
              data-indexing-context="related"
              className="text-mint-800 underline underline-offset-4"
            >
              Read the source-checked CCS walkthrough
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Step 3 predictor FAQs
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
                <p
                  className="mt-3 text-gray-700 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Take the guesswork out of Step 3
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Combine Step 3-specific inputs, review the full planning range,
            and confirm high-stakes decisions against official evidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 3</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">
                Need Step 2 CK instead?
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
