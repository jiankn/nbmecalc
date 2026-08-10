import type { Metadata } from "next";
import Link from "next/link";
import { Target, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "UWSA 2 to Step 2 CK Score Conversion — Free Calculator + Chart",
  description:
    "Convert your UWSA 2 score into a 3-digit Step 2 CK estimate with a full conversion chart. Applies a disclosed -2 source adjustment. Free, no signup.",
  keywords: [
    "uwsa 2 to step 2",
    "uwsa 2 step 2 conversion",
    "uwsa 2 step 2 score conversion",
    "uwsa2 step 2",
    "uwsa step 2 score conversion",
    "uworld self assessment 2",
    "uwsa 2 predictor",
    "step 2 ck uwsa",
  ],
  alternates: { canonical: "https://nbmecalc.com/uwsa-2-to-step-2" },
  openGraph: {
    title: "UWSA 2 to Step 2 CK Score Conversion — Free Calculator + Chart",
    description:
      "Convert your UWSA 2 score into a 3-digit Step 2 CK estimate with a full conversion chart and a disclosed source adjustment.",
    url: "https://nbmecalc.com/uwsa-2-to-step-2",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "UWSA 2 to Step 2 CK conversion",
      },
    ],
  },
};

const conversionTable = [
  { uwsa: 210, step2: 211 },
  { uwsa: 220, step2: 221 },
  { uwsa: 230, step2: 231 },
  { uwsa: 240, step2: 240 },
  { uwsa: 245, step2: 244 },
  { uwsa: 250, step2: 248 },
  { uwsa: 255, step2: 252 },
  { uwsa: 260, step2: 256 },
  { uwsa: 265, step2: 260 },
  { uwsa: 270, step2: 263 },
];

const faqs = [
  {
    q: "How accurate is UWSA 2 for Step 2 CK?",
    a: "A reproducible validation dataset is not currently published for this calculator, so we do not claim a verified UWSA 2 error rate. Use UWSA 2 with another recent assessment and interpret the full range.",
  },
  {
    q: "When should I take UWSA 2?",
    a: "Use it late enough to reflect current preparation while leaving time to act on the result. Follow it with a fresh Step 2 CK CCSSA or Free 120 if your plan allows.",
  },
  {
    q: "Why does UWSA 2 over-predict less than UWSA 1?",
    a: "We do not publish evidence for a universal fixed difference. The calculator treats UWSA 1 and UWSA 2 separately as an internal modelling choice.",
  },
  {
    q: "Should I trust UWSA 2 more than an NBME CCSSA?",
    a: "Do not rank them from an unpublished accuracy table. Read the official CCSSA report first, then use UWSA 2 as another signal. Agreement across recent assessments is more useful than a fixed hierarchy.",
  },
  {
    q: "What UWSA 2 score predicts a 250 Step 2 CK?",
    a: "There is no official one-to-one UWSA 2 conversion. Enter the score as one input and compare the resulting range with a recent CCSSA or Free 120 result.",
  },
];

export default function UWSA2ToStep2Page() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UWSA 2 to Step 2 CK Predictor",
            url: "https://nbmecalc.com/uwsa-2-to-step-2",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free independent planning tool for combining UWorld Self-Assessment 2 with other USMLE Step 2 CK readiness inputs.",
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
        badge="UWSA 2 → Step 2 CK"
        title="UWSA 2 to Step 2 CK: Free Score Predictor"
        description="Use UWSA 2 as one input in an independent Step 2 CK planning estimate. The displayed adjustment is an internal model assumption, not a known universal offset."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert UWSA 2 to Step 2 CK
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 2 CK</strong> and add your UWSA 2 score. Compare
            the resulting range with a recent CCSSA or Free 120 rather than
            treating the UWSA result as a fixed conversion.
          </p>
        </div>
        <Calculator defaultStep="step2" defaultSource="UWSA2" />
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              UWSA 2 → Step 2 CK conversion table
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            The table exposes the calculator&apos;s current midpoint mapping. It
            does not provide an official percentile or residency-competitiveness label.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">UWSA 2</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Internal model midpoint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conversionTable.map((row) => (
                  <tr key={row.uwsa}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">{row.uwsa}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">{row.step2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * The table applies the calculator&apos;s −2-point internal UWSA 2
            adjustment. It is not an official or validated conversion. The
            range remains model-generated even when several recent inputs agree.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
            How the model treats UWSA 2
          </h2>
          <ul className="space-y-3 text-gray-700">
            {[
              "Source assumption is versioned in the public methodology",
              "Separate internal source treatment from UWSA 1",
              "Best interpreted beside a recent comprehensive assessment",
              "Independent estimate; no published holdout error rate",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-mint-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            UWSA 2 → Step 2 CK FAQs
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
            What does my UWSA 2 mean for Step 2 CK?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 2 CK</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">Full Step 2 CK predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
