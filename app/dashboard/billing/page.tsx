"use client";

import Link from "next/link";
import { CreditCard, Receipt, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";

function formatDate(ms: number | null): string | null {
  if (!ms) return null;
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BillingPage() {
  const session = useSession();
  const user = session.status === "authed" ? session.user : null;
  const hasLifetime = Boolean(user?.lifetimeAccess);
  const purchasedOn = formatDate(user?.lifetimePurchasedAt ?? null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing</h1>
        <p className="text-gray-600 mt-1">View your access and receipts.</p>
      </div>

      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-mint-700" />
          <h2 className="text-xl font-bold">Current plan</h2>
        </div>

        {session.status === "loading" ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : hasLifetime ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-extrabold text-mint-700">
                Lifetime
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-bold text-mint-800">
                <Sparkles className="h-3 w-3" /> Active
              </span>
            </div>
            {purchasedOn && (
              <p className="text-sm text-gray-600 mb-1">
                Purchased on <strong>{purchasedOn}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600">
              Unlimited predictions, multi-Step tracking, full reports, and
              ongoing updates to core features are included. There are no
              recurring charges.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-extrabold text-gray-700 mb-1">Free</div>
            <p className="text-sm text-gray-600 mb-5">
              Upgrade once for unlimited predictions, multi-Step tracking,
              and a real-time timeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="md" asChild>
                <Link href="/pricing">View Lifetime</Link>
              </Button>
              <Button variant="outline" size="md" asChild>
                <Link href="/#calculator">Buy single report ($14.99)</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="h-5 w-5 text-mint-700" />
          <h2 className="text-xl font-bold">Receipts</h2>
        </div>
        <p className="text-sm text-gray-600">
          Stripe emails a receipt after every payment. Need another copy?
          Email{" "}
          <a href="mailto:hello@nbmecalc.com" className="text-mint-700 font-semibold underline">
            hello@nbmecalc.com
          </a>{" "}
          with the payment date and amount.
        </p>
      </section>

      <section className="rounded-3xl bg-gray-50 border border-gray-200 p-6 lg:p-8">
        <h2 className="text-lg font-bold mb-2">Refund policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          All sales are final. Single Report and Lifetime purchases are digital
          products delivered immediately and are non-refundable.
        </p>
      </section>
    </div>
  );
}
