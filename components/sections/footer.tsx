import Link from "next/link";
import Image from "next/image";
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
      { label: "NBME Score Calculator", href: "/nbme-score-calculator" },
      { label: "NBME Forms Guide", href: "/nbme-calculator" },
      { label: "Methodology & Sources", href: "/methodology" },
      { label: "UWSA 1 → Step 1", href: "/uwsa-1-to-step-1" },
      { label: "UWSA 2 → Step 2", href: "/uwsa-2-to-step-2" },
      { label: "Study Plans", href: "/blog/category/study-plans" },
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
              Built by med students, for med students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://reddit.com/r/step2"
              target="_blank"
              rel="noopener nofollow"
              aria-label="Reddit r/Step2"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/10 transition"
            >
              <Image
                src="/images/reddit-snoo.webp"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="h-6 w-6 rounded-full"
              />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener nofollow"
              aria-label="X (Twitter)"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/10 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener nofollow"
              aria-label="Discord"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-white/40 hover:bg-white/10 transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09a.1.1 0 00-.07-.03c-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65a.09.09 0 00.1-.03c.4-.55.76-1.13 1.07-1.74a.1.1 0 00-.05-.13c-.57-.22-1.11-.48-1.64-.78a.1.1 0 01-.01-.16c.11-.08.22-.17.32-.25a.09.09 0 01.1-.01c3.44 1.57 7.16 1.57 10.56 0a.09.09 0 01.1.01c.11.09.22.17.33.26a.1.1 0 01-.01.16c-.52.31-1.07.56-1.64.78a.1.1 0 00-.05.13c.32.61.68 1.19 1.07 1.74a.09.09 0 00.1.03c1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95a.1.1 0 00-.04-.03zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
            </a>
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
