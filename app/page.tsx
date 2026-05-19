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

export default function HomePage() {
  return (
    <>
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
