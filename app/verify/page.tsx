/**
 * /verify — Magic Link landing page.
 *
 * The actual verification happens at GET /api/auth/verify which sets the
 * session cookie and redirects to /dashboard. This page exists primarily
 * as a graceful no-token fallback (someone navigates here directly) and to
 * give the email client a stable URL to anchor to.
 *
 * Users with a valid `?token=` should never actually see this page rendered —
 * they get redirected by the API. But if for some reason they land here
 * (e.g. JS-disabled email client preview), we render a manual continue link.
 */
"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const next = params.get("next") ?? "/dashboard";

  useEffect(() => {
    // Auto-redirect to the API endpoint which does the real work.
    if (token) {
      const url = new URL("/api/auth/verify", window.location.origin);
      url.searchParams.set("token", token);
      if (next) url.searchParams.set("next", next);
      window.location.replace(url.toString());
    }
  }, [token, next]);

  if (!token) {
    return (
      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 lg:p-10 text-center">
        <Sparkles className="h-10 w-10 text-mint-600 mx-auto mb-4" />
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-3">
          No sign-in token found
        </h1>
        <p className="text-gray-600 mb-8">
          This page is only reached by clicking a sign-in link from your
          email. Request a new one below.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Request sign-in link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 lg:p-10 text-center">
      <Sparkles className="h-10 w-10 text-mint-600 mx-auto mb-4 animate-pulse" />
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-3">
        Signing you in…
      </h1>
      <p className="text-gray-600 mb-6">
        Just a moment. If nothing happens in 5 seconds, click below.
      </p>
      <Button size="lg" asChild>
        <Link href={`/api/auth/verify?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`}>
          Continue
        </Link>
      </Button>
    </div>
  );
}

export default function VerifyPage() {
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
            <VerifyInner />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
