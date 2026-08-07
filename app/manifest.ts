import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NBMEcalc — USMLE Step Score Predictor",
    short_name: "NBMEcalc",
    description:
      "Free independent USMLE planning tool. Combine NBME, UWSA, Free 120, AMBOSS, or CMS inputs into an estimate with a transparent range.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#34D399",
    orientation: "portrait-primary",
    categories: ["education", "medical", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
