"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Two client-island buttons rendered above the report:
 *
 *   1. "Download PDF" hits `/api/report/[id]/pdf`, which delegates to the
 *      browser-rendering Worker when configured and falls back to the
 *      edge-safe text PDF otherwise.
 *   2. "Print" triggers `window.print()` as a no-network fallback.
 *
 * Both are hidden in print output (`print:hidden`) so the rendered page
 * doesn't include phantom buttons.
 */
export function ReportPrintButton({ sessionId }: { sessionId: string }) {
  function printReport() {
    window.print();
  }

  function downloadPdf() {
    const url = new URL(
      `/api/report/${encodeURIComponent(sessionId)}/pdf`,
      window.location.origin
    );
    url.searchParams.set("t", Date.now().toString());
    window.location.assign(url.toString());
  }

  return (
    <div className="flex gap-2 print:hidden">
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={downloadPdf}
        className="shrink-0"
      >
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={printReport}
        className="shrink-0"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
    </div>
  );
}
