"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import { DEFAULT_LOW_PASS } from "@/lib/cbssa-readiness";
import { FREE120_DEFAULT_ITEMS, FREE120_STATE_COPY, estimateFree120Step1 } from "@/lib/free-120-step1";

type Mode = "percent" | "correct";

const MODES: { value: Mode; label: string }[] = [
  { value: "percent", label: "Percent correct" },
  { value: "correct", label: "Number correct" },
];

export function Free120Step1Checker() {
  const [mode, setMode] = useState<Mode>("percent");
  const [raw, setRaw] = useState("65");
  const [itemsRaw, setItemsRaw] = useState(String(FREE120_DEFAULT_ITEMS));
  const started = useRef(false);
  const viewed = useRef(false);

  const items = Number(itemsRaw);
  const itemsValid = Number.isInteger(items) && items >= 20 && items <= 200;
  const value = Number(raw);
  const max = mode === "correct" ? (itemsValid ? items : 200) : 100;
  const valid = itemsValid && raw.trim() !== "" && Number.isFinite(value) && value >= 0 && value <= max;
  const correct = valid ? (mode === "correct" ? value : (value / 100) * items) : null;
  const est = correct !== null ? estimateFree120Step1(correct, items) : null;
  const copy = est ? FREE120_STATE_COPY[est.state] : null;

  useEffect(() => {
    if (!started.current || viewed.current || !est) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "free120_step1", mode, state: est.state });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [est, mode]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackProductEvent("calculator_started", { tool: "free120_step1" });
  }

  function switchMode(next: Mode) {
    markStarted();
    if (valid && next !== mode) {
      setRaw(
        next === "correct"
          ? String(Math.round((value / 100) * items))
          : String(Math.round((value / items) * 1000) / 10)
      );
    }
    setMode(next);
  }

  // 0–100 刻度上的位置，用来画区间条。
  const pos = (v: number) => `${Math.min(100, Math.max(0, v))}%`;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div>
        <span id="f120-mode-label" className="mb-2 block text-sm font-bold text-gray-900">
          What do you have?
        </span>
        <div
          role="radiogroup"
          aria-labelledby="f120-mode-label"
          className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1"
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="f120-input" className="mb-2 block text-sm font-bold text-gray-900">
            {mode === "correct" ? "Questions correct" : "Your Free 120 percent (0–100)"}
          </label>
          <Input
            id="f120-input"
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
          />
        </div>
        <div>
          <label htmlFor="f120-items" className="mb-2 block text-sm font-bold text-gray-900">
            Questions in your set
          </label>
          <Input
            id="f120-items"
            type="number"
            inputMode="numeric"
            min={20}
            max={200}
            step={1}
            value={itemsRaw}
            onChange={(e) => {
              markStarted();
              setItemsRaw(e.target.value);
            }}
            className="font-mono text-lg"
            aria-describedby="f120-items-help"
          />
          <p id="f120-items-help" className="mt-2 text-xs text-gray-500">
            Leave at {FREE120_DEFAULT_ITEMS} unless your version had a different number of questions. Fewer
            questions means a wider range.
          </p>
        </div>
      </div>

      <div aria-live="polite" className="mt-8 border-t border-gray-100 pt-8">
        {est && copy ? (
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">
              Free 120 · Step 1 readiness check
            </p>
            <div className={cn("mt-3 rounded-2xl border p-5", copy.tone)}>
              <p className="text-lg font-extrabold">{copy.title}</p>
              <p className="mt-2 text-sm leading-relaxed">{copy.body}</p>
            </div>

            <div className="mt-6" aria-hidden="true">
              <div className="relative h-10 rounded-full bg-gray-100">
                <div
                  className="absolute inset-y-0 rounded-full bg-gray-300"
                  style={{ left: pos(DEFAULT_LOW_PASS.low), width: `${DEFAULT_LOW_PASS.high - DEFAULT_LOW_PASS.low}%` }}
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
                <dt className="text-gray-500">Your result</dt>
                <dd className="font-bold text-gray-950">
                  {est.percent}% ({est.correct}/{est.items})
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Likely range (green, ±{est.halfWidth})</dt>
                <dd className="font-bold text-gray-950">
                  {est.likelyLow}–{est.likelyHigh}%
                </dd>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">CBSSA low-pass band (gray)</dt>
                <dd className="font-bold text-gray-950">
                  {DEFAULT_LOW_PASS.low}–{DEFAULT_LOW_PASS.high}%
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-gray-600">
            Enter a valid result (0–{max}) and a question count between 20 and 200 to see the check.
          </p>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        This is not a pass probability. Free 120 reports a raw percent correct, and NBME has not published a Free
        120 passing line. The gray band is the low-pass range from NBME&apos;s CBSSA sample report, used here only as
        a rough reference.
      </p>
    </div>
  );
}
