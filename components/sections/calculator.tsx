"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X, ArrowRight, Lock, Share2, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  predictStepScore,
  EXAM_SOURCES,
  NBME_FORM_NUMBERS,
  getSubjectTaxonomy,
  type PracticeExam,
  type ExamSource,
  type StepKind,
  type PredictionResult,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const STEPS: { key: StepKind; label: string }[] = [
  { key: "step1", label: "Step 1" },
  { key: "step2", label: "Step 2 CK" },
  { key: "step3", label: "Step 3" },
];

/** Pick the right defaults when the user changes the source on a row. */
function defaultsForSource(source: ExamSource): Partial<PracticeExam> {
  const meta = EXAM_SOURCES.find((s) => s.key === source)!;
  return {
    score: meta.defaultScore,
    formNumber: source === "NBME" ? 30 : undefined,
  };
}

function isValidScore(score: number, source: ExamSource): boolean {
  const meta = EXAM_SOURCES.find((s) => s.key === source)!;
  return score >= meta.scoreRange[0] && score <= meta.scoreRange[1];
}

export function Calculator({ defaultStep = "step2" }: { defaultStep?: StepKind } = {}) {
  const [step, setStep] = useState<StepKind>(defaultStep);
  const [exams, setExams] = useState<PracticeExam[]>([
    { id: "1", source: "NBME", formNumber: 30, score: 230, takenDaysAgo: 21 },
    { id: "2", source: "NBME", formNumber: 31, score: 240, takenDaysAgo: 10 },
    { id: "3", source: "UWSA2", score: 248, takenDaysAgo: 3 },
  ]);
  const [daysUntil, setDaysUntil] = useState(14);
  const [targetScore, setTargetScore] = useState<number | undefined>(undefined);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  // Server-issued id for the last persisted prediction. Threaded into
  // /api/checkout metadata so the eventual order row links back to the
  // exact funnel row. Cleared whenever any input changes (the persisted
  // row no longer matches what's on screen).
  const [predictionId, setPredictionId] = useState<string | null>(null);
  // AbortController for in-flight /api/predict so rapid clicks don't race.
  const inFlight = useRef<AbortController | null>(null);

  // Any input change invalidates the previously persisted prediction id.
  // Done as an effect rather than inside each setter to avoid forgetting
  // a code path if we add more inputs later.
  useEffect(() => {
    setPredictionId(null);
  }, [step, exams, daysUntil, targetScore, weakSubjects]);

  const allInputsValid = useMemo(
    () => exams.every((e) => isValidScore(e.score, e.source)),
    [exams]
  );

  function addExam() {
    const defaults = defaultsForSource("NBME");
    setExams((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        source: "NBME",
        ...defaults,
      } as PracticeExam,
    ]);
  }

  function updateExam(id: string, patch: Partial<PracticeExam>) {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        // When the source changes, also reset score and formNumber to source-appropriate defaults.
        if (patch.source && patch.source !== e.source) {
          const defaults = defaultsForSource(patch.source);
          return { ...e, ...patch, ...defaults };
        }
        return { ...e, ...patch };
      })
    );
  }

  function removeExam(id: string) {
    setExams((prev) => prev.filter((e) => e.id !== id));
  }

  function handlePredict() {
    // 1. Instant client-side compute. UX must not depend on the network.
    const r = predictStepScore(exams, step, daysUntil, {
      targetScore,
      selfReportedWeakSubjects: weakSubjects,
    });
    setResult(r);
    setTimeout(() => {
      document.getElementById("calc-result")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);

    // 2. Fire-and-forget server log so funnel + rate-limit can see this
    //    deliberate "Predict" click. We DON'T await — UI is already done.
    //    AbortController prevents stale responses from overwriting newer ids
    //    when the user clicks rapidly.
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    void (async () => {
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            step,
            exams,
            daysUntilExam: daysUntil,
            options: {
              targetScore,
              selfReportedWeakSubjects: weakSubjects,
            },
          }),
        });
        if (!res.ok) return; // Rate-limited or invalid — silently skip.
        const json = (await res.json()) as { predictionId?: string };
        if (json.predictionId && !controller.signal.aborted) {
          setPredictionId(json.predictionId);
        }
      } catch {
        // Network errors are non-fatal — client-side result is already shown.
      }
    })();
  }

  // Re-run prediction when self-reported weak subjects change so the
  // personalized weak-subjects card updates without a manual click.
  function toggleWeakSubject(name: string) {
    setWeakSubjects((prev) => {
      const next = prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name];
      if (result) {
        setResult(
          predictStepScore(exams, step, daysUntil, {
            targetScore,
            selfReportedWeakSubjects: next,
          })
        );
      }
      return next;
    });
  }

  return (
    <section id="calculator" className="bg-gray-50 py-20 lg:py-28">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <Badge variant="mint" className="mb-4 inline-flex">
            <Sparkles className="h-3 w-3 mr-1.5" /> Live demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Try the Predictor Live
          </h2>
          <p className="text-lg text-gray-600">
            Add your scores. See your range instantly. No signup.
          </p>
        </div>

        {/* Calculator card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-lg border border-gray-100 overflow-x-hidden">
          {/* Step picker */}
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select your exam
          </label>
          <div className="flex flex-wrap gap-2 mb-8">
            {STEPS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStep(s.key)}
                className={cn(
                  "btn-pill px-5 py-2.5 text-sm border-2",
                  step === s.key
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Exams list */}
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Your practice exams
          </label>
          <div className="space-y-3 mb-4">
            {exams.map((exam) => {
              const meta = EXAM_SOURCES.find((s) => s.key === exam.source)!;
              return (
                <div
                  key={exam.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3"
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ background: meta.color }}
                  />
                  <select
                    value={exam.source}
                    onChange={(e) =>
                      updateExam(exam.id, {
                        source: e.target.value as ExamSource,
                      })
                    }
                    className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
                  >
                    {EXAM_SOURCES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {exam.source === "NBME" && (
                    <select
                      value={exam.formNumber || 30}
                      onChange={(e) =>
                        updateExam(exam.id, {
                          formNumber: Number(e.target.value),
                        })
                      }
                      className="bg-gray-50 rounded-md text-sm font-medium px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      {NBME_FORM_NUMBERS.map((n) => (
                        <option key={n} value={n}>
                          Form {n}
                        </option>
                      ))}
                    </select>
                  )}
                  <span className="ml-auto text-xs text-gray-500">
                    {meta.unit === "percent" ? "% correct" : "Score"}
                  </span>
                  <input
                    type="number"
                    value={exam.score}
                    onChange={(e) =>
                      updateExam(exam.id, {
                        score: Number(e.target.value),
                      })
                    }
                    className={cn(
                      "w-20 text-right font-mono font-semibold tabular-nums rounded-md px-2 py-1 focus:outline-none focus:ring-2",
                      isValidScore(exam.score, exam.source)
                        ? "bg-gray-50 focus:ring-mint-500"
                        : "bg-red-50 ring-2 ring-red-300 focus:ring-red-500"
                    )}
                    min={meta.scoreRange[0]}
                    max={meta.scoreRange[1]}
                    title={meta.hint}
                  />
                  {meta.unit === "percent" && (
                    <span className="text-xs text-gray-400 -ml-2">%</span>
                  )}
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="d?"
                    value={
                      typeof exam.takenDaysAgo === "number" ? exam.takenDaysAgo : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value;
                      updateExam(exam.id, {
                        takenDaysAgo:
                          raw === "" ? undefined : Math.max(0, Number(raw)),
                      });
                    }}
                    className="w-14 text-right font-mono text-xs tabular-nums rounded-md bg-gray-50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint-500 placeholder:text-gray-300"
                    title="Days since you took this exam (optional, but unlocks trend analysis)"
                    min={0}
                    max={365}
                  />
                  <span className="text-[11px] text-gray-400 -ml-1.5">d ago</span>
                  <button
                    onClick={() => removeExam(exam.id)}
                    className="text-gray-400 hover:text-red-600 transition p-1"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={addExam}
            className="w-full rounded-2xl border-2 border-dashed border-gray-300 bg-transparent py-3 text-sm font-semibold text-mint-700 hover:border-mint-500 hover:bg-mint-50 transition flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another exam (NBME / UWSA / Free 120 / AMBOSS)
          </button>

          <hr className="my-6 border-gray-100" />

          {/* Days until exam + optional target score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Days until your exam
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={daysUntil}
                  onChange={(e) => setDaysUntil(Number(e.target.value))}
                  className="w-20 h-11 rounded-full border border-gray-200 px-3 text-center font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-mint-500"
                  min={1}
                  max={365}
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label
                className="text-sm font-semibold text-gray-700"
                title="Optional. Powers the Target Gap card in the full report."
              >
                Target score{" "}
                <span className="text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </label>
              <input
                type="number"
                value={typeof targetScore === "number" ? targetScore : ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  setTargetScore(raw === "" ? undefined : Number(raw));
                }}
                placeholder="e.g. 245"
                className="w-24 h-11 rounded-full border border-gray-200 px-3 text-center font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-mint-500 placeholder:text-gray-300"
                min={150}
                max={300}
              />
            </div>
          </div>

          <Button
            size="xl"
            className="w-full"
            onClick={handlePredict}
            disabled={exams.length === 0 || !allInputsValid}
          >
            Predict My Step Score
            <ArrowRight className="h-5 w-5" />
          </Button>

          {!allInputsValid && exams.length > 0 && (
            <p className="mt-3 text-xs text-center text-red-600 font-medium">
              One or more scores are outside the valid range for their source.
              Hover the input for the expected range.
            </p>
          )}

          <p className="mt-4 text-xs text-center text-gray-500 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" />
            We don&apos;t store your scores unless you save. Free, no signup.
          </p>
        </div>

        {/* Result */}
        {result && result.pointEstimate > 0 && (
          <ResultCard
            result={result}
            step={step}
            weakSubjects={weakSubjects}
            onToggleWeakSubject={toggleWeakSubject}
            onUpgrade={() => setShowPaywall(true)}
          />
        )}

        {/* Paywall modal */}
        {showPaywall && (
          <PaywallModal
            onClose={() => setShowPaywall(false)}
            exams={exams}
            step={step}
            daysUntil={daysUntil}
            targetScore={targetScore}
            selfReportedWeakSubjects={weakSubjects}
            predictionId={predictionId}
          />
        )}
      </div>
    </section>
  );
}

