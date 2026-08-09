import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, BarChart3, Calendar } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 2 Score Predictor & CK Calculator | NBMEcalc",
  description:
    "Free Step 2 score predictor and CK calculator. Combine CCSSA forms 9-15, UWSA, Free 120, AMBOSS, and CMS inputs with a transparent planning range.",
  keywords: [
    "step 2 score predictor",
    "step 2 score calculator",
    "step 2 ck score calculator",
    "usmle step 2 ck score predictor",
    "step 2 predictor",
    "step 2 ck calculator",
    "step 2 score converter",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-2-predictor" },
  openGraph: {
    title: "Step 2 Score Predictor & CK Calculator",
    description:
      "Combine compatible Step 2 CK practice inputs and review the model's assumptions, planning range, and official-source study priorities.",
    url: "https://nbmecalc.com/step-2-predictor",
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

const contextChecks = [
  {
    title: "Do not turn a score into a match promise",
    body: "Program selection uses more than one exam result, and historical matched-applicant data does not create a universal specialty cutoff.",
  },
  {
    title: "Use the correct comparison group",
    body: "If you consult match data, match the applicant type, specialty, cycle, and reported statistic. Do not apply a fixed adjustment from one group to another.",
  },
  {
    title: "Verify the current source",
    body: "Match reports and program practices change. Use current NRMP publications and individual program information for application planning.",
  },
  {
    title: "Keep readiness and applications separate",
    body: "Use official assessment feedback for exam readiness and current advising or program data for application strategy. One model output cannot answer both questions.",
  },
];

const sourceCorrections = [
  { src: "CCSSA forms 9-15", note: "Use the equated score report", adj: "Modelled" },
  { src: "UWSA 1", note: "Internal source adjustment", adj: "−5" },
  { src: "UWSA 2", note: "Internal source adjustment", adj: "−2" },
  { src: "Free 120", note: "Percentage input; internal mapping", adj: "0" },
  { src: "AMBOSS SA", note: "Internal source adjustment", adj: "−5" },
  { src: "CMS Form", note: "Subject-level, no overall", adj: "—" },
];

const faqs = [
  {
    q: "How accurate is the Step 2 CK predictor?",
    a: "A reproducible holdout validation dataset is not currently published, so we do not claim a verified median error. More recent, consistent inputs can make the model range more useful, but the official score report remains the primary readiness signal.",
  },
  {
    q: "Which practice exam is most predictive of Step 2 CK?",
    a: "No single practice exam guarantees a final score. Use a recent CCSSA result together with Free 120 or UWSA 2, and pay attention to agreement across inputs and the full planning range.",
  },
  {
    q: "What is the current Step 2 CK passing score?",
    a: "The passing standard is 218 for examinees testing on or after July 1, 2025. A prediction near that threshold should be interpreted with its full planning range, not as a guaranteed pass.",
  },
  {
    q: "Should I take Step 2 CK before submitting ERAS?",
    a: "That depends on your application timeline, program requirements, and when an official result is likely to be available. Confirm current reporting guidance with USMLE and discuss application timing with your school or advisor.",
  },
  {
    q: "What is a competitive Step 2 CK score?",
    a: "There is no universal competitive cutoff. If you use match data, select the current applicant group and specialty, then interpret the score alongside the rest of the application and individual program information.",
  },
];

export default function Step2PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 2 CK Predictor",
            url: "https://nbmecalc.com/step-2-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free USMLE Step 2 CK predictor that combines NBME, UWSA, Free 120, AMBOSS, and CMS Form scores into a weighted estimate with a transparent planning range.",
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
        badge="Free Step 2 CK score calculator"
        title="Step 2 Score Predictor and CK Calculator"
        description="Combine Step 2 CK CCSSA, UWSA, Free 120, AMBOSS, and CMS inputs into one independent estimate. Review the midpoint together with its estimated planning range."
        size="md"
      />

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the Step 2 CK calculator
          </h2>
          <p className="text-gray-600">
            Select <strong>Step 2 CK</strong> in the form below, then enter
            your practice scores. The calculator outputs your point estimate,
            estimated range and model-based pass estimate.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      {/* Worked example */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container max-w-4xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
            A worked example
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Suppose you enter <strong>CCSSA Form 12 = 248</strong>,{" "}
            <strong>UWSA 2 = 255</strong>, and <strong>Free 120 = 78%</strong>.
            The calculator applies the UWSA-2{" "}
            <span className="font-mono">−2</span> correction (see the table
            below), weights your most recent forms, and returns a point estimate
            near <strong>250</strong> with an estimated planning range of roughly{" "}
            <strong>±8</strong>. Read against the specialty table, that sits
            around the median for diagnostic radiology and well above the
            family-medicine range — useful context when you are deciding whether
            your score supports your target specialty.
          </p>
          <p className="text-sm text-gray-500 italic">
            Illustrative only — your result depends on your exact forms and
            dates. The corrections and assumptions are documented in our{" "}
            <Link
              href="/methodology"
              className="text-mint-700 underline underline-offset-2"
            >
              methodology
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Application context */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Keep score context honest
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mb-8">
            A predicted score is not a residency-match forecast. Use these
            checks before comparing a model output with specialty data.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {contextChecks.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-bold text-gray-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Source corrections */}
      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              How we adjust each input source
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            These values are versioned internal model assumptions. They are not
            official conversions and are not proof that every assessment has a
            universal bias.
          </p>

          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Source
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Model handling
                  </th>
                  <th className="text-center px-5 py-3 font-bold text-mint-700">
                    Adjustment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sourceCorrections.map((c) => (
                  <tr key={c.src}>
                    <td className="px-5 py-3 font-bold text-gray-950">
                      {c.src}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{c.note}</td>
                    <td className="px-5 py-3 text-center font-mono text-base font-bold text-mint-700">
                      {c.adj}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              The 8-week Step 2 CK practice arc
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            An illustrative sequence, not an evidence-based prescription.
            Adapt it to your school&apos;s guidance and the assessments you still have unused.
          </p>

          <ol className="space-y-4">
            {[
              {
                w: "Week −8",
                t: "Baseline CCSSA",
                b: "Use an unused Step 2 CK CCSSA form to establish a baseline and identify content areas that need work.",
              },
              {
                w: "Week −6",
                t: "UWSA 1",
                b: "Mid-cycle check. Treat the UWSA result as another input, not as a fixed offset from your final score.",
              },
              {
                w: "Week −4",
                t: "Second CCSSA",
                b: "Choose another unused CCSSA form and compare both the total result and content-area feedback.",
              },
              {
                w: "Week −3",
                t: "UWSA 2",
                b: "Use as another late-cycle input and compare it with your recent CCSSA results.",
              },
              {
                w: "Week −2",
                t: "Late CCSSA check",
                b: "Use a fresh form to check whether your trend holds under new questions.",
              },
              {
                w: "Week −1",
                t: "Free 120 + recent CCSSA",
                b: "Compare the two signals. Agreement is more informative than a fixed adjustment to either score.",
              },
              {
                w: "Test day",
                t: "Walk in with confidence",
                b: "Use the full predicted range for planning. No practice assessment can guarantee the final score.",
              },
            ].map((step) => (
              <li
                key={step.w}
                className="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-white"
              >
                <div className="shrink-0 w-20 font-mono text-mint-700 font-bold">
                  {step.w}
                </div>
                <div>
                  <div className="font-bold text-gray-950 mb-1">{step.t}</div>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.b }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related tools */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-extrabold mb-4">Related Step 2 CK tools</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-mint-700 font-semibold">
            <li>
              <Link
                href="/nbme-score-conversion"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                NBME → Step 2 CK conversion tables
              </Link>
            </li>
            <li>
              <Link
                href="/uwsa-2-to-step-2"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Convert UWSA 2 to Step 2 CK
              </Link>
            </li>
            <li>
              <Link
                href="/cms-converter"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                CMS Form subject converter
              </Link>
            </li>
            <li>
              <Link
                href="/amboss-converter"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                AMBOSS SA → Step 2 CK converter
              </Link>
            </li>
            <li>
              <Link
                href="/blog/step-2-ck-subject-weighting-explained"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Official Step 2 CK subject weighting
              </Link>
            </li>
            <li>
              <Link
                href="/blog/most-tested-topics-step-2-ck"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Source-checked high-yield priorities
              </Link>
            </li>
            <li>
              <Link
                href="/blog/night-before-step-exam-what-to-do"
                data-indexing-context="related"
                className="underline underline-offset-2"
              >
                Official-source exam-day checklist
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Step 2 CK predictor FAQs
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
      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What will my Step 2 CK score be?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Add your recent Step 2 CK inputs. The result is an independent
            planning estimate with a model-generated range, not a guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 2 CK</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion">
                See full NBME → Step 2 CK conversion table
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
