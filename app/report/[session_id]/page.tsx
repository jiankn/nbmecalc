import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadReportFromSession } from "@/lib/session-report";
import { PageShell } from "@/components/page-shell";
import { ReportView } from "@/components/report-view";

/**
 * Stripe SDK can't be statically pre-rendered (we hit Stripe's API every
 * request to verify payment), so this route is always dynamic + edge.
 */
export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Report — NBMEcalc",
  robots: {
    index: false,
    follow: false,
  },
};

type RouteParams = Promise<{ session_id: string }>;

export default async function ReportPage({ params }: { params: RouteParams }) {
  const { session_id } = await params;
  const loaded = await loadReportFromSession(session_id);

  if (loaded.status === "not_found") notFound();
  if (loaded.status === "pending") {
    return (
      <PageShell>
        <PendingState sessionId={loaded.sessionId} />
      </PageShell>
    );
  }
  if (loaded.status === "needs_inputs") {
    return (
      <PageShell>
        <NeedsInputsState sessionId={loaded.sessionId} />
      </PageShell>
    );
  }

  const { data } = loaded;
  return (
    <PageShell>
      <ReportView
        result={data.result}
        exams={data.exams}
        sessionId={data.sessionId}
        purchasedAt={data.purchasedAt}
      />
    </PageShell>
  );
}

function PendingState({ sessionId }: { sessionId: string }) {
  return (
    <section className="container max-w-2xl py-24">
      <h1 className="text-3xl font-extrabold mb-4">Payment pending</h1>
      <p className="text-gray-700 mb-6">
        We haven&apos;t received payment confirmation from Stripe yet. This
        usually clears within 30 seconds. Refresh the page, or check your
        email for a Stripe receipt.
      </p>
      <Link
        href="/"
        className="text-mint-700 underline font-semibold"
      >
        ← Back to homepage
      </Link>
      <p className="text-xs text-gray-400 mt-12">
        Session: <code className="font-mono">{sessionId}</code>
      </p>
    </section>
  );
}

function NeedsInputsState({ sessionId }: { sessionId: string }) {
  return (
    <section className="container max-w-2xl py-24">
      <h1 className="text-3xl font-extrabold mb-4">
        Welcome — almost there!
      </h1>
      <p className="text-gray-700 mb-6">
        Your payment is confirmed, but we don&apos;t have your practice
        scores on file. Head back to the calculator, enter them, and you
        won&apos;t be charged again.
      </p>
      <Link
        href="/#calculator"
        className="inline-flex items-center gap-2 rounded-full bg-mint-500 px-6 py-3 font-semibold text-white hover:bg-mint-600"
      >
        Go to calculator →
      </Link>
      <p className="text-xs text-gray-400 mt-12">
        Save this URL — your report will appear here once you run the
        calculator. Session:{" "}
        <code className="font-mono">{sessionId}</code>
      </p>
    </section>
  );
}
