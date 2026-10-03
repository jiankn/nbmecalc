import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { SpecialtyScoreChecker } from "@/components/specialty-score-checker";
import { AdSlot } from "@/components/ads/ad-slot";
import { NRMP_SOURCE, SPECIALTY_STEP2, specialtiesByMedian } from "@/lib/nrmp-step2-specialty";
import { formatPercentile, lookupPercentile } from "@/lib/usmle-norms";

const PAGE_URL = "https://nbmecalc.com/step-2-score-by-specialty";
const title = "Step 2 CK Score by Specialty: 2026 NRMP Match Data";
const description =
  "Median Step 2 CK scores of matched and unmatched U.S. MD seniors for 23 specialties, from NRMP Charting Outcomes 2026. Enter your score to see where it falls in each specialty.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description:
      "Where does your Step 2 CK score sit for dermatology, ortho, internal medicine and 20 more specialties? Based on NRMP 2026 data.",
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "Step 2 CK score by specialty",
      },
    ],
  },
};

const byMedian = specialtiesByMedian();
const top = byMedian.slice(0, 5);
const bottom = byMedian.slice(-4).reverse();
const bySlug = Object.fromEntries(SPECIALTY_STEP2.map((sp) => [sp.slug, sp]));

// 匹配与未匹配中位数差距最大的专科（只看未匹配人数 ≥ 20 的，样本太小的不比）。
const gaps = SPECIALTY_STEP2.filter((sp) => sp.notMatched && sp.notMatched.n >= 20)
  .map((sp) => ({ sp, gap: sp.matched.median - sp.notMatched!.median }))
  .sort((a, b) => b.gap - a.gap);
const biggestGaps = gaps.slice(0, 4);
const smallestGaps = gaps.slice(-3).reverse();

const belowQ1At250 = SPECIALTY_STEP2.filter((sp) => 250 < sp.matched.q1);

const faqSpecialties = [
  "dermatology",
  "orthopaedic-surgery",
  "general-surgery",
  "internal-medicine",
  "emergency-medicine",
  "family-medicine",
  "diagnostic-radiology",
  "psychiatry",
];

const faqs = [
  ...faqSpecialties.map((slug) => {
    const sp = bySlug[slug];
    const nm = sp.notMatched;
    return {
      q: `What Step 2 CK score do you need for ${sp.name.replace(/ \(.*\)$/, "")}?`,
      a: `There is no official cutoff. In the 2026 Match, U.S. MD seniors who matched into ${sp.name} had a median Step 2 CK score of ${sp.matched.median}, and the middle half scored ${sp.matched.q1}–${sp.matched.q3}.${nm ? ` Those who preferred it but did not match had a median of ${nm.median}.` : ""} A ${sp.matched.median} is at the ${formatPercentile(lookupPercentile("step2ck", sp.matched.median).percentile)} percentile nationally.`,
    };
  }),
  {
    q: "Is a 250 a good Step 2 CK score for residency?",
    a: `A 250 is at the ${formatPercentile(lookupPercentile("step2ck", 250).percentile)} percentile nationally. In NRMP's 2026 data it is at or above the matched median in ${SPECIALTY_STEP2.filter((sp) => 250 >= sp.matched.median).length} of ${SPECIALTY_STEP2.length} specialties, and below the middle half of matched applicants in ${belowQ1At250.length} (${belowQ1At250.map((sp) => sp.name).join(", ")}).`,
  },
  {
    q: "Does this data include DO students and IMGs?",
    a: "No. These figures come from NRMP's report on U.S. MD seniors. NRMP publishes separate Charting Outcomes reports for U.S. DO seniors and for international medical graduates, and their score distributions differ.",
  },
  {
    q: "Is Step 2 CK the only thing that decides a match?",
    a: "No. The overlap in the table shows it: in several competitive specialties, applicants who did not match had higher medians than matched applicants in other fields. NRMP's report also tracks research, experiences, and the number of programs ranked.",
  },
];

