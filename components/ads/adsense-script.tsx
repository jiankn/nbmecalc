import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim();

function hasValidClientId(value: string | undefined): value is string {
  return Boolean(value && /^ca-pub-\d+$/.test(value));
}

/**
 * Loads AdSense only after the application is interactive and only when a
 * real publisher id is configured. Consent for regulated regions is managed
 * through the Google-certified CMP configured in AdSense Privacy & messaging.
 */
export function AdSenseScript() {
  if (!hasValidClientId(ADSENSE_CLIENT)) return null;

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
