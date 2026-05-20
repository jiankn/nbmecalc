import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, Microscope } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "CMS Form Converter — Step 2 CK Subject-Level Predictor | NBMEcalc",
  description:
    "Convert your NBME Comprehensive Clinical Science Self-Assessment (CMS Form) percentage into Step 2 CK subject-level predictions. Best for finding weak rotations.",
  keywords: [
    "cms form to step",
    "cms converter",
    "comprehensive clinical science self assessment",
    "shelf exam predictor",
    "step 2 ck subject",
  ],
  alternates: { canonical: "https://nbmecalc.com/cms-converter" },
  openGraph: {
    title: "CMS Form Converter — Step 2 CK Subject-Level Predictor",
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
    a: "Comprehensive Clinical Science Self-Assessment (CMS) forms are NBME's subject-specific shelf exams: Internal Medicine, Surgery, Pediatrics, OB/GYN, Psychiatry, and Family Medicine. Each form covers one rotation.",
  },
  {
    q: "Can CMS Forms predict an overall Step 2 CK score?",
    a: "Not directly. CMS forms are subject-level only. Combine your CMS percentages with NBME 28-32 to get a calibrated overall Step 2 CK estimate.",
  },
  {
    q: "What CMS Form percentage maps to a 250 Step 2 CK?",
    a: "Roughly 70-75% across multiple CMS forms correlates with a Step 2 CK in the 245-255 range, assuming the test was taken within 4 weeks of your real exam.",
  },
  {
    q: "Are CMS Forms worth taking if I am studying for Step 2 CK directly?",
    a: "Yes if you have weak rotations to diagnose. CMS forms surface subject gaps that get masked in NBME 28-32 averages. Take CMS Surgery if your surgery rotation felt rough.",
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
        title="CMS Form Converter: Subject-Level Step 2 CK"
        description="CMS forms (shelf exams) are NBME's per-rotation self-assessments. Use them alongside your NBMEs to find weak subjects before test day."
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
              NBME 28-32 give you a <em>weighted average</em> across all
              clinical subjects. A 235 NBME 30 might hide a brutal Pediatrics
              gap because Internal Medicine is doing the heavy lifting.
            </p>
            <p>
              A targeted CMS Pediatrics form taken cold reveals exactly that
              gap. Score 55% and you know to spend 10+ hours of dedicated time
              on Peds before test day — directly improving your Step 2 CK by
              3-5 points.
            </p>
            <p>
              <strong>Recommended workflow:</strong> if your NBME 30 weakness
              map flags a subject ≤ 60%, take the matching CMS form within a
              week to confirm. If the CMS confirms the gap, schedule targeted
              study; if not, your NBME just had bad luck on that subject and
              you can re-prioritize.
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
