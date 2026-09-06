import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, Microscope } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const insightsGuideUrl =
  "https://www.nbme.org/sites/default/files/2024-01/INSIGHTS_User_Guide.pdf";

export const metadata: Metadata = {
  title: "CMS Score Conversion: Read the NBME 1–30 Score | NBMEcalc",
  description:
    "Learn how to read the NBME CMS 1–30 total score, find the approximate Subject Exam score on your report, and avoid unsupported Step 2 CK conversions.",
  alternates: { canonical: "https://nbmecalc.com/cms-converter" },
  openGraph: {
    title: "CMS Score Conversion: Read the NBME 1–30 Score",
    description:
      "Read the official CMS total score and its approximate Subject Exam equivalent without treating a subject form as a Step 2 CK prediction.",
    url: "https://nbmecalc.com/cms-converter",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "How to interpret an NBME CMS score report",
      },
    ],
  },
};

const reportFields = [
  {
    field: "CMS total score (1–30)",
    supports: "The official total reported for a Clinical Science Mastery Series form",
    limit: "It is not a percent correct or a 3-digit Step 2 CK score",
  },
  {
    field: "Approximate Subject Exam score",
    supports: "The corresponding subject-exam estimate printed in the score report PDF",
    limit: "It is not an overall Step 2 CK estimate",
  },
  {
    field: "Content-area feedback",
    supports: "Targeted review inside that clerkship subject",
    limit: "Does not measure comprehensive exam readiness",
  },
];

const faqs = [
  {
    q: "What is a CMS Form?",
    a: "CMS commonly refers to NBME's Clinical Science Mastery Series: subject-focused self-assessments for areas such as Medicine, Surgery, Pediatrics, OB/GYN, Psychiatry, and Family Medicine. They are different from the comprehensive CCSSA used for Step 2 CK readiness.",
  },
  {
    q: "Can CMS Forms predict an overall Step 2 CK score?",
    a: "Not directly. CMS forms are subject-focused and should not replace a comprehensive CCSSA. Combine CMS results with a recent CCSSA, UWSA, or Free 120 when estimating overall Step 2 CK readiness.",
  },
  {
    q: "How do I calculate a CMS form score from the PDF report?",
    a: "Use the 1-30 CMS total score printed on the official report. The same PDF provides the Subject Exam score that approximately corresponds to it, so no third-party arithmetic is needed.",
  },
  {
    q: "Can a CMS score be converted directly to a 250 Step 2 CK score?",
    a: "No. NBME publishes an approximate correspondence to the matching Subject Exam, not a one-to-one CMS-to-Step 2 CK conversion. Use a recent comprehensive assessment and its official report for overall readiness.",
  },
  {
    q: "Are CMS Forms worth taking if I am studying for Step 2 CK directly?",
    a: "They can help investigate a suspected weak subject. Choose the matching subject form, review the official performance feedback, and use the result to guide targeted study rather than treating it as a direct Step 2 CK score.",
  },
];

const cmsPdfSteps = [
  {
    title: "Open the official CMS PDF or score report",
    body: "Find the subject, form, and reported score. Do not mix a Medicine CMS form with a Surgery or Pediatrics form.",
  },
  {
    title: "Use the native score first",
    body: "Read the 1-30 CMS total score and the approximate Subject Exam score from the official PDF. Keep both separate from Step 2 CK's 1-300 score scale.",
  },
  {
    title: "Compare against a comprehensive form",
    body: "A CMS result explains a weak subject. A CCSSA, UWSA, or Free 120 result is still needed for overall Step 2 CK readiness.",
  },
];

const cmsRelatedTools = [
  {
    href: "/nbme-score-conversion",
    title: "NBME score conversion",
    desc: "Use comprehensive CCSSA or CBSSA forms for overall readiness.",
  },
  {
    href: "/free-120-predictor",
    title: "Free 120 score conversion",
    desc: "Check whether your late-stage official-style sample agrees with CMS signals.",
  },
  {
    href: "/step-2-predictor",
    title: "Step 2 CK predictor",
    desc: "Combine compatible comprehensive and Step 2-specific inputs in one forecast.",
  },
];

