"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PredictionFeedbackOptIn({ predictionId }: { predictionId: string }) {
  const [email, setEmail] = useState("");
  const [examDate, setExamDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 21);
    return date.toISOString().slice(0, 10);
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const response = await fetch("/api/score-feedback/prediction-opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictionId, email, examDate }),
      });
      const json = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(json?.error ?? "Could not save reminder.");
      setStatus("saved");
      setMessage("Saved. We’ll email you after the expected score-release date.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save reminder.");
    }
  }

  if (status === "saved") {
    return (
      <div className="mt-6 rounded-2xl border border-mint-200 bg-mint-50 p-4 text-sm text-mint-900">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex gap-3">
        <CalendarCheck2 className="h-5 w-5 shrink-0 text-amber-700" />
        <div className="flex-1">
          <h4 className="font-bold text-gray-950">Help validate this estimate</h4>
          <p className="mt-1 text-sm text-gray-700">
            Opt in to one score-release reminder. Your outcome will be used for
            aggregate validation; it will not be published as an individual record.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_170px_auto]">
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email for one reminder"
              aria-label="Reminder email"
            />
            <Input
              type="date"
              required
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              aria-label="Real exam date"
            />
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : "Opt in"}
            </Button>
          </div>
          {message && status === "error" && (
            <p className="mt-3 text-sm text-red-700">{message}</p>
          )}
          <p className="mt-3 text-xs text-gray-600">
            Optional. No marketing subscription. See the Privacy Policy for retention.
          </p>
        </div>
      </div>
    </form>
  );
}
