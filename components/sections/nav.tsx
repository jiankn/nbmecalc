"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { invalidateSession, useSession } from "@/lib/auth/use-session";
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
      { label: "Step 3 CCS Cases", href: "/blog/step-3-ccs-cases-complete-walkthrough" },
    ],
  },
  { label: "Compare", href: "/compare/best-usmle-score-predictor" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

// Target for the primary "Get started" CTA. The calculator on the homepage
// is the wedge — not /login. Don't change this without thinking through
// the conversion impact.
const TRY_FREE_HREF = "/#calculator";

function getDisplayName(name: string | null, email: string): string {
  const normalizedName = name?.trim();
  return normalizedName || email.split("@")[0] || "Account";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function AccountAvatar({
  avatarUrl,
  displayName,
  className,
}: {
  avatarUrl: string | null;
  displayName: string;
  className: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(avatarUrl && failedUrl !== avatarUrl);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint-100 font-extrabold text-mint-900",
        className
      )}
      aria-hidden="true"
    >
      {showImage ? (
        // Google profile photos are small third-party assets. Loading them
        // directly avoids proxying personal avatars through image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          decoding="async"
          onError={() => setFailedUrl(avatarUrl)}
        />
      ) : (
        getInitials(displayName)
      )}
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  async function logout() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      invalidateSession();
      window.location.assign("/");
    }
  }

  const user = session.status === "authed" ? session.user : null;
  const displayName = user ? getDisplayName(user.name, user.email) : "";

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

        {/* Right side: auth-aware CTAs.
            Render skeleton (matching final widths) while session loads to
            avoid layout shift / flash-of-wrong-CTA. */}
        <div className="hidden md:flex items-center gap-3">
          {session.status === "loading" && (
            <>
              <div
                className="h-9 w-16 rounded-full bg-mint-400/40 animate-pulse"
                aria-hidden="true"
              />
              <div
                className="h-9 w-28 rounded-full bg-mint-400/40 animate-pulse"
                aria-hidden="true"
              />
            </>
          )}

          {session.status === "anon" && (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-base font-semibold text-black hover:opacity-70 transition"
              >
                Sign in
              </Link>
              <Button
                variant="secondary"
                size="md"
                className="border-0 bg-white hover:bg-gray-50"
                asChild
              >
                <Link href={TRY_FREE_HREF}>Get started</Link>
              </Button>
            </>
          )}

          {user && (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white p-1 text-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-mint-500"
                aria-expanded={accountOpen}
                aria-controls="account-menu"
                aria-haspopup="true"
                aria-label={`Account menu for ${displayName}`}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <AccountAvatar
                  avatarUrl={user.avatarUrl}
                  displayName={displayName}
                  className="h-9 w-9 text-xs"
                />
              </button>

              {accountOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 top-full pt-2"
                >
                  <div className="w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold text-gray-950">
                          {displayName}
                        </p>
                        <span className="shrink-0 rounded-full bg-mint-100 px-2 py-0.5 text-[11px] font-bold text-mint-900">
                          {user.proTier ? "Pro" : "Free"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="my-1 h-px bg-gray-100" />

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-mint-50 hover:text-mint-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
                      onClick={() => setAccountOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-mint-50 hover:text-mint-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
                      onClick={() => setAccountOpen(false)}
                    >
                      <CreditCard className="h-4 w-4" aria-hidden="true" />
                      {user.proTier ? "Manage subscription" : "View plans"}
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-mint-50 hover:text-mint-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      Account settings
                    </Link>

                    <div className="my-1 h-px bg-gray-100" />

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-500 disabled:cursor-wait disabled:opacity-50"
                      onClick={logout}
                      disabled={signingOut}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-black"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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

            {/* Mobile auth area — same three states, stacked. */}
            <div className="pt-3 mt-2 border-t border-mint-600 space-y-2">
              {session.status === "loading" && (
                <div className="h-12 mx-2 rounded-full bg-mint-400/40 animate-pulse" />
              )}

              {session.status === "anon" && (
                <>
                  <Link
                    href={TRY_FREE_HREF}
                    className="mx-2 flex items-center justify-center rounded-full bg-white py-3 font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get started
                  </Link>
                  <Link
                    href="/login"
                    className="block px-2 py-2 text-center text-sm font-semibold text-black/80"
                    onClick={() => setMobileOpen(false)}
                  >
                    Already have an account? Sign in
                  </Link>
                </>
              )}

              {user && (
                <div className="mx-2 overflow-hidden rounded-2xl bg-white">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                    <AccountAvatar
                      avatarUrl={user.avatarUrl}
                      displayName={displayName}
                      className="h-9 w-9 text-sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-950">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-mint-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-mint-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      <CreditCard className="h-4 w-4" aria-hidden="true" />
                      {user.proTier ? "Manage subscription" : "View plans"}
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-mint-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      Account settings
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
                      onClick={logout}
                      disabled={signingOut}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
