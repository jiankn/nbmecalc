import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Download } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { ScoreFeedbackOptIn } from "@/components/score-feedback-opt-in";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Payment Successful — Your Report Is On the Way | NBMEcalc",
  description:
    "Thank you for purchasing your NBMEcalc Step report. Check your email for the download link.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://nbmecalc.com/checkout/success" },
};

type PageSearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { session_id } = await searchParams;
  const reportHref = session_id ? `/report/${encodeURIComponent(session_id)}` : "/";

  return (
    <PageShell>
      <section className="py-20 lg:py-28 bg-mint-50/40 min-h-[60vh]">
        <div className="container max-w-2xl">
          <div className="rounded-3xl bg-white border border-mint-200 shadow-xl p-8 lg:p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-mint-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-9 w-9 text-mint-600" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Payment successful
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your full Step report is being
              generated and will arrive by email shortly.
            </p>

            <div className="rounded-2xl bg-mint-50 border border-mint-200 p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-mint-700 shrink-0 mt-1" />
                <div>
                  <h2 className="font-bold text-gray-950 mb-1">
                    Check your inbox
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We sent your PDF report and 14-day study plan to the email
                    associated with this purchase. If you don&apos;t see it
                    within 5 minutes, check your spam folder or contact{" "}
                    <a
                      href="mailto:hello@nbmecalc.com"
                      className="text-mint-700 font-semibold underline"
                    >
                      hello@nbmecalc.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-gray-700 shrink-0 mt-1" />
                <div>
                  <h2 className="font-bold text-gray-950 mb-1">
                    Want to download now?
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Your report page is ready. Bookmark it for future access.
                  </p>
                  <Button variant="outline" size="md" asChild>
                    <Link href={reportHref}>View my report</Link>
                  </Button>
                </div>
              </div>
            </div>

            {session_id?.startsWith("cs_") && (
              <ScoreFeedbackOptIn sessionId={session_id} />
            )}

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">Receipt:</strong> Sent
                automatically to your email by Stripe.
              </p>
              <p>
                <strong className="text-gray-900">Need help?</strong> Reply to
                the receipt email and we&apos;ll respond within 24 hours.
              </p>
              <p>
                <strong className="text-gray-900">Subscription users:</strong>{" "}
                You can manage billing anytime via the link in your welcome
                email.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/">Back to home</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/#calculator">Run another prediction</Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            All sales final. Digital products are non-refundable. Pro
            subscriptions can be canceled anytime to prevent future charges.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
