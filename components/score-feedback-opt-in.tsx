"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateInput } from "@/lib/score-feedback";

export function ScoreFeedbackOptIn({ sessionId }: { sessionId: string }) {
  const [enabled, setEnabled] = useState(true);
  const [examDate, setExamDate] = useState(defaultExamDate());
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => enabled && /^cs_/.test(sessionId) && /^\d{4}-\d{2}-\d{2}$/.test(examDate),
    [enabled, examDate, sessionId]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/score-feedback/opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, examDate }),
      });
      const json = (await res.json().catch(() => null)) as
        | { record?: { scoreReleaseDate?: number | null }; error?: string }
        | null;
      if (!res.ok) throw new Error(json?.error ?? "Could not save reminder.");

      const release = json?.record?.scoreReleaseDate
        ? formatDateInput(json.record.scoreReleaseDate)
        : null;
      setStatus("saved");
      setMessage(
        release
          ? `Saved. We'll email you around ${release} to compare prediction vs. reality.`
          : "Saved. We'll email you after score release."
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not save reminder.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-8 text-left">
      <div className="flex items-start gap-3">
        <CalendarCheck2 className="h-5 w-5 text-amber-700 shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="font-bold text-gray-950 mb-1">Close the prediction loop</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We can email you on score-release week so you can compare your predicted score with your real outcome. One tap helps calibrate future reports.
          </p>

          <label className="flex items-start gap-3 text-sm text-gray-700 mb-4">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEnabled(e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-mint-600"
            />
            <span>Email me after my score is expected to release.</span>
          </label>

          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label htmlFor="exam-date" className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                Exam date
              </label>
              <Input
                id="exam-date"
                type="date"
                value={examDate}
                disabled={!enabled || status === "saving"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExamDate(e.target.value)
                }
              />
            </div>
            <Button type="submit" variant="primary" disabled={!canSubmit || status === "saving"}>
              {status === "saving" ? "Saving..." : "Save reminder"}
            </Button>
          </div>

          {message && (
            <p className={`text-sm mt-3 ${status === "error" ? "text-red-700" : "text-mint-700"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function defaultExamDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 21);
  return date.toISOString().slice(0, 10);
}
