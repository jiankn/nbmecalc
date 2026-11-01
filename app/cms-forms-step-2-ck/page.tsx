import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ListChecks,
  ShieldCheck,
  Target,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

const pageUrl = "https://nbmecalc.com/cms-forms-step-2-ck";
const officialCmsUrl =
  "https://www.nbme.org/examinees/self-assessments/clinical-science-mastery-series/";

export const metadata: Metadata = {
  title: "CMS Forms for Step 2 CK: How Many, All 8 Subjects & Price",
  description:
    "NBME sells CMS forms in 8 subjects, with multiple forms each but no published total. See the 50-question format, $21 price, how to check current forms, and which to take.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "CMS Forms for Step 2 CK: How Many, All 8 Subjects & Price",
    description:
      "How many CMS forms NBME offers, all 8 Clinical Science Mastery Series subjects, format, price, and how to use them for Step 2 CK.",
    url: pageUrl,
    type: "article",
    images: [
      {
        url: "/images/feature-practice-exams.jpg",
        width: 2400,
        height: 1792,
        alt: "Medical student planning which CMS forms to use for Step 2 CK",
      },
    ],
  },
};

const officialFacts = [
  { value: "8", label: "clinical subject areas" },
  { value: "50", label: "multiple-choice questions per form" },
  { value: "75 min", label: "standard-paced limit" },
  { value: "$21", label: "official price checked Nov. 1, 2026" },
];

// NBME 官网只写"每科有多套"，不公布总数或每科套数，所以这里只讲如何自己核实，不写具体数字。
const formCountSteps = [
  "Sign in to the MyNBME Examinee Portal and open the self-assessment store.",
  "Choose Clinical Science Mastery Series, then one subject.",
  "Read the form choices in that subject's product list. That list is the current inventory for the subject.",
  "Repeat for each subject you plan to use. Counts differ by subject and can change when NBME adds or retires a form.",
];

const howManyToTake = [
  "Start with one form in a subject that a CCSSA, clerkship result, or error log identifies as weak.",
  "Review every missed question and the official content feedback before deciding whether another form in that subject would add useful evidence.",
  "For a shelf exam, stay within the matching CMS subject and choose from the forms currently offered in MyNBME.",
  "For overall Step 2 CK readiness, return to a comprehensive assessment rather than treating a larger CMS count as proof of readiness.",
];

const subjects = [
  {
    name: "Clinical Neurology",
    chooseWhen: "Your evidence points to a focused neurology knowledge gap.",
  },
  {
    name: "Emergency Medicine",
    chooseWhen: "Acute evaluation and stabilization decisions need focused practice.",
  },
  {
    name: "Family Medicine",
    chooseWhen: "Ambulatory, preventive, or longitudinal-care questions are weak.",
  },
  {
    name: "Medicine",
    chooseWhen: "Adult medicine is the clearest weak content area in your report or review log.",
  },
  {
    name: "Obstetrics and Gynecology",
    chooseWhen: "Pregnancy, delivery, or reproductive-health decisions need review.",
  },
  {
    name: "Pediatrics",
    chooseWhen: "Child and adolescent presentations are a repeated source of errors.",
  },
  {
    name: "Psychiatry",
    chooseWhen: "Psychiatric diagnosis or management is a documented weak area.",
  },
  {
    name: "Surgery",
    chooseWhen: "Perioperative, trauma, or surgical-management questions need practice.",
  },
];

const studySteps = [
  {
    title: "Start with evidence",
    body: "Use a recent score report, clerkship result, or error log to name one weak subject. Do not choose a form only because someone else called it high yield.",
  },
  {
    title: "Choose the matching CMS subject",
    body: "Select the Clinical Science Mastery Series content area that matches the weakness. Check the current form choices inside MyNBME before purchasing.",
  },
  {
    title: "Pick pacing for the job",
    body: "Use the official 75-minute standard-paced mode when timing is part of the problem. Use self-paced mode when the goal is deliberate content review.",
  },
  {
    title: "Classify every miss",
    body: "Separate knowledge gaps, misread clues, sequencing errors, and changed answers. The category determines what to review next.",
  },
  {
    title: "Return to comprehensive evidence",
    body: "A CMS result is subject-focused. Use a fresh comprehensive assessment when the decision is overall Step 2 CK readiness or test timing.",
  },
];

