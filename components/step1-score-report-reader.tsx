"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReadinessState = "below" | "overlap-below" | "near" | "above";
type RangeValue = number | "";

const guidance: Record<
  ReadinessState,
  { title: string; body: string; tone: string }
> = {
  below: {
    title: "Your likely range is below the low-pass range",
    body: "The official NBME guidance treats this as a signal that additional preparation is strongly recommended. Use the probability printed on your report and discuss timing with your school or advisor.",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
  },
  "overlap-below": {
    title: "Your likely range overlaps the lower edge",
    body: "This is a borderline pattern: part of the likely range remains below the low-pass range. One result should not decide your exam date by itself.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  near: {
    title: "Your likely range remains in or near the low-pass range",
    body: "Performance near the minimum standard still carries meaningful uncertainty. Compare the official probability, your trajectory, and other readiness evidence before making a decision.",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  above: {
    title: "Your likely range is above the low-pass range",
    body: "This is the most reassuring of the four official report patterns, but it is not a guarantee. Keep the conditions and timing of this assessment in mind.",
    tone: "border-mint-200 bg-mint-50 text-gray-950",
  },
};

export function Step1ScoreReportReader() {
  const [likelyLow, setLikelyLow] = useState<RangeValue>("");
  const [likelyHigh, setLikelyHigh] = useState<RangeValue>("");
  const [lowPassLow, setLowPassLow] = useState<RangeValue>("");
  const [lowPassHigh, setLowPassHigh] = useState<RangeValue>("");
  const [probability, setProbability] = useState<number | "">("");
  const [showResult, setShowResult] = useState(false);

  const valid =
    likelyLow !== "" &&
    likelyHigh !== "" &&
    lowPassLow !== "" &&
    lowPassHigh !== "" &&
    likelyLow >= 0 &&
    likelyHigh <= 100 &&
    lowPassLow >= 0 &&
    lowPassHigh <= 100 &&
    likelyLow <= likelyHigh &&
    lowPassLow <= lowPassHigh &&
    (probability === "" || (probability >= 1 && probability <= 99));

  const state = useMemo<ReadinessState>(() => {
    if (
      likelyLow === "" ||
      likelyHigh === "" ||
      lowPassLow === "" ||
      lowPassHigh === ""
    ) {
      return "near";
    }
    if (likelyHigh < lowPassLow) return "below";
    if (likelyLow < lowPassLow) return "overlap-below";
    if (likelyLow > lowPassHigh) return "above";
    return "near";
  }, [likelyHigh, likelyLow, lowPassHigh, lowPassLow]);

  const result = guidance[state];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Copy the two ranges from your official CBSSA report. This reader does
          not invent a raw-wrong-answer conversion or replace the probability
          printed by NBME.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <RangeInputs
          legend="Your CBSSA likely score range"
          low={likelyLow}
          high={likelyHigh}
          onLow={setLikelyLow}
          onHigh={setLikelyHigh}
          prefix="likely"
        />
        <RangeInputs
          legend="Step 1 low-pass range on your report"
          low={lowPassLow}
          high={lowPassHigh}
          onLow={setLowPassLow}
          onHigh={setLowPassHigh}
          prefix="low-pass"
        />
      </div>

      <div className="mt-5 max-w-xs">
        <label
          htmlFor="official-pass-probability"
          className="text-sm font-semibold text-gray-800"
        >
          Official probability of passing (optional)
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id="official-pass-probability"
            type="number"
            min={1}
            max={99}
            value={probability}
            onChange={(event) =>
              setProbability(
                event.target.value === "" ? "" : Number(event.target.value)
              )
            }
            className="h-11 w-28 rounded-xl border border-gray-300 px-3 font-mono focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-200"
          />
          <span className="text-gray-600">%</span>
        </div>
      </div>

      <Button
        className="mt-6 w-full sm:w-auto"
        size="lg"
        disabled={!valid}
        onClick={() => setShowResult(true)}
      >
        Interpret my report ranges
      </Button>

      {!valid && (
        <p className="mt-3 text-sm text-rose-700">
          Check that each lower value is not greater than its upper value and
          that all entries are within the displayed percentage range.
        </p>
      )}

      {showResult && valid && (
        <div className={`mt-7 rounded-2xl border p-5 ${result.tone}`}>
          <div className="flex gap-3">
            {state === "above" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div>
              <h3 className="font-bold">{result.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{result.body}</p>
              {probability !== "" && (
                <p className="mt-3 text-sm font-semibold">
                  Your report&apos;s estimated probability: {probability}%.
                  NBME states that this estimate is not a guarantee.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeInputs({
  legend,
  low,
  high,
  onLow,
  onHigh,
  prefix,
}: {
  legend: string;
  low: RangeValue;
  high: RangeValue;
  onLow: (value: RangeValue) => void;
  onHigh: (value: RangeValue) => void;
  prefix: string;
}) {
  return (
    <fieldset className="rounded-2xl border border-gray-200 p-4">
      <legend className="px-1 text-sm font-bold text-gray-900">{legend}</legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-gray-600">
          Lower
          <input
            id={`${prefix}-lower`}
            type="number"
            min={0}
            max={100}
            value={low}
            onChange={(event) =>
              onLow(event.target.value === "" ? "" : Number(event.target.value))
            }
            className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3 font-mono text-gray-950 focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-200"
          />
        </label>
        <label className="text-xs font-semibold text-gray-600">
          Upper
          <input
            id={`${prefix}-upper`}
            type="number"
            min={0}
            max={100}
            value={high}
            onChange={(event) =>
              onHigh(event.target.value === "" ? "" : Number(event.target.value))
            }
            className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3 font-mono text-gray-950 focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-200"
          />
        </label>
      </div>
    </fieldset>
  );
}
