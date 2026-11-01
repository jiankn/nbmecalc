/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/nbme-score-calculator",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/nbme-:number(28|29|30|31|32)-conversion",
        destination: "/nbme-score-conversion",
        permanent: true,
      },
      {
        // 2026-11-01 博客并入 CMS 主页面，避免两页抢同一批 "how many cms forms" 词
        source: "/blog/how-many-cms-forms-step-2-ck",
        destination: "/cms-forms-step-2-ck",
        statusCode: 301,
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
