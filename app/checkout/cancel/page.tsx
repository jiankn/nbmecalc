import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, MessageCircleQuestion } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout Canceled — No Charge | NBMEcalc",
  description:
    "Your checkout was canceled. No charge was made. You can try again or continue using NBMEcalc free.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://nbmecalc.com/checkout/cancel" },
};

export default function CheckoutCancelPage() {
  return (
    <PageShell>
      <section className="py-20 lg:py-28 bg-gray-50 min-h-[60vh]">
        <div className="container max-w-2xl">
          <div className="rounded-3xl bg-white border border-gray-200 shadow-lg p-8 lg:p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <XCircle className="h-9 w-9 text-gray-500" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Checkout canceled
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              No worries — no charge was made to your card. You can keep using
              the free predictor or try again when you&apos;re ready.
            </p>

            <div className="rounded-2xl bg-mint-50 border border-mint-200 p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <MessageCircleQuestion className="h-5 w-5 text-mint-700 shrink-0 mt-1" />
                <div>
                  <h2 className="font-bold text-gray-950 mb-1">
                    Questions before you buy?
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Reach out to{" "}
                    <a
                      href="mailto:hello@nbmecalc.com"
                      className="text-mint-700 font-semibold underline"
                    >
                      hello@nbmecalc.com
                    </a>{" "}
                    or check the FAQ on our{" "}
                    <Link
                      href="/pricing"
                      className="text-mint-700 font-semibold underline"
                    >
                      pricing page
                    </Link>
                    . We respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700 text-left max-w-md mx-auto">
              <h3 className="font-bold text-center text-gray-900 mb-3">
                Common reasons people cancel
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Wanted to compare with other tools first — try our{" "}
                  <Link href="/compare/best-usmle-score-predictor" className="text-mint-700 underline font-semibold">comparison page</Link></li>
                <li>Need a refund policy clarification — digital products are
                  non-refundable but Pro subs can be canceled anytime</li>
                <li>Card declined — try a different card or check with your bank</li>
                <li>Just exploring — totally fine, the Free tier is yours forever</li>
              </ul>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/#calculator">Keep using free predictor</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
