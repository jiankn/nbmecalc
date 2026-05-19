import { cn } from "@/lib/utils";

interface IPhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
  /** Slight tilt for visual interest */
  tilt?: boolean;
}

/**
 * iPhone 17 Pro style mockup frame.
 * Pure CSS — no images required.
 * Inner content area: 320×680 (3:6.5 ratio approx).
 */
export function IPhoneMockup({
  className,
  children,
  tilt = false,
}: IPhoneMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto",
        tilt && "rotate-[-2deg]",
        className
      )}
      style={{ width: 360, maxWidth: "100%" }}
    >
      {/* Outer titanium frame */}
      <div
        className="relative rounded-[60px] p-[3px] shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, #c8c8c9 0%, #8a8a8d 30%, #5d5d60 60%, #2a2a2c 100%)",
        }}
      >
        {/* Inner bezel */}
        <div className="rounded-[57px] p-[10px] bg-black">
          {/* Screen */}
          <div
            className="relative overflow-hidden rounded-[47px] bg-white"
            style={{ aspectRatio: "9 / 19.5" }}
          >
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 z-20 flex items-center justify-center">
              <div className="dynamic-island h-[34px] w-[120px]" />
            </div>

            {/* Status bar (time + icons) */}
            <div className="absolute left-0 right-0 top-3 z-10 flex items-center justify-between px-8 text-[12px] font-semibold text-black">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                {/* Signal */}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                  <rect x="0" y="6" width="3" height="4" rx="0.5" />
                  <rect x="4" y="4" width="3" height="6" rx="0.5" />
                  <rect x="8" y="2" width="3" height="8" rx="0.5" />
                  <rect x="12" y="0" width="3" height="10" rx="0.5" />
                </svg>
                {/* Wifi */}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                  <path d="M7 2 C9 2 11 3 13 5 L11 7 C9 5 7 5 7 5 C7 5 5 5 3 7 L1 5 C3 3 5 2 7 2 Z" />
                </svg>
                {/* Battery */}
                <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor">
                  <rect x="0" y="0" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                  <rect x="2" y="2" width="12" height="6" rx="1" fill="currentColor" />
                  <rect x="19" y="3" width="2" height="4" rx="0.5" />
                </svg>
              </span>
            </div>

            {/* Content */}
            <div className="absolute inset-0 pt-12 pb-2">{children}</div>
          </div>
        </div>
      </div>

      {/* Side buttons (decorative) */}
      <div
        className="absolute left-[-3px] top-[100px] h-7 w-[3px] rounded-l-md"
        style={{ background: "#5d5d60" }}
      />
      <div
        className="absolute left-[-3px] top-[140px] h-12 w-[3px] rounded-l-md"
        style={{ background: "#5d5d60" }}
      />
      <div
        className="absolute left-[-3px] top-[200px] h-12 w-[3px] rounded-l-md"
        style={{ background: "#5d5d60" }}
      />
      <div
        className="absolute right-[-3px] top-[170px] h-20 w-[3px] rounded-r-md"
        style={{ background: "#5d5d60" }}
      />
    </div>
  );
}
