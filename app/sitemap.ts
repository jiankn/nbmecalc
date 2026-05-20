import type { MetadataRoute } from "next";

const SITE_URL = "https://nbmecalc.com";

/**
 * Sitemap is statically generated at build time.
 * Add new routes here as pages are created (PRD §6.1).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Currently live pages
  const liveRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },

    // Stage B — core SEO landing pages
    { url: `${SITE_URL}/nbme-score-conversion`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-score-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/nbme-calculator`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/step-1-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-2-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/step-3-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Stage A — marketing & legal
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/dmca`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },

    // Stage C — secondary SEO predictors (built 2026-05-20)
    { url: `${SITE_URL}/uwsa-1-to-step-1`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/uwsa-2-to-step-2`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/free-120-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/amboss-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/cms-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Compare pages (built 2026-05-20)
    { url: `${SITE_URL}/compare/best-usmle-score-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/compare/vs-predictmystepscore`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-amboss-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/compare/vs-nbcalc`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },

    // NBME long-tail programmatic pages (built 2026-05-20)
    ...[28, 29, 30, 31, 32].map((n) => ({
      url: `${SITE_URL}/nbme-${n}-conversion`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),

    // Blog (built 2026-05-20)
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog/category/score-conversion`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/blog/category/study-plans`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/blog/category/step-1-tips`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/blog/category/step-2-tips`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/blog/how-to-read-nbme-score-report`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog/nbme-30-vs-31-vs-32-which-is-hardest`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog/step-2-ck-14-day-cram-plan`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  return liveRoutes;
}
