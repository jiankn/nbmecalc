import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  CircleMinus,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Library,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { ResourceListingCopy } from "@/components/resource-listing-copy";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For Educators & Medical Libraries | NBMEcalc",
  description:
    "Review NBMEcalc for a medical school resource guide, course, or academic support program. See intended uses, learning goals, privacy, evidence, and limitations.",
  alternates: { canonical: "https://nbmecalc.com/educators" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Evaluate NBMEcalc for Your Learners",
    description:
      "A review-ready overview for medical educators, librarians, and academic support teams.",
    url: "https://nbmecalc.com/educators",
    type: "website",
  },
};

const learningGoals = [
  {
    title: "Interpret uncertainty",
    body: "Read a practice-assessment result as a range and planning signal rather than a guaranteed outcome.",
  },
  {
    title: "Compare evidence",
    body: "Consider several recent assessments while keeping comprehensive and subject-level products distinct.",
  },
  {
    title: "Recognize assumptions",
    body: "Distinguish official scoring information from NBMEcalc's internal mappings and source adjustments.",
  },
  {
    title: "Plan the next step",
    body: "Use trends and disagreement between inputs to inform a study or advising conversation.",
  },
];

const appropriateUses = [
  "A supplemental resource in an exam-preparation or assessment-literacy guide.",
  "A starting point for reflective study-planning conversations.",
  "A way to compare practice-assessment trends without collapsing every product into the same category.",
];

const inappropriateUses = [
  "Making an exam-eligibility, progression, or scheduling decision by itself.",
  "Replacing an official NBME or USMLE score report or institutional policy.",
  "Presenting a CMS result as an official direct Step 2 CK conversion.",
  "Promising that a learner will achieve the displayed estimate or range.",
];

const reviewLinks = [
  {
    title: "Step 2 CK Predictor",
    href: "/step-2-predictor",
    body: "Primary learner-facing calculator for combining recent Step 2 CK practice-assessment inputs.",
  },
  {
    title: "CMS Form Converter",
    href: "/cms-converter",
    body: "Subject-level interpretation tool with an explicit warning that CMS forms are not official direct Step conversions.",
  },
  {
    title: "Methodology & Limitations",
    href: "/methodology",
    body: "Official sources, internal assumptions, validation status, known limits, and material corrections.",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    body: "Data collected, processing purposes, service providers, retention, cookies, and user rights.",
  },
  {
    title: "Terms of Service",
    href: "/terms",
    body: "Educational-use limits, account options, paid features, and the no-guarantee statement.",
  },
];

const listingText = `Title: NBMEcalc

Description: NBMEcalc is an independent browser-based educational tool that helps medical students compare practice-assessment results and interpret them as a planning estimate and range. It provides public methodology, source references, and model limitations. It is not affiliated with, endorsed by, or sponsored by NBME or USMLE.

Recommended URL: https://nbmecalc.com/step-2-predictor
Reviewer information: https://nbmecalc.com/educators
Audience: Medical students preparing for USMLE Step 2 CK
Resource type: Practice-assessment interpretation and study-planning tool
Access: Free basic prediction without an account; optional paid reports and plans
Suggested subjects: USMLE, Step 2 CK, medical education, assessment literacy, study planning`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "NBMEcalc",
  url: "https://nbmecalc.com/educators",
  description:
    "An independent browser-based educational tool for comparing practice-assessment results and interpreting them as a planning estimate and range.",
  educationalUse: ["assessment literacy", "self-assessment", "study planning"],
  audience: [
    { "@type": "EducationalAudience", educationalRole: "student" },
    { "@type": "EducationalAudience", educationalRole: "educator" },
  ],
  about: ["USMLE", "NBME self-assessments", "medical education"],
  isAccessibleForFree: true,
  inLanguage: "en",
  provider: {
    "@type": "Organization",
    name: "NBMEcalc",
    url: "https://nbmecalc.com",
  },
};

