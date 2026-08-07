import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FunnelPageView } from "@/components/funnel-page-view";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://nbmecalc.com";
const defaultOgImage = "/images/feature-score-range.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "NBMEcalc",
  title: "NBMEcalc — Predict Your USMLE Step Score in 5 Seconds",
  description:
    "Free independent USMLE Step planning tool. Combine NBME, UWSA, or Free 120 scores into an estimate with a transparent planning range.",
  keywords: [
    "nbme calculator",
    "nbme score calculator",
    "nbme score conversion",
    "usmle step score predictor",
    "step 2 score predictor",
    "step 1 score predictor",
    "uwsa to step",
    "free 120 to step",
  ],
  authors: [{ name: "NBMEcalc team" }],
  creator: "NBMEcalc",
  publisher: "NBMEcalc",
  category: "education",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Predict Your USMLE Step Score in 5 Seconds — NBMEcalc",
    description:
      "Free, no signup. Combine NBME, UWSA, Free 120, and AMBOSS inputs into an estimate with a transparent planning range.",
    url: "https://nbmecalc.com",
    siteName: "NBMEcalc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 2400,
        height: 1792,
        alt: "NBMEcalc USMLE Step score predictor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Predict Your USMLE Step Score in 5 Seconds",
    description:
      "Free, multi-source NBME / UWSA / Free 120 predictor with confidence intervals.",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <FunnelPageView />
        {children}
      </body>
    </html>
  );
}
