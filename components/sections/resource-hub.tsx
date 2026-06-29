import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPostsSorted } from "@/lib/blog/posts";
import { getBlogSummaryImage } from "@/lib/blog/images";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`)).toUpperCase();
}

export function ResourceHub() {
  const featured = getAllPostsSorted().slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Your Resource for All Things USMLE
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We don&apos;t just predict — we explain assumptions, link official
            sources, and keep unreviewed drafts out of search until their
            claims can be checked.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            Ready to run your scores? Go straight to the{" "}
            <Link
              href="/step-1-predictor"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              Step 1 predictor
            </Link>{" "}
            or the{" "}
            <Link
              href="/step-2-predictor"
              className="font-semibold text-mint-700 underline underline-offset-2"
            >
              Step 2 CK predictor
            </Link>
            .
          </p>
          <p className="text-base font-semibold text-gray-900 mt-6">
            To get you started, here are our top guides:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-3xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-mint-100 to-blue-50 relative overflow-hidden">
                <Image
                  src={getBlogSummaryImage(post.slug)}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{post.readingTime} MIN READ</span>
                </div>
                <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-mint-700 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {post.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-mint-700">
                  Read more
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
