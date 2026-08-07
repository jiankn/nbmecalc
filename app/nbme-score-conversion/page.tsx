import type { Metadata } from "next";
import Link from "next/link";
import { Check, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME Score Converter & Conversion Chart | NBMEcalc",
  description:
    "Use the free NBME score converter for Step 2 CK estimates and Step 1 readiness planning. Supports current CCSSA and CBSSA form families with a transparent planning range.",
  keywords: [
    "nbme score converter",
    "nbme score conversion",
    "nbme to usmle conversion",
    "nbme score conversion step 2",
    "nbme step 2 score converter",
    "nbme step 1 conversion",
    "nbme conversion chart",
  ],
  alternates: { canonical: "https://nbmecalc.com/nbme-score-conversion" },
  openGraph: {
    title: "NBME Score Converter & Conversion Chart",
    description:
      "Convert NBME practice scores into an independent Step 2 CK estimate or Step 1 pass probability.",
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

// Step 2 CK conversion table (more detailed than the lib/data.ts version
// for SEO depth)
const step2Table = [
  { nbme: 200, step2: 218 },
  { nbme: 210, step2: 225 },
  { nbme: 220, step2: 232 },
  { nbme: 230, step2: 240 },
  { nbme: 240, step2: 248 },
  { nbme: 250, step2: 254 },
  { nbme: 260, step2: 260 },
  { nbme: 270, step2: 265 },
  { nbme: 280, step2: 270 },
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
      "NBME 10 Step 2 score conversion",
      "NBME 11 score conversion",
      "NBME 14 score conversion",
      "NBME 15 Step 2 CK score conversion",
    ],
    note:
      "These queries belong on the conversion hub because the user job is the same: enter a recent comprehensive Step 2 practice score and understand the range.",
    href: "/step-2-predictor",
    cta: "Open Step 2 predictor",
  },
  {
    title: "Step 1 CBSSA forms 26-32",
    intent: "Use this family for Step 1 pass-readiness planning.",
    examples: [
      "NBME 28 score conversion",
      "NBME 29 score conversion",
      "NBME 30 score conversion",
      "NBME 32 score calculator",
    ],
    note:
      "Step 1 is pass/fail, so these searches should land on one clear explanation of pass probability rather than separate pages for each form.",
    href: "/step-1-predictor",
    cta: "Open Step 1 predictor",
  },
  {
    title: "Step 3 CCMSA forms 5-7",
    intent: "Use this family for Step 3 planning, especially when paired with CCS practice.",
    examples: [
      "NBME 6 Step 3 score conversion",
      "Step 3 NBME score conversion",
      "NBME Step 3 score conversion",
    ],
    note:
      "Step 3 search demand is smaller and should strengthen the Step 3 predictor, not become a separate conversion-page cluster.",
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
        title="NBME Score Converter and Conversion Chart"
        description="Convert current Step 2 CK CCSSA scores into an independent estimate, or use Step 1 CBSSA results for readiness planning. Add multiple recent inputs for a more useful planning range."
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
                Choose Step 1 and enter your CBSSA result. Step 1 is pass/fail,
                so the useful output is pass probability—not a predicted
                transcript score.
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
              For an <strong>NBME 32 score conversion</strong>, select Step 1,
              choose NBME Form 32, and enter the three-digit equated score shown
              on your report. Do not enter percent correct into a field labeled
              for a three-digit score.
            </p>
            <p>
              The current model applies a small +1 form-specific adjustment
              before aggregation. That is a disclosed internal assumption—not
              an official NBME conversion. For a test-date decision, use the
              official report&apos;s estimated probability of passing and low-pass
              range first, then use this page to compare Form 32 with your other
              recent evidence.
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
              Search queries like &quot;NBME 32 score conversion&quot; and &quot;NBME 10
              Step 2 score conversion&quot; should be answered here as form-family
              guidance, not split into thin single-form pages.
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
                    <li key={example} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-mint-600 shrink-0" />
                      <span>{example}</span>
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

      {/* Step 2 CK conversion table */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-800 mb-3">
              <TrendingUp className="h-3 w-3" />
              Independent model — assumptions published
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              NBME to Step 2 CK Conversion Chart
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl">
              If you are asking <em>&quot;What does my NBME score actually mean?&quot;</em>,{" "}
              the table below exposes the calculator&apos;s current piecewise
              midpoint mapping. It does not include invented percentile or
              residency-competitiveness labels.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    NBME score
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Internal model midpoint
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {step2Table.map((row) => (
                  <tr
                    key={row.nbme}
                    className="hover:bg-mint-50/40 transition"
                  >
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">
                      {row.nbme}
                    </td>
                    <td className="px-5 py-3 font-mono text-mint-700 font-bold">
                      {row.step2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Independent estimates only. Timing, assessment family, and
            agreement with other recent inputs affect the useful range. This
            table does not replace the official NBME score report.
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
          <div className="grid gap-4 md:grid-cols-3">
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
            How we built these conversion tables
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The current calculator uses piecewise score mappings,
              source-specific adjustments, and recency weighting. These are
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
