import Link from "next/link";
import { BookOpenCheck, Calculator, FileWarning, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

const checks = [
  {
    icon: Calculator,
    title: "Compatible inputs",
    body: "Combine supported NBME, UWSA, Free 120, AMBOSS, and CMS results while keeping each assessment family distinct.",
  },
  {
    icon: ListChecks,
    title: "A range, not a promise",
    body: "The free result includes a midpoint and model-generated planning range. It is not a verified 95% interval or an official score report.",
  },
  {
    icon: BookOpenCheck,
    title: "Public assumptions",
    body: "Source adjustments, recency weighting, known limits, and material corrections are documented in the public methodology.",
  },
  {
    icon: FileWarning,
    title: "A clear decision boundary",
    body: "High-stakes scheduling decisions should be checked against official assessment feedback and your school or advisor's process.",
  },
];

export function Comparison() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28">
      <div className="container max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint-800">
            Before you rely on a predictor
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Check the Evidence, Not a Winner Badge
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Predictor feature lists change and do not establish accuracy. These
            are the four checks NBMEcalc exposes so you can judge the result on
            its evidence and limitations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {checks.map((check) => (
            <article
              key={check.title}
              className="rounded-3xl border border-gray-200 bg-white p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-100">
                <check.icon className="h-5 w-5 text-mint-800" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-950">
                {check.title}
              </h3>
              <p className="mt-2 leading-relaxed text-gray-700">{check.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="#calculator">Use the free calculator</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/methodology" data-indexing-context="related">
              Read methodology and limitations
            </Link>
          </Button>
          <Link
            href="/compare/best-usmle-score-predictor"
            data-indexing-context="related"
            className="px-3 py-2 text-sm font-semibold text-mint-800 underline underline-offset-4"
          >
            Comparison framework
          </Link>
        </div>
      </div>
    </section>
  );
}
