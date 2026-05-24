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
  const pdfHref = `/api/report/${encodeURIComponent(sessionId)}/pdf`;

  function printReport() {
    window.print();
  }

  return (
    <div className="flex gap-2 print:hidden">
      <Button asChild variant="primary" size="md" className="shrink-0">
        <a href={pdfHref} download>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </a>
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
