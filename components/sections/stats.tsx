"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 1247,
    suffix: "",
    label: "Historical Step Takers",
    sub: "Real NBME → Step pairs in our dataset",
  },
  {
    value: 10,
    prefix: "±",
    suffix: " pts",
    label: "Median Prediction Error",
    sub: "Based on holdout validation",
  },
  {
    value: 487,
    suffix: "",
    label: "Predictions This Month",
    sub: "And growing every day",
  },
];

export function Stats() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Built on Real Data, Validated Daily
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            We started small and we&apos;ll always be honest about it. Our
            dataset grows every day from anonymous user reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((s) => (
            <CountStat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CountStat({
  value,
  prefix = "",
  suffix = "",
  label,
  sub,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!ref.current || hasRun) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasRun) {
            setHasRun(true);
            const duration = 1200;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setN(Math.round(eased * value));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, hasRun]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl lg:text-6xl font-extrabold tabular-nums tracking-tight mb-2">
        {prefix}
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="text-base font-bold mb-1">{label}</div>
      <div className="text-sm text-gray-500">{sub}</div>
    </div>
  );
}
