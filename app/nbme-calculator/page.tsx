import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";
import { CBSSA_FORMS } from "@/lib/cbssa-readiness";
import { CCSSA_FORMS } from "@/lib/nbme-percent-model";

const PAGE_URL = "https://nbmecalc.com/nbme-calculator";
const CHECKED = "October 3, 2026";
const title = "NBME Self-Assessments (2026): Forms, Price, Length & Which to Take";
const description =
  "Every NBME self-assessment for Step 1, Step 2 CK, and Step 3 in one table: CBSSA, CCSSA, and CCMSA price, question count, timing, what the score report shows, and which form to take first.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "nbme self assessment",
    "nbme self assessments",
    "nbme forms",
    "nbme practice exams step 1",
    "which nbme to take first",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "NBME Self-Assessments (2026): Forms, Price & Which to Take",
    description:
      "CBSSA, CCSSA, and CCMSA compared: price, length, score report, and how to order your forms.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBME self-assessment guide",
      },
    ],
  },
};

// 官方信息，2026-10-03 逐项核对 NBME 产品页与官方样例报告。
const SOURCES = {
  directory: { label: "NBME self-assessments", href: "https://www.nbme.org/examinees/self-assessments/" },
  cbssa: {
    label: "CBSSA product page",
    href: "https://www.nbme.org/examinees/self-assessments/comprehensive-basic-science-self-assessment/",
  },
  ccssa: {
    label: "CCSSA product page",
    href: "https://www.nbme.org/examinees/self-assessments/comprehensive-clinical-science-self-assessment/",
  },
  ccmsa: {
    label: "CCMSA product page",
    href: "https://www.nbme.org/examinees/self-assessments/comprehensive-clinical-medicine-self-assessment/",
  },
  cbssaSample: {
    label: "CBSSA sample report",
    href: "https://www.nbme.org/wp-content/uploads/2026/04/Comprehensive_Basic_Science_Self-Assessment_Sample.pdf",
  },
  ccssaSample: {
    label: "CCSSA sample report",
    href: "https://www.nbme.org/wp-content/uploads/2026/04/Comprehensive_Clinical_Science_Self-Assessment_Sample.pdf",
  },
  ccmsaSample: {
    label: "CCMSA sample report",
    href: "https://www.nbme.org/wp-content/uploads/2026/05/Comprehensive_Medicine_Science_Self-Assessment_Sample.pdf",
  },
} as const;

const families = [
  {
    name: "CBSSA",
    full: "Comprehensive Basic Science Self-Assessment",
    exam: "Step 1",
    format: "200 questions (4 × 50)",
    timing: "1 h 15 min per section; self-paced option",
    price: "From $62",
    report: "Total equated percent correct, a likely range, the Step 1 low-pass band, and an estimated probability of passing",
    href: "/nbme-step-1-score-conversion",
    linkLabel: "CBSSA readiness check",
  },
  {
    name: "CCSSA",
    full: "Comprehensive Clinical Science Self-Assessment",
    exam: "Step 2 CK",
    format: "200 questions (4 × 50)",
    timing: "1 h 15 min per section; self-paced option",
    price: "From $62",
    report: "Total CCSSA Score on the 1–300 Step 2 CK scale, a likely score range, and an estimated probability of passing",
    href: "/nbme-score-conversion",
    linkLabel: "CCSSA score conversion",
  },
  {
    name: "CCMSA",
    full: "Comprehensive Clinical Medicine Self-Assessment",
    exam: "Step 3",
    format: "200 multiple-choice questions (4 × 50); no CCS cases",
    timing: "Up to 1 h 15 min per section; self-paced option",
    price: "$62",
    report: "Assessment Score on a 10–800 scale; NBME states it is not intended to predict Step 3 performance",
    href: "/step-3-predictor",
    linkLabel: "Step 3 predictor and CCMSA notes",
  },
  {
    name: "CMS",
    full: "Clinical Science Mastery Series",
    exam: "Clerkship subjects / Step 2 CK review",
    format: "50 questions per subject form",
    timing: "1 h 15 min; self-paced option",
    price: "$21",
    report: "Subject-level feedback; not a substitute for a comprehensive CCSSA",
    href: "/cms-forms-step-2-ck",
    linkLabel: "CMS forms guide",
  },
];

