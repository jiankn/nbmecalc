import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Info, Layers3 } from "lucide-react";
import { Calculator } from "@/components/sections/calculator";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBME 15 Score Conversion Calculator for Step 2 CK | NBMEcalc",
  description:
    "Use the free NBME 15 Step 2 CK score converter with Form 15 preselected. Enter the CCSSA total score from your report and read an independent planning range.",
  alternates: { canonical: "https://nbmecalc.com/nbme-15-score-conversion" },
  openGraph: {
    title: "NBME 15 Score Conversion Calculator for Step 2 CK",
    description:
      "A free Form 15 CCSSA converter with a transparent internal planning range and multi-assessment next step.",
    url: "https://nbmecalc.com/nbme-15-score-conversion",
    type: "website",
  },
};

const faqs = [
  {
    q: "What should I enter for NBME 15 score conversion?",
    a: "Enter the three-digit CCSSA total score shown on your official Form 15 report. Do not enter the number of wrong answers or a content-area percentage into the three-digit score field.",
  },
  {
    q: "Is this an official NBME 15 conversion?",
    a: "No. The current CCSSA Total Score already estimates Step 2 CK performance. NBMEcalc preserves that score as the assessment midpoint, then adds an independent planning range or combines it with other inputs. It is not affiliated with NBME or USMLE.",
  },
  {
    q: "What is the current Step 2 CK passing score?",
    a: "The USMLE passing standard is 218 for exams administered on or after July 1, 2025. Use the current official score report and USMLE guidance for any exam decision.",
  },
  {
    q: "Should I use NBME 15 by itself?",
    a: "A single form is a checkpoint, not a complete forecast. Add another recent comprehensive assessment or UWSA to see whether your evidence agrees and to obtain a more useful trend.",
  },
];

export default function Nbme15ScoreConversionPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NBME 15 Step 2 CK Score Conversion Calculator",
            url: "https://nbmecalc.com/nbme-15-score-conversion",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "A free Form 15 CCSSA total-score converter with an independent Step 2 CK planning range.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
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
              {
                "@type": "ListItem",
                position: 3,
                name: "NBME 15 Score Conversion",
                item: "https://nbmecalc.com/nbme-15-score-conversion",
              },
            ],
          }),
        }}
      />

      <PageHero
        badge="Step 2 CK · CCSSA Form 15"
        title="NBME 15 Score Conversion Calculator"
        description="Form 15 is preselected. Enter the Total CCSSA Score from your report; NBMEcalc keeps that official estimate as the midpoint and adds an independent planning range."
        size="md"
      />

      <section id="calculator" className="border-b border-gray-200 bg-mint-50/30 py-10 lg:py-14">
        <div className="container mb-6 max-w-4xl">
          <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Start with one Form 15 result. The free calculator delivers the
              estimate before signup or payment; adding another assessment is
              optional and makes the trend more informative.
            </p>
          </div>
        </div>
        <Calculator
          defaultStep="step2"
          defaultSource="NBME"
          defaultFormNumber={15}
          singleAssessment
        />
      </section>

      <section className="border-b border-gray-200 bg-white py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                NBME 15 conversion: the quick answer
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-gray-700">
                <p>
                  Use the <strong>CCSSA total score</strong> printed on your
                  Form 15 report. That score already estimates Step 2 CK
                  performance, so NBMEcalc keeps it as the assessment midpoint
                  and reports a wider planning range around it.
                </p>
                <p>
                  The model does not apply a secret Form 15 bonus or claim an
                  official wrong-answer formula. With multiple inputs, source
                  type and recency affect the combined result.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold text-gray-950">Use the correct input</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-gray-900">Enter</dt>
                  <dd className="mt-1 text-gray-700">Three-digit CCSSA total score.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">Do not enter</dt>
                  <dd className="mt-1 text-gray-700">
                    Wrong-answer count, raw percent correct, shelf score, or a
                    Step 1 CBSSA EPC score.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-mint-700" />
            <h2 className="text-3xl font-extrabold tracking-tight">
              One form gives a checkpoint; several inputs give a trend
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                "1. Convert Form 15",
                "Get the free midpoint, estimated range, and experimental pass estimate.",
              ],
              [
                "2. Add another assessment",
                "Use a recent CCSSA or UWSA so the calculator can test whether the evidence agrees.",
              ],
              [
                "3. Decide whether depth is useful",
                "The optional paid report adds the full source notes, study-plan framework, and downloadable PDF.",
              ],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-gray-200 bg-white p-5">
                <CheckCircle2 className="h-5 w-5 text-mint-700" />
                <h3 className="mt-3 font-bold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-mint-200 bg-mint-50 p-5 text-sm leading-relaxed text-gray-800">
            The current Step 2 CK passing standard is 218 for exams administered
            on or after July 1, 2025. Verify current standards on the{" "}
            <a
              href="https://www.usmle.org/scores-transcripts/examination-results-and-scoring"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              official USMLE scoring page
            </a>
            .
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight">
            What makes this page different from the conversion hub?
          </h2>
          <p className="mt-4 leading-relaxed text-gray-700">
            The hub covers all NBME assessment families. This page opens with
            Step 2 CK, NBME, and Form 15 already selected, explains the exact
            compatible input, and records Form 15 traffic and conversion as an
            independent pilot. It does not create a different formula just to
            justify another URL.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="#calculator">
                Convert my Form 15 score
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/nbme-score-conversion">Open all NBME forms</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/methodology">Review model assumptions</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-mint-50/40 py-14 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            NBME 15 FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-bold text-gray-950">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
