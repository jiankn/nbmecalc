"use client";

/**
 * Lightweight client-side session hook.
 *
 * Goals:
 *   - One fetch per page load shared across all consumers (Nav, dashboard
 *     shell, future widgets) so we don't hammer /api/auth/me.
 *   - Stable identity across re-renders so we don't re-fetch on every
 *     state change.
 *   - Three-state semantics: "loading" | "authed" | "anon" — Nav must
 *     distinguish "haven't asked yet" from "definitely signed out" so it
 *     can render skeletons instead of flashing the wrong CTA.
 */
import { useEffect, useState } from "react";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  proTier: string | null;
  proExpiresAt: number | null;
  createdAt: number;
}

export type SessionState =
  | { status: "loading"; user: null }
  | { status: "authed"; user: SessionUser }
  | { status: "anon"; user: null };

// Module-level cache. The first hook call kicks off the fetch; subsequent
// calls (in the same page load) reuse the in-flight promise. This avoids
// redundant /api/auth/me calls when both Nav and DashboardShell mount.
let cachedPromise: Promise<SessionState> | null = null;
let cachedState: SessionState | null = null;

async function fetchSession(): Promise<SessionState> {
  try {
    const res = await fetch("/api/auth/me", {
      // Cookies are required for the auth check; same-origin is the default
      // but we set it explicitly for clarity.
      credentials: "same-origin",
      cache: "no-store",
    });
    if (res.status === 401) {
      return { status: "anon", user: null };
    }
    if (!res.ok) {
      // Treat any non-401 error (e.g. 503) as "anon" for nav-rendering
      // purposes. The dashboard's own auth gate will handle real failures.
      return { status: "anon", user: null };
    }
    const json = (await res.json()) as { user?: SessionUser };
    if (!json.user) return { status: "anon", user: null };
    return { status: "authed", user: json.user };
  } catch {
    return { status: "anon", user: null };
  }
}

/**
 * Force-refresh on next call. Used after logout so the nav flips back
 * immediately, and after a settings update changes name/email.
 */
export function invalidateSession(): void {
  cachedPromise = null;
  cachedState = null;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(
    cachedState ?? { status: "loading", user: null }
  );

  useEffect(() => {
    let alive = true;
    if (cachedState) {
      // Already resolved during this page load; nothing to do.
      setState(cachedState);
      return;
    }
    if (!cachedPromise) {
      cachedPromise = fetchSession().then((s) => {
        cachedState = s;
        return s;
      });
    }
    cachedPromise.then((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
