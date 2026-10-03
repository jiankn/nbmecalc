"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import { formatPercentile, lookupPercentile } from "@/lib/usmle-norms";
import {
  POSITION_LABEL,
  countAtOrAboveMedian,
  positionInSpecialty,
  specialtiesByMedian,
  type SpecialtyPosition,
} from "@/lib/nrmp-step2-specialty";

const POSITION_TONE: Record<SpecialtyPosition, string> = {
  "below-q1": "bg-rose-50 text-rose-800",
  "q1-to-median": "bg-amber-50 text-amber-800",
  "median-to-q3": "bg-mint-50 text-mint-800",
  "above-q3": "bg-mint-100 text-mint-900",
};

// 条形图的刻度范围（分）。
const AXIS_MIN = 225;
const AXIS_MAX = 275;
const pct = (v: number) => `${((Math.min(AXIS_MAX, Math.max(AXIS_MIN, v)) - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100}%`;

const rows = specialtiesByMedian();

export function SpecialtyScoreChecker() {
  const [raw, setRaw] = useState("250");
  const started = useRef(false);
  const viewed = useRef(false);

  const score = Number(raw);
  const valid = raw.trim() !== "" && Number.isFinite(score) && score >= 1 && score <= 300;
  const s = valid ? Math.round(score) : null;

  useEffect(() => {
    if (!started.current || viewed.current || s === null) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "specialty_score" });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [s]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr] md:items-end">
        <div>
          <label htmlFor="specialty-score" className="mb-2 block text-sm font-bold text-gray-900">
            Your Step 2 CK score (actual or predicted)
          </label>
          <Input
            id="specialty-score"
            type="number"
            inputMode="numeric"
            min={1}
            max={300}
            value={raw}
            onChange={(e) => {
              if (!started.current) {
                started.current = true;
                trackProductEvent("calculator_started", { tool: "specialty_score" });
              }
              setRaw(e.target.value);
            }}
            className="font-mono text-lg"
          />
        </div>
        <p aria-live="polite" className="text-gray-700">
          {s !== null ? (
            <>
              A <strong>{s}</strong> is at the {formatPercentile(lookupPercentile("step2ck", s).percentile)} percentile
              nationally and at or above the matched median in{" "}
              <strong>
                {countAtOrAboveMedian(s)} of {rows.length}
              </strong>{" "}
              specialties.
            </>
          ) : (
            "Enter a whole-number score from 1 to 300."
          )}
        </p>
      </div>

      <div className="relative mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gray-200 text-left">
            <tr>
              <th scope="col" className="py-2 pr-3 font-bold text-gray-900">Specialty</th>
              <th scope="col" className="px-3 py-2 font-bold text-gray-900">Matched median</th>
              <th scope="col" className="px-3 py-2 font-bold text-gray-900">Middle 50% of matched</th>
              <th scope="col" className="px-3 py-2 font-bold text-gray-900">Not matched median</th>
              <th scope="col" className="w-1/4 px-3 py-2 font-bold text-gray-900">
                <span className="sr-only">Distribution chart</span>
              </th>
              <th scope="col" className="py-2 pl-3 font-bold text-gray-900">Your score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((sp) => {
              const pos = s !== null ? positionInSpecialty(s, sp) : null;
              return (
                <tr key={sp.slug} id={sp.slug} className="scroll-mt-24">
                  <td className="py-2.5 pr-3 font-semibold text-gray-950">
                    {sp.name}
                    <span className="block text-xs font-normal text-gray-500">
                      {sp.matched.n.toLocaleString("en-US")} matched
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-gray-950">{sp.matched.median}</td>
                  <td className="px-3 py-2.5 font-mono text-gray-800">
                    {sp.matched.q1}–{sp.matched.q3}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-800">
                    {sp.notMatched ? (
                      <>
                        {sp.notMatched.median}
                        {sp.notMatched.n < 20 && (
                          <span className="ml-1 font-sans text-xs text-gray-500">(n={sp.notMatched.n})</span>
                        )}
                      </>
                    ) : (
                      <span className="font-sans text-xs text-gray-500">not reported</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5" aria-hidden="true">
                    <div className="relative h-4 rounded-full bg-gray-100">
                      <div
                        className="absolute inset-y-0 rounded-full bg-mint-300"
                        style={{ left: pct(sp.matched.q1), width: `calc(${pct(sp.matched.q3)} - ${pct(sp.matched.q1)})` }}
                      />
                      <div className="absolute inset-y-0 w-0.5 bg-mint-800" style={{ left: pct(sp.matched.median) }} />
                      {s !== null && (
                        <div className="absolute -inset-y-1 w-1 rounded bg-gray-950" style={{ left: pct(s) }} />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 pl-3">
                    {pos && (
                      <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", POSITION_TONE[pos])}>
                        {POSITION_LABEL[pos]}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        Green bar: middle 50% of matched U.S. MD seniors (first to third quartile); dark tick: matched median; black
        marker: your score. Chart axis runs {AXIS_MIN}–{AXIS_MAX}. A score below the middle half does not mean you
        cannot match; a quarter of matched applicants scored there.
      </p>
    </div>
  );
}