export default function Step2ScoreBySpecialtyPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 2 CK Score by Specialty Checker",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Compares a Step 2 CK score with the distribution of matched U.S. MD seniors in each specialty, using NRMP Charting Outcomes 2026.",
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
        badge={`NRMP Charting Outcomes 2026 · checked ${NRMP_SOURCE.checkedLabel}`}
        title="Step 2 CK Score by Specialty (2026 Match)"
        description={`Matched U.S. MD seniors' median Step 2 CK ranged from ${byMedian[byMedian.length - 1].matched.median} in ${byMedian[byMedian.length - 1].name} to ${byMedian[0].matched.median} in ${byMedian[0].name}. Enter your score to see where it falls in all ${SPECIALTY_STEP2.length} specialties.`}
        size="md"
      />

      <section id="checker" className="bg-white py-12">
        <div className="container max-w-6xl">
          <SpecialtyScoreChecker />
          <p className="mt-4 text-sm text-gray-600">
            Source:{" "}
            <a
              href={NRMP_SOURCE.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              {NRMP_SOURCE.shortTitle}
            </a>
            . Selected figures only; see the NRMP report for the full statistics. Specialties with fewer than 40
            matched seniors are omitted.
          </p>
        </div>
      </section>

      {/* 数据结论 */}
      <section id="highlights" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-5xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">What the 2026 numbers show</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-950">Highest matched medians</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                {top.map((sp) => (
                  <li key={sp.slug} className="flex justify-between gap-4">
                    <span>{sp.name}</span>
                    <span className="font-mono font-bold text-gray-950">{sp.matched.median}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-950">Lowest matched medians</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                {bottom.map((sp) => (
                  <li key={sp.slug} className="flex justify-between gap-4">
                    <span>{sp.name}</span>
                    <span className="font-mono font-bold text-gray-950">{sp.matched.median}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-950">Biggest gap: matched vs. not matched</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                {biggestGaps.map(({ sp, gap }) => (
                  <li key={sp.slug} className="flex justify-between gap-4">
                    <span>{sp.name}</span>
                    <span className="font-mono text-gray-950">
                      {sp.matched.median} vs {sp.notMatched!.median} (<strong>{gap}</strong>)
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                In these fields, the score difference between matched and unmatched applicants was largest.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-950">Smallest gap: score matters less on its own</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                {smallestGaps.map(({ sp, gap }) => (
                  <li key={sp.slug} className="flex justify-between gap-4">
                    <span>{sp.name}</span>
                    <span className="font-mono text-gray-950">
                      {sp.matched.median} vs {sp.notMatched!.median} (<strong>{gap}</strong>)
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Here unmatched applicants scored almost as high as matched ones, so other parts of the application
                did more of the separating.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Gaps compare medians and only include specialties with at least 20 unmatched U.S. MD seniors.
          </p>
        </div>
      </section>

      <AdSlot placement="home-content" className="container my-8 max-w-4xl lg:my-10" />

      {/* 怎么读 */}
      <section id="how-to-read" className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight lg:text-4xl">How to read specialty score data</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                h: "These are outcomes, not cutoffs",
                p: "A median describes who matched. It is not a minimum, and a quarter of matched applicants scored below the first number in each range.",
              },
              {
                h: "U.S. MD seniors only",
                p: "The report covers U.S. MD seniors who consented to research use of their data. DO seniors and IMGs have their own NRMP reports.",
              },
              {
                h: "“Preferred specialty” matters",
                p: "Applicants are grouped by the specialty they ranked first. “Not matched” means they did not match in that specialty, not that they went unmatched entirely.",
              },
              {
                h: "Small groups swing",
                p: "Where only a handful of applicants did not match, their median can move a lot from year to year. The table flags groups under 20.",
              },
            ].map((item) => (
              <div key={item.h} className="rounded-3xl border border-gray-200 bg-mint-50/30 p-6">
                <h3 className="font-bold text-gray-950">{item.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-700">
            Don&apos;t have a real score yet? Estimate one with the{" "}
            <Link href="/step-2-predictor" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK score predictor
            </Link>
            , then check its national rank on the{" "}
            <Link href="/step-2-ck-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              Step 2 CK percentile calculator
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-mint-50/30 py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">
            Step 2 CK score by specialty FAQs
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
              <Link href="/step-2-ck-percentile" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK percentile calculator
              </Link>
            </li>
            <li>
              <Link href="/step-2-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 2 CK score predictor
              </Link>
            </li>
            <li>
              <Link href="/nbme-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME CCSSA score conversion
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
