import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nbmecalc.com";

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
  ];

  // ----------------------------------------------------------------
  // Pages below are PRD-planned but not yet built.
  // Uncomment each entry as the page is created so Google indexes it.
  // ----------------------------------------------------------------
  //
  // const plannedRoutes: MetadataRoute.Sitemap = [
  //   // Stage C — secondary SEO landing pages
  //   { url: `${SITE_URL}/nbme-score-conversion/step-1`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  //   { url: `${SITE_URL}/nbme-score-conversion/step-2`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  //   { url: `${SITE_URL}/uwsa-1-to-step-1`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  //   { url: `${SITE_URL}/uwsa-2-to-step-2`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  //   { url: `${SITE_URL}/free-120-predictor`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  //   { url: `${SITE_URL}/amboss-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  //   { url: `${SITE_URL}/cms-converter`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  //
  //   // NBME long-tail (programmatic)
  //   ...[27, 28, 29, 30, 31, 32, 33, 34, 35].map((n) => ({
  //     url: `${SITE_URL}/nbme-${n}-conversion`,
  //     lastModified: now,
  //     changeFrequency: "weekly" as const,
  //     priority: 0.7,
  //   })),
  //
  //   // Compare pages
  //   { url: `${SITE_URL}/compare/best-usmle-score-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  //   { url: `${SITE_URL}/compare/vs-predictmystepscore`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  //   { url: `${SITE_URL}/compare/vs-amboss-predictor`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  //   { url: `${SITE_URL}/compare/vs-nbcalc`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  //
  //   // Blog (entries appended dynamically as posts are added)
  //   { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  // ];

  return liveRoutes;
}
