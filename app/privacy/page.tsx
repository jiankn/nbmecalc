import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { LegalContent } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy — NBMEcalc",
  description:
    "How NBMEcalc collects, uses, and protects your personal data. GDPR & CCPA compliant. We never sell your data.",
  alternates: { canonical: "https://nbmecalc.com/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — NBMEcalc",
    description:
      "How NBMEcalc collects, uses, and protects your personal data. GDPR & CCPA compliant. We never sell your data.",
    url: "https://nbmecalc.com/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        badge="Legal"
        title="Privacy Policy"
        description="Plain-language explanation of what we collect, why, and how to control it."
        size="sm"
      />

      <LegalContent lastUpdated="August 10, 2026">
        <h2>1. Who we are</h2>
        <p>
          nbmecalc.com (&quot;NBMEcalc&quot;, &quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;) operates a USMLE Step score predictor at{" "}
          <Link href="/">https://nbmecalc.com</Link>. This Privacy Policy
          explains what we collect, why, and how to exercise your rights.
        </p>
        <p>
          For privacy questions or to exercise rights described below, email{" "}
          <a href="mailto:privacy@nbmecalc.com">privacy@nbmecalc.com</a>.
        </p>

        <h2>2. Information we collect</h2>

        <h3>2.1 Information you provide</h3>
        <ul>
          <li>
            <strong>Email address</strong> — when you create an account, sign
            in, buy a report, or contact support.
          </li>
          <li>
            <strong>Practice exam scores</strong> — NBME, UWSA, Free 120,
            AMBOSS, CMS Form scores you enter into the predictor.
          </li>
          <li>
            <strong>Payment information</strong> — handled by{" "}
            <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
              Stripe
            </a>
            . We never see or store your full card number.
          </li>
        </ul>

        <h3>2.2 Information collected automatically</h3>
        <ul>
          <li>
            <strong>Usage data</strong> — pages visited, predictions run,
            features used (via Cloudflare Web Analytics and our first-party
            product event log).
          </li>
          <li>
            <strong>Device data</strong> — browser type, OS, screen size,
            country (city-level only), referrer.
          </li>
          <li>
            <strong>Cookies</strong> — see <a href="#cookies">Section 7</a>.
          </li>
        </ul>

        <h2>3. How we use your data</h2>
        <ul>
          <li>To run the score predictor and return your results.</li>
          <li>
            To send prediction PDFs, account confirmations, security messages,
            and service-related support.
          </li>
          <li>To improve the algorithm — only aggregated, anonymized data.</li>
          <li>To prevent abuse and rate-limit requests.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <p>
          <strong>We never sell, rent, or trade your personal data.</strong>{" "}
          We never share predictor inputs with third parties for advertising.
        </p>

        <h2>4. Legal bases (GDPR)</h2>
        <ul>
          <li>
            <strong>Contract</strong> — to deliver the service you signed up
            for.
          </li>
          <li>
            <strong>Legitimate interest</strong> — basic usage analytics, fraud
            prevention.
          </li>
          <li>
            <strong>Consent</strong> — optional outcome feedback and advertising
            cookies where consent is required. You can withdraw consent through
            the applicable control.
          </li>
          <li>
            <strong>Legal obligation</strong> — tax records, lawful requests.
          </li>
        </ul>

        <h2>5. Data sharing</h2>
        <p>We share data only with these processors, under data-processing agreements:</p>
        <ul>
          <li>
            <strong>Cloudflare</strong> — hosting, CDN, security, edge database
            (D1), and file storage (R2). Processing locations depend on the
            configured Cloudflare services and applicable provider terms.
          </li>
          <li>
            <strong>Stripe</strong> — payment processing.
          </li>
          <li>
            <strong>Postal</strong> — transactional email delivery.
          </li>
          <li>
            <strong>Cloudflare Web Analytics</strong> — aggregate traffic and
            performance analytics.
          </li>
          <li>
            <strong>Google AdSense</strong> — advertising on eligible public
            pages. Google and its advertising partners may use cookies, IP
            addresses, or similar identifiers to serve, measure, and prevent
            fraud in ads. We do not send your practice-exam inputs to Google as
            advertising targeting parameters.
          </li>
        </ul>
        <p>
          We may also disclose data when required by law or to protect rights,
          property, or safety.
        </p>

        <h2>6. Data retention</h2>
        <ul>
          <li>
            <strong>Active account data</strong> — kept until you delete your
            account.
          </li>
          <li>
            <strong>Account predictions</strong> — kept until you delete them
            or your account. Anonymous calculation snapshots and first-party
            funnel events are retained for up to 12 months, then deleted or
            aggregated.
          </li>
          <li>
            <strong>Payment records</strong> — 7 years (tax law).
          </li>
          <li>
            <strong>Magic Link tokens</strong> — auto-deleted 1 hour after
            issue.
          </li>
          <li>
            <strong>Analytics events</strong> — 12 months, then aggregated.
          </li>
        </ul>

        <h2 id="cookies">7. Cookies</h2>
        <p>We use a minimal cookie set:</p>
        <ul>
          <li>
            <strong>Session cookie</strong> (<code>nb_session</code>) — keeps
            you logged in. Expires after 30 days. Strictly necessary.
          </li>
          <li>
            <strong>Disclaimer acknowledgment</strong> (
            <code>nbmecalc_disclaimer_ack</code>) — remembers for 30 days that
            you dismissed the educational-use notice. Stored locally in your
            browser.
          </li>
          <li>
            <strong>Analytics</strong> — Cloudflare Web Analytics is designed
            to operate without cross-site tracking cookies. First-party funnel
            events are stored server-side according to the retention period above.
          </li>
          <li>
            <strong>Advertising</strong> — Google and third-party advertising
            vendors may place or read cookies and use web beacons or IP
            addresses when ads are enabled. Where required, advertising loads
            only under the choices collected by a Google-certified consent
            management platform. You can manage personalized advertising in
            your consent choices or through Google Ads Settings.
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings and, where
          displayed, the advertising consent controls.
        </p>

        <h2>8. Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> a copy of your data — request it from{" "}
            <a href="mailto:privacy@nbmecalc.com">privacy@nbmecalc.com</a>.
          </li>
          <li>
            <strong>Rectify</strong> inaccurate account data — contact us if a
            field cannot be corrected through the available account controls.
          </li>
          <li>
            <strong>Erase</strong> your account data — use{" "}
            <em>Settings → Delete account</em> or contact us. Records that must
            be retained for fraud, tax, or legal purposes follow their stated
            retention periods.
          </li>
          <li>
            <strong>Restrict / object to</strong> processing — email{" "}
            <a href="mailto:privacy@nbmecalc.com">privacy@nbmecalc.com</a>.
          </li>
          <li>
            <strong>Data portability</strong> — request a machine-readable copy
            of applicable account data by email. A self-service export is not
            currently available.
          </li>
          <li>
            <strong>Lodge a complaint</strong> with your local supervisory
            authority (e.g. ICO in the UK, CNIL in France).
          </li>
        </ul>
        <p>EU residents: this includes all GDPR rights. California residents: this includes CCPA rights.</p>

        <h2>9. International transfers</h2>
        <p>
          Our service providers may process data in multiple countries. Where
          cross-border safeguards are required, we rely on the provider&apos;s
          applicable data-protection terms and transfer mechanisms. Contact us
          for the current processor information relevant to your request.
        </p>

        <h2>10. Children</h2>
        <p>
          The service is not intended for users under 16. We do not knowingly
          collect data from children. If you believe a child has signed up,
          email us and we will delete the account.
        </p>

        <h2>11. Security</h2>
        <ul>
          <li>HTTPS is used for the public service.</li>
          <li>Hosting and database safeguards are provided through Cloudflare.</li>
          <li>Magic Link tokens are single-use, expire in 1 hour.</li>
          <li>No card data stored on our servers — Stripe handles all payments.</li>
          <li>Access controls and rate limits protect account and prediction routes.</li>
        </ul>

        <h2>12. Changes to this policy</h2>
        <p>
          We will post material changes on this page and provide additional
          notice where required. The &quot;Last updated&quot; date above identifies
          the current published version.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions? <a href="mailto:privacy@nbmecalc.com">privacy@nbmecalc.com</a>{" "}
          or <Link href="/contact">our contact page</Link>.
        </p>
      </LegalContent>
    </PageShell>
  );
}
