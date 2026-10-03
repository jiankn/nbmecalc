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
} from "@/lib/usmle-norms";
import { PASS_RATES_SOURCE, firstTakerRate, getPassRates } from "@/lib/usmle-pass-rates";

const PAGE_URL = "https://nbmecalc.com/step-3-percentile";
const title = "Step 3 Percentile, Passing Score & Average Score (2026)";
const description =
  "Check any Step 3 score against the official 2026 USMLE norm table: percentile calculator, the 200 passing score, the 227 national average, and current pass rates.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description:
      "Official USMLE data for Step 3: percentile by score, passing score, average score, and first-taker pass rates.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc Step 3 percentile calculator",
      },
    ],
  },
};

const s3 = NORM_INFO.step3;
const s3Mean = s3.means[s3.means.length - 1];
const pct3 = (score: number) => formatPercentile(lookupPercentile("step3", score).percentile);
const raw3 = (score: number) => lookupPercentile("step3", score).percentile;

// Step 3 的百分位在 185–265 之间才有区分度，两端合并成一行说明。
const visibleRows = NORM_TABLE.filter(([score]) => score <= 265 && score >= 185);

const benchmarks = [210, 220, 230, 240, 250];

const s3Rates = getPassRates("Step 3");
const usMdFirst = firstTakerRate("Step 3", "us-md");
const nonUsFirst = firstTakerRate("Step 3", "non-us");

const faqs = [
  {
    q: "What is the passing score for Step 3?",
    a: `The minimum passing score for Step 3 is ${s3.passingScore} ${s3.passingNote}. It was 198 before that date. A ${s3.passingScore} sits at about the ${pct3(s3.passingScore)} percentile of first-time takers from LCME-accredited schools.`,
  },
  {
    q: "What is the average Step 3 score?",
    a: `The mean Step 3 score for first-time takers from LCME-accredited schools was ${s3Mean.mean} with a standard deviation of ${s3Mean.sd} in ${s3Mean.period}, according to the USMLE Score Interpretation Guidelines updated ${USMLE_NORMS_SOURCE.updatedLabel}.`,
  },
  {
    q: "What percentile is a 230 on Step 3?",
    a: `A 230 is at the ${pct3(230)} percentile in the current official table, meaning about ${raw3(230)}% of the reference group scored lower. A 240 is at the ${pct3(240)} percentile and a 250 is at the ${pct3(250)}.`,
  },
  {
    q: "What is a good Step 3 score?",
    a: `Passing (${s3.passingScore}) is what licensing boards require. Scoring above the national mean of ${s3Mean.mean} puts you above the middle of the U.S. reference group. Because most examinees take Step 3 during residency, the three-digit score usually matters less than for Step 2 CK, but some fellowship applications and visa-related timelines make an early pass important.`,
  },
  {
    q: "What is the Step 3 pass rate?",
    a: `In ${s3Rates.currLabel}, ${usMdFirst}% of U.S. MD first-takers and ${nonUsFirst}% of first-takers from non-U.S. schools passed Step 3, according to USMLE performance data.`,
  },
  {
    q: "Do I have to pass each day of Step 3 separately?",
    a: "No. Step 3 is a two-day exam, but USMLE reports a single three-digit score that combines both days, including the computer-based case simulations (CCS). The pass/fail decision is based on that one score.",
  },
  {
    q: "Can I compare my Step 3 score with my Step 2 CK score?",
    a: "Not directly. Both are reported on a 1–300 scale, but the exams have different reference groups, content, and passing scores. A 230 on Step 3 and a 230 on Step 2 CK land at very different percentiles.",
  },
];

