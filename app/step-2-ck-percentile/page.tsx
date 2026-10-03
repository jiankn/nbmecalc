import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { PercentileCalculator } from "@/components/percentile-calculator";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  NORM_INFO,
  NORM_TABLE,
  USMLE_NORMS_SOURCE,
  USMLE_SCORING_URL,
  formatPercentile,
  lookupPercentile,
  summarizeScore,
} from "@/lib/usmle-norms";
import { SPECIALTY_STEP2, countAtOrAboveMedian } from "@/lib/nrmp-step2-specialty";

const PAGE_URL = "https://nbmecalc.com/step-2-ck-percentile";
const title = "Step 2 CK Percentile Calculator: 2026 USMLE Score Table";
const description =
  "Convert a Step 2 CK or Step 3 score to a percentile with the official USMLE norm table updated August 2026. Includes average scores, passing standard, and score range.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description:
      "Official 2026 USMLE norm table as a calculator: see where a Step 2 CK or Step 3 score ranks among first-time takers.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc Step 2 CK percentile calculator",
      },
    ],
  },
};

const ck = NORM_INFO.step2ck;
const s3 = NORM_INFO.step3;
const ckMean = ck.means[ck.means.length - 1];
const s3Mean = s3.means[s3.means.length - 1];
const pct = (score: number) => formatPercentile(lookupPercentile("step2ck", score).percentile);
const pct3 = (score: number) => formatPercentile(lookupPercentile("step3", score).percentile);

// 表格只展示有区分度的区间，两端全是 0 / 100 的行合并成一行说明。
const visibleRows = NORM_TABLE.filter(([score]) => score <= 280 && score >= 190);

const ckBenchmarks = [230, 240, 250, 260, 270];
const scoreCards = [230, 235, 240, 245, 250, 255, 260, 265, 270];

const faqs = [
  {
    q: "What percentile is a 250 on Step 2 CK?",
    a: `A 250 is at the ${pct(250)} percentile in the official USMLE norm table updated ${USMLE_NORMS_SOURCE.updatedLabel}. That means about ${lookupPercentile("step2ck", 250).percentile}% of first-time takers from LCME-accredited schools scored lower.`,
  },
  {
    q: "What percentile is a 260 or 270 on Step 2 CK?",
    a: `A 260 is at the ${pct(260)} percentile and a 270 is at the ${pct(270)} percentile. Scores of 280 and above round to the 100th percentile in the official table, which means more than 99% of the reference group scored lower.`,
  },
  {
    q: "What is the average Step 2 CK score?",
    a: `The mean for first-time takers from LCME-accredited schools was ${ckMean.mean} (standard deviation ${ckMean.sd}) in the ${ckMean.period} academic year, according to the USMLE Score Interpretation Guidelines.`,
  },
  {
    q: "What is the Step 2 CK passing score?",
    a: `The current minimum passing score is ${ck.passingScore} ${ck.passingNote}. A score of ${ck.passingScore} falls at about the ${pct(ck.passingScore)} percentile of the reference group, which is why a passing score can still be a low percentile.`,
  },
  {
    q: "Are Step 2 CK percentiles the same for IMGs?",
    a: "No separate IMG percentile is published in this table. The official norm table describes first-time takers from LCME-accredited (U.S.) medical schools, so an IMG's percentile here compares their score with that U.S. reference group, not with other IMGs.",
  },
  {
    q: "Why did my percentile change from last year?",
    a: "USMLE updates the norm table annually by dropping the oldest examinee group and adding the newest one. The same three-digit score can therefore map to a slightly different percentile from year to year. Always use the most recent official table.",
  },
  {
    q: "What is the Step 3 average score and percentile?",
    a: `The Step 3 mean was ${s3Mean.mean} (SD ${s3Mean.sd}) in ${s3Mean.period}. A 230 on Step 3 is at the ${pct3(230)} percentile, and the current passing score is ${s3.passingScore}. Step 2 CK and Step 3 scores are not comparable to each other.`,
  },
];

