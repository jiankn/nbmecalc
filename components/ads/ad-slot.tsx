"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim();

const SLOT_IDS = {
  "calculator-result":
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_CALCULATOR_RESULT?.trim(),
  "home-content":
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HOME_CONTENT?.trim(),
  "blog-inline":
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_BLOG_INLINE?.trim(),
} as const;

export type AdPlacement = keyof typeof SLOT_IDS;

declare global {
  interface Window {
    adsbygoogle?: Record<string, never>[];
  }
}

function isConfigured(client: string | undefined, slot: string | undefined) {
  return Boolean(client && /^ca-pub-\d+$/.test(client) && slot && /^\d+$/.test(slot));
}

export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const pushed = useRef(false);
  const slot = SLOT_IDS[placement];
  const configured = isConfigured(ADSENSE_CLIENT, slot);

  useEffect(() => {
    if (!configured || pushed.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch (error) {
      // Ad blockers and privacy tools can interrupt the third-party script.
      // The free product must continue working when that happens.
      if (process.env.NODE_ENV === "development") {
        console.warn(`[adsense] Could not fill ${placement}.`, error);
      }
    }
  }, [configured, placement]);

  // No publisher or slot configuration means no script request, ad markup,
  // or empty whitespace in local development and preview environments.
  if (!configured) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "min-h-[280px] w-full overflow-hidden bg-gray-50 px-2 py-3 text-center",
        className
      )}
      data-ad-placement={placement}
    >
      <div className="mb-2 text-[10px] font-medium tracking-wide text-gray-500">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block min-h-[250px] w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
