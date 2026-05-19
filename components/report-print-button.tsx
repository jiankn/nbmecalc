"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Two client-island buttons rendered above the report:
 *
 *   1. "Download PDF" hits `/api/report/[id]/pdf`, which renders a real,
 *      paginated PDF via @react-pdf/renderer on the edge. This is what the
 *      user actually wants for sharing / archiving.
 *   2. "Print" still triggers `window.print()` as a no-network fallback —
 *      useful if our PDF route is temporarily down or the user just wants
 *      a quick paper copy.
 *
 * Both are hidden in print output (`print:hidden`) so the rendered page
 * doesn't include phantom buttons.
 */
export function ReportPrintButton({ sessionId }: { sessionId: string }) {
  const pdfHref = `/api/report/${encodeURIComponent(sessionId)}/pdf`;
  return (
    <div className="flex gap-2 print:hidden">
      <Button asChild variant="primary" size="md" className="shrink-0">
        <a href={pdfHref} download>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </a>
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={() => window.print()}
        className="shrink-0"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
    </div>
  );
}
