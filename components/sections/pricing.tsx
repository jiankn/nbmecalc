"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";
import { formatUsd, getLifetimeOffer } from "@/lib/lifetime-offer";
import { LIFETIME_OFFER_BAR_SOURCE } from "@/lib/lifetime-offer-bar";

const standardPlans = [
  {
    kind: "free" as const,
    name: "Free",
    description: "Try your first prediction. No account needed.",
    price: "$0",
    cta: "Start Free",
    ctaHref: "/#calculator",
    features: [
      "1 score prediction",
      "Estimated planning range",
      "Percentile ranking",
      "Basic result summary",
    ],
    excluded: [
      "PDF report download",
      "Readiness discussion guide",
      "Multi-Step tracking",
      "Unlimited refreshes",
    ],
  },
  {
    kind: "single" as const,
    name: "Single Report",
    description: "One complete PDF with your full breakdown.",
    price: "$14.99",
    cta: "Calculate to unlock",
    ctaHref: "/#calculator",
    features: [
      "Everything in Free",
      "Downloadable PDF report",
      "Readiness discussion guide",
      "Subject-level weakness map",
      "Score trajectory analysis",
    ],
    excluded: ["Multi-Step tracking", "Unlimited refreshes"],
  },
];

const lifetimeFeatures = [
  "Everything in Single Report",
  "Unlimited predictions & refreshes",
  "Multi-Step tracking (1, 2 CK, 3)",
  "Real-time score timeline",
  "Priority support",
  "Ongoing updates to core features",
];

export function Pricing() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const offer = getLifetimeOffer();
  const router = useRouter();
  const hasLifetime =
    session.status === "authed" && session.user.lifetimeAccess;

  async function startLifetimeCheckout() {
    if (submitting) return;
    setError(null);

    const checkoutSource =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("source") ===
        LIFETIME_OFFER_BAR_SOURCE
        ? LIFETIME_OFFER_BAR_SOURCE
        : undefined;
    const returnToPricing = checkoutSource
      ? `/pricing?source=${checkoutSource}#pricing`
      : "/pricing";

    if (session.status === "anon") {
      router.push(`/login?next=${encodeURIComponent(returnToPricing)}`);
      return;
    }
    if (session.status === "loading") return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "lifetime", checkoutSource }),
      });
      const json = (await response.json()) as { url?: string; error?: string };
      if (response.status === 401) {
        router.push(`/login?next=${encodeURIComponent(returnToPricing)}`);
        return;
      }
      if (!response.ok || !json.url) {
        setError(json.error ?? "Couldn't start checkout. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const foundingOffer = offer.active;
  const lifetimePrice = formatUsd(offer.priceCents);
  const regularPrice = formatUsd(offer.regularPriceCents);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="container">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Start free. Pay once when you need a full report or unlimited
          tracking. No subscriptions or recurring charges.
        </p>

        {error && (
          <div className="max-w-md mx-auto mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {standardPlans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 flex flex-col hover:shadow-lg"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black tracking-tight text-gray-950">
                  {plan.price}
                </span>
                {plan.kind === "single" && (
                  <span className="ml-2 text-xs font-semibold text-gray-600">
                    one-time
                  </span>
                )}
              </div>
              <Button
                variant={plan.kind === "single" ? "primary" : "outline"}
                size="lg"
                className="w-full mb-8"
                asChild
              >
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>
              <FeatureList features={plan.features} excluded={plan.excluded} />
            </div>
          ))}

          <div className="relative rounded-3xl border border-mint-400 bg-white p-8 shadow-xl shadow-mint-500/10 md:scale-[1.03] z-10 flex flex-col">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-800 px-4 py-1.5 text-xs font-bold text-white shadow-sm whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5" />
                {foundingOffer ? "Founding Offer" : "Most popular"}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Lifetime</h3>
              <p className="text-sm text-gray-500">
                {foundingOffer
                  ? "Our thank-you price for early supporters."
                  : "One payment for unlimited Step tracking."}
              </p>
            </div>

            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-gray-950">
                  {lifetimePrice}
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  one-time
                </span>
              </div>
              {foundingOffer && (
                <div className="mt-1 text-sm text-gray-500">
                  <span className="line-through">{regularPrice}</span>{" "}
                  regular price
                </div>
              )}
            </div>

            {foundingOffer && (
              <div className="mb-5 rounded-2xl border border-mint-200 bg-mint-50 p-4 text-sm text-mint-950">
                <p className="font-bold">Founding access, not a trial.</p>
                <p className="mt-1 text-xs leading-relaxed text-mint-900">
                  Pay once and keep NBMEcalc&apos;s core prediction, tracking,
                  and reporting features unlocked.
                </p>
              </div>
            )}

            {hasLifetime ? (
              <Button variant="outline" size="lg" className="w-full mb-8" asChild>
                <Link href="/dashboard">Lifetime access active</Link>
              </Button>
            ) : (
              <Button
                variant="mint"
                size="lg"
                className="w-full mb-8 inline-flex items-center justify-center gap-2"
                onClick={startLifetimeCheckout}
                disabled={submitting || session.status === "loading"}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting…
                  </>
                ) : session.status === "anon" ? (
                  "Get Lifetime. Sign in next"
                ) : (
                  "Get Lifetime Access"
                )}
              </Button>
            )}

            <FeatureList features={lifetimeFeatures} excluded={[]} />
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-10 max-w-xl mx-auto">
          All prices in USD. One-time payments only. All sales are final.
          Digital products are non-refundable.
        </p>
      </div>
    </section>
  );
}

function FeatureList({
  features,
  excluded,
}: {
  features: string[];
  excluded: string[];
}) {
  return (
    <ul className="space-y-3 mt-auto">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm">
          <Check className="h-4 w-4 mt-0.5 shrink-0 text-mint-500" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
      {excluded.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-2.5 text-sm text-gray-600"
        >
          <Check className="h-4 w-4 mt-0.5 shrink-0 text-gray-300" />
          <span className="line-through decoration-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
