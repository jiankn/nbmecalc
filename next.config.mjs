/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/nbme-:number(28|29|30|31|32)-conversion",
        destination: "/nbme-score-conversion",
        permanent: true,
      },
    ];
  },
};

// Wire Cloudflare bindings (D1, R2, KV) declared in wrangler.toml into
// `next dev` via miniflare. Without this, getRequestContext() has no env
// and every D1-backed route 503s. Production / `wrangler pages dev` are
// unaffected because this only runs under NODE_ENV=development.
//
// `next.config.mjs` is native ESM, so top-level await is permitted —
// `next.config.ts` is loaded via CJS require and would throw
// ERR_REQUIRE_ASYNC_MODULE here.
if (process.env.NODE_ENV === "development") {
  const { setupDevPlatform } = await import(
    "@cloudflare/next-on-pages/next-dev"
  );
  await setupDevPlatform();
}

export default nextConfig;