const orderSteps = [
  {
    h: "Start with a baseline",
    p: "Take one form of the right family early enough that the result can still change your plan. Its content-area feedback shows where to spend the next weeks.",
  },
  {
    h: "Save fresh forms for the end",
    p: "Keep at least one unused form for the last one to two weeks. NBME's pass probability is modeled on examinees who tested within a week of the real exam.",
  },
  {
    h: "Test under real conditions",
    p: "Use standard pacing and no outside resources. NBME's reports say self-paced timing or looking things up makes the result less reliable for judging readiness.",
  },
  {
    h: "Do not repeat a form for a score",
    p: "NBME also notes that retaking the same form makes the report less reliable. Use a different form for each readiness check.",
  },
];

const decisionSteps = [
  {
    label: "1. Confirm the product",
    advice:
      "Make sure the result came from the assessment family aligned with your target exam: CBSSA for Step 1, CCSSA for Step 2 CK, or CCMSA for Step 3.",
  },
  {
    label: "2. Read the official report",
    advice:
      "Use the score report's readiness guidance, performance profile, and stated uncertainty as the primary interpretation. Reporting is not interchangeable across products.",
  },
  {
    label: "3. Check agreement",
    advice:
      "Compare the result with other recent evidence from the same exam track. A large disagreement is a reason to investigate timing, conditions, and content gaps—not to average blindly.",
  },
  {
    label: "4. Decide what changes",
    advice:
      "Choose the next action based on the official report, your program's guidance, and the decision the new evidence would change. NBMEcalc supplies an independent planning range, not a test-date directive.",
  },
];

const faqs = [
  {
    q: "How much does an NBME self-assessment cost?",
    a: `NBME lists CBSSA and CCSSA forms at a price starting from $62 and CCMSA at $62 (checked ${CHECKED}). Clinical Science Mastery Series subject forms cost $21. Prices are set by NBME and can change, so confirm in MyNBME before buying.`,
  },
  {
    q: "How many questions are on an NBME self-assessment, and how long does it take?",
    a: "CBSSA, CCSSA, and CCMSA each have 200 multiple-choice questions in four sections of 50. Standard pacing allows 1 hour 15 minutes per section, about 5 hours of testing in total. A self-paced option allows up to 5 hours per section.",
  },
  {
    q: "Which NBME practice exams are for Step 1?",
    a: "The NBME practice exams for Step 1 are the Comprehensive Basic Science Self-Assessments (CBSSA). NBME lists seven CBSSA forms for sale. The free alternative is the official USMLE Step 1 sample question set, often called the Free 120.",
  },
  {
    q: "Which NBME should I take first?",
    a: "First choose the correct family: CBSSA for Step 1, CCSSA for Step 2 CK, or CCMSA for Step 3. Within the family, use one form as an early baseline and keep at least one unused form for a final check in the last week or two.",
  },
  {
    q: "How many NBME practice exams should I take?",
    a: "NBME does not prescribe a number. Because every score has a likely range, two or more recent results that agree tell you much more than one. Many students take a baseline plus at least two forms in the final weeks.",
  },
  {
    q: "Do NBME self-assessments give a pass probability?",
    a: "CBSSA and CCSSA reports include an estimated probability of passing Step 1 or Step 2 CK if you test within a week. The CCMSA report does not; it gives a 10–800 Assessment Score and states that it is not intended to predict Step 3 performance.",
  },
  {
    q: "What score does the CCSSA report?",
    a: "The current CCSSA report gives a Total CCSSA Score on the same 1–300 scale as Step 2 CK, plus a likely score range and content-area equated percent correct scores. NBME describes the score as an estimate of your Step 2 CK performance under the same conditions.",
  },
  {
    q: "How long do I have to use a self-assessment and review it?",
    a: "For CBSSA and CCSSA, NBME says the interactive score report and answer explanations stay available for two years after you finish. For CCMSA, NBME says you must complete the assessment within one year of purchase.",
  },
  {
    q: "Can I retake the same NBME form?",
    a: "You can, but NBME's reports state that taking the same form more than once makes the result less reliable for judging readiness. Use a fresh form when you need a new readiness check.",
  },
];

