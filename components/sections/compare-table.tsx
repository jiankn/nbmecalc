import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = "yes" | "no" | "partial";

export interface CompareRow {
  feature: string;
  values: Cell[];
}

function CellIcon({ cell }: { cell: Cell }) {
  if (cell === "yes")
    return <Check className="h-5 w-5 text-mint-600 mx-auto" strokeWidth={3} />;
  if (cell === "no")
    return <X className="h-5 w-5 text-gray-300 mx-auto" />;
  return <Minus className="h-5 w-5 text-amber-500 mx-auto" />;
}

export function CompareTable({
  competitors,
  rows,
}: {
  competitors: string[];
  rows: CompareRow[];
}) {
  return (
    <>
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
                    "p-5 text-center font-bold",
                    i === 0 ? "bg-mint-50 text-mint-800" : "text-gray-700"
                  )}
                >
                  {name}
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
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
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
            <div className="font-bold text-lg mb-3">{name}</div>
            <ul className="space-y-2 text-sm">
              {rows.map((row) => (
                <li
                  key={row.feature}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-gray-700">{row.feature}</span>
                  <CellIcon cell={row.values[i]} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
