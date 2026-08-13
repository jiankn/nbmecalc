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
  const validationUpdate = new Date("2026-08-07");
  const formPilotUpdate = new Date("2026-08-09");
  const indexingRemediationUpdate = new Date("2026-08-09");
  const adsenseTrustUpdate = new Date("2026-08-10");
  const cmsFormsGuideUpdate = new Date("2026-08-13");
  // Current NBME score-family correction: CCSSA keeps its 1-300 Total Score;
  // CBSSA EPC and CCMSA 10-800 scores are no longer treated as interchangeable
  // calculator inputs. Step 3 form demand stays consolidated on one page.
  const scoreScaleCorrectionUpdate = new Date("2026-08-11");

  const liveRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 1.0 },

    // Core SEO landing pages
    { url: `${SITE_URL}/nbme-score-conversion`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-15-score-conversion`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "monthly", priority: 0.72 },
    { url: `${SITE_URL}/nbme-30-score-conversion`, lastModified: formPilotUpdate, changeFrequency: "monthly", priority: 0.72 },
    { url: `${SITE_URL}/nbme-calculator`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/step-1-predictor`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-2-predictor`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-3-predictor`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.85 },

    // Marketing and trust pages. Legal and utility pages stay reachable from
    // the footer, but are kept out of the XML sitemap so the sitemap only
    // advertises pages with standalone search value.
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: adsenseTrustUpdate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/methodology`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/validation`, lastModified: validationUpdate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/educators`, lastModified: indexingRemediationUpdate, changeFrequency: "monthly", priority: 0.6 },

    // Secondary SEO predictors
    { url: `${SITE_URL}/uwsa-1-to-step-1`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/uwsa-2-to-step-2`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/free-120-predictor`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/amboss-converter`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/cms-converter`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/cms-forms-step-2-ck`, lastModified: cmsFormsGuideUpdate, changeFrequency: "monthly", priority: 0.78 },

    // Comparison pages
    { url: `${SITE_URL}/compare/best-usmle-score-predictor`, lastModified: indexingRemediationUpdate, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/compare/vs-predictmystepscore`, lastModified: indexingRemediationUpdate, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-amboss-predictor`, lastModified: adsenseTrustUpdate, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-nbcalc`, lastModified: scoreScaleCorrectionUpdate, changeFrequency: "monthly", priority: 0.65 },

    // The blog hub is an indexable editorial navigation page.
    { url: `${SITE_URL}/blog`, lastModified: indexingRemediationUpdate, changeFrequency: "weekly", priority: 0.7 },

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