const faqs = [
  {
    q: "How many CMS forms are there for Step 2 CK?",
    a: "NBME offers CMS forms in 8 clinical subjects and says multiple forms are available for each one. It does not publish a total count across subjects. Check the product list for each subject in MyNBME to see what is currently for sale.",
  },
  {
    q: "How many Pediatrics, Surgery, Medicine, or Psychiatry CMS forms are there?",
    a: "NBME does not publish a per-subject count for any of the 8 subjects. Each subject has multiple forms, and the MyNBME product list for that subject shows the forms currently offered. A high form number is not the same as the number of forms for sale, because older forms may be retired.",
  },
  {
    q: "What are CMS forms for Step 2 CK?",
    a: "CMS commonly refers to NBME's Clinical Science Mastery Series self-assessments. They are subject-focused assessments designed for students preparing for an NBME Clinical Science Subject Exam. Students also use them to practice clinical reasoning in a weak Step 2 CK subject, but they are not comprehensive Step 2 CK readiness exams.",
  },
  {
    q: "Where can I get official CMS forms?",
    a: "Purchase and launch them through the MyNBME Examinee Portal linked from NBME's official Clinical Science Mastery Series page. NBME says each purchased self-assessment remains accessible for one year. This site does not host or link to unauthorized PDF copies.",
  },
  {
    q: "What are the latest CMS forms?",
    a: "Form availability changes independently by subject. NBME's public overview does not maintain a stable all-subject list of the highest current form numbers, so check the product dropdown in MyNBME immediately before purchasing rather than relying on a dated blog list.",
  },
  {
    q: "How many questions are in an NBME CMS form?",
    a: "NBME currently states that every Clinical Science Mastery Series form contains 50 multiple-choice questions. Standard-paced mode allows 1 hour 15 minutes, while self-paced mode allows 5 hours.",
  },
  {
    q: "How many CMS forms should I do for Step 2 CK?",
    a: "There is no official universal number. Choose forms that answer a documented subject-level question, review the explanations, and stop when another subject or a comprehensive assessment would provide more useful evidence.",
  },
  {
    q: "Can a CMS score predict my Step 2 CK score?",
    a: "Not directly. The CMS total score runs from 1 to 30, and the report shows the Subject Exam score that approximately corresponds to it. Use CMS results to investigate a subject; use a comprehensive CCSSA and other current Step 2 CK evidence for overall readiness.",
  },
];