export default function EducatorsPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHero
        badge="For educators & libraries"
        title="Evaluate NBMEcalc Before You Recommend It"
        description="A review-ready overview for medical school librarians, faculty, learning specialists, and academic support teams."
        size="sm"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="#review-summary">
              Review the resource
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/methodology">Read the methodology</Link>
          </Button>
        </div>
      </PageHero>

      <div className="border-b border-gray-200 bg-white">
        <div className="container max-w-6xl py-5">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-semibold text-gray-700">
            {[
              "Free basic prediction",
              "No signup for anonymous use",
              "Sources and assumptions public",
              "Independent of NBME and USMLE",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-mint-700"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section
        id="review-summary"
        className="scroll-mt-24 bg-white py-14 lg:py-20"
      >
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <Library className="h-7 w-7 text-mint-700" aria-hidden="true" />
                <h2 className="text-3xl font-extrabold text-gray-950">
                  Resource summary
                </h2>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-gray-700">
                NBMEcalc is a supplemental assessment-interpretation and study-
                planning tool. It helps learners place several practice results
                in context while keeping uncertainty visible.
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                It is not an official score-reporting service, clinical tool,
                institutional advising system, or substitute for a school&apos;s
                academic progression policies.
              </p>
            </div>

            <dl className="grid border-y border-gray-200 sm:grid-cols-2">
              {[
                ["Intended audience", "Medical students preparing for USMLE and NBME subject exams"],
                ["Resource type", "Browser-based educational planning tool"],
                ["Access", "Free basic prediction; no account required for anonymous use"],
                ["Commercial model", "Optional paid reports and plans are available"],
                ["Provider", "NBMEcalc, an independent website"],
                ["Review contact", "hello@nbmecalc.com"],
              ].map(([term, detail], index) => (
                <div
                  key={term}
                  className={`py-5 sm:px-5 ${
                    index % 2 === 0 ? "sm:border-r sm:border-gray-200" : ""
                  } ${index > 1 ? "border-t border-gray-200" : ""}`}
                >
                  <dt className="text-xs font-bold uppercase text-gray-500">
                    {term}
                  </dt>
                  <dd className="mt-2 leading-relaxed text-gray-900">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3">
            <GraduationCap
              className="h-7 w-7 text-mint-700"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-extrabold text-gray-950">
              Intended learning goals
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
            The educational value is assessment literacy and decision support,
            not prediction as an end in itself.
          </p>

          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {learningGoals.map((goal, index) => (
              <li key={goal.title} className="border-t-2 border-mint-500 pt-5">
                <span className="font-mono text-sm font-bold text-mint-800">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-gray-950">
                  {goal.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {goal.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-gray-950">
              Fit and boundaries
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-700">
              Recommendation language should preserve the distinction between a
              supplemental planning resource and an authoritative assessment.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-mint-50 p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className="h-6 w-6 text-mint-800"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">
                  Appropriate uses
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-gray-800">
                {appropriateUses.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <CircleMinus
                  className="h-6 w-6 text-amber-800"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-950">
                  Inappropriate uses
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-gray-800">
                {inappropriateUses.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] py-14 text-white lg:py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="h-7 w-7 text-mint-400"
                  aria-hidden="true"
                />
                <h2 className="text-3xl font-extrabold">
                  Evidence and governance
                </h2>
              </div>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
                Official facts link to primary sources. Model mappings, source
                adjustments, and the displayed interval are internal assumptions
                and are labelled as such.
              </p>
              <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">
                An independent holdout validation report and peer-reviewed
                validation study have not yet been published. NBMEcalc therefore
                does not claim an independently verified prediction error or
                cohort size.
              </p>
              <Link
                href="/methodology"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-mint-300 underline underline-offset-4 hover:text-mint-200"
              >
                Inspect sources, assumptions, and corrections
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <dl className="divide-y divide-white/15 border-y border-white/15">
              {[
                ["Primary-source references", "Public"],
                ["Internal model assumptions", "Labelled"],
                ["Material correction history", "Public"],
                ["Independent holdout report", "Not yet published"],
                ["Institutional endorsement", "None claimed"],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="flex items-center justify-between gap-5 py-4"
                >
                  <dt className="text-sm text-gray-300">{term}</dt>
                  <dd className="text-right text-sm font-bold text-white">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-3">
            <BookOpenCheck
              className="h-7 w-7 text-mint-700"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-extrabold text-gray-950">
              Pages to review
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
            Review the learner experience and its supporting policies before
            adding NBMEcalc to a course, advising page, or library guide.
          </p>

          <div className="mt-9 divide-y divide-gray-200 border-y border-gray-200">
            {reviewLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group grid gap-2 py-5 transition hover:bg-gray-50 sm:grid-cols-[minmax(180px,0.7fr)_minmax(0,1.3fr)_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <span className="font-bold text-gray-950 group-hover:text-mint-800">
                  {item.title}
                </span>
                <span className="text-sm leading-relaxed text-gray-600">
                  {item.body}
                </span>
                <ExternalLink
                  className="h-4 w-4 text-gray-400 group-hover:text-mint-700"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <LockKeyhole
                  className="h-7 w-7 text-mint-700"
                  aria-hidden="true"
                />
                <h2 className="text-2xl font-extrabold text-gray-950">
                  Privacy and access
                </h2>
              </div>
              <ul className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
                {[
                  "The basic predictor can be used without creating an account.",
                  "Practice scores are not stored unless the learner chooses to save them.",
                  "NBMEcalc states that it does not sell, rent, or trade personal data.",
                  "Free basic use and optional paid reports or plans are disclosed separately.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 py-4 text-gray-700">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-mint-700"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/privacy"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900"
              >
                Read the full privacy policy
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <FileCheck2
                  className="h-7 w-7 text-mint-700"
                  aria-hidden="true"
                />
                <h2 className="text-2xl font-extrabold text-gray-950">
                  Accessibility status
                </h2>
              </div>
              <p className="mt-6 leading-relaxed text-gray-700">
                The interface uses semantic headings, labelled form controls,
                visible keyboard focus states, and responsive layouts. A formal
                third-party accessibility audit or conformance report has not
                yet been published.
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                Institutions should complete their own accessibility review
                before formally adopting the resource. Please report barriers so
                they can be investigated and corrected.
              </p>
              <a
                href="mailto:hello@nbmecalc.com?subject=Accessibility%20review%20of%20NBMEcalc"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900"
              >
                Report an accessibility barrier
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="listing" className="scroll-mt-24 bg-mint-50 py-14 lg:py-20">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3">
            <ClipboardCheck
              className="h-7 w-7 text-mint-800"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-extrabold text-gray-950">
              Copy-ready resource description
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
            This language is intentionally factual and includes the commercial
            and affiliation disclosures an editor needs.
          </p>
          <div className="mt-8">
            <ResourceListingCopy text={listingText} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-start lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-950">
                A practical review checklist
              </h2>
              <ol className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
                {[
                  "Confirm that a supplemental practice-assessment tool fits your collection or course scope.",
                  "Review the methodology, primary sources, internal assumptions, and current validation status.",
                  "Test the learner flow with fictional values rather than real student information.",
                  "Check privacy, accessibility, commercial disclosures, and link language against institutional policy.",
                  "Choose the most specific learner-facing URL and retain this page as the reviewer reference.",
                ].map((item, index) => (
                  <li key={item} className="grid grid-cols-[36px_1fr] gap-3 py-4">
                    <span className="font-mono text-sm font-bold text-mint-800">
                      {index + 1}.
                    </span>
                    <span className="leading-relaxed text-gray-700">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-bold text-gray-950">
                Questions before listing?
              </h3>
              <p className="mt-3 leading-relaxed text-gray-700">
                Ask about methodology, privacy, accessibility, suggested wording,
                or corrections. Include your institution and the guide or course
                being reviewed.
              </p>
              <a
                href="mailto:hello@nbmecalc.com?subject=Institutional%20review%20of%20NBMEcalc"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-mint-700 underline underline-offset-4 hover:text-mint-900"
              >
                hello@nbmecalc.com
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
