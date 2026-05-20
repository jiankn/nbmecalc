import type { Metadata } from "next";
import Link from "next/link";
import { TrendingDown, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AMBOSS to Step 2 CK Converter — Free Score Calculator | NBMEcalc",
  description:
    "Convert your AMBOSS Self-Assessment score into a Step 2 CK prediction. Auto-corrects AMBOSS's known +5 point inflation with calibrated 95% confidence interval.",
  keywords: [
    "amboss to step",
    "amboss to step 2",
    "amboss self assessment",
    "amboss converter",
    "amboss step 2 prediction",
  ],
  alternates: { canonical: "https://nbmecalc.com/amboss-converter" },
  openGraph: {
    title: "AMBOSS to Step 2 CK Converter — Free Score Calculator",
    description:
      "Free converter from AMBOSS Self-Assessment to Step 2 CK with bias correction and 95% confidence interval.",
    url: "https://nbmecalc.com/amboss-converter",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "AMBOSS to Step 2 CK conversion",
      },
    ],
  },
};

const conversionTable = [
  { amboss: 200, step2: 211, status: "At risk" },
  { amboss: 215, step2: 220, status: "Likely pass" },
  { amboss: 230, step2: 230, status: "Pass" },
  { amboss: 245, step2: 240, status: "Average" },
  { amboss: 255, step2: 246, status: "Above avg" },
  { amboss: 265, step2: 252, status: "Strong" },
  { amboss: 275, step2: 257, status: "Competitive" },
  { amboss: 285, step2: 262, status: "Top tier" },
];

const faqs = [
  {
    q: "How accurate is AMBOSS Self-Assessment for Step 2 CK?",
    a: "Less accurate than NBMEs or UWSAs. AMBOSS over-predicts by ~5 points on average. Our converter applies a −5 bias correction.",
  },
  {
    q: "Why does AMBOSS over-predict?",
    a: "AMBOSS questions skew slightly easier and the cohort sample skews toward heavy AMBOSS users (a self-selected high-effort group). Both inflate the equated score.",
  },
  {
    q: "Should I take AMBOSS Self-Assessment if I have NBMEs?",
    a: "Lower priority. Use AMBOSS as a content review tool; rely on NBMEs and Free 120 for prediction.",
  },
  {
    q: "What AMBOSS score predicts a 250 Step 2 CK?",
    a: "Approximately AMBOSS 263-265 corresponds to a real Step 2 CK estimate around 250 after applying the −5 bias correction.",
  },
];

export default function AmbossConverterPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AMBOSS to Step 2 CK Converter",
            url: "https://nbmecalc.com/amboss-converter",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free converter from AMBOSS Self-Assessment score to USMLE Step 2 CK prediction with bias correction.",
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
        badge="AMBOSS → Step 2 CK"
        title="AMBOSS to Step 2 CK Converter"
        description="AMBOSS Self-Assessment runs hot — about 5 points above your real Step 2 CK on average. We correct that automatically and report a calibrated prediction with confidence interval."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert AMBOSS to Step 2 CK
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 2 CK</strong> and choose <strong>AMBOSS</strong>{" "}
            as the source. Adding NBMEs is highly recommended.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-amber-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              AMBOSS → Step 2 CK conversion
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            All Step 2 CK estimates already have the −5 point bias correction
            applied.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">AMBOSS SA</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Step 2 CK (corrected)</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conversionTable.map((row) => (
                  <tr key={row.amboss}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">{row.amboss}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">{row.step2}</td>
                    <td className="px-5 py-3 text-gray-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> AMBOSS validation set is smaller (n=312
              vs NBME n=1,247). Confidence intervals are wider when AMBOSS is
              your only input. Pair with at least one NBME for tight prediction.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            AMBOSS → Step 2 CK FAQs
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

      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What does my AMBOSS score really mean?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Convert my AMBOSS score</Link>
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
