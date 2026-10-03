import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Free120Step1Checker } from "@/components/free-120-step1-checker";
import { AdSlot } from "@/components/ads/ad-slot";
import { CBSSA_SOURCES, DEFAULT_LOW_PASS } from "@/lib/cbssa-readiness";
import {
  FREE120_DEFAULT_ITEMS,
  FREE120_SOURCES,
  FREE120_STATE_COPY,
  estimateFree120Step1,
} from "@/lib/free-120-step1";
import { firstTakerRate } from "@/lib/usmle-pass-rates";

const PAGE_URL = "https://nbmecalc.com/free-120-step-1";
const title = "Free 120 Step 1: What Your Score Means for Passing (2026)";
const description =
  "Check your Step 1 Free 120 percent against NBME's CBSSA low-pass range, with the margin of error for a 120-question test. Honest guide: what Free 120 can and cannot tell you.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description:
      "Free readiness check for the Step 1 Free 120: your percent, its margin of error, and how it compares with NBME's low-pass range.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc Free 120 Step 1 readiness check",
      },
    ],
  },
};

const tablePercents = [55, 60, 62, 65, 68, 70, 72, 75, 80];
const ex65 = estimateFree120Step1(Math.round(0.65 * FREE120_DEFAULT_ITEMS));
const nonUs = firstTakerRate("Step 1", "non-us");
const usMd = firstTakerRate("Step 1", "us-md");

const faqs = [
  {
    q: "What is a good Free 120 score for Step 1?",
    a: `There is no official cutoff. As a rough reference, NBME's CBSSA sample report draws the Step 1 low-pass range at about ${DEFAULT_LOW_PASS.low}–${DEFAULT_LOW_PASS.high}% equated percent correct. A Free 120 result whose whole margin of error sits above that band is a good sign; one that overlaps or falls below it means you should confirm readiness with a CBSSA.`,
  },
  {
    q: "What percent do you need on the Free 120 to pass Step 1?",
    a: "Neither USMLE nor NBME publishes a Free 120 passing percent. The Free 120 reports only a raw percent correct, not an equated score or a pass probability, so any single 'passing percent' you see online is an estimate, not an official number.",
  },
  {
    q: "Is the Free 120 predictive of Step 1?",
    a: "It is useful but limited. The questions come from USMLE and match the exam's style and interface, but USMLE presents them as sample questions for familiarization, not as a scored predictor. With about 120 questions, a single result also carries roughly ±4 percentage points of sampling error.",
  },
  {
    q: "How is the margin of error calculated?",
    a: `It is the standard error of a percentage measured on a fixed number of questions: the square root of p × (1 − p) ÷ n. For ${Math.round(ex65.percent)}% on ${FREE120_DEFAULT_ITEMS} questions, that is about ±${ex65.halfWidth} points. The checker shows ±1 standard error, the same "about two out of three" convention NBME uses for CBSSA score ranges.`,
  },
  {
    q: "Should I trust Free 120 or my NBME CBSSA more?",
    a: "Your CBSSA. A CBSSA has more questions, reports an equated percent correct, and prints NBME's own estimated probability of passing. Use Free 120 as a late confidence check and a rehearsal of the testing interface.",
  },
  {
    q: "Can I compare an old Free 120 with the current one?",
    a: "Not reliably. USMLE replaces sample items over time, and different sets differ in difficulty. Compare your result only with the low-pass reference and with your own CBSSA scores, not with percentages people reported on older versions.",
  },
  {
    q: "What is the Step 1 pass rate?",
    a: `In 2025, ${usMd}% of U.S. MD first-takers and ${nonUs}% of first-takers from non-U.S. schools passed Step 1, according to USMLE performance data.`,
  },
];

