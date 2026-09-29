"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import {
  CBSSA_FORMS,
  CBSSA_QUESTIONS,
  DEFAULT_LOW_PASS,
  READINESS_COPY,
  estimateCbssaReadiness,
  type CbssaForm,
} from "@/lib/cbssa-readiness";

type Mode = "epc" | "percent" | "correct";

const MODES: { value: Mode; label: string; help: string }[] = [
  { value: "epc", label: "EPC from report", help: "The total equated percent correct printed on your CBSSA report." },
  { value: "percent", label: "Percent correct", help: "Your own percent correct; the range is widened because it is not equated." },
  { value: "correct", label: `Number correct (of ${CBSSA_QUESTIONS})`, help: `How many of the ${CBSSA_QUESTIONS} questions you answered correctly.` },
];

export function CbssaReadinessChecker({ defaultForm = 32 }: { defaultForm?: CbssaForm }) {
  const [form, setForm] = useState<CbssaForm>(defaultForm);
  const [mode, setMode] = useState<Mode>("percent");
  const [raw, setRaw] = useState("68");
  const [lpLow, setLpLow] = useState(String(DEFAULT_LOW_PASS.low));
  const [lpHigh, setLpHigh] = useState(String(DEFAULT_LOW_PASS.high));
  const started = useRef(false);
  const viewed = useRef(false);

  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("form"));
    if ((CBSSA_FORMS as readonly number[]).includes(fromUrl)) setForm(fromUrl as CbssaForm);
  }, []);

  const value = Number(raw);
  const max = mode === "correct" ? CBSSA_QUESTIONS : 100;
  const valid = raw.trim() !== "" && Number.isFinite(value) && value >= 0 && value <= max;
  const lp = { low: Number(lpLow), high: Number(lpHigh) };
  const lpValid = Number.isFinite(lp.low) && Number.isFinite(lp.high) && lp.low >= 0 && lp.high <= 100 && lp.low <= lp.high;
  const percent = valid ? (mode === "correct" ? (value / CBSSA_QUESTIONS) * 100 : value) : null;
  const est =
    percent !== null && lpValid ? estimateCbssaReadiness(percent, mode === "epc" ? "epc" : "raw", lp) : null;
  const copy = est ? READINESS_COPY[est.state] : null;

  useEffect(() => {
    if (!started.current || viewed.current || !est) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "cbssa_readiness", form, mode });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [est, form, mode]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackProductEvent("calculator_started", { tool: "cbssa_readiness" });
  }

  function switchMode(next: Mode) {
    markStarted();
    if (valid && (next === "correct") !== (mode === "correct")) {
      setRaw(
        next === "correct"
          ? String(Math.round((value / 100) * CBSSA_QUESTIONS))
          : String(Math.round((value / CBSSA_QUESTIONS) * 1000) / 10)
      );
    }
    setMode(next);
  }

  // 0–100 刻度上的位置，用来画区间条。
  const pos = (v: number) => `${Math.min(100, Math.max(0, v))}%`;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div>
          <label htmlFor="cbssa-form" className="mb-2 block text-sm font-bold text-gray-900">
            CBSSA form
          </label>
          <select
            id="cbssa-form"
            value={form}
            onChange={(e) => {
              markStarted();
              setForm(Number(e.target.value) as CbssaForm);
            }}
            className="h-12 w-full rounded-full border border-gray-200 bg-white px-5 text-base focus-visible:border-mint-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 md:w-40"
          >
            {CBSSA_FORMS.map((f) => (
              <option key={f} value={f}>
                NBME {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span id="cbssa-mode-label" className="mb-2 block text-sm font-bold text-gray-900">
            What do you have?
          </span>
          <div
            role="radiogroup"
            aria-labelledby="cbssa-mode-label"
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cbssa-input" className="mb-2 block text-sm font-bold text-gray-900">
            {mode === "correct" ? `Questions correct (0–${CBSSA_QUESTIONS})` : "Percent (0–100)"}
          </label>
          <Input
            id="cbssa-input"
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
            className="font-mono text-lg"
            aria-describedby="cbssa-input-help"
          />
          <p id="cbssa-input-help" className="mt-2 text-xs text-gray-500">
            {MODES.find((m) => m.value === mode)!.help}
          </p>
        </div>
        <fieldset>
          <legend className="mb-2 block text-sm font-bold text-gray-900">Step 1 low-pass range (EPC %)</legend>
          <div className="flex items-center gap-2">
            <Input
              aria-label="Low-pass range lower bound"
              type="number"
              min={0}
              max={100}
              value={lpLow}
              onChange={(e) => setLpLow(e.target.value)}
              className="font-mono"
            />
            <span className="text-gray-500">–</span>
            <Input
              aria-label="Low-pass range upper bound"
              type="number"
              min={0}
              max={100}
              value={lpHigh}
              onChange={(e) => setLpHigh(e.target.value)}
              className="font-mono"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Defaults to about {DEFAULT_LOW_PASS.low}–{DEFAULT_LOW_PASS.high}%, as drawn on NBME&apos;s sample report. If
            your own report shows a different band, enter it here.
          </p>
        </fieldset>
      </div>

      <div aria-live="polite" className="mt-8 border-t border-gray-100 pt-8">
        {est && copy ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">NBME {form} · Step 1 readiness</p>
            <div className={cn("mt-3 rounded-2xl border p-5", copy.tone)}>
              <p className="text-lg font-extrabold">{copy.title}</p>
              <p className="mt-2 text-sm leading-relaxed">{copy.body}</p>
            </div>

            <div className="mt-6" aria-hidden="true">
              <div className="relative h-10 rounded-full bg-gray-100">
                <div
                  className="absolute inset-y-0 rounded-full bg-gray-300"
                  style={{ left: pos(lp.low), width: `${lp.high - lp.low}%` }}
                />
                <div
                  className="absolute inset-y-2 rounded-full bg-mint-400/70"
                  style={{ left: pos(est.likelyLow), width: `${est.likelyHigh - est.likelyLow}%` }}
                />
                <div className="absolute inset-y-0 w-1 bg-gray-950" style={{ left: pos(est.percent) }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[11px] text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Your percent</dt>
                <dd className="font-bold text-gray-950">{Math.round(est.percent * 10) / 10}%</dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Likely range (green)</dt>
                <dd className="font-bold text-gray-950">
                  {est.likelyLow}–{est.likelyHigh}%
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Low-pass range (gray)</dt>
                <dd className="font-bold text-gray-950">
                  {lp.low}–{lp.high}%
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-gray-600">Enter a valid percent (0–{max}) and low-pass range to see the readiness check.</p>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        This applies NBME&apos;s published four-scenario guidance to your number. It does not calculate a pass
        probability; the probability printed on your official CBSSA report remains the primary readiness signal.
      </p>
    </div>
  );
}
