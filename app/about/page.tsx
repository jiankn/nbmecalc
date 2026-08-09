import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, Target } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Reviewers } from "@/components/sections/reviewers";
import { Stats } from "@/components/sections/stats";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About NBMEcalc — Independent Score Planning Tool",
  description:
    "Why NBMEcalc exists, what the independent model can and cannot claim, and how corrections and methodology changes are handled.",
  alternates: { canonical: "https://nbmecalc.com/about" },
  openGraph: {
    title: "About NBMEcalc — Independent Score Planning Tool",
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
    body: "The methodology and material changes are public. Claims without reproducible evidence are labelled as assumptions or removed.",
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
    title: "Public methodology",
    body: "Model assumptions, official-source checks, limitations, and material changes are documented for every visitor.",
  },
  {
    year: "2026 Q2",
    title: "Public launch",
    body: "Free tier opens to all. Single Report and Lifetime launch with PDF delivery, multi-Step tracking, and transparent planning ranges.",
  },
  {
    year: "2026 H2",
    title: "Holdout validation",
    body: "After enough consented outcomes are collected, publish inclusion rules, error metrics, range coverage, and a locked holdout evaluation before making accuracy claims.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About NBMEcalc",
            url: "https://nbmecalc.com/about",
            dateModified: "2026-08-09",
            mainEntity: {
              "@type": "Organization",
              name: "NBMEcalc",
              url: "https://nbmecalc.com",
            },
          }),
        }}
      />
      <PageHero
        badge="About NBMEcalc"
        title="An Independent Score Planning Tool"
        description="NBMEcalc combines practice inputs into a planning range. It is not an official score report, and it does not claim a validated cohort until the underlying dataset can be reproduced."
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

      <section className="border-y border-gray-200 bg-mint-50/40 py-14">
        <div className="container max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint-800">
            Trust and review path
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950">
            Check the evidence before using the estimate
          </h2>
          <p className="mt-3 max-w-3xl text-gray-700">
            These pages separate official facts from internal assumptions,
            show what has and has not been validated, and provide a review path
            for educators and readers.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Methodology", "/methodology", "Sources, assumptions, and corrections"],
              ["Validation", "/validation", "Protocol and current evidence status"],
              ["For educators", "/educators", "Institutional review information"],
              ["NBME guide", "/nbme-calculator", "Assessment families and report use"],
              ["Editorial library", "/blog", "Source-checked exam preparation articles"],
            ].map(([title, href, body]) => (
              <Link
                key={href}
                href={href}
                data-indexing-context="related"
                className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-mint-400"
              >
                <span className="font-bold text-gray-950">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                  {body}
                </span>
              </Link>
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
