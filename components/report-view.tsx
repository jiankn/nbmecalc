import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Compass,
  HelpCircle,
  Info,
  LineChart,
  ListChecks,
  Printer as _Printer,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReportPrintButton } from "@/components/report-print-button";
import type {
  AntiPatterns,
  CohortMirror,
  HighLeverageMoves,
  HonestUncertainty,
  OneDecision,
  PersonalizedWeakSubjects,
  PracticeExam,
  PredictionResult,
  RiskProfile,
  ScoreTrajectory,
  SourceInsight,
  TargetGap,
  TestDayProtocol,
} from "@/lib/data";

void _Printer; // keep lucide tree-shake happy if we relocate later

const PASS_THRESHOLD: Record<PredictionResult["step"], number> = {
  step1: 196,
  step2: 214,
  step3: 198,
};

const STEP_LABEL: Record<PredictionResult["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

/**
 * Pass-probability narrative bands.
 *
 * We deliberately avoid superlatives like "guaranteed" or "100%". The model
 * itself caps probability at 0.99 (see passProbabilityLogistic) and our
 * copy here matches that: even the top band says "Very Strong", not "Sure".
 */
function passBand(p: number): {
  label: string;
  tone: "green" | "mint" | "amber" | "orange" | "red";
  explainer: string;
} {
  if (p >= 0.95)
    return {
      label: "Very Strong",
      tone: "green",
      explainer:
        "Your inputs point to a high pass probability. Maintain pace; don't over-study. Take 1 rest day in the final week.",
    };
  if (p >= 0.85)
    return {
      label: "Solid",
      tone: "mint",
      explainer:
        "Strong margin above threshold. Focus on shoring up subject-area gaps highlighted below — small lifts there compound.",
    };
  if (p >= 0.7)
    return {
      label: "Adequate",
      tone: "amber",
      explainer:
        "Pass is likely, but the margin is thinner than it looks. Targeted prep on your weakest subjects (below) will lift you the most per hour.",
    };
  if (p >= 0.5)
    return {
      label: "Borderline",
      tone: "orange",
      explainer:
        "Coin-flip territory. Re-test on a fresh NBME within 7 days to recalibrate. Rest, then attack your weak areas systematically.",
    };
  return {
    label: "At Risk",
    tone: "red",
    explainer:
      "Significant fail risk. Strongly consider postponing — 4 weeks of focused, weak-subject prep can shift this prediction by 8-15 points.",
  };
}

const TONE_BG: Record<string, string> = {
  green: "bg-green-50 text-green-700 border-green-200",
  mint: "bg-mint-50 text-mint-700 border-mint-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function ReportView({
  result,
  exams,
  sessionId,
  purchasedAt,
}: {
  result: PredictionResult;
  exams: PracticeExam[];
  sessionId: string;
  purchasedAt: Date;
}) {
  const stepLabel = STEP_LABEL[result.step];
  const threshold = PASS_THRESHOLD[result.step];
  const margin = result.pointEstimate - threshold;
  const band = passBand(result.passProbability);

  // Subjects: ascending (cohort-weakest first) so the eye lands on the
  // action items. These are COHORT averages, never personalized to the user.
  const sortedSubjects = [...result.cohortSubjectAverages].sort(
    (a, b) => a.cohortAverage - b.cohortAverage
  );

  return (
    <article className="container max-w-5xl py-12 print:py-4 print:max-w-none">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 mb-8 print:mb-4 print:items-center">
        <div>
          <Badge variant="mint" className="mb-2">
            Premium Report
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Your USMLE {stepLabel} Prediction Report
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Generated{" "}
            {purchasedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · Session{" "}
            <code className="font-mono text-xs">
              {sessionId.slice(0, 14)}…
            </code>
          </p>
        </div>
        <ReportPrintButton sessionId={sessionId} />
      </header>

      {/* Score hero */}
      <section className="rounded-3xl border-2 border-mint-200 bg-mint-50/40 p-8 mb-8 print:border-gray-300 print:bg-white print:p-6 print:break-inside-avoid">
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <div className="text-6xl font-black tabular-nums">
            {result.pointEstimate}
          </div>
          <div className="text-gray-600 text-lg tabular-nums">
            {result.ciLower}–{result.ciUpper}{" "}
            <span className="text-xs">95% CI</span>
          </div>
          {result.freshness === "stale" && (
            <Badge variant="outline" className="text-xs">
              Wide CI: 60+ days until test day
            </Badge>
          )}
        </div>
        <p className="text-gray-700">
          Predicted three-digit {stepLabel} score, based on{" "}
          <strong>{result.inputCount}</strong>{" "}
          {result.inputCount === 1 ? "input" : "inputs"}. Margin to pass
          threshold ({threshold}):{" "}
          <strong className={margin >= 0 ? "text-mint-700" : "text-red-600"}>
            {margin >= 0 ? "+" : ""}
            {margin} pts
          </strong>
          .
        </p>
      </section>

      {/* Pass probability */}
      <section className="grid md:grid-cols-3 gap-6 mb-8 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
        <div
          className={`md:col-span-1 rounded-3xl border-2 p-6 text-center ${TONE_BG[band.tone]} print:p-4`}
        >
          <div className="text-xs uppercase tracking-wider opacity-70 mb-1">
            Pass Probability
          </div>
          <div className="text-5xl font-black tabular-nums">
            {Math.round(result.passProbability * 100)}%
          </div>
          <div className="mt-2 text-sm font-semibold">{band.label}</div>
        </div>
        <div className="md:col-span-2 rounded-3xl border-2 border-gray-200 p-6 print:border-gray-300 print:p-4">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-mint-600" />
            What this means
          </h3>
          <p className="text-gray-700 mb-3">{band.explainer}</p>
          <p className="text-xs text-gray-500">
            We cap pass probability at 99%. A model that claims certainty is
            wrong — even a +30 pt margin can fail on test day from illness,
            anxiety, or an unusual block.
          </p>
        </div>
      </section>

      {/* === PRIMARY DECISION-GRADE MODULES === */}
      {/* Order matters: Risk → Decision → Cohort → Moves → Anti-Patterns → Day Protocol.
          Each module answers one specific question the user has been agonizing over.
          Trajectory / Source / Target Gap are kept below as supporting analytics. */}
      <RiskProfileSection profile={result.riskProfile} />
      <OneDecisionSection decision={result.oneDecision} />
      {result.cohortMirror.buckets.length > 0 && (
        <CohortMirrorSection mirror={result.cohortMirror} />
      )}
      {result.highLeverageMoves.items.length > 0 && (
        <HighLeverageMovesSection moves={result.highLeverageMoves} />
      )}
      {result.antiPatterns.items.length > 0 && (
        <AntiPatternsSection patterns={result.antiPatterns} />
      )}
      {result.testDayProtocol.show && (
        <TestDayProtocolSection protocol={result.testDayProtocol} />
      )}

      {/* === SUPPORTING ANALYTICS === */}
      <SupportingDivider />

      {/* Score trajectory — only useful with ≥2 exams */}
      {result.scoreTrajectory.points.length >= 2 && (
        <TrajectorySection trajectory={result.scoreTrajectory} />
      )}

      {/* Cross-source insight — only useful with ≥2 sources */}
      {result.sourceInsight.rows.length >= 2 && (
        <SourceInsightSection insight={result.sourceInsight} />
      )}

      {/* Target gap — only when user supplied a target score */}
      {result.targetGap && <TargetGapSection gap={result.targetGap} />}

      {/* Postpone-vs-sit decision is now surfaced by OneDecisionSection above
          — we no longer render the standalone postpone card here to avoid
          duplicating the same recommendation in two places. */}

      {/* Personalized priority subjects — only when user self-reported */}
      {result.personalizedWeakSubjects && (
        <PersonalizedWeakSection data={result.personalizedWeakSubjects} />
      )}

      {/* Cohort subject averages — NOT personalized. Header & badges reflect that. */}
      <section className="mb-8 print:break-inside-avoid">
        <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-mint-600" />
          Cohort subject averages (for context)
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          {result.cohortSubjectAveragesNote}
        </p>
        <div className="rounded-3xl border-2 border-gray-200 overflow-hidden print:border-gray-300">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 print:bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Subject</th>
                <th className="text-right px-4 py-3 font-semibold w-32">
                  Cohort Avg
                </th>
                <th className="text-right px-4 py-3 font-semibold w-40">
                  Cohort signal
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSubjects.map((s, i) => {
                const isCohortWeak = s.cohortWeakness;
                const isCohortBottom = i < 2 && !s.cohortWeakness;
                const isStrong = i >= sortedSubjects.length - 2;
                return (
                  <tr
                    key={s.name}
                    className="border-t border-gray-100 print:border-gray-300"
                  >
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="text-right px-4 py-3 tabular-nums font-mono">
                      {Math.round(s.cohortAverage)}%
                    </td>
                    <td className="text-right px-4 py-3 text-xs font-semibold">
                      {isCohortWeak ? (
                        <span className="text-red-600">Cohort weak spot</span>
                      ) : isCohortBottom ? (
                        <span className="text-amber-600">Below cohort mean</span>
                      ) : isStrong ? (
                        <span className="text-green-600">Cohort strong</span>
                      ) : (
                        <span className="text-gray-400">Mid cohort</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          These labels describe the <strong>cohort at your predicted score</strong>,
          not your individual performance. To get a personalized priority list,
          tell us which subjects feel hardest on the homepage calculator.
        </p>
      </section>

      {/* === HONEST UNCERTAINTY === */}
      {/* Final trust anchor: explicitly list what we can't predict + when we'd
          be wrong about this user. Counter-intuitive but the highest-trust
          section — nobody else does this. */}
      <HonestUncertaintySection uncertainty={result.honestUncertainty} />

      {/* Methodology */}
      <section className="rounded-3xl bg-gray-50 p-6 text-sm text-gray-600 print:bg-white print:border print:border-gray-300 print:p-4 print:break-inside-avoid">
        <h3 className="font-bold mb-2 text-gray-900 flex items-center gap-2">
          <Info className="h-4 w-4" />
          About this prediction
        </h3>
        <p className="mb-2">{result.cohortNote}</p>
        <p className="mb-2">
          <strong>Inputs used ({exams.length}):</strong>{" "}
          {exams
            .map(
              (e) =>
                `${e.source}${e.formNumber ? ` Form ${e.formNumber}` : ""} (${e.score})`
            )
            .join(", ")}
        </p>
        <p className="text-xs">
          Freshness: <code className="font-mono">{result.freshness}</code>. We
          re-run the model server-side every time you open this page, so if
          our algorithm improves, your report does too. No client tampering
          possible.
        </p>
      </section>

      <footer className="mt-10 text-center text-xs text-gray-400 print:mt-6">
        <p>
          NBMEcalc Premium Report ·{" "}
          <Link href="/" className="underline">
            nbmecalc.com
          </Link>{" "}
          · Saved for offline use
        </p>
      </footer>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Personalized analytics sections — each one is the user-visible payoff for a
// specific input. They appear only when the underlying data exists, so an
// undated single-exam purchase still gets a clean (if slimmer) report.
// ---------------------------------------------------------------------------

function TrajectorySection({ trajectory }: { trajectory: ScoreTrajectory }) {
  const points = trajectory.points;
  const scores = points.map((p) => p.equated);
  const min = Math.min(...scores) - 4;
  const max = Math.max(...scores) + 4;
  const range = Math.max(1, max - min);
  const w = 560;
  const h = 120;
  const padX = 28;
  const padY = 18;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;

  const x = (i: number) =>
    points.length === 1 ? padX + usableW / 2 : padX + (i / (points.length - 1)) * usableW;
  const y = (score: number) => padY + ((max - score) / range) * usableH;
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.equated).toFixed(1)}`)
    .join(" ");

  const slopeBadge =
    trajectory.trend === "improving"
      ? { label: `+${trajectory.slopePer30Days} pts / mo`, tone: "text-green-700 bg-green-50 border-green-200", Icon: TrendingUp }
      : trajectory.trend === "declining"
      ? { label: `${trajectory.slopePer30Days} pts / mo`, tone: "text-red-700 bg-red-50 border-red-200", Icon: TrendingDown }
      : trajectory.trend === "stable"
      ? { label: `${trajectory.slopePer30Days! >= 0 ? "+" : ""}${trajectory.slopePer30Days} pts / mo`, tone: "text-gray-700 bg-gray-50 border-gray-200", Icon: Activity }
      : { label: "Trend pending", tone: "text-gray-500 bg-gray-50 border-gray-200", Icon: Activity };

  return (
    <section className="mb-8 print:break-inside-avoid">
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <LineChart className="h-6 w-6 text-mint-600" />
          Your score trajectory
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${slopeBadge.tone}`}
        >
          <slopeBadge.Icon className="h-3.5 w-3.5" />
          {slopeBadge.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{trajectory.insight}</p>
      <div className="rounded-3xl border-2 border-gray-200 p-4 sm:p-6 print:border-gray-300">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-auto"
          role="img"
          aria-label="Score trajectory"
        >
          <line
            x1={padX}
            x2={w - padX}
            y1={h - padY}
            y2={h - padY}
            stroke="#e5e7eb"
          />
          {trajectory.slopePer30Days !== null && (
            <path d={linePath} stroke="#34D399" strokeWidth={2.5} fill="none" />
          )}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={x(i)}
                cy={y(p.equated)}
                r={5}
                fill="#34D399"
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={x(i)}
                y={y(p.equated) - 10}
                textAnchor="middle"
                className="text-[10px] fill-gray-700"
                fontFamily="ui-monospace, monospace"
              >
                {p.equated}
              </text>
              <text
                x={x(i)}
                y={h - 4}
                textAnchor="middle"
                className="text-[10px] fill-gray-500"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function SourceInsightSection({ insight }: { insight: SourceInsight }) {
  return (
    <section className="mb-8 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <Info className="h-6 w-6 text-mint-600" />
        How your sources compare
      </h2>
      {insight.insight && (
        <p className="text-sm text-gray-700 mb-4">{insight.insight}</p>
      )}
      <div className="rounded-3xl border-2 border-gray-200 overflow-hidden print:border-gray-300">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 print:bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Source</th>
              <th className="text-right px-4 py-3 font-semibold w-24">
                # Exams
              </th>
              <th className="text-right px-4 py-3 font-semibold w-40">
                Avg equated Step
              </th>
            </tr>
          </thead>
          <tbody>
            {insight.rows.map((r) => (
              <tr
                key={r.source}
                className="border-t border-gray-100 print:border-gray-300"
              >
                <td className="px-4 py-3 font-medium">{r.label}</td>
                <td className="text-right px-4 py-3 tabular-nums">
                  {r.count}
                </td>
                <td className="text-right px-4 py-3 tabular-nums font-mono">
                  {r.averageEquated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TargetGapSection({ gap }: { gap: TargetGap }) {
  const ahead = gap.gap >= 0;
  const tone = ahead
    ? "border-mint-200 bg-mint-50/40"
    : "border-amber-200 bg-amber-50/40";
  return (
    <section className={`mb-8 rounded-3xl border-2 p-6 print:p-4 print:break-inside-avoid ${tone}`}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <Target className="h-6 w-6 text-mint-600" />
          Target gap
        </h2>
        <span className="text-xs uppercase tracking-wider text-gray-500">
          Target {gap.target}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Current
          </div>
          <div className="text-3xl font-black tabular-nums">{gap.current}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Gap
          </div>
          <div
            className={`text-3xl font-black tabular-nums ${ahead ? "text-mint-700" : "text-amber-700"}`}
          >
            {ahead ? "+" : ""}
            {gap.gap}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            At test day
          </div>
          <div className="text-3xl font-black tabular-nums">
            {gap.projectedAtExam ?? "—"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Days to target
          </div>
          <div className="text-3xl font-black tabular-nums">
            {gap.daysToTargetAtPace ?? "—"}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-700">{gap.insight}</p>
    </section>
  );
}

function PersonalizedWeakSection({ data }: { data: PersonalizedWeakSubjects }) {
  return (
    <section className="mb-8 rounded-3xl border-2 border-mint-200 bg-mint-50/30 p-6 print:p-4 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <Activity className="h-6 w-6 text-mint-600" />
        Your priority subjects
      </h2>
      <p className="text-sm text-gray-700 mb-3">{data.insight}</p>
      <div className="flex flex-wrap gap-2">
        {data.selfReported.map((name) => {
          const doubly = data.doublyWeak.includes(name);
          return (
            <span
              key={name}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                doubly
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {name}
              {doubly && <span className="text-[10px] uppercase">priority</span>}
            </span>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Premium-report SECTIONS — the seven decision-grade modules wired to
// `lib/report-modules.ts`. These render unconditionally (with empty-state
// gating in the parent) so the report layout is stable even on degenerate
// inputs. Each section answers one specific user question (PRD product
// strategy review).
// ---------------------------------------------------------------------------

function SupportingDivider() {
  return (
    <div className="my-12 flex items-center gap-4 print:my-6 print:break-after-avoid">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
        Supporting analytics
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

const RISK_TONE: Record<
  RiskProfile["shape"],
  { wrap: string; iconColor: string; badge: string; label: string }
> = {
  asymmetric_downside: {
    wrap: "border-amber-300 bg-amber-50/40",
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-800",
    label: "Asymmetric downside",
  },
  asymmetric_upside: {
    wrap: "border-emerald-300 bg-emerald-50/40",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
    label: "Asymmetric upside",
  },
  tight_balanced: {
    wrap: "border-mint-300 bg-mint-50/40",
    iconColor: "text-mint-700",
    badge: "bg-mint-100 text-mint-800",
    label: "Tight & balanced",
  },
  wide_balanced: {
    wrap: "border-gray-300 bg-gray-50/40",
    iconColor: "text-gray-700",
    badge: "bg-gray-100 text-gray-800",
    label: "Wide & balanced",
  },
};

function RiskProfileSection({ profile }: { profile: RiskProfile }) {
  const tone = RISK_TONE[profile.shape];
  return (
    <section
      className={`mb-8 rounded-3xl border-2 p-6 lg:p-8 print:p-4 print:break-inside-avoid ${tone.wrap}`}
    >
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <Compass className={`h-6 w-6 ${tone.iconColor}`} />
          Your risk profile
        </h2>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tone.badge}`}
        >
          {tone.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 my-6 items-stretch">
        <div className="text-center py-3">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Floor
          </div>
          <div className="text-3xl font-black tabular-nums">{profile.floor}</div>
        </div>
        <div className="text-center px-3 py-3 rounded-2xl bg-white border-2 border-gray-300">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Spread
          </div>
          <div className="text-3xl font-black tabular-nums">{profile.spread} pts</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">
            {profile.spreadVsTypical} than typical
          </div>
        </div>
        <div className="text-center py-3">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Ceiling
          </div>
          <div className="text-3xl font-black tabular-nums">
            {profile.ceiling}
          </div>
        </div>
      </div>

      <p className="text-base font-bold text-gray-900 mb-2 leading-snug">
        {profile.headline}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{profile.rootCause}</p>
    </section>
  );
}

const DECISION_TONE: Record<
  OneDecision["recommendation"],
  {
    wrap: string;
    isLight: boolean;
    iconWrap: string;
    Icon: typeof CheckCircle2;
  }
> = {
  sit_as_scheduled: {
    wrap:
      "bg-gradient-to-br from-mint-500 to-mint-600 text-white border-mint-600 print:bg-mint-50 print:text-gray-900 print:border-mint-300",
    isLight: false,
    iconWrap: "bg-white/20 print:bg-mint-100",
    Icon: CheckCircle2,
  },
  postpone_14d: {
    wrap:
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600 print:bg-amber-50 print:text-gray-900 print:border-amber-300",
    isLight: false,
    iconWrap: "bg-white/20 print:bg-amber-100",
    Icon: CalendarClock,
  },
  postpone_28d: {
    wrap:
      "bg-gradient-to-br from-orange-600 to-red-600 text-white border-red-700 print:bg-red-50 print:text-gray-900 print:border-red-300",
    isLight: false,
    iconWrap: "bg-white/20 print:bg-red-100",
    Icon: ShieldAlert,
  },
  need_more_data: {
    wrap: "bg-gray-100 text-gray-900 border-gray-300",
    isLight: true,
    iconWrap: "bg-white",
    Icon: HelpCircle,
  },
};

function OneDecisionSection({ decision }: { decision: OneDecision }) {
  const tone = DECISION_TONE[decision.recommendation];
  const Icon = tone.Icon;
  const subtle = tone.isLight ? "text-gray-600" : "text-white/85 print:text-gray-600";
  const body = tone.isLight ? "text-gray-800" : "text-white/95 print:text-gray-800";
  const divider = tone.isLight
    ? "border-gray-300"
    : "border-white/30 print:border-gray-300";

  return (
    <section
      className={`mb-8 rounded-3xl border-2 p-6 lg:p-8 print:p-4 print:break-inside-avoid ${tone.wrap}`}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className={`p-2 rounded-xl ${tone.iconWrap}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs uppercase tracking-widest font-bold ${subtle}`}>
          Our recommendation · {decision.confidence} confidence
        </span>
      </div>
      <h2 className="text-2xl lg:text-3xl font-black tracking-tight mt-3 mb-4 leading-tight">
        {decision.headline}
      </h2>

      {decision.reasons.length > 0 && (
        <div className="mb-5">
          <div
            className={`text-xs uppercase tracking-wider font-bold mb-2 ${subtle}`}
          >
            Why
          </div>
          <ul className="space-y-2">
            {decision.reasons.map((r, i) => (
              <li key={i} className={`flex gap-2 text-sm leading-relaxed ${body}`}>
                <span className="opacity-70 shrink-0">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {decision.reverseTriggers.length > 0 && (
        <div className={`pt-4 border-t ${divider}`}>
          <div
            className={`text-xs uppercase tracking-wider font-bold mb-2 ${subtle}`}
          >
            We&apos;d reverse this if
          </div>
          <ul className="space-y-1.5">
            {decision.reverseTriggers.map((r, i) => (
              <li key={i} className={`flex gap-2 text-sm ${body}`}>
                <span className="opacity-60 shrink-0">·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function CohortMirrorSection({ mirror }: { mirror: CohortMirror }) {
  // Scale bar widths against the largest bucket so the chart reads visually
  // even when the projected median bucket is itself small.
  const maxPct = Math.max(...mirror.buckets.map((b) => b.percentage), 0.01);

  return (
    <section className="mb-8 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2 flex-wrap">
        <Users className="h-6 w-6 text-mint-600" />
        Cohort mirror
        <span className="inline-flex items-center rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold uppercase text-mint-800 tracking-wider">
          Model-projected
        </span>
      </h2>
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        {mirror.cohortDescription}
      </p>

      <div className="rounded-3xl border-2 border-gray-200 bg-white p-5 lg:p-6 print:border-gray-300 print:p-4">
        <div className="space-y-2">
          {mirror.buckets.map((bucket, i) => {
            const widthPct = (bucket.percentage / maxPct) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-right font-mono text-sm font-bold text-gray-900 tabular-nums">
                  {bucket.range}
                </div>
                <div className="flex-1 h-8 rounded-lg bg-gray-100 overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg ${
                      bucket.isYourProjection
                        ? "bg-gradient-to-r from-mint-500 to-mint-600"
                        : "bg-gray-300"
                    }`}
                    style={{ width: `${Math.max(2, widthPct)}%` }}
                  />
                  {bucket.isYourProjection && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-mint-800 uppercase tracking-wider whitespace-nowrap">
                      ← Your projection
                    </div>
                  )}
                </div>
                <div className="w-12 shrink-0 text-right text-sm font-bold tabular-nums text-gray-700">
                  {Math.round(bucket.percentage * 100)}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">
              Projected median
            </div>
            <div className="text-2xl font-black tabular-nums">{mirror.median}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">
              Your percentile in this cohort
            </div>
            <div className="text-2xl font-black tabular-nums">
              {mirror.yourPercentile}
              <span className="text-base text-gray-400 font-bold">th</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 leading-relaxed">
        {mirror.disclaimer}
      </p>
    </section>
  );
}

function HighLeverageMovesSection({ moves }: { moves: HighLeverageMoves }) {
  return (
    <section className="mb-8 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <Zap className="h-6 w-6 text-mint-600" />
        Your 3 highest-leverage moves
      </h2>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Ranked by expected impact for your specific input pattern. Skip the
        rest of the internet — these are the moves that will actually move
        the needle.
      </p>

      <ol className="space-y-3">
        {moves.items.map((m) => (
          <li
            key={m.rank}
            className="rounded-2xl border-2 border-gray-200 bg-white p-5 print:p-4 print:break-inside-avoid"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-mint-100 text-mint-800 font-black text-lg flex items-center justify-center">
                {m.rank}
              </div>
              <h3 className="font-bold text-lg leading-tight">{m.title}</h3>
            </div>
            <div className="ml-12 space-y-2">
              <div className="inline-flex items-center rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-bold text-mint-800">
                Impact: {m.expectedImpact}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{m.why}</p>
              <p className="text-xs italic text-mint-700">When: {m.when}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AntiPatternsSection({ patterns }: { patterns: AntiPatterns }) {
  return (
    <section className="mb-8 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <XCircle className="h-6 w-6 text-rose-600" />
        Don&apos;t do these (yes, really)
      </h2>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Counter-intuitive but data-backed. Reddit won&apos;t tell you these
        — everyone there is selling something.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {patterns.items.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-5 print:p-4 print:break-inside-avoid"
          >
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <h3 className="font-bold leading-tight">{p.title}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {p.reason}
            </p>
            <p className="text-xs text-rose-700/80 italic">
              Based on: {p.basedOn}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestDayProtocolSection({ protocol }: { protocol: TestDayProtocol }) {
  return (
    <section className="mb-8 rounded-3xl border-2 border-mint-300 bg-mint-50/30 p-6 lg:p-8 print:p-4 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-mint-700" />
        Test-day protocol
      </h2>
      <p className="text-sm text-gray-700 mb-5 leading-relaxed">
        Specific routines from high scorers. Operational defaults you can
        adapt — not medical advice.
      </p>

      <div className="grid gap-5 lg:grid-cols-3">
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2 text-amber-800">
            <Calendar className="h-4 w-4" /> Day −1
          </h3>
          <ul className="space-y-2">
            {protocol.dayMinusOne.map((s, i) => (
              <li
                key={i}
                className="text-sm text-gray-800 leading-relaxed flex gap-2"
              >
                <span className="shrink-0 text-mint-600">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2 text-mint-800">
            <Calendar className="h-4 w-4" /> Day 0
          </h3>
          <ul className="space-y-2">
            {protocol.dayZero.map((s, i) => (
              <li
                key={i}
                className="text-sm text-gray-800 leading-relaxed flex gap-2"
              >
                <span className="shrink-0 text-mint-600">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2 text-rose-700">
            <XCircle className="h-4 w-4" /> Don&apos;t
          </h3>
          <ul className="space-y-2">
            {protocol.doNots.map((s, i) => (
              <li
                key={i}
                className="text-sm text-gray-800 leading-relaxed flex gap-2"
              >
                <span className="shrink-0 text-rose-600">×</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HonestUncertaintySection({
  uncertainty,
}: {
  uncertainty: HonestUncertainty;
}) {
  return (
    <section className="mb-8 rounded-3xl border-2 border-gray-300 bg-white p-6 lg:p-8 print:p-4 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-amber-500" />
        Honest uncertainty
      </h2>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        Every other tool will tell you they&apos;re right. We tell you when
        we&apos;re probably wrong.
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-5">
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-900">
            <ListChecks className="h-4 w-4 text-gray-500" /> What we can&apos;t
            predict
          </h3>
          <ul className="space-y-1.5">
            {uncertainty.cannotPredict.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="shrink-0 text-gray-400">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2 text-gray-900">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> When we&apos;d
            be wrong about you
          </h3>
          <ul className="space-y-1.5">
            {uncertainty.whenWedBeWrong.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="shrink-0 text-amber-500">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed pt-4 border-t border-gray-100">
        {uncertainty.notAffiliatedNote}
      </p>
    </section>
  );
}
