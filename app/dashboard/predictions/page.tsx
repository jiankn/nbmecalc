"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PredictionRow {
  id: string;
  step: "step1" | "step2" | "step3";
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  passProbability: number;
  createdAt: number;
  archivedAt: number | null;
}

const STEP_LABEL: Record<PredictionRow["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

const PAGE_SIZE = 20;

export default function PredictionsHistoryPage() {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [archiving, setArchiving] = useState<string | null>(null);

  const load = useCallback(
    async (nextOffset: number, replace: boolean, currentTab: "active" | "archived") => {
      setLoading(true);
      try {
        const archived = currentTab === "archived" ? "true" : "false";
        const res = await fetch(
          `/api/user/predictions?limit=${PAGE_SIZE}&offset=${nextOffset}&archived=${archived}`
        );
        if (!res.ok) return;
        const json = (await res.json()) as { predictions: PredictionRow[] };
        const next = json.predictions ?? [];
        setRows((cur) => (replace ? next : [...cur, ...next]));
        setHasMore(next.length === PAGE_SIZE);
        setOffset(nextOffset + next.length);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setRows([]);
    setOffset(0);
    void load(0, true, tab);
  }, [tab, load]);

  async function toggleArchive(row: PredictionRow) {
    if (archiving) return;
    setArchiving(row.id);
    const isArchived = row.archivedAt !== null;
    try {
      const res = await fetch(
        `/api/user/predictions/${row.id}/archive`,
        { method: isArchived ? "DELETE" : "POST" }
      );
      if (res.ok) {
        // Remove from current list (it moved to the other tab).
        setRows((cur) => cur.filter((r) => r.id !== row.id));
      }
    } finally {
      setArchiving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Predictions
          </h1>
          <p className="text-gray-600 mt-1">Your full prediction history.</p>
        </div>
        <Button size="md" asChild>
          <Link href="/#calculator">New prediction</Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {(["active", "archived"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "active" ? "Active" : "Archived"}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden">
        {rows.length === 0 && !loading ? (
          <div className="p-10 text-center text-gray-600">
            {tab === "active" ? (
              <>
                No predictions yet.{" "}
                <Link
                  href="/#calculator"
                  className="text-mint-700 font-semibold underline"
                >
                  Run your first
                </Link>
                .
              </>
            ) : (
              "No archived predictions."
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">
                    Step
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    Predicted
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    95% CI
                  </th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">
                    Pass
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-mint-50/30 transition group"
                  >
                    <td
                      className="px-5 py-3 text-gray-700 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/predictions/${r.id}`)
                      }
                    >
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className="px-5 py-3 font-semibold cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/predictions/${r.id}`)
                      }
                    >
                      {STEP_LABEL[r.step]}
                    </td>
                    <td
                      className="px-5 py-3 text-right font-mono font-bold text-mint-700 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/predictions/${r.id}`)
                      }
                    >
                      {r.pointEstimate}
                    </td>
                    <td
                      className="px-5 py-3 text-right text-gray-700 font-mono cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/predictions/${r.id}`)
                      }
                    >
                      {r.ciLower}–{r.ciUpper}
                    </td>
                    <td
                      className="px-5 py-3 text-right tabular-nums cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/predictions/${r.id}`)
                      }
                    >
                      {(r.passProbability * 100).toFixed(0)}%
                    </td>
                    {/* Archive / Unarchive button */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleArchive(r)}
                        disabled={archiving === r.id}
                        title={
                          r.archivedAt !== null
                            ? "Restore prediction"
                            : "Archive prediction"
                        }
                        className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
                      >
                        {archiving === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : r.archivedAt !== null ? (
                          <ArchiveRestore className="h-4 w-4" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                        {r.archivedAt !== null ? "Restore" : "Archive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => load(offset, false, tab)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