export default function Step2CkPercentilePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 2 CK Percentile Calculator",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Converts a USMLE Step 2 CK or Step 3 score to a percentile rank using the official USMLE norm table.",
            dateModified: USMLE_NORMS_SOURCE.updated,
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
        badge={`Official USMLE data · updated ${USMLE_NORMS_SOURCE.updatedLabel}`}
        title="Step 2 CK Score Percentile Calculator (2026 Table)"
        description={`Type a Step 2 CK or Step 3 score and see its percentile among ${ck.n.toLocaleString("en-US")} first-time takers. A 240 is the ${pct(240)} percentile, a 250 is the ${pct(250)}, and a 260 is the ${pct(260)}.`}
        size="md"
      />

      <section id="calculator" className="bg-white py-12">
        <div className="container max-w-4xl">
          <PercentileCalculator />
        </div>
      </section>

      {/* 官方百分位表 */}
      <section id="percentile-table" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            USMLE Step 2 CK score percentiles (2026 norm table)
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            These are the official percentile ranks for first-time takers from LCME-accredited medical schools:
            Step 2 CK examinees who tested July 1, 2023 – June 30, 2026 (N = {ck.n.toLocaleString("en-US")}) and
            Step 3 examinees who tested in calendar years 2023–2025 (N = {s3.n.toLocaleString("en-US")}). Each
            value is the percentage of that group who scored lower.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">USMLE score</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Step 2 CK percentile</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Step 3 percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="text-gray-500">
                    <td className="px-5 py-2.5">285–300</td>
                    <td className="px-5 py-2.5">100</td>
                    <td className="px-5 py-2.5">100</td>
                  </tr>
                  {visibleRows.map(([score, ckP, s3P]) => (
                    <tr key={score}>
                      <td className="px-5 py-2.5 font-bold text-gray-950">{score}</td>
                      <td className="px-5 py-2.5 text-gray-800">{ckP}</td>
                      <td className="px-5 py-2.5 text-gray-800">{s3P}</td>
                    </tr>
                  ))}
                  <tr className="text-gray-500">
                    <td className="px-5 py-2.5">185 and below</td>
                    <td className="px-5 py-2.5">0</td>
                    <td className="px-5 py-2.5">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Source:{" "}
            <a
              href={USMLE_NORMS_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {USMLE_NORMS_SOURCE.title}
            </a>
            , Table 2, updated {USMLE_NORMS_SOURCE.updatedLabel}. Values of 100 and 0 are rounded; they mean
            &ldquo;above 99%&rdquo; and &ldquo;below 1%.&rdquo;
          </p>
        </div>
      </section>

      {/* 按具体分数 */}
      <section id="by-score" className="bg-white py-16 lg:py-20">
        <div className="container max-w-5xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Step 2 CK percentile by score: 230 to 270
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-700">
            The scores people ask about most, read from the {USMLE_NORMS_SOURCE.updatedLabel} table. The last line
            of each card counts the {SPECIALTY_STEP2.length} specialties in NRMP&apos;s 2026 data where that score is at
            or above the median of matched U.S. MD seniors.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreCards.map((score) => {
              const r = summarizeScore("step2ck", score);
              return (
                <div key={score} id={`score-${score}`} className="scroll-mt-24 rounded-3xl border border-gray-200 bg-mint-50/30 p-6">
                  <h3 className="font-bold text-gray-950">What percentile is a {score} on Step 2 CK?</h3>
                  <p className="mt-2 font-mono text-3xl font-extrabold text-gray-950">{formatPercentile(r.percentile)}</p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    <li>
                      {r.pointsVsMean === 0
                        ? `Equal to the national mean (${ckMean.mean})`
                        : `${Math.abs(r.pointsVsMean)} points ${r.pointsVsMean > 0 ? "above" : "below"} the national mean (${ckMean.mean})`}
                    </li>
                    <li>
                      {r.pointsVsPassing} points above passing ({ck.passingScore})
                    </li>
                    <li>
                      ±1 SEM band ({r.semRange[0]}–{r.semRange[1]}): {formatPercentile(r.semLow)} to {formatPercentile(r.semHigh)}
                    </li>
                    <li>
                      At or above the matched median in {countAtOrAboveMedian(score)} of {SPECIALTY_STEP2.length} specialties
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-gray-700">
            See where your score sits for each specialty on the{" "}
            <Link href="/step-2-score-by-specialty" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK score by specialty
            </Link>{" "}
            page.
          </p>
        </div>
      </section>

      {/* 平均分与分数范围 */}
      <section id="average-score" className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Average Step 2 CK score and score range
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            Step 2 CK is reported on a 1–300 scale. The national mean for first-time takers from LCME-accredited
            schools is {ckMean.mean} with a standard deviation of {ckMean.sd}, so roughly two-thirds of that group
            score between {ckMean.mean - ckMean.sd} and {ckMean.mean + ckMean.sd}. The minimum passing score is{" "}
            {ck.passingScore}.
          </p>
          <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Academic year</th>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Mean Step 2 CK score</th>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Standard deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ck.means.map((m) => (
                  <tr key={m.period}>
                    <td className="px-5 py-3 font-bold text-gray-950">{m.period}</td>
                    <td className="px-5 py-3 font-mono text-gray-800">{m.mean}</td>
                    <td className="px-5 py-3 font-mono text-gray-800">{m.sd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed text-gray-700">
            Beginning with the 2025–2026 academic year, USMLE removed Canadian schools from this reference group.
            Scores are equated across forms, but USMLE advises against comparing individual scores taken more than
            three to four years apart because content and format evolve.
          </p>
        </div>
      </section>

      {/* 什么算好分数 */}
      <section id="good-score" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            What is a good Step 2 CK score?
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            &ldquo;Good&rdquo; depends on your goal. Passing requires {ck.passingScore}. For residency applications,
            programs compare you with other applicants, so the percentile is often more useful than the raw score.
            These benchmarks come straight from the current official table:
          </p>
          <ul className="mb-6 grid gap-3 sm:grid-cols-2">
            {ckBenchmarks.map((score) => (
              <li key={score} className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
                <span className="font-mono text-2xl font-extrabold text-gray-950">{score}</span>
                <span className="ml-2 text-gray-700">= {pct(score)} percentile</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed text-gray-700">
            Specialty expectations differ and change every Match cycle. Compare your score with matched and
            unmatched U.S. MD seniors in 23 specialties on the{" "}
            <Link href="/step-2-score-by-specialty" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK score by specialty
            </Link>{" "}
            page, built from NRMP&apos;s 2026 Charting Outcomes report. USMLE itself cautions that small score
            differences alone should not drive selection decisions.
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* Step 3 */}
      <section id="step-3-percentile" className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Step 3 percentiles, average score, and passing score
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            The same official table covers Step 3. The Step 3 mean was {s3Mean.mean} (SD {s3Mean.sd}) in each of
            the last three calendar years, and the minimum passing score is {s3.passingScore} {s3.passingNote}.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            A 220 on Step 3 is at the {pct3(220)} percentile, a 230 at the {pct3(230)}, and a 240 at the{" "}
            {pct3(240)}. Switch the calculator above to <strong>Step 3</strong> to check any other score, or see the
            full{" "}
            <Link href="/step-3-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 3 percentile table, passing score, and pass rates
            </Link>
            .
          </p>
          <p className="leading-relaxed text-gray-700">
            Step 2 CK and Step 3 share a 1–300 scale but are not comparable: a 220 on Step 2 CK is not equivalent
            to a 220 on Step 3. Current passing standards are listed on the{" "}
            <a
              href={USMLE_SCORING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              USMLE examination results and scoring page
            </a>
            .
          </p>
        </div>
      </section>

      {/* 正确解读 */}
      <section className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">
            How to read a USMLE percentile correctly
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                h: "It is a U.S. reference group",
                p: "Percentiles compare a score with first-time takers from LCME-accredited schools. They are not IMG-only or DO-only rankings.",
              },
              {
                h: "The table changes every year",
                p: "USMLE rolls the three-year window forward annually, so the same score can shift a point or two. This page uses the table updated August 2026.",
              },
              {
                h: "Scores have measurement error",
                p: `The standard error of measurement is about ${ck.sem} points for Step 2 CK and ${s3.sem} for Step 3. The calculator shows the percentile band for your score ± 1 SEM.`,
              },
              {
                h: "In-between scores are estimates",
                p: "The official table lists every fifth score. For scores in between, the calculator interpolates linearly and labels the result as an estimate.",
              },
            ].map((item) => (
              <div key={item.h} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{item.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            Step 2 CK percentile FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
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

      {/* 相关工具 */}
      <section className="border-t border-gray-200 bg-white py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-2xl font-extrabold">Estimate the score first</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/step-2-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK score predictor
              </Link>
            </li>
            <li>
              <Link href="/free-120-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Free 120 to Step 2 CK score conversion
              </Link>
            </li>
            <li>
              <Link href="/nbme-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME score conversion (CCSSA)
              </Link>
            </li>
            <li>
              <Link href="/step-3-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 3 score predictor
              </Link>
            </li>
            <li>
              <Link href="/usmle-score-release-dates" data-indexing-context="related" className="underline underline-offset-2">
                When will my Step 2 CK score come out?
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
