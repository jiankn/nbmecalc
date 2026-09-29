"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import {
  MAX_SCORE,
  MIN_SCORE,
  NORM_INFO,
  formatPercentile,
  summarizeScore,
  type NormStep,
} from "@/lib/usmle-norms";

const STEPS: { value: NormStep; label: string }[] = [
  { value: "step2ck", label: "Step 2 CK" },
  { value: "step3", label: "Step 3" },
];

export function PercentileCalculator({ defaultStep = "step2ck" }: { defaultStep?: NormStep }) {
  const [step, setStep] = useState<NormStep>(defaultStep);
  const [raw, setRaw] = useState(defaultStep === "step2ck" ? "250" : "230");
  const started = useRef(false);
  const viewed = useRef(false);

  const score = Number(raw);
  const valid = raw.trim() !== "" && Number.isFinite(score) && score >= MIN_SCORE && score <= MAX_SCORE;
  const info = NORM_INFO[step];
  const result = valid ? summarizeScore(step, score) : null;

  // 只在用户自己改过输入后记一次埋点，默认示例值不算。
  useEffect(() => {
    if (!started.current || viewed.current || !result) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "percentile", step });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [result, step]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackProductEvent("calculator_started", { tool: "percentile" });
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <span id="percentile-step-label" className="mb-2 block text-sm font-bold text-gray-900">
            Exam
          </span>
          <div
            role="radiogroup"
            aria-labelledby="percentile-step-label"
            className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1"
          >
            {STEPS.map((s) => (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={step === s.value}
                onClick={() => {
                  markStarted();
                  setStep(s.value);
                }}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition",
                  step === s.value ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-950"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="percentile-score" className="mb-2 block text-sm font-bold text-gray-900">
            Your 3-digit {info.label} score
          </label>
          <Input
            id="percentile-score"
            type="number"
            inputMode="numeric"
            min={MIN_SCORE}
            max={MAX_SCORE}
            value={raw}
            onChange={(e) => {
              markStarted();
              setRaw(e.target.value);
            }}
            className="font-mono text-lg"
            aria-describedby="percentile-score-help"
          />
          <p id="percentile-score-help" className="mt-2 text-xs text-gray-500">
            Enter an actual or predicted score from {MIN_SCORE} to {MAX_SCORE}.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-8 border-t border-gray-100 pt-8">
        {result ? (
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">
                {info.label} percentile
              </p>
              <p className="mt-1 font-mono text-5xl font-extrabold text-gray-950 lg:text-6xl">
                {formatPercentile(result.percentile)}
              </p>
              <p className="mt-3 text-gray-700 leading-relaxed">
                A {result.score} on {info.label} is at about the{" "}
                <strong>{formatPercentile(result.percentile)} percentile</strong> of first-time takers from
                LCME-accredited schools
                {result.percentile > 0 && result.percentile < 100
                  ? ` — roughly ${result.percentile}% of that group scored lower.`
                  : "."}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {result.exact
                  ? "Read directly from the official USMLE norm table."
                  : "Estimated by linear interpolation between the official 5-point rows."}
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Passing standard ({info.passingScore})</dt>
                <dd className={cn("font-bold", result.passes ? "text-mint-700" : "text-red-600")}>
                  {result.passes
                    ? `At or above passing (+${result.pointsVsPassing})`
                    : `Below passing (${result.pointsVsPassing})`}
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">
                  Vs. latest national mean ({info.means[info.means.length - 1].mean})
                </dt>
                <dd className="font-bold text-gray-950">
                  {result.pointsVsMean === 0
                    ? "Equal to the mean"
                    : `${result.pointsVsMean > 0 ? "+" : ""}${result.pointsVsMean} points`}
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">
                  ±1 measurement error (SEM ≈ {info.sem} pts: {result.semRange[0]}–{result.semRange[1]})
                </dt>
                <dd className="font-bold text-gray-950">
                  {formatPercentile(result.semLow)} to {formatPercentile(result.semHigh)} percentile
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-gray-600">
            Enter a whole-number score between {MIN_SCORE} and {MAX_SCORE} to see its percentile.
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Don&apos;t have a real score yet?{" "}
        <Link
          href={step === "step2ck" ? "/step-2-predictor" : "/step-3-predictor"}
          className="font-semibold text-mint-800 underline underline-offset-4"
        >
          Estimate your {info.label} score from practice exams
        </Link>{" "}
        first, then check where that estimate would place you.
      </p>
    </div>
  );
}
