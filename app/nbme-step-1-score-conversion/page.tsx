import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CbssaReadinessChecker } from "@/components/cbssa-readiness-checker";
import {
  CBSSA_REPORT_PRECISION,
  CBSSA_SOURCES,
  DEFAULT_LOW_PASS,
  READINESS_COPY,
  SAMPLE_REFERENCE,
  estimateCbssaReadiness,
} from "@/lib/cbssa-readiness";

const PAGE_URL = "https://nbmecalc.com/nbme-step-1-score-conversion";
const title = "NBME Step 1 Score Conversion (Forms 26–33): % to Pass Readiness";
const description =
  "Step 1 is pass/fail, so CBSSA reports a percent. Enter your NBME 26–33 percent correct to see where it falls against the Step 1 low-pass range, using NBME's own guidance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description: "Check an NBME CBSSA percent against the Step 1 low-pass range with NBME's four-scenario guidance.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/images/feature-score-range.png", width: 2400, height: 1792, alt: "NBME Step 1 readiness check" }],
  },
};

const quickTable = [55, 58, 60, 62, 64, 66, 68, 70, 72, 73, 75, 80].map((p) => ({
  p,
  ...estimateCbssaReadiness(p, "epc"),
}));

const SHORT_LABEL = {
  below: "At risk",
  "overlap-below": "Borderline",
  near: "Close to passing",
  above: "Likely ready",
} as const;

const NBME_2021_RELEASE = "https://www.nbme.org/news/new-versions-nbmer-self-assessment-forms-now-available/";

const CBSSA_FORM_NOTES: Record<number, { note: string; source?: { label: string; href: string } }> = {
  26: {
    note: "Part of the CBSSA set NBME released on March 24, 2021 (Forms 25–30), which retired Forms 18 and 20–24.",
    source: { label: "NBME announcement", href: NBME_2021_RELEASE },
  },
  27: {
    note: "Released with Forms 25–30 in March 2021. Its equated percent is directly comparable with newer forms.",
    source: { label: "NBME announcement", href: NBME_2021_RELEASE },
  },
  28: {
    note: "From the March 2021 release. Older forms stay useful for trend tracking because EPC is adjusted for form difficulty.",
    source: { label: "NBME announcement", href: NBME_2021_RELEASE },
  },
  29: {
    note: "From the March 2021 release (Forms 25–30). Compare its EPC with your other CBSSAs rather than raw counts.",
    source: { label: "NBME announcement", href: NBME_2021_RELEASE },
  },
  30: {
    note: "The last form of the March 2021 release. A dedicated page reads the two official ranges from a Form 30 report.",
    source: { label: "NBME announcement", href: NBME_2021_RELEASE },
  },
  31: {
    note: "A newer CBSSA form. NBME has not published a separate release note that we could verify, so it is treated like any other equated form.",
  },
  32: {
    note: "A newer CBSSA form with no separate NBME release note. Enter the report EPC for the tightest range.",
  },
  33: {
    note: "The most recent form discussed by independent prep reviewers. Confirm it is listed in your MyNBME account before buying.",
  },
};

const faqs = [
  {
    q: "How do I convert an NBME Step 1 score?",
    a: `Current CBSSA reports do not give a three-digit Step 1 score because Step 1 is pass/fail. They give a total equated percent correct, a likely range of about ±${CBSSA_REPORT_PRECISION} points, a low-pass range, and an estimated probability of passing. Compare your likely range with the low-pass range using NBME's four scenarios.`,
  },
  {
    q: "What percent do I need on an NBME to pass Step 1?",
    a: `NBME's sample report draws the Step 1 low-pass range at roughly ${DEFAULT_LOW_PASS.low}–${DEFAULT_LOW_PASS.high}%. A likely range completely above that band is NBME's "likely ready" scenario. In the sample report, ${SAMPLE_REFERENCE.epc}% (range ${SAMPLE_REFERENCE.likelyLow}–${SAMPLE_REFERENCE.likelyHigh}) came with a ${SAMPLE_REFERENCE.passProbability}% estimated probability of passing.`,
  },
  {
    q: "Is 65% on an NBME passing for Step 1?",
    a: `A 65% EPC gives a likely range of about ${65 - CBSSA_REPORT_PRECISION}–${65 + CBSSA_REPORT_PRECISION}%, which overlaps the low end of the low-pass band. NBME's guidance calls that borderline and strongly recommends additional preparation.`,
  },
  {
    q: "Can I still get a three-digit Step 1 score from an NBME?",
    a: "No. Step 1 has been reported as pass/fail since January 26, 2022, and CBSSA reports switched to equated percent correct. Any three-digit Step 1 number from an online converter is an unofficial legacy estimate.",
  },
  {
    q: "Which NBME forms are for Step 1?",
    a: "Step 1 uses the Comprehensive Basic Science Self-Assessment (CBSSA). The forms discussed on this page are 26–33. Step 2 CK uses CCSSA Forms 9–16, and Step 3 uses CCMSA — the numbers are not interchangeable.",
  },
];

