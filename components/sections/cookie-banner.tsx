"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Stethoscope } from "lucide-react";

const STORAGE_KEY = "nbmecalc_disclaimer_ack";
const EXPIRY_DAYS = 30;

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const ackTime = localStorage.getItem(STORAGE_KEY);
      if (!ackTime) {
        // Delay 1.2s to avoid layout shift on initial paint
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
      }
      // Check expiry
      const ts = Number(ackTime);
      const now = Date.now();
      const expired =
        !Number.isFinite(ts) ||
        now - ts > EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (expired) {
        const t = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable — default to showing
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-[90] max-w-[400px] ml-auto animate-slide-up"
    >
      <div className="rounded-2xl bg-white border border-gray-200 shadow-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-mint-100 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-mint-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm">Quick heads-up</h4>
          </div>
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-700 transition shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          NBMEcalc is built by med students. We&apos;re{" "}
          <strong className="text-gray-900">not affiliated</strong> with NBME,
          USMLE, or any official testing body. Predictions are statistical
          estimates based on historical data.
          <br />
          <span className="text-xs text-gray-500 mt-1 block">
            We use minimal cookies for analytics.
          </span>
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={dismiss}
            className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition"
          >
            Got it
          </button>
          <Link
            href="/privacy"
            className="text-sm font-medium text-mint-700 underline underline-offset-4 hover:text-mint-800"
          >
            Privacy →
          </Link>
        </div>
      </div>
    </div>
  );
}
