import Link from "next/link";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Predictors",
    links: [
      { label: "Step 1 Predictor", href: "/step-1-predictor" },
      { label: "Step 2 CK Predictor", href: "/step-2-predictor" },
      { label: "Step 3 Predictor", href: "/step-3-predictor" },
      { label: "Free 120 Predictor", href: "/free-120-predictor" },
      { label: "AMBOSS Converter", href: "/amboss-converter" },
      { label: "CMS Form Converter", href: "/cms-converter" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "NBME Score Conversion", href: "/nbme-score-conversion" },
      { label: "NBME Score Calculator", href: "/" },
      { label: "NBME Forms Guide", href: "/nbme-calculator" },
      { label: "CMS Forms Step 2 Guide", href: "/cms-forms-step-2-ck" },
      { label: "Methodology & Sources", href: "/methodology" },
      { label: "Validation Status", href: "/validation" },
      { label: "For Educators & Libraries", href: "/educators" },
      { label: "UWSA 1 → Step 1", href: "/uwsa-1-to-step-1" },
      { label: "UWSA 2 → Step 2", href: "/uwsa-2-to-step-2" },
      { label: "Step 2 High-Yield Topics", href: "/blog/most-tested-topics-step-2-ck" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs PredictMyStepScore", href: "/compare/vs-predictmystepscore" },
      { label: "vs AMBOSS Predictor", href: "/compare/vs-amboss-predictor" },
      { label: "vs NBcalc", href: "/compare/vs-nbcalc" },
      { label: "Best USMLE Predictors", href: "/compare/best-usmle-score-predictor" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
      { label: "DMCA", href: "/dmca" },
      { label: "Contact", href: "/contact" },
      { label: "Press Kit", href: "/press" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10">
      <div className="container py-16">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-mint-400 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-white/10 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Logo width={150} height={32} variant="white" />
            <p className="text-xs text-gray-400 mt-2 max-w-md">
              Independent USMLE score-planning tool with public assumptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold">
            <Link href="/contact" className="text-gray-300 underline underline-offset-4 hover:text-mint-300">
              Contact
            </Link>
            <Link href="/methodology#editorial-standards" className="text-gray-300 underline underline-offset-4 hover:text-mint-300">
              Editorial standards
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">
            © 2026 nbmecalc.com. All rights reserved. NBMEcalc is not
            affiliated with, endorsed by, or sponsored by NBME, FSMB, USMLE,
            USMLE-Rx, AMBOSS, UWorld, or Kaplan. Predictions are statistical
            estimates for educational purposes only and should not be the sole
            basis for any academic or professional decision.
          </p>
        </div>
      </div>
    </footer>
  );
}
