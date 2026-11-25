"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const followUpDays = {
  7: [3],
  14: [9, 4],
  28: [17, 6],
} as const;

type Days = keyof typeof followUpDays;

export function Step2FormPlanner() {
  const [days, setDays] = useState<Days>(14);
  const [formInput, setFormInput] = useState("");
  const [hasBaseline, setHasBaseline] = useState(false);

  const enteredForms = formInput.trim().split(/[\s,]+/).filter(Boolean);
  const invalid = enteredForms.some((form) => !/^[1-9]\d?$/.test(form));
  const forms = [...new Set(enteredForms)];
  const [firstForm, ...remainingForms] = forms;
  const hasNewBaseline = !hasBaseline && firstForm !== undefined;
  const followUpForms = hasNewBaseline ? remainingForms : forms;
  const availableSlots = followUpDays[days];
  const scheduledFollowUps = followUpForms.slice(0, availableSlots.length);
  const scheduledDays = availableSlots.slice(availableSlots.length - scheduledFollowUps.length);
  const unused = followUpForms.slice(scheduledFollowUps.length);

  return (
    <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="space-y-6 p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-bold text-gray-900">Days until your exam</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {([7, 14, 28] as const).map((window) => (
              <label
                key={window}
                className={cn(
                  "cursor-pointer rounded-xl border px-2 py-2.5 text-center text-sm font-semibold focus-within:ring-2 focus-within:ring-mint-600 focus-within:ring-offset-2",
                  days === window
                    ? "border-mint-600 bg-mint-50 text-mint-900"
                    : "border-gray-200 text-gray-700 hover:border-mint-400"
                )}
              >
                <input
                  type="radio"
                  name="step-2-plan-days"
                  value={window}
                  checked={days === window}
                  onChange={() => setDays(window)}
                  className="sr-only"
                />
                {window} days
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="unused-ccssa" className="text-sm font-bold text-gray-900">
            Unused CCSSA forms you can take
          </label>
          <input
            id="unused-ccssa"
            type="text"
            value={formInput}
            onChange={(event) => setFormInput(event.target.value)}
            placeholder="For example, 14, 16"
            maxLength={80}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid}
            aria-describedby="unused-ccssa-hint"
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-600"
          />
          <p id="unused-ccssa-hint" className={cn("mt-2 text-sm", invalid ? "text-red-700" : "text-gray-600")}>
            {invalid
              ? "Enter form numbers separated by commas or spaces, such as 14, 16."
              : "Use numbers from your own MyNBME list. Leave blank if you have no unused forms."}
          </p>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-gray-800">
          <input
            type="checkbox"
            checked={hasBaseline}
            onChange={(event) => setHasBaseline(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-mint-700"
          />
          I already took a recent CCSSA under test-like conditions.
        </label>
      </div>

      <div className="border-t border-mint-100 bg-mint-50/50 p-6 sm:p-8 md:border-l md:border-t-0" aria-live="polite">
        <h3 className="text-lg font-extrabold text-gray-950">Your {days}-day plan</h3>
        {invalid ? (
          <p className="mt-3 text-sm text-gray-700">Fix the form numbers to see an updated plan.</p>
        ) : (
          <>
            <ol className="mt-4 space-y-4">
              <li>
                <p className="text-sm font-bold text-mint-900">Today</p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {hasNewBaseline
                    ? `Take Form ${firstForm} as your baseline. Use the score report and misses to choose what to review.`
                    : hasBaseline
                      ? "Review your latest CCSSA report and list the topics or timing issues to work on."
                      : "Check MyNBME for an unused CCSSA. Use your most recent timed practice and error log to guide review in the meantime."}
                </p>
              </li>
              {scheduledFollowUps.map((form, index) => {
                const isFinal = index === scheduledFollowUps.length - 1;
                return (
                  <li key={form}>
                    <p className="text-sm font-bold text-mint-900">{scheduledDays[index]} days before the exam</p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {isFinal
                        ? `Take Form ${form} as your final fresh CCSSA. Read the report and leave time to act on it.`
                        : `Take Form ${form} to check progress after review. Keep your next form fresh for the final check.`}
                    </p>
                  </li>
                );
              })}
            </ol>
            {hasNewBaseline && !remainingForms.length && (
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                With one form and no recent baseline, taking it early gives you more time to use its feedback.
              </p>
            )}
            {unused.length > 0 && (
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                Keep {unused.length === 1 ? "Form" : "Forms"} {unused.join(", ")} in reserve.
              </p>
            )}
            <p className="mt-5 border-t border-mint-200 pt-4 text-sm leading-relaxed text-gray-700">
              Use the days between forms for review. Put any Free 120 practice on a separate day if your schedule allows.
              This is a sample schedule you can adjust to your available study time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
