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

      <LegalContent lastUpdated="May 17, 2026">
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
            <strong>Email address</strong> — when you create an account, buy a
            report, or subscribe to our newsletter.
          </li>
          <li>
            <strong>Practice exam scores</strong> — NBME, UWSA, Free 120,
            AMBOSS, CMS Form scores you enter into the predictor.
          </li>
          <li>
            <strong>Optional profile data</strong> — target exam date, school
            type (US MD/DO/IMG), notes you choose to add.
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
            features used (via privacy-friendly Plausible Analytics —
            cookieless, no fingerprinting).
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
            To send the prediction PDF, account confirmations, and (if you
            opted in) study tips and product updates.
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
            <strong>Consent</strong> — marketing emails, optional cookies. You
            can withdraw consent any time.
          </li>
          <li>
            <strong>Legal obligation</strong> — tax records, lawful requests.
          </li>
        </ul>

        <h2>5. Data sharing</h2>
        <p>We share data only with these processors, under data-processing agreements:</p>
        <ul>
          <li>
            <strong>Cloudflare</strong> — hosting, CDN, edge database (D1) and
            file storage (R2). Region-aware: EU data stays in EU edge nodes.
          </li>
          <li>
            <strong>Stripe</strong> — payment processing.
          </li>
          <li>
            <strong>Postal SMTP</strong> — transactional and marketing email
            delivery.
          </li>
          <li>
            <strong>Plausible Analytics</strong> — privacy-friendly,
            cookieless web analytics.
          </li>
          <li>
            <strong>Sentry</strong> — error monitoring (no PII captured).
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
            <strong>Predictions</strong> — kept until you delete them or your
            account.
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
            <strong>Cookie banner state</strong> (<code>nb_cookies</code>) —
            remembers your cookie choice for 30 days. Strictly necessary.
          </li>
          <li>
            <strong>Analytics</strong> — none. Plausible is cookieless.
          </li>
        </ul>
        <p>
          You can control cookies via your browser settings or our cookie
          banner.
        </p>

        <h2>8. Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> a copy of your data — export as JSON from
            your dashboard.
          </li>
          <li>
            <strong>Rectify</strong> inaccurate data — edit in your dashboard.
          </li>
          <li>
            <strong>Erase</strong> your data — one-click delete from{" "}
            <em>Settings → Delete account</em>. Hard-deletes within 30 days.
          </li>
          <li>
            <strong>Restrict / object to</strong> processing — email{" "}
            <a href="mailto:privacy@nbmecalc.com">privacy@nbmecalc.com</a>.
          </li>
          <li>
            <strong>Data portability</strong> — JSON export covers everything.
          </li>
          <li>
            <strong>Lodge a complaint</strong> with your local supervisory
            authority (e.g. ICO in the UK, CNIL in France).
          </li>
        </ul>
        <p>EU residents: this includes all GDPR rights. California residents: this includes CCPA rights.</p>

        <h2>9. International transfers</h2>
        <p>
          Cloudflare provides region-aware data residency. EU user data is
          stored in EU edge locations. Where data is transferred outside the
          EEA (e.g. Stripe in the US), we rely on Standard Contractual Clauses.
        </p>

        <h2>10. Children</h2>
        <p>
          The service is not intended for users under 16. We do not knowingly
          collect data from children. If you believe a child has signed up,
          email us and we will delete the account.
        </p>

        <h2>11. Security</h2>
        <ul>
          <li>HTTPS everywhere with HSTS.</li>
          <li>Data encrypted at rest in Cloudflare D1.</li>
          <li>Magic Link tokens are single-use, expire in 1 hour.</li>
          <li>No card data stored on our servers — Stripe handles all payments.</li>
          <li>Strict Content Security Policy.</li>
        </ul>

        <h2>12. Changes to this policy</h2>
        <p>
          We will email registered users at least 30 days before any material
          change. The &quot;Last updated&quot; date above always reflects the
          current version.
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
