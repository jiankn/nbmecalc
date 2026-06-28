import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpenCheck, History, Sigma } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Methodology, Sources & Model Limitations | NBMEcalc",
  description:
    "Read NBMEcalc model assumptions, official sources, known limitations, validation status, and the public change log.",
  alternates: { canonical: "https://nbmecalc.com/methodology" },
  openGraph: {
    title: "NBMEcalc Methodology, Sources & Limitations",
    description:
      "Public model assumptions, official sources, known limitations, and material changes.",
    url: "https://nbmecalc.com/methodology",
    type: "article",
  },
};

const sourceRows = [
  {
    topic: "Step 2 CK passing standard",
    status: "Official",
    detail: "218 for exams administered on or after July 1, 2025.",
    href: "https://www.usmle.org/scores-transcripts/examination-results-and-scoring",
    label: "USMLE scoring",
  },
  {
    topic: "Step 2 CK self-assessment family",
    status: "Official",
    detail:
      "CCSSA is the comprehensive NBME self-assessment aligned with Step 2 CK.",
    href: "https://www.nbme.org/examinees/self-assessments/comprehensive-clinical-science-self-assessment/",
    label: "NBME CCSSA",
  },
  {
    topic: "Assessment-family separation",
    status: "Official",
    detail:
      "CBSSA, CCSSA, CCMSA, and Clinical Science Mastery Series are distinct products and are not interchangeable.",
    href: "https://www.nbme.org/news/new-examinee-interface-nbme-self-assessments",
    label: "NBME portfolio update",
  },
  {
    topic: "Score conversion coefficients",
    status: "Internal assumption",
    detail:
      "Piecewise mappings and source adjustments are independent model assumptions, not official NBME or USMLE conversions.",
    href: "/contact",
    label: "Report a concern",
  },
];

const changes = [
  {
    date: "2026-06-28",
    items: [
      "Separated CBSSA, CCSSA, and CCMSA form selectors by target Step exam.",
      "Updated the Step 2 CK passing standard from 214 to 218.",
      "Removed unsupported claims of a 1,247-person validation cohort.",
      "Removed unverified physician-reviewer profiles and replaced them with a transparent editorial status.",
      "Marked articles with obsolete form mappings or unsupported data claims noindex pending editorial review.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <PageShell>
      <PageHero
        badge="Public methodology"
        title="How NBMEcalc Builds a Score Estimate"
        description="This page separates official facts, internal model assumptions, and unverified claims. The calculator is an independent planning aid—not an official NBME or USMLE score report."
        size="md"
      />

      <section className="py-14 bg-amber-50/60 border-b border-amber-200">
        <div className="container max-w-4xl">
          <div className="flex gap-4 rounded-3xl border border-amber-200 bg-white p-6">
            <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-gray-950 mb-2">Validation status</h2>
              <p className="text-gray-700 leading-relaxed">
                A reproducible outcome dataset and holdout validation report
                are not currently published. Therefore, NBMEcalc does not
                claim a verified median prediction error or a validated cohort
                size. Use the official assessment report first and interpret
                this site&apos;s output as a planning range.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <BookOpenCheck className="h-7 w-7 text-mint-700" />
            <h2 className="text-3xl font-extrabold">Source confidence</h2>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Official facts are linked to their primary source. Internal
            assumptions are labelled and must not be presented as official.
          </p>
          <div className="overflow-x-auto rounded-3xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Topic</th>
                  <th className="text-left px-5 py-3 font-bold">Evidence</th>
                  <th className="text-left px-5 py-3 font-bold">Current use</th>
                  <th className="text-left px-5 py-3 font-bold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sourceRows.map((row) => {
                  const external = row.href.startsWith("http");
                  return (
                    <tr key={row.topic}>
                      <td className="px-5 py-4 font-semibold text-gray-950">
                        {row.topic}
                      </td>
                      <td className="px-5 py-4 text-gray-700">{row.status}</td>
                      <td className="px-5 py-4 text-gray-700">{row.detail}</td>
                      <td className="px-5 py-4">
                        {external ? (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener"
                            className="font-semibold text-mint-700 underline"
                          >
                            {row.label}
                          </a>
                        ) : (
                          <Link
                            href={row.href}
                            className="font-semibold text-mint-700 underline"
                          >
                            {row.label}
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Sigma className="h-7 w-7 text-mint-700" />
            <h2 className="text-3xl font-extrabold">Current model behaviour</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Inputs",
                body: "NBME comprehensive forms, UWSA 1/2, Free 120, AMBOSS Self-Assessment, CMS forms, recency, and target Step exam.",
              },
              {
                title: "Aggregation",
                body: "Each source is mapped to an internal Step-equivalent estimate, weighted by source type and recency, then combined.",
              },
              {
                title: "Uncertainty",
                body: "The product reports a point estimate and planning interval. The interval is model-generated and is not an official confidence statement from NBME or USMLE.",
              },
              {
                title: "Known limits",
                body: "The model cannot account for test-day illness, question mix, score-report changes, incomplete inputs, or differences between assessment families that are not represented in its assumptions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-bold text-gray-950 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <History className="h-7 w-7 text-mint-700" />
            <h2 className="text-3xl font-extrabold">Material change log</h2>
          </div>
          <div className="space-y-5">
            {changes.map((change) => (
              <article
                key={change.date}
                className="rounded-3xl border border-gray-200 p-6"
              >
                <time
                  dateTime={change.date}
                  className="font-mono text-sm font-bold text-mint-700"
                >
                  {change.date}
                </time>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                  {change.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-gray-600">
            Found an error?{" "}
            <Link href="/contact" className="font-semibold text-mint-700 underline">
              Send a correction
            </Link>
            . Include the page URL and the primary source that conflicts with
            the current text.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
