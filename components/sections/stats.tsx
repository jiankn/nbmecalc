const stats = [
  {
    value: 3,
    suffix: "",
    label: "Step Exams Supported",
    sub: "Step 1, Step 2 CK, and Step 3",
  },
  {
    value: 6,
    suffix: "",
    label: "Input Source Types",
    sub: "NBME, UWSA 1/2, Free 120, AMBOSS, and CMS",
  },
  {
    value: 1,
    suffix: "",
    label: "Public Methodology",
    sub: "Versioned assumptions and validation status",
  },
];

export function Stats() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Transparent About What the Model Can Do
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            The calculator exposes its assumptions and uncertainty. We do not
            claim a validated cohort until a reproducible dataset and holdout
            report are published.
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
  return (
    <div className="text-center">
      <div className="text-5xl lg:text-6xl font-extrabold tabular-nums tracking-tight mb-2">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="text-base font-bold mb-1">{label}</div>
      <div className="text-sm text-gray-500">{sub}</div>
    </div>
  );
}
