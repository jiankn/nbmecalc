export type ProductEventType =
  | "landing_view"
  | "calculator_started"
  | "result_viewed"
  | "paywall_opened"
  | "report_viewed";

export function trackProductEvent(
  type: ProductEventType,
  payload: Record<string, string | number | boolean | null> = {}
): void {
  if (typeof window === "undefined") return;

  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the product flow.
  });
}
