import type { Metadata } from "next";
import Link from "next/link";
import { Check, Shield, Sparkles, Zap, Clock, FileText } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing — Free Predictor + $14.99 Reports + $9.99 Pro | NBMEcalc",
  description:
    "Try the USMLE Step score predictor free. Pay $14.99 for a single PDF report or $9.99/mo for unlimited Pro tracking. No auto-renewal traps. Cancel anytime.",
  alternates: { canonical: "https://nbmecalc.com/pricing" },
  openGraph: {
    title: "NBMEcalc Pricing — Free, $14.99 Single Report, $9.99/mo Pro",
    description:
      "Transparent USMLE score predictor pricing. Cancel anytime. Real medical advisors review every algorithm change.",
    url: "https://nbmecalc.com/pricing",
    type: "website",
  },
};

const trustItems = [
  {
    icon: Shield,
    title: "No auto-renewal traps",
    body: "We email you 7 days before any renewal. Cancel in one click from your dashboard.",
  },
  {
    icon: FileText,
    title: "Cancel anytime",
    body: "Stop a Pro subscription whenever — you keep access until your billing period ends.",
  },
  {
    icon: Zap,
    title: "Instant delivery",
    body: "Single Reports arrive in your inbox within 60 seconds of payment.",
  },
];

const detailedFeatures = [
  { name: "Multi-source predictor (NBME + UWSA + Free 120)", free: true, single: true, pro: true },
  { name: "95% confidence interval", free: true, single: true, pro: true },
  { name: "Percentile ranking vs. cohort", free: true, single: true, pro: true },
  { name: "Pass-probability indicator", free: true, single: true, pro: true },
  { name: "Predictions saved to dashboard", free: false, single: true, pro: true },
  { name: "Downloadable PDF report (8 pages)", free: false, single: true, pro: true },
  { name: "Subject-level weakness map", free: false, single: true, pro: true },
  { name: "14-day personalized study plan", free: false, single: true, pro: true },
  { name: "Score trajectory analysis", free: false, single: true, pro: true },
  { name: "Unlimited predictions & refreshes", free: false, single: false, pro: true },
  { name: "Multi-Step tracking (1, 2 CK, 3)", free: false, single: false, pro: true },
  { name: "Real-time score timeline", free: false, single: false, pro: true },
  { name: "Priority email support", free: false, single: false, pro: true },
  { name: "All future Pro features included", free: false, single: false, pro: true },
];

const refundFAQ = [
  {
    q: "Can I get a refund?",
    a: "Digital products (Single Reports) are non-refundable once delivered, since you've already received the value. For Pro subscriptions, we offer a 7-day refund window if you haven't downloaded a report — just email us.",
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
    a: "Pro is already priced as low as we can sustainably go. We periodically run discounts during USMLE peak seasons — subscribe to our newsletter to get notified.",
  },
  {
    q: "Can I upgrade from Single Report to Pro?",
    a: "Yes. The amount you paid for the Single Report ($14.99) is credited toward your first Pro month. Just email us within 30 days of your Single Report purchase.",
  },
  {
    q: "What happens after I cancel Pro?",
    a: "You keep full access until the end of your current billing period. After that, your dashboard switches to read-only mode — past predictions stay viewable, but no new ones can be created.",
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
  return <span className="text-gray-300 mx-auto block w-fit" aria-label="Not included">—</span>;
}

export default function PricingPage() {
  return (
    <PageShell>
      <PageHero
        badge="Pricing"
        title="Simple, transparent pricing"
        description="Start free. Pay only when you need a downloadable report or ongoing tracking. No auto-renewal traps. No hidden fees."
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
            See exactly what you get at each tier. Upgrade or downgrade anytime.
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
                      Pro
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
                      <CheckOrDash on={f.pro} />
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
