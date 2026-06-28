import Link from "next/link";
import { BookOpenCheck, History, MessageSquareWarning } from "lucide-react";

const reviewers = [
  {
    title: "Official-source checks",
    body: "Assessment families, score-report guidance, and passing standards are checked against current NBME and USMLE pages.",
    icon: BookOpenCheck,
  },
  {
    title: "Versioned model changes",
    body: "Material assumption changes are documented publicly. Stored predictions keep their algorithm version.",
    icon: History,
  },
  {
    title: "Corrections welcome",
    body: "Readers can report factual or calculation concerns. Unsupported claims are corrected or removed rather than defended.",
    icon: MessageSquareWarning,
  },
];

export function Reviewers() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-mint-50 px-4 py-1.5 text-sm font-semibold text-mint-800 mb-4">
            <BookOpenCheck className="h-4 w-4" />
            Editorial controls
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Evidence and Review Status
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            NBMEcalc currently uses an internal editorial process. We do not
            claim named physician review until reviewer identities and scope
            can be verified publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviewers.map((r) => (
            <article
              key={r.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 hover:shadow-lg transition"
            >
              <div className="h-12 w-12 rounded-2xl bg-mint-100 flex items-center justify-center mb-4">
                <r.icon className="h-6 w-6 text-mint-700" />
              </div>
              <h3 className="font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {r.body}
              </p>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 max-w-2xl mx-auto">
          Read the{" "}
          <Link href="/methodology" className="font-semibold text-mint-700 underline">
            public methodology and changelog
          </Link>{" "}
          or <Link href="/contact" className="font-semibold text-mint-700 underline">submit a correction</Link>.
        </p>
      </div>
    </section>
  );
}
