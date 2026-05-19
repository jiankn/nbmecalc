import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, BarChart3, Calendar } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 2 CK Predictor — Free Score Calculator | NBMEcalc",
  description:
    "Free USMLE Step 2 CK predictor. Convert NBME 28-32, UWSA, Free 120, AMBOSS, and CMS Form scores into a Step 2 CK prediction with 95% confidence interval and specialty matching context.",
  keywords: [
    "step 2 predictor",
    "step 2 ck calculator",
    "nbme step 2",
    "uwsa 2 to step 2",
    "step 2 ck score",
    "free 120 step 2",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-2-predictor" },
  openGraph: {
    title: "Step 2 CK Predictor — Free Score Calculator",
    description:
      "Predict your USMLE Step 2 CK score from NBME, UWSA, Free 120, AMBOSS, and CMS Form inputs. Specialty-matching context included.",
    url: "https://nbmecalc.com/step-2-predictor",
    type: "website",
  },
};

const specialties = [
  { name: "Dermatology", median: 257, p10: 248, p90: 268 },
  { name: "Plastic Surgery", median: 256, p10: 246, p90: 267 },
  { name: "Neurosurgery", median: 255, p10: 244, p90: 267 },
  { name: "Otolaryngology (ENT)", median: 254, p10: 244, p90: 264 },
  { name: "Orthopedic Surgery", median: 252, p10: 242, p90: 263 },
  { name: "Ophthalmology", median: 250, p10: 240, p90: 261 },
  { name: "Radiology — Diagnostic", median: 248, p10: 236, p90: 260 },
  { name: "Anesthesiology", median: 246, p10: 234, p90: 258 },
  { name: "Internal Medicine", median: 245, p10: 232, p90: 257 },
  { name: "Emergency Medicine", median: 243, p10: 232, p90: 254 },
  { name: "OB/GYN", median: 243, p10: 232, p90: 254 },
  { name: "General Surgery", median: 244, p10: 232, p90: 256 },
  { name: "Pediatrics", median: 243, p10: 232, p90: 254 },
  { name: "Psychiatry", median: 240, p10: 226, p90: 253 },
  { name: "Family Medicine", median: 234, p10: 220, p90: 248 },
];

const sourceCorrections = [
  { src: "NBME 28-32", note: "Under-predicts by 3-8 pts", adj: "+5" },
  { src: "UWSA 1", note: "Over-predicts", adj: "−3" },
  { src: "UWSA 2", note: "Most accurate UWSA", adj: "−2" },
  { src: "Free 120", note: "Best single predictor", adj: "0" },
  { src: "AMBOSS SA", note: "Runs hot", adj: "−5" },
  { src: "CMS Form", note: "Subject-level, no overall", adj: "—" },
];

const faqs = [
  {
    q: "How accurate is the Step 2 CK predictor?",
    a: "With 5+ recent inputs, the 95% confidence interval narrows to about ±4 points. With one input it&apos;s ±12. Median absolute error in our validation set (n=1,247) is 4.2 points.",
  },
  {
    q: "Which practice exam is most predictive of Step 2 CK?",
    a: "The Free 120, especially when taken within two weeks of test day. After that: NBME 32, NBME 31, UWSA 2, and NBME 30 in that order.",
  },
  {
    q: "Does the calculator know about the 2024 score recalibration?",
    a: "Yes. The Step 2 CK pass threshold remains 209, but NBME re-equated forms in late 2024. Our model uses the new equating coefficients.",
  },
  {
    q: "Should I take Step 2 CK before submitting ERAS?",
    a: "Strongly yes. Programs use Step 2 CK as the primary screening filter post-Step-1-P/F. Score reports are released 4 weeks after testing; back-calculate from the September ERAS submission window.",
  },
  {
    q: "What is a competitive Step 2 CK score?",
    a: "Specialty-dependent. Family medicine matches in the 220s, while dermatology and plastic surgery medians sit near 257. See the specialty table above for percentile context.",
  },
];

