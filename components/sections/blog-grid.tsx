import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    title: "How to Cram from a Low NBME 25 in 5 Days",
    excerpt:
      "A targeted approach used by 12 students who improved 15+ points in their final week.",
    href: "/blog/cram-from-nbme-25",
    date: "MAY 17, 2026",
    bg: "from-blue-100 to-blue-200",
    image: "blog-cram",
  },
  {
    title: "The 7 Most Tested Topics on Step 2 CK in 2026",
    excerpt:
      "Based on community recall from 800+ test-takers in the past 90 days.",
    href: "/blog/most-tested-step-2-topics",
    date: "MAY 12, 2026",
    bg: "from-mint-100 to-mint-200",
    image: "blog-most-tested",
  },
  {
    title: "Why Your NBME Average Lies (And What to Use Instead)",
    excerpt:
      "Why a simple average across NBMEs is misleading — and how to weight by recency.",
    href: "/blog/nbme-average-lies",
    date: "MAY 10, 2026",
    bg: "from-yellow-100 to-yellow-200",
    image: "blog-average-lies",
  },
  {
    title: "Cheapest Step 2 Question Banks in 2026",
    excerpt:
      "UWorld vs AMBOSS vs Kaplan vs USMLE-Rx — pricing, value, and free trials compared.",
    href: "/blog/cheapest-step-qbanks",
    date: "MAY 8, 2026",
    bg: "from-purple-100 to-purple-200",
    image: "blog-qbanks",
  },
  {
    title: "Free 120 vs Real Step 2 — Honest Difficulty Comparison",
    excerpt:
      "Real test-takers tell us what surprised them on test day vs the free official material.",
    href: "/blog/free-120-vs-real",
    date: "MAY 5, 2026",
    bg: "from-rose-100 to-rose-200",
    image: "blog-free-120",
  },
  {
    title: "What to Do the Night Before Step 2 CK",
    excerpt:
      "The science (and superstition) behind exam-eve routines that work.",
    href: "/blog/night-before-step-2",
    date: "MAY 1, 2026",
    bg: "from-orange-100 to-orange-200",
    image: "blog-night-before",
  },
];

export function BlogGrid() {
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
              key={p.href}
              href={p.href}
              className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.bg} overflow-hidden`}>
                <Image
                  src={`/images/${p.image}.jpg`}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {p.date}
                </div>
                <h3 className="text-base font-bold leading-snug group-hover:text-mint-700 transition mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {p.excerpt}
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
