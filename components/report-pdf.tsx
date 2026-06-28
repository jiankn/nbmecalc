/* eslint-disable jsx-a11y/alt-text */
import type { Key } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
  Circle,
  Path,
  G,
} from "@react-pdf/renderer";
import type {
  AntiPatterns,
  CohortMirror,
  HighLeverageMoves,
  HonestUncertainty,
  OneDecision,
  PracticeExam,
  PredictionResult,
  RiskProfile,
  TestDayProtocol,
} from "@/lib/data";

/**
 * Server-rendered PDF version of the premium report.
 *
 * This file uses @react-pdf/renderer primitives (Document, Page, View, Text,
 * Svg, …) — NOT regular DOM elements. The web view (`report-view.tsx`) and
 * this PDF view are deliberately separate components because:
 *
 *   1. PDF primitives use a small Yoga-flexbox subset; they can't consume
 *      Tailwind classes, CSS variables, oklch colors, or animations.
 *   2. We want explicit page breaks and a stable footer with page numbers,
 *      which the web view doesn't need.
 *   3. The web view can grow more interactive (charts, hover states) without
 *      breaking PDF rendering.
 *
 * Both views read from the same `PredictionResult` so the numbers stay
 * locked together.
 */

// @react-pdf/renderer's TypeScript declarations omit React's special-cased
// `key` prop on its primitive components. We patch it back in here via
// declaration merging so we can use `<View key={…}>` etc. inside `.map()`
// without resorting to `// @ts-expect-error` on every line.
declare module "@react-pdf/renderer" {
  interface ViewProps {
    key?: Key | null;
  }
  interface TextProps {
    key?: Key | null;
  }
  interface GProps {
    key?: Key | null;
  }
}

// ---------------------------------------------------------------------------
// Theme — mirrors the on-screen mint palette but rendered with PDF-safe hex
// values (no oklch, no CSS variables).
// ---------------------------------------------------------------------------
const COLOR = {
  ink: "#111827",
  textMuted: "#6B7280",
  textSubtle: "#9CA3AF",
  divider: "#E5E7EB",
  surface: "#F9FAFB",
  mint: "#34D399",
  mintDark: "#0F766E",
  mintBg: "#ECFDF5",
  mintBorder: "#A7F3D0",
  amber: "#F59E0B",
  amberBg: "#FEF3C7",
  amberBorder: "#FDE68A",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redBorder: "#FECACA",
  green: "#16A34A",
  cardBorder: "#D1D5DB",
} as const;

const PASS_THRESHOLD: Record<PredictionResult["step"], number> = {
  step1: 196,
  step2: 218,
  step3: 198,
};

const STEP_LABEL: Record<PredictionResult["step"], string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLOR.ink,
    lineHeight: 1.45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.divider,
  },
  brand: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLOR.mintDark },
  brandSub: { fontSize: 9, color: COLOR.textMuted },
  premiumBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLOR.mintDark,
    backgroundColor: COLOR.mintBg,
    borderWidth: 1,
    borderColor: COLOR.mintBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: COLOR.textMuted, marginBottom: 18 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 6,
  },
  sectionDesc: { fontSize: 9.5, color: COLOR.textMuted, marginBottom: 8 },
  card: {
    borderWidth: 1,
    borderColor: COLOR.cardBorder,
    borderRadius: 10,
    padding: 12,
  },
  cardMint: {
    borderWidth: 1,
    borderColor: COLOR.mintBorder,
    borderRadius: 10,
    padding: 12,
    backgroundColor: COLOR.mintBg,
    marginBottom: 14,
  },
  cardAmber: {
    borderWidth: 1,
    borderColor: COLOR.amberBorder,
    borderRadius: 10,
    padding: 12,
    backgroundColor: COLOR.amberBg,
    marginBottom: 14,
  },
  // Hero score block
  hero: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: COLOR.ink,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },
  heroLeft: {
    flex: 2,
    backgroundColor: COLOR.ink,
    padding: 18,
  },
  heroLabel: { fontSize: 8.5, color: COLOR.mint, fontFamily: "Helvetica-Bold" },
  heroScore: {
    fontSize: 56,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginTop: 6,
    marginBottom: 4,
  },
  heroCi: { fontSize: 9, color: "#D1D5DB" },
  heroRight: { flex: 3, padding: 16, justifyContent: "center" },
  heroMargin: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  // Pass probability strip
  passRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  passProbCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLOR.cardBorder,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  passNum: { fontSize: 36, fontFamily: "Helvetica-Bold" },
  passBand: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2 },
  // Tables
  th: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLOR.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: { fontSize: 10 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: COLOR.divider,
  },
  // KPI grid
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kpiCell: { flexBasis: "48%", paddingVertical: 4 },
  kpiLabel: {
    fontSize: 8,
    color: COLOR.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: { fontSize: 20, fontFamily: "Helvetica-Bold", marginTop: 2 },
  // Footer
  pageFooter: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLOR.textSubtle,
  },
});

