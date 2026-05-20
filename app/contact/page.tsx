import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Bug, Briefcase, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact — Get in Touch | NBMEcalc",
  description:
    "Email the NBMEcalc team for support, partnerships, press, or bug reports. We read every message.",
  alternates: { canonical: "https://nbmecalc.com/contact" },
  openGraph: {
    title: "Contact — Get in Touch | NBMEcalc",
    description:
      "Email the NBMEcalc team for support, partnerships, press, or bug reports. We read every message.",
    url: "https://nbmecalc.com/contact",
    type: "website",
  },
};

const channels = [
  {
    icon: Mail,
    title: "General questions",
    email: "hello@nbmecalc.com",
    body: "Pricing, accounts, anything that does not fit elsewhere.",
  },
  {
    icon: MessageCircle,
    title: "Customer support",
    email: "support@nbmecalc.com",
    body: "Login problems, missing reports, billing issues. We aim to reply within 24 hours.",
  },
  {
    icon: Bug,
    title: "Bug reports",
    email: "bugs@nbmecalc.com",
    body: "Found something broken? Tell us what you did and what you expected — screenshots welcome.",
  },
  {
    icon: Briefcase,
    title: "Partnerships & press",
    email: "press@nbmecalc.com",
    body: "Interview requests, content collaborations, affiliate inquiries. See our press kit.",
  },
  {
    icon: ShieldAlert,
    title: "Privacy / DMCA",
    email: "privacy@nbmecalc.com",
    body: "Data requests under GDPR/CCPA, DMCA notices, security disclosures.",
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        badge="Contact"
        title="We read every message"
        description="Pick the inbox below that fits best. We typically respond within one business day."
        size="md"
      />

      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {channels.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group rounded-3xl border border-gray-200 bg-white p-7 hover:border-mint-400 hover:shadow-lg transition"
              >
                <div className="h-11 w-11 rounded-2xl bg-mint-100 flex items-center justify-center mb-4 group-hover:bg-mint-200 transition">
                  <c.icon className="h-5 w-5 text-mint-700" />
                </div>
                <h3 className="font-bold text-lg mb-1 text-gray-950">
                  {c.title}
                </h3>
                <div className="font-mono text-sm text-mint-700 font-semibold mb-3 group-hover:text-mint-800">
                  {c.email}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {c.body}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-gray-50 border border-gray-200 p-8 text-center">
            <h3 className="font-bold text-xl mb-2">
              Looking for something else?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Most common answers live in our FAQ on the home page or in our
              detailed pricing page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#faq"
                className="inline-flex items-center justify-center rounded-full bg-mint-500 hover:bg-mint-600 text-black font-semibold px-6 py-3 transition"
              >
                Read FAQ
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-500 px-6 py-3 font-semibold transition"
              >
                Pricing details
              </Link>
            </div>
          </div>

          {/* Mailing address */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              <strong className="text-gray-900">Mailing address:</strong> For
              official correspondence, request our current mailing address by
              emailing{" "}
              <a
                href="mailto:hello@nbmecalc.com"
                className="text-mint-700 font-semibold underline"
              >
                hello@nbmecalc.com
              </a>
              .
            </p>
            <p className="mt-2">
              We are a fully remote team. There is no walk-in office.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
