import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { getAllPostsSorted, CATEGORY_LABELS, type BlogCategory } from "@/lib/blog/posts";
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

      {/* Post list */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-4xl">
          {posts.length === 0 ? (
            <p className="text-center text-gray-600">No articles yet.</p>
          ) : (
            <ul className="space-y-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-3xl bg-white border border-gray-200 p-6 lg:p-8 hover:border-mint-400 hover:shadow-lg transition group"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-mint-700 uppercase tracking-wider mb-3">
                      <Tag className="h-3 w-3" />
                      {CATEGORY_LABELS[post.category]}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-950 mb-3 group-hover:text-mint-700 transition">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>·</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}