export default function NbmeStep1ScoreConversionPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NBME Step 1 Readiness Check",
            url: PAGE_URL,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Compares an NBME CBSSA equated percent correct with the Step 1 low-pass range using NBME's guidance.",
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
        badge="NBME CBSSA → Step 1"
        title="NBME Step 1 Score Conversion: CBSSA Percent to Pass Readiness"
        description={`Step 1 is pass/fail, so NBME reports a percent instead of a three-digit score. Enter your Form 26–33 percent to see where it falls against the roughly ${DEFAULT_LOW_PASS.low}–${DEFAULT_LOW_PASS.high}% low-pass range.`}
        size="md"
      />

      <section id="readiness-check" className="bg-white py-10 lg:py-12">
        <div className="container max-w-4xl">
          <CbssaReadinessChecker />
        </div>
      </section>

      <section id="quick-table" className="border-t border-gray-200 bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            NBME Step 1 percent to readiness chart
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-700">
            Each row applies the report&apos;s ±{CBSSA_REPORT_PRECISION}-point likely range and the default low-pass
            band of {DEFAULT_LOW_PASS.low}–{DEFAULT_LOW_PASS.high}% to an equated percent correct (EPC).
          </p>
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">EPC</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Likely range</th>
                    <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">NBME scenario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quickTable.map((row) => (
                    <tr key={row.p}>
                      <td className="px-5 py-2.5 font-mono font-bold text-gray-950">{row.p}%</td>
                      <td className="px-5 py-2.5 font-mono text-gray-700">
                        {row.likelyLow}–{row.likelyHigh}%
                      </td>
                      <td className="px-5 py-2.5 text-gray-800">{SHORT_LABEL[row.state]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Scenario wording follows{" "}
            <a
              href={CBSSA_SOURCES.guidance.href}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              NBME&apos;s Step 1 readiness guidance
            </a>
            ; the low-pass band is read from the{" "}
            <a
              href={CBSSA_SOURCES.sample.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              April 2026 sample report
            </a>
            .
          </p>
        </div>
      </section>

      <section id="by-form" className="bg-white py-16 lg:py-20">
        <div className="container max-w-5xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            NBME Step 1 score conversion by form (CBSSA 26–33)
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-700">
            Every CBSSA has 200 questions in four sections of 50, and the report&apos;s percent is equated for form
            difficulty. That is why the same percent leads to the same readiness scenario on every form.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(CBSSA_FORM_NOTES).map(([form, info]) => (
              <div key={form} id={`nbme-${form}`} className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-lg font-extrabold text-gray-950">NBME {form} score conversion</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{info.note}</p>
                {info.source && (
                  <a
                    href={info.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-gray-500 underline underline-offset-2"
                  >
                    {info.source.label}
                  </a>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                  <a href={`?form=${form}#readiness-check`} className="text-mint-700 underline underline-offset-4">
                    Check NBME {form}
                  </a>
                  {form === "30" && (
                    <Link href="/nbme-30-score-conversion" className="text-mint-700 underline underline-offset-4">
                      Form 30 report reader
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint-50/30 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Why there is no three-digit NBME Step 1 conversion anymore
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Step 1 moved to pass/fail reporting for exams taken on or after January 26, 2022. NBME followed by
            reporting CBSSA performance as an equated percent correct with a likely range, a Step 1 low-pass range,
            and an estimated probability of passing if you test within a week.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            The four scenarios NBME describes are:
          </p>
          <ul className="mb-4 space-y-3">
            {(["below", "overlap-below", "near", "above"] as const).map((s) => (
              <li key={s} className={`rounded-2xl border p-4 text-sm ${READINESS_COPY[s].tone}`}>
                <strong>{READINESS_COPY[s].title}.</strong> {READINESS_COPY[s].body}
              </li>
            ))}
          </ul>
          <p className="leading-relaxed text-gray-700">
            The probability printed on your report comes from NBME&apos;s own model and is the most important number
            on it. This page does not replace it; it helps you place a percent before the report is in front of you
            or when you want to see how close a result is to the low-pass band. For national results, see the{" "}
            <Link href="/usmle-pass-rates" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
              latest USMLE pass rates
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">NBME Step 1 conversion FAQs</h2>
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
          <h2 className="mb-4 text-2xl font-extrabold">Related Step 1 tools</h2>
          <ul className="grid gap-3 font-semibold text-mint-700 sm:grid-cols-2">
            <li>
              <Link href="/step-1-predictor" data-indexing-context="related" className="underline underline-offset-2">
                Step 1 pass probability predictor
              </Link>
            </li>
            <li>
              <Link href="/uwsa-1-to-step-1" data-indexing-context="related" className="underline underline-offset-2">
                UWSA 1 to Step 1 conversion
              </Link>
            </li>
            <li>
              <Link href="/nbme-30-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME 30 report reader
              </Link>
            </li>
            <li>
              <Link href="/nbme-score-conversion" data-indexing-context="related" className="underline underline-offset-2">
                NBME Step 2 CK score conversion
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
