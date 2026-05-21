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
  LogOut,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { invalidateSession, type SessionUser } from "@/lib/auth/use-session";
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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    invalidateSession();
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

  const displayName = user.name || user.email.split("@")[0];

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
            <span
              className="hidden sm:inline text-sm text-gray-600 truncate max-w-[180px]"
              title={user.email}
            >
              {displayName}
            </span>
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
