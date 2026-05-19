import { Nav } from "@/components/sections/nav";
import { Footer } from "@/components/sections/footer";
import { CookieBanner } from "@/components/sections/cookie-banner";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
