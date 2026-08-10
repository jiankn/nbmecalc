import type { Metadata } from "next";
import Link from "next/link";
import { Check, AlertTriangle, BookOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME Score Conversion Chart — Step 2 CK, Step 1 & Step 3 Forms",
  description:
    "Read NBME score reports without mixing scales: Step 2 CCSSA Total Scores, Step 1 CBSSA EPC and pass probability, and Step 3 CCMSA limits.",
  keywords: [
    "nbme score converter",
    "nbme score conversion",
    "nbme to usmle conversion",
    "nbme score conversion step 2",
    "nbme step 2 score converter",
    "nbme step 1 conversion",
    "nbme conversion chart",
    "nbme 32 score conversion",
    "nbme 30 score conversion",
    "nbme score conversion step 3",
  ],
  alternates: { canonical: "https://nbmecalc.com/nbme-score-conversion" },
  openGraph: {
    title: "NBME Score Conversion Chart — Step 2 CK, Step 1 & Step 3 Forms",
    description:
      "Read CCSSA, CBSSA, and CCMSA reports without treating their different score scales as interchangeable.",
    url: "https://nbmecalc.com/nbme-score-conversion",
    type: "article",
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

const step2ReportChecklist = [
  {
    field: "Total CCSSA Score",
    officialMeaning:
      "A 1-300 estimate of Step 2 CK performance under comparable knowledge and testing conditions.",
    calculatorUse:
      "Enter it unchanged. NBMEcalc keeps it as the assessment midpoint.",
  },
  {
    field: "Score range",
    officialMeaning:
      "The report's uncertainty around the Total CCSSA Score.",
    calculatorUse:
      "Read it alongside, not as a replacement for, NBMEcalc's model-generated range.",
  },
  {
    field: "Content-area feedback",
    officialMeaning:
      "Relative strengths and weaknesses within the assessed content.",
    calculatorUse:
      "Use it for study planning; it is not another overall score input.",
  },
];

const step1ReportChecklist = [
  {
    field: "Equated percent correct",
    use: "Compare performance across recent CBSSAs using the report's own scale.",
  },
  {
    field: "Estimated probability of passing",
    use: "Use the probability printed by the official score report as the primary readiness signal.",
  },
  {
    field: "Low-pass range",
    use: "Treat overlap with this range as uncertainty that deserves another official checkpoint or advisor discussion.",
  },
];

const formFamilySections = [
  {
    title: "Step 2 CK CCSSA forms 9-15",
    intent: "Use this family for Step 2 CK score conversion and readiness checks.",
    examples: [
      { label: "NBME 10 Step 2 score conversion" },
      { label: "NBME 11 score conversion" },
      { label: "NBME 14 score conversion" },
      {
        label: "NBME 15 Step 2 CK score conversion",
        href: "/nbme-15-score-conversion",
      },
    ],
    note:
      "Most Form queries remain consolidated here. Form 15 has a dedicated pilot because Search Console and the live SERP both show a distinct calculator-shaped task.",
    href: "/step-2-predictor",
    cta: "Open Step 2 predictor",
  },
  {
    title: "Step 1 CBSSA forms 26-32",
    intent: "Use this family for Step 1 pass-readiness planning.",
    examples: [
      { label: "NBME 28 score conversion" },
      { label: "NBME 29 score conversion" },
      {
        label: "NBME 30 score conversion",
        href: "/nbme-30-score-conversion",
      },
      { label: "NBME 32 score calculator", href: "#nbme-32-score-conversion" },
    ],
    note:
      "Step 1 is pass/fail. The Form 30 pilot reads the official CBSSA ranges instead of fabricating a raw-wrong-answer formula; Form 32 stays consolidated here to protect its existing ranking.",
    href: "/step-1-predictor",
    cta: "Open Step 1 predictor",
  },
  {
    title: "Step 3 CCMSA forms 5-7",
    intent: "Use this family for Step 3 planning, especially when paired with CCS practice.",
    examples: [
      {
        label: "NBME 6 Step 3 score conversion",
        href: "/step-3-predictor#ccmsa-conversion",
      },
      {
        label: "NBME 7 Step 3 score conversion",
        href: "/step-3-predictor#ccmsa-conversion",
      },
      { label: "Step 3 NBME score conversion" },
      { label: "NBME Step 3 score conversion" },
    ],
    note:
      "Step 3 search demand is served on one evidence page. It explains the current 10-800 CCMSA scale and why NBMEcalc does not publish an unsupported Form 6/7 conversion table.",
    href: "/step-3-predictor",
    cta: "Open Step 3 predictor",
  },
];

const conversionHubLinks = [
  {
    href: "/free-120-predictor",
    title: "Free 120 score conversion",
    desc: "Convert percent correct and compare it with a recent NBME or UWSA.",
  },
  {
    href: "/",
    title: "NBME score calculator",
    desc: "Use the full calculator flow when you have several practice inputs.",
  },
  {
    href: "/cms-converter",
    title: "CMS form conversion",
    desc: "Use subject forms to investigate weak rotations before a comprehensive retest.",
  },
  {
    href: "/nbme-15-score-conversion",
    title: "NBME 15 score conversion",
    desc: "Open Step 2 CK with CCSSA Form 15 preselected.",
  },
  {
    href: "/nbme-30-score-conversion",
    title: "NBME 30 report reader",
    desc: "Interpret the official Step 1 CBSSA ranges without an invented formula.",
  },
  {
    href: "/blog/how-to-read-nbme-score-report",
    title: "How to read an NBME score report",
    desc: "Use the right fields for CBSSA and CCSSA before comparing a trend.",
  },
];

const faqs = [
  {
    q: "How accurate is NBME score conversion?",
    a: "NBMEcalc does not currently publish a reproducible holdout cohort or a verified error rate. Treat the conversion as an independent planning heuristic, use the full displayed range, and keep the official NBME score report as the primary readiness source.",
  },
  {
    q: "Which NBME forms are most predictive of my Step 2 CK score?",
    a: "Use a recent Comprehensive Clinical Science Self-Assessment (CCSSA) and read its official score report first. This independent converter is most useful when you combine more than one recent CCSSA result with UWSA or Free 120 rather than relying on a single form.",
  },
  {
    q: "Is the NBME score the same as a USMLE Step score?",
    a: "No. A practice-assessment score and a final USMLE result come from different administrations. This converter applies published internal assumptions; it is not an official one-to-one mapping.",
  },
  {
    q: "How do I convert UWSA scores to a Step score?",
    a: "The calculator treats UWSA 1 and UWSA 2 separately, using current internal adjustments of −5 and −2 before aggregation. These are model assumptions, not official universal offsets.",
  },
  {
    q: "Does NBME conversion work for the new pass/fail Step 1?",
    a: "For Step 1, use the official CBSSA report's estimated probability of passing and low-pass range first. NBMEcalc also shows an experimental model estimate, but it is not a replacement for the official report.",
  },
  {
    q: "Can I trust online NBME conversion charts?",
    a: "Be careful with any chart that does not state its assessment family, date, scale, sample, exclusions, and validation method. NBMEcalc publishes its assumptions and explicitly does not claim a validated cohort yet.",
  },
];

export default function NbmeScoreConversionPage() {
  return (
    <PageShell>
      {/* JSON-LD: FAQPage */}
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
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nbmecalc.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "NBME Score Conversion",
                item: "https://nbmecalc.com/nbme-score-conversion",
              },
            ],
          }),
        }}
      />

      <PageHero
        badge="NBME → Step conversion"
        title="NBME Score Conversion and Report Guide"
        description="Start with the score scale printed on the report. Current CCSSA, CBSSA, and CCMSA reports are different products, so this page shows what can be entered and what should be read directly."
        size="md"
      />

      {/* Calculator first — high intent users want the tool */}
      <section id="calculator" className="bg-mint-50/30 py-8 lg:py-12 border-b border-gray-200">
        <div className="container max-w-4xl mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-bold text-gray-950 mb-1">
                Converting for Step 2 CK?
              </h2>
              <p className="text-sm text-gray-600">
                Choose Step 2 CK and enter the CCSSA form number shown on your
                NBME score report. Current supported forms are 9–15.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-bold text-gray-950 mb-1">
                Checking Step 1 readiness?
              </h2>
              <p className="text-sm text-gray-600">
                Current CBSSA reports use EPC and provide an official pass
                probability. Read those fields directly; do not enter EPC in
                the calculator&apos;s Step 2 CCSSA field.
              </p>
            </div>
          </div>
        </div>
        <Calculator />
      </section>

      <section id="nbme-32-score-conversion" className="border-b border-gray-200 bg-mint-50/40 py-14">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight">
            NBME 32 score conversion: what to enter
          </h2>
          <div className="mt-4 space-y-3 leading-relaxed text-gray-700">
            <p>
              For a current <strong>NBME 32 score conversion</strong>, start
              with the equated percent correct, likely range, and estimated
              probability of passing printed on the CBSSA report. There is no
              supported reason to force that EPC onto the Step 2 CCSSA scale.
            </p>
            <p>
              NBMEcalc therefore does not accept current Form 32 EPC as a
              direct NBME calculator input. For a test-date decision, use the
              official report&apos;s estimated probability of passing and low-pass
              range, then compare it qualitatively with other recent evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white border-b border-gray-200">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Find the right NBME form family
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl">
              NBME form numbers are not interchangeable across Step exams.
              This hub remains the primary page for the family. Dedicated pages
              are admitted only when the user task is distinct and the page adds
              a real preset tool or report workflow.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {formFamilySections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <h3 className="text-xl font-extrabold text-gray-950 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {section.intent}
                </p>
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                  Common searches
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  {section.examples.map((example) => (
                    <li key={example.label} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-mint-600 shrink-0" />
                      {example.href ? (
                        <Link
                          href={example.href}
                          className="font-semibold text-mint-800 underline underline-offset-4"
                        >
                          {example.label}
                        </Link>
                      ) : (
                        <span>{example.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {section.note}
                </p>
                <Link
                  href={section.href}
                  className="text-sm font-bold text-mint-700 underline"
                >
                  {section.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 2 CK report fields */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-800 mb-3">
              <BookOpen className="h-3 w-3" />
              Official report first
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              NBME to Step 2 CK Conversion Chart
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl">
              The quick answer is that a current CCSSA Total Score already
              estimates Step 2 CK performance. Enter that 1-300 score unchanged;
              converting 240 into a different midpoint would double-transform
              the report&apos;s estimate.
            </p>
            <a
              href="https://www.nbme.org/wp-content/uploads/2026/04/Comprehensive_Clinical_Science_Self-Assessment_Sample.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-mint-800 underline underline-offset-4"
            >
              Check the current official CCSSA sample report
            </a>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Official report field
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    What it means
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    What NBMEcalc does
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {step2ReportChecklist.map((row) => (
                  <tr
                    key={row.field}
                    className="hover:bg-mint-50/40 transition"
                  >
                    <td className="px-5 py-3 font-bold text-gray-950">
                      {row.field}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {row.officialMeaning}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {row.calculatorUse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Source: current NBME CCSSA sample score report. NBMEcalc&apos;s combined
            multi-source output remains an independent, unvalidated planning
            estimate and does not replace the official report.
          </p>
        </div>
      </section>

      {/* Step 1 P/F section */}
      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            NBME to Step 1 (Pass / Fail) Conversion
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-8">
            Step 1 is pass/fail. The official CBSSA report already contains
            readiness information, so start with those fields rather than an
            unofficial numeric conversion chart.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Official report field
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    How to use it
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {step1ReportChecklist.map((row) => (
                  <tr key={row.field} className="hover:bg-mint-50 transition">
                    <td className="px-5 py-3 font-bold text-gray-950">{row.field}</td>
                    <td className="px-5 py-3 text-gray-700">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Important:</strong> Do not let an unofficial model output
              override the readiness guidance on your current CBSSA report.
              Discuss borderline or discordant results with your school or an
              academic advisor.
            </div>
          </div>
        </div>
      </section>

      {/* UWSA + Free 120 adjustments */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8">
            UWSA, Free 120, and other source adjustments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
                UWSA 1 / UWSA 2
              </div>
              <div className="text-xl font-extrabold mb-1">Internal adjustment</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                UWSA inputs receive source-specific model treatment. No fixed
                subtraction is an official conversion.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                Free 120 (% correct)
              </div>
              <div className="text-3xl font-extrabold mb-1">×2.4 + 110</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Free 120 is a useful late-stage readiness signal. Use it
                alongside a recent NBME rather than treating any one input as
                definitive.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                AMBOSS Self-Assessment
              </div>
              <div className="text-xl font-extrabold mb-1">Internal adjustment</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                AMBOSS inputs receive an internal adjustment that has not been
                published as a validated conversion.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-6">
            All adjustments are baked into <Link href="#calculator" className="text-mint-700 font-semibold underline">our calculator</Link>.
            You only need to enter the raw score.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Related conversion calculators
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-8">
            A single NBME is useful, but the forecast improves when recent
            inputs agree. These related pages cover the other conversion
            searches that showed up in Search Console.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conversionHubLinks.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 hover:shadow-md transition"
              >
                <div className="font-bold text-gray-950 mb-1">{tool.title}</div>
                <div className="text-sm text-gray-600">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
            How the calculator treats supported scores
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              A current Step 2 CCSSA Total Score is retained as the assessment
              midpoint. Other supported sources use source-specific mappings
              and recency weighting. Those additional mappings are
              <strong> independent model assumptions</strong>, not official
              NBME or USMLE conversion rules.
            </p>
            <p>
              A reproducible outcome dataset and holdout validation report are
              not currently published. For that reason, we do not claim a
              verified cohort size, median error, or form-specific accuracy
              ranking. The public methodology page records the current
              assumptions and material changes.
            </p>
            <p>
              <strong>What this is not:</strong> a guarantee. Test-day
              performance, content domain shifts, and the NBME&apos;s own
              psychometric adjustments mean any single prediction has natural
              variance. Treat the displayed range as planning context—not
              ground truth—and compare it with official guidance.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Official facts linked to primary sources",
              "Assessment families kept separate",
              "Uncertainty shown with every estimate",
              "Public methodology and change log",
            ].map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm">
                <Check className="h-5 w-5 text-mint-600 shrink-0 mt-0.5" />
                <span className="text-gray-700">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Frequently asked questions
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

      {/* Related links */}
      <section className="py-16 lg:py-20 bg-mint-50">
        <div className="container max-w-4xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-6 text-center flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-mint-600" />
            Keep exploring
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: "/",
                title: "NBME Calculator",
                desc: "The full interactive tool with PDF report.",
              },
              {
                href: "/step-1-predictor",
                title: "Step 1 Predictor",
                desc: "Pass/Fail probability with NBME inputs.",
              },
              {
                href: "/step-2-predictor",
                title: "Step 2 CK Predictor",
                desc: "Numeric score + percentile + match impact.",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 hover:shadow-md transition"
              >
                <div className="font-bold text-gray-950 mb-1">{c.title}</div>
                <div className="text-sm text-gray-600">{c.desc}</div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Try the calculator</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
