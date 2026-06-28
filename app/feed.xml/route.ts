/**
 * GET /feed.xml — RSS 2.0 feed of blog posts.
 *
 * Static at build time (no D1 reads, no auth, no per-request data). Updated
 * automatically as posts are added to lib/blog/posts.ts.
 */
import { getAllPostsSorted } from "@/lib/blog/posts";

export const dynamic = "force-static";

const SITE_URL = "https://nbmecalc.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const posts = getAllPostsSorted();
  const lastBuild =
    posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(p.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <author>hello@nbmecalc.com (${escapeXml(p.author)})</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NBMEcalc Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Free, evidence-based USMLE Step prep articles. NBME score interpretation, study plans, and high-yield tips.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