export default function NbmeCalculatorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "NBME Self-Assessments: Forms, Price, Length and Which to Take",
            url: PAGE_URL,
            description,
            author: { "@type": "Organization", name: "NBMEcalc" },
            dateModified: "2026-10-03",
            mainEntityOfPage: PAGE_URL,
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
        badge={`NBME self-assessment guide · checked ${CHECKED}`}
        title="NBME Self-Assessments: Every Form, Price, and Which to Take"
        description="CBSSA for Step 1, CCSSA for Step 2 CK, CCMSA for Step 3. Compare price, length, and what each score report tells you, then jump to the tool for your form."
        size="md"
      />

      {/* 一张表看全 */}
      <section id="at-a-glance" className="border-b border-gray-200 bg-mint-50/40 py-12 lg:py-16">
        <div className="container max-w-6xl">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">NBME self-assessments at a glance</h2>
          <p className="mb-8 max-w-3xl text-lg text-gray-700">
            Match the family to your exam first. Form numbers are not interchangeable across families, and each
            report uses its own scale.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {["Assessment", "For", "Format", "Timing", "Price", "Score report", "Use on NBMEcalc"].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-left font-bold text-gray-900">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 align-top">
                  {families.map((f) => (
                    <tr key={f.name}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-950">{f.name}</span>
                        <span className="block text-xs text-gray-500">{f.full}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{f.exam}</td>
                      <td className="px-4 py-3 text-gray-700">{f.format}</td>
                      <td className="px-4 py-3 text-gray-700">{f.timing}</td>
                      <td className="px-4 py-3 font-mono text-gray-900">{f.price}</td>
                      <td className="px-4 py-3 text-gray-700">{f.report}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={f.href}
                          data-indexing-context="related"
                          className="font-semibold text-mint-800 underline underline-offset-4"
                        >
                          {f.linkLabel}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Checked {CHECKED} against the NBME{" "}
            <a href={SOURCES.cbssa.href} target="_blank" rel="noreferrer" data-evidence-source="primary" className="font-semibold text-mint-800 underline underline-offset-4">
              CBSSA
            </a>
            ,{" "}
            <a href={SOURCES.ccssa.href} target="_blank" rel="noreferrer" data-evidence-source="primary" className="font-semibold text-mint-800 underline underline-offset-4">
              CCSSA
            </a>
            , and{" "}
            <a href={SOURCES.ccmsa.href} target="_blank" rel="noreferrer" data-evidence-source="primary" className="font-semibold text-mint-800 underline underline-offset-4">
              CCMSA
            </a>{" "}
            product pages and their sample score reports. Prices are NBME&apos;s and can change.
          </p>
        </div>
      </section>

      {/* 按表单号跳转 */}
      <section id="forms" className="bg-white py-16 lg:py-20">
        <div className="container max-w-5xl">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">Find your NBME form</h2>
          <p className="mb-8 max-w-3xl text-lg text-gray-700">
            NBME lists seven CBSSA and seven CCSSA forms for sale; older forms retire as new ones arrive, so check
            MyNBME for the current set. Pick the form you took to open the matching tool.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="text-xl font-extrabold text-gray-950">Step 1 · CBSSA forms</h3>
              <p className="mt-1 text-sm text-gray-600">Readiness check against the official low-pass band.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {CBSSA_FORMS.map((n) => (
                  <Link
                    key={n}
                    href={`/nbme-step-1-score-conversion?form=${n}#readiness-check`}
                    className="rounded-full border border-gray-200 px-4 py-1.5 font-mono text-sm font-semibold text-gray-900 transition hover:border-mint-500 hover:text-mint-800"
                  >
                    NBME {n}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="text-xl font-extrabold text-gray-950">Step 2 CK · CCSSA forms</h3>
              <p className="mt-1 text-sm text-gray-600">Score conversion notes for each form.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {CCSSA_FORMS.map((n) => (
                  <Link
                    key={n}
                    href={n === 15 || n === 16 ? `/nbme-${n}-score-conversion` : `/nbme-score-conversion#nbme-${n}`}
                    className="rounded-full border border-gray-200 px-4 py-1.5 font-mono text-sm font-semibold text-gray-900 transition hover:border-mint-500 hover:text-mint-800"
                  >
                    NBME {n}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="text-xl font-extrabold text-gray-950">Step 3 · CCMSA</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                CCMSA reports a 10–800 Assessment Score with no official Step 3 conversion. Read why, and estimate
                Step 3 from UWSA or sample questions, on the{" "}
                <Link href="/step-3-predictor" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                  Step 3 predictor
                </Link>
                . For real Step 3 scores, see{" "}
                <Link href="/step-3-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                  Step 3 percentiles and passing score
                </Link>
                .
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 p-6">
              <h3 className="text-xl font-extrabold text-gray-950">Free official practice</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                USMLE&apos;s free sample questions (the &ldquo;Free 120&rdquo;) report a raw percent only. Check
                yours with the{" "}
                <Link href="/free-120-step-1" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                  Free 120 Step 1 readiness check
                </Link>{" "}
                or the{" "}
                <Link href="/free-120-predictor" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                  Free 120 to Step 2 CK converter
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 做题顺序 */}
      <section id="which-first" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Which NBME to take first, and how many
          </h2>
          <p className="mb-8 max-w-3xl text-lg text-gray-700">
            NBME does not publish a required order or number of forms. These rules follow from what its own score
            reports say about reliability.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {orderSteps.map((s) => (
              <div key={s.h} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{s.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{s.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-gray-700">
            How many? Every score comes with a likely range (about ±4 percentage points on CBSSA, about ±8 points on
            CCSSA in NBME&apos;s sample reports), so two or more recent results that agree are far more convincing
            than one.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="border-y border-gray-200 bg-white py-12">
        <div className="container mb-6 max-w-3xl">
          <h2 className="mb-2 text-2xl font-extrabold lg:text-3xl">Combine your Step 2 CK results</h2>
          <p className="text-gray-600">
            Enter a current CCSSA Total Score, plus any UWSA, Free 120, or AMBOSS results, to get one planning range.
            CBSSA and CCMSA reports are read on their own scales using the tools above.
          </p>
        </div>
        <Calculator />
      </section>

      {/* Interpretation */}
      <section className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
            How should I interpret an NBME result?
          </h2>
          <p className="mb-10 max-w-3xl text-lg text-gray-600">
            Avoid universal score bands. Reporting differs by assessment family, and an independent estimate does
            not replace the official score report.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {decisionSteps.map((row) => (
              <div key={row.label} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{row.label}</h3>
                <div className="mt-2 text-sm leading-relaxed text-gray-700">{row.advice}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            {[SOURCES.directory, SOURCES.cbssaSample, SOURCES.ccssaSample, SOURCES.ccmsaSample].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-evidence-source="primary"
                className="text-mint-800 underline underline-offset-4"
              >
                {s.label} (official)
              </a>
            ))}
            <Link href="/methodology" data-indexing-context="related" className="text-mint-800 underline underline-offset-4">
              Model assumptions and limitations
            </Link>
          </div>
        </div>
      </section>

      {/* Why a calculator */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            Why a calculator, when NBME already gives me a number?
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <BookOpen className="mb-3 h-6 w-6 text-mint-600" />
              <h3 className="mb-1 font-bold">Source-aware modelling</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                The calculator treats comprehensive, subject-level, and third-party inputs differently instead of
                applying one fixed adjustment to every score.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <GraduationCap className="mb-3 h-6 w-6 text-mint-600" />
              <h3 className="mb-1 font-bold">Multi-source aggregation</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                One result is not your real ability. We combine compatible CCSSA, UWSA, Free 120, and AMBOSS inputs
                into a weighted estimate.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <ShieldCheck className="mb-3 h-6 w-6 text-mint-600" />
              <h3 className="mb-1 font-bold">Confidence interval</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                A point estimate without an interval is misleading. We give you an estimated range so you can see
                the model&apos;s uncertainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-mint-50/40 py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            NBME self-assessment FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-gray-950">
                  <span>{f.q}</span>
                  <span className="text-2xl leading-none text-gray-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="container max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight lg:text-4xl">Ready to convert your NBME?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Use the calculator above, or open the conversion guide for your form.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Try the calculator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion" data-indexing-context="related">
                Open the NBME score converter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
