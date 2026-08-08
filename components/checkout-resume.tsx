"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invalidateSession, useSession } from "@/lib/auth/use-session";
import {
  buildLifetimeResumePath,
  getCheckoutSource,
} from "@/lib/checkout-intent";

export function CheckoutResume() {
  const params = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const startedRef = useRef(false);
  const source = getCheckoutSource(`?${params.toString()}`) ?? "pricing_card";
  const plan = params.get("plan");
  const resumePath = buildLifetimeResumePath(source);
  const [error, setError] = useState<string | null>(
    plan === "lifetime" ? null : "This checkout link is incomplete."
  );

  const startCheckout = useCallback(async () => {
    if (startedRef.current || plan !== "lifetime") return;
    startedRef.current = true;
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "lifetime",
          checkoutSource: source,
        }),
      });
      const json = (await response.json()) as { url?: string; error?: string };

      if (response.status === 401) {
        invalidateSession();
        router.replace(`/login?next=${encodeURIComponent(resumePath)}`);
        return;
      }
      if (response.status === 409) {
        router.replace("/dashboard/billing");
        return;
      }
      if (!response.ok || !json.url) {
        throw new Error(json.error ?? "Could not start secure checkout.");
      }

      window.location.assign(json.url);
    } catch (checkoutError) {
      startedRef.current = false;
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start secure checkout."
      );
    }
  }, [plan, resumePath, router, source]);

  useEffect(() => {
    if (plan !== "lifetime" || session.status === "loading") return;

    if (session.status === "anon") {
      router.replace(`/login?next=${encodeURIComponent(resumePath)}`);
      return;
    }
    if (session.user.lifetimeAccess) {
      router.replace("/dashboard/billing");
      return;
    }

    void startCheckout();
  }, [plan, resumePath, router, session, startCheckout]);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-10">
      {error ? (
        <>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertCircle className="h-7 w-7 text-rose-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
            Checkout needs another try
          </h1>
          <p role="alert" className="mx-auto mt-3 max-w-sm text-sm text-gray-600">
            {error}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {plan === "lifetime" && (
              <Button size="lg" variant="mint" onClick={startCheckout}>
                Try secure checkout again
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Back to pricing</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100">
            {session.status === "authed" ? (
              <Loader2
                className="h-7 w-7 animate-spin text-mint-700"
                aria-hidden="true"
              />
            ) : (
              <ShieldCheck className="h-7 w-7 text-mint-700" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
            Continuing to secure checkout
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
            Your Lifetime purchase is ready. We are connecting you to Stripe.
          </p>
          <p className="mt-5 text-xs text-gray-500">
            You will review the total before paying. No recurring charge.
          </p>
        </>
      )}
    </div>
  );
}
