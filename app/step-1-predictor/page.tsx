import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Calculator } from "@/components/sections/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title:
    "Step 1 Predictor — Pass Probability Calculator (Free) | NBMEcalc",
  description:
    "Free Step 1 predictor that calculates your USMLE Step 1 pass probability from NBME, UWSA, and Free 120 scores. Step 1 is pass/fail since 2022 — know your margin before test day.",
  keywords: [
    "step 1 predictor",
    "usmle step 1 calculator",
    "step 1 pass probability",
    "nbme to step 1",
    "uwsa 1 to step 1",
    "step 1 pass fail",
  ],
  alternates: { canonical: "https://nbmecalc.com/step-1-predictor" },
  openGraph: {
    title: "Step 1 Predictor — Pass Probability Calculator (Free)",
    description:
      "Calculate your USMLE Step 1 pass probability from any combination of NBME, UWSA, and Free 120 scores.",
    url: "https://nbmecalc.com/step-1-predictor",
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

const passBands = [
  {
    range: "≥ 215",
    prob: "99%",
    color: "mint",
    label: "Very safe",
    advice:
      "Coast mode. Maintain with random UWorld mixed blocks. Avoid burnout.",
  },
  {
    range: "200-214",
    prob: "95-98%",
    color: "mint",
    label: "Safe",
    advice:
      "Good buffer. Spend remaining time on highest-yield weak spots (pharm, micro).",
  },
  {
    range: "190-199",
    prob: "85-94%",
    color: "blue",
    label: "Likely pass",
    advice:
      "Comfortable but not certain. Two more NBMEs in the next 3 weeks will tighten the picture.",
  },
  {
    range: "180-189",
    prob: "65-84%",
    color: "amber",
    label: "Borderline",
    advice:
      "1 in 5 students at this level fail. Consider pushing your test date back 2-3 weeks.",
  },
  {
    range: "170-179",
    prob: "35-64%",
    color: "rose",
    label: "Coin flip",
    advice:
      "Strong recommendation: delay 4+ weeks, switch to content-review mode (First Aid + Sketchy + dedicated UWorld).",
  },
  {
    range: "< 170",
    prob: "< 35%",
    color: "rose",
    label: "High risk",
    advice:
      "Do not take the exam yet. Build a 6-8 week intensive plan and re-evaluate.",
  },
];

const bandColors: Record<string, string> = {
  mint: "bg-mint-50 border-mint-200 text-mint-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
};

const matters = [
  {
    icon: Target,
    title: "Failing has consequences",
    body: "A Step 1 fail appears on your USMLE transcript permanently. Roughly 50% of failers don&apos;t match into competitive specialties even after passing on retake.",
  },
  {
    icon: TrendingUp,
    title: "Step 2 CK is now the screening score",
    body: "Programs use Step 2 CK as the primary numeric filter. But a Step 1 fail still flags applicants in the same way a low GPA does.",
  },
  {
    icon: ShieldAlert,
    title: "IMGs face higher scrutiny",
    body: "International medical graduates without a US clinical year are especially affected — Step 1 first-attempt result is one of the strongest filtering signals.",
  },
];

const faqs = [
  {
    q: "What is a passing score on Step 1 now?",
    a: "Step 1 is pass/fail. There is no three-digit score on your transcript anymore. NBME uses a single internal threshold (around 196 equated) — if you cross it, you pass.",
  },
  {
    q: "How predictive is my NBME score for passing Step 1?",
    a: "Very. Students scoring ≥ 200 on NBME 30, 31, or 32 within two weeks of test day have a > 95% pass rate. Below 180, the pass rate drops below 60%.",
  },
  {
    q: "Does the calculator account for the new pass/fail format?",
    a: "Yes. Our model converts your inputs to an equated three-digit score, compares it to the current pass threshold, then outputs a pass probability with a 95% confidence interval.",
  },
  {
    q: "Should I take Step 1 if my latest NBME is below 200?",
    a: "It depends on your timeline and trajectory. If three NBMEs in a row are below 200 and you have not improved despite full dedicated, push the date. If you went from 175 → 198 in four weeks, you are on the trajectory to pass.",
  },
  {
    q: "Can I retake Step 1 if I fail?",
    a: "Yes, up to four attempts total per the latest USMLE policy. But each fail appears on your transcript and is visible to residency programs. Plan to pass on attempt one.",
  },
];

export default function Step1PredictorPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Step 1 Predictor",
            url: "https://nbmecalc.com/step-1-predictor",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free USMLE Step 1 pass probability calculator. Combines NBME, UWSA, and Free 120 scores into a single pass probability estimate with confidence interval.",
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
        badge="Step 1 is pass/fail"
        title="Step 1 Predictor: Calculate Your Pass Probability"
        description="Step 1 went pass/fail in January 2022. The number on your NBME no longer maps to a three-digit transcript score — but it still maps to a pass probability. Find yours below."
        size="md"
      />

      {/* Risk callout */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="container max-w-3xl flex gap-4 items-start">
          <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-amber-900 mb-1">
              Pass/fail does not mean low-stakes
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Failing Step 1 stays on your transcript permanently and is
              visible to every residency program you apply to. A pass with no
              margin and a fail look similar on paper — but a comfortable
              pass-rate prediction protects you from a bad test-day surprise.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-12 bg-white">
        <div className="container max-w-3xl mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-2">
            Run the Step 1 calculator
          </h2>
          <p className="text-gray-600">
            Pick <strong>Step 1</strong> in the form below, add your NBME /
            UWSA / Free 120 scores, and submit. The result shows your pass
            probability and equated three-digit score.
          </p>
        </div>
        <Calculator defaultStep="step1" />
      </section>

      {/* Worked example */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
            A worked example
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Say you sat three assessments in your final three weeks:{" "}
            <strong>NBME 30 = 201</strong>, <strong>NBME 31 = 197</strong>, and{" "}
            <strong>UWSA 1 = 208</strong>. The model equates each form to a common
            scale, weights your most recent results more heavily, and reports a
            range rather than a single number — so one slightly lower form does
            not sink the estimate. This profile lands in the{" "}
            <strong>~95–98% pass band</strong>: a comfortable pass with margin,
            where the right move is to maintain rather than cram.
          </p>
          <p className="text-sm text-gray-500 italic">
            Illustrative only — your own result depends on your exact forms,
            dates, and how closely they cluster. See the{" "}
            <Link
              href="/methodology"
              className="text-mint-700 underline underline-offset-2"
            >
              methodology
            </Link>{" "}
            for the assumptions behind the model.
          </p>
        </div>
      </section>

      {/* Pass bands */}
      <section className="py-16 lg:py-20 bg-mint-50/30">
        <div className="container max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Step 1 pass-probability bands
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mb-10">
            Independent model bands for planning only. Step 1 is pass/fail;
            use the probability and readiness guidance in your official CBSSA
            report as the primary source.
          </p>

          <div className="space-y-3">
            {passBands.map((b) => (
              <div
                key={b.range}
                className={`rounded-3xl border p-5 flex flex-col sm:flex-row gap-4 sm:items-center ${bandColors[b.color]}`}
              >
                <div className="sm:w-28 shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">
                    Equated
                  </div>
                  <div className="text-2xl font-extrabold">{b.range}</div>
                </div>
                <div className="sm:w-32 shrink-0">
                  <div className="text-xs font-bold uppercase opacity-70">
                    Pass prob.
                  </div>
                  <div className="text-xl font-extrabold">{b.prob}</div>
                </div>
                <div className="sm:w-28 shrink-0">
                  <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
                    {b.label}
                  </span>
                </div>
                <div className="flex-1 text-sm leading-relaxed">
                  {b.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why score still matters */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            Why Step 1 still matters even when pass/fail
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Some students hear &quot;pass/fail&quot; and assume the exam is no
            longer high-stakes. That is wrong. Here is why.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matters.map((m) => (
              <div
                key={m.title}
                className="rounded-3xl border border-gray-200 bg-white p-6"
              >
                <m.icon className="h-6 w-6 text-mint-600 mb-3" />
                <h3 className="font-bold mb-1">{m.title}</h3>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: m.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy block */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            What to do based on your prediction
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>≥ 95% pass probability:</strong> Stop adding study time.
              Sleep, exercise, and run two random UWorld blocks a day for
              calibration. Reschedule is unnecessary.
            </p>
            <p>
              <strong>85-95% pass probability:</strong> One more NBME 7-10
              days out. If trajectory is flat, take the exam. If it&apos;s
              dropping, push 1-2 weeks.
            </p>
            <p>
              <strong>65-85% pass probability:</strong> Move the test back 2-3
              weeks. Use a structured 14-day plan: identify your three weakest
              subjects, do 80 questions/day in those, and re-take NBME 31 or
              32.
            </p>
            <p>
              <strong>&lt; 65% pass probability:</strong> Move the test back at
              least 4 weeks. Switch to content-review mode: First Aid +
              Sketchy + Pathoma. Do not just grind UWorld.
            </p>
            <p className="text-sm text-gray-500 italic">
              All recommendations assume you have ≥ 3 weeks of dedicated
              remaining. If less, be more conservative.
            </p>
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="py-12 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-extrabold mb-4">Related Step 1 tools</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-mint-700 font-semibold">
            <li>
              <Link
                href="/uwsa-1-to-step-1"
                className="underline underline-offset-2"
              >
                Convert UWSA 1 to a Step 1 estimate
              </Link>
            </li>
            <li>
              <Link
                href="/free-120-predictor"
                className="underline underline-offset-2"
              >
                Free 120 predictor
              </Link>
            </li>
            <li>
              <Link
                href="/nbme-score-conversion"
                className="underline underline-offset-2"
              >
                Full NBME score conversion tables
              </Link>
            </li>
            <li>
              <Link
                href="/step-2-predictor"
                className="underline underline-offset-2"
              >
                Step 2 CK predictor
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">
            Step 1 predictor FAQs
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
      <section className="py-16 bg-mint-50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Know your Step 1 pass margin
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Three NBMEs plus your latest UWSA gives you a tight prediction. Run
            yours now — free, no signup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="#calculator">Predict my Step 1</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">
                Working on Step 2 CK instead?
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