// ---------------------------------------------------------------------------
// Public component — call from the API route with renderToBuffer / renderToStream.
// ---------------------------------------------------------------------------
export function ReportPdf({
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

  const sortedSubjects = [...result.cohortSubjectAverages].sort(
    (a, b) => a.cohortAverage - b.cohortAverage
  );

  const issued = purchasedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Document
      title={`${stepLabel} Score Prediction Report`}
      author="nbmecalc"
      subject="USMLE practice exam prediction"
      keywords="USMLE NBME UWSA Step prediction"
    >
      {/* ─── Page 1: cover + headline numbers ─── */}
      <Page size="A4" style={styles.page} wrap>
        <Header />

        <Text style={styles.title}>Your {stepLabel} Score Prediction</Text>
        <Text style={styles.subtitle}>
          Issued {issued} · Session {sessionId.slice(0, 16)}…
        </Text>

        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>
              PREDICTED {stepLabel.toUpperCase()}
            </Text>
            <Text style={styles.heroScore}>{result.pointEstimate}</Text>
            <Text style={styles.heroCi}>
              95% CI · {result.ciLower} – {result.ciUpper}
            </Text>
          </View>
          <View style={styles.heroRight}>
            <Text
              style={{
                fontSize: 9,
                color: COLOR.textMuted,
                marginBottom: 4,
              }}
            >
              MARGIN VS. PASS THRESHOLD ({threshold})
            </Text>
            <Text
              style={{
                ...styles.heroMargin,
                color: margin >= 0 ? COLOR.green : COLOR.red,
              }}
            >
              {margin >= 0 ? "+" : ""}
              {margin} pts {margin >= 0 ? "above passing" : "below passing"}
            </Text>
            <Text
              style={{ fontSize: 9, color: COLOR.textMuted, marginTop: 6 }}
            >
              {result.cohortNote}
            </Text>
          </View>
        </View>

        <View style={styles.passRow}>
          <View
            style={{
              ...styles.passProbCard,
              backgroundColor: bandBg(band.tone),
              borderColor: bandBorder(band.tone),
            }}
          >
            <Text style={styles.kpiLabel}>Pass probability</Text>
            <Text style={styles.passNum}>
              {Math.round(result.passProbability * 100)}%
            </Text>
            <Text style={{ ...styles.passBand, color: bandText(band.tone) }}>
              {band.label}
            </Text>
          </View>
          <View style={{ flex: 2, ...styles.card }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                marginBottom: 4,
              }}
            >
              What this means
            </Text>
            <Text style={{ marginBottom: 6 }}>{band.explainer}</Text>
            <Text style={{ fontSize: 8.5, color: COLOR.textMuted }}>
              We cap pass probability at 99%. Even a +30 pt margin can fail on
              test day from illness, anxiety, or an unusual block.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Practice exams used</Text>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ ...styles.th, flex: 3 }}>Source</Text>
            <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
              Score
            </Text>
            <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
              Days ago
            </Text>
          </View>
          {exams.map((e) => (
            <View key={e.id} style={styles.tableRow}>
              <Text style={{ ...styles.td, flex: 3 }}>
                {formatExamLabel(e)}
              </Text>
              <Text
                style={{
                  ...styles.td,
                  flex: 1,
                  textAlign: "right",
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {e.score}
                {isPercentSource(e.source) ? "%" : ""}
              </Text>
              <Text style={{ ...styles.td, flex: 1, textAlign: "right" }}>
                {e.takenDaysAgo ?? "—"}
              </Text>
            </View>
          ))}
        </View>

        <PageFooter sessionId={sessionId} />
      </Page>

      {/* ─── Page 2: PRIMARY DECISION-GRADE MODULES ─── */}
      {/* Order mirrors the on-screen report: risk → decision → leverage
          moves → cohort context → anti-patterns → test-day routine.
          react-pdf will auto-break to a new page if these overflow A4. */}
      <Page size="A4" style={styles.page} wrap>
        <Header />
        <Text style={styles.title}>Decision-grade analysis</Text>
        <Text style={styles.subtitle}>
          Six modules answering the questions you&apos;ve been agonizing over.
        </Text>

        <RiskProfileBlock profile={result.riskProfile} />
        <OneDecisionBlock decision={result.oneDecision} />
        {result.highLeverageMoves.items.length > 0 && (
          <HighLeverageMovesBlock moves={result.highLeverageMoves} />
        )}
        {result.cohortMirror.buckets.length > 0 && (
          <CohortMirrorBlock mirror={result.cohortMirror} />
        )}
        {result.antiPatterns.items.length > 0 && (
          <AntiPatternsBlock patterns={result.antiPatterns} />
        )}
        {result.testDayProtocol.show && (
          <TestDayProtocolBlock protocol={result.testDayProtocol} />
        )}

        <PageFooter sessionId={sessionId} />
      </Page>

      {/* ─── Page 3: Supporting analytics + Honest uncertainty + Methodology ─── */}
      <Page size="A4" style={styles.page} wrap>
        <Header />
        <Text style={styles.title}>Supporting analytics</Text>
        <Text style={styles.subtitle}>
          The numbers behind the recommendation above.
        </Text>

        {result.scoreTrajectory.points.length >= 2 && (
          <TrajectoryBlock trajectory={result.scoreTrajectory} />
        )}

        {result.sourceInsight.rows.length >= 2 && (
          <SourceBlock insight={result.sourceInsight} />
        )}

        {result.targetGap && <TargetGapBlock gap={result.targetGap} />}

        {result.personalizedWeakSubjects && (
          <PersonalizedWeakBlock data={result.personalizedWeakSubjects} />
        )}

        <CohortTableBlock
          subjects={sortedSubjects}
          note={result.cohortSubjectAveragesNote}
        />

        <HonestUncertaintyBlock uncertainty={result.honestUncertainty} />

        <Text style={styles.sectionTitle}>Methodology</Text>
        <Text style={{ fontSize: 9.5, marginBottom: 4 }}>
          Equating tables: each practice source is mapped to a Step-equivalent
          score using vendor-published equating where available, and otherwise
          through a regression on a community dataset of {">"} 5,000 paired
          (practice → real-exam) outcomes. Recent NBME forms (28+) are
          weighted 1.4× because they best mirror current exam difficulty.
        </Text>
        <Text style={{ fontSize: 9.5, marginBottom: 4 }}>
          Confidence interval: 95% CI is computed via residual standard error
          across the cohort at your predicted band, then widened slightly for
          single-source predictions to reflect lower information.
        </Text>
        <Text style={{ fontSize: 9.5 }}>
          Limitations: the model can&apos;t see your sleep, stamina, anxiety,
          or test-day variance. Real outcomes regularly fall ±10 pts from any
          model — never plan strictly around the point estimate.
        </Text>

        <PageFooter sessionId={sessionId} />
      </Page>
    </Document>
  );
}

