import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Tag } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import {
  CATEGORY_LABELS,
  getPostsByCategory,
  type BlogCategory,
} from "@/lib/blog/posts";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as BlogCategory[];

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!CATEGORIES.includes(slug as BlogCategory)) return {};
  const label = CATEGORY_LABELS[slug as BlogCategory];

  return {
    title: `${label} — USMLE Blog | NBMEcalc`,
    description: `Articles on ${label.toLowerCase()} for USMLE Step prep. Evidence-based, reviewed by practicing physicians.`,
    alternates: { canonical: `https://nbmecalc.com/blog/category/${slug}` },
    openGraph: {
      title: `${label} — USMLE Blog`,
      description: `Articles on ${label.toLowerCase()} for USMLE Step prep.`,
      url: `https://nbmecalc.com/blog/category/${slug}`,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CATEGORIES.includes(slug as BlogCategory)) notFound();
  const category = slug as BlogCategory;
  const label = CATEGORY_LABELS[category];
  const posts = getPostsByCategory(category);

  return (
    <PageShell>
      <PageHero
        badge="USMLE blog"
        title={label}
        description={`Articles on ${label.toLowerCase()} for USMLE Step prep. Evidence-based, reviewed by practicing physicians.`}
        size="md"
      />

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 mr-2">
              Categories:
            </span>
            <Link
              href="/blog"
              className="rounded-full bg-white border border-gray-200 text-gray-700 px-4 py-1.5 text-sm font-semibold hover:border-mint-400 hover:bg-mint-50 transition"
            >
              All
            </Link>
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <Link
                  key={c}
                  href={`/blog/category/${c}`}
                  className={
                    active
                      ? "rounded-full bg-mint-100 text-mint-800 px-4 py-1.5 text-sm font-semibold"
                      : "rounded-full bg-white border border-gray-200 text-gray-700 px-4 py-1.5 text-sm font-semibold hover:border-mint-400 hover:bg-mint-50 transition"
                  }
                >
                  {CATEGORY_LABELS[c]}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="mb-4">No articles in this category yet.</p>
              <Link href="/blog" className="text-mint-700 font-semibold underline">
                Browse all articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-mint-400 hover:shadow-lg transition"
                >
                  <div className="relative aspect-[1200/630] bg-mint-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/blog/og/${post.slug}`}
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
          )}
        </div>
      </section>
    </PageShell>
  );
}
