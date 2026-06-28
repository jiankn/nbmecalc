import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { getAllPostsSorted, CATEGORY_LABELS, type BlogCategory } from "@/lib/blog/posts";
import { getBlogSummaryImage } from "@/lib/blog/images";
import { Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "USMLE Blog — Score Conversion, Study Plans, and Tips | NBMEcalc",
  description:
    "Free, evidence-based articles on USMLE Step 1, Step 2 CK, and Step 3 preparation. NBME score interpretation, study plans, and high-yield tips.",
  alternates: { canonical: "https://nbmecalc.com/blog" },
  openGraph: {
    title: "USMLE Blog — Score Conversion, Study Plans, and Tips",
    description:
      "Free articles on USMLE Step prep, NBME score interpretation, and study plans.",
    url: "https://nbmecalc.com/blog",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc Blog",
      },
    ],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();
  const categories = Object.entries(CATEGORY_LABELS) as Array<
    [BlogCategory, string]
  >;

  return (
    <PageShell>
      <PageHero
        badge="USMLE blog"
        title="USMLE Prep Articles"
        description="Free, evidence-based writing on Step 1, Step 2 CK, Step 3, NBME score interpretation, and study planning. Reviewed by practicing physicians."
        size="md"
      />

      {/* Category filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 mr-2">
              Categories:
            </span>
            <Link
              href="/blog"
              className="rounded-full bg-mint-100 text-mint-800 px-4 py-1.5 text-sm font-semibold"
            >
              All
            </Link>
            {categories.map(([slug, label]) => (
              <Link
                key={slug}
                href={`/blog/category/${slug}`}
                className="rounded-full bg-white border border-gray-200 text-gray-700 px-4 py-1.5 text-sm font-semibold hover:border-mint-400 hover:bg-mint-50 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Post grid with cover thumbnails */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-6xl">
          {posts.length === 0 ? (
            <p className="text-center text-gray-600">No articles yet.</p>
          ) : (
            <>
              {/* Featured post — large card spanning two columns */}
              {posts[0] && (
                <Link
                  href={`/blog/${posts[0].slug}`}
                  className="block rounded-3xl bg-white border border-gray-200 overflow-hidden hover:border-mint-400 hover:shadow-xl transition group mb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[1200/630] lg:aspect-auto bg-mint-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getBlogSummaryImage(posts[0].slug)}
                        alt={posts[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="eager"
                      />
                    </div>
                    <div className="p-6 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs font-semibold text-mint-700 uppercase tracking-wider mb-3">
                        <Tag className="h-3 w-3" />
                        {CATEGORY_LABELS[posts[0].category]}
                        <span className="ml-2 rounded-full bg-mint-500 text-white px-2 py-0.5 text-[10px]">
                          Featured
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-gray-950 mb-3 group-hover:text-mint-700 transition text-balance">
                        {posts[0].title}
                      </h2>
                      <p className="text-gray-600 mb-5 leading-relaxed">
                        {posts[0].description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {posts[0].author}
                        </span>
                        <span>·</span>
                        <time dateTime={posts[0].publishedAt}>
                          {new Date(posts[0].publishedAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {posts[0].readingTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Standard grid of remaining posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-mint-400 hover:shadow-lg transition"
                  >
                    <div className="relative aspect-[1200/630] bg-mint-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getBlogSummaryImage(post.slug)}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-mint-700 uppercase tracking-wider mb-2">
                        <Tag className="h-3 w-3" />
                        {CATEGORY_LABELS[post.category]}
                      </div>
                      <h3 className="text-lg font-bold leading-snug text-gray-950 group-hover:text-mint-700 transition mb-2 text-balance">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">
                          {post.author}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
