"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PredictionResult, PracticeExam } from "@/lib/data";

interface PredictionDetail {
  id: string;
  step: string;
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  passProbability: number;
  createdAt: number;
  inputExams: PracticeExam[];
  inputOptions: { targetScore?: number; selfReportedWeakSubjects?: string[] } | null;
  daysUntilExam: number | null;
  resultSnapshot: PredictionResult;
  algorithmVersion: string;
}

function stepLabel(step: string): string {
  if (step === "step1") return "Step 1";
  if (step === "step2") return "Step 2 CK";
  if (step === "step3") return "Step 3";
  return step;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PredictionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prediction, setPrediction] = useState<PredictionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/user/predictions/${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.replace(`/login?next=/dashboard/predictions/${id}`);
          return;
        }
        if (!res.ok) {
          setError("Prediction not found.");
          return;
        }
        const json = (await res.json()) as { prediction: PredictionDetail };
        setPrediction(json.prediction);
      })
      .catch(() => setError("Failed to load prediction."))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/predictions"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to predictions
        </Link>
        <div className="rounded-3xl bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-600">{error ?? "Prediction not found."}</p>
        </div>
      </div>
    );
  }

  const result = prediction.resultSnapshot;
  const passPercent = Math.round(prediction.passProbability * 100);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/predictions"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to predictions
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {stepLabel(prediction.step)} Prediction
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(prediction.createdAt)} · Algorithm{" "}
            {prediction.algorithmVersion}
          </p>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-mint-50 border border-mint-200 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-mint-700 uppercase tracking-wider mb-2">
            <TrendingUp className="h-4 w-4" />
            Most Likely
          </div>
          <div className="text-3xl font-black text-gray-950">
            {prediction.pointEstimate}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <BarChart3 className="h-4 w-4" />
            95% CI
          </div>
          <div className="text-3xl font-black text-gray-950">
            {prediction.ciLower} – {prediction.ciUpper}
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Target className="h-4 w-4" />
            Pass Probability
          </div>
          <div className="text-3xl font-black text-gray-950">
            {passPercent}%
          </div>
        </div>
      </div>

      {/* Input exams */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">Input Scores</h2>
        <div className="space-y-2">
          {prediction.inputExams.map((exam, i) => (
            <div
              key={exam.id ?? i}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  {exam.source}
                  {exam.formNumber ? ` ${exam.formNumber}` : ""}
                </span>
                {exam.takenDaysAgo !== undefined && (
                  <span className="text-xs text-gray-400">
                    {exam.takenDaysAgo}d ago
                  </span>
                )}
              </div>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {exam.score}
              </span>
            </div>
          ))}
        </div>
        {prediction.daysUntilExam !== null && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {prediction.daysUntilExam} days until exam at time of prediction
          </div>
        )}
      </section>

      {/* Subject breakdown (cohort averages at this score level) */}
      {result.cohortSubjectAverages && result.cohortSubjectAverages.length > 0 && (
        <section className="rounded-3xl bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-1">Subject Performance</h2>
          <p className="text-xs text-gray-500 mb-4">
            {result.cohortSubjectAveragesNote || "Cohort averages at your predicted score level."}
          </p>
          <div className="space-y-3">
            {result.cohortSubjectAverages.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {s.name}
                  </span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {Math.round(s.cohortAverage)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-mint-500 transition-all"
                    style={{ width: `${Math.min(100, s.cohortAverage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Postpone recommendation */}
      {result.postponeRecommendation && result.postponeRecommendation.show && (
        <section className="rounded-3xl bg-white border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-2">Exam Readiness</h2>
          <p className="text-gray-600">
            {result.postponeRecommendation.insight}
          </p>
        </section>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/#calculator">Run a new prediction</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/pricing">Upgrade to Pro</Link>
        </Button>
      </div>
    </div>
  );
}
