import type { Metadata } from "next";
import Link from "next/link";
import { Check, Shield, Sparkles, Zap, Clock, FileText } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { Button } from "@/components/ui/button";
import { formatUsd, getLifetimeOffer } from "@/lib/lifetime-offer";

const lifetimeOffer = getLifetimeOffer();

export const metadata: Metadata = {
  title: "Pricing | Free, $14.99 Reports & Lifetime Access | NBMEcalc",
  description:
    "Try the USMLE Step score predictor free. Pay $14.99 for one PDF report or make one payment for unlimited Lifetime tracking.",
  alternates: { canonical: "https://nbmecalc.com/pricing" },
  openGraph: {
    title: "NBMEcalc Pricing | Free, Single Report, or Lifetime",
    description:
      "Transparent USMLE score predictor pricing with one-time payments and no recurring subscription.",
    url: "https://nbmecalc.com/pricing",
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

const trustItems = [
  {
    icon: Shield,
    title: "No recurring charges",
    body: "Single Report and Lifetime are both one-time purchases. Nothing renews automatically.",
  },
  {
    icon: FileText,
    title: "One payment, lasting access",
    body: "Lifetime keeps your account unlocked without monthly or annual billing.",
  },
  {
    icon: Zap,
    title: "Instant delivery",
    body: "Single Reports arrive in your inbox within 60 seconds of payment.",
  },
];

const detailedFeatures = [
  { name: "Multi-source predictor (NBME + UWSA + Free 120)", free: true, single: true, lifetime: true },
  { name: "Estimated planning range", free: true, single: true, lifetime: true },
  { name: "Model summary and assumptions", free: true, single: true, lifetime: true },
  { name: "Pass-probability indicator", free: true, single: true, lifetime: true },
  { name: "Predictions saved to dashboard", free: false, single: true, lifetime: true },
  { name: "Downloadable PDF report (3 pages)", free: false, single: true, lifetime: true },
  { name: "Readiness discussion guide + reverse triggers", free: false, single: true, lifetime: true },
  { name: "3 highest-leverage moves for your input pattern", free: false, single: true, lifetime: true },
  { name: "Model assumptions and scenario breakdown", free: false, single: true, lifetime: true },
  { name: "Anti-patterns: counter-intuitive things NOT to do", free: false, single: true, lifetime: true },
  { name: "Score trajectory analysis + subject-level weakness map", free: false, single: true, lifetime: true },
  { name: "Unlimited predictions & refreshes", free: false, single: false, lifetime: true },
  { name: "Multi-Step tracking (1, 2 CK, 3)", free: false, single: false, lifetime: true },
  { name: "Real-time score timeline", free: false, single: false, lifetime: true },
  { name: "Priority email support", free: false, single: false, lifetime: true },
  { name: "Ongoing updates to core features", free: false, single: false, lifetime: true },
];

const refundFAQ = [
  {
    q: "Can I get a refund?",
    a: "No. All sales are final. Single Report and Lifetime are digital products delivered immediately and are non-refundable. Please confirm your selected product before paying.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use Stripe Checkout. All major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and Link are supported. We never see or store your card.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We never sell your data. We collect only your email and the scores you input. You can export everything as JSON or delete your account at any time. Read our Privacy Policy for details.",
  },
  {
    q: "Do you offer discounts for IMGs / students?",
    a: "The current $19.99 Lifetime founding price is our thank-you to early supporters during NBMEcalc's founding stage. It may return to the standard $34.99 price for future buyers, but purchased Lifetime access remains unchanged.",
  },
  {
    q: "Can I upgrade from Single Report to Lifetime?",
    a: "Yes. Lifetime can be purchased later from this page. A previous Single Report purchase is not automatically credited toward Lifetime.",
  },
  {
    q: "What does Lifetime include in the future?",
    a: "Lifetime includes ongoing updates to NBMEcalc's core prediction, tracking, and reporting features. Major standalone products or services introduced later may be priced separately.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No. The price you see is the total price. No transaction fees, no setup fees, no upgrade fees. Stripe handles all currency conversion at market rates.",
  },
];

function CheckOrDash({ on }: { on: boolean }) {
  if (on) {
    return <Check className="h-5 w-5 text-mint-500 mx-auto" aria-label="Included" />;
  }
  return <span className="text-gray-300 mx-auto block w-fit" aria-label="Not included">-</span>;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "NBMEcalc Pricing",
  url: "https://nbmecalc.com/pricing",
  description:
    "Transparent USMLE score predictor pricing with one-time payments.",
  mainEntity: {
    "@type": "Product",
    name: "NBMEcalc USMLE Step Score Predictor",
    description:
      "Multi-source USMLE Step score predictor with confidence intervals, PDF reports, and personalized study plans.",
    brand: { "@type": "Brand", name: "NBMEcalc" },
    offers: [
      {
        "@type": "Offer",
        name: "Free Tier",
        price: "0",
        priceCurrency: "USD",
        url: "https://nbmecalc.com/pricing",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Single Report",
        price: "14.99",
        priceCurrency: "USD",
        url: "https://nbmecalc.com/pricing",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: lifetimeOffer.active ? "Lifetime Access (Founding Offer)" : "Lifetime Access",
        price: formatUsd(lifetimeOffer.priceCents).replace("$", ""),
        priceCurrency: "USD",
        url: "https://nbmecalc.com/pricing",
        availability: "https://schema.org/InStock",
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        badge="Pricing"
        title="Simple, transparent pricing"
        description="Start free. Pay once when you need a downloadable report or unlimited tracking. No subscriptions. No hidden fees."
        size="md"
      />

      {/* Reuse main Pricing cards section */}
      <Pricing />

      {/* Trust strip */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {trustItems.map((t) => (
              <div key={t.title} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-mint-50 flex items-center justify-center mb-4">
                  <t.icon className="h-6 w-6 text-mint-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed comparison table */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-5xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-center mb-4">
            Compare every feature
          </h2>
          <p className="text-center text-gray-600 mb-12">
            See exactly what you get at each tier before making a one-time purchase.
          </p>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-5 text-left font-bold text-gray-900 w-1/2">Feature</th>
                  <th className="px-4 py-5 font-bold text-gray-700">Free</th>
                  <th className="px-4 py-5 font-bold text-gray-700">Single Report</th>
                  <th className="px-4 py-5 font-bold text-mint-700">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Lifetime
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailedFeatures.map((f, i) => (
                  <tr
                    key={f.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-6 py-3.5 text-gray-700">{f.name}</td>
                    <td className="px-4 py-3.5 text-center">
                      <CheckOrDash on={f.free} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CheckOrDash on={f.single} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CheckOrDash on={f.lifetime} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/#calculator">Try Free Predictor</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/#calculator">Start with Single Report</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing-specific FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-center mb-4">
            Pricing FAQ
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Have a billing question? Most answers live below. Otherwise, email{" "}
            <Link href="/contact" className="text-mint-700 font-semibold underline">
              hello@nbmecalc.com
            </Link>
            .
          </p>

          <div className="space-y-3">
            {refundFAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-gray-200 bg-white"
              >
                <summary className="flex items-center justify-between px-6 py-4 font-semibold text-gray-900 cursor-pointer list-none">
                  <span>{item.q}</span>
                  <Clock className="h-4 w-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse main FAQ for general questions */}
      <FAQ />
    </PageShell>
  );
}