// ---------------------------------------------------------------------------
// Sub-blocks — kept inline; never exported.
// ---------------------------------------------------------------------------

function Header() {
  return (
    <View style={styles.header} fixed>
      <View>
        <Text style={styles.brand}>nbmecalc</Text>
        <Text style={styles.brandSub}>USMLE Step Score Predictor</Text>
      </View>
      <Text style={styles.premiumBadge}>PREMIUM REPORT</Text>
    </View>
  );
}

function PageFooter({ sessionId }: { sessionId: string }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>nbmecalc.com · Session {sessionId.slice(0, 12)}…</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}

function TrajectoryBlock({
  trajectory,
}: {
  trajectory: PredictionResult["scoreTrajectory"];
}) {
  const points = trajectory.points;
  const scores = points.map((p) => p.equated);
  const min = Math.min(...scores) - 4;
  const max = Math.max(...scores) + 4;
  const range = Math.max(1, max - min);
  const w = 480;
  const h = 96;
  const padX = 24;
  const padY = 16;
  const usableW = w - padX * 2;
  const usableH = h - padY * 2;

  const x = (i: number) =>
    points.length === 1
      ? padX + usableW / 2
      : padX + (i / (points.length - 1)) * usableW;
  const y = (score: number) => padY + ((max - score) / range) * usableH;
  const linePath = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.equated).toFixed(1)}`
    )
    .join(" ");

  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>Your score trajectory</Text>
      <Text style={styles.sectionDesc}>{trajectory.insight}</Text>
      <View style={styles.card}>
        <Svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 96 }}>
          <Line
            x1={padX}
            x2={w - padX}
            y1={h - padY}
            y2={h - padY}
            stroke={COLOR.divider}
          />
          {trajectory.slopePer30Days !== null && (
            <Path
              d={linePath}
              stroke={COLOR.mint}
              strokeWidth={2.5}
              fill="none"
            />
          )}
          {points.map((p, i) => (
            <G key={i}>
              <Circle
                cx={x(i)}
                cy={y(p.equated)}
                r={4}
                fill={COLOR.mint}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            </G>
          ))}
        </Svg>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          {points.map((p, i) => (
            <View key={i} style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold" }}
              >
                {p.equated}
              </Text>
              <Text style={{ fontSize: 7.5, color: COLOR.textMuted }}>
                {p.label}
              </Text>
            </View>
          ))}
        </View>
        {trajectory.slopePer30Days !== null && (
          <Text
            style={{
              fontSize: 9,
              marginTop: 6,
              color:
                trajectory.trend === "improving"
                  ? COLOR.green
                  : trajectory.trend === "declining"
                  ? COLOR.red
                  : COLOR.textMuted,
              fontFamily: "Helvetica-Bold",
            }}
          >
            Slope: {trajectory.slopePer30Days >= 0 ? "+" : ""}
            {trajectory.slopePer30Days} pts / 30 days
          </Text>
        )}
      </View>
    </View>
  );
}

function SourceBlock({
  insight,
}: {
  insight: PredictionResult["sourceInsight"];
}) {
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>How your sources compare</Text>
      {insight.insight && (
        <Text style={styles.sectionDesc}>{insight.insight}</Text>
      )}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ ...styles.th, flex: 3 }}>Source</Text>
          <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
            # Exams
          </Text>
          <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
            Avg equated
          </Text>
        </View>
        {insight.rows.map((r) => (
          <View
            key={r.source}
            style={{
              flexDirection: "row",
              paddingVertical: 3,
              borderTopWidth: 1,
              borderTopColor: COLOR.divider,
            }}
          >
            <Text style={{ ...styles.td, flex: 3 }}>{r.label}</Text>
            <Text style={{ ...styles.td, flex: 1, textAlign: "right" }}>
              {r.count}
            </Text>
            <Text
              style={{
                ...styles.td,
                flex: 1,
                textAlign: "right",
                fontFamily: "Helvetica-Bold",
              }}
            >
              {r.averageEquated}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TargetGapBlock({
  gap,
}: {
  gap: NonNullable<PredictionResult["targetGap"]>;
}) {
  const ahead = gap.gap >= 0;
  return (
    <View style={ahead ? styles.cardMint : styles.cardAmber} wrap={false}>
      <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>Target gap</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>Current</Text>
          <Text style={styles.kpiValue}>{gap.current}</Text>
        </View>
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>Gap</Text>
          <Text
            style={{
              ...styles.kpiValue,
              color: ahead ? COLOR.green : COLOR.amber,
            }}
          >
            {ahead ? "+" : ""}
            {gap.gap}
          </Text>
        </View>
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>At test day</Text>
          <Text style={styles.kpiValue}>{gap.projectedAtExam ?? "—"}</Text>
        </View>
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>Days to target</Text>
          <Text style={styles.kpiValue}>
            {gap.daysToTargetAtPace ?? "—"}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 9.5, marginTop: 6 }}>{gap.insight}</Text>
    </View>
  );
}

function PersonalizedWeakBlock({
  data,
}: {
  data: NonNullable<PredictionResult["personalizedWeakSubjects"]>;
}) {
  return (
    <View style={styles.cardMint} wrap={false}>
      <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>
        Your priority subjects
      </Text>
      <Text style={{ fontSize: 9.5, marginBottom: 6 }}>{data.insight}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {data.selfReported.map((name) => {
          const doubly = data.doublyWeak.includes(name);
          return (
            <View
              key={name}
              style={{
                borderWidth: 1,
                borderColor: doubly ? COLOR.redBorder : COLOR.cardBorder,
                backgroundColor: doubly ? COLOR.redBg : "#FFFFFF",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 99,
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: doubly ? COLOR.red : COLOR.ink,
                }}
              >
                {name}
                {doubly ? "  · PRIORITY" : ""}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function CohortTableBlock({
  subjects,
  note,
}: {
  subjects: PredictionResult["cohortSubjectAverages"];
  note: string;
}) {
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>
        Cohort subject averages (for context)
      </Text>
      <Text style={styles.sectionDesc}>{note}</Text>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ ...styles.th, flex: 3 }}>Subject</Text>
          <Text style={{ ...styles.th, flex: 1, textAlign: "right" }}>
            Cohort avg
          </Text>
          <Text style={{ ...styles.th, flex: 2, textAlign: "right" }}>
            Cohort signal
          </Text>
        </View>
        {subjects.map((s, i) => {
          const isCohortWeak = s.cohortWeakness;
          const isCohortBottom = i < 2 && !s.cohortWeakness;
          const isStrong = i >= subjects.length - 2;
          const label = isCohortWeak
            ? "Cohort weak spot"
            : isCohortBottom
            ? "Below cohort mean"
            : isStrong
            ? "Cohort strong"
            : "Mid cohort";
          const color = isCohortWeak
            ? COLOR.red
            : isCohortBottom
            ? COLOR.amber
            : isStrong
            ? COLOR.green
            : COLOR.textMuted;
          return (
            <View
              key={s.name}
              style={{
                flexDirection: "row",
                paddingVertical: 3,
                borderTopWidth: 1,
                borderTopColor: COLOR.divider,
              }}
            >
              <Text style={{ ...styles.td, flex: 3 }}>{s.name}</Text>
              <Text
                style={{
                  ...styles.td,
                  flex: 1,
                  textAlign: "right",
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {Math.round(s.cohortAverage)}%
              </Text>
              <Text
                style={{
                  ...styles.td,
                  flex: 2,
                  textAlign: "right",
                  color,
                  fontFamily: "Helvetica-Bold",
                }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={{ fontSize: 8.5, color: COLOR.textMuted, marginTop: 4 }}>
        Labels describe the cohort at your predicted band — not your individual
        performance.
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Premium-report PDF blocks — the seven decision-grade modules. Each renders
// unconditionally where it makes sense; the parent gates the empty-input
// edge cases with `.length > 0` / `.show` checks so the PDF stays compact
// when there is genuinely nothing to say.
// ---------------------------------------------------------------------------

const RISK_TONE_PDF: Record<
  RiskProfile["shape"],
  { border: string; bg: string; label: string }
> = {
  asymmetric_downside: {
    border: COLOR.amberBorder,
    bg: COLOR.amberBg,
    label: "Asymmetric downside",
  },
  asymmetric_upside: {
    border: COLOR.mintBorder,
    bg: COLOR.mintBg,
    label: "Asymmetric upside",
  },
  tight_balanced: {
    border: COLOR.mintBorder,
    bg: COLOR.mintBg,
    label: "Tight & balanced",
  },
  wide_balanced: {
    border: COLOR.cardBorder,
    bg: COLOR.surface,
    label: "Wide & balanced",
  },
};

function RiskProfileBlock({ profile }: { profile: RiskProfile }) {
  const tone = RISK_TONE_PDF[profile.shape];
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: tone.border,
        backgroundColor: tone.bg,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
      }}
      wrap={false}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 8,
        }}
      >
        <Text style={{ ...styles.sectionTitle, marginTop: 0, marginBottom: 0 }}>
          Your risk profile
        </Text>
        <Text
          style={{
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            color: COLOR.ink,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: tone.border,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 99,
          }}
        >
          {tone.label}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}
      >
        {[
          { label: "Floor", value: String(profile.floor), highlight: false },
          {
            label: "Spread",
            value: `${profile.spread} pts`,
            sub: `${profile.spreadVsTypical} than typical`,
            highlight: true,
          },
          { label: "Ceiling", value: String(profile.ceiling), highlight: false },
        ].map((cell, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              borderWidth: cell.highlight ? 1.5 : 0,
              borderColor: COLOR.cardBorder,
              backgroundColor: cell.highlight ? "#FFFFFF" : "transparent",
              borderRadius: 8,
              paddingVertical: 6,
              alignItems: "center",
            }}
          >
            <Text style={styles.kpiLabel}>{cell.label}</Text>
            <Text style={{ ...styles.kpiValue, fontSize: 18 }}>
              {cell.value}
            </Text>
            {cell.sub && (
              <Text
                style={{
                  fontSize: 7.5,
                  color: COLOR.textMuted,
                  marginTop: 1,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {cell.sub}
              </Text>
            )}
          </View>
        ))}
      </View>

      <Text
        style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 }}
      >
        {profile.headline}
      </Text>
      <Text style={{ fontSize: 9.5, color: COLOR.ink }}>{profile.rootCause}</Text>
    </View>
  );
}

function OneDecisionBlock({ decision }: { decision: OneDecision }) {
  // Tone palette: dark band for prominent recommendations, light card for
  // need_more_data so it doesn't look like a real action when it isn't.
  const isMore = decision.recommendation === "need_more_data";
  const tone = (() => {
    switch (decision.recommendation) {
      case "sit_as_scheduled":
        return {
          bg: COLOR.mintBg,
          border: COLOR.mintBorder,
          accent: COLOR.mintDark,
        };
      case "postpone_14d":
        return {
          bg: COLOR.amberBg,
          border: COLOR.amberBorder,
          accent: COLOR.amber,
        };
      case "postpone_28d":
        return { bg: COLOR.redBg, border: COLOR.redBorder, accent: COLOR.red };
      case "need_more_data":
      default:
        return {
          bg: COLOR.surface,
          border: COLOR.cardBorder,
          accent: COLOR.textMuted,
        };
    }
  })();

  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: tone.border,
        backgroundColor: tone.bg,
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
      }}
      wrap={false}
    >
      <Text
        style={{
          fontSize: 8.5,
          fontFamily: "Helvetica-Bold",
          color: tone.accent,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 4,
        }}
      >
        {isMore ? "Need more data" : "Our recommendation"} ·{" "}
        {decision.confidence} confidence
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontFamily: "Helvetica-Bold",
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {decision.headline}
      </Text>

      {decision.reasons.length > 0 && (
        <View style={{ marginBottom: decision.reverseTriggers.length > 0 ? 8 : 0 }}>
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: COLOR.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 3,
            }}
          >
            Why
          </Text>
          {decision.reasons.map((r, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", marginBottom: 2 }}
            >
              <Text style={{ fontSize: 9.5, color: tone.accent, width: 10 }}>
                →
              </Text>
              <Text style={{ fontSize: 9.5, flex: 1 }}>{r}</Text>
            </View>
          ))}
        </View>
      )}

      {decision.reverseTriggers.length > 0 && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: tone.border,
            paddingTop: 6,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: COLOR.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 3,
            }}
          >
            We&apos;d reverse this if
          </Text>
          {decision.reverseTriggers.map((r, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ fontSize: 9, color: COLOR.textMuted, width: 10 }}>
                ·
              </Text>
              <Text style={{ fontSize: 9, color: COLOR.ink, flex: 1 }}>
                {r}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function HighLeverageMovesBlock({ moves }: { moves: HighLeverageMoves }) {
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>Your 3 highest-leverage moves</Text>
      <Text style={styles.sectionDesc}>
        Ranked by expected impact for your specific input pattern.
      </Text>
      <View style={{ gap: 6 }}>
        {moves.items.map((m) => (
          <View
            key={m.rank}
            style={{
              borderWidth: 1,
              borderColor: COLOR.cardBorder,
              borderRadius: 8,
              padding: 10,
              flexDirection: "row",
              gap: 10,
            }}
            wrap={false}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: COLOR.mintBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Helvetica-Bold",
                  color: COLOR.mintDark,
                  fontSize: 13,
                }}
              >
                {m.rank}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Helvetica-Bold",
                  marginBottom: 3,
                }}
              >
                {m.title}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: COLOR.mintDark,
                  fontFamily: "Helvetica-Bold",
                  marginBottom: 3,
                }}
              >
                IMPACT: {m.expectedImpact.toUpperCase()}
              </Text>
              <Text style={{ fontSize: 9.5, marginBottom: 3 }}>{m.why}</Text>
              <Text
                style={{ fontSize: 8.5, fontStyle: "italic", color: COLOR.mintDark }}
              >
                When: {m.when}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function CohortMirrorBlock({ mirror }: { mirror: CohortMirror }) {
  const maxPct = Math.max(...mirror.buckets.map((b) => b.percentage), 0.01);
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>Cohort mirror</Text>
      <Text style={styles.sectionDesc}>{mirror.cohortDescription}</Text>
      <View style={styles.card}>
        <View style={{ gap: 4 }}>
          {mirror.buckets.map((bucket, i) => {
            const widthPct = Math.max(2, (bucket.percentage / maxPct) * 100);
            return (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text
                  style={{
                    width: 56,
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    textAlign: "right",
                  }}
                >
                  {bucket.range}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 14,
                    backgroundColor: COLOR.divider,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${widthPct}%`,
                      height: "100%",
                      backgroundColor: bucket.isYourProjection
                        ? COLOR.mint
                        : "#9CA3AF",
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text
                  style={{
                    width: 32,
                    fontSize: 9,
                    fontFamily: "Helvetica-Bold",
                    textAlign: "right",
                  }}
                >
                  {Math.round(bucket.percentage * 100)}%
                </Text>
                {bucket.isYourProjection && (
                  <Text
                    style={{
                      fontSize: 7.5,
                      fontFamily: "Helvetica-Bold",
                      color: COLOR.mintDark,
                      width: 32,
                    }}
                  >
                    ← YOU
                  </Text>
                )}
                {!bucket.isYourProjection && <View style={{ width: 32 }} />}
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: COLOR.divider,
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.kpiLabel}>Projected median</Text>
            <Text style={{ ...styles.kpiValue, fontSize: 16 }}>
              {mirror.median}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.kpiLabel}>Your percentile</Text>
            <Text style={{ ...styles.kpiValue, fontSize: 16 }}>
              {mirror.yourPercentile}
              <Text style={{ fontSize: 10, color: COLOR.textMuted }}>th</Text>
            </Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 8.5, color: COLOR.textMuted, marginTop: 4 }}>
        {mirror.disclaimer}
      </Text>
    </View>
  );
}

