import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  width?: number;
  height?: number;
}

export function Logo({
  className,
  variant = "default",
  width = 200,
  height = 44,
}: LogoProps) {
  const textColor = variant === "white" ? "#FFFFFF" : "#0F172A";
  const bgFill = variant === "white" ? "#FFFFFF" : "#0F172A";
  const curveFill = "#34D399";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 44"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NBMEcalc"
      className={cn("select-none", className)}
    >
      {/* Rounded square icon */}
      <rect x={2} y={2} width={40} height={40} rx={12} fill={bgFill} />
      {/* N formed by bell curve strokes */}
      <path
        d="M 13 32 L 13 12 C 13 12, 22 32, 31 12 L 31 32"
        stroke={curveFill}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent dot at peak */}
      <circle cx={22} cy={8} r={2.5} fill={curveFill} />
      {/* Wordmark */}
      <text
        x={52}
        y={30}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
        fontSize={22}
        fontWeight={800}
        letterSpacing="-0.3"
        fill={textColor}
      >
        NBMEcalc
      </text>
    </svg>
  );
}

export function LogoMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x={2} y={2} width={40} height={40} rx={12} fill="#0F172A" />
      <path
        d="M 13 32 L 13 12 C 13 12, 22 32, 31 12 L 31 32"
        stroke="#34D399"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={22} cy={8} r={2.5} fill="#34D399" />
    </svg>
  );
}
