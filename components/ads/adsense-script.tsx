const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.trim();

function hasValidClientId(value: string | undefined): value is string {
  return Boolean(value && /^ca-pub-\d+$/.test(value));
}

/**
 * Adds Google's site-verification script to the document head when a real
 * publisher id is configured. Consent for regulated regions is managed through
 * the Google-certified CMP configured in AdSense Privacy & messaging.
 */
export function AdSenseScript() {
  if (!hasValidClientId(ADSENSE_CLIENT)) return null;

  return (
    <script
      id="google-adsense"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
