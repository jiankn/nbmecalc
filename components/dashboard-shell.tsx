"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, History, TrendingUp, Settings, CreditCard, LogOut, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/predictions", label: "Predictions", icon: History },
  { href: "/dashboard/timeline", label: "Timeline", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export interface DashboardUser {
  id: string;
  email: string;
  name: string | null;
  proTier: string | null;
  proExpiresAt: number | null;
}

/**
 * Client-side dashboard layout. Handles auth gating: fetches /api/user/me
 * (predictions endpoint returns 401 if no session); on 401 redirects to login.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Probe with the predictions endpoint (cheap, returns 401 when unauth).
    fetch("/api/user/predictions?limit=1")
      .then(async (res) => {
        if (res.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        // For now we don't have a /api/user/me endpoint — synthesize from
        // the cookie-side info. In future: separate endpoint.
        setUser({
          id: "",
          email: "",
          name: null,
          proTier: null,
          proExpiresAt: null,
        });
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => setChecking(false));
  }, [pathname, router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo width={140} height={32} />
          </Link>
          <div className="flex items-center gap-3">
            {user.proTier && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-800">
                <Sparkles className="h-3 w-3" />
                Pro
              </span>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-white transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <nav className="space-y-1 sticky top-24">
              {navItems.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-mint-100 text-mint-800"
                        : "text-gray-600 hover:bg-white hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
