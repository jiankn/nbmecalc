"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResendReportEmailProps {
  sessionId: string;
  /** Variant for different contexts */
  variant?: "success-page" | "dashboard";
}

export function ResendReportEmail({
  sessionId,
  variant = "success-page",
}: ResendReportEmailProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "sent" | "error" | "rate_limited"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleResend() {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/report/${encodeURIComponent(sessionId)}/email`,
        { method: "POST" }
      );
      if (res.ok) {
        setStatus("sent");
      } else if (res.status === 429) {
        setStatus("rate_limited");
        setErrorMsg("Email was sent recently. Please wait a few minutes.");
      } else {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setErrorMsg(data?.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-2 text-sm text-mint-700 font-semibold">
        <CheckCircle2 className="h-4 w-4" />
        Email sent! Check your inbox.
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="inline-flex flex-col items-start gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={status === "loading"}
          className="gap-1.5"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          Resend report email
        </Button>
        {errorMsg && (
          <p className="text-xs text-red-600">{errorMsg}</p>
        )}
      </div>
    );
  }

  // success-page variant
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5 text-left">
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-gray-700 shrink-0 mt-1" />
        <div>
          <h2 className="font-bold text-gray-950 mb-1">
            Didn&apos;t receive it?
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Click below to resend the report email. Check your spam folder too.
          </p>
          <Button
            variant="outline"
            size="md"
            onClick={handleResend}
            disabled={status === "loading"}
            className="gap-1.5"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Resend email
          </Button>
          {errorMsg && (
            <p className="text-xs text-red-600 mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
