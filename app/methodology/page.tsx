import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  CircleMinus,
  History,
  Info,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Methodology, Sources & Model Limitations | NBMEcalc",
  description:
    "Understand what your NBMEcalc estimate means, how it is calculated, when to be cautious, and which claims come from official sources.",
  alternates: { canonical: "https://nbmecalc.com/methodology" },
  openGraph: {
    title: "What Your NBMEcalc Estimate Means",
    description:
      "A plain-language guide to NBMEcalc inputs, assumptions, official sources, validation status, and known limitations.",
    url: "https://nbmecalc.com/methodology",
    type: "article",
  },
};

const appropriateUses = [
  "Compare several practice assessments on one view.",
  "Track whether your recent results are moving consistently.",
  "Plan what to study or assess next.",
];

const inappropriateUses = [
  "Replace an official NBME or USMLE score report.",
  "Make an exam-eligibility or scheduling decision by itself.",
  "Treat a point estimate as a guaranteed outcome.",
];

const calculationSteps = [
  {
    title: "Enter your results",
    body: "Add the practice assessments you have taken, including their dates when available.",
  },
  {
    title: "Align assessment families",
    body: "Results are mapped to a shared internal scale while keeping comprehensive and subject-specific products distinct.",
  },
  {
    title: "Weight the evidence",
    body: "Source type and recency affect each result's contribution to the combined estimate.",
  },
  {
    title: "Report an estimate and range",
    body: "The output is a planning estimate with a model-generated interval, not an official score or guarantee.",
  },
];

const strongerSignals = [
  "Several recent comprehensive assessments are included.",
  "The results tell a reasonably consistent story.",
  "At least one assessment closely matches your target exam.",
];

const cautionSignals = [
  "Only one assessment is available.",
  "Most results are old or missing dates.",
  "The inputs are mainly subject-specific CMS forms.",
  "Different assessment families disagree substantially.",
];

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
      "Removed a legacy claim of a 1,247-person validation cohort because reproducible supporting data was unavailable.",
      "Removed legacy physician-reviewer profiles because their attribution could not be independently verified.",
      "Marked articles with obsolete form mappings or unsupported data claims noindex pending editorial review.",
    ],
  },
];

function SourceLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const className =
    "inline-flex items-center gap-1 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900";

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function MethodologyPage() {
  return (
    <PageShell>
      <PageHero
        badge="Methodology & limitations"
        title="What Your NBMEcalc Estimate Means"
        description="A plain-language guide to what goes into your estimate, how to interpret the range, and where the model's limits begin."
        size="sm"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="#start-here">
              Read the quick guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/#calculator">Try the calculator</Link>
          </Button>
        </div>
      </PageHero>

      <div className="border-b border-gray-200 bg-white">
        <div className="container max-w-5xl py-5">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-semibold text-gray-700">
            {[
              "Independent planning tool",
              "Official sources cited",
              "Internal assumptions labelled",
              "Not affiliated with NBME or USMLE",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-mint-700"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section id="start-here" className="scroll-mt-24 bg-white py-14 lg:py-18">
        <div className="container max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-balance text-gray-950">
              Start with the decision you need to make
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
              Your estimate is most useful as one input into a study plan. It
              should add context to official assessment reports, not compete
              with them.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-mint-50 p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="h-6 w-6 text-mint-800"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">Use it for</h3>
              </div>
              <ul className="mt-5 space-y-3 text-gray-800">
                {appropriateUses.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-gray-100 p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <CircleMinus
                  className="h-6 w-6 text-gray-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">
                  Do not use it for
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-gray-800">
                {inappropriateUses.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3">
            <Scale className="h-7 w-7 text-mint-700" aria-hidden="true" />
            <h2 className="text-3xl font-extrabold text-balance text-gray-950">
              How your estimate is calculated
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
            The calculator combines the assessments you provide while keeping
            product families and recency visible in the model.
          </p>

          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {calculationSteps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-mint-500 pt-5">
                <span className="font-mono text-sm font-bold text-mint-800">
                  Step {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex gap-3 rounded-lg border border-gray-200 bg-white p-5 text-gray-700">
            <Info
              className="mt-0.5 h-5 w-5 shrink-0 text-mint-700"
              aria-hidden="true"
            />
            <p className="max-w-3xl leading-relaxed">
              <strong className="text-gray-950">About the range:</strong> The
              planning interval is generated by NBMEcalc&apos;s model. It is not
              an official confidence statement from NBME or USMLE.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-balance text-gray-950">
              How much weight should you place on it?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              The quality and agreement of the inputs matter more than the
              number of fields you fill in.
            </p>
          </div>

          <div className="mt-9 grid gap-10 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="h-6 w-6 text-mint-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">
                  More informative when
                </h3>
              </div>
              <ul className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
                {strongerSignals.map((item) => (
                  <li key={item} className="flex gap-3 py-4 text-gray-700">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-mint-700"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Info
                  className="h-6 w-6 text-gray-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">
                  Be more cautious when
                </h3>
              </div>
              <ul className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
                {cautionSignals.map((item) => (
                  <li key={item} className="flex gap-3 py-4 text-gray-700">
                    <CircleMinus
                      className="mt-0.5 h-5 w-5 shrink-0 text-gray-600"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-mint-50/50 py-14 lg:py-18">
        <div className="container max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(250px,0.6fr)] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-mint-800" aria-hidden="true" />
                <h2 className="text-2xl font-extrabold text-gray-950">
                  Current validation status
                </h2>
              </div>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-800">
                NBMEcalc publishes its source references, model assumptions,
                and known limitations. An independent holdout validation report
                has not yet been published, so the output should be interpreted
                as a planning estimate and used alongside official assessment
                reports.
              </p>
            </div>

            <dl className="divide-y divide-mint-200 border-y border-mint-200 text-sm">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-gray-700">Source documentation</dt>
                <dd className="font-bold text-gray-950">Public</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-gray-700">Holdout report</dt>
                <dd className="text-right font-bold text-gray-950">
                  Not yet published
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-gray-700">Last methodology update</dt>
                <dd className="font-bold text-gray-950">Jun 28, 2026</dd>
              </div>
            </dl>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-mint-200 pt-6 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-sm leading-relaxed text-gray-700">
              Reviewing NBMEcalc for a library guide, course, or academic
              support program?
            </p>
            <Link
              href="/educators"
              className="inline-flex items-center gap-2 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900"
            >
              Open the institutional review page
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3">
            <BookOpenCheck
              className="h-7 w-7 text-mint-700"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-extrabold text-balance text-gray-950">
              What is official and what is an internal assumption
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
            Official facts link to their primary source. Internal mappings and
            source adjustments are labelled and must not be presented as
            official conversions.
          </p>

          <div className="mt-9 hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left font-bold">
                    Topic
                  </th>
                  <th scope="col" className="px-5 py-3 text-left font-bold">
                    Evidence
                  </th>
                  <th scope="col" className="px-5 py-3 text-left font-bold">
                    Current use
                  </th>
                  <th scope="col" className="px-5 py-3 text-left font-bold">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sourceRows.map((row) => (
                  <tr key={row.topic}>
                    <th
                      scope="row"
                      className="px-5 py-4 text-left font-semibold text-gray-950"
                    >
                      {row.topic}
                    </th>
                    <td className="px-5 py-4 text-gray-700">{row.status}</td>
                    <td className="max-w-xl px-5 py-4 leading-relaxed text-gray-700">
                      {row.detail}
                    </td>
                    <td className="px-5 py-4">
                      <SourceLink href={row.href} label={row.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200 md:hidden">
            {sourceRows.map((row) => (
              <article key={row.topic} className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold leading-snug text-gray-950">
                    {row.topic}
                  </h3>
                  <span className="shrink-0 text-xs font-bold text-mint-800">
                    {row.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                  {row.detail}
                </p>
                <div className="mt-3 text-sm">
                  <SourceLink href={row.href} label={row.label} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3">
            <History className="h-7 w-7 text-mint-700" aria-hidden="true" />
            <h2 className="text-3xl font-extrabold text-balance text-gray-950">
              Methodology updates
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            Material corrections remain public so readers can see how the
            methodology and its claims have changed.
          </p>

          <div className="mt-8 border-y border-gray-300 py-6">
            {changes.map((change) => (
              <article key={change.date}>
                <time
                  dateTime={change.date}
                  className="font-mono text-sm font-bold text-mint-800"
                >
                  {change.date}
                </time>
                <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-gray-700 marker:text-mint-700">
                  {change.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-relaxed text-gray-700">
              Found an error? Include the page URL and the primary source that
              conflicts with the current text.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900"
            >
              Send a correction
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
