import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Trophy } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free 120 Step 2 Score Conversion Calculator | NBMEcalc",
  description:
    "Convert Free 120 percent correct into an independent Step 2 CK score estimate. Includes a conversion table, calculator, and confidence interval.",
  keywords: [
    "free 120 step 2 score conversion",
    "step 2 free 120 score conversion",
    "free 120 score conversion",
    "free120 score converter",
    "free 120 predictor",
    "free 120 score calculator",
    "free 120 score converter step 2",
    "free 120 to step 2",
  ],
  alternates: { canonical: "https://nbmecalc.com/free-120-predictor" },
  openGraph: {
    title: "Free 120 Step 2 Score Conversion Calculator",
    description:
      "Convert Free 120 percentage into an independent Step 2 CK estimate with a confidence interval.",
    url: "https://nbmecalc.com/free-120-predictor",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "Free 120 to Step score conversion",
      },
    ],
  },
};

const conversionTable = [
  { pct: 50, step2: 217, status: "At risk" },
  { pct: 60, step2: 228, status: "Pass" },
  { pct: 65, step2: 234, status: "Pass" },
  { pct: 70, step2: 240, status: "Average" },
  { pct: 75, step2: 246, status: "Above avg" },
  { pct: 80, step2: 252, status: "Strong" },
  { pct: 85, step2: 257, status: "Competitive" },
  { pct: 90, step2: 262, status: "Top tier" },
  { pct: 95, step2: 268, status: "Elite" },
];

const faqs = [
  {
    q: "What is the Free 120 score converter for Step 2?",
    a: "It is an independent calculator that turns your Free 120 percent correct into a Step 2 CK planning estimate. It is not an official USMLE or NBME conversion table, so use the estimate together with a recent comprehensive self-assessment.",
  },
  {
    q: "How predictive is Free 120 for Step 2 CK?",
    a: "Free 120 is a useful late-stage readiness signal because its format and content outline resemble the live exam. It is still one assessment, so combine it with a recent CCSSA or UWSA and use the full predicted range.",
  },
  {
    q: "Why is Free 120 so accurate?",
    a: "Its main value is familiarity with official-style questions and timing close to test day. There is no official one-to-one percentage-to-score conversion, so the table below is an independent estimate rather than an NBME or USMLE score report.",
  },
  {
    q: "When should I take Free 120?",
    a: "Most students get the cleanest planning signal inside the final 1-2 weeks. Earlier can still be useful for pacing practice, but the score becomes less tied to test-day readiness as more study time remains.",
  },
  {
    q: "What Free 120 percentage equals a 250 Step 2 CK?",
    a: "Approximately 78-80% on Free 120 corresponds to a Step 2 CK around 250.",
  },
  {
    q: "Does Free 120 also predict Step 1?",
    a: "Yes for Step 1 candidates — there is a separate Step 1 Free 120. Use the Step 1 selector in the calculator below.",
  },
  {
    q: "Should I use an older 2019 Free 120 conversion chart?",
    a: "Older charts can be useful as rough context, but they may reflect older item sets and student samples. Prefer a current percent-correct estimate and compare it with your latest CCSSA or UWSA before making test-day decisions.",
  },
];

const forecastSteps = [
  "Use your raw percent correct, not a rounded block average if you have the total.",
  "Enter Free 120 as one input in the calculator, then add a recent CCSSA or UWSA.",
  "Compare the midpoint with the confidence interval before changing your test date.",
  "If Free 120 and your latest NBME disagree by more than 8-10 points, trust the range and investigate why.",
];

const relatedTools = [
  {
    href: "/nbme-score-conversion",
    title: "NBME score conversion",
    desc: "Convert recent CCSSA or CBSSA results and compare them with Free 120.",
  },
  {
    href: "/step-2-predictor",
    title: "Step 2 CK predictor",
    desc: "Combine NBME, UWSA, Free 120, AMBOSS, and CMS inputs in one forecast.",
  },
  {
    href: "/cms-converter",
    title: "CMS form converter",
    desc: "Use subject forms to diagnose weak rotations before a comprehensive retest.",
  },
];

export default function Free120PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free 120 Predictor",
            url: "https://nbmecalc.com/free-120-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free converter from NBME Free 120 percentage to USMLE Step prediction with confidence interval.",
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
        badge="Free 120 → Step 2 CK"
        title="Free 120 Step 2 Score Conversion Calculator"
        description="Enter your Free 120 percentage to get an independent Step 2 CK estimate and confidence interval. Use it with a recent CCSSA or UWSA rather than as a guaranteed one-to-one conversion."
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert Free 120 percent to a Step 2 CK estimate
          </h2>
          <p className="text-gray-600">
            Pick your Step exam, then choose <strong>Free 120</strong> as the
            source and enter your percentage correct.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      <section className="py-14 lg:py-16 bg-white border-b border-gray-200">
        <div className="container max-w-4xl">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                Free 120 score conversion: the quick answer
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A Free 120 score conversion is a planning estimate from
                  percent correct to a Step score range. It should answer one
                  question: does your official-style sample exam agree with
                  the rest of your practice data?
                </p>
                <p>
                  For Step 2 CK, the high-intent query is usually{" "}
                  <strong>free 120 step 2 score conversion</strong>. That
                  belongs on this calculator page, because students searching
                  it want the tool first and the caveats immediately after.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-mint-200 bg-mint-50 p-5">
              <div className="text-sm font-bold uppercase tracking-wide text-mint-800 mb-3">
                Use this page when
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                {forecastSteps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-mint-600 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Free 120 % → Step 2 CK conversion
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Independent estimate—not an official NBME or USMLE conversion.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Free 120 %</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Step 2 CK</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Match competitiveness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {conversionTable.map((row) => (
                  <tr key={row.pct}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">{row.pct}%</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">{row.step2}</td>
                    <td className="px-5 py-3 text-gray-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            * Step 1 candidates: ≥ 65% maps to ~95% pass probability. 95% CI ±4
            pts when paired with at least one NBME.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              How to use Free 120 in a score forecast
            </h2>
          </div>
          <ul className="space-y-3 text-gray-700 list-disc pl-5">
            <li>Take the version that matches the Step exam you are preparing for</li>
            <li>Use percent correct as one input, not a guaranteed final score</li>
            <li>Compare it with a recent comprehensive NBME self-assessment</li>
            <li>Investigate large disagreements between recent practice results</li>
            <li>Plan from the confidence interval rather than the midpoint alone</li>
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Related score conversion tools
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Free 120 is strongest when it agrees with another recent input.
            Use these pages to check whether your forecast is internally
            consistent.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedTools.map((tool) => (
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

      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Free 120 FAQs
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
            What does my Free 120 predict?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step score</Link>
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
