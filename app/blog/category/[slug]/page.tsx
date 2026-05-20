import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
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
        <div className="container max-w-4xl">
          {posts.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="mb-4">No articles in this category yet.</p>
              <Link href="/blog" className="text-mint-700 font-semibold underline">
                Browse all articles
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-3xl bg-white border border-gray-200 p-6 lg:p-8 hover:border-mint-400 hover:shadow-lg transition group"
                  >
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
