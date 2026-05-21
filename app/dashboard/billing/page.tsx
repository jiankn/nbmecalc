"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";

function formatRenewalDate(ms: number | null): string | null {
  if (!ms) return null;
  try {
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function planLabel(tier: string | null): string {
  if (!tier) return "Free";
  if (tier === "pro_monthly") return "Pro (Monthly)";
  if (tier === "pro_annual") return "Pro (Annual)";
  // Anything Stripe sends that we haven't mapped — still treat as Pro.
  return "Pro";
}

export default function BillingPage() {
  const session = useSession();
  const [openingPortal, setOpeningPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const user = session.status === "authed" ? session.user : null;
  const isPro = Boolean(user?.proTier);
  const renewsOn = formatRenewalDate(user?.proExpiresAt ?? null);

  async function openPortal() {
    if (openingPortal) return;
    setOpeningPortal(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setPortalError(json.error ?? "Couldn't open billing portal.");
        setOpeningPortal(false);
        return;
      }
      // Stripe portal opens in same tab — its "Return" button brings the
      // user back to /dashboard/billing (configured in /api/billing/portal).
      window.location.href = json.url;
    } catch {
      setPortalError("Network error. Please try again.");
      setOpeningPortal(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage subscriptions and view receipts.
        </p>
      </div>

      {/* Current plan */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-mint-700" />
          <h2 className="text-xl font-bold">Current plan</h2>
        </div>

        {session.status === "loading" ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading…</span>
          </div>
        ) : isPro ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-extrabold text-mint-700">
                {planLabel(user?.proTier ?? null)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-bold text-mint-800">
                <Sparkles className="h-3 w-3" />
                Active
              </span>
            </div>
            {renewsOn && (
              <p className="text-sm text-gray-600 mb-1">
                Next billing date: <strong>{renewsOn}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600 mb-5">
              You have full access to multi-Step tracking, unlimited
              predictions, and all future features. Cancel anytime — you keep
              access until the period ends.
            </p>
            {portalError && (
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 mb-4 text-sm text-rose-900">
                {portalError}
              </div>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={openPortal}
              disabled={openingPortal}
              className="inline-flex items-center gap-2"
            >
              {openingPortal ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening…
                </>
              ) : (
                <>
                  Manage subscription
                  <ExternalLink className="h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Update your card, change plan, view invoices, or cancel —
              all in the secure Stripe portal.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-extrabold text-gray-700 mb-1">
              Free
            </div>
            <p className="text-sm text-gray-600 mb-5">
              You&apos;re on the free tier. Upgrade to Pro for unlimited
              predictions, multi-Step tracking, and a real-time timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="md" asChild>
                <Link href="/pricing">View Pro plans</Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/#calculator">
                  Buy single report ($14.99)
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Receipts */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="h-5 w-5 text-mint-700" />
          <h2 className="text-xl font-bold">Receipts</h2>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Stripe automatically emails a receipt for every payment. The
          receipt arrives within 1 minute of checkout completion.
        </p>
        {isPro && (
          <p className="text-sm text-gray-600">
            All historical invoices are available in the{" "}
            <button
              onClick={openPortal}
              className="text-mint-700 font-semibold underline"
            >
              billing portal
            </button>
            .
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Need a copy? Email{" "}
          <a
            href="mailto:hello@nbmecalc.com"
            className="text-mint-700 font-semibold underline"
          >
            hello@nbmecalc.com
          </a>{" "}
          with the date and amount and we&apos;ll resend within 24 hours.
        </p>
      </section>

      {/* Refund policy */}
      <section className="rounded-3xl bg-gray-50 border border-gray-200 p-6 lg:p-8">
        <h2 className="text-lg font-bold mb-2">Refund policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          All sales are final. Digital products (PDF reports) and Pro
          subscriptions are non-refundable. You can cancel Pro at any time
          to prevent future charges — your access continues until the
          current billing period ends.
        </p>
      </section>
    </div>
  );
}
