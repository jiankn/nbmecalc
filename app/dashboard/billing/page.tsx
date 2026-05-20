"use client";

import Link from "next/link";
import { CreditCard, Receipt, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  // TODO: wire up Pro tier from /api/user/me when available.
  const isPro = false;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing</h1>
        <p className="text-gray-600 mt-1">Manage subscriptions and view receipts.</p>
      </div>

      {/* Current plan */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-mint-700" />
          <h2 className="text-xl font-bold">Current plan</h2>
        </div>
        {isPro ? (
          <div>
            <div className="text-2xl font-extrabold text-mint-700 mb-1">Pro</div>
            <p className="text-sm text-gray-600 mb-5">
              You have full access to multi-Step tracking, unlimited
              predictions, and all future features.
            </p>
            <Button variant="outline" size="md" asChild>
              <a
                href="https://billing.stripe.com/p/login/test_xxx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Manage subscription
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-extrabold text-gray-700 mb-1">Free</div>
            <p className="text-sm text-gray-600 mb-5">
              You&apos;re on the free tier. Upgrade to Pro for unlimited
              predictions, multi-Step tracking, and a real-time timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="md" asChild>
                <Link href="/pricing">View Pro plans</Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/#calculator">Buy single report ($14.99)</Link>
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
        <p className="text-sm text-gray-600 mb-4">
          Stripe automatically emails a receipt for every payment. The receipt
          arrives within 1 minute of checkout completion.
        </p>
        <p className="text-sm text-gray-600">
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
          subscriptions are non-refundable. You can cancel Pro at any time to
          prevent future charges — your access continues until the current
          billing period ends.
        </p>
      </section>
    </div>
  );
}
