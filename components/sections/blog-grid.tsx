import Image from "next/image";
import Link from "next/link";
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

export function BlogGrid() {
  // ResourceHub features the top 3; show the remaining indexable posts here so
  // the homepage never links a post that doesn't exist and never duplicates a card.
  const posts = getAllPostsSorted().slice(3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Clear and Honest USMLE Knowledge — No Jargon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practical guides written by current med students. No filler, no
            ads, no fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-br from-mint-100 to-blue-50 overflow-hidden">
                <Image
                  src={getBlogSummaryImage(p.slug)}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {formatDate(p.publishedAt)}
                </div>
                <h3 className="text-base font-bold leading-snug group-hover:text-mint-700 transition mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black px-6 py-3 text-base font-semibold hover:bg-black hover:text-white transition"
          >
            See all guides
          </Link>
        </div>
      </div>
    </section>
  );
}
