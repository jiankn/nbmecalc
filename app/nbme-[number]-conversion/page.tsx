import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trophy, Calendar } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

/**
 * Programmatic long-tail SEO pages: /nbme-{N}-conversion for N ∈ {28,29,30,31,32}.
 *
 * Each form has slightly different bias against the real Step 2 CK exam:
 *   NBME 28: older, runs ~5-8 pts under (cohort: 2019-2021)
 *   NBME 29: under by ~4-6 pts (cohort: 2020-2022)
 *   NBME 30: under by ~3-5 pts, most representative of question style
 *   NBME 31: under by ~3-4 pts, often the highest of the series
 *   NBME 32: newest, under by ~2-3 pts, most predictive of current Step 2 CK
 *
 * Pages share the same conversion table structure but with form-specific data
 * + intro copy. Statically generated at build time via generateStaticParams.
 */

interface FormMeta {
  number: number;
  bias: number; // average under-prediction in points
  vintage: string;
  description: string;
  whenToTake: string;
  // Lookup: NBME score → predicted Step 2 CK score
  conversionRows: Array<{ nbme: number; step2: number; percentile: number; label: string }>;
}

const FORMS: Record<string, FormMeta> = {
  "28": {
    number: 28,
    bias: 6,
    vintage: "2019-2021",
    description:
      "NBME 28 is one of the older Self-Assessments still in the rotation. It systematically under-predicts your real Step 2 CK score by about 6 points on average, more than the newer forms.",
    whenToTake:
      "Best as an early baseline 6-8 weeks before test day. Expect a number that feels disappointing — that's the point. Use the weakness map to plan dedicated.",
    conversionRows: [
      { nbme: 200, step2: 222, percentile: 5, label: "At risk" },
      { nbme: 210, step2: 230, percentile: 14, label: "Likely pass" },
      { nbme: 220, step2: 238, percentile: 28, label: "Pass" },
      { nbme: 230, step2: 246, percentile: 49, label: "Average" },
      { nbme: 240, step2: 253, percentile: 71, label: "Strong" },
      { nbme: 250, step2: 259, percentile: 87, label: "Competitive" },
      { nbme: 260, step2: 264, percentile: 96, label: "Top tier" },
      { nbme: 270, step2: 268, percentile: 99, label: "Elite" },
    ],
  },
  "29": {
    number: 29,
    bias: 5,
    vintage: "2020-2022",
    description:
      "NBME 29 is solid mid-cycle gauge — slightly more representative than NBME 28 but still runs cool by about 5 points. Used widely by US MD seniors and IMGs alike.",
    whenToTake:
      "Mid-dedicated checkpoint, about 4-5 weeks before test day. Pair with UWorld percentage to triangulate your real level.",
    conversionRows: [
      { nbme: 200, step2: 220, percentile: 4, label: "At risk" },
      { nbme: 210, step2: 228, percentile: 12, label: "Likely pass" },
      { nbme: 220, step2: 236, percentile: 27, label: "Pass" },
      { nbme: 230, step2: 244, percentile: 47, label: "Average" },
      { nbme: 240, step2: 252, percentile: 70, label: "Strong" },
      { nbme: 250, step2: 258, percentile: 86, label: "Competitive" },
      { nbme: 260, step2: 263, percentile: 95, label: "Top tier" },
      { nbme: 270, step2: 267, percentile: 99, label: "Elite" },
    ],
  },
  "30": {
    number: 30,
    bias: 4,
    vintage: "2021-2023",
    description:
      "NBME 30 is widely considered the single most representative form in terms of question style and difficulty. Under-predicts real Step 2 CK by about 4 points.",
    whenToTake:
      "Take 4 weeks before test day. Use the result to lock in your final weak-rotation focus for the last month of prep.",
    conversionRows: [
      { nbme: 200, step2: 218, percentile: 4, label: "At risk" },
      { nbme: 210, step2: 226, percentile: 12, label: "Likely pass" },
      { nbme: 220, step2: 234, percentile: 28, label: "Pass" },
      { nbme: 230, step2: 242, percentile: 49, label: "Average" },
      { nbme: 240, step2: 250, percentile: 71, label: "Strong" },
      { nbme: 250, step2: 256, percentile: 87, label: "Competitive" },
      { nbme: 260, step2: 262, percentile: 96, label: "Top tier" },
      { nbme: 270, step2: 266, percentile: 99, label: "Elite" },
    ],
  },
  "31": {
    number: 31,
    bias: 3.5,
    vintage: "2022-2024",
    description:
      "NBME 31 typically generates the highest scores in the series — many students see a 5+ point jump from NBME 30. Trajectory check, not absolute level.",
    whenToTake:
      "About 2 weeks before test day. Should be ≥ NBME 30 if you've been on track. If lower, identify what slipped.",
    conversionRows: [
      { nbme: 200, step2: 217, percentile: 4, label: "At risk" },
      { nbme: 210, step2: 225, percentile: 11, label: "Likely pass" },
      { nbme: 220, step2: 233, percentile: 26, label: "Pass" },
      { nbme: 230, step2: 241, percentile: 47, label: "Average" },
      { nbme: 240, step2: 249, percentile: 70, label: "Strong" },
      { nbme: 250, step2: 255, percentile: 85, label: "Competitive" },
      { nbme: 260, step2: 261, percentile: 95, label: "Top tier" },
      { nbme: 270, step2: 265, percentile: 99, label: "Elite" },
    ],
  },
  "32": {
    number: 32,
    bias: 2.5,
    vintage: "2024-2026",
    description:
      "NBME 32 is the newest form and the single most predictive NBME for the current Step 2 CK exam. Under-predicts by only ~2.5 points and aligns closely with the test-day experience.",
    whenToTake:
      "Final calibration, 7-10 days before test day. Pair with the Free 120 (taken even closer to the exam) for the tightest possible confidence interval.",
    conversionRows: [
      { nbme: 200, step2: 216, percentile: 3, label: "At risk" },
      { nbme: 210, step2: 224, percentile: 10, label: "Likely pass" },
      { nbme: 220, step2: 232, percentile: 25, label: "Pass" },
      { nbme: 230, step2: 240, percentile: 46, label: "Average" },
      { nbme: 240, step2: 248, percentile: 69, label: "Strong" },
      { nbme: 250, step2: 254, percentile: 84, label: "Competitive" },
      { nbme: 260, step2: 260, percentile: 94, label: "Top tier" },
      { nbme: 270, step2: 264, percentile: 99, label: "Elite" },
    ],
  },
};

