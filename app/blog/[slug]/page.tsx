import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Tag, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { BlogBody } from "@/components/blog-body";
import {
  BLOG_POSTS,
  CATEGORY_LABELS,
  getPost,
  getRelatedPosts,
} from "@/lib/blog/posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | NBMEcalc Blog`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `https://nbmecalc.com/blog/${post.slug}` },
    // Drafts (noindex) stay reachable from internal links but are hidden
    // from Google search results until they meet the full E-E-A-T bar
    // (medical reviewer sign-off, original data, infographics).
    robots: post.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://nbmecalc.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: "/images/feature-score-range.png",
          width: 2400,
          height: 1792,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const p = post!;
  const related = getRelatedPosts(p.slug, 3);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.description,
            url: `https://nbmecalc.com/blog/${p.slug}`,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt ?? p.publishedAt,
            author: {
              "@type": "Person",
              name: p.author,
            },
            publisher: {
              "@type": "Organization",
              name: "NBMEcalc",
              url: "https://nbmecalc.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://nbmecalc.com/blog/${p.slug}`,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://nbmecalc.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://nbmecalc.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: p.title,
                item: `https://nbmecalc.com/blog/${p.slug}`,
              },
            ],
          }),
        }}
      />

      <article>
        {/* Header */}
        <section className="bg-mint-50/40 border-b border-gray-200 py-12 lg:py-20">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-3 text-sm font-semibold text-mint-700 mb-4">
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/blog/category/${p.category}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Tag className="h-3 w-3" />
                {CATEGORY_LABELS[p.category]}
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-gray-950 mb-4">
              {p.title}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
              {p.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{p.author}</span>
              <span>·</span>
              <time dateTime={p.publishedAt}>
                {new Date(p.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {p.readingTime} min read
              </span>
              {p.updatedAt && p.updatedAt !== p.publishedAt && (
                <span className="text-xs text-gray-500">
                  Updated{" "}
                  {new Date(p.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container max-w-3xl">
            <BlogBody blocks={p.body} />

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-mint-50/40">
          <div className="container max-w-3xl text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-3">
              Ready to predict your Step score?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Free, no signup. Multi-source aggregation, 95% confidence
              interval, and a personalized study plan.
            </p>
            <Button size="lg" asChild>
              <Link href="/#calculator">Run the calculator</Link>
            </Button>
          </div>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="py-16 bg-white border-t border-gray-200">
            <div className="container max-w-4xl">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
                Related articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400 hover:shadow-md transition"
                  >
                    <div className="text-xs font-semibold text-mint-700 uppercase tracking-wider mb-2">
                      {CATEGORY_LABELS[r.category]}
                    </div>
                    <h3 className="font-bold text-gray-950 mb-2 group-hover:text-mint-700 transition">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {r.description}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-mint-700">
                      Read
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PageShell>
  );
}
