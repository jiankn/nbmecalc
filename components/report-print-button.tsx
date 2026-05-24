"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Two client-island buttons rendered above the report:
 *
 *   1. "Download PDF" triggers the browser print dialog so users can choose
 *      "Save as PDF" and preserve the fully styled, chart-rich web report.
 *   2. "Print" uses the same browser-native path for paper output.
 *
 * Both are hidden in print output (`print:hidden`) so the rendered page
 * doesn't include phantom buttons.
 */
export function ReportPrintButton({ sessionId }: { sessionId: string }) {
  void sessionId;

  function printReport() {
    window.print();
  }

  return (
    <div className="flex gap-2 print:hidden">
      <Button
        type="button"
        variant="primary"
        size="md"
        className="shrink-0"
        onClick={printReport}
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
