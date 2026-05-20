"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Sparkles, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "The link is incomplete. Request a new one below.",
  not_found: "This link wasn't recognized. Request a new one below.",
  expired: "This link expired. Request a new one below.",
  already_used: "This link was already used. Request a new one below.",
  service_unavailable: "Auth service is briefly unavailable — try again.",
};

function LoginFormInner() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const errorCode = params.get("error");
  const initialError = errorCode ? ERROR_MESSAGES[errorCode] ?? null : null;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), next }),
      });
      const json = (await res.json()) as { sent?: boolean; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 lg:p-10">
      <div className="text-center mb-6">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-mint-100 flex items-center justify-center mb-4">
          <Sparkles className="h-7 w-7 text-mint-700" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">
          Sign in to NBMEcalc
        </h1>
        <p className="text-gray-600">
          Enter your email — we&apos;ll send you a one-click sign-in link. No
          password required.
        </p>
      </div>

      {sent ? (
        <div className="rounded-2xl bg-mint-50 border border-mint-200 p-6 text-center">
          <Mail className="h-8 w-8 text-mint-700 mx-auto mb-3" />
          <h2 className="font-bold text-gray-950 mb-2">Check your email</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We sent a sign-in link to <strong>{email}</strong>. It expires in
            1 hour. If you don&apos;t see it, check your spam folder.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="mt-4 text-sm text-mint-700 underline font-semibold"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-900">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              disabled={submitting}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!email.trim() || submitting}
          >
            {submitting ? "Sending…" : "Send sign-in link"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By signing in you agree to our{" "}
            <Link href="/terms" className="text-mint-700 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-mint-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-gray-50 min-h-[60vh]">
        <div className="container max-w-md">
          <Suspense
            fallback={
              <div className="rounded-3xl bg-white border border-gray-200 p-10 text-center text-gray-500">
                Loading…
              </div>
            }
          >
            <LoginFormInner />
          </Suspense>

          <p className="text-center text-sm text-gray-600 mt-6">
            New here?{" "}
            <Link href="/" className="text-mint-700 font-semibold underline">
              Try the free predictor first
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
