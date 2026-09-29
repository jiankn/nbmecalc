"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import {
  CCSSA_FORMS,
  CCSSA_QUESTIONS,
  estimateStep2FromPercent,
  percentFromCorrect,
  type CcssaForm,
} from "@/lib/nbme-percent-model";
import { NORM_INFO, formatPercentile, lookupPercentile } from "@/lib/usmle-norms";
import { NbmePercentFeedbackOptIn } from "@/components/nbme-percent-feedback-opt-in";

type Mode = "epc" | "percent" | "correct";

const MODES: { value: Mode; label: string; help: string }[] = [
  {
    value: "epc",
    label: "EPC from report",
    help: "The equated percent correct (EPC) printed on your NBME score report.",
  },
  {
    value: "percent",
    label: "Percent correct",
    help: "Your own percent correct. It can differ slightly from EPC, so the range is wider.",
  },
  {
    value: "correct",
    label: `Number correct (of ${CCSSA_QUESTIONS})`,
    help: `How many of the ${CCSSA_QUESTIONS} questions you answered correctly.`,
  },
];

export function NbmePercentConverter({ defaultForm = 16 }: { defaultForm?: CcssaForm }) {
  const [form, setForm] = useState<CcssaForm>(defaultForm);
  const [mode, setMode] = useState<Mode>("percent");
  const [raw, setRaw] = useState("75");
  const started = useRef(false);
  const viewed = useRef(false);

  // 表单小节里的链接带 ?form=14 这类参数，进页面时自动预选对应表单。
  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("form"));
    if ((CCSSA_FORMS as readonly number[]).includes(fromUrl)) setForm(fromUrl as CcssaForm);
  }, []);

  const value = Number(raw);
  const max = mode === "correct" ? CCSSA_QUESTIONS : 100;
  const valid = raw.trim() !== "" && Number.isFinite(value) && value >= 0 && value <= max;
  const percent = valid ? (mode === "correct" ? percentFromCorrect(value) : value) : null;
  const est = percent === null ? null : estimateStep2FromPercent(percent, mode === "epc" ? "epc" : "raw");
  const pct = est ? lookupPercentile("step2ck", est.midpoint).percentile : null;
  const passing = NORM_INFO.step2ck.passingScore;

  useEffect(() => {
    if (!started.current || viewed.current || !est) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "nbme_percent", form, mode });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [est, form, mode]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackProductEvent("calculator_started", { tool: "nbme_percent" });
  }

  function switchMode(next: Mode) {
    markStarted();
    // 在"题数"和"百分比"之间切换时，把当前值换算过去，避免 75 题被当成 75%。
    if (valid && (next === "correct") !== (mode === "correct")) {
      setRaw(
        next === "correct"
          ? String(Math.round((value / 100) * CCSSA_QUESTIONS))
          : String(Math.round(percentFromCorrect(value) * 10) / 10)
      );
    }
    setMode(next);
  }

  const activeMode = MODES.find((m) => m.value === mode)!;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div>
          <label htmlFor="ccssa-form" className="mb-2 block text-sm font-bold text-gray-900">
            CCSSA form
          </label>
          <select
            id="ccssa-form"
            value={form}
            onChange={(e) => {
              markStarted();
              setForm(Number(e.target.value) as CcssaForm);
            }}
            className="h-12 w-full rounded-full border border-gray-200 bg-white px-5 text-base focus-visible:border-mint-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 md:w-40"
          >
            {CCSSA_FORMS.map((f) => (
              <option key={f} value={f}>
                NBME {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span id="nbme-mode-label" className="mb-2 block text-sm font-bold text-gray-900">
            What do you have?
          </span>
          <div
            role="radiogroup"
            aria-labelledby="nbme-mode-label"
            className="flex flex-wrap gap-1 rounded-3xl border border-gray-200 bg-gray-50 p-1 sm:inline-flex sm:rounded-full"
          >
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={mode === m.value}
                onClick={() => switchMode(m.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  mode === m.value ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-950"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="nbme-percent-input" className="mb-2 block text-sm font-bold text-gray-900">
          {mode === "correct" ? `Questions correct (0–${CCSSA_QUESTIONS})` : "Percent (0–100)"}
        </label>
        <Input
          id="nbme-percent-input"
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={mode === "correct" ? 1 : 0.1}
          value={raw}
          onChange={(e) => {
            markStarted();
            setRaw(e.target.value);
          }}
          className="font-mono text-lg md:max-w-xs"
          aria-describedby="nbme-percent-help"
        />
        <p id="nbme-percent-help" className="mt-2 text-xs text-gray-500">
          {activeMode.help}
        </p>
      </div>

      <div aria-live="polite" className="mt-8 border-t border-gray-100 pt-8">
        {est && pct !== null ? (
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">
                Estimated Step 2 CK score · NBME {form}
              </p>
              <p className="mt-1 font-mono text-5xl font-extrabold text-gray-950 lg:text-6xl">{est.midpoint}</p>
              <p className="mt-2 font-mono text-lg text-gray-700">
                Likely range {est.low}–{est.high}
              </p>
              <p className="mt-3 leading-relaxed text-gray-700">
                {Math.round(est.percent * 10) / 10}% correct on NBME {form} estimates about{" "}
                <strong>{est.midpoint}</strong> on the Step 2 CK scale.
              </p>
              {est.extrapolated && (
                <p className="mt-2 text-xs text-amber-700">
                  This percent is outside the two published reference points (58%–77%), so the estimate is an
                  extrapolation and the range is wider.
                </p>
              )}
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Passing standard ({passing})</dt>
                <dd className={cn("font-bold", est.midpoint >= passing ? "text-mint-700" : "text-red-600")}>
                  {est.low >= passing
                    ? "Whole range is above passing"
                    : est.high < passing
                      ? "Whole range is below passing"
                      : "Range overlaps the passing line"}
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">2026 national percentile of {est.midpoint}</dt>
                <dd className="font-bold text-gray-950">{formatPercentile(pct)} percentile</dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Input used</dt>
                <dd className="font-bold text-gray-950">
                  {mode === "epc" ? "Report EPC" : "Self-counted percent"} · {Math.round(est.percent * 10) / 10}%
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-gray-600">
            Enter a value between 0 and {max} to see the estimate.
          </p>
        )}
      </div>

      {est && (
        <NbmePercentFeedbackOptIn
          form={form}
          mode={mode === "epc" ? "epc" : "raw"}
          percent={est.percent}
          midpoint={est.midpoint}
        />
      )}

      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        Independent NBMEcalc estimate built from two reference points in NBME&apos;s published sample CCSSA
        report. It is not an official NBME conversion. If your score report already shows a Total CCSSA Score,
        that number is NBME&apos;s own Step 2 CK estimate — use it directly.
      </p>
    </div>
  );
}