function ResultCard({
  result,
  step,
  weakSubjects,
  onToggleWeakSubject,
  onUpgrade,
}: {
  result: PredictionResult;
  step: StepKind;
  weakSubjects: string[];
  onToggleWeakSubject: (name: string) => void;
  onUpgrade: () => void;
}) {
  const subjectTaxonomy = getSubjectTaxonomy(step);
  // Viz range covers all three Steps (Step 1 ~196 pass, Step 3 up to ~265+).
  const min = 190;
  const max = 290;
  const range = max - min;
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const ciStart = ((clamp(result.ciLower) - min) / range) * 100;
  const ciWidth = ((clamp(result.ciUpper) - clamp(result.ciLower)) / range) * 100;
  const pointPct = ((clamp(result.pointEstimate) - min) / range) * 100;

  const passThreshold =
    result.step === "step1" ? 196 : result.step === "step2" ? 214 : 198;
  const passThresholdPct = ((passThreshold - min) / range) * 100;

  // Sort subjects by cohort average descending so weak spots naturally bubble
  // to the bottom — makes the visual story read top-to-bottom (strong → weak).
  const sortedSubjects = [...result.cohortSubjectAverages].sort(
    (a, b) => b.cohortAverage - a.cohortAverage
  );
  const hiddenSubjectsCount = sortedSubjects.length - 3;

  return (
    <div
      id="calc-result"
      className="mt-8 rounded-3xl bg-white p-6 sm:p-10 shadow-lg border border-mint-200 animate-fade-up"
    >
      <div className="flex items-center justify-between mb-2 gap-3">
        <Badge variant="mint">Your Prediction</Badge>
        {result.freshness === "stale" && (
          <Badge variant="outline" className="text-xs">
            Wide CI: 60+ days until test day
          </Badge>
        )}
      </div>

      <h3 className="text-2xl sm:text-3xl font-bold mb-1">
        Your Predicted{" "}
        {result.step === "step1"
          ? "Step 1"
          : result.step === "step2"
          ? "Step 2 CK"
          : "Step 3"}{" "}
        Score
      </h3>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-mint-50 p-5 text-center">
          <div className="text-xs uppercase font-semibold text-gray-600 mb-1">
            Most Likely
          </div>
          <div className="text-5xl font-extrabold text-mint-700 tabular-nums">
            {result.pointEstimate}
          </div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5 text-center">
          <div className="text-xs uppercase font-semibold text-gray-600 mb-1">
            95% CI
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {result.ciLower} – {result.ciUpper}
          </div>
        </div>
        <div className="rounded-2xl bg-gray-50 p-5 text-center">
          <div className="text-xs uppercase font-semibold text-gray-600 mb-1">
            Pass Probability
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {(result.passProbability * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-8 mb-2">
        <div className="relative h-4 w-full rounded-full bg-gray-100">
          <div
            className="absolute top-0 h-4 rounded-full bg-mint-500/40"
            style={{ left: `${ciStart}%`, width: `${ciWidth}%` }}
          />
          {/* Pass threshold tick */}
          <div
            className="absolute top-0 h-4 w-0.5 bg-rose-500"
            style={{ left: `${passThresholdPct}%` }}
            aria-label={`Pass threshold ${passThreshold}`}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-mint-500 border-4 border-white shadow-lg mint-glow"
            style={{ left: `calc(${pointPct}% - 14px)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500 font-medium">
          <span>190</span>
          <span>215</span>
          <span>240</span>
          <span>265</span>
          <span>290</span>
        </div>
        <div className="mt-1 text-[11px] text-rose-600 font-medium">
          Red tick = pass threshold ({passThreshold})
        </div>
      </div>

      {/* Cohort subject averages — clearly labeled as cohort, not personalized */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2 gap-3">
          <h4 className="font-bold text-gray-900">
            Subject averages at your score level
          </h4>
          <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
            <Lock className="h-3 w-3" />
            Free preview
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4 flex gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{result.cohortSubjectAveragesNote}</span>
        </p>
        <div className="space-y-3">
          {sortedSubjects.slice(0, 3).map((s) => (
            <div key={s.name}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{s.name}</span>
                <span
                  className={cn(
                    "font-mono font-semibold tabular-nums",
                    s.cohortWeakness ? "text-red-600" : "text-gray-700"
                  )}
                >
                  {s.cohortAverage}%
                  {s.cohortWeakness && (
                    <span className="ml-2 text-xs text-red-600 font-bold">
                      ← cohort weak spot
                    </span>
                  )}
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    s.cohortWeakness ? "bg-red-400" : "bg-mint-500"
                  )}
                  style={{ width: `${s.cohortAverage}%` }}
                />
              </div>
            </div>
          ))}
          {hiddenSubjectsCount > 0 && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">
                + {hiddenSubjectsCount} more{" "}
                {hiddenSubjectsCount === 1 ? "subject" : "subjects"} in full
                report
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Self-reported weak subjects — feeds the personalized priority card
          inside the paid report. Optional; the user can skip it. */}
      <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-5">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h4 className="font-bold text-gray-900">
            Tell us where you struggle{" "}
            <span className="text-xs font-normal text-gray-500">
              (optional)
            </span>
          </h4>
          <span className="text-[11px] text-gray-500">
            Pick up to 3 — used to personalize the full report
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          We&apos;ll cross-reference these with the cohort&apos;s typical weak
          spots to build your priority list.
        </p>
        <div className="flex flex-wrap gap-2">
          {subjectTaxonomy.map((name) => {
            const checked = weakSubjects.includes(name);
            const disabled = !checked && weakSubjects.length >= 3;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onToggleWeakSubject(name)}
                disabled={disabled}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  checked
                    ? "bg-mint-100 border-mint-500 text-mint-800"
                    : disabled
                    ? "bg-white border-gray-200 text-gray-300 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700 hover:border-mint-500"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cohort attribution */}
      <p className="mt-6 text-[11px] text-gray-500 text-center">
        {result.cohortNote}
      </p>

      {/* Paywall CTA */}
      <div className="mt-8 rounded-2xl bg-black text-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-mint-400 mb-1">
              Unlock Full Report
            </div>
            <div className="text-lg font-bold mb-1">
              Get your day-by-day plan + complete subject map
            </div>
            <div className="text-sm text-gray-300">
              Includes downloadable PDF, peer outcomes, and confidence
              breakdown.
            </div>
          </div>
          <Button
            variant="mint"
            size="lg"
            onClick={onUpgrade}
            className="shrink-0"
          >
            Get Report — $14.99
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
        <span>Or share your prediction:</span>
        <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-gray-400 inline-flex items-center gap-1.5 font-medium transition">
          <Share2 className="h-3 w-3" />
          Reddit
        </button>
        <button className="rounded-full border border-gray-200 px-3 py-1 hover:border-gray-400 inline-flex items-center gap-1.5 font-medium transition">
          <Share2 className="h-3 w-3" />X
        </button>
      </div>
    </div>
  );
}

function PaywallModal({
  onClose,
  exams,
  step,
  daysUntil,
  targetScore,
  selfReportedWeakSubjects,
  predictionId,
}: {
  onClose: () => void;
  exams: PracticeExam[];
  step: StepKind;
  daysUntil: number;
  targetScore: number | undefined;
  selfReportedWeakSubjects: string[];
  /** Server-issued prediction id from /api/predict. May be null if the
   *  fire-and-forget call hadn't returned yet or the user mutated inputs
   *  after the last Predict click. Checkout works fine either way. */
  predictionId: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hand off to /api/checkout, which creates a Stripe Checkout Session and
  // returns the hosted-page URL. We redirect the *whole window* (not fetch)
  // because Stripe blocks iframe embedding and we want users to land on a
  // top-level secure page.
  const handleSingle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "single",
          exams,
          step,
          daysUntil,
          targetScore,
          selfReportedWeakSubjects,
          // Only include when fresh — links the order back to a real funnel row.
          ...(predictionId ? { predictionId } : {}),
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Could not start checkout.");
      }
      window.location.href = json.url;
      // We intentionally leave `loading` true — the page will navigate away.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start checkout.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint-100 mb-4">
            <Sparkles className="h-8 w-8 text-mint-700" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Unlock Your Full Step Report
          </h3>
          <p className="text-gray-600">
            Get the complete PDF + 14-day study plan instantly.
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-3">
          {/* Single Report — active CTA */}
          <button
            onClick={handleSingle}
            disabled={loading}
            className="w-full text-left rounded-2xl border-2 border-mint-500 bg-mint-50 p-5 transition hover:bg-mint-100 disabled:opacity-60 disabled:cursor-wait"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Single Report</span>
                  <Badge variant="mint">Most Popular</Badge>
                </div>
                <div className="text-2xl font-extrabold">$14.99</div>
                <div className="text-xs text-gray-600">
                  one-time — instant report + printable PDF
                </div>
              </div>
              <ul className="text-xs text-gray-700 space-y-1 shrink-0">
                <li>✓ Full report</li>
                <li>✓ 14-day plan</li>
                <li>✓ Subject map</li>
              </ul>
            </div>
            <div className="mt-3 text-sm font-semibold text-mint-700 flex items-center gap-1.5">
              {loading ? (
                <>Redirecting to secure checkout…</>
              ) : (
                <>
                  Unlock now <ArrowRight className="h-4 w-4" />
                </>
              )}
            </div>
          </button>

          {/* Pro — Coming Soon (C2-B will wire this up) */}
          <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">
            <span className="absolute -top-2.5 right-4 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Coming Soon
            </span>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-700">Pro</div>
                <div className="text-2xl font-extrabold tabular-nums text-gray-400">
                  $9.99
                  <span className="text-sm font-medium text-gray-400">/mo</span>
                </div>
              </div>
            </div>
            <ul className="text-xs text-gray-500 space-y-1 mb-4">
              <li>· Unlimited predictions for Step 1, 2, 3</li>
              <li>· Live timeline + email reminders</li>
              <li>· Priority support</li>
            </ul>
            <Button variant="outline" size="md" className="w-full" disabled>
              Join waitlist (launching soon)
            </Button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          🔒 Secure checkout via Stripe. Digital product, non-refundable.
        </div>
      </div>
    </div>
  );
}
