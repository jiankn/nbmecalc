import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CalendarClock, FileCheck2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 3 Score Conversion & Predictor — NBME CCMSA Forms 5-7",
  description:
    "Convert an NBME 6 or NBME 7 CCMSA score into a 3-digit Step 3 estimate. Includes the conversion table, why one curve covers Forms 5-7, and what it cannot tell you.",
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
    title: "Step 3 Score Conversion & Predictor — NBME CCMSA Forms 5-7",
    description:
      "Convert an NBME 6 or NBME 7 CCMSA score into a 3-digit Step 3 estimate, and see why one curve covers all three current CCMSA forms.",
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

/**
 * CCMSA total score -> internal Step 3 midpoint.
 *
 * Generated from the same anchors and interpolation the calculator uses
 * (NBME_TO_STEP.step3 in lib/data.ts), so the published table and the tool
 * cannot drift apart. There is deliberately no per-form variant: no entry
 * exists in NBME_FORM_BIAS for Forms 5, 6, or 7, so all three resolve to
 * this one curve.
 */
const ccmsaTable = [
  { ccmsa: 200, step3: 200 },
  { ccmsa: 210, step3: 207 },
  { ccmsa: 220, step3: 213 },
  { ccmsa: 230, step3: 220 },
  { ccmsa: 240, step3: 226 },
  { ccmsa: 250, step3: 233 },
  { ccmsa: 260, step3: 240 },
  { ccmsa: 270, step3: 246 },
  { ccmsa: 280, step3: 252 },
  { ccmsa: 290, step3: 256 },
  { ccmsa: 300, step3: 260 },
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
      "Use Step 3-specific evidence. NBME identifies CCMSA—not Step 1 CBSSA or Step 2 CK CCSSA—as its comprehensive Step 3 self-assessment family.",
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
    a: "Enter the three-digit total score printed on your CCMSA Form 6 report into the calculator with Step 3 selected. NBMEcalc maps it through the conversion table on this page — a 240 resolves to roughly 226. The result is a planning estimate, not an official conversion.",
  },
  {
    q: "Is the NBME 7 conversion different from NBME 6?",
    a: "No. NBMEcalc applies one curve to CCMSA Forms 5, 6, and 7, because the score printed on your report has already been equated for form difficulty by NBME. A separate table per form would imply a difficulty correction we have no data to support.",
  },
  {
    q: "Which practice resources are predictive?",
    a: "Use resources designed for Step 3, including UWSA Step 3, the Step 3 sample questions, and NBME Comprehensive Clinical Medicine Self-Assessments (CCMSA). Step 1 CBSSA and Step 2 CK CCSSA form numbers are not interchangeable with Step 3 forms.",
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
        title="Step 3 Score Predictor and USMLE Calculator"
        description="Combine Step 3-specific CCMSA, UWSA, and sample-question results into an independent score estimate and pass probability with a confidence interval."
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

      {/* CCMSA form conversion */}
      <section id="ccmsa-conversion" className="py-16 lg:py-20 bg-white border-t border-gray-200">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
            How do you convert an NBME CCMSA score to a Step 3 score?
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            Enter the three-digit total score from your CCMSA report with Step 3
            selected. NBMEcalc maps it through the curve below: a 240 resolves to
            about 226, a 260 to about 240. The same curve covers Forms 5, 6, and
            7, because the score on your report is already equated for form
            difficulty.
          </p>

          <div className="rounded-3xl border border-gray-200 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-bold text-gray-900">
                      CCMSA total score
                    </th>
                    <th className="text-left px-5 py-3 font-bold text-gray-900">
                      Internal model midpoint
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ccmsaTable.map((row) => (
                    <tr key={row.ccmsa} className="hover:bg-mint-50/40 transition">
                      <td className="px-5 py-3 font-mono font-bold text-gray-950">
                        {row.ccmsa}
                      </td>
                      <td className="px-5 py-3 font-mono text-mint-700 font-bold">
                        {row.step3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic mb-12">
            Midpoints only. The calculator reports a planning range around each
            midpoint, and Step 3 has the sparsest data of the three Steps.
          </p>

          <h3 className="text-2xl font-extrabold tracking-tight mb-3">
            NBME 6 and NBME 7 Step 3 score conversion
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Forms 5, 6, and 7 are the Comprehensive Clinical Medicine
            Self-Assessments NBME currently lists for Step 3. Select the form you
            sat in the calculator above and enter its total score — Form 6 and
            Form 7 read from the same table, so a 250 on either resolves to about
            233.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            Do not carry a Step 1 CBSSA or Step 2 CK CCSSA form number into this
            field. Those families use different scales, and a Form 6 in the CCMSA
            series is a different assessment from a Form 6 elsewhere. If you are
            converting for a different Step, use the{" "}
            <Link
              href="/nbme-score-conversion"
              className="text-mint-800 underline underline-offset-4 font-semibold"
            >
              NBME score conversion chart for CCSSA and CBSSA forms
            </Link>
            .
          </p>

          <h3 className="text-2xl font-extrabold tracking-tight mb-3">
            Why there is no separate table for each CCMSA form
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Published per-form Step 3 conversion charts imply a difficulty
            correction between Form 6 and Form 7. NBMEcalc does not apply one,
            for a specific reason: the equating has already happened. NBME
            reports a scaled score that accounts for how hard the particular form
            was, which is the whole point of reporting a scaled score rather than
            a raw count.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Applying a second correction on top of that would double-count form
            difficulty. Where NBMEcalc does hold form-level adjustments — the
            Step 1 CBSSA series — they exist because there is evidence to support
            them. For CCMSA there is not, so the honest table is one table. That
            is a limitation of the model, stated rather than hidden behind
            invented per-form numbers.
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
