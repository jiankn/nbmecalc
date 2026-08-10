import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, ListChecks, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME Self-Assessment Guide: Forms & Scores | NBMEcalc",
  description:
    "Learn the difference between CBSSA, CCSSA, and CCMSA forms, how to read an NBME score report, and when to use an independent score calculator.",
  keywords: [
    "nbme self assessment",
    "nbme forms",
    "nbme score interpretation",
    "what is nbme",
    "which nbme form",
  ],
  alternates: { canonical: "https://nbmecalc.com/nbme-calculator" },
  openGraph: {
    title: "NBME Self-Assessment Guide: Forms & Scores",
    description:
      "Understand the NBME form families, official score reports, and when an independent calculator can help.",
    url: "https://nbmecalc.com/nbme-calculator",
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

const forms = [
  {
    name: "CBSSA",
    when: "Preparing for Step 1",
    body: "Comprehensive Basic Science Self-Assessment. Use its official readiness and performance feedback for the pass/fail Step 1 exam.",
  },
  {
    name: "CCSSA",
    when: "Preparing for Step 2 CK",
    body: "Comprehensive Clinical Science Self-Assessment. This is the comprehensive NBME family aligned with Step 2 CK.",
  },
  {
    name: "CCMSA",
    when: "Preparing for Step 3",
    body: "Comprehensive Clinical Medicine Self-Assessment. Use this family when estimating Step 3 readiness.",
  },
  {
    name: "Clinical Science Mastery Series",
    when: "Checking a clerkship subject",
    body: "Subject-focused CMS forms can reveal weak clinical areas, but they are not a direct substitute for a comprehensive CCSSA.",
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
    q: "What is the NBME?",
    a: "The National Board of Medical Examiners develops assessments used across medical education and offers self-assessments aligned with Step 1, Step 2 CK, and Step 3 preparation.",
  },
  {
    q: "Are NBME self-assessments worth the money?",
    a: "They can provide useful readiness and content-area feedback because they are aligned with the target exam. Whether another form is worth purchasing depends on your timeline, prior results, and what decision the result would change.",
  },
  {
    q: "What three-digit score does the NBME report?",
    a: "Reporting differs by assessment family and can change over time. Use the official score report as the source of truth; this site provides an independent estimate and confidence interval, not an official conversion.",
  },
  {
    q: "Which NBME should I take first?",
    a: "First choose the correct family: CBSSA for Step 1, CCSSA for Step 2 CK, or CCMSA for Step 3. Within that family, use an earlier form for a baseline and preserve another unused form for a later readiness check.",
  },
  {
    q: "Can I retake the same NBME form?",
    a: "A repeat may be less comparable with a first attempt because prior exposure can affect how you respond. When available, use a fresh form for a new readiness check and interpret any repeat through the official report rather than applying a fixed inflation adjustment.",
  },
  {
    q: "What is a passing score on NBME?",
    a: "An NBME self-assessment does not have a universal pass score across every product. For the real Step 2 CK exam, the passing standard is 218 as of July 1, 2025. For Step 1, use the probability and readiness guidance in the official CBSSA score report.",
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
            headline: "NBME Self-Assessment Guide: Forms and Scores",
            url: "https://nbmecalc.com/nbme-calculator",
            description:
              "A beginner-friendly guide to NBME assessment families, official score reports, and independent score estimates.",
            author: { "@type": "Organization", name: "NBMEcalc" },
            dateModified: "2026-08-09",
            mainEntityOfPage: "https://nbmecalc.com/nbme-calculator",
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
              acceptedAnswer: { "@type": "Answer", text: f.a.replace(/&quot;/g, '"').replace(/&apos;/g, "'") },
            })),
          }),
        }}
      />

      <PageHero
        badge="NBME self-assessment guide"
        title="NBME Self-Assessments: Forms, Scores, and Next Steps"
        description="Choose the correct assessment family for Step 1, Step 2 CK, or Step 3; read the official score report first; then use an independent calculator when you need a combined estimate."
        size="md"
      />

      {/* Quick TLDR */}
      <section className="py-12 bg-mint-50/40 border-b border-gray-200">
        <div className="container max-w-3xl">
          <div className="rounded-3xl bg-white border border-gray-200 p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-mint-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-950">
                TL;DR — 90-second summary
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>NBME self-assessments</strong> are official assessment
                products aligned with different USMLE preparation tracks.
              </li>
              <li>
                Match the family to the exam: <strong>CBSSA for Step 1,
                CCSSA for Step 2 CK, and CCMSA for Step 3</strong>.
              </li>
              <li>
                Treat the official score report as the source of truth. An
                independent estimate should show uncertainty, not promise a
                fixed point adjustment.
              </li>
              <li>
                Use a <strong>calculator like this one</strong> to adjust for
                recency, multiple inputs, and confidence interval.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-white border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the calculator
          </h2>
          <p className="text-gray-600">
            Enter a current Step 2 CCSSA Total Score below to get a planning
            range, or use this guide to read CBSSA and CCMSA reports on their
            own scales.
          </p>
        </div>
        <Calculator />
      </section>

      {/* Which form when */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Which NBME assessment family should I use?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Start with the exam you are preparing for. Form numbers are not
            interchangeable across assessment families.
          </p>

          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Form
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    When to take
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {forms.map((f) => (
                  <tr key={f.name}>
                    <td className="px-5 py-3 font-bold text-gray-950">
                      {f.name}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{f.when}</td>
                    <td className="px-5 py-3 text-gray-700">{f.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interpretation */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            How should I interpret an NBME result?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Avoid universal score bands. Reporting differs by assessment
            family, and an independent estimate does not replace the official
            score report.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {decisionSteps.map((row) => (
              <div
                key={row.label}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-bold text-gray-950">{row.label}</h3>
                <div className="mt-2 text-sm leading-relaxed text-gray-700">
                  {row.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-12">
        <div className="container max-w-4xl">
          <div className="rounded-3xl border border-mint-200 bg-mint-50/40 p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-800">
              Sources checked August 9, 2026
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
              Verify the assessment family before using a calculator
            </h2>
            <p className="mt-3 max-w-3xl text-gray-700">
              NBME&apos;s official self-assessment directory maps CBSSA to Step 1,
              CCSSA to Step 2 CK, CCMSA to Step 3, and Clinical Science Mastery
              Series forms to subject-exam preparation.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              <a
                href="https://www.nbme.org/examinees/self-assessments/"
                target="_blank"
                rel="noreferrer"
                data-evidence-source="primary"
                className="text-mint-800 underline underline-offset-4"
              >
                NBME self-assessments (official)
              </a>
              <Link
                href="/methodology"
                data-indexing-context="related"
                className="text-mint-800 underline underline-offset-4"
              >
                Model assumptions and limitations
              </Link>
              <Link
                href="/validation"
                data-indexing-context="related"
                className="text-mint-800 underline underline-offset-4"
              >
                Current validation status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why a calculator */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            Why a calculator, when NBME already gives me a number?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Three reasons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <BookOpen className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Source-aware modelling</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The calculator treats comprehensive, subject-level, and
                third-party inputs differently instead of applying one fixed
                adjustment to every score.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <GraduationCap className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Multi-source aggregation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                One result ≠ your real ability. We combine compatible CCSSA,
                UWSA, Free 120, and AMBOSS inputs into a weighted estimate.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <ShieldCheck className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Confidence interval</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A point estimate without an interval is misleading. We give
                you an estimated range so you can see the model&apos;s uncertainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-mint-50/40">
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
            Ready to convert your NBME?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Use the free calculator above, or dive deeper into the conversion
            tables.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Try the calculator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="/nbme-score-conversion"
                data-indexing-context="related"
              >
                Read the NBME score report guide
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