export default function Free120Step1Page() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free 120 Step 1 Readiness Check",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Compares a USMLE Step 1 Free 120 percent correct, with its sampling margin of error, against the NBME CBSSA low-pass range.",
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
        badge="Free readiness check · not an official conversion"
        title="Free 120 Step 1: What Does Your Score Mean?"
        description={`Enter your Step 1 Free 120 result. You get its margin of error and how it compares with the low-pass range (about ${DEFAULT_LOW_PASS.low}–${DEFAULT_LOW_PASS.high}%) on NBME's CBSSA reports.`}
        size="md"
      />

      <section id="calculator" className="bg-white py-12">
        <div className="container max-w-4xl">
          <Free120Step1Checker />
        </div>
      </section>

      {/* 什么是 Free 120 */}
      <section id="what-is-free-120" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">What is the Step 1 Free 120?</h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            &ldquo;Free 120&rdquo; is the nickname for the free Step 1 sample questions published by USMLE. USMLE
            describes the set as more than 100 sample questions, offered as a PDF and as an interactive test that
            runs in the same software as the real exam.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            Because the questions come from the exam&apos;s own developers, many students treat Free 120 as the
            closest thing to test day. But it was built for familiarization: the result is a raw percent correct,
            with no equated score and no estimated chance of passing.
          </p>
          <p className="leading-relaxed text-gray-700">
            Get the current version only from the official{" "}
            <a
              href={FREE120_SOURCES.sample.href}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {FREE120_SOURCES.sample.label}
            </a>{" "}
            page.
          </p>
        </div>
      </section>

      {/* 对照表 */}
      <section id="reference-table" className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Free 120 Step 1 percent: reference table
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            Each row shows a percent on {FREE120_DEFAULT_ITEMS} questions, its likely range (±1 standard error), and
            how that range sits against the CBSSA low-pass band of about {DEFAULT_LOW_PASS.low}–
            {DEFAULT_LOW_PASS.high}%. This is a reference, not a conversion.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Free 120 percent</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Likely range</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Vs. CBSSA low-pass band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tablePercents.map((p) => {
                    const e = estimateFree120Step1(Math.round((p / 100) * FREE120_DEFAULT_ITEMS));
                    return (
                      <tr key={p}>
                        <td className="px-5 py-2.5 font-mono font-bold text-gray-950">
                          {p}% <span className="font-normal text-gray-500">({e.correct}/{e.items})</span>
                        </td>
                        <td className="px-5 py-2.5 font-mono text-gray-800">
                          {e.likelyLow}–{e.likelyHigh}%
                        </td>
                        <td className="px-5 py-2.5 text-gray-800">{FREE120_STATE_COPY[e.state].title}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Low-pass band: approximate reading of the chart on the{" "}
            <a
              href={CBSSA_SOURCES.sample.href}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {CBSSA_SOURCES.sample.label}
            </a>
            . Free 120 percentages are raw, not equated, so the comparison is approximate.
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* 怎么用 */}
      <section id="how-to-use" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">
            How to use Free 120 in your Step 1 decision
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                h: "Make a CBSSA your main signal",
                p: "A CBSSA reports an equated percent correct and NBME's estimated probability of passing. That printed probability outranks any Free 120 result.",
              },
              {
                h: "Use Free 120 as a late check",
                p: "Taking it close to test day rehearses the real interface and timing. A result well above the reference band supports a CBSSA that already looks ready.",
              },
              {
                h: "Read the range, not the point",
                p: "With about 120 questions, a few lucky or unlucky guesses move the percent by several points. Look at where the whole green range falls.",
              },
              {
                h: "Disagreement means more data",
                p: "If Free 120 and your CBSSA point in different directions, take another CBSSA rather than picking the number you like better.",
              },
            ].map((item) => (
              <div key={item.h} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{item.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-700">
            Have a CBSSA result? Use the{" "}
            <Link href="/nbme-step-1-score-conversion" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              NBME Step 1 readiness check
            </Link>
            , which applies NBME&apos;s published guidance to your equated percent correct.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            Free 120 Step 1 FAQs
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
          <h2 className="mb-4 text-2xl font-extrabold">More Step 1 tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/nbme-step-1-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME CBSSA Step 1 readiness check
              </Link>
            </li>
            <li>
              <Link href="/uwsa-1-to-step-1" data-indexing-context="related" className="underline underline-offset-2">
                UWSA 1 for Step 1
              </Link>
            </li>
            <li>
              <Link href="/usmle-pass-rates" data-indexing-context="related" className="underline underline-offset-2">
                USMLE pass rates by Step
              </Link>
            </li>
            <li>
              <Link href="/usmle-score-release-dates" data-indexing-context="related" className="underline underline-offset-2">
                When will my Step 1 result come out?
              </Link>
            </li>
            <li>
              <Link href="/free-120-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Free 120 for Step 2 CK
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
