"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/report/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <PageShell>
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
          {status === "sent" ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-mint-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-950 mb-2">
                Check your inbox
              </h1>
              <p className="text-gray-600 leading-relaxed">
                If we have reports on file for{" "}
                <strong>{email}</strong>, you&apos;ll receive an email
                with links to access them.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Don&apos;t see it? Check your spam folder.
              </p>
            </>
          ) : (
            <>
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-950 mb-2">
                Recover your reports
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                Enter the email you used during checkout. We&apos;ll send you
                links to all your purchased reports.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-mint-400"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading" || !email.includes("@")}
                  className="w-full gap-2"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Send report links
                </Button>
              </form>
              {status === "error" && (
                <p className="text-sm text-red-600 mt-3">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
