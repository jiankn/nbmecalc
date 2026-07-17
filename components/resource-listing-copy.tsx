"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ResourceListingCopy({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  function copyWithSelectionFallback() {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);

    try {
      textArea.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textArea.remove();
    }
  }

  function showCopiedStatus() {
    setStatus("copied");
    window.setTimeout(() => setStatus("idle"), 4000);
  }

  async function copyListing() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyWithSelectionFallback()) {
        throw new Error("Clipboard access is unavailable.");
      }
      showCopiedStatus();
    } catch {
      if (copyWithSelectionFallback()) {
        showCopiedStatus();
      } else {
        setStatus("error");
      }
    }
  }

  return (
    <div className="border border-gray-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-gray-950">Directory-ready listing</h3>
          <p className="mt-1 text-sm text-gray-600">
            Edit to match your institution&apos;s style guide.
          </p>
        </div>
        <button
          type="button"
          onClick={copyListing}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 focus-visible:ring-offset-2"
        >
          {status === "copied" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "copied" ? "Copied" : "Copy listing"}
        </button>
      </div>

      <pre className="whitespace-pre-wrap break-words px-5 py-5 font-sans text-sm leading-relaxed text-gray-700">
        {text}
      </pre>

      <p className="sr-only" aria-live="polite">
        {status === "copied"
          ? "Resource listing copied to clipboard."
          : status === "error"
            ? "Copy failed. Select the listing text manually."
            : ""}
      </p>
      {status === "error" && (
        <p className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800">
          Copy was unavailable in this browser. Select the text above manually.
        </p>
      )}
    </div>
  );
}
