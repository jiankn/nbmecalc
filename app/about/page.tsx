import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, Target } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Reviewers } from "@/components/sections/reviewers";
import { Stats } from "@/components/sections/stats";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Built by Med Students, Reviewed by Doctors | NBMEcalc",
  description:
    "Why we built NBMEcalc, who reviews our algorithm, and our principles for honest USMLE Step score prediction. Not affiliated with NBME.",
  alternates: { canonical: "https://nbmecalc.com/about" },
  openGraph: {
    title: "About — Built by Med Students, Reviewed by Doctors | NBMEcalc",
    description:
      "Why we built NBMEcalc, who reviews our algorithm, and our principles for honest USMLE Step score prediction.",
    url: "https://nbmecalc.com/about",
    type: "website",
  },
};

const principles = [
  {
    icon: Target,
    title: "Honesty over hype",
    body: "We show confidence intervals, not a single &quot;magic&quot; number. We tell you when our model is uncertain.",
  },
  {
    icon: ShieldCheck,
    title: "Independent of NBME",
    body: "We build models from public conversion data and aggregated user-submitted scores. We are not affiliated with the NBME or USMLE.",
  },
  {
    icon: Heart,
    title: "Built for you, not advertisers",
    body: "We will never sell your data. The only way we make money is by you choosing to upgrade — and we make sure that choice is worth it.",
  },
  {
    icon: Sparkles,
    title: "Algorithm transparency",
    body: "Pricing customers can read the methodology. Big algorithm changes get reviewed by practicing physicians before shipping.",
  },
];

const timeline = [
  {
    year: "2025 Q4",
    title: "Idea & first prototype",
    body: "Frustrated with closed-source predictors and one-size-fits-all advice, the founder built a multi-source predictor in a weekend.",
  },
  {
    year: "2026 Q1",
    title: "Medical advisor team",
    body: "Three practicing physicians joined as part-time reviewers to vet our conversion tables and study-plan logic.",
  },
  {
    year: "2026 Q2",
    title: "Public launch",
    body: "Free tier opens to all. Single Report and Pro plans launch with PDF delivery, multi-Step tracking, and confidence intervals.",
  },
  {
    year: "2026 H2",
    title: "ML predictor v2",
    body: "Once we collect 1,000+ real outcome pairs, we replace the linear model with a gradient-boosted tree and re-validate.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        badge="About NBMEcalc"
        title="Built by med students. Reviewed by doctors. Honest by design."
        description="We&apos;re tired of black-box predictors and aggressive paywalls. NBMEcalc is what we wish existed when we sat for our first NBME."
        size="md"
      />

      {/* Principles */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-3xl border border-gray-200 bg-white p-7 hover:shadow-md transition"
              >
                <div className="h-11 w-11 rounded-2xl bg-mint-100 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-mint-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats from homepage */}
      <Stats />

      {/* Story / timeline */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-center">
            How we got here
          </h2>
          <p className="text-center text-gray-600 mb-12">
            A short, honest timeline. We&apos;ll keep updating this page.
          </p>

          <ol className="relative border-l-2 border-mint-200 ml-3 space-y-10">
            {timeline.map((t) => (
              <li key={t.year} className="pl-7 relative">
                <span className="absolute -left-[10px] top-1 h-4 w-4 rounded-full bg-mint-500 ring-4 ring-mint-100" />
                <div className="text-xs font-bold uppercase tracking-wider text-mint-700 mb-1">
                  {t.year}
                </div>
                <h3 className="text-lg font-bold text-gray-950 mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviewers from homepage */}
      <Reviewers />

      {/* Call to action */}
      <section className="py-16 lg:py-24 bg-mint-50">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-balance">
            Got feedback or a partnership idea?
          </h2>
          <p className="text-gray-600 mb-8">
            We read every email. Reach the founder directly at{" "}
            <a
              href="mailto:hello@nbmecalc.com"
              className="text-mint-700 font-semibold underline"
            >
              hello@nbmecalc.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/#calculator">Try the predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
