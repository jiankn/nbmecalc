import type { Metadata } from "next";
import { CcssaFormPage, type CcssaFormFacts } from "@/components/ccssa-form-page";
import { estimateStep2FromPercent, percentForScore } from "@/lib/nbme-percent-model";
import { NORM_INFO } from "@/lib/usmle-norms";

const PAGE_URL = "https://nbmecalc.com/nbme-16-score-conversion";
const title = "NBME 16 Score Conversion: Step 2 CK % Correct to Score (2026)";
const description =
  "Convert your NBME 16 (CCSSA Form 16) percent correct or Total CCSSA Score to an estimated Step 2 CK score, with a Form 16 conversion chart, passing line, and when to take it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: { title, description, url: PAGE_URL, type: "website" },
};

const pass = NORM_INFO.step2ck.passingScore;
const passPct = percentForScore(pass);
const ex70 = estimateStep2FromPercent(70, "epc").midpoint;
const ex80 = estimateStep2FromPercent(80, "epc").midpoint;

const facts: CcssaFormFacts = {
  form: 16,
  lede: "Form 16 is the newest CCSSA form NBME sells for Step 2 CK.",
  position: [
    "Form 16 is the highest-numbered and newest form in NBME's current CCSSA set. Like every CCSSA it has 200 questions in four 50-question sections and reports a Total CCSSA Score on the same 1–300 scale as Step 2 CK.",
    "NBME's estimated pass probability is modeled on examinees who tested within a week of Step 2 CK, so many students save their newest unused form for the final week. Form 16 is the usual choice for that slot. This is a planning habit, not an NBME rule.",
    "NBME has been moving its self-assessments to an updated interface built to look more like the USMLE exams, with searchable lab values, a notes feature, and improved highlighting. It announced plans to bring that interface to the comprehensive self-assessments by the end of March 2026.",
  ],
  faqs: [
    {
      q: "Is NBME 16 harder than the other forms?",
      a: "It may feel harder, but that does not lower your converted score. NBME equates every CCSSA form, adjusting for small differences in difficulty, so the same equated percent correct leads to the same estimated Step 2 CK score on Form 16 as on Form 13 or 15.",
    },
    {
      q: "Is NBME 16 predictive of Step 2 CK?",
      a: "As much as any CCSSA form. NBME describes the Total CCSSA Score as an estimate of your Step 2 CK score under the same knowledge and conditions, and a 52-study systematic review found CCSSA a good predictor of Step 2 CK. Taking it under real timing and close to test day keeps it most useful.",
    },
    {
      q: "What percent do I need on NBME 16 to pass Step 2 CK?",
      a: `The converter puts the ${pass} passing score at about ${passPct}% equated percent correct. That is an estimate with a wide range; the pass probability printed on your Form 16 report is the better guide, because NBME models it from real Step 2 CK results.`,
    },
    {
      q: "What does 70% or 80% on NBME 16 convert to?",
      a: `About ${ex70} for 70% and about ${ex80} for 80% equated percent correct, each with a planning range. Use the converter above for your exact number.`,
    },
    {
      q: "When should I take NBME 16?",
      a: "Most students use it as their last comprehensive check in the final week, because it is the newest form and NBME's pass probability assumes testing within a week. If it disagrees sharply with your other recent results, take one more form before changing your test date.",
    },
    {
      q: "NBME 16 or UWSA 2: which should I trust?",
      a: "Trust the NBME result first; it is NBME's own estimate of Step 2 CK. UWSA scores are widely reported to run higher than the real exam, which is why the Step 2 CK predictor subtracts an internal 2-point adjustment from UWSA 2. If both are close after that, your estimate is well supported.",
    },
  ],
};

export default function Nbme16ScoreConversionPage() {
  return <CcssaFormPage facts={facts} />;
}
