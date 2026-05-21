"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invalidateSession, useSession } from "@/lib/auth/use-session";

export default function SettingsPage() {
  const session = useSession();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const userEmail = session.status === "authed" ? session.user.email : "";
  const isPro =
    session.status === "authed" && Boolean(session.user.proTier);

  // Force the user to type "DELETE" to confirm — protects against rage-
  // clicks and shoulder-surfing during a "let me show you my dashboard".
  const canConfirm = confirmText.trim().toUpperCase() === "DELETE";

  async function deleteAccount() {
    if (!canConfirm || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteError(json.error ?? "Failed to delete account.");
        setDeleting(false);
        return;
      }
      invalidateSession();
      // Hard navigate to home so all client state is cleared.
      window.location.href = "/?deleted=1";
    } catch {
      setDeleteError("Network error. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account info */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Email</div>
            <div className="text-gray-600">
              {userEmail || (
                <span className="text-gray-400">Loading…</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-1">Display name</div>
            <p className="text-sm text-gray-500">
              Coming soon — display names will be editable when we ship the
              full account profile UI.
            </p>
          </div>
        </div>
      </section>

      {/* Email preferences */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Email preferences</h2>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled
              className="mt-1 h-4 w-4 rounded border-gray-300 text-mint-600 focus:ring-mint-500"
            />
            <div>
              <div className="font-semibold text-gray-900">
                Transactional emails (required)
              </div>
              <div className="text-sm text-gray-600">
                Sign-in links, report delivery, billing receipts. Cannot opt
                out without deleting the account.
              </div>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-mint-600 focus:ring-mint-500"
            />
            <div>
              <div className="font-semibold text-gray-900">
                Product updates (optional)
              </div>
              <div className="text-sm text-gray-600">
                Occasional emails when we ship major features. Never more
                than once a month.
              </div>
            </div>
          </label>
        </div>
        <Button variant="outline" size="md" className="mt-5" disabled>
          Save (coming soon)
        </Button>
      </section>

      {/* Danger zone */}
      <section className="rounded-3xl border-2 border-rose-200 bg-rose-50/40 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-rose-700" />
          <h2 className="text-xl font-bold text-rose-900">Danger zone</h2>
        </div>
        <p className="text-sm text-rose-900 mb-2">
          Deleting your account permanently removes all your predictions and
          personal data. This cannot be undone.
        </p>
        {isPro && (
          <p className="text-sm text-rose-900 font-semibold mb-2">
            Your active Pro subscription will be canceled automatically as
            part of the deletion process.
          </p>
        )}
        <p className="text-xs text-rose-800/80 mb-5">
          Note: payment records are retained for tax compliance but are
          de-identified (your account link is removed).
        </p>

        {confirmDelete ? (
          <div className="rounded-2xl bg-white border border-rose-300 p-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Type <strong className="text-rose-700">DELETE</strong> to confirm.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={deleting}
                className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                autoFocus
              />
            </div>

            {deleteError && (
              <div className="rounded-xl bg-rose-100 border border-rose-200 p-3 text-sm text-rose-900">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="primary"
                size="md"
                className="!bg-rose-600 hover:!bg-rose-700 inline-flex items-center gap-2"
                onClick={deleteAccount}
                disabled={!canConfirm || deleting}
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setConfirmDelete(false);
                  setConfirmText("");
                  setDeleteError(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="md"
            onClick={() => setConfirmDelete(true)}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Delete my account
          </Button>
        )}
      </section>
    </div>
  );
}
