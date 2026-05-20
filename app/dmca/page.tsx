import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { LegalContent } from "@/components/legal-content";

export const metadata: Metadata = {
  title: "DMCA Notice — NBMEcalc",
  description:
    "How to submit a DMCA takedown notice and counter-notice for content on nbmecalc.com.",
  alternates: { canonical: "https://nbmecalc.com/dmca" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "DMCA Notice — NBMEcalc",
    description:
      "How to submit a DMCA takedown notice and counter-notice for content on nbmecalc.com.",
    url: "https://nbmecalc.com/dmca",
    type: "website",
  },
};

export default function DMCAPage() {
  return (
    <PageShell>
      <PageHero
        badge="Legal"
        title="DMCA Notice & Takedown Policy"
        description="How to report copyright infringement on NBMEcalc."
        size="sm"
      />

      <LegalContent lastUpdated="May 17, 2026">
        <h2>1. About this policy</h2>
        <p>
          NBMEcalc respects the intellectual property of others. In accordance
          with the Digital Millennium Copyright Act (17 U.S.C. § 512), we
          respond to clear notices of alleged copyright infringement.
        </p>

        <h2>2. Designated DMCA agent</h2>
        <p>Send DMCA notices to our designated agent:</p>
        <p>
          <strong>NBMEcalc — DMCA Agent</strong>
          <br />
          Email: <a href="mailto:dmca@nbmecalc.com">dmca@nbmecalc.com</a>
          <br />
          Subject line: <code>DMCA Takedown Notice</code>
        </p>

        <h2>3. Submitting a takedown notice</h2>
        <p>
          Your notice must include all of the following (per 17 U.S.C. §
          512(c)(3)):
        </p>
        <ol>
          <li>
            A physical or electronic signature of the copyright owner or
            authorized agent.
          </li>
          <li>
            Identification of the copyrighted work claimed to be infringed.
          </li>
          <li>
            Identification of the allegedly infringing material — including
            the exact URL on nbmecalc.com.
          </li>
          <li>
            Your contact information: name, mailing address, phone, email.
          </li>
          <li>
            A statement that you have a good-faith belief that the use is not
            authorized by the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the information in
            the notice is accurate and that you are the copyright owner or
            authorized to act on the owner&apos;s behalf.
          </li>
        </ol>
        <p>
          <strong>Incomplete notices may be rejected.</strong> Misrepresenting
          a claim of infringement is illegal under 17 U.S.C. § 512(f) and may
          subject you to liability.
        </p>

        <h2>4. Our response</h2>
        <p>
          On receipt of a complete and good-faith notice, we will:
        </p>
        <ul>
          <li>Remove or disable access to the disputed content promptly.</li>
          <li>Notify the user who posted the content (if applicable).</li>
          <li>Forward your notice to that user.</li>
          <li>Terminate accounts of repeat infringers.</li>
        </ul>

        <h2>5. Counter-notice procedure</h2>
        <p>
          If you believe content was removed in error, you may submit a
          counter-notice to <a href="mailto:dmca@nbmecalc.com">dmca@nbmecalc.com</a>{" "}
          with:
        </p>
        <ol>
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the material and its location before removal.
          </li>
          <li>
            A statement, under penalty of perjury, that you have a good-faith
            belief the material was removed by mistake or misidentification.
          </li>
          <li>
            Your name, address, phone, and email — plus consent to the
            jurisdiction of a US federal court in your district (or our
            district if you are outside the US).
          </li>
        </ol>
        <p>
          We will forward your counter-notice to the original complainant. If
          they do not file a court action within 10-14 business days, we may
          restore the content.
        </p>

        <h2>6. Repeat infringers</h2>
        <p>
          Accounts of users we identify as repeat infringers will be
          terminated.
        </p>

        <h2>7. Other inquiries</h2>
        <p>
          For non-DMCA legal matters, see our{" "}
          <Link href="/terms">Terms of Service</Link> or contact{" "}
          <a href="mailto:hello@nbmecalc.com">hello@nbmecalc.com</a>.
        </p>
      </LegalContent>
    </PageShell>
  );
}
