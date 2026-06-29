"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Copy,
  Loader2,
  Share2,
  ShieldCheck,
  Trash2,
  X as CloseIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPredictionShareText,
  getPredictionShareTitle,
  getRedditShareUrl,
  getStepLabel,
  getXShareUrl,
  type PredictionShareInput,
} from "@/lib/prediction-share";

type ShareAction = "native" | "reddit" | "x" | "copy";
type DialogMode = "consent" | "fallback" | "revoke" | null;

interface ShareRecord {
  token: string;
  manageToken: string;
  publicUrl: string;
}

type SharePredictionProps = PredictionShareInput;

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

function RedditIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.4 12.5c.1-.3.15-.6.15-.92 0-1.66-2.13-3-4.75-3-2.27 0-4.16 1-4.62 2.32-.16.4.04.86.45 1.04.4.16.86-.04 1.04-.45.18-.42 1.36-.91 3.13-.91 1.92 0 3.25.83 3.25 1.5 0 .67-1.33 1.5-3.25 1.5-1.78 0-2.95-.49-3.13-.91-.18-.41-.64-.61-1.04-.45-.41.18-.61.64-.45 1.04.46 1.32 2.35 2.32 4.62 2.32 2.62 0 4.75-1.34 4.75-3 0-.32-.05-.62-.15-.92z" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SharePrediction(props: SharePredictionProps) {
  const [shareRecord, setShareRecord] = useState<ShareRecord | null>(null);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [pendingAction, setPendingAction] =
    useState<ShareAction>("native");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryActionRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const storageKey = useMemo(
    () =>
      `nbmecalc:prediction-share:${props.step}:${props.pointEstimate}:${props.ciLower}:${props.ciUpper}`,
    [props.ciLower, props.ciUpper, props.pointEstimate, props.step]
  );
  const stepLabel = getStepLabel(props.step);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<ShareRecord>;
      if (
        typeof parsed.token === "string" &&
        typeof parsed.manageToken === "string" &&
        typeof parsed.publicUrl === "string"
      ) {
        setShareRecord(parsed as ShareRecord);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => primaryActionRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        setDialog(null);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [busy, dialog]);

  async function createShareLink(): Promise<ShareRecord> {
    const response = await fetch("/api/shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(props),
    });
    const payload = (await response.json().catch(() => null)) as
      | (Partial<ShareRecord> & { error?: string })
      | null;
    if (
      !response.ok ||
      !payload ||
      typeof payload.token !== "string" ||
      typeof payload.manageToken !== "string" ||
      typeof payload.publicUrl !== "string"
    ) {
      throw new Error(payload?.error ?? "Unable to create the share link.");
    }

    const record: ShareRecord = {
      token: payload.token,
      manageToken: payload.manageToken,
      publicUrl: payload.publicUrl,
    };
    setShareRecord(record);
    window.localStorage.setItem(storageKey, JSON.stringify(record));
    return record;
  }

  async function performShare(
    action: ShareAction,
    record: ShareRecord,
    preparedWindow?: Window | null
  ): Promise<void> {
    if (action === "reddit" || action === "x") {
      const destination =
        action === "reddit"
          ? getRedditShareUrl(props, record.publicUrl)
          : getXShareUrl(props, record.publicUrl);
      if (preparedWindow) {
        preparedWindow.location.replace(destination);
      } else {
        window.open(destination, "_blank", "noopener,noreferrer");
      }
      setStatus(
        action === "reddit"
          ? "Reddit composer opened."
          : "X composer opened."
      );
      return;
    }

    if (action === "copy") {
      await copyText(record.publicUrl);
      setStatus("Share link copied.");
      return;
    }

    if (typeof navigator.share !== "function") {
      setDialog("fallback");
      return;
    }

    try {
      await navigator.share({
        title: getPredictionShareTitle(props),
        text: getPredictionShareText(props),
        url: record.publicUrl,
      });
      setStatus("Prediction shared.");
    } catch (shareError) {
      if (
        shareError instanceof DOMException &&
        shareError.name === "AbortError"
      ) {
        return;
      }
      setDialog("fallback");
    }
  }

  function requestShare(
    action: ShareAction,
    trigger: HTMLElement
  ): void {
    returnFocusRef.current = trigger;
    setError(null);
    setStatus(null);
    setPendingAction(action);

    if (shareRecord) {
      void performShare(action, shareRecord).catch(() => {
        setError("Sharing failed. Copy the link and try again.");
      });
      return;
    }
    setDialog("consent");
  }

  async function confirmCreateAndShare(): Promise<void> {
    setBusy(true);
    setError(null);

    let preparedWindow: Window | null = null;
    if (pendingAction === "reddit" || pendingAction === "x") {
      preparedWindow = window.open("", "_blank");
      if (preparedWindow) preparedWindow.opener = null;
    }

    try {
      const record = await createShareLink();
      setDialog(null);
      setStatus("Public share link created.");
      await performShare(pendingAction, record, preparedWindow);
    } catch (createError) {
      preparedWindow?.close();
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create the share link."
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeShare(): Promise<void> {
    if (!shareRecord) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/shares/${shareRecord.token}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ manageToken: shareRecord.manageToken }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to stop sharing.");
      }

      window.localStorage.removeItem(storageKey);
      setShareRecord(null);
      setDialog(null);
      setStatus("Public share link disabled.");
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : "Unable to stop sharing."
      );
    } finally {
      setBusy(false);
    }
  }

  const dialogTitle =
    dialog === "consent"
      ? "Create a public share link?"
      : dialog === "fallback"
        ? "Choose where to share"
        : "Stop sharing this prediction?";

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <div className="sm:hidden">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="h-12 w-full"
          onClick={(event) => requestShare("native", event.currentTarget)}
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          Share prediction
        </Button>
        <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">
          Shares only your {stepLabel} estimate and range.
        </p>
      </div>

      <div className="hidden items-center justify-center gap-3 sm:flex">
        <span className="text-sm text-gray-500">Share prediction:</span>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          onClick={(event) => requestShare("reddit", event.currentTarget)}
        >
          <RedditIcon className="h-4 w-4 text-orange-600" />
          Reddit
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition hover:border-gray-500 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          onClick={(event) => requestShare("x", event.currentTarget)}
        >
          <XIcon className="h-3.5 w-3.5" />X
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition hover:border-mint-500 hover:bg-mint-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 focus-visible:ring-offset-2"
          onClick={(event) => requestShare("copy", event.currentTarget)}
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy link
        </button>
      </div>

      {shareRecord && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 text-mint-800">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Public link active
          </span>
          <button
            type="button"
            className="font-semibold text-red-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            onClick={(event) => {
              returnFocusRef.current = event.currentTarget;
              setError(null);
              setDialog("revoke");
            }}
          >
            Stop sharing
          </button>
        </div>
      )}

      <div
        className="mt-2 min-h-5 text-center text-xs"
        aria-live="polite"
        aria-atomic="true"
      >
        {status && <p className="text-mint-800">{status}</p>}
        {error && <p className="text-red-700">{error}</p>}
      </div>

      {dialog &&
        typeof document !== "undefined" &&
        createPortal(
          <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              setDialog(null);
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prediction-share-dialog-title"
            className="max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl animate-slide-up motion-reduce:animate-none sm:max-w-md sm:rounded-3xl sm:p-7 sm:animate-fade-up"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-100 text-mint-800">
                  {dialog === "revoke" ? (
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <h2
                  id="prediction-share-dialog-title"
                  className="text-xl font-bold text-gray-950"
                >
                  {dialogTitle}
                </h2>
              </div>
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
                aria-label="Close share dialog"
                onClick={() => setDialog(null)}
                disabled={busy}
              >
                <CloseIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {dialog === "consent" && (
              <>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  This creates an unlisted public page showing only your{" "}
                  {stepLabel} range ({props.ciLower}–{props.ciUpper}) and most
                  likely score ({props.pointEstimate}).
                </p>
                <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                  Practice-exam scores, weak subjects, account details, pass
                  probability, and your private report stay hidden.
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setDialog(null)}
                    disabled={busy}
                  >
                    Cancel
                  </Button>
                  <Button
                    ref={primaryActionRef}
                    type="button"
                    variant="mint"
                    size="md"
                    onClick={confirmCreateAndShare}
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Creating link…
                      </>
                    ) : (
                      "Create link and share"
                    )}
                  </Button>
                </div>
              </>
            )}

            {dialog === "fallback" && shareRecord && (
              <div className="mt-5 grid gap-3">
                <Button
                  ref={primaryActionRef}
                  type="button"
                  variant="outline"
                  size="md"
                  className="h-12 justify-start border-orange-200 hover:bg-orange-50"
                  onClick={() => {
                    setDialog(null);
                    void performShare("reddit", shareRecord);
                  }}
                >
                  <RedditIcon className="h-5 w-5 text-orange-600" />
                  Share to Reddit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="h-12 justify-start"
                  onClick={() => {
                    setDialog(null);
                    void performShare("x", shareRecord);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                  Share to X
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="h-12 justify-start border-mint-200 hover:bg-mint-50"
                  onClick={() => {
                    setDialog(null);
                    void performShare("copy", shareRecord);
                  }}
                >
                  <Copy className="h-5 w-5" aria-hidden="true" />
                  Copy share link
                </Button>
              </div>
            )}

            {dialog === "revoke" && (
              <>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  The public page will immediately stop working. Your
                  prediction and private report will not be deleted.
                </p>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setDialog(null)}
                    disabled={busy}
                  >
                    Keep sharing
                  </Button>
                  <Button
                    ref={primaryActionRef}
                    type="button"
                    size="md"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={revokeShare}
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                        Stopping…
                      </>
                    ) : (
                      "Stop sharing"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
          </div>,
          document.body
        )}
    </div>
  );
}
