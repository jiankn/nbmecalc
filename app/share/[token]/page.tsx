import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { getStepLabel } from "@/lib/prediction-share";
import { getPublicPredictionShare } from "@/lib/public-prediction-share";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type RouteParams = Promise<{ token: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { token } = await params;
  const share = await getPublicPredictionShare(token);
  if (!share) {
    return {
      title: "Shared prediction unavailable — NBMEcalc",
      robots: { index: false, follow: false },
    };
  }

  const stepLabel = getStepLabel(share.step);
  const title = `${stepLabel} prediction: ${share.ciLower}–${share.ciUpper}`;
  const description = `A shared NBMEcalc estimate with a most likely score of ${share.pointEstimate} and a 95% confidence interval of ${share.ciLower}–${share.ciUpper}.`;
  const url = `https://nbmecalc.com/share/${share.token}`;
  const image = `https://nbmecalc.com/share/og/${share.token}`;

  return {
    title: `${title} — NBMEcalc`,
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      siteName: "NBMEcalc",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharedPredictionPage({
  params,
}: {
  params: RouteParams;
}) {
  const { token } = await params;
  const share = await getPublicPredictionShare(token);
  if (!share) notFound();

  const stepLabel = getStepLabel(share.step);

  return (
    <PageShell>
      <section className="min-h-[70vh] bg-gradient-to-b from-mint-50/70 to-white py-14 sm:py-20">
        <div className="container max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-mint-200 bg-white shadow-xl">
            <div className="border-b border-mint-100 bg-mint-50 px-6 py-5 sm:px-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-mint-800 ring-1 ring-mint-200">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Shared prediction
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                {stepLabel} score estimate
              </h1>
              <p className="mt-2 text-gray-600">
                An unlisted, privacy-safe summary created with NBMEcalc.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="rounded-3xl bg-gray-950 p-7 text-white sm:p-9">
                <p className="text-sm font-semibold uppercase tracking-wider text-mint-400">
                  Predicted range · 95% CI
                </p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
                  {share.ciLower}–{share.ciUpper}
                </p>
                <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-white/15 pt-5">
                  <span className="text-sm text-gray-300">Most likely</span>
                  <strong className="text-3xl tabular-nums text-mint-400">
                    {share.pointEstimate}
                  </strong>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-gray-600">
                This page does not expose practice-exam scores, weak subjects,
                account details, pass probability, or a private report.
                Predictions are statistical estimates, not guarantees.
              </p>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
                <h2 className="text-xl font-bold text-gray-950">
                  See your own realistic score range
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
                  Add your NBME, UWSA, Free 120, AMBOSS, or CMS scores. No
                  signup required.
                </p>
                <Button size="lg" className="mt-5 w-full sm:w-auto" asChild>
                  <Link href="/#calculator">
                    Calculate my prediction
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