export default function Step3PercentilePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 3 Percentile Calculator",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Converts a USMLE Step 3 score to a percentile rank using the official USMLE norm table.",
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
        title="Step 3 Score Percentile, Passing Score & Average"
        description={`The Step 3 passing score is ${s3.passingScore} and the national average is ${s3Mean.mean}. Type any Step 3 score to see its percentile among ${s3.n.toLocaleString("en-US")} first-time takers.`}
        size="md"
      />

      <section id="calculator" className="bg-white py-12">
        <div className="container max-w-4xl">
          <PercentileCalculator defaultStep="step3" />
        </div>
      </section>

      {/* 及格线 */}
      <section id="passing-score" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">Step 3 passing score</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            The minimum passing score for Step 3 is <strong>{s3.passingScore}</strong> {s3.passingNote}. Before
            that, it was 198. Because most first-time takers score well above the line, a {s3.passingScore} is only
            at about the {pct3(s3.passingScore)} percentile.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Passing score", value: String(s3.passingScore) },
              { label: `U.S. MD first-takers passing (${s3Rates.currLabel})`, value: `${usMdFirst}%` },
              { label: `Non-U.S. first-takers passing (${s3Rates.currLabel})`, value: `${nonUsFirst}%` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
                <p className="font-mono text-3xl font-extrabold text-gray-950">{item.value}</p>
                <p className="mt-1 text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="leading-relaxed text-gray-700">
            Step 3 is two days long, but you get one combined three-digit score; there is no separate pass line
            for each day or for the CCS cases. Pass rates come from{" "}
            <a
              href={PASS_RATES_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              USMLE performance data
            </a>{" "}
            (checked {PASS_RATES_SOURCE.checkedLabel}). See all groups and repeaters on the{" "}
            <Link href="/usmle-pass-rates" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              USMLE pass rates page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 百分位表 */}
      <section id="percentile-table" className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Step 3 percentile table (2026)
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            Official percentile ranks for Step 3 first-time takers from LCME-accredited medical schools who tested
            in calendar years 2023–2025 (N = {s3.n.toLocaleString("en-US")}). Each value is the percentage of that
            group who scored lower.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Step 3 score</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Percentile</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Vs. passing ({s3.passingScore})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="text-gray-500">
                    <td className="px-5 py-2.5">270–300</td>
                    <td className="px-5 py-2.5">100</td>
                    <td className="px-5 py-2.5">Pass</td>
                  </tr>
                  {visibleRows.map(([score, , s3P]) => (
                    <tr key={score} className={score === s3.passingScore ? "bg-mint-50" : undefined}>
                      <td className="px-5 py-2.5 font-bold text-gray-950">{score}</td>
                      <td className="px-5 py-2.5 text-gray-800">{s3P}</td>
                      <td className="px-5 py-2.5 text-gray-800">{score >= s3.passingScore ? "Pass" : "Below"}</td>
                    </tr>
                  ))}
                  <tr className="text-gray-500">
                    <td className="px-5 py-2.5">180 and below</td>
                    <td className="px-5 py-2.5">0</td>
                    <td className="px-5 py-2.5">Below</td>
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

      {/* 平均分 */}
      <section id="average-score" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">Average Step 3 score</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            The national mean for Step 3 first-time takers from LCME-accredited schools has held at{" "}
            {s3Mean.mean} (standard deviation {s3Mean.sd}) for three straight years. Roughly two-thirds of that
            group score between {s3Mean.mean - s3Mean.sd} and {s3Mean.mean + s3Mean.sd}.
          </p>
          <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Calendar year</th>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Mean Step 3 score</th>
                  <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Standard deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {s3.means.map((m) => (
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
            The standard error of measurement for Step 3 is about {s3.sem} points, so two scores a few points apart
            are not meaningfully different. The calculator above shows the percentile band for your score ±1 SEM.
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* 好分数 */}
      <section id="good-score" className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">What is a good Step 3 score?</h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700">
            For licensure, any score of {s3.passingScore} or higher is a pass. Beyond that, the percentile tells you
            where you stand against U.S. first-time takers. Benchmarks from the current table:
          </p>
          <ul className="mb-6 grid gap-3 sm:grid-cols-2">
            {benchmarks.map((score) => (
              <li key={score} className="rounded-2xl border border-gray-200 bg-mint-50/30 px-5 py-4">
                <span className="font-mono text-2xl font-extrabold text-gray-950">{score}</span>
                <span className="ml-2 text-gray-700">= {pct3(score)} percentile</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed text-gray-700">
            Most examinees take Step 3 during residency, so program directors weigh it less than Step 2 CK. It
            still appears on your USMLE transcript, and some fellowship programs look at it. Passing on the first
            attempt matters most, because every attempt is reported.
          </p>
        </div>
      </section>

      {/* 解读要点 */}
      <section className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">How to read a Step 3 percentile</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                h: "It compares you with U.S. first-takers",
                p: "The reference group is first-time takers from LCME-accredited schools. It is not an IMG-only or DO-only ranking.",
              },
              {
                h: "The table is updated every year",
                p: "USMLE rolls the three-year window forward annually, so a score can shift a point or two in percentile. This page uses the table updated August 2026.",
              },
              {
                h: "Scores between rows are estimates",
                p: "The official table lists every fifth score. For scores in between, the calculator interpolates and labels the result as an estimate.",
              },
              {
                h: "Step 3 is not Step 2 CK",
                p: "The two exams share a 1–300 scale but not a reference group or passing score, so the same number means different things.",
              },
            ].map((item) => (
              <div key={item.h} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{item.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Passing standards are listed on the{" "}
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

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">Step 3 score FAQs</h2>
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
          <h2 className="mb-4 text-2xl font-extrabold">More Step 3 tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/step-3-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 3 score predictor (CCMSA forms 6, 7, 8)
              </Link>
            </li>
            <li>
              <Link href="/usmle-score-release-dates" data-indexing-context="related" className="underline underline-offset-2">
                When will my Step 3 score come out?
              </Link>
            </li>
            <li>
              <Link href="/blog/step-3-ccs-cases-complete-walkthrough" data-indexing-context="related" className="underline underline-offset-2">
                Step 3 CCS cases walkthrough
              </Link>
            </li>
            <li>
              <Link href="/step-2-ck-percentile" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK percentile calculator
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
