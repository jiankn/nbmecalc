"use client";

import { useState, type FormEvent } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CCMSA_FORMS, CCMSA_SCORE_MAX, CCMSA_SCORE_MIN } from "@/lib/ccmsa-submission";

/**
 * /step-3-predictor CCMSA 小节下方的自愿提交表单（研究数据收集）。
 * 提交到 /api/ccmsa-submissions，只落库，不返回也不显示任何换算结果。
 * 留了邮箱和考试日期的，出分后由现有提醒邮件请用户回填真实 Step 3 分数。
 */
export function CcmsaResearchForm() {
  const [form, setForm] = useState<number>(CCMSA_FORMS[CCMSA_FORMS.length - 1]);
  const [assessmentScore, setAssessmentScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const wantsReminder = email.trim() !== "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const res = await fetch("/api/ccmsa-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          assessmentScore: Number(assessmentScore),
          examDate: examDate || undefined,
          email: email.trim() || undefined,
          consent,
        }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; reminderScheduled?: boolean; error?: string }
        | null;
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? "Could not save right now. Please try again in a minute.");
      }
      setStatus("saved");
      setMessage(
        json.reminderScheduled
          ? "Thanks, your CCMSA score is saved. We’ll send one email after your expected Step 3 score-release date asking for your real score."
          : "Thanks, your CCMSA score is saved for research."
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save right now.");
    }
  }

  if (status === "saved") {
    return (
      <div
        id="ccmsa-research"
        role="status"
        className="mt-12 rounded-3xl border border-mint-200 bg-mint-50 p-6 text-sm text-mint-900"
      >
        {message}
      </div>
    );
  }

  return (
    <form
      id="ccmsa-research"
      onSubmit={onSubmit}
      className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6"
    >
      <div className="flex gap-3">
        <FlaskConical className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold tracking-tight text-gray-950">
            Share your CCMSA score for research
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            There is no CCMSA-to-Step 3 conversion today, and NBME says CCMSA is not intended to
            predict Step 3 performance. To learn whether any reliable relationship exists, we are
            collecting paired results: your CCMSA Assessment Score now, and your real Step 3 score
            once it is released. Submitting will not show you a converted score.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ccmsa-form" className="mb-2 block text-sm font-bold text-gray-900">
                CCMSA form
              </label>
              <select
                id="ccmsa-form"
                value={form}
                onChange={(event) => setForm(Number(event.target.value))}
                className="h-12 w-full rounded-full border border-gray-200 bg-white px-5 text-base focus-visible:border-mint-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
              >
                {CCMSA_FORMS.map((f) => (
                  <option key={f} value={f}>
                    Form {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ccmsa-score" className="mb-2 block text-sm font-bold text-gray-900">
                Assessment Score ({CCMSA_SCORE_MIN}–{CCMSA_SCORE_MAX})
              </label>
              <Input
                id="ccmsa-score"
                type="number"
                required
                min={CCMSA_SCORE_MIN}
                max={CCMSA_SCORE_MAX}
                step={1}
                inputMode="numeric"
                value={assessmentScore}
                onChange={(event) => setAssessmentScore(event.target.value)}
                placeholder="From your score report"
              />
            </div>
            <div>
              <label htmlFor="ccmsa-exam-date" className="mb-2 block text-sm font-bold text-gray-900">
                Step 3 exam date{" "}
                <span className="font-normal text-gray-600">
                  {wantsReminder ? "(needed for the reminder)" : "(optional)"}
                </span>
              </label>
              <Input
                id="ccmsa-exam-date"
                type="date"
                required={wantsReminder}
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ccmsa-email" className="mb-2 block text-sm font-bold text-gray-900">
                Email for one reminder <span className="font-normal text-gray-600">(optional)</span>
              </label>
              <Input
                id="ccmsa-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600">
            With an email and exam date, we send one message after Step 3 scores are usually
            released and ask for your real three-digit score. Already have your result? Enter your
            past exam date and the reminder arrives within a few days. Without an email, we keep the
            CCMSA score on its own.
          </p>

          <label className="mt-4 flex items-start gap-3 text-sm text-gray-800">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-mint-700"
            />
            <span>
              I agree that NBMEcalc may store these scores, and my email if I add one, for research
              on CCMSA and Step 3 results as described in the{" "}
              <a href="/privacy#research-data" className="underline underline-offset-2">
                Privacy Policy
              </a>
              . Results are used only in aggregate.
            </span>
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : "Submit my CCMSA score"}
            </Button>
            <p className="text-xs text-gray-600">
              No marketing emails. Ask privacy@nbmecalc.com to delete it anytime.
            </p>
          </div>
          {message && status === "error" && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
