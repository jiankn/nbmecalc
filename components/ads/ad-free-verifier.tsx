"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/use-session";
import { isAdFreeInBrowser, resumeAdsInBrowser } from "@/lib/ad-free";

/**
 * 只在页面头部脚本已经进入免广告模式时工作：向服务器核实是不是 Lifetime 会员，
 * 不是（未登录、已退款、标记是伪造的、或接口出错）就恢复广告。普通访客不会触发任何额外请求。
 */
export function AdFreeVerifier() {
  const [adFree, setAdFree] = useState(false);

  useEffect(() => {
    setAdFree(isAdFreeInBrowser());
  }, []);

  return adFree ? <Verify /> : null;
}

function Verify() {
  const session = useSession();

  useEffect(() => {
    if (session.status === "loading") return;
    const isMember = session.status === "authed" && session.user.lifetimeAccess;
    if (!isMember) resumeAdsInBrowser();
  }, [session]);

  return null;
}
