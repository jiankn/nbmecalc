import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleDashed, Database, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "NBMEcalc Validation Status, Metrics & Data Policy",
  description:
    "Public validation status for the NBMEcalc USMLE score model: current evidence limits, outcome collection, planned metrics, inclusion rules, and versioning.",
  alternates: { canonical: "https://nbmecalc.com/validation" },
};

const plannedMetrics = [
  {
    metric: "Mean and median absolute error",
    reason: "Shows the typical distance between a prediction and the real score.",
  },
  {
    metric: "Planning-range coverage",
    reason: "Shows how often the real score falls inside the displayed range.",
  },
  {
    metric: "Pass-risk calibration",
    reason: "Compares experimental pass estimates with observed pass/fail outcomes.",
  },
  {
    metric: "Source and recency subgroups",
    reason: "Tests whether performance changes by input mix or assessment age.",
  },
];

export default function ValidationPage() {
  return (
    <PageShell>
      <PageHero
        badge="Evidence status · August 7, 2026"
        title="NBMEcalc Validation Status"
        description="The current model is an independent planning heuristic. A reproducible outcome cohort and holdout report have not yet been published, so NBMEcalc does not claim a verified error rate, calibrated 95% interval, or clinical decision accuracy."
        size="md"
      />

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="container max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatusCard
              icon={CheckCircle2}
              title="Published now"
              items={[
                "Model version and source assumptions",
                "Input weighting and range rules",
                "Outcome inclusion and privacy policy",
                "Machine-readable validation status",
              ]}
              tone="mint"
            />
            <StatusCard
              icon={CircleDashed}
              title="Not yet published"
              items={[
                "Auditable de-identified outcome cohort",
                "Locked holdout evaluation",
                "Verified range-coverage percentage",
                "Subgroup performance estimates",
              ]}
              tone="amber"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <strong>Current published validation cohort: 0.</strong> Submitted
            outcomes are not promoted into a public metric until the dataset is
            large enough to report with clear inclusion rules and without
            exposing an individual student.
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-16">
        <div className="container max-w-4xl">
          <div className="mb-8 flex items-start gap-3">
            <Database className="mt-1 h-6 w-6 text-mint-700" />
            <div>
              <h2 className="text-3xl font-extrabold">Outcome collection protocol</h2>
              <p className="mt-2 text-gray-600">
                Free and paid users can explicitly opt in after calculating.
                The reminder is sent around the estimated score-release date.
              </p>
            </div>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Consent", "A user supplies an email and exam date specifically for one outcome reminder."],
              ["2", "Outcome", "The user may report an exact score or a pass/fail band after release."],
              ["3", "Evaluation", "Eligible records are deduplicated, versioned, aggregated, and separated from model development before publication."],
            ].map(([number, title, body]) => (
              <li key={number} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-mint-100 font-extrabold text-mint-800">
                  {number}
                </div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-extrabold">Metrics required before accuracy claims</h2>
          <p className="mt-3 max-w-3xl text-gray-600">
            A future report must state the model version, sample dates, cohort
            size, missing-data handling, exclusions, and uncertainty around
            every metric—not just the best headline number.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-bold">Required metric</th>
                  <th className="px-5 py-3 font-bold">Why it matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plannedMetrics.map((item) => (
                  <tr key={item.metric}>
                    <td className="px-5 py-4 font-semibold">{item.metric}</td>
                    <td className="px-5 py-4 text-gray-600">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-mint-50/40 py-16">
        <div className="container max-w-4xl">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-mint-700" />
            <div>
              <h2 className="text-3xl font-extrabold">Reproducibility and privacy</h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                A public release will contain only de-identified, aggregated
                records that meet the stated inclusion criteria. Email, IP,
                free-text notes, and score-report links will not be included.
                Model changes will be evaluated against a locked holdout before
                replacing the current production version.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <Link href="/methodology" className="text-mint-800 underline underline-offset-4">
                  Read the methodology
                </Link>
                <a href="/validation-status.json" className="text-mint-800 underline underline-offset-4">
                  Download machine-readable status
                </a>
                <Link href="/privacy" className="text-mint-800 underline underline-offset-4">
                  Read the privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StatusCard({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: typeof CheckCircle2;
  title: string;
  items: string[];
  tone: "mint" | "amber";
}) {
  return (
    <article className="rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <Icon className={tone === "mint" ? "h-5 w-5 text-mint-700" : "h-5 w-5 text-amber-700"} />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  );
}
