import type { MetadataRoute } from "next";
import {
  BLOG_POSTS,
  CATEGORY_LABELS,
  getPostsByCategory,
  type BlogCategory,
} from "@/lib/blog/posts";

const SITE_URL = "https://nbmecalc.com";

/**
 * Sitemap is statically generated at build time.
 * Add new routes here as pages are created (PRD §6.1).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Update only when search-visible content changes; build time is not a
  // meaningful <lastmod> signal.
  const now = new Date("2026-06-28");
  const seoContentUpdate = new Date("2026-07-07");

  // Currently live pages
  const liveRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },

    // Stage B — core SEO landing pages
    { url: `${SITE_URL}/nbme-score-conversion`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-score-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/step-1-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-2-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-3-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Stage A — marketing & legal
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/dmca`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },

    // Stage C — secondary SEO predictors (built 2026-05-20)
    { url: `${SITE_URL}/uwsa-1-to-step-1`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/uwsa-2-to-step-2`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/free-120-predictor`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/amboss-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/cms-converter`, lastModified: seoContentUpdate, changeFrequency: "weekly", priority: 0.8 },

    // Compare pages (built 2026-05-20)
    { url: `${SITE_URL}/compare/best-usmle-score-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/compare/vs-predictmystepscore`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-amboss-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-nbcalc`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },

    // Blog (built 2026-05-20)
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    // Category pages — only those with at least one indexable post. Empty
    // categories are noindex'd, so keeping them out of the sitemap avoids
    // sending Google a soft-404/thin page.
    ...(Object.keys(CATEGORY_LABELS) as BlogCategory[])
      .filter((c) => getPostsByCategory(c).length > 0)
      .map((c) => ({
        url: `${SITE_URL}/blog/category/${c}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),

    // Blog posts — derived from BLOG_POSTS, drafts (noindex) are skipped so
    // the sitemap stays consistent with each post's robots meta tag.
    ...BLOG_POSTS.filter((p) => !p.noindex).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return liveRoutes;
}
