import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function OptionalUpgrades() {
  return (
    <section className="border-t border-gray-200 bg-gray-50 py-10 lg:py-12">
      <div className="container flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-xl font-extrabold text-gray-950 sm:text-2xl">
            The calculator stays free
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
            Optional upgrades add downloadable reports, saved history, and
            long-term Step tracking. You do not need a plan to calculate your
            score and review its planning range.
          </p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-bold text-mint-800 underline decoration-mint-300 underline-offset-4 transition hover:text-mint-900 sm:self-auto"
        >
          See optional upgrades
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
