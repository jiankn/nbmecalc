"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PredictionRow {
  id: string;
  step: "step1" | "step2" | "step3";
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  passProbability: number;
  createdAt: number;
}

const STEP_LABEL: Record<PredictionRow["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

const PAGE_SIZE = 20;

export default function PredictionsHistoryPage() {
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  async function load(nextOffset: number, replace: boolean) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user/predictions?limit=${PAGE_SIZE}&offset=${nextOffset}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = (await res.json()) as { predictions: PredictionRow[] };
      const next = json.predictions ?? [];
      setRows((cur) => (replace ? next : [...cur, ...next]));
      setHasMore(next.length === PAGE_SIZE);
      setOffset(nextOffset + next.length);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Predictions</h1>
          <p className="text-gray-600 mt-1">Your full prediction history.</p>
        </div>
        <Button size="md" asChild>
          <Link href="/#calculator">New prediction</Link>
        </Button>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 overflow-hidden">
        {rows.length === 0 && !loading ? (
          <div className="p-10 text-center text-gray-600">
            No predictions yet.{" "}
            <Link href="/#calculator" className="text-mint-700 font-semibold underline">
              Run your first
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Date</th>
                  <th className="text-left px-5 py-3 font-bold text-gray-900">Step</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">Predicted</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">95% CI</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-900">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-mint-50/30 transition cursor-pointer"
                    onClick={() => (window.location.href = `/dashboard/predictions/${r.id}`)}
                  >
                    <td className="px-5 py-3 text-gray-700">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-semibold">{STEP_LABEL[r.step]}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-mint-700">
                      {r.pointEstimate}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700 font-mono">
                      {r.ciLower}–{r.ciUpper}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {(r.passProbability * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => load(offset, false)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
