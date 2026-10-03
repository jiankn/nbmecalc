import type { Metadata } from "next";
import { CcssaFormPage, type CcssaFormFacts } from "@/components/ccssa-form-page";
import { estimateStep2FromPercent, percentForScore } from "@/lib/nbme-percent-model";
import { NORM_INFO } from "@/lib/usmle-norms";

const PAGE_URL = "https://nbmecalc.com/nbme-15-score-conversion";
const title = "NBME 15 Score Conversion: Step 2 CK % Correct to Score (2026)";
const description =
  "Convert your NBME 15 (CCSSA Form 15) percent correct or Total CCSSA Score to an estimated Step 2 CK score, with a Form 15 conversion chart, passing line, and how it pairs with Form 16.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: { title, description, url: PAGE_URL, type: "website" },
};

const pass = NORM_INFO.step2ck.passingScore;
const passPct = percentForScore(pass);
const ex75 = estimateStep2FromPercent(75, "epc").midpoint;

const facts: CcssaFormFacts = {
  form: 15,
  lede: "Form 15 is one of the two newest CCSSA forms for Step 2 CK.",
  position: [
    "Form 15 sits just before Form 16 in NBME's current CCSSA set. NBME has not published a form-specific note for it; like every CCSSA it has 200 questions in four 50-question sections and reports a Total CCSSA Score on the same 1–300 scale as Step 2 CK.",
    "A common plan is to take Form 15 two to three weeks before the exam and Form 16 in the final week, so the two newest forms bracket the last stretch of study. NBME's reports put each score's likely range at about ±8 points, so two results within that distance agree.",
    "If Form 15 and Form 16 differ by more than about 8 points, treat that as a reason to take one more form rather than picking the number you like better.",
  ],
  faqs: [
    {
      q: "What should I enter for NBME 15 score conversion?",
      a: "If you have the three-digit Total CCSSA Score from your Form 15 report, enter it in the score calculator; it is already NBME's Step 2 CK estimate. If you have a percent correct, use the percent converter at the top of the page.",
    },
    {
      q: "Is NBME 15 harder than NBME 16?",
      a: "Difficulty differences between forms are adjusted by equating, so a given equated percent correct converts to the same estimated score on Form 15 and Form 16. A form that feels harder does not, by itself, mean a lower Step 2 CK estimate.",
    },
    {
      q: "What percent do I need on NBME 15 to pass Step 2 CK?",
      a: `The converter puts the ${pass} passing score at about ${passPct}% equated percent correct. Treat that as a rough line; the pass probability on your Form 15 report is the better guide.`,
    },
    {
      q: "What does 75% on NBME 15 convert to?",
      a: `About ${ex75}, with a planning range around it. Enter your exact percent in the converter above.`,
    },
    {
      q: "Is this an official NBME 15 conversion?",
      a: "No. NBME does not publish a percent-to-score table. The converter is anchored to NBME's official sample reports and is independent of NBME and USMLE.",
    },
    {
      q: "Should I use NBME 15 by itself?",
      a: "A single form is a checkpoint. Pair it with a later form or UWSA 2 so you can see whether your results agree, and use the Step 2 CK score predictor to combine them.",
    },
  ],
};

export default function Nbme15ScoreConversionPage() {
  return <CcssaFormPage facts={facts} />;
}