export default function CmsConverterPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "CMS Score Conversion Guide",
            url: "https://nbmecalc.com/cms-converter",
            description:
              "Guide to reading the NBME CMS 1-30 total score and the approximate Subject Exam score printed on the official report.",
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
        badge="Official CMS score scale"
        title="CMS Score Conversion: How to Read the NBME 1–30 Score"
        description="Clinical Science Mastery Series reports use a 1–30 total score and provide an approximate score on the matching NBME Subject Exam scale. They do not provide a direct Step 2 CK conversion."
        size="md"
      />

      <section className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            There is no official CMS-to-Step 2 CK formula
          </h2>
          <p className="text-gray-700 leading-relaxed">
            NBME reports CMS performance on a 1–30 scale and tells you where
            that result approximately falls on the corresponding Subject Exam
            scale. Read those fields directly. Use a comprehensive CCSSA when
            the question is overall Step 2 CK readiness.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" asChild>
              <a href={insightsGuideUrl} target="_blank" rel="noopener noreferrer">
                Read the NBME scoring guide
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cms-forms-step-2-ck">Choose a CMS subject</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              How to read a CMS score report
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Start with the fields printed in the official report. A CMS result
            describes one clinical subject and uses a different score scale
            from a comprehensive Step 2 CK assessment.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Report field</th>
                  <th className="text-left px-5 py-3 font-bold text-mint-700">What it supports</th>
                  <th className="text-left px-5 py-3 font-bold text-rose-700">What it cannot tell you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reportFields.map((row) => (
                  <tr key={row.field}>
                    <td className="px-5 py-3 font-medium text-gray-900">{row.field}</td>
                    <td className="px-5 py-3 text-gray-700">{row.supports}</td>
                    <td className="px-5 py-3 text-gray-700">{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white border-b border-gray-200">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            How to read a CMS form score from your PDF
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            A CMS PDF helps diagnose one subject, while comprehensive Step 2
            readiness still needs a broader assessment. Follow these three
            checks before comparing the result with any other assessment.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {cmsPdfSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-mint-100 text-sm font-extrabold text-mint-800">
                  {index + 1}
                </div>
                <h3 className="font-bold text-gray-950 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Microscope className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              How CMS forms surface weak rotations
            </h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              A comprehensive CCSSA summarizes performance across clinical
              subjects. A subject-focused CMS form can help investigate a
              weakness that the overall result does not explain.
            </p>
            <p>
              For example, a targeted Pediatrics CMS form can show whether a
              low Pediatrics content-area result persists under a dedicated
              set of questions. Use the official feedback to decide what to
              review next.
            </p>
            <p>
              If you are still deciding which subject to test, use the{" "}
              <Link
                href="/cms-forms-step-2-ck"
                className="font-semibold text-mint-700 underline underline-offset-4"
              >
                CMS Forms for Step 2 CK guide
              </Link>{" "}
              to compare the eight official content areas, pacing modes, and
              legal purchase path before opening this score tool.
            </p>
            <p>
              <strong>Recommended workflow:</strong> start with the content
              areas in your official comprehensive score report, choose the
              matching CMS subject, review the explanations, and then confirm
              progress with a fresh comprehensive assessment. When you have
              results from more than one source, add them to the{" "}
              <Link href="/step-2-predictor" className="font-semibold text-mint-700 underline underline-offset-4">
                Step 2 CK predictor
              </Link>{" "}
              with compatible comprehensive or Step 2-specific results instead
              of projecting one CMS subject score across the whole exam.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            CMS Form FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-950 list-none">
                  <span>{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Related Step 2 conversion tools
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            CMS forms are best used as subject-level evidence. Use these pages
            when you need a comprehensive forecast or a late-stage check.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {cmsRelatedTools.map((tool) => (
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

      <section className="py-16 bg-mint-50/40">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Continue with the right assessment
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="/cms-forms-step-2-ck">Choose a CMS subject</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">Step 2 CK predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
