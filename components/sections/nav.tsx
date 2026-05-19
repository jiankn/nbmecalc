"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Step 1",
    children: [
      { label: "Step 1 Predictor", href: "/step-1-predictor" },
      { label: "NBME → Step 1", href: "/nbme-score-conversion#step1" },
      { label: "UWSA → Step 1", href: "/uwsa-1-to-step-1" },
    ],
  },
  {
    label: "Step 2 CK",
    children: [
      { label: "Step 2 Predictor", href: "/step-2-predictor" },
      { label: "NBME → Step 2", href: "/nbme-score-conversion" },
      { label: "Free 120 → Step 2", href: "/free-120-predictor" },
      { label: "AMBOSS → Step 2", href: "/amboss-converter" },
    ],
  },
  {
    label: "Step 3",
    children: [
      { label: "Step 3 Predictor", href: "/step-3-predictor" },
      { label: "Step 3 CCS Cases", href: "/blog/step-3-ccs-guide" },
    ],
  },
  { label: "Compare", href: "/compare/best-usmle-score-predictor" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        "bg-mint-500",
        scrolled && "shadow-sm backdrop-blur-md bg-mint-500/95"
      )}
    >
      <div className="container flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo width={180} height={40} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-base font-semibold text-black hover:opacity-70 transition">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-mint-50 hover:text-mint-800 transition"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="px-4 py-2 text-base font-semibold text-black hover:opacity-70 transition"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            className="hidden md:inline-flex bg-white border-0 hover:bg-gray-50"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
          <button
            className="lg:hidden p-2 text-black"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-mint-600 bg-mint-500">
          <div className="container py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <details key={item.label} className="group">
                  <summary className="flex items-center justify-between px-2 py-3 font-semibold cursor-pointer">
                    {item.label}
                    <ChevronDown className="h-4 w-4 group-open:rotate-180 transition" />
                  </summary>
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-2 py-2 text-sm text-black/80 hover:text-black"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="block px-2 py-3 font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/login"
              className="block mt-2 mx-2 rounded-full bg-white text-center py-3 font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
