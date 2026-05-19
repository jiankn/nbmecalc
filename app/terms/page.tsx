import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { LegalContent } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service — NBMEcalc",
  description:
    "Terms governing your use of NBMEcalc — the USMLE Step score predictor. Subscription, refund, and acceptable use policies.",
  alternates: { canonical: "https://nbmecalc.com/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        badge="Legal"
        title="Terms of Service"
        description="Plain-English terms that govern your use of NBMEcalc."
        size="sm"
      />

      <LegalContent lastUpdated="May 17, 2026">
        <h2>1. Agreement</h2>
        <p>
          By accessing or using <strong>nbmecalc.com</strong> (the
          &quot;Service&quot;), you agree to these Terms of Service
          (&quot;Terms&quot;). If you do not agree, do not use the Service.
        </p>
        <p>
          The Service is operated by NBMEcalc (&quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;), a digital product. Reach us at{" "}
          <a href="mailto:hello@nbmecalc.com">hello@nbmecalc.com</a>.
        </p>

        <h2>2. The Service</h2>
        <p>
          NBMEcalc is a statistical predictor that estimates a likely USMLE
          Step score from practice exam inputs (NBME, UWSA, Free 120, AMBOSS,
          CMS Form). Predictions include a 95% confidence interval and a
          percentile ranking.
        </p>

        <blockquote>
          <strong>Important:</strong> Predictions are <em>estimates</em> for
          educational purposes only. Actual exam scores depend on factors we
          cannot model (test-day performance, content domains, scoring
          changes). Predictions are not guarantees and must not be the sole
          basis for any academic, financial, or career decision.
        </blockquote>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 16 years old and have legal capacity to form a
          binding contract.
        </p>

        <h2>4. Accounts</h2>
        <p>
          You can use the basic predictor without an account. Saving
          predictions, downloading reports, or subscribing to Pro requires
          creating a free account using a valid email address.
        </p>
        <p>You agree to:</p>
        <ul>
          <li>Provide a real, accessible email address.</li>
          <li>Keep your magic-link emails private — anyone with access can log in.</li>
          <li>Notify us promptly of any unauthorized access.</li>
          <li>Not share, sell, or transfer your account.</li>
        </ul>

        <h2>5. Plans, billing, and renewal</h2>

        <h3>5.1 Free</h3>
        <p>Anonymous predictions and limited dashboard. No payment required.</p>

        <h3>5.2 Single Report ($14.99 one-time)</h3>
        <p>
          One-time purchase that unlocks a single PDF report tied to one
          prediction. Delivered by email within 60 seconds. Non-refundable
          once delivered.
        </p>

        <h3>5.3 Pro ($9.99/mo or $79/year)</h3>
        <p>
          Recurring subscription billed monthly or annually. We email a
          renewal notice 7 days before each charge. You can cancel at any
          time from your dashboard.
        </p>
        <ul>
          <li>
            <strong>Auto-renewal:</strong> Subscriptions renew automatically
            until canceled.
          </li>
          <li>
            <strong>Cancellation:</strong> Cancel anytime — you keep access
            until the end of the current billing period. After that, the
            dashboard becomes read-only.
          </li>
          <li>
            <strong>Price changes:</strong> We will email at least 30 days
            before any price change. Your existing rate is honored until your
            next renewal.
          </li>
        </ul>

        <h3>5.4 Refunds</h3>
        <p>
          Digital products are <strong>non-refundable</strong> once delivered.
          Pro subscriptions are eligible for a 7-day refund if no PDF report
          has been downloaded. Email{" "}
          <a href="mailto:hello@nbmecalc.com">hello@nbmecalc.com</a> to request
          a refund.
        </p>

        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Reverse-engineer or scrape the Service.</li>
          <li>Use bots, scripts, or automation to flood predictions.</li>
          <li>Resell, sublicense, or redistribute reports.</li>
          <li>Submit false data to manipulate aggregates.</li>
          <li>Use the Service to harass, defame, or harm others.</li>
          <li>Violate applicable laws or others&apos; rights.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          this section.
        </p>

        <h2>7. Intellectual property</h2>
        <ul>
          <li>
            <strong>Our IP:</strong> All Service content (algorithm, designs,
            text, graphics, code) is owned by NBMEcalc or our licensors and is
            protected by copyright and other laws.
          </li>
          <li>
            <strong>Your IP:</strong> You retain ownership of the scores and
            notes you input. You grant us a non-exclusive, worldwide,
            royalty-free license to use anonymized aggregates to improve the
            algorithm.
          </li>
          <li>
            <strong>Trademarks:</strong> NBME, USMLE, UWorld, AMBOSS, etc. are
            trademarks of their respective owners. We are not affiliated with,
            endorsed by, or sponsored by any of them.
          </li>
        </ul>

        <h2>8. Disclaimers</h2>
        <p>
          <strong>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot;.
          </strong>{" "}
          To the maximum extent allowed by law, we disclaim all warranties,
          express or implied, including merchantability, fitness for a
          particular purpose, accuracy, and non-infringement.
        </p>
        <p>
          We make no guarantee that predictions match actual exam scores. You
          assume all risk of relying on predictions.
        </p>

        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent allowed by law, our aggregate liability for
          any claim arising from the Service is limited to the amount you paid
          us in the 12 months before the claim, or USD $50, whichever is
          greater.
        </p>
        <p>
          We are not liable for indirect, incidental, consequential,
          exemplary, or punitive damages — including lost test scores, lost
          residency placements, or lost revenue.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless NBMEcalc and its officers
          from any claim, loss, or expense arising from your breach of these
          Terms or misuse of the Service.
        </p>

        <h2>11. Termination</h2>
        <p>
          You can stop using the Service at any time. We may suspend or
          terminate access if you violate these Terms or for security or
          operational reasons. Sections 7-12 survive termination.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We may update these Terms. Material changes will be notified by
          email at least 30 days in advance. Continued use after changes go
          into effect means you accept the updated Terms.
        </p>

        <h2>13. Governing law &amp; dispute resolution</h2>
        <p>
          These Terms are governed by the laws of the United States and
          relevant state law where NBMEcalc is operated. Disputes will first
          be resolved by good-faith negotiation. If unresolved, disputes go to
          binding arbitration; you waive class-action rights to the extent
          permitted by law.
        </p>

        <h2>14. Severability</h2>
        <p>
          If any provision is found unenforceable, the remaining provisions
          stay in effect.
        </p>

        <h2>15. Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href="mailto:hello@nbmecalc.com">hello@nbmecalc.com</a> or visit{" "}
          <Link href="/contact">our contact page</Link>.
        </p>
      </LegalContent>
    </PageShell>
  );
}
