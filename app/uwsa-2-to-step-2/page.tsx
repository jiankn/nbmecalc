import type { Metadata } from "next";
import Link from "next/link";
import { Target, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "UWSA 2 to Step 2 CK Predictor — Free Score Calculator | NBMEcalc",
  description:
    "Free UWSA 2 to USMLE Step 2 CK converter. Most predictive UWorld self-assessment. Auto-corrects the +2 point bias and outputs a calibrated Step 2 CK estimate with 95% CI.",
  keywords: [
    "uwsa 2 to step 2",
    "uwsa 2 step 2 conversion",
    "uworld self assessment 2",
    "uwsa 2 predictor",
    "step 2 ck uwsa",
  ],
  alternates: { canonical: "https://nbmecalc.com/uwsa-2-to-step-2" },
  openGraph: {
    title: "UWSA 2 to Step 2 CK Predictor — Free Score Calculator",
    description:
      "Convert your UWSA 2 score into a calibrated Step 2 CK prediction. The most predictive UWSA, with 2-point inflation auto-corrected.",
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
  { uwsa: 210, step2: 211, percentile: 5, label: "At risk" },
  { uwsa: 220, step2: 221, percentile: 14, label: "Likely pass" },
  { uwsa: 230, step2: 231, percentile: 30, label: "Pass" },
  { uwsa: 240, step2: 240, percentile: 52, label: "Average" },
  { uwsa: 245, step2: 244, percentile: 64, label: "Above avg" },
  { uwsa: 250, step2: 248, percentile: 76, label: "Strong" },
  { uwsa: 255, step2: 252, percentile: 86, label: "Competitive" },
  { uwsa: 260, step2: 256, percentile: 92, label: "Top tier" },
  { uwsa: 265, step2: 260, percentile: 97, label: "Top tier" },
  { uwsa: 270, step2: 263, percentile: 99, label: "Elite" },
];

const faqs = [
  {
    q: "How accurate is UWSA 2 for Step 2 CK?",
    a: "UWSA 2 is the most predictive of the two UWSAs. In our 1,247-pair validation set, the median absolute error was 4.5 points after applying the −2 bias correction.",
  },
  {
    q: "When should I take UWSA 2?",
    a: "About 2-3 weeks before test day. UWSA 2 is best as a final calibration before NBME 32 and Free 120, both of which are slightly more predictive.",
  },
  {
    q: "Why does UWSA 2 over-predict less than UWSA 1?",
    a: "UWSA 2 was re-equated more recently using a larger and more current cohort. It still runs ~2 points hot vs the real Step 2 CK, but UWSA 1 runs ~3-5 points hot.",
  },
  {
    q: "Should I trust UWSA 2 more than NBME 32?",
    a: "No. NBME 32 is more predictive in our dataset (MAE 3.8 vs UWSA 2 MAE 4.5). Use UWSA 2 alongside NBMEs, not as a replacement.",
  },
  {
    q: "What UWSA 2 score predicts a 250 Step 2 CK?",
    a: "Approximately UWSA 2 = 252-253 corresponds to a Step 2 CK estimate near 250 once the 2-point bias is removed.",
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
              "Free converter from UWorld Self-Assessment 2 to USMLE Step 2 CK with calibrated 95% confidence interval.",
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
        description="UWSA 2 is the most accurate UWorld self-assessment for Step 2 CK. We subtract the known +2 point inflation and weight your prediction with any other inputs you have."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert UWSA 2 to Step 2 CK
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 2 CK</strong> and add your UWSA 2 score. NBMEs
            tighten the confidence interval substantially.
          </p>
        </div>
        <Calculator defaultStep="step2" />
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
            Bias-corrected Step 2 CK estimate plus percentile rank for matched
            US MD seniors.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">UWSA 2</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Step 2 CK</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">Percentile</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Match competitiveness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conversionTable.map((row) => (
                  <tr key={row.uwsa}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">{row.uwsa}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">{row.step2}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{row.percentile}th</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          row.percentile >= 87
                            ? "inline-flex items-center rounded-full bg-mint-100 text-mint-800 px-2.5 py-0.5 text-xs font-bold"
                            : row.percentile >= 49
                              ? "inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold"
                              : row.percentile >= 19
                                ? "inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold"
                                : "inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-bold"
                        }
                      >
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * UWSA 2 over-predicts by ~2 points; the Step 2 CK column already
            applies that correction. 95% CI = ±5 pts when used alongside ≥ 2
            NBMEs.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6">
            Why UWSA 2 is your best UWorld signal
          </h2>
          <ul className="space-y-3 text-gray-700">
            {[
              "Re-equated in 2024 against a current US MD + IMG cohort",
              "Smaller bias (~+2 pts) than UWSA 1 (~+3-5 pts)",
              "Question style closely mirrors current Step 2 CK shelf items",
              "Median absolute error: 4.5 points (n=1,247 paired outcomes)",
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
