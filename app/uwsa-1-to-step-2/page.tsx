import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { convertExam } from "@/lib/data";
import { formatPercentile, lookupPercentile } from "@/lib/usmle-norms";

const PAGE_URL = "https://nbmecalc.com/uwsa-1-to-step-2";
const title = "UWSA 1 to Step 2 CK Score Conversion: Calculator + Chart";
const description =
  "Convert a UWorld Self-Assessment 1 score for Step 2 CK into an estimated three-digit score and 2026 percentile. The model's −5 adjustment is disclosed. Free, no signup.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description: "Turn a UWSA 1 Step 2 CK score into an estimated score, range, and percentile with a disclosed model adjustment.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/images/feature-score-range.png", width: 2400, height: 1792, alt: "UWSA 1 to Step 2 CK conversion" }],
  },
};

// 直接调用计算器同一个换算函数，保证表格和计算器结果永远一致。
const chart = [200, 210, 220, 230, 240, 245, 250, 255, 260, 265, 270, 280].map((uwsa) => {
  const step2 = convertExam({ id: "chart", source: "UWSA1", score: uwsa }, "step2");
  return { uwsa, step2, pct: formatPercentile(lookupPercentile("step2ck", step2).percentile) };
});

const faqs = [
  {
    q: "Is UWSA 1 accurate for Step 2 CK?",
    a: "NBMEcalc does not publish a verified UWSA 1 error rate. UWSA 1 is usually taken earlier in preparation, so it reflects where you were at that point. Treat it as a baseline and confirm with a later CCSSA, UWSA 2, or Free 120.",
  },
  {
    q: "Why does the calculator subtract 5 points from UWSA 1?",
    a: "The model applies a disclosed −5 adjustment to UWSA 1 before aggregation (−2 for UWSA 2). It is an internal modelling assumption based on the common observation that UWorld self-assessments read higher than the real exam, not an official UWorld or USMLE offset.",
  },
  {
    q: "What UWSA 1 score do I need for a 250 on Step 2 CK?",
    a: `There is no official one-to-one conversion. In this model a UWSA 1 of 255 maps to about ${convertExam({ id: "q", source: "UWSA1", score: 255 }, "step2")}. A single early UWSA 1 should not set a target by itself.`,
  },
  {
    q: "Is this the same as UWSA 1 for Step 1?",
    a: "No. UWorld sells separate self-assessments for Step 1 and Step 2 CK. This page is for the Step 2 CK UWSA 1. For the Step 1 version, use the UWSA 1 to Step 1 page.",
  },
  {
    q: "Should I take UWSA 1 or an NBME first?",
    a: "Many students use UWSA 1 as an early baseline and save CCSSA forms and Free 120 for later checks, but there is no required order. What matters most is having more than one recent assessment before choosing a test date.",
  },
];

export default function Uwsa1ToStep2Page() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "UWSA 1 to Step 2 CK Converter",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Independent planning estimate from a UWorld Self-Assessment 1 score to a Step 2 CK range.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />

      <PageHero
        badge="UWSA 1 → Step 2 CK"
        title="UWSA 1 to Step 2 CK Score Conversion"
        description={`Enter your Step 2 CK UWSA 1 score for an estimated three-digit score and range. For example, a UWSA 1 of 250 maps to about ${convertExam({ id: "h", source: "UWSA1", score: 250 }, "step2")} in this model.`}
        size="md"
      />

      <section id="calculator" className="border-b border-gray-200 bg-mint-50/30 py-12">
        <div className="container mb-6 max-w-3xl">
          <h2 className="mb-2 text-2xl font-extrabold lg:text-3xl">Convert UWSA 1 to Step 2 CK</h2>
          <p className="text-gray-600">
            Keep <strong>Step 2 CK</strong> selected and enter your UWSA 1 score. Add a later CCSSA, UWSA 2, or Free
            120 to see whether your preparation has moved since the baseline.
          </p>
        </div>
        <Calculator defaultStep="step2" defaultSource="UWSA1" singleAssessment />
      </section>

      <section id="uwsa-1-chart" className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">UWSA 1 to Step 2 CK conversion chart</h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            Midpoints from the same model the calculator uses, with the 2026 USMLE percentile of each estimate. The
            calculator adds a range around every midpoint.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">UWSA 1 score</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Estimated Step 2 CK</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">2026 percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {chart.map((row) => (
                    <tr key={row.uwsa}>
                      <td className="px-5 py-2.5 font-bold text-gray-950">{row.uwsa}</td>
                      <td className="px-5 py-2.5 text-gray-800">{row.step2}</td>
                      <td className="px-5 py-2.5 text-gray-600">{row.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Percentiles come from the{" "}
            <Link href="/step-2-ck-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              official 2026 Step 2 CK percentile table
            </Link>
            . The adjustments are explained in the{" "}
            <Link href="/methodology" className="font-semibold text-mint-800 underline underline-offset-4">
              methodology
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">How to use a UWSA 1 result</h2>
          <div className="space-y-4 leading-relaxed text-gray-700">
            <p>
              <strong>Read it as a baseline.</strong> UWSA 1 is often taken weeks before the exam. A gap between UWSA
              1 and a later assessment usually says more about learning since then than about either test.
            </p>
            <p>
              <strong>Compare like with like.</strong> Put UWSA 1 next to UWSA 2, a CCSSA, or Free 120 in the
              calculator instead of averaging raw numbers yourself; each source gets its own adjustment and weight.
            </p>
            <p>
              <strong>Look at the range, not only the midpoint.</strong> The Step 2 CK passing score is 218. If the
              lower end of your range is near it, plan another checkpoint before committing to a date.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">UWSA 1 Step 2 CK FAQs</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-gray-950">
                  <span>{f.q}</span>
                  <span className="text-2xl leading-none text-gray-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-2xl font-extrabold">Related Step 2 CK tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/uwsa-2-to-step-2" data-indexing-context="related" className="underline underline-offset-2">
                UWSA 2 to Step 2 CK conversion
              </Link>
            </li>
            <li>
              <Link href="/nbme-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME percent correct to Step 2 CK
              </Link>
            </li>
            <li>
              <Link href="/free-120-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Free 120 to Step 2 CK conversion
              </Link>
            </li>
            <li>
              <Link href="/uwsa-1-to-step-1" data-indexing-context="related" className="underline underline-offset-2">
                UWSA 1 to Step 1 (different exam)
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
