import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, FileText, Quote } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Press Kit — NBMEcalc",
  description:
    "Press resources, brand assets, founder bios, and approved quotes for journalists writing about NBMEcalc.",
  alternates: { canonical: "https://nbmecalc.com/press" },
  openGraph: {
    title: "Press Kit — NBMEcalc",
    description:
      "Press resources, brand assets, founder bios, and approved quotes for journalists writing about NBMEcalc.",
    url: "https://nbmecalc.com/press",
    type: "website",
  },
};

const quickFacts = [
  { label: "Product", value: "USMLE Step score predictor (web)" },
  { label: "Founded", value: "2025" },
  { label: "HQ", value: "Remote (US-based)" },
  { label: "Team size", value: "Solo founder + 3 medical advisors" },
  { label: "Free users", value: "10,000+ predictions run" },
  { label: "Revenue model", value: "Freemium ($14.99 reports, $9.99/mo Pro)" },
  { label: "Tech stack", value: "Next.js, Cloudflare Pages, Stripe" },
  { label: "Affiliations", value: "Independent — not NBME / USMLE / Kaplan" },
];

const quotes = [
  {
    quote:
      "Most score predictors give you a single number with no transparency. We always show a confidence interval — because medicine is about probability, not certainty.",
    attribution: "Founder, NBMEcalc",
  },
  {
    quote:
      "Our pricing tiers are deliberately small. We never want a med student stuck deciding whether $14.99 is worth seeing if they will pass.",
    attribution: "Founder, NBMEcalc",
  },
];

const assets = [
  {
    title: "Logo (SVG)",
    description: "Full color logo for light backgrounds",
    href: "/icon.svg",
  },
  {
    title: "Logo mark only (SVG)",
    description: "Square mark for avatars or favicons",
    href: "/apple-icon.svg",
  },
];

export default function PressPage() {
  return (
    <PageShell>
      <PageHero
        badge="Press kit"
        title="Press &amp; media resources"
        description="Everything you need to write about NBMEcalc accurately. We respond to press inquiries within 24 hours."
        size="md"
      />

      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          {/* Quick facts */}
          <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden mb-12">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-mint-600" />
                Quick facts
              </h2>
            </div>
            <dl className="divide-y divide-gray-100">
              {quickFacts.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 px-6 py-3.5 text-sm"
                >
                  <dt className="font-bold text-gray-900">{f.label}</dt>
                  <dd className="md:col-span-2 text-gray-700">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Boilerplate */}
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Boilerplate
          </h2>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-12">
            <p className="text-gray-800 leading-relaxed text-sm">
              <strong>NBMEcalc</strong> is a free USMLE Step score predictor
              that converts NBME, UWSA, Free 120, AMBOSS, and CMS Form scores
              into a likely Step 1, Step 2 CK, or Step 3 score with a 95%
              confidence interval. Founded in 2025, the product is built and
              maintained as an independent educational project with a public
              methodology and corrections process. NBMEcalc is not affiliated
              with the NBME, USMLE, FSMB, UWorld, AMBOSS, or Kaplan.
            </p>
          </div>

          {/* Approved quotes */}
          <h2 className="text-2xl font-extrabold tracking-tight mb-3 flex items-center gap-2">
            <Quote className="h-5 w-5 text-mint-600" />
            Approved quotes
          </h2>
          <div className="space-y-4 mb-12">
            {quotes.map((q, i) => (
              <blockquote
                key={i}
                className="rounded-2xl border-l-4 border-mint-400 bg-mint-50/50 px-6 py-5"
              >
                <p className="text-gray-800 italic leading-relaxed mb-2">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <footer className="text-sm font-semibold text-mint-700">
                  — {q.attribution}
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Brand assets */}
          <h2 className="text-2xl font-extrabold tracking-tight mb-3 flex items-center gap-2">
            <Download className="h-5 w-5 text-mint-600" />
            Brand assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {assets.map((a) => (
              <a
                key={a.href}
                href={a.href}
                download
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 hover:shadow-md transition flex items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-mint-50 flex items-center justify-center shrink-0">
                  <LogoMark size={32} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 mb-0.5">
                    {a.title}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {a.description}
                  </div>
                </div>
                <Download className="h-4 w-4 text-gray-400 ml-auto shrink-0" />
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-12">
            Brand color:{" "}
            <code className="font-mono bg-gray-100 px-2 py-0.5 rounded">
              #34D399
            </code>{" "}
            (mint-500). Primary font:{" "}
            <strong>Plus Jakarta Sans</strong>. Please do not modify the logo
            or recolor it.
          </p>

          {/* Contact CTA */}
          <div className="rounded-3xl bg-mint-500 text-black p-8 text-center">
            <h3 className="text-2xl font-extrabold mb-2">
              Working on a story?
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              We respond to press inquiries within 24 hours, including
              interview requests, fact-checking, and exclusive data shares.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="mailto:press@nbmecalc.com" className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  press@nbmecalc.com
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/contact">All contact channels</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
