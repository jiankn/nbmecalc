import type { Metadata } from "next";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { LogoWall } from "@/components/sections/logo-wall";
import { ValueProps } from "@/components/sections/value-props";
import { Calculator } from "@/components/sections/calculator";
import { Reviews } from "@/components/sections/reviews";
import { Stats } from "@/components/sections/stats";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Comparison } from "@/components/sections/comparison";
import { Pricing } from "@/components/sections/pricing";
import { ResourceHub } from "@/components/sections/resource-hub";
import { Reviewers } from "@/components/sections/reviewers";
import { FAQ } from "@/components/sections/faq";
import { BlogGrid } from "@/components/sections/blog-grid";
import { Footer } from "@/components/sections/footer";
import { CookieBanner } from "@/components/sections/cookie-banner";

const homeTitle = "NBME Score Calculator & USMLE Step Predictor | NBMEcalc";
const homeDescription =
  "Free NBME score calculator and USMLE Step predictor. Convert NBME, UWSA, Free 120, AMBOSS, and CMS scores into a Step 1, Step 2 CK, or Step 3 prediction with confidence intervals.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/feature-score-range.png",
        width: 2400,
        height: 1792,
        alt: "NBMEcalc score prediction dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/images/feature-score-range.png"],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NBMEcalc",
    url: "https://nbmecalc.com",
    description: homeDescription,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "NBMEcalc",
      url: "https://nbmecalc.com",
      logo: "https://nbmecalc.com/icon.svg",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NBMEcalc",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    url: "https://nbmecalc.com",
    description: homeDescription,
    isAccessibleForFree: true,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "medical student",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <ValueProps />
        <Calculator />
        <Reviews />
        <Stats />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <ResourceHub />
        <Reviewers />
        <FAQ />
        <BlogGrid />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