function AntiPatternsBlock({ patterns }: { patterns: AntiPatterns }) {
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <Text style={styles.sectionTitle}>Don&apos;t do these</Text>
      <Text style={styles.sectionDesc}>
        Counter-intuitive but data-backed. Reddit won&apos;t tell you these.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {patterns.items.map((p, i) => (
          <View
            key={i}
            style={{
              flexBasis: "48%",
              borderWidth: 1,
              borderColor: COLOR.redBorder,
              backgroundColor: COLOR.redBg,
              borderRadius: 8,
              padding: 8,
            }}
            wrap={false}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Bold",
                color: COLOR.red,
                marginBottom: 3,
              }}
            >
              ✕ {p.title}
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 3 }}>{p.reason}</Text>
            <Text
              style={{ fontSize: 8, color: COLOR.textMuted, fontStyle: "italic" }}
            >
              Based on: {p.basedOn}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TestDayProtocolBlock({ protocol }: { protocol: TestDayProtocol }) {
  const columns: { title: string; items: string[]; accent: string }[] = [
    { title: "DAY −1", items: protocol.dayMinusOne, accent: COLOR.amber },
    { title: "DAY 0", items: protocol.dayZero, accent: COLOR.mintDark },
    { title: "DON'T", items: protocol.doNots, accent: COLOR.red },
  ];
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: COLOR.mintBorder,
        backgroundColor: COLOR.mintBg,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
      }}
      wrap={false}
    >
      <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>
        Test-day protocol
      </Text>
      <Text style={styles.sectionDesc}>
        Operational defaults from high scorers — adapt to your own routine.
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {columns.map((col) => (
          <View key={col.title} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: col.accent,
                marginBottom: 4,
                letterSpacing: 0.6,
              }}
            >
              {col.title}
            </Text>
            {col.items.map((s, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", marginBottom: 3 }}
              >
                <Text
                  style={{ fontSize: 8.5, color: col.accent, width: 8 }}
                >
                  ·
                </Text>
                <Text style={{ fontSize: 8.5, flex: 1, lineHeight: 1.35 }}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function HonestUncertaintyBlock({
  uncertainty,
}: {
  uncertainty: HonestUncertainty;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLOR.cardBorder,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
      }}
      wrap={false}
    >
      <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>
        Honest uncertainty
      </Text>
      <Text style={styles.sectionDesc}>
        Every other tool tells you they&apos;re right. We tell you when
        we&apos;re probably wrong.
      </Text>
      <View style={{ flexDirection: "row", gap: 14, marginBottom: 6 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Helvetica-Bold",
              marginBottom: 4,
            }}
          >
            What we can&apos;t predict
          </Text>
          {uncertainty.cannotPredict.map((s, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ fontSize: 8.5, color: COLOR.textMuted, width: 8 }}>
                ·
              </Text>
              <Text style={{ fontSize: 8.5, flex: 1 }}>{s}</Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Helvetica-Bold",
              marginBottom: 4,
            }}
          >
            When we&apos;d be wrong about you
          </Text>
          {uncertainty.whenWedBeWrong.map((s, i) => (
            <View key={i} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ fontSize: 8.5, color: COLOR.amber, width: 8 }}>
                ·
              </Text>
              <Text style={{ fontSize: 8.5, flex: 1 }}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text
        style={{
          fontSize: 8,
          color: COLOR.textMuted,
          marginTop: 4,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: COLOR.divider,
        }}
      >
        {uncertainty.notAffiliatedNote}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Pure helpers — kept inline so the PDF builder is self-contained.
// ---------------------------------------------------------------------------

type BandTone = "green" | "mint" | "amber" | "red";

function passBand(prob: number): {
  label: string;
  tone: BandTone;
  explainer: string;
} {
  if (prob >= 0.95)
    return {
      label: "Very strong",
      tone: "green",
      explainer:
        "Comfortably above the line. Focus on stamina and refining weak topics rather than cramming new content.",
    };
  if (prob >= 0.85)
    return {
      label: "Strong",
      tone: "green",
      explainer:
        "On track to pass. Maintain momentum and shore up your weakest two subjects.",
    };
  if (prob >= 0.7)
    return {
      label: "Likely pass",
      tone: "mint",
      explainer:
        "Likely to pass, but the margin is thinner than you might want. Add focused review on weak subjects.",
    };
  if (prob >= 0.5)
    return {
      label: "Borderline",
      tone: "amber",
      explainer:
        "Close to a coin flip. Consider postponing if your timeline allows, or aggressively shore up the weakest 2-3 subjects.",
    };
  return {
    label: "Risk of failing",
    tone: "red",
    explainer:
      "High risk. Strongly consider rescheduling and rebuilding the weakest subjects from foundations.",
  };
}

function bandBg(tone: BandTone) {
  switch (tone) {
    case "green":
    case "mint":
      return COLOR.mintBg;
    case "amber":
      return COLOR.amberBg;
    case "red":
      return COLOR.redBg;
  }
}
function bandBorder(tone: BandTone) {
  switch (tone) {
    case "green":
    case "mint":
      return COLOR.mintBorder;
    case "amber":
      return COLOR.amberBorder;
    case "red":
      return COLOR.redBorder;
  }
}
function bandText(tone: BandTone) {
  switch (tone) {
    case "green":
      return COLOR.green;
    case "mint":
      return COLOR.mintDark;
    case "amber":
      return COLOR.amber;
    case "red":
      return COLOR.red;
  }
}

function isPercentSource(s: PracticeExam["source"]) {
  return s === "FREE120" || s === "AMBOSS" || s === "CMS";
}

function formatExamLabel(e: PracticeExam) {
  if (e.source === "NBME") return `NBME Form ${e.formNumber ?? "?"}`;
  if (e.source === "UWSA1") return "UWSA 1";
  if (e.source === "UWSA2") return "UWSA 2";
  if (e.source === "FREE120") return "Free 120";
  if (e.source === "AMBOSS") return `AMBOSS ${e.formNumber ?? ""}`.trim();
  if (e.source === "CMS") return `CMS ${e.formNumber ?? ""}`.trim();
  return e.source;
}
