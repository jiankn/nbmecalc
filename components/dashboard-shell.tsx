"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  History,
  TrendingUp,
  Settings,
  CreditCard,
} from "lucide-react";
import { Nav } from "@/components/sections/nav";
import { type SessionUser } from "@/lib/auth/use-session";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/predictions", label: "Predictions", icon: History },
  { href: "/dashboard/timeline", label: "Timeline", icon: TrendingUp },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

// Re-exported for downstream pages that still import this name. Same shape
// as the SessionUser the /api/auth/me hook returns.
export type DashboardUser = SessionUser;

/**
 * Client-side dashboard layout. Auth-gates by calling /api/auth/me directly
 * so we get real user data (name, pro tier, email) for the chrome — not a
 * synthesized blank user. On 401, redirects to /login with a `next` param.
 *
 * Note: We don't go through the shared `useSession` hook here because the
 * dashboard needs hard-redirect-on-anon semantics (the marketing-site nav
 * tolerates anon as a normal state). Calling /api/auth/me directly keeps
 * those two flows decoupled.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        if (!alive) return;
        if (res.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        if (!res.ok) {
          // 5xx — bounce to login rather than wedge the dashboard chrome
          // in a half-loaded state.
          router.replace("/login");
          return;
        }
        const json = (await res.json()) as { user?: DashboardUser };
        if (json.user) {
          setUser(json.user);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        if (alive) router.replace("/login");
      })
      .finally(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
          <div className="text-gray-500">Loading…</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

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
