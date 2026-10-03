import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { ScoreReleaseCalculator } from "@/components/score-release-calculator";
import { AdSlot } from "@/components/ads/ad-slot";
import { ALLOW_DAYS, SCORE_RELEASE_SOURCES, TYPICAL_DAYS } from "@/lib/usmle-score-release";

const PAGE_URL = "https://nbmecalc.com/usmle-score-release-dates";
const title = "USMLE Score Release Date Calculator: Step 1, Step 2 CK & Step 3";
const description =
  "Enter your test date to see when your Step 1, Step 2 CK, or Step 3 score should come out, or work backward from a deadline. Based on USMLE's official 4-week and 8-week timeline.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description: "When will my USMLE score come out? Free calculator based on the official USMLE score reporting timeline.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc USMLE score release date calculator",
      },
    ],
  },
};

const weeks = TYPICAL_DAYS / 7;
const allowWeeks = ALLOW_DAYS / 7;

const faqs = [
  {
    q: "How long does it take to get Step 2 CK scores?",
    a: `USMLE says results for Step 1, Step 2 CK, and Step 3 are typically available within ${weeks} weeks of your test date. It also tells examinees to allow at least ${allowWeeks} weeks before expecting notification.`,
  },
  {
    q: "When do Step 1 scores come out?",
    a: `Step 1 follows the same timeline: usually within ${weeks} weeks, with ${allowWeeks} weeks recommended as a planning margin. Step 1 has been reported as pass/fail since January 26, 2022, so the report shows a pass or fail outcome rather than a three-digit score.`,
  },
  {
    q: "When do Step 3 scores come out?",
    a: `Step 3 scores are also typically available within ${weeks} weeks. Count from the day you finish the second day of the exam, since your score covers both days.`,
  },
  {
    q: "What day of the week are USMLE scores released?",
    a: "USMLE does not publish a fixed release weekday on its scoring pages. Plan around the four-week and eight-week windows rather than a specific day.",
  },
  {
    q: "Are there still score delay periods?",
    a: "No dedicated ones. On March 6, 2024, USMLE announced it would no longer implement dedicated score delay periods for the Step exams, while noting that various factors can still delay an individual score in rare cases.",
  },
  {
    q: "How will I know my score is ready?",
    a: "You get an email from the organization that registered you for the exam. The score report then stays available on that organization's website for about 365 days from the notification email.",
  },
  {
    q: "It has been more than eight weeks. What should I do?",
    a: "Contact the organization that registered you for the exam. They can tell you whether your result is still being processed.",
  },
];

export default function UsmleScoreReleaseDatesPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "USMLE Score Release Date Calculator",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Estimates when a USMLE Step 1, Step 2 CK, or Step 3 score will be released from the test date, using the official USMLE reporting timeline.",
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
        badge={`Based on official USMLE guidance · checked ${SCORE_RELEASE_SOURCES.checkedLabel}`}
        title="When Will My USMLE Score Come Out?"
        description={`Step 1, Step 2 CK, and Step 3 scores are typically released within ${weeks} weeks, and USMLE asks you to allow ${allowWeeks}. Enter your test date to get both dates, or start from a deadline to find your latest safe test date.`}
        size="md"
      />

      <section id="calculator" className="bg-white py-12">
        <div className="container max-w-4xl">
          <ScoreReleaseCalculator />
        </div>
      </section>

      {/* 官方时间线 */}
      <section id="timeline" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            USMLE score release timeline by exam
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            All three computer-based Step exams use the same official timeline. What differs is what the report
            shows and when the clock starts.
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Exam</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Typical release</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Plan for</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">What you receive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Step 1", "Pass/fail outcome"],
                    ["Step 2 CK", "Three-digit score (passing: 218)"],
                    ["Step 3", "Three-digit score (passing: 200); clock starts after day 2"],
                  ].map(([exam, receive]) => (
                    <tr key={exam}>
                      <td className="px-5 py-3 font-bold text-gray-950">{exam}</td>
                      <td className="px-5 py-3 text-gray-800">Within {weeks} weeks</td>
                      <td className="px-5 py-3 text-gray-800">At least {allowWeeks} weeks</td>
                      <td className="px-5 py-3 text-gray-800">{receive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Sources:{" "}
            <a
              href={SCORE_RELEASE_SOURCES.scoring.url}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {SCORE_RELEASE_SOURCES.scoring.title}
            </a>{" "}
            and{" "}
            <a
              href={SCORE_RELEASE_SOURCES.timeline.url}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {SCORE_RELEASE_SOURCES.timeline.title}
            </a>
            .
          </p>
        </div>
      </section>

      {/* 怎么用截止日倒推 */}
      <section id="plan-test-date" className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Picking a test date when you have a deadline
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700">
            If a residency application, a graduation requirement, or a program start date depends on your score,
            work backward from that date. USMLE&apos;s own advice is to leave at least {allowWeeks} weeks between
            your test and the date you need results.
          </p>
          <ul className="mb-4 space-y-3 text-gray-700">
            <li className="rounded-2xl border border-gray-200 bg-mint-50/30 px-5 py-4">
              <strong className="text-gray-950">Safe:</strong> test {allowWeeks} weeks before the deadline. This is
              the margin USMLE recommends.
            </li>
            <li className="rounded-2xl border border-gray-200 bg-mint-50/30 px-5 py-4">
              <strong className="text-gray-950">Risky:</strong> test {weeks} weeks before. Most scores arrive in time,
              but a delayed score would miss the deadline.
            </li>
          </ul>
          <p className="leading-relaxed text-gray-700">
            Use the <strong>When should I test by?</strong> mode in the calculator above to get both dates. Before
            you lock in a date, check whether your practice scores say you are ready with the{" "}
            <Link href="/step-2-predictor" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK score predictor
            </Link>{" "}
            or the{" "}
            <Link href="/nbme-step-1-score-conversion" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 1 readiness check
            </Link>
            .
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* 出分后 */}
      <section id="after-release" className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">When your score is released</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                h: "You get an email",
                p: "The notification comes from the organization that registered you for the exam, not from USMLE directly.",
              },
              {
                h: "The report stays up about a year",
                p: "Your score report remains on the registering organization's website for roughly 365 days after the email. Save a copy.",
              },
              {
                h: "Then put it in context",
                p: "A three-digit score is easier to read as a percentile. Look it up against the official USMLE norm table.",
              },
            ].map((item) => (
              <div key={item.h} className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="font-bold text-gray-950">{item.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-700">
            Check your result with the{" "}
            <Link href="/step-2-ck-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK percentile calculator
            </Link>{" "}
            or the{" "}
            <Link href="/step-3-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 3 percentile and passing score page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            USMLE score release FAQs
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
          <h2 className="mb-4 text-2xl font-extrabold">Related tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/usmle-pass-rates" data-indexing-context="related" className="underline underline-offset-2">
                USMLE pass rates (2025 official data)
              </Link>
            </li>
            <li>
              <Link href="/step-3-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 3 score predictor
              </Link>
            </li>
            <li>
              <Link href="/free-120-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Free 120 to Step 2 CK conversion
              </Link>
            </li>
            <li>
              <Link href="/blog/how-to-read-nbme-score-report" data-indexing-context="related" className="underline underline-offset-2">
                How to read an NBME score report
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
