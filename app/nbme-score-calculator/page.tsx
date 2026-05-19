import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Zap, Clock, Lock, FileDown, BarChart3 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "NBME Score Calculator — Free, Instant USMLE Predictor | NBMEcalc",
  description:
    "Free NBME score calculator that predicts your USMLE Step 1 (P/F) and Step 2 CK score in seconds. Supports NBME 28-32, UWSA, Free 120, AMBOSS, CMS Forms. No signup needed.",
  keywords: [
    "nbme score calculator",
    "nbme calculator",
    "usmle calculator",
    "step 2 score calculator",
    "uwsa calculator",
    "free 120 calculator",
  ],
  alternates: { canonical: "https://nbmecalc.com/nbme-score-calculator" },
  openGraph: {
    title: "NBME Score Calculator — Free, Instant USMLE Predictor",
    description:
      "Convert your NBME, UWSA, and Free 120 practice scores into a Step 1 / Step 2 CK prediction with confidence interval.",
    url: "https://nbmecalc.com/nbme-score-calculator",
    type: "website",
  },
};

const steps = [
  {
    n: 1,
    icon: Sparkles,
    title: "Pick your Step exam",
    body: "Step 1 (Pass/Fail), Step 2 CK (numeric), or Step 3.",
  },
  {
    n: 2,
    icon: BarChart3,
    title: "Enter your practice scores",
    body: "Add up to 10 scores from any source: NBME, UWSA, Free 120, AMBOSS, or CMS forms.",
  },
  {
    n: 3,
    icon: Clock,
    title: "Set your test date",
    body: "We weight more recent scores higher and apply a recency-decay model.",
  },
  {
    n: 4,
    icon: Zap,
    title: "Get your prediction instantly",
    body: "Point estimate + 95% confidence interval + percentile + pass probability.",
  },
];

const inputs = [
  {
    title: "NBME 28, 29, 30, 31, 32",
    body: "All current and recent NBME forms supported. Score range: 200-280.",
    badge: "Most accurate",
    tone: "mint",
  },
  {
    title: "UWSA 1 & UWSA 2",
    body: "Auto-adjusted by −3 points (UWSAs run hot). UWSA 2 is more predictive.",
    badge: "Auto-adjusted",
    tone: "purple",
  },
  {
    title: "Free 120",
    body: "Enter % correct (0-100). The single most predictive form for Step 2.",
    badge: "Best signal",
    tone: "amber",
  },
  {
    title: "AMBOSS Self-Assessment",
    body: "Score range 0-100. Inflation correction applied automatically.",
    badge: "Auto-adjusted",
    tone: "blue",
  },
  {
    title: "CMS Form (subject)",
    body: "Per-subject scores for Step 2 CK. Best for finding weak rotations.",
    badge: "Subject-level",
    tone: "rose",
  },
  {
    title: "Old NBMEs (1-26)",
    body: "Allowed but flagged — typically under-predict by 3-5 points.",
    badge: "Use cautiously",
    tone: "gray",
  },
];

const toneClasses: Record<string, string> = {
  mint: "bg-mint-100 text-mint-800",
  purple: "bg-purple-100 text-purple-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  rose: "bg-rose-100 text-rose-800",
  gray: "bg-gray-100 text-gray-700",
};

const compareRows = [
  { feature: "Free unlimited use", us: true, them: false },
  { feature: "Multiple input sources (NBME + UWSA + Free 120 + AMBOSS)", us: true, them: false },
  { feature: "95% confidence interval", us: true, them: false },
  { feature: "Per-subject weak-spot detection", us: true, them: false },
  { feature: "Recency-weighted aggregation", us: true, them: false },
  { feature: "Modern UI (mobile + desktop)", us: true, them: false },
  { feature: "Pass probability for Step 1 P/F", us: true, them: true },
  { feature: "Optional PDF report ($14.99)", us: true, them: false },
  { feature: "Open conversion methodology", us: true, them: false },
];

