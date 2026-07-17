import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";

const SITE_URL = "https://nbmecalc.com";

/**
 * Sitemap is statically generated at build time.
 * Add new routes here as pages are created.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Update only when search-visible content changes; build time is not a
  // meaningful <lastmod> signal.
  const now = new Date("2026-06-28");
  const seoContentUpdate = new Date("2026-07-07");
  const educatorResourceUpdate = new Date("2026-07-17");

  const liveRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },

    // Core SEO landing pages
    { url: `${SITE_URL}/nbme-score-conversion`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-score-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/step-1-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-2-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-3-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Marketing and trust pages. Legal and utility pages stay reachable from
    // the footer, but are kept out of the XML sitemap so the sitemap only
    // advertises pages with standalone search value.
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/educators`, lastModified: educatorResourceUpdate, changeFrequency: "monthly", priority: 0.6 },

    // Secondary SEO predictors
    { url: `${SITE_URL}/uwsa-1-to-step-1`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/uwsa-2-to-step-2`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/free-120-predictor`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/amboss-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/cms-converter`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.8 },

    // Comparison pages
    { url: `${SITE_URL}/compare/best-usmle-score-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/compare/vs-predictmystepscore`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-amboss-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-nbcalc`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },

    // Blog category pages are crawlable navigation pages, not standalone
    // search targets, so they are noindex'd and omitted from the sitemap.
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },

    // Blog posts are derived from BLOG_POSTS. Drafts are skipped so the
    // sitemap stays consistent with each post's robots meta tag.
    ...BLOG_POSTS.filter((p) => !p.noindex).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return liveRoutes;
}
