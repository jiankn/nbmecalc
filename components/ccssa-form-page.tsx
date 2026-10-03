import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { NbmePercentConverter } from "@/components/nbme-percent-converter";
import { Calculator } from "@/components/sections/calculator";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  CCSSA_FORMS,
  CCSSA_QUESTIONS,
  REPORT_SCORE_PRECISION,
  estimateStep2FromPercent,
  type CcssaForm,
} from "@/lib/nbme-percent-model";
import { NORM_INFO, formatPercentile, lookupPercentile } from "@/lib/usmle-norms";

/**
 * CCSSA 单表单页的共用模板。
 * 只给有真实差异内容的表单建页（目前 15、16），13/14 等没有官方独有信息的表单继续由
 * /nbme-score-conversion 的锚点小节承接，避免做成只换数字的重复页。
 */

export type CcssaFormFacts = {
  form: CcssaForm;
  /** 页面开头的一句话定位。 */
  lede: string;
  /** "这套卷在序列里的位置"小节的正文段落。 */
  position: string[];
  faqs: { q: string; a: string }[];
};

const TABLE_PERCENTS = [60, 64, 68, 70, 72, 74, 76, 78, 80, 84];

export function CcssaFormPage({ facts }: { facts: CcssaFormFacts }) {
  const { form } = facts;
  const url = `https://nbmecalc.com/nbme-${form}-score-conversion`;
  const ck = NORM_INFO.step2ck;
  const ex75 = estimateStep2FromPercent(75, "epc");
  const others = CCSSA_FORMS.filter((f) => f !== form);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `NBME ${form} Score Conversion for Step 2 CK`,
            url,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: `Converts an NBME CCSSA Form ${form} percent correct or Total CCSSA Score into an estimated Step 2 CK score and planning range.`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: facts.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nbmecalc.com" },
              {
                "@type": "ListItem",
                position: 2,
                name: "NBME Score Conversion",
                item: "https://nbmecalc.com/nbme-score-conversion",
              },
              { "@type": "ListItem", position: 3, name: `NBME ${form} Score Conversion`, item: url },
            ],
          }),
        }}
      />

      <PageHero
        badge={`Step 2 CK · CCSSA Form ${form}`}
        title={`NBME ${form} Score Conversion for Step 2 CK`}
        description={`${facts.lede} Form ${form} is preselected below: 75% correct is about ${ex75.midpoint}.`}
        size="md"
      />

      {/* 正确率换算 */}
      <section id="percent-converter" className="bg-white py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-2 text-2xl font-extrabold lg:text-3xl">Convert your Form {form} percent correct</h2>
          <p className="mb-6 text-gray-600">
            Use the equated percent correct from your report, or count your own correct answers out of{" "}
            {CCSSA_QUESTIONS}.
          </p>
          <NbmePercentConverter defaultForm={form} />
        </div>
      </section>

      {/* 已有三位数总分 */}
      <section id="calculator" className="border-y border-gray-200 bg-mint-50/30 py-12">
        <div className="container mb-6 max-w-4xl">
          <h2 className="mb-2 text-2xl font-extrabold lg:text-3xl">Already have your Total CCSSA Score?</h2>
          <p className="text-gray-600">
            The three-digit score on your Form {form} report is NBME&apos;s own estimate of your Step 2 CK score. Enter it
            here to keep it as the midpoint and get a planning range, or add other practice tests for a combined
            estimate.
          </p>
        </div>
        <Calculator defaultStep="step2" defaultSource="NBME" defaultFormNumber={form} singleAssessment />
      </section>

      {/* 这套卷的位置 */}
      <section id="where-it-fits" className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">Where Form {form} fits</h2>
          {facts.position.map((p) => (
            <p key={p} className="mb-4 leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-2" aria-label="CCSSA forms">
            {CCSSA_FORMS.map((f) =>
              f === form ? (
                <span key={f} className="rounded-full bg-gray-950 px-4 py-1.5 font-mono text-sm font-semibold text-white">
                  NBME {f}
                </span>
              ) : (
                <Link
                  key={f}
                  href={f === 15 || f === 16 ? `/nbme-${f}-score-conversion` : `/nbme-score-conversion#nbme-${f}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 font-mono text-sm font-semibold text-gray-900 transition hover:border-mint-500 hover:text-mint-800"
                >
                  NBME {f}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* 对照表 */}
      <section id="conversion-chart" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            NBME {form} conversion chart: percent to Step 2 CK
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            NBME equates every CCSSA form, so the same equated percent maps to the same estimate on Form {form} as on
            any other form. The likely range adds model uncertainty on top of the ±{REPORT_SCORE_PRECISION}-point range
            NBME prints on its reports, so it is wider than the report&apos;s own range.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Percent correct (EPC)</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Estimated Step 2 CK</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Likely range</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">2026 percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {TABLE_PERCENTS.map((p) => {
                    const e = estimateStep2FromPercent(p, "epc");
                    return (
                      <tr key={p}>
                        <td className="px-5 py-2.5 font-bold text-gray-950">{p}%</td>
                        <td className="px-5 py-2.5 text-gray-900">{e.midpoint}</td>
                        <td className="px-5 py-2.5 text-gray-700">
                          {e.low}–{e.high}
                        </td>
                        <td className="px-5 py-2.5 text-gray-700">
                          {formatPercentile(lookupPercentile("step2ck", e.midpoint).percentile)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Passing is {ck.passingScore} {ck.passingNote}. See the full 50–90% chart and how the curve is built on the{" "}
            <Link href="/nbme-score-conversion#how-conversion-works" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              NBME score conversion page
            </Link>
            .
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">NBME {form} FAQs</h2>
          <div className="space-y-3">
            {facts.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400"
              >
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

      {/* 相关 */}
      <section className="border-t border-gray-200 bg-white py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-2xl font-extrabold">Related tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/nbme-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME score conversion for all forms ({others[0]}–{others[others.length - 1]})
              </Link>
            </li>
            <li>
              <Link href="/step-2-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK score predictor (combine several tests)
              </Link>
            </li>
            <li>
              <Link href="/step-2-ck-percentile" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK percentile calculator
              </Link>
            </li>
            <li>
              <Link href="/nbme-calculator" data-indexing-context="related" className="underline underline-offset-2">
                NBME self-assessments: price, length, which to take
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
