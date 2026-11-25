"use client";

import { trackProductEvent } from "@/lib/product-events";

const resources = [
  {
    title: "Open the 137-question PDF",
    description: "The June 2026 booklet has 137 multiple-choice questions and an answer key for offline practice.",
    href: "https://www.usmle.org/sites/default/files/2021-10/Step3_Sample_Items.pdf",
    placement: "step3_sample_pdf",
  },
  {
    title: "Open the interactive practice",
    description: "Use the test software, try item formats such as audio, and practice computer-based case simulations (CCS).",
    href: "https://www.starttest.com/custom/usmle/?stpf3",
    placement: "step3_sample_interactive",
  },
] as const;

export function Step3SampleResources() {
  return (
    <section id="free-137" className="scroll-mt-24 border-t border-gray-200 bg-mint-50/40 py-12 lg:py-16">
      <div className="container max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 lg:text-3xl">Step 3 Free 137 sample questions</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          Free 137 refers to the 137 multiple-choice questions in the official USMLE Step 3 PDF. USMLE also
          offers an interactive practice version for learning the exam software.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {resources.map(({ title, description, href, placement }) => (
            <div key={placement} className="rounded-2xl border border-mint-200 bg-white p-5">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-evidence-source="primary"
                onClick={() => trackProductEvent("practice_resource_clicked", { path: "/step-3-predictor", placement })}
                className="font-bold text-mint-800 underline underline-offset-4"
              >
                {title}
              </a>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{description}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-700">
          The calculator&apos;s existing &ldquo;Free 120&rdquo; field takes a raw percent correct and has no
          version-specific calibration for either set of official Step 3 sample materials.
        </p>
      </div>
    </section>
  );
}
