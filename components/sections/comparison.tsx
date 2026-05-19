import Link from "next/link";
import { Check, X, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Cell = "yes" | "no" | "partial";

const competitors = ["NBMEcalc", "PredictMyStepScore", "AMBOSS", "NBcalc"];

const rows: { feature: string; values: Cell[] }[] = [
  { feature: "NBME forms (28-32)",   values: ["yes",  "yes",  "yes",  "yes"] },
  { feature: "UWSA 1 & 2",           values: ["yes",  "yes",  "no",   "yes"] },
  { feature: "Free 120",             values: ["yes",  "no",   "yes",  "no"] },
  { feature: "AMBOSS Score Pred.",   values: ["yes",  "no",   "yes",  "no"] },
  { feature: "CMS practice forms",   values: ["yes",  "no",   "no",   "no"] },
  { feature: "95% confidence interval", values: ["yes", "no", "no",   "no"] },
  { feature: "Personalized study plan", values: ["yes", "no", "no",   "no"] },
  { feature: "Downloadable PDF report", values: ["yes", "no", "no",   "no"] },
  { feature: "Mobile (PWA)",            values: ["yes", "partial", "partial", "no"] },
  { feature: "Free to use",             values: ["yes", "yes", "partial", "yes"] },
];

function CellIcon({ cell }: { cell: Cell }) {
  if (cell === "yes")
    return <Check className="h-5 w-5 text-mint-600 mx-auto" strokeWidth={3} />;
  if (cell === "no")
    return <X className="h-5 w-5 text-gray-300 mx-auto" />;
  return <Minus className="h-5 w-5 text-yellow-500 mx-auto" />;
}

export function Comparison() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Why NBMEcalc Is the Most Complete Predictor
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We compared the four most popular USMLE Step predictors. Here&apos;s
            how NBMEcalc stacks up on the features med students actually need.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {competitors.map((name, i) => (
                  <th
                    key={name}
                    className={cn(
                      "p-5 text-center",
                      i === 0 && "bg-mint-50"
                    )}
                  >
                    <div
                      className={cn(
                        "font-bold",
                        i === 0 ? "text-mint-800" : "text-gray-700"
                      )}
                    >
                      {name}
                    </div>
                    {i === 0 && (
                      <Badge variant="mint" className="mt-2 inline-flex">
                        <Sparkles className="h-3 w-3 mr-1" /> Recommended
                      </Badge>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.feature}
                  className={cn(
                    "border-b border-gray-100 last:border-0",
                    idx % 2 === 1 && "bg-gray-50/40"
                  )}
                >
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {row.feature}
                  </td>
                  {row.values.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        "p-4 text-center",
                        i === 0 && "bg-mint-50/50"
                      )}
                    >
                      <CellIcon cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5"></td>
                <td className="p-5 bg-mint-50">
                  <Button size="md" className="w-full" asChild>
                    <Link href="#calculator">Try Free →</Link>
                  </Button>
                </td>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-6">
          {competitors.map((name, i) => (
            <div
              key={name}
              className={cn(
                "rounded-2xl border p-5",
                i === 0
                  ? "border-mint-300 bg-mint-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-lg">{name}</div>
                {i === 0 && <Badge variant="mint">Recommended</Badge>}
              </div>
              <ul className="space-y-2 text-sm">
                {rows.map((row) => (
                  <li
                    key={row.feature}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">{row.feature}</span>
                    <CellIcon cell={row.values[i]} />
                  </li>
                ))}
              </ul>
              {i === 0 && (
                <Button size="md" className="w-full mt-4" asChild>
                  <Link href="#calculator">Try NBMEcalc Free →</Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Comparison based on public information from each tool&apos;s landing
          page as of May 2026. Brand names are property of their respective
          owners.
        </p>
      </div>
    </section>
  );
}
