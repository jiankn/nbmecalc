"use client";

import { useState } from "react";
import { Star, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPhoneMockup } from "@/components/iphone-mockup";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "step1", label: "Step 1", placeholder: "Enter your NBME 30 score (e.g., 220)" },
  { key: "step2", label: "Step 2 CK", placeholder: "Enter your NBME 31 score (e.g., 235)" },
  { key: "step3", label: "Step 3", placeholder: "Enter your UWSA score (e.g., 215)" },
  { key: "free120", label: "Free 120", placeholder: "Enter your Free 120 % (e.g., 78)" },
] as const;

export function Hero() {
  const [activeStep, setActiveStep] = useState<typeof STEPS[number]["key"]>("step2");
  const [score, setScore] = useState("");

  const active = STEPS.find((s) => s.key === activeStep)!;

  const scrollToCalculator = () => {
    // Dispatch a custom event with the hero score so the Calculator can
    // pick it up and pre-fill the first exam row. This avoids prop drilling
    // across unrelated component trees (Hero and Calculator are siblings
    // rendered by the page, not parent-child).
    const numericScore = Number(score);
    if (score.trim() && Number.isFinite(numericScore) && numericScore > 0) {
      window.dispatchEvent(
        new CustomEvent("hero-score", {
          detail: {
            score: numericScore,
            step: activeStep === "free120" ? "step2" : activeStep === "step3" ? "step3" : activeStep === "step1" ? "step1" : "step2",
            source: activeStep === "free120" ? "FREE120" : activeStep === "step3" ? "UWSA1" : "NBME",
          },
        })
      );
    }
    const el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24 items-center">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6 animate-fade-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 border border-black/10 px-4 py-1.5 text-sm font-semibold text-black">
            <Zap className="h-4 w-4" />
            Free • No signup • 5 seconds
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-black text-balance">
            Predict Your USMLE
            <br />
            Step Score in 5 Seconds
          </h1>

          {/* Sub */}
          <p className="text-lg lg:text-xl text-black/75 max-w-[560px] leading-relaxed">
            Drop your NBME, UWSA, or Free 120 scores. Get an accurate Step
            prediction with{" "}
            <span className="font-semibold text-black">
              95% confidence interval
            </span>
            . Built by med students, for med students.
          </p>

          {/* Step picker */}
          <div className="flex flex-wrap gap-2 pt-2">
            {STEPS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveStep(s.key)}
                className={cn(
                  "btn-pill px-5 py-2.5 text-sm border-2 transition-all",
                  activeStep === s.key
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-black hover:text-white"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input + CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-[560px]">
            <Input
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={active.placeholder}
              className="h-14 text-base flex-1 bg-white"
            />
            <Button
              size="lg"
              className="h-14 sm:w-auto"
              onClick={scrollToCalculator}
            >
              Predict My Score
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Resume link */}
          <button
            className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
            onClick={scrollToCalculator}
          >
            Been here before? Resume your prediction →
          </button>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-mint-700 text-mint-700"
                />
              ))}
              <span className="ml-1 text-sm font-semibold text-black">
                Excellent
              </span>
            </div>
            <span className="text-sm text-black/70">
              Trusted by 1,200+ Step takers from{" "}
              <a
                href="https://reddit.com/r/step1"
                target="_blank"
                rel="noopener"
                className="font-semibold underline underline-offset-2"
              >
                r/Step1
              </a>{" "}
              &{" "}
              <a
                href="https://reddit.com/r/step2"
                target="_blank"
                rel="noopener"
                className="font-semibold underline underline-offset-2"
              >
                r/Step2
              </a>
            </span>
          </div>
        </div>

        {/* RIGHT — iPhone mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
          {/* Floating chips */}
          <div className="absolute top-12 -left-2 z-10 hidden md:flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-lg animate-fade-up">
            <span className="h-2 w-2 rounded-full bg-mint-500 animate-pulse" />
            <span className="text-xs font-bold">95% confidence</span>
          </div>
          <div className="absolute bottom-20 -right-4 z-10 hidden md:block animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Predicted
              </div>
              <div className="text-3xl font-extrabold text-black tabular-nums">
                238
              </div>
            </div>
          </div>

          <IPhoneMockup tilt>
            <PhonePreviewContent />
          </IPhoneMockup>
        </div>
      </div>
    </section>
  );
}

/** Inner content of the iPhone screen (mock prediction result) */
function PhonePreviewContent() {
  return (
    <div className="h-full w-full overflow-y-auto px-4 pt-6 pb-4 text-black">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Your Predicted
      </div>
      <div className="text-base font-bold mb-1">Step 2 CK Score</div>

      {/* Big number */}
      <div className="mt-4 rounded-2xl bg-mint-50 p-4 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
          Most Likely
        </div>
        <div className="text-5xl font-extrabold leading-none tabular-nums text-mint-700 mt-1">
          238
        </div>
        <div className="mt-2 text-[11px] text-gray-600">
          95% CI: 230 – 246
        </div>
      </div>

      {/* CI bar */}
      <div className="mt-4">
        <div className="relative h-3 w-full rounded-full bg-gray-100">
          <div
            className="absolute top-0 h-3 rounded-full bg-mint-500/30"
            style={{ left: "30%", width: "30%" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-mint-500 border-[3px] border-white shadow-lg"
            style={{ left: "calc(45% - 10px)" }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-gray-500">
          <span>200</span>
          <span>230</span>
          <span>246</span>
          <span>280</span>
        </div>
      </div>

      {/* Mini bars */}
      <div className="mt-4 space-y-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Subject Strength
        </div>
        {[
          { name: "Internal Med", val: 78, weak: false },
          { name: "Surgery", val: 71, weak: false },
          { name: "OB/GYN", val: 52, weak: true },
          { name: "Pediatrics", val: 84, weak: false },
        ].map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex justify-between text-[10px] font-medium">
              <span>{s.name}</span>
              <span className={s.weak ? "text-red-600" : "text-gray-700"}>
                {s.val}%
              </span>
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full",
                  s.weak ? "bg-red-400" : "bg-mint-500"
                )}
                style={{ width: `${s.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-4 w-full rounded-full bg-black text-white text-xs font-semibold py-2.5">
        Get Full Report — $14.99
      </button>
    </div>
  );
}