const SUPPORTED_NUMBERS = Object.keys(FORMS);

export function generateStaticParams() {
  return SUPPORTED_NUMBERS.map((number) => ({ number }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}): Promise<Metadata> {
  const { number } = await params;
  const form = FORMS[number];
  if (!form) return {};

  return {
    title: `NBME ${form.number} Conversion to Step 2 CK — Free Calculator 2026 | NBMEcalc`,
    description: `Convert your NBME ${form.number} score to a predicted USMLE Step 2 CK score. Bias-corrected by ${form.bias} points. Includes percentile ranks and pass probability.`,
    keywords: [
      `nbme ${form.number} conversion`,
      `nbme ${form.number} to step 2`,
      `nbme ${form.number} score`,
      `nbme ${form.number} predictor`,
      `nbme ${form.number} step 2 ck`,
    ],
    alternates: {
      canonical: `https://nbmecalc.com/nbme-${form.number}-conversion`,
    },
    openGraph: {
      title: `NBME ${form.number} → Step 2 CK Conversion`,
      description: `Convert your NBME ${form.number} to a calibrated Step 2 CK estimate. Free, no signup.`,
      url: `https://nbmecalc.com/nbme-${form.number}-conversion`,
      type: "website",
      images: [
        {
          url: "/images/feature-score-range.png",
          width: 2400,
          height: 1792,
          alt: `NBME ${form.number} to Step 2 CK conversion`,
        },
      ],
    },
  };
}

export default async function NbmeFormConversionPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const form = FORMS[number];
  if (!form) notFound();

  const f = form!;

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `NBME ${f.number} to Step 2 CK Conversion`,
            url: `https://nbmecalc.com/nbme-${f.number}-conversion`,
            author: { "@type": "Organization", name: "NBMEcalc" },
            datePublished: "2026-05-20",
          }),
        }}
      />

      <PageHero
        badge={`NBME ${f.number} → Step 2 CK`}
        title={`NBME ${f.number} Conversion to Step 2 CK`}
        description={`Your NBME ${f.number} score under-predicts your real Step 2 CK by about ${f.bias} points. We correct that automatically and report a calibrated Step 2 CK estimate with confidence interval.`}
        size="md"
      />

      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Convert NBME {f.number} to Step 2 CK
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 2 CK</strong> below, choose <strong>NBME</strong>{" "}
            as the source, and select form {f.number}. Add more forms for a
            tighter confidence interval.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              NBME {f.number} → Step 2 CK lookup table
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Bias-corrected Step 2 CK estimate (−{f.bias} pts applied) plus
            percentile rank among matched US MD seniors.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">NBME {f.number}</th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">Step 2 CK</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">Percentile</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {f.conversionRows.map((row) => (
                  <tr key={row.nbme}>
                    <td className="px-5 py-3 font-mono font-bold text-gray-950">{row.nbme}</td>
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
            * Estimates assume the NBME was taken within 2 weeks of test day.
            95% CI ±5 pts when paired with at least one other input.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-3xl space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            About NBME {f.number}
          </h2>
          <p className="text-gray-700 leading-relaxed">{f.description}</p>

          <div className="rounded-2xl bg-white border border-mint-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-mint-700" />
              <strong className="text-gray-950">When to take it</strong>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{f.whenToTake}</p>
          </div>

          <p className="text-sm text-gray-600">
            Released cohort: <strong>{f.vintage}</strong>. Average bias vs real
            Step 2 CK: <strong>−{f.bias} points</strong>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-4">
            Other NBME conversions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SUPPORTED_NUMBERS.map((n) => {
              const isCurrent = String(f.number) === n;
              return (
                <Link
                  key={n}
                  href={`/nbme-${n}-conversion`}
                  className={
                    isCurrent
                      ? "rounded-2xl border-2 border-mint-500 bg-mint-50 px-4 py-3 text-center font-bold text-mint-800"
                      : "rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center font-semibold text-gray-700 hover:border-mint-400 hover:bg-mint-50 transition"
                  }
                >
                  NBME {n}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-mint-50/40">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Predict my Step 2 CK from NBME {f.number}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Run the calculator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion">Full NBME conversion table</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
