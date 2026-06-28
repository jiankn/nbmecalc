"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";
import { cn } from "@/lib/utils";

type FreePlan = {
  kind: "free";
  name: string;
  description: string;
  price: string;
  cta: string;
  ctaHref: string;
  features: string[];
  excluded: string[];
};

type SinglePlan = {
  kind: "single";
  name: string;
  description: string;
  price: string;
  cta: string;
  ctaHref: string;
  features: string[];
  excluded: string[];
};

type ProPlan = {
  kind: "pro";
  name: string;
  description: string;
  priceMonthly: string;
  priceAnnual: string;
  features: string[];
  excluded: string[];
};

type PlanCard = FreePlan | SinglePlan | ProPlan;

const plans: PlanCard[] = [
  {
    kind: "free",
    name: "Free",
    description: "Try your first prediction — no account needed.",
    price: "$0",
    cta: "Start Free",
    ctaHref: "/#calculator",
    features: [
      "1 score prediction",
      "95% confidence interval",
      "Percentile ranking",
      "Basic result summary",
    ],
    excluded: [
      "PDF report download",
      "Sit-or-postpone recommendation",
      "Multi-Step tracking",
      "Unlimited refreshes",
    ],
  },
  {
    kind: "single",
    name: "Single Report",
    description: "One complete PDF with your full breakdown.",
    price: "$14.99",
    // We deliberately send users back to the calculator instead of straight
    // to Stripe: a report without inputs is useless, so the funnel is
    // calculate → see prediction → unlock from PaywallModal.
    cta: "Calculate to unlock",
    ctaHref: "/#calculator",
    features: [
      "Everything in Free",
      "Downloadable PDF report",
      "Sit-or-postpone recommendation",
      "Subject-level weakness map",
      "Score trajectory analysis",
    ],
    excluded: ["Multi-Step tracking", "Unlimited refreshes"],
  },
  {
    kind: "pro",
    name: "Pro",
    description: "For serious Step prep — track every practice exam.",
    priceMonthly: "$9.99",
    priceAnnual: "$79",
    features: [
      "Everything in Single Report",
      "Unlimited predictions & refreshes",
      "Multi-Step tracking (1, 2 CK, 3)",
      "Real-time score timeline",
      "Priority support",
      "All future features included",
    ],
    excluded: [],
  },
];

export function Pricing() {
  // Default to monthly: lets users see the headline monthly price first,
  // then discover the "Save 33%" annual deal by toggling.
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const annual = billing === "annual";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const router = useRouter();

  const isPro =
    session.status === "authed" && Boolean(session.user.proTier);

  /**
   * Kick off Pro checkout. Anon users bounce to /login first; the session
   * cookie is needed so the webhook can match Stripe customer → our user.
   */
  async function startProCheckout() {
    if (submitting) return;
    setError(null);

    if (session.status === "anon") {
      router.push("/login?next=/pricing");
      return;
    }
    if (session.status === "loading") {
      // Avoid double-clicks while we still don't know the auth state.
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: annual ? "pro_annual" : "pro_monthly" }),
      });
      const json = (await res.json()) as { url?: string; error?: string };

      if (res.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      if (!res.ok || !json.url) {
        setError(
          json.error ?? "Couldn't start checkout. Please try again."
        );
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="container">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Start free. Upgrade only when you need a full report or ongoing
          tracking. No hidden fees. No auto-renewal traps.
        </p>

        {/* Billing toggle */}
        <div
          className="flex items-center justify-center gap-3 mb-12"
          data-billing={billing}
        >
          <span
            className={cn(
              "text-sm font-semibold transition",
              !annual ? "text-gray-900" : "text-gray-400"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBilling((b) => (b === "annual" ? "monthly" : "annual"))
            }
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
              annual ? "bg-mint-500" : "bg-gray-300"
            )}
            aria-label="Toggle annual billing"
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                annual ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-semibold transition",
              annual ? "text-gray-900" : "text-gray-600"
            )}
          >
            Annual
          </span>
          <span className="ml-1 rounded-full bg-mint-100 px-2.5 py-1 text-xs font-bold text-mint-800">
            Save 33%
          </span>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-900">
            {error}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isProCard = plan.kind === "pro";
            const displayPrice =
              plan.kind === "pro"
                ? annual
                  ? plan.priceAnnual
                  : plan.priceMonthly
                : plan.price;
            const displayPeriod = isProCard ? (annual ? "/yr" : "/mo") : "";

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-3xl border p-8 transition-all duration-300 flex flex-col",
                  isProCard
                    ? "border-mint-400 bg-white shadow-xl shadow-mint-500/10 md:scale-[1.03] z-10"
                    : "border-gray-200 bg-white hover:shadow-lg"
                )}
              >
                {isProCard && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint-800 px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black tracking-tight text-gray-950">
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className="text-base font-semibold text-gray-500">
                      {displayPeriod}
                    </span>
                  )}
                  {plan.kind === "single" && (
                    <span className="ml-2 text-xs font-semibold text-gray-600">
                      one-time
                    </span>
                  )}
                  {isProCard && annual && (
                    <div className="mt-1 text-sm text-gray-500">
                      That&apos;s ~$6.58/mo — less than one coffee a week
                    </div>
                  )}
                </div>

                {/* CTA. Pro needs custom logic (auth check + POST); the
                    others are plain Links. */}
                {plan.kind === "pro" ? (
                  isPro ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full mb-8"
                      asChild
                    >
                      <Link href="/dashboard/billing">Manage subscription</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="mint"
                      size="lg"
                      className="w-full mb-8 inline-flex items-center justify-center gap-2"
                      onClick={startProCheckout}
                      disabled={
                        submitting || session.status === "loading"
                      }
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Redirecting…
                        </>
                      ) : (
                        <>
                          Subscribe {annual ? "yearly" : "monthly"}
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Button
                    variant={plan.kind === "single" ? "primary" : "outline"}
                    size="lg"
                    className="w-full mb-8"
                    asChild
                  >
                    <Link href={plan.ctaHref}>{plan.cta}</Link>
                  </Button>
                )}

                <ul className="space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-mint-500" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                  {plan.excluded.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-gray-600"
                    >
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-gray-300" />
                      <span className="line-through decoration-gray-300">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-600 mt-10 max-w-xl mx-auto">
          All prices in USD. Digital products are non-refundable. Pro
          subscriptions can be canceled anytime — you keep access until the
          end of your billing period.
        </p>
      </div>
    </section>
  );
}
