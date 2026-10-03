import { afterEach, describe, expect, it } from "vitest";
import {
  AD_FREE_ATTR,
  AD_FREE_HEAD_SCRIPT,
  buildAdFreeCookie,
  buildClearAdFreeCookie,
  hasAdFreeCookie,
  resumeAdsInBrowser,
} from "@/lib/ad-free";

type FakeWindow = { adsbygoogle?: { pauseAdRequests?: number } & unknown[]; location: { protocol: string } };

// 用一个最小的假浏览器环境运行页面头部脚本。
function makeBrowser(cookie: string) {
  const attrs: Record<string, string> = {};
  const written: string[] = [];
  const document = {
    get cookie() {
      return cookie;
    },
    set cookie(v: string) {
      written.push(v);
    },
    documentElement: {
      setAttribute: (k: string, v: string) => (attrs[k] = v),
      removeAttribute: (k: string) => delete attrs[k],
      getAttribute: (k: string) => attrs[k] ?? null,
    },
  };
  const window: FakeWindow = { location: { protocol: "https:" } };
  return { document, window, attrs, written };
}

function runHeadScript(cookie: string) {
  const b = makeBrowser(cookie);
  new Function("window", "document", AD_FREE_HEAD_SCRIPT)(b.window, b.document);
  return b;
}

describe("ad-free cookie", () => {
  it("is readable by the head script (not HttpOnly) and lasts 30 days", () => {
    const c = buildAdFreeCookie(true);
    expect(c).toContain("nb_adfree=1");
    expect(c).not.toContain("HttpOnly");
    expect(c).toContain("Secure");
    expect(c).toContain(`Max-Age=${30 * 24 * 60 * 60}`);
    expect(buildAdFreeCookie(false)).not.toContain("Secure");
    expect(buildClearAdFreeCookie()).toContain("Max-Age=0");
  });

  it("detects only an exact nb_adfree=1 pair", () => {
    expect(hasAdFreeCookie("nb_session=abc; nb_adfree=1")).toBe(true);
    expect(hasAdFreeCookie("nb_adfree=0")).toBe(false);
    expect(hasAdFreeCookie("xnb_adfree=1")).toBe(false);
    expect(hasAdFreeCookie(null)).toBe(false);
  });
});

describe("head script", () => {
  it("does nothing for ordinary visitors", () => {
    const b = runHeadScript("nb_session=abc; _ga=1");
    expect(b.window.adsbygoogle).toBeUndefined();
    expect(b.attrs[AD_FREE_ATTR]).toBeUndefined();
  });

  it("ignores look-alike cookies", () => {
    expect(runHeadScript("nb_adfree=10").window.adsbygoogle).toBeUndefined();
    expect(runHeadScript("xnb_adfree=1").window.adsbygoogle).toBeUndefined();
  });

  it("pauses ad requests when the marker is present", () => {
    const b = runHeadScript("foo=bar; nb_adfree=1");
    expect(b.window.adsbygoogle?.pauseAdRequests).toBe(1);
    expect(b.attrs[AD_FREE_ATTR]).toBe("1");
  });
});

describe("resumeAdsInBrowser", () => {
  const g = globalThis as unknown as { window?: unknown; document?: unknown };
  afterEach(() => {
    delete g.window;
    delete g.document;
  });

  it("clears the marker and turns ad requests back on", () => {
    const b = runHeadScript("nb_adfree=1");
    g.window = b.window;
    g.document = b.document;
    resumeAdsInBrowser();
    expect(b.window.adsbygoogle?.pauseAdRequests).toBe(0);
    expect(b.attrs[AD_FREE_ATTR]).toBeUndefined();
    expect(b.written.some((w) => w.startsWith("nb_adfree=;") && w.includes("Max-Age=0"))).toBe(true);
  });
});
