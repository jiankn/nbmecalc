import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { NORM_INFO } from "@/lib/usmle-norms";
import {
  PASS_RATES,
  PASS_RATES_SOURCE,
  firstTakerRate,
  getPassRates,
  type PassRateRow,
} from "@/lib/usmle-pass-rates";

const PAGE_URL = "https://nbmecalc.com/usmle-pass-rates";
const title = "USMLE Pass Rates 2025: Step 1, Step 2 CK & Step 3 (Official)";
const description = `Official USMLE pass rates: Step 1 ${firstTakerRate("Step 1", "us-md")}% for U.S. MD first-takers in 2025, Step 2 CK ${firstTakerRate("Step 2 CK", "us-md")}%, Step 3 ${firstTakerRate("Step 3", "us-md")}%, plus DO, IMG, and repeater rates.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title,
    description: "Official USMLE pass rates by exam, degree type, and first-taker vs repeater status, with year-over-year change.",
    url: PAGE_URL,
    type: "article",
    images: [{ url: "/images/feature-score-range.png", width: 2400, height: 1792, alt: "USMLE pass rates" }],
  },
};

const fmtN = (n: number | null) => (n === null ? "†" : n.toLocaleString("en-US"));
const fmtP = (p: number | null) => (p === null ? "N/A" : `${p}%`);

const step1 = getPassRates("Step 1");
const step3 = getPassRates("Step 3");

// 三个考试首考通过率对比条形图的数据。
const summary = PASS_RATES.map((s) => ({
  step: s.step,
  period: s.currLabel,
  usMd: s.us[1].curr.pct!,
  usDo: s.us[4].curr.pct!,
  nonUs: s.nonUs[0].curr.pct!,
}));

const faqs = [
  {
    q: "What is the Step 1 pass rate?",
    a: `In 2025, ${firstTakerRate("Step 1", "us-md")}% of first-time takers from U.S. MD schools passed Step 1, up from ${step1.us[1].prev.pct}% in 2024. DO first-takers passed at ${step1.us[4].curr.pct}% and first-takers from non-U.S. schools at ${firstTakerRate("Step 1", "non-us")}%.`,
  },
  {
    q: "What is the Step 3 pass rate?",
    a: `In 2025, ${firstTakerRate("Step 3", "us-md")}% of U.S. MD first-takers and ${firstTakerRate("Step 3", "non-us")}% of first-takers from non-U.S. schools passed Step 3. The minimum passing score is ${NORM_INFO.step3.passingScore}.`,
  },
  {
    q: "What is the Step 2 CK pass rate?",
    a: `For the 2024–2025 reporting year, ${firstTakerRate("Step 2 CK", "us-md")}% of U.S. MD first-takers and ${firstTakerRate("Step 2 CK", "non-us")}% of first-takers from non-U.S. schools passed. The minimum passing score is ${NORM_INFO.step2ck.passingScore}.`,
  },
  {
    q: "What is the pass rate for IMGs?",
    a: `USMLE reports examinees from non-U.S. schools as one group. First-taker pass rates were ${firstTakerRate("Step 1", "non-us")}% on Step 1 (2025), ${firstTakerRate("Step 2 CK", "non-us")}% on Step 2 CK (2024–2025), and ${firstTakerRate("Step 3", "non-us")}% on Step 3 (2025). Since 2025, Canadian schools are counted in this group.`,
  },
  {
    q: "Why do repeaters pass less often?",
    a: `Repeat takers pass at noticeably lower rates on every Step — for example ${step1.us[2].curr.pct}% for U.S. MD Step 1 repeaters in 2025. The data do not explain why, but they are a reason to confirm readiness with more than one recent practice assessment before retesting.`,
  },
];

function RateTable({ rows, prevLabel, currLabel, caption }: { rows: PassRateRow[]; prevLabel: string; currLabel: string; caption: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <caption className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-left font-bold text-gray-900">{caption}</caption>
          <thead className="border-b border-gray-200">
            <tr>
              <th scope="col" className="px-5 py-3 text-left font-bold text-gray-900">Group</th>
              <th scope="col" className="px-5 py-3 text-right font-bold text-gray-900">{prevLabel} tested</th>
              <th scope="col" className="px-5 py-3 text-right font-bold text-gray-900">{prevLabel} pass</th>
              <th scope="col" className="px-5 py-3 text-right font-bold text-gray-900">{currLabel} tested</th>
              <th scope="col" className="px-5 py-3 text-right font-bold text-gray-900">{currLabel} pass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono">
            {rows.map((row, i) => (
              <tr key={`${row.group}-${i}`} className={row.group === "Total" ? "bg-mint-50/40 font-bold" : undefined}>
                <td className={`px-5 py-2.5 font-sans ${row.sub ? "pl-10 text-gray-600" : "font-semibold text-gray-950"}`}>{row.group}</td>
                <td className="px-5 py-2.5 text-right text-gray-600">{fmtN(row.prev.n)}</td>
                <td className="px-5 py-2.5 text-right text-gray-600">{fmtP(row.prev.pct)}</td>
                <td className="px-5 py-2.5 text-right text-gray-800">{fmtN(row.curr.n)}</td>
                <td className="px-5 py-2.5 text-right font-bold text-gray-950">{fmtP(row.curr.pct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsmlePassRatesPage() {
  return (
    <PageShell>
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
        badge={`Official USMLE data · checked ${PASS_RATES_SOURCE.checkedLabel}`}
        title="USMLE Pass Rates 2025: Step 1, Step 2 CK, and Step 3"
        description={`First-time takers from U.S. MD schools passed Step 1 at ${firstTakerRate("Step 1", "us-md")}%, Step 2 CK at ${firstTakerRate("Step 2 CK", "us-md")}%, and Step 3 at ${firstTakerRate("Step 3", "us-md")}% in the latest reporting year. Here is every group USMLE publishes.`}
        size="md"
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="container max-w-4xl">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight lg:text-4xl">First-taker pass rates at a glance</h2>
          <div className="space-y-6">
            {summary.map((s) => (
              <div key={s.step}>
                <p className="mb-2 font-bold text-gray-950">
                  {s.step} <span className="font-normal text-gray-500">({s.period})</span>
                </p>
                {[
                  { label: "U.S. MD", v: s.usMd, cls: "bg-mint-500" },
                  { label: "U.S. DO", v: s.usDo, cls: "bg-mint-300" },
                  { label: "Non-U.S. schools", v: s.nonUs, cls: "bg-gray-400" },
                ].map((bar) => (
                  <div key={bar.label} className="mb-1.5 flex items-center gap-3 text-sm">
                    <span className="w-32 shrink-0 text-gray-600">{bar.label}</span>
                    <div className="h-5 flex-1 rounded-full bg-gray-100">
                      <div className={`h-5 rounded-full ${bar.cls}`} style={{ width: `${bar.v}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono font-bold text-gray-950">{bar.v}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Source:{" "}
            <a
              href={PASS_RATES_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              data-evidence-source="primary"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              USMLE Performance Data
            </a>
            , checked {PASS_RATES_SOURCE.checkedLabel}.
          </p>
        </div>
      </section>

      {PASS_RATES.map((s) => (
        <section
          key={s.step}
          id={s.step.toLowerCase().replace(/\s+/g, "-") + "-pass-rate"}
          className="border-t border-gray-200 bg-mint-50/20 py-16 lg:py-20"
        >
          <div className="container max-w-4xl">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">{s.step} pass rate</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              {s.step} first-takers from U.S. MD schools passed at {s.us[1].curr.pct}% in {s.currLabel} (
              {s.us[1].prev.pct}% in {s.prevLabel}); first-takers from non-U.S. schools passed at {s.nonUs[0].curr.pct}%.
            </p>
            <div className="space-y-6">
              <RateTable rows={s.us} prevLabel={s.prevLabel} currLabel={s.currLabel} caption="Examinees from U.S. schools" />
              <RateTable rows={s.nonUs} prevLabel={s.prevLabel} currLabel={s.currLabel} caption="Examinees from non-U.S. schools" />
            </div>
          </div>
        </section>
      ))}

      <section className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight lg:text-4xl">How to read these numbers</h2>
          <ul className="list-disc space-y-3 pl-6 leading-relaxed text-gray-700">
            <li>
              <strong>The groups changed in 2025.</strong> Canadian schools were counted with U.S. schools through 2024
              (2023–2024 for Step 2 CK) and with non-U.S. schools afterward, so year-over-year changes are not a
              perfectly like-for-like comparison.
            </li>
            <li>
              <strong>A pass rate is not your probability.</strong> It describes a whole group. Your own readiness
              depends on your recent practice results — for Step 1, see the{" "}
              <Link href="/nbme-step-1-score-conversion" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                NBME Step 1 readiness check
              </Link>
              .
            </li>
            <li>
              <strong>Passing scores:</strong> Step 2 CK {NORM_INFO.step2ck.passingScore} and Step 3{" "}
              {NORM_INFO.step3.passingScore}; Step 1 is reported pass/fail. To see where a numeric score ranks, use the{" "}
              <Link href="/step-2-ck-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                Step 2 CK percentile calculator
              </Link>{" "}
              or the{" "}
              <Link href="/step-3-percentile" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                Step 3 percentile page
              </Link>
              . To estimate when a result will arrive, use the{" "}
              <Link href="/usmle-score-release-dates" data-indexing-context="related" className="font-semibold text-mint-800 underline underline-offset-4">
                USMLE score release date calculator
              </Link>
              .
            </li>
            <li>
              <strong>Small groups:</strong> USMLE does not report categories with fewer than five examinees (shown
              as † and N/A), such as {step3.step} DO repeaters in {step3.currLabel}.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-mint-50/30 py-16 lg:py-24">
        <div className="container max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight lg:text-4xl">USMLE pass rate FAQs</h2>
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
    </PageShell>
  );
}
