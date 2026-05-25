/**
 * Server-rendered SVG data chart for inline blog content.
 *
 * Why server SVG instead of a chart library:
 *   - Zero client JS (renders in static HTML, perfect for SEO)
 *   - Visible to Googlebot text crawler (labels + values are real DOM text)
 *   - Pinterest / image-search friendly (it's a real <svg> with alt text)
 *   - Brand-consistent (uses our mint palette + the same fonts as the page)
 *   - No layout shift on load
 *
 * Two variants:
 *   - "bar"   — horizontal bars, supports negative values (bidirectional)
 *   - "donut" — donut/ring chart with a legend
 *
 * All sizing is responsive via SVG viewBox; the container controls width.
 */
import type { ChartDatum } from "@/lib/blog/posts";

const MINT_500 = "#34D399";
const MINT_300 = "#6EE7B7";
const MINT_700 = "#047857";
const AMBER_400 = "#FBBF24";
const ROSE_400 = "#FB7185";
const GRAY_200 = "#E5E7EB";
const GRAY_500 = "#6B7280";
const GRAY_900 = "#111827";

interface DataChartProps {
  variant: "bar" | "donut";
  title: string;
  caption?: string;
  unit?: string;
  data: ChartDatum[];
}

export function DataChart({
  variant,
  title,
  caption,
  unit = "",
  data,
}: DataChartProps) {
  return (
    <figure className="my-8 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8">
      <figcaption className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-5">
        {title}
      </figcaption>

      {variant === "bar" ? (
        <BarChart data={data} unit={unit} />
      ) : (
        <DonutChart data={data} unit={unit} />
      )}

      {caption && (
        <p className="mt-5 text-xs text-gray-500 italic leading-relaxed">
          {caption}
        </p>
      )}
    </figure>
  );
}

// ─── Horizontal bar chart ────────────────────────────────────────────────────

function BarChart({ data, unit }: { data: ChartDatum[]; unit: string }) {
  const hasNegative = data.some((d) => d.value < 0);
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  // Each row is 44px tall; container width is responsive.
  const ROW_H = 44;
  const LABEL_W = 180; // left column for category labels
  const VALUE_W = 64; // right column for value text
  const PAD_X = 8;

  // Viewbox total width; bar area is whatever's between label + value.
  const VB_W = 720;
  const BAR_AREA_W = VB_W - LABEL_W - VALUE_W - PAD_X * 2;
  const ZERO_X = hasNegative
    ? LABEL_W + PAD_X + BAR_AREA_W / 2
    : LABEL_W + PAD_X;
  const halfBar = hasNegative ? BAR_AREA_W / 2 : BAR_AREA_W;
  const VB_H = data.length * ROW_H + 16;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      role="img"
      aria-label="bar chart"
      style={{ display: "block", fontFamily: "inherit" }}
    >
      {/* Zero / baseline guideline */}
      <line
        x1={ZERO_X}
        x2={ZERO_X}
        y1={0}
        y2={VB_H - 8}
        stroke={GRAY_200}
        strokeWidth={1}
      />

      {data.map((d, i) => {
        const y = i * ROW_H + 8;
        const fill = d.highlight
          ? AMBER_400
          : d.value < 0
          ? ROSE_400
          : MINT_500;

        const ratio = Math.abs(d.value) / maxAbs;
        const barLen = ratio * halfBar;
        const barX = d.value < 0 ? ZERO_X - barLen : ZERO_X;
        const valueX = LABEL_W + PAD_X + BAR_AREA_W + 4;

        return (
          <g key={i}>
            {/* Category label (right-aligned) */}
            <text
              x={LABEL_W - 8}
              y={y + ROW_H / 2 + 5}
              textAnchor="end"
              fontSize={15}
              fontWeight={600}
              fill={GRAY_900}
            >
              {d.label}
            </text>

            {/* Bar */}
            <rect
              x={barX}
              y={y + 8}
              width={Math.max(barLen, 2)}
              height={ROW_H - 18}
              rx={6}
              fill={fill}
            />

            {/* Value label (right-aligned) */}
            <text
              x={valueX}
              y={y + ROW_H / 2 + 5}
              textAnchor="start"
              fontSize={14}
              fontWeight={700}
              fill={d.highlight ? "#92400E" : MINT_700}
            >
              {d.value > 0 && hasNegative ? "+" : ""}
              {d.value}
              {unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────

function DonutChart({ data, unit }: { data: ChartDatum[]; unit: string }) {
  const total = data.reduce((sum, d) => sum + Math.abs(d.value), 0);
  // Layout: donut on left, legend on right.
  // Viewbox is 720x320 to match the bar chart's visual weight.
  const VB_W = 720;
  const VB_H = 320;
  const CX = 160;
  const CY = 160;
  const R_OUTER = 120;
  const R_INNER = 72;

  // Color rotation — mint family with two accents.
  const PALETTE = [
    MINT_500,
    MINT_700,
    MINT_300,
    AMBER_400,
    "#0F766E", // teal-700
    "#94A3B8", // slate-400
    "#DC2626", // red-600
    "#FACC15", // yellow-400
    "#9333EA", // purple-600
  ];

  // Build slice paths.
  let cursor = -Math.PI / 2; // start at 12 o'clock
  const slices = data.map((d, i) => {
    const portion = total > 0 ? Math.abs(d.value) / total : 0;
    const angle = portion * 2 * Math.PI;
    const start = cursor;
    const end = cursor + angle;
    cursor = end;

    const x1 = CX + Math.cos(start) * R_OUTER;
    const y1 = CY + Math.sin(start) * R_OUTER;
    const x2 = CX + Math.cos(end) * R_OUTER;
    const y2 = CY + Math.sin(end) * R_OUTER;
    const x3 = CX + Math.cos(end) * R_INNER;
    const y3 = CY + Math.sin(end) * R_INNER;
    const x4 = CX + Math.cos(start) * R_INNER;
    const y4 = CY + Math.sin(start) * R_INNER;
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return {
      path,
      color: d.highlight ? AMBER_400 : PALETTE[i % PALETTE.length],
      percent: Math.round(portion * 1000) / 10,
      label: d.label,
      value: d.value,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      role="img"
      aria-label="donut chart"
      style={{ display: "block", fontFamily: "inherit" }}
    >
      {/* Donut slices */}
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} />
      ))}

      {/* Center "Total" label */}
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill={GRAY_500}
      >
        Total
      </text>
      <text
        x={CX}
        y={CY + 18}
        textAnchor="middle"
        fontSize={26}
        fontWeight={800}
        fill={GRAY_900}
      >
        {unit === "%" ? "100%" : total + unit}
      </text>

      {/* Legend */}
      {slices.map((s, i) => {
        const y = 24 + i * 28;
        return (
          <g key={i}>
            <rect
              x={340}
              y={y - 12}
              width={14}
              height={14}
              rx={3}
              fill={s.color}
            />
            <text
              x={364}
              y={y}
              fontSize={14}
              fontWeight={600}
              fill={GRAY_900}
            >
              {s.label}
            </text>
            <text
              x={700}
              y={y}
              textAnchor="end"
              fontSize={14}
              fontWeight={700}
              fill={MINT_700}
            >
              {s.value}
              {unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
