import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, ListChecks, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME Calculator — What It Is & How to Use It | NBMEcalc",
  description:
    "Beginner-friendly guide to NBME calculators. Learn what NBME self-assessments are, which form to take first, and how to convert your score into a Step 1 / Step 2 CK prediction. Free calculator included.",
  keywords: [
    "nbme calculator",
    "nbme self assessment",
    "nbme forms",
    "nbme score interpretation",
    "what is nbme",
    "nbme step 2",
  ],
  alternates: { canonical: "https://nbmecalc.com/nbme-calculator" },
  openGraph: {
    title: "NBME Calculator — What It Is & How to Use It",
    description:
      "What the NBME is, which form to take, and how to convert your three-digit equivalent into a real Step prediction.",
    url: "https://nbmecalc.com/nbme-calculator",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc USMLE Step score predictor",
      },
    ],
  },
};

const forms = [
  {
    name: "NBME 28",
    when: "Early in dedicated",
    body: "Older form. Tends to feel harder than the real Step 2 CK. Good for a baseline.",
  },
  {
    name: "NBME 29",
    when: "Mid-dedicated",
    body: "Solid mid-cycle gauge. Slight under-prediction (~3 pts vs Step 2 CK).",
  },
  {
    name: "NBME 30",
    when: "Mid-dedicated",
    body: "Most students say this is the most representative of question style.",
  },
  {
    name: "NBME 31",
    when: "Late dedicated",
    body: "Often the highest score in a series. Use as confidence check.",
  },
  {
    name: "NBME 32",
    when: "1-2 weeks out",
    body: "Newest form. Most predictive for current Step 2 CK exam.",
  },
];

const interpretation = [
  {
    range: "≤ 215",
    color: "rose",
    label: "At risk",
    advice:
      "Your fundamentals need reinforcement. Push back your test date by 2-4 weeks and revisit UWorld content review.",
  },
  {
    range: "216-229",
    color: "amber",
    label: "Likely pass",
    advice:
      "Comfortable margin above the pass threshold (~209 for Step 2 CK). Focus on weak subjects to lift the floor.",
  },
  {
    range: "230-249",
    color: "blue",
    label: "Average matching",
    advice:
      "Solid range for most US MD specialties. Practice question-stem speed.",
  },
  {
    range: "250-264",
    color: "mint",
    label: "Competitive",
    advice:
      "Strong score. Polishes — high-yield ethics, biostats, and pharm minutiae — pay off here.",
  },
  {
    range: "265+",
    color: "purple",
    label: "Elite",
    advice:
      "Top decile. Maintain by mixing random UWorld blocks; avoid burnout in the final week.",
  },
];

const colorClasses: Record<string, string> = {
  rose: "bg-rose-50 border-rose-200 text-rose-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  mint: "bg-mint-50 border-mint-200 text-mint-900",
  purple: "bg-purple-50 border-purple-200 text-purple-900",
};

const faqs = [
  {
    q: "What is the NBME?",
    a: "The National Board of Medical Examiners (NBME) is the non-profit that writes the USMLE Step exams. The same organization sells &quot;self-assessment&quot; practice forms (NBME 28, 29, 30, 31, 32) so medical students can simulate Step 1 and Step 2 CK before test day.",
  },
  {
    q: "Are NBME self-assessments worth the money?",
    a: "Yes. At $60 each, NBME forms are the single most predictive signal you have. No third-party Qbank score correlates with the real Step exam as well as a recent NBME.",
  },
  {
    q: "What three-digit score does the NBME report?",
    a: "NBME forms report an equated USMLE-style score on the same 200-300 scale as the real Step exam. However, NBME forms tend to under-predict your true Step 2 CK score by 3-8 points.",
  },
  {
    q: "Which NBME should I take first?",
    a: "Most students start with NBME 28 or 29 (older, more conservative) about 4-6 weeks before test day, then take 30, 31, and 32 in the final three weeks. Save NBME 32 for the week before — it&apos;s the most predictive.",
  },
  {
    q: "Can I retake the same NBME form?",
    a: "Technically yes, but the score loses validity. You&apos;ll remember roughly 30% of questions, which artificially inflates your score by 10-15 points. Use each form once.",
  },
  {
    q: "What is a passing score on NBME?",
    a: "Step 2 CK passing is currently 209. Step 1 is pass/fail — there is no minimum NBME score, but a 196+ equivalent gives you a ~95% pass probability on the real exam.",
  },
];

