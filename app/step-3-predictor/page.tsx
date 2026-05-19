import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CalendarClock, FileCheck2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 3 Predictor — Free Score Calculator | NBMEcalc",
  description:
    "Free USMLE Step 3 predictor. Estimate your two-day Step 3 score from UWSA Step 3 self-assessments and Free 120. Pass probability + percentile + study plan.",
  keywords: [
    "step 3 predictor",
    "usmle step 3 calculator",
    "step 3 ccs predictor",
    "uwsa step 3",
    "step 3 pass probability",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-3-predictor" },
  openGraph: {
    title: "Step 3 Predictor — Free Score Calculator",
    description:
      "Predict your USMLE Step 3 score from UWSA Step 3 and Free 120. Includes CCS-portion guidance and timing advice for intern year.",
    url: "https://nbmecalc.com/step-3-predictor",
    type: "website",
  },
};

const passBands = [
  {
    range: "≥ 230",
    prob: "99%",
    color: "mint",
    label: "Strong pass",
    advice:
      "Plenty of buffer. Focus on the CCS cases — that&apos;s where points are most often lost.",
  },
  {
    range: "215-229",
    prob: "95-98%",
    color: "mint",
    label: "Safe",
    advice:
      "Comfortable margin. One round of UWorld Step 3 + 2-3 CCS cases per day for the last 2 weeks.",
  },
  {
    range: "200-214",
    prob: "85-94%",
    color: "blue",
    label: "Likely pass",
    advice:
      "Tight but workable. Push hard on FA Step 3 (biostatistics) and CCS practice.",
  },
  {
    range: "190-199",
    prob: "65-84%",
    color: "amber",
    label: "Borderline",
    advice:
      "Real risk. Consider rescheduling 3-4 weeks. CCS performance can rescue or sink the prediction.",
  },
  {
    range: "< 190",
    prob: "< 65%",
    color: "rose",
    label: "High risk",
    advice:
      "Delay 6+ weeks. Build a content + UWorld + CCS plan in that order.",
  },
];

const bandColors: Record<string, string> = {
  mint: "bg-mint-50 border-mint-200 text-mint-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
};

const facts = [
  {
    icon: CalendarClock,
    title: "Two-day exam",
    body: "Day 1: 232 MCQs over 7 hours. Day 2: 180 MCQs + 13 CCS cases (computer-based patient simulations). Most candidates split Days 1 and 2 with 1-2 days off.",
  },
  {
    icon: FileCheck2,
    title: "When most residents take it",
    body: "Roughly 70% take Step 3 between PGY-1 and PGY-2. Specialties requiring an H1B visa often push for completion before residency starts.",
  },
  {
    icon: Briefcase,
    title: "What employers care about",
    body: "Step 3 is mostly pass/fail in importance. Fellowship programs glance at the score for borderline candidates, but most weight is on Step 2 CK.",
  },
];

const faqs = [
  {
    q: "What is the Step 3 passing score?",
    a: "198. It is the lowest of the three Step exams and the most pass/fail-feeling in stakes for most US graduates.",
  },
  {
    q: "Is Step 3 harder than Step 2 CK?",
    a: "Different. The MCQs are slightly easier per question, but the test is longer (two days, 9 hours of MCQs + CCS) and tests management decisions you have not made before. Most people score 5-15 points lower than their Step 2 CK.",
  },
  {
    q: "How is CCS scored?",
    a: "CCS is graded on a clinical-decision rubric: appropriate workup, correct sequencing, monitoring intervals, avoiding harm. The score gets folded into your composite Step 3 result. Roughly 20-25% of the total Step 3 score comes from CCS.",
  },
  {
    q: "Which practice resources are predictive?",
    a: "UWSA Step 3 (most predictive), Free 120 Step 3, AMBOSS Step 3, and the NBME Comprehensive Basic Science / Clinical Science self-assessments. NBME Step 3 forms exist (CCSE) but are less granular.",
  },
  {
    q: "When should I take Step 3?",
    a: "If your program does not pressure you, take it between intern year and PGY-2 (June-August). You have UWorld momentum, you&apos;ve seen ward management decisions live, and PGY-2 brings more responsibility.",
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
        title="Step 3 Predictor: Forecast Your USMLE Step 3 Score"
        description="Step 3 is the final hurdle — and the only one with CCS computer-based case simulations. Drop in your UWSA Step 3 and Free 120 numbers to get a pass probability and a Step 2 CK-comparable estimate."
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
            prediction with a 95% confidence interval.
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Note: Step 3 data is sparser than Step 2 CK. Confidence intervals
            run wider (±6-8 pts) until you provide 3+ inputs.
          </p>
        </div>
        <Calculator defaultStep="step3" />
      </section>

      {/* Pass bands */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Step 3 pass-probability bands
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Bands below assume MCQ-side prediction (CCS not yet graded). CCS
            typically adds or subtracts up to 5 points depending on
            performance.
          </p>

          <div className="space-y-3">
            {passBands.map((b) => (
              <div
                key={b.range}
                className={`rounded-3xl border p-5 flex flex-col sm:flex-row gap-4 sm:items-center ${bandColors[b.color]}`}
              >
                <div className="sm:w-28 shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">
                    Predicted
                  </div>
                  <div className="text-2xl font-extrabold">{b.range}</div>
                </div>
                <div className="sm:w-32 shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">
                    Pass prob.
                  </div>
                  <div className="text-xl font-extrabold">{b.prob}</div>
                </div>
                <div className="sm:w-28 shrink-0">
                  <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
                    {b.label}
                  </span>
                </div>
                <div
                  className="flex-1 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: b.advice }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCS focus */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            The CCS portion: where most candidates lose points
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            CCS is the unique part of Step 3 — 13 computer-based patient
            simulations where you order labs, treatments, and follow-ups in
            simulated time. Most residents have never practiced this kind of
            interface before. Here is what matters.
          </p>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>1. Order what you would actually order.</strong> The CCS
              software rewards appropriate workup, not exhaustive workup. Do
              not shotgun every imaging modality.
            </p>
            <p>
              <strong>2. Advance the clock correctly.</strong> A common pitfall:
              ordering CT in 2 minutes when biologically it takes 30 minutes
              to result. Use realistic time advances.
            </p>
            <p>
              <strong>3. Move the patient to the right setting.</strong> If a
              ward patient becomes unstable, transfer to ICU. If a stable
              outpatient walks in, do not admit. Setting transitions are
              graded.
            </p>
            <p>
              <strong>4. Practice with UWorld CCS.</strong> 50 cases minimum.
              You should be able to hit the &quot;5 must-do orders&quot; on a
              standard MI workup without thinking.
            </p>
            <p>
              <strong>5. Watch the clock on Day 2.</strong> You get ~10-20
              minutes per case. Move steadily — incomplete cases hurt more
              than imperfect ones.
            </p>
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
            Free, instant, and built on Step 3 specifically — not just a Step
            2 CK calculator with a different label.
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
