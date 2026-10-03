/**
 * Lifetime 会员免广告。
 *
 * 原则：不改动、不隐藏 AdSense 标准代码。所有人（包括 Google 的审核爬虫）拿到的 HTML 里，
 * 标准 adsbygoogle.js 代码原样保留。只有浏览器带 `nb_adfree=1` 标记时，才在广告代码运行前
 * 打开 Google 官方的 `pauseAdRequests` 开关，让它不发广告请求：没有请求，也就没有展示。
 * 官方说明：https://support.google.com/adsense/answer/7670312
 *
 * 标记只是"提示"，真实权限永远以服务器 session 为准：
 *   - /api/auth/me 确认是 Lifetime 会员时写入标记，不是会员或未登录时清除；
 *   - 退出登录时清除；
 *   - 前端核实发现不是会员（例如手动伪造了标记）时，清除标记并恢复广告请求。
 * 标记不能是 HttpOnly，因为页面头部的小脚本要在广告代码之前读到它。
 */

export const AD_FREE_COOKIE = "nb_adfree";
/** 与登录 session 一样保留 30 天。 */
export const AD_FREE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
/** 免广告时加在 <html> 上的属性，用来收起空的广告占位框。 */
export const AD_FREE_ATTR = "data-ad-free";

export function buildAdFreeCookie(secure: boolean = true): string {
  return [
    `${AD_FREE_COOKIE}=1`,
    "Path=/",
    secure ? "Secure" : "",
    "SameSite=Lax",
    `Max-Age=${AD_FREE_MAX_AGE_SECONDS}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function buildClearAdFreeCookie(secure: boolean = true): string {
  return [`${AD_FREE_COOKIE}=`, "Path=/", secure ? "Secure" : "", "SameSite=Lax", "Max-Age=0"]
    .filter(Boolean)
    .join("; ");
}

/** 请求里是否带着免广告标记。 */
export function hasAdFreeCookie(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((part) => part.trim() === `${AD_FREE_COOKIE}=1`);
}

/**
 * 放在 <head> 里、AdSense 标准代码之前的同步小脚本。
 * 没有标记时什么都不做，页面行为与改动前完全一致。
 */
export const AD_FREE_HEAD_SCRIPT = `(function(){try{if(/(?:^|;\\s*)${AD_FREE_COOKIE}=1(?:;|$)/.test(document.cookie)){(window.adsbygoogle=window.adsbygoogle||[]).pauseAdRequests=1;document.documentElement.setAttribute("${AD_FREE_ATTR}","1");}}catch(e){}})();`;

/**
 * 前端核实失败（不是会员）时调用：清掉标记，并按 Google 官方说明把 pauseAdRequests 设回 0 恢复广告。
 */
export function resumeAdsInBrowser(): void {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AD_FREE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    document.documentElement.removeAttribute(AD_FREE_ATTR);
    const queue = (window.adsbygoogle = window.adsbygoogle ?? []) as unknown as { pauseAdRequests?: number };
    queue.pauseAdRequests = 0;
  } catch {
    // 拦截插件等可能让第三方对象不可用，免费功能不受影响。
  }
}

/** 页面头部脚本是否已经把本页设为免广告。 */
export function isAdFreeInBrowser(): boolean {
  try {
    return document.documentElement.getAttribute(AD_FREE_ATTR) === "1";
  } catch {
    return false;
  }
}