export default function CmsFormsStep2CkPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "CMS Forms for Step 2 CK: How Many, Subjects, and Study Plan",
      url: pageUrl,
      description:
        "How many CMS forms NBME offers, plus Clinical Science Mastery Series subjects, format, access, and Step 2 CK study use.",
      dateModified: "2026-11-01",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "NBMEcalc",
        url: "https://nbmecalc.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://nbmecalc.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "CMS Forms for Step 2 CK",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero
        badge="Official-source CMS guide · Reviewed Nov. 1, 2026"
        title="CMS Forms for Step 2 CK: How Many, Subjects, and Study Plan"
        description="NBME offers CMS forms in 8 subjects, with multiple forms in each and 50 questions per form. Use this guide to check how many are available, choose the right subject, and keep a CMS result separate from overall Step 2 CK readiness."
        size="md"
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" asChild>
            <a href="#choose-a-subject">Choose a CMS subject</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={officialCmsUrl} target="_blank" rel="noreferrer">
              Official NBME page <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-gray-200 bg-white py-10">
        <div className="container max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {officialFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="text-2xl font-extrabold text-gray-950">
                  {fact.value}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-gray-600">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Format, access, and price checked against NBME&apos;s official Clinical
            Science Mastery Series page on November 1, 2026. Availability and
            price can change.
          </p>
        </div>
      </section>

      <section id="how-many" className="border-b border-gray-200 bg-white py-14 lg:py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
            How many CMS forms are there?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            NBME offers CMS forms in <strong>8 clinical subjects</strong> and
            says <strong>multiple forms</strong> are available for each one.
            It does not publish a total across subjects or a count for any
            single subject. The same is true for Pediatrics, Surgery, Medicine,
            Psychiatry, and the other four subjects.
          </p>
          <p className="mt-3 leading-relaxed text-gray-700">
            A form number is not a count of what is for sale. Older forms can be
            retired, so &quot;Form 8&quot; does not mean eight forms are
            available today. Lists in forums and social posts are dated
            snapshots.
          </p>
          <div className="mt-7 rounded-2xl border border-mint-200 bg-mint-50/50 p-6">
            <h3 className="font-bold text-gray-950">
              Check the current count yourself
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
              {formCountSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-mint-50/40 py-12">
        <div className="container max-w-4xl">
          <div className="rounded-3xl border border-mint-200 bg-white p-7 lg:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-100">
                <Target className="h-5 w-5 text-mint-800" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-950">
                  Short answer: use CMS forms to investigate a subject
                </h2>
                <p className="mt-3 leading-relaxed text-gray-700">
                  A CMS form is useful when you can name the clinical subject
                  you need to test. It is not the right instrument for deciding
                  whether your overall Step 2 CK score is ready. For that job,
                  use a comprehensive CCSSA, then use the{" "}
                  <Link
                    href="/nbme-score-conversion"
                    data-indexing-context="related"
                    className="font-semibold text-mint-800 underline underline-offset-4"
                  >
                    NBME score conversion guide
                  </Link>{" "}
                  to read its official score report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="choose-a-subject" className="bg-white py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint-800">
              Official subject list
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
              Which CMS form should you choose?
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-600">
              NBME currently lists eight content areas. Choose the subject that
              matches evidence from your report or review log—not a universal
              tier list.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-700" />
                  <div>
                    <h3 className="font-bold text-gray-950">{subject.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {subject.chooseWhen}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-16 lg:py-20">
        <div className="container max-w-5xl">
          <div className="mb-9 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-100">
              <ListChecks className="h-5 w-5 text-mint-800" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
              CMS form or CCSSA?
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left font-bold text-gray-950">Your question</th>
                  <th className="px-5 py-4 text-left font-bold text-gray-950">Use</th>
                  <th className="px-5 py-4 text-left font-bold text-gray-950">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-4 text-gray-700">Which clinical subject is weak?</td>
                  <td className="px-5 py-4 font-bold text-mint-800">CMS form</td>
                  <td className="px-5 py-4 text-gray-700">It isolates one Clinical Science Mastery Series content area.</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 text-gray-700">Am I ready for Step 2 CK overall?</td>
                  <td className="px-5 py-4 font-bold text-mint-800">CCSSA</td>
                  <td className="px-5 py-4 text-gray-700">It is NBME&apos;s comprehensive self-assessment aligned with Step 2 CK.</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 text-gray-700">How should I read my CMS result?</td>
                  <td className="px-5 py-4 font-bold text-mint-800">Official report first</td>
                  <td className="px-5 py-4 text-gray-700">The report includes a score interpretation guide and subject-exam approximation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container max-w-4xl">
          <div className="mb-10 max-w-3xl">
            <div className="flex items-center gap-3">
              <Clock3 className="h-6 w-6 text-mint-700" />
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
                A five-step CMS study cycle
              </h2>
            </div>
            <p className="mt-3 text-lg leading-relaxed text-gray-600">
              This workflow keeps the form tied to a decision instead of
              turning “do more CMS” into an endless checklist.
            </p>
          </div>

          <ol className="space-y-4">
            {studySteps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-100 text-sm font-extrabold text-mint-800">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="how-many-to-take" className="border-t border-gray-200 bg-gray-50 py-16 lg:py-20">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
            How many CMS forms should you do for Step 2 CK?
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-gray-600">
            NBME does not set a number. Take another form only when it answers a
            real study question:
          </p>
          <ul className="mt-6 space-y-3">
            {howManyToTake.map((item) => (
              <li key={item} className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-gray-700">
            After a form, read the 1–30 CMS total score and the approximate
            Subject Exam score on your report with the{" "}
            <Link
              href="/cms-converter"
              data-indexing-context="related"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              CMS score interpretation guide
            </Link>
            . A CMS score does not convert to a 3-digit Step 2 CK score.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-mint-50/40 py-16">
        <div className="container max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-mint-200 bg-white p-7">
              <BookOpen className="h-6 w-6 text-mint-700" />
              <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
                Where to get CMS forms
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                Use the official NBME page and MyNBME portal. Select the
                subject, confirm the available form, and choose standard- or
                self-paced mode before checkout.
              </p>
              <a
                href={officialCmsUrl}
                target="_blank"
                rel="noreferrer"
                data-evidence-source="primary"
                className="mt-5 inline-flex items-center gap-2 font-bold text-mint-800 underline underline-offset-4"
              >
                Open NBME&apos;s official CMS page <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7">
              <ShieldCheck className="h-6 w-6 text-mint-700" />
              <h2 className="mt-4 text-2xl font-extrabold text-gray-950">
                Avoid unofficial PDF downloads
              </h2>
              <p className="mt-3 leading-relaxed text-gray-700">
                Search results often point to shared PDFs, Telegram channels,
                or reposted questions. Those copies may be unauthorized,
                incomplete, or missing the official explanations and reporting
                tools. NBMEcalc does not host them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-950 lg:text-4xl">
            CMS Forms Step 2 CK FAQs
          </h2>
          <div className="mt-9 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-mint-400"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-gray-950">
                  <span>{faq.q}</span>
                  <span className="text-2xl leading-none text-gray-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-16 text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Use the right tool for the next decision
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-gray-300">
            Choose a CMS form for subject practice, interpret its result on the
            subject scale, and return to comprehensive evidence for overall
            Step 2 CK readiness.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" asChild>
              <Link href="/cms-converter">Open the CMS score guide</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/step-2-predictor">Open the Step 2 CK predictor</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
