/**
 * Renders a BlogPost's body blocks into Tailwind-styled markup.
 * Server component (no client hooks). Pure transformation.
 */
import type { BlogBlock } from "@/lib/blog/posts";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

const TONE_STYLES: Record<
  "info" | "warning" | "success",
  { container: string; icon: React.ReactNode }
> = {
  info: {
    container: "bg-mint-50 border-mint-200 text-gray-800",
    icon: <Info className="h-5 w-5 text-mint-700 shrink-0 mt-0.5" />,
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    icon: <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />,
  },
  success: {
    container: "bg-mint-50 border-mint-300 text-gray-900",
    icon: <CheckCircle2 className="h-5 w-5 text-mint-700 shrink-0 mt-0.5" />,
  },
};

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-gray-700 leading-relaxed my-5">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-950 mt-12 mb-4"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="text-xl font-bold text-gray-950 mt-8 mb-3"
              >
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="list-disc pl-6 space-y-2 my-5 text-gray-700"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="list-decimal pl-6 space-y-2 my-5 text-gray-700"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-mint-500 pl-5 my-6 italic text-gray-700"
              >
                <p className="mb-1">{block.text}</p>
                {block.attr && (
                  <cite className="not-italic text-sm text-gray-500">
                    — {block.attr}
                  </cite>
                )}
              </blockquote>
            );
          case "callout": {
            const style = TONE_STYLES[block.tone];
            return (
              <div
                key={i}
                className={`my-6 rounded-2xl border p-5 flex gap-3 ${style.container}`}
              >
                {style.icon}
                <p className="leading-relaxed">{block.text}</p>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
