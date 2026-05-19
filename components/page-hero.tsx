import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function PageHero({
  badge,
  title,
  description,
  align = "center",
  size = "md",
  children,
}: PageHeroProps) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div
        className={cn(
          "container max-w-4xl",
          size === "sm" && "py-12 lg:py-16",
          size === "md" && "py-16 lg:py-24",
          size === "lg" && "py-20 lg:py-28",
          align === "center" && "text-center"
        )}
      >
        {badge && (
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-mint-800 mb-5",
              align === "center" && "mx-auto"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
            {badge}
          </div>
        )}

        <h1
          className={cn(
            "font-extrabold tracking-tight text-balance text-gray-950",
            size === "sm" && "text-3xl lg:text-4xl",
            size === "md" && "text-4xl lg:text-5xl",
            size === "lg" && "text-5xl lg:text-6xl"
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "text-lg lg:text-xl text-gray-600 leading-relaxed mt-5",
              align === "center" && "max-w-2xl mx-auto"
            )}
          >
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
