import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, Microscope } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CMS Form Score Conversion & NBME Forms Guide | NBMEcalc",
  description:
    "Convert CMS form percentages into an independent subject-level estimate. Learn how NBME Clinical Science Mastery Series forms support Step 2 CK preparation.",
  keywords: [
    "cms form score conversion",
    "cms score conversion",
    "nbme cms forms",
    "cms exams",
    "cms form to step",
    "cms converter",
    "clinical science mastery series",
    "shelf exam predictor",
  ],
  alternates: { canonical: "https://nbmecalc.com/cms-converter" },
  openGraph: {
    title: "CMS Form Score Conversion & NBME Forms Guide",
    description:
      "Free converter from NBME CMS subject forms (shelf exams) to Step 2 CK subject estimates. Identify weak rotations before test day.",
    url: "https://nbmecalc.com/cms-converter",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "CMS Form to Step 2 CK conversion",
      },
    ],
  },
};

const subjectMapping = [
  { subject: "Internal Medicine", strongPct: 75, avgPct: 67, weakPct: 58 },
  { subject: "Surgery", strongPct: 73, avgPct: 65, weakPct: 56 },
  { subject: "Pediatrics", strongPct: 74, avgPct: 66, weakPct: 57 },
  { subject: "OB/GYN", strongPct: 72, avgPct: 64, weakPct: 55 },
  { subject: "Psychiatry", strongPct: 76, avgPct: 68, weakPct: 60 },
  { subject: "Family Medicine", strongPct: 73, avgPct: 65, weakPct: 56 },
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
    q: "What CMS Form percentage maps to a 250 Step 2 CK?",
    a: "Roughly 70-75% across multiple CMS forms correlates with a Step 2 CK in the 245-255 range, assuming the test was taken within 4 weeks of your real exam.",
  },
  {
    q: "Are CMS Forms worth taking if I am studying for Step 2 CK directly?",
    a: "They can help investigate a suspected weak subject. Choose the matching subject form, review the official performance feedback, and use the result to guide targeted study rather than treating it as a direct Step 2 CK score.",
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
            "@type": "WebApplication",
            name: "CMS Form Converter",
            url: "https://nbmecalc.com/cms-converter",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free converter from NBME CMS subject form percentages to Step 2 CK subject estimates.",
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
        badge="CMS subject forms → Step 2 CK"
        title="CMS Form Score Conversion and NBME Forms Guide"
        description="Use Clinical Science Mastery Series results to investigate subject-level strengths and weaknesses. The calculator provides an independent estimate, not an official Step 2 CK conversion."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert CMS Form % to Step 2 CK
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 2 CK</strong> and choose <strong>CMS Form</strong>{" "}
            as the source. Best paired with multiple inputs.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              CMS Form % bands by subject
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Approximate percentile bands for matched US MD seniors taking each
            CMS form within 4 weeks of Step 2 CK.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">CMS subject</th>
                  <th className="text-right px-5 py-3 font-bold text-rose-700">Weak (≤ 58%)</th>
                  <th className="text-right px-5 py-3 font-bold text-amber-700">Average</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Strong (≥ 73%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subjectMapping.map((row) => (
                  <tr key={row.subject}>
                    <td className="px-5 py-3 font-medium text-gray-900">{row.subject}</td>
                    <td className="px-5 py-3 text-right text-gray-700">≤ {row.weakPct}%</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.weakPct + 1}-{row.strongPct - 1}%</td>
                    <td className="px-5 py-3 text-right font-bold text-mint-700">≥ {row.strongPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <strong>Recommended workflow:</strong> start with the content
              areas in your official comprehensive score report, choose the
              matching CMS subject, review the explanations, and then confirm
              progress with a fresh comprehensive assessment.
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

      <section className="py-16 bg-mint-50/40">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Find your weak rotation in 5 minutes
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Convert my CMS scores</Link>
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
