import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Feedback Link Error | NBMEcalc",
  robots: { index: false, follow: false },
};

type PageSearchParams = Promise<{ reason?: string }>;

export default async function FeedbackErrorPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { reason } = await searchParams;
  return (
    <PageShell>
      <section className="container max-w-2xl py-24">
        <h1 className="text-3xl font-extrabold mb-4">Feedback link unavailable</h1>
        <p className="text-gray-700 mb-6">
          {reason ? decodeURIComponent(reason) : "This feedback link is invalid or expired."}
        </p>
        <Link href="/" className="text-mint-700 underline font-semibold">
          Back to homepage
        </Link>
      </section>
    </PageShell>
  );
}
