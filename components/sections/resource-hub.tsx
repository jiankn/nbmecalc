import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const featured = [
  {
    title: "NBME Score Conversion: The Complete 2026 Guide",
    excerpt:
      "Convert Step 2 CK CCSSA scores or estimate Step 1 pass probability from the matching NBME assessment family.",
    href: "/blog/nbme-score-conversion-guide",
    date: "MAY 17, 2026",
    readTime: "8 MIN READ",
    placeholder: "/placeholders/blog-cover-nbme.jpg",
    promptKey: "blog-cover-nbme",
  },
  {
    title: "How to Read a Confidence Interval (For Med Students)",
    excerpt:
      "Why one number isn't enough — and how to use a 95% CI to plan your final 2 weeks of prep.",
    href: "/blog/confidence-interval-guide",
    date: "MAY 10, 2026",
    readTime: "5 MIN READ",
    placeholder: "/placeholders/blog-cover-ci.jpg",
    promptKey: "blog-cover-ci",
  },
  {
    title: "UWSA vs NBME: Which Predicts Step Better?",
    excerpt:
      "We compared UWSA and NBME self-reports from r/Step1 and r/Step2 to see which tracks Step scores better. Results inside.",
    href: "/blog/uwsa-vs-nbme",
    date: "MAY 5, 2026",
    readTime: "6 MIN READ",
    placeholder: "/placeholders/blog-cover-cram.jpg",
    promptKey: "blog-cover-cram",
  },
];

export function ResourceHub() {
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
              key={post.href}
              href={post.href}
              className="group block rounded-3xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-mint-100 to-blue-50 relative overflow-hidden">
                <Image
                  src={`/images/${post.promptKey}.jpg`}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-mint-700 transition">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {post.excerpt}
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
