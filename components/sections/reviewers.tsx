import Image from "next/image";
import { ShieldCheck, ExternalLink } from "lucide-react";

const reviewers = [
  {
    name: "Dr. M. Chen, MD",
    role: "Internal Medicine, PGY-2",
    score: "Step 2 CK: 256",
    bio: "Reviewed our Step 2 CK conversion table and weak-subject mapping algorithm.",
    placeholder: "reviewer-1",
    bg: "from-mint-100 to-mint-200",
  },
  {
    name: "Dr. A. Okafor, MD",
    role: "Pediatrics Resident",
    score: "Step 2 CK: 261",
    bio: "Validates our pediatrics subject estimates against real exam recall.",
    placeholder: "reviewer-2",
    bg: "from-yellow-100 to-yellow-200",
  },
  {
    name: "Anonymous, M4",
    role: "US MD candidate",
    score: "Step 2 CK: 268 (verified)",
    bio: "Provided the original 1,200-sample dataset that powers our base model.",
    placeholder: "reviewer-3",
    bg: "from-blue-100 to-blue-200",
  },
];

export function Reviewers() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-mint-50 px-4 py-1.5 text-sm font-semibold text-mint-800 mb-4">
            <ShieldCheck className="h-4 w-4" />
            Reviewed by physicians
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Validated by Real US-Trained Physicians
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Each algorithm update is reviewed by licensed MDs who scored 250+ on
            their own Step 2 CK. We&apos;re actively expanding our advisor
            board.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviewers.map((r) => (
            <article
              key={r.name}
              className="rounded-3xl border border-gray-100 bg-white p-6 hover:shadow-lg transition"
            >
              <div
                className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${r.bg} mb-4 overflow-hidden`}
              >
                <Image
                  src={`/images/${r.placeholder}.jpg`}
                  alt={r.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mb-1">{r.name}</h3>
              <div className="text-sm text-gray-600 mb-1">{r.role}</div>
              <div className="text-sm font-semibold text-mint-700 mb-4">
                {r.score}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {r.bio}
              </p>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition">
                <ExternalLink className="h-3.5 w-3.5" />
                LinkedIn
              </button>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 max-w-2xl mx-auto">
          Reviewer identities will be public once each advisor signs our public
          profile. Until then, we use placeholder names. We never claim
          unaffiliated endorsements.
        </p>
      </div>
    </section>
  );
}
