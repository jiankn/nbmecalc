import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpenCheck, FileCheck2, History } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 1 Predictor — Pass Probability Calculator (Free) | NBMEcalc",
  description:
    "Estimate Step 1 pass readiness from compatible UWSA and Free 120 inputs. For a current NBME CBSSA, use the probability and EPC range on the official report.",
  keywords: [
    "step 1 predictor",
    "usmle step 1 calculator",
    "step 1 pass probability",
    "nbme to step 1",
    "uwsa 1 to step 1",
    "step 1 pass fail",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-1-predictor" },
  openGraph: {
    title: "Step 1 Predictor — Pass Probability Calculator (Free)",
    description:
      "Estimate Step 1 pass readiness from UWSA and Free 120 inputs, with official-report-first guidance for current NBME CBSSA results.",
    url: "https://nbmecalc.com/step-1-predictor",
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

const interpretationChecks = [
  {
    label: "Use the official report first",
    detail:
      "Read the estimated probability of passing, likely score range, and low-pass range printed on the current CBSSA report before consulting an independent model.",
  },
  {
    label: "Confirm the score scale",
    detail:
      "Current CBSSA reporting uses equated percent correct (EPC). Do not enter EPC into a field that expects a legacy three-digit practice score.",
  },
  {
    label: "Look for agreement",
    detail:
      "Compare several recent, unused assessments taken under similar conditions. A consistent trend is more informative than choosing the most reassuring result.",
  },
  {
    label: "Escalate uncertain decisions",
    detail:
      "If the official probability, score range, and recent trend disagree, discuss the full reports with your school or academic advisor before changing an exam date.",
  },
];

const officialSignals = [
  {
    icon: FileCheck2,
    title: "Pass/fail reporting",
    body: "USMLE reports Step 1 outcomes as pass/fail. Current scoring and transcript rules should be checked on the official USMLE site.",
  },
  {
    icon: BookOpenCheck,
    title: "CBSSA readiness fields",
    body: "NBME's current CBSSA report provides EPC, a likely range, the Step 1 low-pass range, and an estimated probability of passing within the stated testing window.",
  },
  {
    icon: History,
    title: "Policies can change",
    body: "Eligibility, attempt limits, score reporting, and rescheduling rules are controlled by USMLE and the registration entities—not by this calculator.",
  },
];

const faqs = [
  {
    q: "What is a passing score on Step 1 now?",
    a: "Step 1 results are reported as pass/fail. Use the current USMLE scoring page for the official standard and the current CBSSA report for readiness information; NBMEcalc does not publish an unofficial numeric cutoff.",
  },
  {
    q: "How predictive is my NBME score for passing Step 1?",
    a: "The current CBSSA report includes NBME's estimated probability of passing within the stated testing window. That official probability is the primary readiness signal; NBMEcalc's output is an independent, unvalidated planning estimate.",
  },
  {
    q: "Does the calculator account for the new pass/fail format?",
    a: "The model converts inputs to an internal equated score and shows an experimental pass estimate with a planning range. It is not a validated substitute for the official CBSSA readiness report.",
  },
  {
    q: "Should I take Step 1 if my latest NBME is below 200?",
    a: "There is no universal decision rule based on one unofficial three-digit threshold. Review the scale and probability printed on your current CBSSA report, compare recent unused forms, and discuss borderline or conflicting evidence with your school or advisor.",
  },
  {
    q: "Can I retake Step 1 if I fail?",
    a: "USMLE publishes the current attempt-limit and eligibility rules. Because those rules can change and may interact with registration-entity requirements, verify the official policy rather than relying on a calculator page.",
  },
];

export default function Step1PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 1 Predictor",
            url: "https://nbmecalc.com/step-1-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free USMLE Step 1 planning calculator for compatible UWSA and Free 120 inputs, with official-report-first guidance for current NBME CBSSA results.",
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
        badge="Step 1 is pass/fail"
        title="Step 1 Predictor: Calculate Your Pass Probability"
        description="Step 1 results are reported as pass/fail. Read the probability and range on your current CBSSA report first, then use this independent estimate only as a secondary planning view."
        size="md"
      />

      {/* Risk callout */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="container max-w-3xl flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-amber-900 mb-1">
              Do not use this page as a test-date directive
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              NBMEcalc has not published a holdout validation study for its
              Step 1 probability estimate. Use the official CBSSA report,
              current USMLE rules, and your school or advisor&apos;s process for
              any decision to sit, postpone, or repeat an assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-white">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the Step 1 calculator
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 1</strong> below and add compatible UWSA or Free
            120 inputs. Current CBSSA reports use equated percent correct, so
            read their official pass probability and likely range directly
            instead of entering that EPC in a three-digit field.
          </p>
        </div>
        <Calculator defaultStep="step1" />
      </section>

      {/* Interpretation example */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
            How to review several recent assessments
          </h2>
          <ol className="list-decimal space-y-3 pl-5 text-gray-700 leading-relaxed">
            <li>Confirm that each calculator input belongs to Step 1 and uses a supported scale.</li>
            <li>Read the official probability and likely range on every current CBSSA report.</li>
            <li>Note whether recent unused forms agree under similar timing and test conditions.</li>
            <li>Use NBMEcalc only to summarize that pattern, then investigate any disagreement instead of averaging it away.</li>
          </ol>
          <p className="text-sm text-gray-500 italic">
            The model uses internal mappings and recency weights. See the{" "}
            <Link
              href="/methodology"
              className="text-mint-700 underline underline-offset-2"
            >
              methodology
            </Link>{" "}
            for the assumptions behind the model.
          </p>
        </div>
      </section>

      {/* Interpretation checks */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Four checks before interpreting a Step 1 estimate
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            These checks prevent a model midpoint from being mistaken for an
            official pass probability or a universal scheduling rule.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {interpretationChecks.map((check) => (
              <div
                key={check.label}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-bold text-gray-950">{check.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {check.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official signals */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            What the official sources establish
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Keep official policy and report facts separate from NBMEcalc&apos;s
            internal assumptions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {officialSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <signal.icon className="h-6 w-6 text-mint-600 mb-3" />
                <h3 className="font-bold mb-1">{signal.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {signal.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold">
            <a
              href="https://www.nbme.org/examinees/self-assessments/comprehensive-basic-science-self-assessment"
              target="_blank"
              rel="noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              NBME CBSSA information
            </a>
            <a
              href="https://www.usmle.org/scores-transcripts/examination-results-and-scoring"
              target="_blank"
              rel="noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              USMLE results and scoring
            </a>
            <a
              href="https://www.usmle.org/bulletin-information"
              target="_blank"
              rel="noreferrer"
              data-evidence-source="primary"
              className="text-mint-800 underline underline-offset-4"
            >
              Current USMLE Bulletin
            </a>
          </div>
        </div>
      </section>

      {/* Strategy block */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What to do when the signals disagree
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Check comparability.</strong> Confirm that the assessments
              use the same Step 1 family and were taken under comparable
              conditions without outside resources.
            </p>
            <p>
              <strong>Read the official uncertainty.</strong> Compare each
              report&apos;s probability and likely range rather than relying on
              one calculator midpoint.
            </p>
            <p>
              <strong>Identify the decision.</strong> Write down what new
              evidence would change your plan: another unused assessment,
              updated school guidance, or review of the content-area report.
            </p>
            <p>
              <strong>Ask for a second review.</strong> Borderline, declining,
              or sharply inconsistent results deserve review by your school or
              academic advisor; NBMEcalc does not prescribe a delay interval.
            </p>
            <p className="text-sm text-gray-500 italic">
              This framework is educational and does not replace official
              assessment feedback or institution-specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="py-12 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-extrabold mb-4">Related Step 1 tools</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-mint-700 font-semibold">
            <li>
              <Link
                href="/uwsa-1-to-step-1"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Convert UWSA 1 to a Step 1 estimate
              </Link>
            </li>
            <li>
              <Link
                href="/free-120-predictor"
                className="underline underline-offset-2"
              >
                Free 120 predictor
              </Link>
            </li>
            <li>
              <Link
                href="/nbme-score-conversion"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                NBME score report guide
              </Link>
            </li>
            <li>
              <Link
                href="/nbme-calculator"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Choose the correct NBME assessment family
              </Link>
            </li>
            <li>
              <Link
                href="/step-2-predictor"
                className="underline underline-offset-2"
              >
                Step 2 CK predictor
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Step 1 predictor FAQs
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
      <section className="py-16 bg-mint-50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Know your Step 1 pass margin
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Combine recent inputs for a secondary planning view, then compare
            the result with the probability and range on your official reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 1</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">
                Working on Step 2 CK instead?
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