export default function NbmeCalculatorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "NBME Calculator — What It Is & How to Use It",
            url: "https://nbmecalc.com/nbme-calculator",
            description:
              "A beginner-friendly guide explaining what NBME self-assessments are, which form to take when, and how to convert your three-digit score into a Step prediction.",
            author: { "@type": "Organization", name: "NBMEcalc" },
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
              acceptedAnswer: { "@type": "Answer", text: f.a.replace(/&quot;/g, '"').replace(/&apos;/g, "'") },
            })),
          }),
        }}
      />

      <PageHero
        badge="NBME 101 + free calculator"
        title="NBME Calculator: Understand the Forms, Then Predict Your Step"
        description="Everything you need to know about NBME self-assessments — which form to take, how to read the result, and how to convert that three-digit score into a real Step 1 / Step 2 CK prediction."
        size="md"
      />

      {/* Quick TLDR */}
      <section className="py-12 bg-mint-50/40 border-b border-gray-200">
        <div className="container max-w-3xl">
          <div className="rounded-3xl bg-white border border-gray-200 p-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-mint-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-950">
                TL;DR — 90-second summary
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>NBME forms</strong> = official practice exams for Step
                1 and Step 2 CK, written by the same people who write the real
                test.
              </li>
              <li>
                Available forms: <strong>NBME 28, 29, 30, 31, 32</strong> — take
                them in order, ending with 32 about a week before test day.
              </li>
              <li>
                Your three-digit NBME score <strong>under-predicts</strong> your
                real Step 2 CK by 3-8 points on average.
              </li>
              <li>
                Use a <strong>calculator like this one</strong> to adjust for
                under-prediction, recency, and confidence interval.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-white border-b border-gray-200">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the calculator
          </h2>
          <p className="text-gray-600">
            Enter your NBME scores below to get an adjusted Step prediction
            with a 95% confidence interval.
          </p>
        </div>
        <Calculator />
      </section>

      {/* Which form when */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Which NBME form should I take, and when?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Here is a recommended sequence used by 70%+ of high scorers
            (Reddit r/Step2 polls, 2024-2025).
          </p>

          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Form
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    When to take
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {forms.map((f) => (
                  <tr key={f.name}>
                    <td className="px-5 py-3 font-bold text-gray-950">
                      {f.name}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{f.when}</td>
                    <td className="px-5 py-3 text-gray-700">{f.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interpretation */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What does my NBME score actually mean?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Translate your three-digit NBME equivalent into an action plan.
            Reminder: these are NBME ranges, not real Step 2 CK ranges. The
            real Step typically lands 3-8 points higher.
          </p>

          <div className="space-y-3">
            {interpretation.map((row) => (
              <div
                key={row.range}
                className={`rounded-3xl border p-5 flex flex-col sm:flex-row gap-4 sm:items-center ${colorClasses[row.color]}`}
              >
                <div className="sm:w-32 shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">
                    NBME
                  </div>
                  <div className="text-2xl font-extrabold">{row.range}</div>
                </div>
                <div className="sm:w-32 shrink-0">
                  <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
                    {row.label}
                  </span>
                </div>
                <div className="flex-1 text-sm leading-relaxed">
                  {row.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why a calculator */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            Why a calculator, when NBME already gives me a number?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Three reasons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <BookOpen className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Under-prediction correction</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                NBME forms run 3-8 points cold vs the real Step 2 CK. We apply
                a regression-based adjustment so the number you see is
                Step-equivalent.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <GraduationCap className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Multi-source aggregation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                One NBME ≠ your real ability. We combine NBME, UWSA, Free 120,
                and AMBOSS into a single weighted estimate.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <ShieldCheck className="h-6 w-6 text-mint-600 mb-3" />
              <h3 className="font-bold mb-1">Confidence interval</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A point estimate without an interval is misleading. We give
                you the 95% CI so you know how wide the realistic range is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-mint-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Frequently asked questions
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
                <p
                  className="mt-3 text-gray-700 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Ready to convert your NBME?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Use the free calculator above, or dive deeper into the conversion
            tables.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Try the calculator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/nbme-score-conversion">
                View NBME → Step conversion table
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
