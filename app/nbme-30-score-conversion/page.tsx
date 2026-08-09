import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpenCheck, Scale } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Step1ScoreReportReader } from "@/components/step1-score-report-reader";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NBME 30 Score Conversion & Step 1 Report Reader | NBMEcalc",
  description:
    "Read your NBME 30 CBSSA score report correctly. Compare its likely score range with the Step 1 low-pass range without inventing an unofficial raw-score formula.",
  alternates: { canonical: "https://nbmecalc.com/nbme-30-score-conversion" },
  openGraph: {
    title: "NBME 30 Score Conversion & Step 1 Report Reader",
    description:
      "A free CBSSA Form 30 report reader for equated percent correct, likely range, low-pass range, and official pass probability.",
    url: "https://nbmecalc.com/nbme-30-score-conversion",
    type: "website",
  },
};

const faqs = [
  {
    q: "Can I convert NBME 30 wrong answers into an official Step 1 score?",
    a: "No universal public formula reproduces NBME's equating. The current CBSSA report already adjusts for form difficulty and reports an equated percent correct score, likely score range, low-pass range, and estimated probability of passing.",
  },
  {
    q: "Does NBME 30 still give a three-digit Step 1 score?",
    a: "Current CBSSA score reports use equated percent correct and an estimated probability of passing rather than the former three-digit Step 1 self-assessment score. Older screenshots and offline conversion discussions may use a different scale.",
  },
  {
    q: "What matters most on an NBME 30 report?",
    a: "Read the official estimated probability together with your likely CBSSA score range and its position relative to the Step 1 low-pass range. Consider testing conditions and your trajectory across more than one assessment.",
  },
  {
    q: "Is an NBME 30 result enough to decide my exam date?",
    a: "No single result is a guarantee. NBME advises considering all report information together, and borderline or discordant results should be discussed with your school or an academic advisor.",
  },
];

export default function Nbme30ScoreConversionPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NBME 30 Step 1 Score Report Reader",
            url: "https://nbmecalc.com/nbme-30-score-conversion",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "A free reader for comparing the score ranges printed on an NBME 30 CBSSA report.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: "NBME Score Conversion",
                item: "https://nbmecalc.com/nbme-score-conversion",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "NBME 30 Score Conversion",
                item: "https://nbmecalc.com/nbme-30-score-conversion",
              },
            ],
          }),
        }}
      />

      <PageHero
        badge="Step 1 · CBSSA Form 30"
        title="NBME 30 Score Conversion and Report Reader"
        description="Use the ranges already printed on your official CBSSA report. This page interprets Form 30 without presenting a community raw-score formula as an official conversion."
        size="md"
      />

      <section className="border-b border-gray-200 bg-mint-50/30 py-10 lg:py-14">
        <div className="container max-w-4xl">
          <Step1ScoreReportReader />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                The short answer on NBME 30 conversion
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-gray-700">
                <p>
                  Current CBSSA reports do not require a third-party wrong-answer
                  conversion. NBME reports an <strong>equated percent correct</strong>
                  score that is already adjusted for small form-difficulty
                  differences.
                </p>
                <p>
                  The report also shows a likely score range, the Step 1 low-pass
                  range, and an estimated probability of passing if you test
                  within one week. Those official fields are more useful than an
                  unofficial three-digit reconstruction.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-bold">Do not mix score scales</h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    A current EPC percentage, a legacy three-digit self-assessment
                    score, and a count of wrong answers are different inputs. A
                    calculator that silently treats them as interchangeable can
                    produce a confident-looking but meaningless result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-14 lg:py-20">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-mint-700" />
            <h2 className="text-3xl font-extrabold tracking-tight">
              Read the four report signals together
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [
                "Equated percent correct",
                "Your difficulty-adjusted mastery estimate on the current CBSSA scale.",
              ],
              [
                "Likely score range",
                "How much the CBSSA result could vary if repeated without a real change in knowledge.",
              ],
              [
                "Step 1 low-pass range",
                "The report's reference band for performance near the minimum passing standard.",
              ],
              [
                "Estimated probability",
                "NBME's time-sensitive estimate for testing within one week—not a guarantee.",
              ],
            ].map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 text-sm text-gray-700">
            Official references:{" "}
            <a
              href="https://www.nbme.org/cas_overview/cbssa-score-report/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              NBME CBSSA score-report update
            </a>{" "}
            and{" "}
            <a
              href="https://www.nbme.org/sites/default/files/2023-02/CBSSA_Guidance.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mint-800 underline underline-offset-4"
            >
              NBME readiness guidance
            </a>
            .
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14 lg:py-20">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="h-6 w-6 text-mint-700" />
            <h2 className="text-3xl font-extrabold tracking-tight">
              Use Form 30 as one checkpoint
            </h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-gray-700">
            Compare results only within the correct assessment family and keep
            testing conditions visible. A self-paced or repeated form is not
            equivalent to a fresh form taken under exam-like conditions.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/nbme-score-conversion">
                Open the NBME conversion hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/blog/how-to-read-nbme-score-report">
                Read the full score-report guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-mint-50/40 py-14 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            NBME 30 FAQs
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-bold text-gray-950">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
