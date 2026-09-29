import { Nav } from "@/components/sections/nav";
import { Footer } from "@/components/sections/footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
