"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackProductEvent } from "@/lib/product-events";

export function FunnelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    const key = `nbmecalc:landing:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Continue without deduplication when sessionStorage is unavailable.
    }
    trackProductEvent("landing_view", { path: pathname });
  }, [pathname]);

  return null;
}
