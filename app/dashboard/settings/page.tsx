"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Account info */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Email</div>
            <div className="text-gray-600">
              You signed in via Magic Link. Your email is private and only used
              for sign-in + report delivery.
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
                Occasional emails when we ship major features. Never more than
                once a month.
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
        <p className="text-sm text-rose-900 mb-5">
          Deleting your account removes all your predictions and personal data
          after a 30-day grace period. Pro subscriptions must be canceled
          separately in Billing first.
        </p>
        {confirmDelete ? (
          <div className="rounded-2xl bg-white border border-rose-300 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              Are you absolutely sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="md"
                className="!bg-rose-600 hover:!bg-rose-700"
                disabled
              >
                Yes, delete my account (coming soon)
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setConfirmDelete(false)}
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
