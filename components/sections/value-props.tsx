import Image from "next/image";
import { FileText, BarChart3, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    title: "See All Your Practice Exams",
    body: "NBME, UWSA 1/2, Free 120, AMBOSS, and CMS forms — all in one prediction. Most calculators only handle one source. We do them all.",
    image: "/images/feature-practice-exams.jpg",
    imageAlt: "Blank pastel practice exam cards arranged on a medical student's desk",
    icon: FileText,
    iconBg: "bg-blue-100/95 text-blue-700",
    visual: (
      <div className="absolute left-5 top-5 z-10 grid grid-cols-2 gap-2 -rotate-3">
        {["NBME 30", "NBME 31", "UWSA 2", "Free 120"].map((label, i) => (
          <div
            key={label}
            className={cn(
              "rounded-full bg-white/90 shadow-sm backdrop-blur px-3 py-1.5 text-[10px] font-bold text-gray-800 flex items-center justify-center",
              i === 1 && "ring-2 ring-mint-400"
            )}
          >
            {label}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Real Range, Not a Guess",
    body: "We show you a 95% confidence interval based on 1,200+ historical Step takers. No more 'you'll get a 240' fake precision.",
    image: "/images/feature-score-range.png",
    imageAlt: "Medical student holding a phone displaying an NBMEcalc score range prediction",
    icon: BarChart3,
    iconBg: "bg-yellow-100/95 text-yellow-700",
    visual: null,
  },
  {
    title: "A Decision, Not Just A Number",
    body: "Should you sit or postpone? What 3 moves actually shift your score? Which Reddit-favorite tactics will hurt you? The paid report answers — and tells you when it would be wrong.",
    image: "/images/feature-study-plan.jpg",
    imageAlt: "Blank study planner with pastel sticky notes on a warm wooden desk",
    icon: Calendar,
    iconBg: "bg-mint-100/95 text-mint-700",
    visual: (
      <div className="absolute left-5 top-5 z-10 flex max-w-[240px] flex-wrap gap-2 rotate-2">
        {["Sit / postpone", "3 high-leverage moves", "Don't do these"].map(
          (label, i) => (
            <div
              key={label}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] font-bold shadow-sm backdrop-blur",
                i === 0 && "bg-mint-100/95 text-mint-800",
                i === 1 && "bg-white/90 text-gray-800",
                i === 2 && "bg-red-100/95 text-red-700"
              )}
            >
              {label}
            </div>
          )
        )}
      </div>
    ),
  },
];

export function ValueProps() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          How NBMEcalc Saves Your Step Score
        </h2>
        <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-14">
          Three things every other predictor gets wrong — and how we fix them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="group relative min-h-[430px] overflow-hidden rounded-3xl border border-gray-100 bg-gray-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  quality={100}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                {card.visual}
                <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-end p-8">
                  <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-sm backdrop-blur", card.iconBg)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-black mb-2">
                    {card.title}
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
