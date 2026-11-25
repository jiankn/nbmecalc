"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { trackProductEvent } from "@/lib/product-events";

const cutoffFields = [
  { name: "passing", label: "Passing cutoff", required: false },
  { name: "honors", label: "Honors cutoff", required: false },
] as const;

const fields = [
  { name: "epc", label: "Your shelf EPC", required: true },
  ...cutoffFields,
] as const;

type Comparison = { label: string; difference: number };

export function ShelfScoreChecker() {
  const [values, setValues] = useState({ epc: "", passing: "", honors: "" });
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [error, setError] = useState("");
  const trackedResult = useRef(false);

  function compareScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const epc = Math.round(Number(values.epc) * 100);
    const result = cutoffFields.flatMap(({ name, label }) => {
      const value = values[name];
      if (value === "") return [];
      const cutoff = Math.round(Number(value) * 100);
      return [{ label, difference: (epc - cutoff) / 100 }];
    });

    if (result.length === 0) {
      setError("Enter at least one EPC cutoff from your clerkship's grading policy.");
      return;
    }

    setError("");
    setComparisons(result);
    if (!trackedResult.current) {
      trackedResult.current = true;
      trackProductEvent("result_viewed", {
        path: "/blog/nbme-shelf-exams-explained",
        placement: "shelf_epc_cutoffs",
      });
    }
  }

  return (
    <section
      id="shelf-score-checker"
      aria-labelledby="shelf-score-checker-title"
      className="not-prose my-8 scroll-mt-24 rounded-3xl border border-mint-200 bg-mint-50/50 p-5 sm:p-7"
    >
      <h2 id="shelf-score-checker-title" className="text-2xl font-extrabold tracking-tight text-gray-950">
        Compare your shelf score with your school&apos;s cutoffs
      </h2>
      <p id="shelf-score-checker-hint" className="mt-2 text-sm leading-relaxed text-gray-700">
        Use the total equated percent correct (EPC) from your report and the EPC cutoff for the same clerkship
        and rotation period. If your school lists a percentile cutoff, ask which norm table applies before
        comparing it with your EPC.
      </p>
      <form aria-describedby="shelf-score-checker-hint" className="mt-5" onSubmit={compareScore}>
        <div className="grid gap-4 sm:grid-cols-3">
          {fields.map(({ name, label, required }) => (
            <div key={name}>
              <label htmlFor={`shelf-${name}`} className="block text-sm font-semibold text-gray-950">
                {label} {!required && <span className="font-normal text-gray-600">(optional)</span>}
              </label>
              <input
                id={`shelf-${name}`}
                type="number"
                min={0}
                max={100}
                step={0.01}
                inputMode="decimal"
                required={required}
                value={values[name]}
                onChange={(event) => {
                  setValues({ ...values, [name]: event.target.value });
                  setError("");
                  setComparisons([]);
                }}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-600"
              />
            </div>
          ))}
        </div>
        <Button type="submit" className="mt-4">Compare scores</Button>
      </form>
      <div aria-live="polite">
        {error && <p className="mt-3 text-sm text-rose-800">{error}</p>}
        {comparisons.length > 0 && (
          <dl className="mt-4 divide-y divide-mint-100 rounded-2xl border border-mint-200 bg-white px-4">
            {comparisons.map(({ label, difference }) => (
              <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-3 text-sm">
                <dt className="text-gray-700">{label}</dt>
                <dd className="font-bold text-gray-950">
                  {difference === 0
                    ? "At the cutoff"
                    : `${Math.abs(difference)} ${Math.abs(difference) === 1 ? "point" : "points"} ${difference > 0 ? "above" : "below"}`}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-gray-700">
        For example, a shelf EPC of 72 is 7 points above a passing cutoff of 65 and 8 points below an honors
        cutoff of 80. Your school&apos;s policy determines your final clerkship grade.
      </p>
    </section>
  );
}