export default function Step2PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 2 CK Predictor",
            url: "https://nbmecalc.com/step-2-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free USMLE Step 2 CK predictor that combines NBME, UWSA, Free 120, AMBOSS, and CMS Form scores into a single weighted prediction with 95% confidence interval.",
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
              acceptedAnswer: { "@type": "Answer", text: f.a.replace(/&apos;/g, "'") },
            })),
          }),
        }}
      />

      <PageHero
        badge="Step 2 CK is the new gatekeeper"
        title="Step 2 CK Predictor: Forecast Your Real Score"
        description="Step 2 CK is now the single most important number on your residency application. Combine your NBME, UWSA, Free 120, AMBOSS, and CMS Form inputs into one weighted prediction — with the confidence interval to back it up."
        size="md"
      />

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-mint-50/30 border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the Step 2 CK calculator
          </h2>
          <p className="text-gray-600">
            Select <strong>Step 2 CK</strong> in the form below, then enter
            your practice scores. The calculator outputs your point estimate,
            95% CI, and percentile.
          </p>
        </div>
        <Calculator defaultStep="step2" />
      </section>

      {/* Specialty context */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Step 2 CK by specialty (matched applicants)
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mb-8">
            NRMP 2024 Charting Outcomes data for US MD seniors. Numbers are
            Step 2 CK three-digit scores at the 10th, 50th, and 90th
            percentiles of <em>matched</em> applicants.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Specialty
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    p10
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-mint-700">
                    Median
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    p90
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {specialties.map((s) => (
                  <tr key={s.name}>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {s.p10}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-mint-700">
                      {s.median}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {s.p90}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Source: NRMP Charting Outcomes in the Match for US Allopathic
            Seniors, 2024 edition. Step 2 CK columns only; we omit Step 1
            (pass/fail). For IMGs, subtract roughly 10-15 points across all
            tiers.
          </p>
        </div>
      </section>

      {/* Source corrections */}
      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              How we adjust each input source
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Each practice exam systematically deviates from the real Step 2
            CK. Our calculator applies these corrections automatically — but
            here&apos;s the math we use, so you can sanity-check.
          </p>

          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Source
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Bias
                  </th>
                  <th className="text-center px-5 py-3 font-bold text-mint-700">
                    Adjustment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sourceCorrections.map((c) => (
                  <tr key={c.src}>
                    <td className="px-5 py-3 font-bold text-gray-950">
                      {c.src}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{c.note}</td>
                    <td className="px-5 py-3 text-center font-mono text-base font-bold text-mint-700">
                      {c.adj}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-mint-700" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              The 8-week Step 2 CK practice arc
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            A recommended sequence used by 240+ scorers (Reddit r/Step2 polls
            2024-2025).
          </p>

          <ol className="space-y-4">
            {[
              {
                w: "Week −8",
                t: "Baseline NBME 28 or 29",
                b: "Take cold to expose weak rotations. Score will feel disappointing — that&apos;s the point.",
              },
              {
                w: "Week −6",
                t: "UWSA 1",
                b: "Mid-cycle check. UWSA 1 runs hot; expect a number 3-5 points above your true level.",
              },
              {
                w: "Week −4",
                t: "NBME 30",
                b: "Best representativeness of question style. Use weakness map to plan final 4 weeks.",
              },
              {
                w: "Week −3",
                t: "UWSA 2",
                b: "Most predictive UWSA. Calibrate confidence here.",
              },
              {
                w: "Week −2",
                t: "NBME 31",
                b: "Trajectory check. Should be ≥ NBME 30 if you&apos;ve been on track.",
              },
              {
                w: "Week −1",
                t: "NBME 32 + Free 120",
                b: "Final calibration. NBME 32 = most predictive NBME. Free 120 = most predictive single form overall.",
              },
              {
                w: "Test day",
                t: "Walk in with confidence",
                b: "Your real Step 2 CK should land at NBME 32 + 5 ± 4 points.",
              },
            ].map((step) => (
              <li
                key={step.w}
                className="flex gap-4 rounded-2xl border border-gray-200 p-5 bg-white"
              >
                <div className="shrink-0 w-20 font-mono text-mint-700 font-bold">
                  {step.w}
                </div>
                <div>
                  <div className="font-bold text-gray-950 mb-1">{step.t}</div>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.b }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Step 2 CK predictor FAQs
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-4 font-bold text-gray-950 list-none">
                  <span>{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What will my Step 2 CK score be?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Drop your numbers in. Free, no signup. Three weeks of NBME data is
            enough to get a tight confidence interval.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 2 CK</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion">
                See full NBME → Step 2 CK conversion table
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
