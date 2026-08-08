import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is nbmecalc.com?",
    a: "nbmecalc.com is an independent USMLE planning tool that combines NBME, UWSA, Free 120, AMBOSS, and CMS practice scores into a Step 1, Step 2 CK, or Step 3 estimate with an estimated range.",
  },
  {
    q: "How accurate is your prediction?",
    a: "We do not currently publish a reproducible holdout validation dataset, so we do not claim a verified median error. Treat the result as an independent planning estimate, compare it with official score reports, and make decisions from the full range rather than the midpoint alone.",
  },
  {
    q: "How do you calculate the estimated range?",
    a: "We use a weighted heuristic with explicit source adjustments and recency weighting. The range widens or narrows based on the number, source mix, and age of your inputs. It has not yet been calibrated on a published holdout cohort, so it should not be interpreted as a verified 95% confidence interval.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We don't store your scores unless you create an account. Anonymous predictions are processed in your browser and discarded after you leave. We never sell data, never share with third parties. Read our full privacy policy.",
  },
  {
    q: "How is NBMEcalc different from PredictMyStepScore?",
    a: "NBMEcalc supports NBME, UWSA, Free 120, AMBOSS, and CMS inputs in one calculation. It reports its source adjustments, an estimated planning range, and a study-plan framework. Compare each tool's current methodology before relying on its result.",
  },
  {
    q: "How is NBMEcalc different from AMBOSS Predictor?",
    a: "AMBOSS Predictor is a lead-generation tool for AMBOSS subscriptions — it works best if you're already paying for AMBOSS. NBMEcalc is independent, free, and works with whatever practice exams you already have.",
  },
  {
    q: "Why do you charge for the full report?",
    a: "The free version gives you the estimate and planning range. The $14.99 report adds a downloadable PDF, source-weighting notes, and a day-by-day study plan based on the subjects you select. Lifetime members get unlimited re-runs and a live timeline with one payment.",
  },
  {
    q: "Can I use this for Step 1 and Step 3?",
    a: "Yes — we support all three Steps. Step 1 is now Pass/Fail, so we additionally show your pass probability based on your practice scores.",
  },
  {
    q: "What if my predicted range seems too low?",
    a: "Do not make a scheduling decision from the midpoint alone. Check that every input and date is correct, compare the result with your official NBME or USMLE guidance, and discuss a borderline result with an advisor. The displayed range is a planning aid, not a validated guarantee.",
  },
  {
    q: "Is NBMEcalc affiliated with NBME or USMLE?",
    a: "No. nbmecalc.com is an independent educational project. We are not affiliated with, endorsed by, or sponsored by NBME, FSMB, USMLE, USMLE-Rx, AMBOSS, UWorld, or Kaplan. Outputs are model-based planning estimates, not official score conversions.",
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
            Updated August 7, 2026
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
