import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is nbmecalc.com?",
    a: "nbmecalc.com is a free USMLE Step score predictor that uses NBME, UWSA, Free 120, AMBOSS, and CMS practice scores to predict your real Step 1, Step 2 CK, or Step 3 performance with a 95% confidence interval. Built by med students, for med students.",
  },
  {
    q: "How accurate is your prediction?",
    a: "We do not currently publish a reproducible holdout validation dataset, so we do not claim a verified median error. Treat the result as an independent planning estimate, compare it with official score reports, and make decisions from the full range rather than the midpoint alone.",
  },
  {
    q: "How do you calculate the confidence interval?",
    a: "We use weighted regression on historical (NBME, UWSA, Free 120) → Step score pairs, with more recent exams weighted higher. The 95% CI is computed from prediction residual variance in our training set, narrowed when you provide more inputs.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We don't store your scores unless you create an account. Anonymous predictions are processed in your browser and discarded after you leave. We never sell data, never share with third parties. Read our full privacy policy.",
  },
  {
    q: "How is NBMEcalc different from PredictMyStepScore?",
    a: "PredictMyStepScore only handles NBME and UWorld inputs and gives you a single point estimate. We support 5 different practice exam sources (NBME, UWSA, Free 120, AMBOSS, CMS) and provide a 95% confidence interval, subject-by-subject breakdown, and a personalized study plan.",
  },
  {
    q: "How is NBMEcalc different from AMBOSS Predictor?",
    a: "AMBOSS Predictor is a lead-generation tool for AMBOSS subscriptions — it works best if you're already paying for AMBOSS. NBMEcalc is independent, free, and works with whatever practice exams you already have.",
  },
  {
    q: "Why do you charge for the full report?",
    a: "The free version gives you the prediction and CI — that's enough for most students. The $14.99 report adds a downloadable PDF, day-by-day study plan based on your weak subjects, and peer outcome comparisons. Pro subscribers ($9.99/mo) get unlimited re-runs and a live timeline.",
  },
  {
    q: "Can I use this for Step 1 and Step 3?",
    a: "Yes — we support all three Steps. Step 1 is now Pass/Fail, so we additionally show your pass probability based on your practice scores.",
  },
  {
    q: "What if my predicted range seems too low?",
    a: "Don't panic. Our prediction is statistical — outliers happen. If your actual exam comes in 15+ points above the upper CI, that's within normal variance for prepared students who peaked on test day. If it comes in below, retake practice exams in the final week and re-predict.",
  },
  {
    q: "Is NBMEcalc affiliated with NBME or USMLE?",
    a: "No. nbmecalc.com is an independent project built by med students. We are not affiliated with, endorsed by, or sponsored by NBME, FSMB, USMLE, USMLE-Rx, AMBOSS, UWorld, or Kaplan. Predictions are statistical estimates for educational purposes only.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-500">
            Updated June 28, 2026
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
