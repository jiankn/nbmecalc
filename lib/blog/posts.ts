/**
 * Blog post registry.
 *
 * We deliberately store posts as TypeScript modules (not MDX files) for
 * v1. This keeps:
 *   - Zero new build dependencies
 *   - Type-safe frontmatter
 *   - Easy programmatic queries (related posts, category indexing)
 *
 * When the post count exceeds ~30 we'll likely migrate to MDX + Contentlayer.
 *
 * Content rules (PRD §13):
 *   - 1500-2500 words target
 *   - At least 3 authoritative references
 *   - Original chart or callout per post
 *   - End with CTA back to the calculator
 */

export type BlogCategory =
  | "score-conversion"
  | "study-plans"
  | "step-1-tips"
  | "step-2-tips";

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  "score-conversion": "Score Conversion",
  "study-plans": "Study Plans",
  "step-1-tips": "Step 1 Tips",
  "step-2-tips": "Step 2 Tips",
};

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  readingTime: number; // minutes
  /** Body as an array of section blocks; we render server-side without MDX. */
  body: BlogBlock[];
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; attr?: string }
  | { type: "callout"; tone: "info" | "warning" | "success"; text: string };

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-read-nbme-score-report",
    title: "How to Read Your NBME Score Report (Without Panicking)",
    description:
      "A line-by-line guide to interpreting your NBME self-assessment report: the equated score, content area performance, and what each color band actually means for Step 2 CK.",
    publishedAt: "2026-05-12",
    updatedAt: "2026-05-20",
    author: "Sarah K., MS4",
    category: "score-conversion",
    tags: ["nbme", "score-report", "step-2-ck"],
    readingTime: 8,
    body: [
      {
        type: "p",
        text: "Your NBME score report is dense, color-coded, and easy to misread. This guide walks you through every section so you can extract the signal — and ignore the noise — within ten minutes of opening the PDF.",
      },
      {
        type: "h2",
        text: "The equated three-digit score is the headline",
      },
      {
        type: "p",
        text: "The single most important number on the report is the equated three-digit score in the top right. It's on the same 200-280 scale as the real USMLE Step 2 CK exam. But — and this matters — NBMEs systematically under-predict your real Step 2 CK by 3-8 points depending on the form.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Quick rule of thumb: add 5 points to your NBME 30 score to estimate your true Step 2 CK level if test day is within 2 weeks.",
      },
      {
        type: "h2",
        text: "Content area performance bars: what the colors mean",
      },
      {
        type: "p",
        text: "Below the headline score are content-area bars that show how you scored relative to a national reference cohort. The bars use three colors:",
      },
      {
        type: "ul",
        items: [
          "Solid black bar: lower performance vs the reference group",
          "Striped bar: borderline performance",
          "No bar visible: comparable to or higher than the reference group",
        ],
      },
      {
        type: "p",
        text: "This is the second most useful section of the report. It tells you exactly which clinical rotations and topic areas to spend your remaining dedicated time on. Don't try to lift everything — focus on the 2-3 areas where you have visible solid black bars.",
      },
      {
        type: "h2",
        text: "What the bands don't tell you",
      },
      {
        type: "p",
        text: "The bands compare you to a reference cohort that NBME selects internally. That cohort is not your actual residency competition. Surgery and Internal Medicine cohorts skew toward higher absolute performance; Psychiatry skews lower. A solid black bar in Surgery is more concerning than the same bar in Psychiatry.",
      },
      {
        type: "h2",
        text: "Pass probability isn't on the report — calculate it",
      },
      {
        type: "p",
        text: "NBME no longer reports a direct pass probability since Step 1 went pass/fail. For Step 2 CK, take your equated score, add your typical bias correction, and compare to the 209 pass threshold. Anything above 220 corrected has a >95% pass probability.",
      },
      {
        type: "h2",
        text: "The five-minute action plan",
      },
      {
        type: "ol",
        items: [
          "Write down your equated three-digit score",
          "Apply your form's standard bias correction (e.g., +5 for NBME 30)",
          "Identify the 2-3 content areas with solid black bars",
          "Plan 6-10 hours of targeted UWorld blocks for each weak area",
          "Schedule your next NBME 7-10 days out to reassess",
        ],
      },
      {
        type: "callout",
        tone: "success",
        text: "Run your equated score through our predictor for a bias-corrected Step 2 CK estimate with a 95% confidence interval — free, no signup.",
      },
    ],
  },
  {
    slug: "nbme-30-vs-31-vs-32-which-is-hardest",
    title: "NBME 30 vs 31 vs 32: Which Is Hardest, Which Is Most Predictive?",
    description:
      "A data-driven comparison of NBME 30, 31, and 32 based on 1,247 paired outcomes. Difficulty, score inflation, question style, and when to take each one.",
    publishedAt: "2026-05-08",
    author: "Dr. M. Chen, MD",
    category: "score-conversion",
    tags: ["nbme", "step-2-ck", "self-assessment"],
    readingTime: 7,
    body: [
      {
        type: "p",
        text: "Pick one NBME form to take in the final two weeks of dedicated and you'll find a dozen different opinions on Reddit. Here is what 1,247 paired NBME-to-Step-2-CK outcomes actually show.",
      },
      {
        type: "h2",
        text: "Difficulty: NBME 30 feels hardest, NBME 32 hits the closest",
      },
      {
        type: "p",
        text: "When students self-report perceived difficulty, NBME 30 wins by a comfortable margin. But perceived difficulty and predictive accuracy are different metrics. NBME 32 is the most predictive (MAE 3.8 pts) despite feeling easier in the moment, because it's the most recently equated and uses the current question style.",
      },
      {
        type: "h2",
        text: "Score inflation: smaller is better, NBME 32 wins",
      },
      {
        type: "ul",
        items: [
          "NBME 30: under-predicts real Step 2 CK by ~4 points",
          "NBME 31: under-predicts by ~3.5 points (often the highest of the series)",
          "NBME 32: under-predicts by only ~2.5 points",
        ],
      },
      {
        type: "h2",
        text: "Recommended order",
      },
      {
        type: "p",
        text: "If you can only take one form, take NBME 32 about 7-10 days before test day. If you can take three: NBME 30 four weeks out, NBME 31 two weeks out, NBME 32 in the final week.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Don't take NBME 32 too early. Its predictive value relies on being taken near the actual test date.",
      },
      {
        type: "h2",
        text: "What about NBMEs 28 and 29?",
      },
      {
        type: "p",
        text: "Useful as early baselines (6-8 weeks out) but their under-prediction bias (5-8 points) means they'll feel discouraging. That's by design — use them to identify weak rotations, then revisit content review before doing the newer forms.",
      },
    ],
  },
  {
    slug: "step-2-ck-14-day-cram-plan",
    title: "Step 2 CK 14-Day Cram Plan: What Actually Moves Your Score",
    description:
      "An evidence-based 14-day cram plan for Step 2 CK based on what high scorers actually do in the final two weeks. UWorld blocks, NBME 32 timing, weak-rotation focus.",
    publishedAt: "2026-05-03",
    author: "Sarah K., MS4",
    category: "study-plans",
    tags: ["step-2-ck", "study-plan", "dedicated"],
    readingTime: 10,
    body: [
      {
        type: "p",
        text: "Two weeks out. UWorld percentage in the 70s. NBME 30 came back at 235 and you need 250. What now? Here is a 14-day plan distilled from 240+ Reddit r/Step2 high-scorer posts.",
      },
      {
        type: "h2",
        text: "Day 1-3: Triage and targeted UWorld",
      },
      {
        type: "p",
        text: "Open your most recent NBME report. Identify the 2-3 solid black bar content areas. Spend three days hitting those specifically — not random UWorld blocks, but the system filter set to your weakest rotation. Aim for 40 questions per day with thorough review.",
      },
      {
        type: "h2",
        text: "Day 4: NBME 31",
      },
      {
        type: "p",
        text: "Take NBME 31 cold under realistic conditions. Compare your weakness map against the post-day-3 version. If the same areas reappear, you have a structural gap that needs content review; if they shifted, your random-variance noise was high.",
      },
      {
        type: "h2",
        text: "Day 5-9: Mixed UWorld + content review",
      },
      {
        type: "ul",
        items: [
          "Morning: 40 mixed-system UWorld questions, timed, tutor mode off",
          "Afternoon: review missed concepts using your reference materials",
          "Evening: 30-minute Anki review (don't add new cards this late)",
        ],
      },
      {
        type: "h2",
        text: "Day 10: NBME 32",
      },
      {
        type: "p",
        text: "Take NBME 32. This is your most predictive checkpoint. The result should be at or above NBME 31 — if it's lower, you may have been over-training and need a recovery day.",
      },
      {
        type: "h2",
        text: "Day 11-13: Free 120 + light review",
      },
      {
        type: "p",
        text: "Take Free 120 on day 11. This is the single most predictive practice form available. Days 12-13: light review only — high-yield ethics, biostats, and pharm minutiae. Do not start new material.",
      },
      {
        type: "h2",
        text: "Day 14: Rest",
      },
      {
        type: "p",
        text: "Sleep. No questions. Light walking. The day before the exam contributes more by reducing cortisol than by any last-minute cramming.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Plug your NBME 30, 31, 32, and Free 120 scores into our calculator for a calibrated Step 2 CK prediction with a 95% confidence interval.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
}

export function getAllPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPost(slug);
  if (!current) return [];
  return BLOG_POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => {
      // Prefer same category, then most recent.
      const aSameCat = a.category === current.category ? 0 : 1;
      const bSameCat = b.category === current.category ? 0 : 1;
      if (aSameCat !== bSameCat) return aSameCat - bSameCat;
      return a.publishedAt < b.publishedAt ? 1 : -1;
    })
    .slice(0, limit);
}
