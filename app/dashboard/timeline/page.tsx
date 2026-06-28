"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";

interface PredictionRow {
  id: string;
  step: "step1" | "step2" | "step3";
  pointEstimate: number;
  ciLower: number;
  ciUpper: number;
  createdAt: number;
}

const STEP_COLORS: Record<PredictionRow["step"], string> = {
  step1: "#3B82F6",
  step2: "#34D399",
  step3: "#A855F7",
};

const STEP_LABELS: Record<PredictionRow["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

export default function TimelinePage() {
  const session = useSession();
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isPro = session.status === "authed" && Boolean(session.user.proTier);

  useEffect(() => {
    fetch("/api/user/predictions?limit=100")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json as { predictions?: PredictionRow[] } | null;
        if (data?.predictions) setRows(data.predictions);
      })
      .finally(() => setLoading(false));
  }, []);

  if (session.status === "loading") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Timeline</h1>
          <p className="text-gray-600 mt-1">
            Track all three Steps in one chart over time.
          </p>
        </div>
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Timeline</h1>
          <p className="text-gray-600 mt-1">
            Track all three Steps in one chart over time.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-mint-300 bg-mint-50/40 p-10 text-center">
          <Lock className="h-10 w-10 text-mint-700 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-950 mb-2">
            Timeline is a Pro feature
          </h2>
          <p className="text-gray-700 max-w-md mx-auto mb-6 leading-relaxed">
            Visualize your Step 1, Step 2 CK, and Step 3 predictions on one
            chart with trend lines, confidence bands, and weekly snapshots.
          </p>
          <Button size="lg" asChild>
            <Link href="/pricing">Upgrade to Pro — $9.99/mo</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group by step for chart rendering.
  const sortedRows = [...rows].sort((a, b) => a.createdAt - b.createdAt);
  const minScore = Math.min(...rows.map((r) => r.ciLower), 200);
  const maxScore = Math.max(...rows.map((r) => r.ciUpper), 280);
  const range = maxScore - minScore || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-mint-100 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-mint-700" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Timeline</h1>
          <p className="text-gray-600">{rows.length} prediction(s)</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        {loading ? (
          <p className="text-gray-500">Loading chart…</p>
        ) : sortedRows.length === 0 ? (
          <p className="text-gray-500">Run a few predictions to see your timeline here.</p>
        ) : (
          <div className="space-y-4">
            {sortedRows.map((r) => {
              const left = ((r.ciLower - minScore) / range) * 100;
              const width = ((r.ciUpper - r.ciLower) / range) * 100;
              const point = ((r.pointEstimate - minScore) / range) * 100;
              return (
                <div key={r.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{STEP_LABELS[r.step]} · {new Date(r.createdAt).toLocaleDateString()}</span>
                    <span className="font-mono font-bold">{r.pointEstimate}</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-gray-100">
                    <div
                      className="absolute top-0 h-3 rounded-full opacity-30"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        background: STEP_COLORS[r.step],
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-[3px] border-white shadow"
                      style={{
                        left: `calc(${point}% - 10px)`,
                        background: STEP_COLORS[r.step],
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between text-xs text-gray-400 pt-2">
              <span>{minScore}</span>
              <span>{Math.round((minScore + maxScore) / 2)}</span>
              <span>{maxScore}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
