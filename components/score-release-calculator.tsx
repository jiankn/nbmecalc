"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trackProductEvent } from "@/lib/product-events";
import {
  ALLOW_DAYS,
  RELEASE_EXAMS,
  TYPICAL_DAYS,
  addDays,
  daysBetween,
  estimateRelease,
  formatLongDate,
  parseDateInput,
  planForDeadline,
  toDateInput,
  todayUtc,
  type ReleaseExam,
} from "@/lib/usmle-score-release";

type Mode = "release" | "deadline";

const MODES: { value: Mode; label: string }[] = [
  { value: "release", label: "When will my score come out?" },
  { value: "deadline", label: "When should I test by?" },
];

const STATUS_TEXT = {
  "not-taken": "This test date is in the future. The dates below are when to expect your score after you test.",
  waiting: "You are inside the normal four-week window. Most scores arrive by the first date below.",
  "late-typical":
    "You are past four weeks but still inside the eight weeks USMLE asks examinees to allow. A score at this point is later than usual but not unusual.",
  "past-allowance":
    "It has been more than eight weeks. Contact the organization that registered you for the exam to check the status of your score.",
} as const;

export function ScoreReleaseCalculator() {
  const [mode, setMode] = useState<Mode>("release");
  const [exam, setExam] = useState<ReleaseExam>("step2ck");
  // 日期默认值依赖用户本地"今天"，放到挂载后再填，避免服务端与客户端渲染不一致。
  const [testDate, setTestDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [today, setToday] = useState<Date | null>(null);
  const started = useRef(false);
  const viewed = useRef(false);

  useEffect(() => {
    const t = todayUtc();
    setToday(t);
    setTestDate(toDateInput(addDays(t, -14)));
    setDeadline(toDateInput(addDays(t, 90)));
  }, []);

  const completed = parseDateInput(testDate);
  const release = completed && today ? estimateRelease(completed, today) : null;
  const deadlineDate = parseDateInput(deadline);
  const plan = deadlineDate ? planForDeadline(deadlineDate) : null;
  const daysToSafe = plan && today ? daysBetween(today, plan.safeTestBy) : null;
  const examLabel = RELEASE_EXAMS.find((e) => e.value === exam)!.label;

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackProductEvent("calculator_started", { tool: "score_release" });
  }

  // 只在用户自己改过输入后记一次结果埋点。
  useEffect(() => {
    if (!started.current || viewed.current) return;
    if (mode === "release" ? !release : !plan) return;
    const timer = window.setTimeout(() => {
      viewed.current = true;
      trackProductEvent("result_viewed", { tool: "score_release", mode, step: exam });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [release, plan, mode, exam]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div
        role="radiogroup"
        aria-label="Calculator mode"
        className="mb-6 flex flex-col gap-1 rounded-3xl border border-gray-200 bg-gray-50 p-1 sm:inline-flex sm:flex-row sm:rounded-full"
      >
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={mode === m.value}
            onClick={() => {
              markStarted();
              setMode(m.value);
            }}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition",
              mode === m.value ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-950"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <span id="release-exam-label" className="mb-2 block text-sm font-bold text-gray-900">
            Exam
          </span>
          <div
            role="radiogroup"
            aria-labelledby="release-exam-label"
            className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1"
          >
            {RELEASE_EXAMS.map((e) => (
              <button
                key={e.value}
                type="button"
                role="radio"
                aria-checked={exam === e.value}
                onClick={() => {
                  markStarted();
                  setExam(e.value);
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  exam === e.value ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-950"
                )}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "release" ? (
          <div>
            <label htmlFor="release-test-date" className="mb-2 block text-sm font-bold text-gray-900">
              {exam === "step3" ? "Date you finished Step 3 (day 2)" : `Your ${examLabel} test date`}
            </label>
            <Input
              id="release-test-date"
              type="date"
              value={testDate}
              onChange={(e) => {
                markStarted();
                setTestDate(e.target.value);
              }}
              className="font-mono"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="release-deadline" className="mb-2 block text-sm font-bold text-gray-900">
              Date you need the score by
            </label>
            <Input
              id="release-deadline"
              type="date"
              value={deadline}
              onChange={(e) => {
                markStarted();
                setDeadline(e.target.value);
              }}
              className="font-mono"
              aria-describedby="release-deadline-help"
            />
            <p id="release-deadline-help" className="mt-2 text-xs text-gray-500">
              For example, an application, rotation, or graduation deadline.
            </p>
          </div>
        )}
      </div>

      <div aria-live="polite" className="mt-8 border-t border-gray-100 pt-8">
        {mode === "release" ? (
          release ? (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-mint-50 px-5 py-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">
                    Typical: by {TYPICAL_DAYS / 7} weeks
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-gray-950">{formatLongDate(release.typicalBy)}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 px-5 py-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    USMLE says allow: {ALLOW_DAYS / 7} weeks
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-gray-950">{formatLongDate(release.allowUntil)}</p>
                </div>
              </div>
              <p className="mt-5 leading-relaxed text-gray-700">
                {release.elapsed >= 0 && (
                  <strong>
                    {release.elapsed} {release.elapsed === 1 ? "day" : "days"} since your {examLabel}.{" "}
                  </strong>
                )}
                {STATUS_TEXT[release.status]}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">Pick a valid test date to see when to expect your score.</p>
          )
        ) : plan ? (
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-mint-50 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-mint-700">
                  Safe: test by ({ALLOW_DAYS / 7} weeks before)
                </p>
                <p className="mt-1 text-2xl font-extrabold text-gray-950">{formatLongDate(plan.safeTestBy)}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Risky: test by ({TYPICAL_DAYS / 7} weeks before)
                </p>
                <p className="mt-1 text-2xl font-extrabold text-gray-950">{formatLongDate(plan.typicalTestBy)}</p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-gray-700">
              {daysToSafe !== null && daysToSafe < 0 ? (
                <>
                  <strong>The safe test-by date has already passed.</strong> Testing now still gives a good chance of a
                  score within four weeks, but USMLE does not guarantee it.
                </>
              ) : (
                <>
                  To have your {examLabel} score in hand by {formatLongDate(plan.deadline)} with the full margin USMLE
                  recommends, finish the exam by <strong>{formatLongDate(plan.safeTestBy)}</strong>
                  {daysToSafe !== null && ` — ${daysToSafe} days from today`}.
                </>
              )}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Pick a valid deadline to see your latest test date.</p>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Dates are estimates based on USMLE&apos;s published timeline, not a guaranteed release date. USMLE does not
        publish a fixed release weekday.
      </p>
    </div>
  );
}
