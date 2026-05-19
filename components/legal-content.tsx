import { cn } from "@/lib/utils";

/**
 * Wrapper for long-form legal/policy content.
 * Provides consistent typography without requiring @tailwindcss/typography.
 */
export function LegalContent({
  children,
  lastUpdated,
  className,
}: {
  children: React.ReactNode;
  lastUpdated?: string;
  className?: string;
}) {
  return (
    <section className={cn("py-12 lg:py-20 bg-white", className)}>
      <div className="container max-w-3xl">
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-8">
            <strong>Last updated:</strong> {lastUpdated}
          </p>
        )}
        <article
          className={cn(
            "text-gray-700 leading-relaxed",
            // headings
            "[&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-gray-950 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight",
            "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-3",
            "[&_h4]:text-base [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mt-6 [&_h4]:mb-2",
            // paragraph & text
            "[&_p]:text-base [&_p]:my-4",
            "[&_strong]:font-semibold [&_strong]:text-gray-900",
            // lists
            "[&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2",
            "[&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2",
            "[&_li]:text-base",
            // links
            "[&_a]:text-mint-700 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-mint-800",
            // code & quotes
            "[&_code]:font-mono [&_code]:text-sm [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-mint-300 [&_blockquote]:bg-mint-50 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:text-gray-700",
            // hr
            "[&_hr]:my-8 [&_hr]:border-gray-200"
          )}
        >
          {children}
        </article>
      </div>
    </section>
  );
}
