import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { LegalContent } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — NBMEcalc",
  description:
    "Our policy on affiliate links and sponsored content. FTC-compliant disclosure.",
  alternates: { canonical: "https://nbmecalc.com/affiliate-disclosure" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Affiliate Disclosure — NBMEcalc",
    description:
      "Our policy on affiliate links and sponsored content. FTC-compliant disclosure.",
    url: "https://nbmecalc.com/affiliate-disclosure",
    type: "website",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <PageShell>
      <PageHero
        badge="Legal"
        title="Affiliate Disclosure"
        description="Our policy on affiliate links and sponsored content."
        size="sm"
      />

      <LegalContent lastUpdated="August 10, 2026">
        <h2>1. The short version</h2>
        <p>
          NBMEcalc does not currently publish active affiliate links. Links to
          NBME, USMLE, AMBOSS, UWorld, and other resources are presently
          provided as references or product-information sources, not as paid
          endorsements.
        </p>
        <p>
          If an affiliate relationship is activated later, the material
          connection will be disclosed next to the link and before any review
          or comparison that could be affected. We do not claim personal use or
          medical-reviewer endorsement without verifiable evidence.
        </p>

        <h2>2. FTC compliance</h2>
        <p>
          Per Federal Trade Commission guidelines (16 CFR Part 255), we
          disclose all material connections that could reasonably affect the
          credibility of our recommendations.
        </p>

        <h2>3. How we mark affiliate links</h2>
        <ul>
          <li>
            Affiliate links are marked with a small{" "}
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              affiliate
            </span>{" "}
            badge near the link.
          </li>
          <li>
            Blog posts containing affiliate links include a notice at the top.
          </li>
          <li>
            Comparison tables note clearly when a competing product is also
            an affiliate partner.
          </li>
        </ul>

        <h2>4. Our editorial principles</h2>
        <ul>
          <li>
            <strong>No pay-for-placement.</strong> Reviews and rankings are
            never influenced by commission rates.
          </li>
          <li>
            <strong>Editorial veto.</strong> Any product we mention must pass
            our internal editorial review before inclusion.
          </li>
          <li>
            <strong>Cons listed.</strong> We list weaknesses of products we
            recommend, including those we earn commissions from.
          </li>
          <li>
            <strong>No exclusivity deals.</strong> We are not obligated to
            recommend any single brand.
          </li>
        </ul>

        <h2>5. Current affiliate partners</h2>
        <p>
          Current active affiliate programs:
        </p>
        <ul>
          <li>None as of August 10, 2026.</li>
        </ul>
        <p>
          We are <strong>not</strong> affiliated with NBME, USMLE-Rx, Kaplan
          Medical, or USMLE Boards. We never receive commissions from
          score-prediction competitors.
        </p>

        <h2>6. Sponsored content</h2>
        <p>
          We do not currently accept sponsored posts or paid reviews. If we
          ever do, the post will be clearly labeled <strong>SPONSORED</strong>{" "}
          at the top and disclosed before any other content.
        </p>

        <h2>7. Questions?</h2>
        <p>
          Email <a href="mailto:hello@nbmecalc.com">hello@nbmecalc.com</a> or
          visit <Link href="/contact">our contact page</Link>. We are happy to
          confirm whether a specific link is an affiliate link.
        </p>
      </LegalContent>
    </PageShell>
  );
}