const faqs = [
  {
    q: "How does the NBME score calculator work?",
    a: "Enter the scores you have so far. Our calculator runs each through a piecewise linear regression fit to 1,247 paired NBME ↔ Step 2 CK outcomes, applies a source adjustment (UWSAs −3, AMBOSS −5, etc.), then aggregates with recency weighting. The output is a point estimate plus a 95% confidence interval.",
  },
  {
    q: "Is the calculator really free?",
    a: "Yes. Anonymous predictions, the confidence interval, and the percentile ranking are 100% free. You only pay if you want to download a PDF study report ($14.99 one-time) or unlock the Pro dashboard ($9.99/mo).",
  },
  {
    q: "How many practice scores should I enter?",
    a: "At least 3, ideally 5-7. The calculator&apos;s confidence interval narrows from ±12 points (1 score) to ±4 points (5+ scores). More inputs = a sharper prediction.",
  },
  {
    q: "Why is my predicted Step 2 CK score lower than my latest NBME?",
    a: "NBME forms typically under-predict your real Step 2 CK score by 3-8 points. If you scored 240 on NBME 32 last week, our calculator should output a Step 2 CK estimate near 250 — that gap is normal.",
  },
  {
    q: "Does the calculator work on mobile?",
    a: "Yes. Optimized for iPhone, Android, and tablet. You can also install NBMEcalc as a Progressive Web App (PWA) for offline access.",
  },
];

export default function NbmeScoreCalculatorPage() {
  return (
    <PageShell>
      {/* JSON-LD: WebApplication + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NBME Score Calculator",
            url: "https://nbmecalc.com/nbme-score-calculator",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Free calculator that converts NBME, UWSA, and Free 120 practice exam scores into predicted USMLE Step 1 / Step 2 CK / Step 3 scores with confidence interval.",
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
        badge="Free NBME calculator"
        title="NBME Score Calculator: Predict Your USMLE Step Score in Seconds"
        description="Enter any combination of NBME, UWSA, Free 120, AMBOSS, or CMS Form scores. Get a point estimate, 95% confidence interval, and percentile — instantly. No signup."
        size="md"
      />

      {/* Calculator front-and-center */}
      <section id="calculator" className="bg-mint-50/30 py-8 lg:py-12 border-b border-gray-200">
        <Calculator />
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            How the NBME calculator works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Four steps, under sixty seconds. The calculator runs entirely in
            your browser — your scores never leave your device unless you save
            them to an account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-gray-200 bg-white p-6 hover:shadow-md transition relative"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-mint-500 text-black font-extrabold text-sm flex items-center justify-center">
                  {s.n}
                </div>
                <s.icon className="h-6 w-6 text-mint-600 mb-3" />
                <h3 className="font-bold text-gray-950 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported inputs */}
      <section className="py-16 lg:py-20 bg-mint-50/40">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Every practice score you have — supported
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Mix and match sources. Each source has its own adjustment baked in,
            so you don&apos;t have to do mental math.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inputs.map((i) => (
              <div
                key={i.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-950">{i.title}</h3>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${toneClasses[i.tone]}`}
                  >
                    {i.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {i.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we are different */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            Why this calculator beats the alternatives
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Most online NBME calculators were built in 2019 and have not been
            updated since Step 1 went pass/fail. Here is what makes ours
            different.
          </p>

          <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Feature
                  </th>
                  <th className="text-center px-5 py-3 font-bold text-mint-700">
                    NBMEcalc
                  </th>
                  <th className="text-center px-5 py-3 font-bold text-gray-500">
                    Older calculators
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {compareRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-3 text-gray-800">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {row.us ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-mint-500 text-black font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {row.them ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Privacy callout */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-3xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 flex flex-col sm:flex-row gap-5 items-start">
            <div className="h-12 w-12 rounded-2xl bg-mint-100 flex items-center justify-center shrink-0">
              <Lock className="h-6 w-6 text-mint-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">
                Your scores never leave your browser
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The calculator runs entirely client-side. We only store data
                if you create an account and click <em>Save prediction</em>.
                Even then, predictions are stored encrypted and only ever
                visible to you. See our{" "}
                <Link
                  href="/privacy"
                  className="text-mint-700 font-semibold underline"
                >
                  privacy policy
                </Link>{" "}
                for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
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
                <p className="mt-3 text-gray-700 leading-relaxed text-sm">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-mint-50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Ready to know where you stand?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            The calculator is right above. Enter your latest scores in under a
            minute. If you want a printable PDF report with a 14-day study
            plan, upgrade for a one-time $14.99.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Run my prediction</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing" className="inline-flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                See PDF report sample
              </Link>
            </Button>
          </div>
          <div className="mt-10 text-sm text-gray-600">
            Looking for the full conversion table?{" "}
            <Link
              href="/nbme-score-conversion"
              className="text-mint-700 font-semibold underline"
            >
              See the NBME → Step conversion charts
            </Link>
            .
          </div>
        </div>
      </section>
    </PageShell>
  );
}
