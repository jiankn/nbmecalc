import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Lock, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireDb } from "@/lib/db/client";
import { loadScoreFeedbackRecord } from "@/lib/score-feedback-store";
import {
  formatDateInput,
  getScoreFeedbackSecret,
  verifyScoreFeedbackToken,
} from "@/lib/score-feedback";
import { readRuntimeEnv } from "@/lib/runtime-env";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Share Your Real Step Score | NBMEcalc",
  robots: { index: false, follow: false },
};

type PageParams = Promise<{ token: string }>;
type PageSearchParams = Promise<{ thanks?: string }>;

export default async function ScoreFeedbackPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { token } = await params;
  const { thanks } = await searchParams;
  const secret = getScoreFeedbackSecret({
    SCORE_FEEDBACK_SECRET: readRuntimeEnv("SCORE_FEEDBACK_SECRET"),
    PDF_RENDERER_SECRET: readRuntimeEnv("PDF_RENDERER_SECRET"),
  });

  if (!secret) return <ErrorState reason="Feedback links are not configured yet." />;

  const verified = await verifyScoreFeedbackToken(token, secret);
  if (!verified.ok) return <ErrorState reason="This feedback link is invalid or expired." />;

  let db;
  try {
    db = requireDb();
  } catch {
    return <ErrorState reason="The feedback database is temporarily unavailable." />;
  }

  const loaded = await loadScoreFeedbackRecord(db, verified.payload.sessionId);
  if (loaded.status !== "ok") {
    return <ErrorState reason="We could not load the paid report tied to this link." />;
  }

  const record = loaded.record;
  const alreadySubmitted = Boolean(record.submittedAt);
  const showThanks = thanks === "1" || alreadySubmitted;

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-mint-50/40 min-h-[70vh]">
        <div className="container max-w-3xl">
          <div className="rounded-3xl bg-white border border-mint-200 shadow-xl p-8 lg:p-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-mint-100 flex items-center justify-center shrink-0">
                {showThanks ? (
                  <CheckCircle2 className="h-8 w-8 text-mint-700" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-mint-700" />
                )}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
                  {showThanks ? "Thank you — this helps future students" : "How did your real score compare?"}
                </h1>
                <p className="text-gray-600">
                  Your predicted {record.step.toUpperCase()} score was{" "}
                  <strong className="text-gray-950">{record.predictedScore}</strong>{" "}
                  ({record.ciLower}–{record.ciUpper} 95% CI).
                </p>
              </div>
            </div>

            {showThanks ? (
              <ThankYouState record={record} />
            ) : (
              <FeedbackForm token={token} examDate={record.examDate} />
            )}

            <div className="mt-8 flex items-start gap-2 rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
              <p>
                No login required. We store this as calibration data tied to your report session,
                not as a public review.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FeedbackForm({ token, examDate }: { token: string; examDate: number | null }) {
  return (
    <form action="/api/score-feedback/submit" method="post" className="space-y-6">
      <input type="hidden" name="token" value={token} />
      <div className="rounded-2xl border border-gray-200 p-5">
        <label htmlFor="actualScore" className="block text-sm font-bold text-gray-950 mb-2">
          Exact three-digit score, if you have it
        </label>
        <Input
          id="actualScore"
          name="actualScore"
          type="number"
          min={120}
          max={300}
          inputMode="numeric"
          placeholder="e.g. 231"
        />
        <p className="text-xs text-gray-500 mt-2">
          If you only know pass/fail, leave this blank and choose below.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <p className="block text-sm font-bold text-gray-950 mb-3">Or share pass/fail only</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="rounded-2xl border border-gray-200 p-4 cursor-pointer hover:border-mint-300">
            <input className="mr-2" type="radio" name="passFail" value="pass" />
            Passed
          </label>
          <label className="rounded-2xl border border-gray-200 p-4 cursor-pointer hover:border-mint-300">
            <input className="mr-2" type="radio" name="passFail" value="fail" />
            Failed
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-5">
        <label htmlFor="scoreReportUrl" className="block text-sm font-bold text-gray-950 mb-2">
          Optional verification link
        </label>
        <Input
          id="scoreReportUrl"
          name="scoreReportUrl"
          type="url"
          placeholder="Private screenshot URL, optional"
        />
        <p className="text-xs text-gray-500 mt-2">
          Optional. Self-reported rows are still useful; verified rows just get more model weight later.
        </p>
      </div>

      {examDate && (
        <p className="text-xs text-gray-500">
          Exam date on file: {formatDateInput(examDate)}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Submit my real outcome
      </Button>
    </form>
  );
}

function ThankYouState({
  record,
}: {
  record: {
    actualScore: number | null;
    passFail: "pass" | "fail" | null;
    scoreBand: string | null;
  };
}) {
  return (
    <div className="rounded-2xl bg-mint-50 border border-mint-200 p-6">
      <h2 className="font-bold text-gray-950 mb-2">Recorded outcome</h2>
      <p className="text-gray-700">
        {record.actualScore
          ? `Actual score: ${record.actualScore}`
          : record.passFail
            ? `Outcome: ${record.passFail === "pass" ? "Passed" : "Failed"}${record.scoreBand ? ` · ${record.scoreBand}` : ""}`
            : "Your feedback was recorded."}
      </p>
      <p className="text-sm text-gray-600 mt-3">
        This single datapoint helps calibrate future confidence intervals and pass-risk estimates.
      </p>
      <Button variant="outline" className="mt-5" asChild>
        <Link href="/">Back to NBMEcalc</Link>
      </Button>
    </div>
  );
}

function ErrorState({ reason }: { reason: string }) {
  return (
    <PageShell>
      <section className="container max-w-2xl py-24">
        <h1 className="text-3xl font-extrabold mb-4">Feedback link unavailable</h1>
        <p className="text-gray-700 mb-6">{reason}</p>
        <Link href="/" className="text-mint-700 underline font-semibold">
          Back to homepage
        </Link>
      </section>
    </PageShell>
  );
}
