"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Sparkles, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ERROR_MESSAGES: Record<string, string> = {
  // Magic-link errors
  missing_token: "The link is incomplete. Request a new one below.",
  not_found: "This link wasn't recognized. Request a new one below.",
  expired: "This link expired. Request a new one below.",
  already_used: "This link was already used. Request a new one below.",
  service_unavailable: "Auth service is briefly unavailable — try again.",
  internal: "We hit an unexpected error signing you in. Please try again.",
  // Google OAuth errors
  google_unavailable: "Google sign-in is temporarily unavailable. Try email instead.",
  google_denied: "Google sign-in was cancelled. Try again or use email.",
  google_missing_code: "Google didn't return a sign-in code. Please retry.",
  google_state_missing: "Your sign-in session expired. Please retry.",
  google_state_mismatch: "Sign-in could not be verified. Please retry.",
  google_exchange_failed: "Couldn't verify your Google account. Please retry.",
};

function GoogleIcon({ className }: { className?: string }) {
  // Brand-accurate Google "G" — required by Google's branding guidelines.
  // Source: https://developers.google.com/identity/branding-guidelines
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

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

  // Build the Google start URL with `next` preserved so a deep-linked user
  // (e.g. visiting /login?next=/dashboard/billing) lands where they expected.
  const googleHref = `/api/auth/google/start?next=${encodeURIComponent(next)}`;

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
          New here? Same form — we&apos;ll create your account automatically.
          No password needed.
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
        <div className="space-y-4">
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-900">{error}</p>
            </div>
          )}

          {/* Primary: Google one-click. Anchor (not button) so middle-click
              opens in new tab and the browser shows the destination on hover. */}
          <a
            href={googleHref}
            className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-base font-semibold text-gray-900"
          >
            <GoogleIcon className="shrink-0" />
            <span>Continue with Google</span>
          </a>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-3 text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
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
              {submitting ? "Sending…" : "Email me a sign-in link"}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-mint-700 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-mint-700 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
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
