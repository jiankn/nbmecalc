import Link from "next/link";
import {
  Activity,
  Calendar,
  CalendarClock,
  Info,
  LineChart,
  Printer as _Printer,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReportPrintButton } from "@/components/report-print-button";
import type {
  PersonalizedWeakSubjects,
  PostponeRecommendation,
  PracticeExam,
  PredictionResult,
  ScoreTrajectory,
  SourceInsight,
  TargetGap,
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
  // Prefer the user's self-reported ∩ cohort weakness when available;
  // otherwise fall back to the cohort-weakest three so the plan still has
  // a defensible anchor.
  const planSubjectSource =
    result.personalizedWeakSubjects?.doublyWeak &&
    result.personalizedWeakSubjects.doublyWeak.length > 0
      ? result.personalizedWeakSubjects.doublyWeak
      : sortedSubjects
          .slice(0, Math.min(3, sortedSubjects.length))
          .map((s) => s.name);
  const plan = buildStudyPlan(planSubjectSource);

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

      {/* Postpone vs. on-schedule decision — only when pass prob < 0.7 */}
      {result.postponeRecommendation.show && (
        <PostponeSection rec={result.postponeRecommendation} />
      )}

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

      {/* 14-day study plan */}
      <section className="mb-8 print:break-before-page print:break-inside-auto">
        <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-mint-600" />
          Your 14-day priority plan
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          {result.personalizedWeakSubjects?.doublyWeak.length
            ? "Built around the subjects you flagged that also run weak in the cohort: "
            : "Built around the cohort’s typical weak spots at your score band: "}
          <strong>{planSubjectSource.join(", ")}</strong>. Adjust if your test
          day is closer than 14 days out.
        </p>
        <ol className="space-y-2">
          {plan.map((task, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-gray-200 p-4 print:border-gray-300 print:p-3 print:break-inside-avoid"
            >
              <span className="font-mono font-bold text-mint-700 w-16 shrink-0">
                Day {i + 1}
              </span>
              <span className="text-gray-700">{task}</span>
            </li>
          ))}
        </ol>
      </section>

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

/**
 * 14-day plan template. We use the user's three weakest cohort subjects to
 * personalize day 1, 2, and 4. The rest is structural — mixed blocks,
 * deliberate rest, fresh NBME calibration.
 *
 * If the user has no weak subjects (edge case: empty cohort data), we fall
 * back to a generic UWorld-driven plan.
 */
function buildStudyPlan(weakSubjects: string[]): string[] {
  if (weakSubjects.length === 0) {
    weakSubjects = ["foundations", "high-yield gaps", "biostatistics"];
  }
  const [s1, s2, s3] = [
    weakSubjects[0],
    weakSubjects[1] ?? weakSubjects[0],
    weakSubjects[2] ?? weakSubjects[0],
  ];
  return [
    `Foundations review: ${s1}. Read First Aid chapter + 40 UWorld Qs (untimed).`,
    `Foundations review: ${s2}. Read First Aid chapter + 40 UWorld Qs (untimed).`,
    `Mixed-block UWorld, 80 Qs timed. Review every wrong answer carefully — your "why" matters more than the "what".`,
    `${s3} deep-dive: Boards & Beyond / Sketchy videos + 40 UWorld Qs.`,
    `Mixed-block UWorld, 80 Qs timed. Log weak topics in a spreadsheet — you'll re-test them on Day 6.`,
    `Spaced repetition: re-do every flagged / wrong Q from Day 3 and Day 5.`,
    `REST DAY. Light review only — Anki or Sketchy. Walk, hydrate, sleep 8+ hours.`,
    `Take a fresh NBME form (one you haven't seen). Time it strictly. This is your calibration.`,
    `Review the NBME wrongs. Update your weak-subject list if new gaps emerged.`,
    `Mixed-block UWorld, 80 Qs timed. Focus on stamina; aim for ≥ 75 % correct.`,
    `Pharmacology + Biostatistics quick-hit (these subjects have outsized point yield per hour).`,
    `Mixed-block UWorld, 80 Qs timed. Final accuracy push — review wrongs the same day.`,
    `Last NBME or UWSA. This is your final calibration. Do NOT cram new content after this.`,
    `REST. No new study. Confirm test-day logistics (route, ID, snacks). Sleep 8+ hours.`,
  ];
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

function PostponeSection({ rec }: { rec: PostponeRecommendation }) {
  const scenarios = [rec.onSchedule, rec.postponed14d, rec.postponed28d];
  return (
    <section className="mb-8 print:break-inside-avoid">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <CalendarClock className="h-6 w-6 text-mint-600" />
        Should you postpone?
      </h2>
      <p className="text-sm text-gray-700 mb-4">{rec.insight}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenarios.map((s, i) => {
          const isOnSchedule = i === 0;
          return (
            <div
              key={i}
              className={`rounded-2xl border-2 p-5 print:p-4 ${
                isOnSchedule
                  ? "border-gray-200 bg-white"
                  : "border-mint-200 bg-mint-50/30"
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                {isOnSchedule
                  ? "On schedule"
                  : `Postpone ${s.daysAdded} days`}
              </div>
              <div className="text-4xl font-black tabular-nums">
                {Math.round(s.projectedPassProbability * 100)}%
              </div>
              <div className="mt-1 text-sm text-gray-600">
                pass probability
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Projected score:{" "}
                <span className="font-mono font-semibold text-gray-700">
                  {s.projectedScore}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Postponed-scenario scores assume a study uplift in line with your
        measured trajectory (or a conservative typical rate if your exams
        aren&apos;t dated). The uplift is capped at +12 pts to reflect real
        diminishing returns.
      </p>
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
