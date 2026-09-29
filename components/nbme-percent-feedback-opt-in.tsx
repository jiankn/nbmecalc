"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CcssaForm, PercentInputKind } from "@/lib/nbme-percent-model";

/**
 * 正确率换算器下方的自愿回填入口：
 * 1. 先把本次换算存成一条预测记录（/api/predict，原始正确率存在 options 里）；
 * 2. 再复用现有的出分提醒流程（/api/score-feedback/prediction-opt-in）。
 * 用户考完后回填真实分数，这些配对数据只做汇总，用来校准换算曲线。
 */
export function NbmePercentFeedbackOptIn({
  form,
  mode,
  percent,
  midpoint,
}: {
  form: CcssaForm;
  mode: PercentInputKind;
  percent: number;
  midpoint: number;
}) {
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
      const predictRes = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "step2",
          exams: [{ id: "nbme-percent", source: "NBME", formNumber: form, score: midpoint }],
          options: { nbmePercentInput: { form, mode, percent: Math.round(percent * 10) / 10 } },
        }),
      });
      const predictJson = (await predictRes.json().catch(() => null)) as
        | { predictionId?: string; error?: string }
        | null;
      if (!predictRes.ok || !predictJson?.predictionId) {
        throw new Error(predictJson?.error ?? "Could not save this result.");
      }

      const optInRes = await fetch("/api/score-feedback/prediction-opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictionId: predictJson.predictionId, email, examDate }),
      });
      const optInJson = (await optInRes.json().catch(() => null)) as { error?: string } | null;
      if (!optInRes.ok) {
        throw new Error(
          optInJson?.error === "not_found"
            ? "Could not save right now. Please try again in a minute."
            : optInJson?.error ?? "Could not save reminder."
        );
      }
      setStatus("saved");
      setMessage("Saved. We’ll email you once after your expected score-release date.");
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
          <h3 className="font-bold text-gray-950">Help make this conversion more accurate</h3>
          <p className="mt-1 text-sm text-gray-700">
            Save this result and get one reminder after your real Step 2 CK score is released. Your NBME percent
            and real score are used only in aggregate to recalibrate the conversion; no individual record is
            published.
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
              aria-label="Real Step 2 CK exam date"
            />
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : "Opt in"}
            </Button>
          </div>
          {message && status === "error" && <p className="mt-3 text-sm text-red-700">{message}</p>}
          <p className="mt-3 text-xs text-gray-600">
            Optional. No marketing subscription. See the{" "}
            <a href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </a>{" "}
            for retention.
          </p>
        </div>
      </div>
    </form>
  );
}
