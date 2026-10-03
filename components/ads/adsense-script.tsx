import { AD_FREE_HEAD_SCRIPT } from "@/lib/ad-free";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim();

function hasValidClientId(value: string | undefined): value is string {
  return Boolean(value && /^ca-pub-\d+$/.test(value));
}

/**
 * Adds Google's site-verification script to the document head when a real
 * publisher id is configured. Consent for regulated regions is managed through
 * the Google-certified CMP configured in AdSense Privacy & messaging.
 *
 * 免广告开关：标准 AdSense 代码保持原样。它前面的小脚本只在浏览器带 Lifetime 免广告标记时，
 * 打开 Google 官方的 pauseAdRequests 开关；没有标记时什么都不做（见 lib/ad-free.ts）。
 * 小脚本必须排在标准代码之前，确保在第一次广告请求前生效。
 */
export function AdSenseScript() {
  if (!hasValidClientId(ADSENSE_CLIENT)) return null;

  return (
    <>
      <script id="nbmecalc-ad-free" dangerouslySetInnerHTML={{ __html: AD_FREE_HEAD_SCRIPT }} />
      <script
        id="google-adsense"
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      />
    </>
  );
}
