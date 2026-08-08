import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResume } from "@/components/checkout-resume";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Continue to Secure Checkout | NBMEcalc",
  description: "Continue your NBMEcalc Lifetime purchase through Stripe.",
  robots: { index: false, follow: false },
};

export default function CheckoutResumePage() {
  return (
    <PageShell>
      <section className="min-h-[60vh] bg-gray-50 py-20 lg:py-28">
        <div className="container max-w-lg">
          <Suspense
            fallback={
              <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600 shadow-xl">
                Preparing secure checkout...
              </div>
            }
          >
            <CheckoutResume />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
