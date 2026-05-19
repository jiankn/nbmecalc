import { IPhoneMockup } from "@/components/iphone-mockup";

const steps = [
  {
    number: "1",
    title: "Gather Your Practice Exams",
    body: "Collect your latest NBME, UWSA, Free 120, AMBOSS, or CMS form scores. Most students have 3–5 by exam week.",
  },
  {
    number: "2",
    title: "Enter Each Score",
    body: "No signup, no email. Just type them in. We support all NBME forms (28–32), UWSA 1/2, Free 120, and more.",
  },
  {
    number: "3",
    title: "Get Your Range",
    body: "See your point estimate and 95% confidence interval instantly. Unlock the full PDF + 14-day plan for $14.99.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            How to Predict Your Step Score
          </h2>
          <p className="text-lg text-gray-600">
            Three steps. Five seconds. No paywall to see your range.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* iPhone */}
          <div className="flex justify-center">
            <IPhoneMockup>
              <PhoneSteps />
            </IPhoneMockup>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-2xl bg-mint-100 text-mint-700 flex items-center justify-center text-2xl font-extrabold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneSteps() {
  return (
    <div className="px-4 pt-6 pb-4 text-black h-full">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Step 2 CK Predictor
      </div>
      <div className="text-base font-bold mb-4">Enter your scores</div>

      <div className="space-y-2">
        {[
          { source: "NBME 30", score: 220, color: "#34D399" },
          { source: "NBME 31", score: 235, color: "#34D399" },
          { source: "UWSA 2", score: 241, color: "#A78BFA" },
        ].map((e) => (
          <div
            key={e.source}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: e.color }}
            />
            <span className="text-xs font-semibold flex-1">{e.source}</span>
            <span className="text-sm font-mono font-bold tabular-nums">
              {e.score}
            </span>
          </div>
        ))}

        <button className="w-full rounded-xl border-2 border-dashed border-gray-300 py-2 text-[10px] font-semibold text-mint-700">
          + Add another exam
        </button>
      </div>

      <div className="mt-4 text-[10px] text-gray-500">Days until exam</div>
      <div className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-mono font-bold inline-block mt-1">
        14 days
      </div>

      <button className="mt-4 w-full rounded-full bg-black text-white text-xs font-semibold py-2.5">
        Predict My Step Score →
      </button>
    </div>
  );
}
