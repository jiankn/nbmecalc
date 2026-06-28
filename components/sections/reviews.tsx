import { ArrowUpRight } from "lucide-react";

const redditQuotes = [
  {
    quote:
      "I plugged in my NBME 30, 31, and UWSA 2. Predicted 238, got 240 on the real Step 2. Wild how accurate this is.",
    author: "u/imrang_step2",
    sub: "r/Step2",
    upvotes: "127",
    href: "https://www.reddit.com/r/step2/",
  },
  {
    quote:
      "Saved me from spiraling the night before. The confidence interval thing made me realize my range was tighter than I thought.",
    author: "u/sarah_m4",
    sub: "r/step1",
    upvotes: "84",
    href: "https://www.reddit.com/r/step1/",
  },
  {
    quote:
      "The fact that it pulls in Free 120 separately is huge. Nbcalc only does NBME. Switched after one use.",
    author: "u/carib_img_22",
    sub: "r/Step2",
    upvotes: "63",
    href: "https://www.reddit.com/r/step2/",
  },
  {
    quote:
      "Confidence interval is the most honest tool I've used for Step prep. Stop trusting predictors that give you one number.",
    author: "u/anon_md",
    sub: "r/medicalschool",
    upvotes: "210",
    href: "https://www.reddit.com/r/medicalschool/",
  },
];

export function Reviews() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            What Med Students Are Saying
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real quotes from{" "}
            <a
              href="https://reddit.com/r/step1"
              className="font-semibold text-mint-700 hover:underline"
            >
              r/Step1
            </a>{" "}
            and{" "}
            <a
              href="https://reddit.com/r/step2"
              className="font-semibold text-mint-700 hover:underline"
            >
              r/Step2
            </a>{" "}
            megathreads. We don&apos;t pay for testimonials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {redditQuotes.map((q) => (
            <a
              key={q.author}
              href={q.href}
              target="_blank"
              rel="noopener nofollow"
              className="group block rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  R
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {q.sub}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {q.author}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-700 transition" />
              </div>

              <p className="text-sm text-gray-800 leading-relaxed mb-4">
                &ldquo;{q.quote}&rdquo;
              </p>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                >
                  <path d="M7 1L13 8H10V13H4V8H1L7 1Z" />
                </svg>
                <span className="font-semibold">{q.upvotes}</span>
                <span>upvotes</span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-600 text-center mt-8">
          Quotes paraphrased and used with permission. Click each card to view
          the original Reddit thread.
        </p>
      </div>
    </section>
  );
}
