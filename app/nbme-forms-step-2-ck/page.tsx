import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Step2FormPlanner } from "@/components/step-2-form-planner";
import { Button } from "@/components/ui/button";

const pageUrl = "https://nbmecalc.com/nbme-forms-step-2-ck";
const title = "NBME Forms for Step 2 CK: How Many, Which to Take & When";
const description =
  "See how many Step 2 CK NBME forms are available, then use your unused CCSSA forms to build a 7-, 14-, or 28-day practice schedule.";
const officialCcssa =
  "https://www.nbme.org/examinees/self-assessments/comprehensive-clinical-science-self-assessment/";
const myNbme = "https://www.mynbme.org/DefaultStore/";
const linkClass = "font-semibold text-mint-800 underline underline-offset-4";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: { title, description, url: pageUrl, type: "website" },
};

const practiceTypes = [
  {
    name: "NBME CCSSA",
    use: "Get a comprehensive Step 2 CK baseline or a fresh check on your progress.",
    href: "/nbme-score-conversion",
    label: "Read a CCSSA score",
  },
  {
    name: "NBME CMS",
    use: "Practice a clinical subject after a score report or error log shows a gap.",
    href: "/cms-forms-step-2-ck",
    label: "Choose a CMS subject",
  },
  {
    name: "UWorld Self-Assessment",
    use: "Add another timed comprehensive assessment when you have room to review it.",
    href: "https://medical.uworld.com/usmle/features/self-assessment/",
    label: "See UWorld self-assessments",
  },
  {
    name: "USMLE Free 120",
    use: "Practice with official sample questions and get familiar with the test interface.",
    href: "https://www.usmle.org/exam-resources/step-2-ck-materials",
    label: "Open official practice materials",
  },
];

export default function Step2NbmeFormsPage() {
  return (
    <PageShell>
      <PageHero
        size="sm"
        title="NBME Forms for Step 2 CK"
        description="Find out how many NBME forms are available and build a practice schedule around the forms you have and the time left before your exam."
      >
        <Button asChild>
          <a href="#form-planner">Build my practice schedule</a>
        </Button>
      </PageHero>

      <section id="form-planner" className="scroll-mt-24 border-t border-gray-200 bg-gray-50/60 py-12 lg:py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 lg:text-3xl">How many NBME forms are there for Step 2 CK?</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-700">
            NBME lists <strong>seven available Step 2 CK forms</strong> under the Comprehensive Clinical Science
            Self-Assessment (CCSSA), each with 200 questions. Individual prices start at $62. Check the
            CCSSA listing in <a href={myNbme} className={linkClass}>MyNBME</a> for current form numbers
            and pricing. <a href={officialCcssa} className={linkClass}>NBME product details</a>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Checked <time dateTime="2026-11-25">November 25, 2026</time>.
          </p>

          <h2 className="mb-4 mt-8 text-2xl font-extrabold tracking-tight text-gray-950">Build your NBME practice schedule</h2>
          <Step2FormPlanner />
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-12 lg:py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 lg:text-3xl">Which NBME should you take first?</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-gray-700">
            Start with a fresh CCSSA you can take under timed conditions and still have time to review.
            Choose the order around when you can study the feedback. If you already have a recent baseline,
            save a fresh form for the last week so its result reflects your current preparation.
          </p>
          <dl className="mt-6 max-w-3xl divide-y divide-gray-200 border-y border-gray-200">
            <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold text-gray-950">One week left</dt>
              <dd className="text-gray-700">Use one recent baseline or take a fresh form early. Use the remaining days to work through the report and repeated misses.</dd>
            </div>
            <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold text-gray-950">Two weeks left</dt>
              <dd className="text-gray-700">Set a baseline first. Plan a final fresh assessment several days before the exam, leaving time for review.</dd>
            </div>
            <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold text-gray-950">Four weeks left</dt>
              <dd className="text-gray-700">Take a baseline, retest after focused study if you have a spare form, and save a clean final check for the last week.</dd>
            </div>
          </dl>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-700">
            Comparing two results? Use the Total CCSSA Scores, likely score ranges, and the conditions you took each form under.
            A previously seen form is useful for review, while an unused one gives a cleaner check.
          </p>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-mint-50/40 py-12 lg:py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 lg:text-3xl">Where CMS, UWorld, and Free 120 fit</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {practiceTypes.map(({ name, use, href, label }) => (
              <div key={name}>
                <dt className="font-bold text-gray-950">{name}</dt>
                <dd className="mt-1 leading-relaxed text-gray-700">{use} <Link href={href} className={linkClass}>{label}.</Link></dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 border-t border-mint-200 pt-5 leading-relaxed text-gray-700">
            Already have results from several practice tests? Enter the supported scores in the{" "}
            <Link href="/step-2-predictor" className={linkClass}>Step 2 CK score predictor</Link> for a combined planning estimate.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
