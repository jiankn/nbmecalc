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
  title: "CMS Forms for Step 2 CK: Subjects, Timing & Study Plan",
  description:
    "See all eight NBME CMS subjects, the official 50-question format, current $21 price, where to buy, and a focused Step 2 CK study workflow.",
  keywords: [
    "cms forms step 2 ck",
    "cms forms step 2",
    "nbme cms forms",
    "what are cms forms",
    "how many cms forms",
    "clinical science mastery series",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "CMS Forms for Step 2 CK: Subjects, Timing & Study Plan",
    description:
      "An official-source guide to NBME Clinical Science Mastery Series subjects, format, access, and Step 2 CK use.",
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
  { value: "$21", label: "official price checked Aug. 13, 2026" },
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
    a: "Not directly. NBME describes CMS score reporting in relation to the corresponding Subject Exam scale. Use CMS results to investigate a subject; use a comprehensive CCSSA and other current Step 2 CK evidence for overall readiness.",
  },
];

export default function CmsFormsStep2CkPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "CMS Forms for Step 2 CK: Subjects, Timing and Study Plan",
      url: pageUrl,
      description:
        "An official-source guide to NBME Clinical Science Mastery Series subjects, format, access, and Step 2 CK study use.",
      dateModified: "2026-08-13",
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
        badge="Official-source CMS guide · Reviewed Aug. 13, 2026"
        title="CMS Forms for Step 2 CK: Subjects, Timing, and Study Plan"
        description="CMS forms are 50-question, subject-focused NBME self-assessments. Use this guide to choose the right subject, find the official forms, and keep a CMS result separate from overall Step 2 CK readiness."
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
            Science Mastery Series page on August 13, 2026. Availability and
            price can change.
          </p>
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
