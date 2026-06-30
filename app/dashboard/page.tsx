"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";

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

function planLabel(tier: string | null): string {
  if (!tier) return "Free";
  if (tier === "pro_monthly") return "Pro (Monthly)";
  if (tier === "pro_annual") return "Pro (Annual)";
  // Anything Stripe sends that we haven't mapped — still treat as Pro.
  return "Pro";
}

export default function DashboardOverview() {
  const session = useSession();
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session.status === "authed" ? session.user : null;
  const isPro = Boolean(user?.proTier);

  useEffect(() => {
    fetch("/api/user/predictions?limit=5")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json as { predictions?: PredictionRow[] } | null;
        if (data?.predictions) setPredictions(data.predictions);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
          Welcome back
        </h1>
        <p className="text-gray-600 mt-1">
          Your USMLE prediction history and account at a glance.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total predictions"
          value={loading ? "…" : String(predictions.length)}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Last prediction"
          value={
            loading
              ? "…"
              : predictions[0]
                ? new Date(predictions[0].createdAt).toLocaleDateString()
                : "None yet"
          }
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Plan"
          value={
            session.status === "loading" ? "…" : planLabel(user?.proTier ?? null)
          }
          icon={
            <Image
              src="/images/login-score-access.webp"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="h-5 w-5 rounded-md"
            />
          }
          cta={isPro ? undefined : { label: "Upgrade", href: "/pricing" }}
        />
      </div>

      {/* Recent predictions */}
      <section className="rounded-3xl bg-white border border-gray-200 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-950">Recent predictions</h2>
          <Link
            href="/dashboard/predictions"
            className="text-sm font-semibold text-mint-700 hover:text-mint-800 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : predictions.length === 0 ? (
          <div className="rounded-2xl bg-mint-50 border border-mint-200 p-6 text-center">
            <p className="text-gray-700 mb-4">
              You haven&apos;t saved any predictions yet.
            </p>
            <Button size="md" asChild>
              <Link href="/#calculator">Run your first prediction</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {predictions.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/dashboard/predictions/${p.id}`}
                  className="py-4 flex items-center justify-between gap-3 hover:bg-mint-50/30 -mx-2 px-2 rounded-xl transition"
                >
                  <div>
                    <div className="font-bold text-gray-950">
                      {STEP_LABEL[p.step]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()} ·{" "}
                      {(p.passProbability * 100).toFixed(0)}% pass
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-mint-700 text-lg">
                      {p.pointEstimate}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.ciLower} – {p.ciUpper}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upgrade nudge — hidden for Pro subscribers */}
      {!isPro && session.status !== "loading" && (
        <section className="rounded-3xl bg-gradient-to-br from-mint-500 to-mint-600 text-white p-8 lg:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
              Unlock unlimited tracking with Pro
            </h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              Track all three Steps, view your full timeline, and get unlimited
              predictions. $9.99/mo, cancel anytime.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-mint-800 hover:bg-gray-50" asChild>
              <Link href="/pricing">View Pro plans</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  cta,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-extrabold text-gray-950">{value}</div>
      {cta && (
        <Link
          href={cta.href}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-mint-700"
        >
          {cta.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
