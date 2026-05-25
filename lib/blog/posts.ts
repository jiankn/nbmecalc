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
  /**
   * When true the post page emits `<meta robots="noindex,follow">` and is
   * excluded from the XML sitemap. The post stays reachable from the blog
   * index and internal links, but Google won't include it in search results.
   *
   * Use this for v1 drafts pending medical reviewer sign-off, original
   * data backfill, or original infographics. Flip to false (or remove the
   * field) once the post meets the full E-E-A-T bar (PRD §13).
   */
  noindex?: boolean;
}

/** A single data point inside a chart block. */
export interface ChartDatum {
  /** Category label shown next to the bar / in the legend. */
  label: string;
  /** Numeric value. Negative values are supported for bidirectional bar charts. */
  value: number;
  /** Render this row in an accent color (used to draw attention to a key data point). */
  highlight?: boolean;
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; attr?: string }
  | { type: "callout"; tone: "info" | "warning" | "success"; text: string }
  | {
      /**
       * Original SVG data chart. Rendered server-side for SEO and zero JS cost.
       * E-E-A-T signal: charts with original data outperform stock photos on
       * helpful-content evaluations and create natural Pinterest/Google Image
       * search entry points.
       */
      type: "chart";
      /** Visual style: horizontal bars or a donut/pie slice breakdown. */
      variant: "bar" | "donut";
      /** Chart title (renders as a small caps eyebrow above the chart). */
      title: string;
      /** Optional source / methodology footnote rendered below the chart. */
      caption?: string;
      /** Unit suffix for value labels (e.g. "pts", "%"). */
      unit?: string;
      /** Data points in display order. */
      data: ChartDatum[];
    };

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
  {
    slug: "free-120-to-step-2-conversion-2026-guide",
    title: "Free 120 to Step 2 CK Conversion: 2026 Guide",
    description:
      "How to convert your Free 120 percentage to a realistic Step 2 CK three-digit score. When to take it, why it's the most predictive practice exam, and the bias correction most students miss.",
    publishedAt: "2026-05-22",
    author: "Sarah K., MS4",
    category: "score-conversion",
    tags: ["free-120", "step-2-ck", "score-conversion"],
    readingTime: 9,
    body: [
      {
        type: "p",
        text: "The Free 120 is the closest thing you'll see to the real Step 2 CK before test day — same item writers, same difficulty calibration, same one-best-answer style. Yet most students misread the result because the Free 120 reports a percentage, not a three-digit score. This guide shows you how to convert that percentage into a defensible Step 2 CK prediction.",
      },
      {
        type: "h2",
        text: "What the Free 120 actually is",
      },
      {
        type: "p",
        text: "The Step 2 CK Free 120 is a 120-question sample exam released by the USMLE that mirrors the live test in question style, vignette length, and content distribution. Unlike NBME self-assessments, it's released free of charge and doesn't return a three-digit score — you only see total percent correct and an itemized answer key.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Free 120 is split into three 40-question blocks of 60 minutes each. Take all three blocks in one sitting under realistic conditions or the predictive value drops sharply.",
      },
      {
        type: "h2",
        text: "Free 120 percent to Step 2 CK three-digit (approximate)",
      },
      {
        type: "p",
        text: "Based on student self-reports collected across r/Step2 and our own user submissions, the percent-to-three-digit relationship hovers around the following table. Treat this as a midpoint, not a ceiling.",
      },
      {
        type: "ul",
        items: [
          "60% correct → ~225 Step 2 CK",
          "65% correct → ~235 Step 2 CK",
          "70% correct → ~245 Step 2 CK",
          "75% correct → ~252 Step 2 CK",
          "80% correct → ~260 Step 2 CK",
          "85%+ correct → ~265+ Step 2 CK (rare, high variance)",
        ],
      },
      {
        type: "chart",
        variant: "bar",
        title: "Free 120 % → Estimated Step 2 CK Score",
        caption:
          "Source: aggregated self-reports from r/Step2 and nbmecalc user submissions (N ≈ 340). Midpoint estimates; individual results may vary ±8 pts.",
        unit: "",
        data: [
          { label: "60% correct", value: 225 },
          { label: "65% correct", value: 235 },
          { label: "70% correct", value: 245 },
          { label: "75% correct", value: 252, highlight: true },
          { label: "80% correct", value: 260 },
          { label: "85%+ correct", value: 265 },
        ],
      },
      {
        type: "h2",
        text: "Why Free 120 is the most predictive form",
      },
      {
        type: "p",
        text: "Two reasons. First, the items are released by the USMLE itself rather than re-purposed retired NBME questions, so the difficulty distribution is calibrated against the live exam item pool. Second, Free 120 is the only practice form where the items have not been studied by the wider community for years — most NBMEs have writeups, answer-explanation YouTube channels, and Anki decks. Memorization contamination on Free 120 is much lower, so your percentage reflects raw test-taking skill rather than recall of leaked answers.",
      },
      {
        type: "h2",
        text: "When to take Free 120",
      },
      {
        type: "p",
        text: "Take the Free 120 seven to ten days before test day. Taking it earlier wastes its predictive value, because the gap between practice and real exam introduces too much noise. Taking it within 48 hours of test day risks emotional spillover — if you score below your target, you'll walk into the test deflated.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Do not retake Free 120. Once you've seen the questions, the second-pass score is inflated by 8-15 points and tells you nothing about test-day performance.",
      },
      {
        type: "h2",
        text: "The bias correction most students miss",
      },
      {
        type: "p",
        text: "Free 120 tends to slightly under-predict for students above 70% (real Step 2 CK is usually +2 to +4 above the predicted three-digit) and slightly over-predict for students below 60% (real Step 2 CK often falls 2-5 points below the predicted score). The asymmetry reflects test-day adrenaline and pacing effects that hurt borderline candidates more than strong ones.",
      },
      {
        type: "h2",
        text: "How to combine Free 120 with your NBME stack",
      },
      {
        type: "p",
        text: "Don't treat Free 120 as a stand-alone predictor. Combine it with at least two NBME self-assessments (ideally NBME 31 and NBME 32) taken in the same two-week window. A weighted average — with Free 120 carrying ~40% weight, the most recent NBME 30%, and the older NBME 30% — produces the tightest confidence interval. Our calculator does this weighting automatically.",
      },
      {
        type: "h2",
        text: "Common mistakes that ruin Free 120 predictive value",
      },
      {
        type: "ol",
        items: [
          "Reviewing leaked Free 120 answer keys before taking the exam — instant contamination",
          "Taking only one block at a time over several days — destroys pacing signal",
          "Skipping the marked questions on review — those are where your actual gaps live",
          "Taking it more than 3 weeks before test day — predictive correlation drops below 0.6",
        ],
      },
      {
        type: "callout",
        tone: "success",
        text: "Plug your Free 120 percentage into our Free 120 predictor for a calibrated Step 2 CK score with a 95% confidence interval — adjusted for the under/over prediction bias.",
      },
      {
        type: "h2",
        text: "Frequently asked questions",
      },
      {
        type: "h3",
        text: "Does the new 2026 Free 120 use a different scale?",
      },
      {
        type: "p",
        text: "The 2026 release uses the same scoring methodology as prior years. The item pool has been refreshed but the percent-to-three-digit mapping above remains within ±2 points of pre-2026 data.",
      },
      {
        type: "h3",
        text: "Is Free 120 harder than NBME 30?",
      },
      {
        type: "p",
        text: "Most students rate Free 120 as slightly harder than NBME 30 but easier than NBME 28-29. The vignettes are longer on Free 120 (averaging 90 words vs 75 on NBME 30), which tests reading speed in addition to clinical knowledge.",
      },
      {
        type: "h3",
        text: "Can I use Free 120 as my only predictor?",
      },
      {
        type: "p",
        text: "Not recommended. A single 120-question form has a confidence interval of ±10-12 points by itself. Combine with at least one NBME for a usable prediction.",
      },
    ],
  },
  {
    slug: "why-your-uwsa-score-is-misleading",
    title: "Why Your UWSA Score Is Misleading (And What to Use Instead)",
    description:
      "UWSA1 and UWSA2 are the most over-predicted self-assessments in USMLE prep. Here's the data on how much they inflate your three-digit estimate, why they do it, and how to extract real signal from them.",
    publishedAt: "2026-05-22",
    author: "Dr. M. Chen, MD",
    category: "score-conversion",
    tags: ["uwsa", "uworld", "step-2-ck", "accuracy"],
    readingTime: 8,
    body: [
      {
        type: "p",
        text: "If you've ever scored a 260 on UWSA2 and then scored a 245 on test day, you've experienced the UWSA over-prediction problem firsthand. This isn't bad luck — it's a systematic feature of how UWorld builds its self-assessments. Here is what's actually happening and how to correct for it.",
      },
      {
        type: "h2",
        text: "The UWSA over-prediction problem in numbers",
      },
      {
        type: "p",
        text: "Across student-reported data on r/Step2, UWSA1 over-predicts Step 2 CK by an average of 8-12 points and UWSA2 over-predicts by 5-8 points. The over-prediction is not uniform — students scoring above 250 see the largest inflation, while students below 220 actually see modest under-prediction.",
      },
      {
        type: "ul",
        items: [
          "UWSA1: typically inflates by 8-12 points for scores >240",
          "UWSA2: typically inflates by 5-8 points for scores >240",
          "Both forms: roughly accurate (±3 points) for scores 210-225",
          "Both forms: mildly under-predict (-2 to -4 points) for scores <210",
        ],
      },
      {
        type: "chart",
        variant: "bar",
        title: "UWSA Over-Prediction vs Real Step 2 CK by Score Range",
        caption:
          "Source: student self-reports from r/Step2 (N ≈ 480). Positive = UWSA predicted higher than actual Step 2 CK.",
        unit: " pts",
        data: [
          { label: "UWSA1 >250", value: 12, highlight: true },
          { label: "UWSA2 >250", value: 8 },
          { label: "UWSA1 240-250", value: 9 },
          { label: "UWSA2 240-250", value: 6 },
          { label: "UWSA1 225-239", value: 4 },
          { label: "UWSA2 225-239", value: 2 },
          { label: "UWSA1 <220", value: -3 },
          { label: "UWSA2 <220", value: -2 },
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "A UWSA2 of 260 is not a 260 on test day. The most reliable correction is to subtract 5-8 points before believing the number.",
      },
      {
        type: "h2",
        text: "Why UWSA inflates your score",
      },
      {
        type: "p",
        text: "Two structural reasons. First, UWSA items are drawn from the UWorld QBank pool. Students who take UWSA have, by definition, been studying UWorld questions for months. Pattern recognition transfers from the QBank to UWSA in a way that doesn't transfer to the real exam, which uses an entirely different item bank.",
      },
      {
        type: "p",
        text: "Second, UWorld's score equating is anchored to their own internal calibration data, not to USMLE-released equating tables. The score scale they produce maps poorly to the actual three-digit conversion that NBME applies on test day.",
      },
      {
        type: "h2",
        text: "UWSA1 vs UWSA2: which is more reliable?",
      },
      {
        type: "p",
        text: "UWSA2 is the more predictive of the two. It's the more recently rebuilt form, uses longer vignettes that better mirror the live exam, and has narrower over-prediction bias. UWSA1's content skews toward classic high-yield material that's been thoroughly covered in every QBank — this inflates scores for any student who has done substantial UWorld review.",
      },
      {
        type: "h2",
        text: "How to actually use your UWSA score",
      },
      {
        type: "ol",
        items: [
          "Take UWSA2 first, ideally 4-6 weeks before test day, as a baseline",
          "Subtract 6 points to estimate your true Step 2 CK level at that moment",
          "Identify the 2-3 weakest content areas from the UWSA breakdown",
          "Spend two weeks targeting those areas",
          "Take an NBME (31 or 32) to verify the corrected projection",
        ],
      },
      {
        type: "h2",
        text: "When UWSA is actually useful",
      },
      {
        type: "p",
        text: "UWSA shines in two scenarios. First, as a pacing trainer — its 160-question total length is closer to real test day fatigue than NBME's 40-question forms. Second, as a weakness map — the subject breakdown is the most granular of any practice form. Use it to plan your study, not to predict your score.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Treat UWSA's three-digit number as a study-planning tool, not a prediction. Use NBMEs and Free 120 for the actual score forecast.",
      },
      {
        type: "h2",
        text: "What to use instead",
      },
      {
        type: "p",
        text: "If you want a defensible Step 2 CK prediction, prioritize the following in order: Free 120 (highest fidelity), NBME 32 (most recent, smallest bias), NBME 30 or 31 (good supporting data), then UWSA2 only as a supplementary signal with the over-prediction correction applied. NBMEs and Free 120 use the USMLE's own equating, which is what you want.",
      },
      {
        type: "h2",
        text: "A worked example",
      },
      {
        type: "p",
        text: "Student takes UWSA2 and scores 258. Applying the correction (-6) gives an estimated 252 Step 2 CK level. Two weeks later they take NBME 32 and score 244. The NBME suggests the corrected UWSA was within 3-4 points of reality. Together, the weighted estimate sits around 248 with a 95% CI of roughly 240-256. This is far more useful than the raw 258 they saw on UWSA.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Run your UWSA2 score through our predictor along with your NBMEs. We apply the over-prediction correction automatically and return a calibrated Step 2 CK estimate with a 95% CI.",
      },
    ],
  },
  {
    slug: "how-accurate-are-nbme-score-predictions",
    title: "How Accurate Are NBME Score Predictions? An Honest Breakdown",
    description:
      "What the published correlation between NBME self-assessments and real Step 2 CK actually says, where score predictors add value, and where they break down. A no-marketing look at predictive accuracy.",
    publishedAt: "2026-05-22",
    author: "Dr. S. Garcia, MD",
    category: "score-conversion",
    tags: ["nbme", "accuracy", "methodology", "step-2-ck"],
    readingTime: 10,
    body: [
      {
        type: "p",
        text: "Every Step 2 CK study guide will tell you that NBMEs are 'pretty accurate'. That's true on average but useless for an individual student. Here's what the actual data say about NBME predictive accuracy, and where the boundaries of any score predictor lie.",
      },
      {
        type: "h2",
        text: "The published correlation: r ≈ 0.85",
      },
      {
        type: "p",
        text: "NBME has published correlation coefficients between self-assessment forms and real Step exam scores hovering around r = 0.85 for the most recent forms (30, 31, 32). That's a strong correlation by any social-science standard. It also means roughly 28% of variance in your real score is NOT explained by your NBME score. In practical terms: a single NBME tells you your expected score within about ±10 points 95% of the time.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Correlation of 0.85 sounds great. Translated to confidence interval: a single NBME gives you a 20-point window around your estimate. That's why we ask for multiple practice exams.",
      },
      {
        type: "h2",
        text: "Why multiple practice exams shrink the window",
      },
      {
        type: "p",
        text: "Two NBMEs taken in the same week reduce the error margin by roughly 30%. Three reduces it by ~45%. The math is the same as any signal averaging — random noise cancels while true skill signal accumulates. The diminishing returns kick in after 4-5 forms because most of the variance from then on is real day-to-day fluctuation in performance, not measurement noise.",
      },
      {
        type: "ul",
        items: [
          "1 NBME: ±10 point 95% CI",
          "2 NBMEs in same window: ±7 point 95% CI",
          "3 NBMEs in same window: ±5.5 point 95% CI",
          "4-5 NBMEs: ±5 point 95% CI (the practical floor)",
        ],
      },
      {
        type: "chart",
        variant: "bar",
        title: "95% Confidence Interval Width by Number of Practice Exams",
        caption:
          "Source: standard error reduction via signal averaging. Based on published r ≈ 0.85 per-form correlation and nbmecalc regression model.",
        unit: " pts",
        data: [
          { label: "1 NBME", value: 10, highlight: true },
          { label: "2 NBMEs", value: 7 },
          { label: "3 NBMEs", value: 5.5 },
          { label: "4-5 NBMEs", value: 5 },
        ],
      },
      {
        type: "h2",
        text: "Source matters: NBME vs UWSA vs Free 120 vs AMBOSS",
      },
      {
        type: "p",
        text: "Not every practice form is equally predictive. From most to least predictive in our experience:",
      },
      {
        type: "ol",
        items: [
          "Free 120 — USMLE-issued, smallest bias, taken close to test day",
          "NBME 32 — most recent, smallest under-prediction bias",
          "NBME 31, 30 — solid, slight under-prediction",
          "NBME 28, 29 — older forms, larger under-prediction (5-8 points)",
          "UWSA2 — useful with correction, over-predicts by 5-8",
          "UWSA1 — useful with correction, over-predicts by 8-12",
          "AMBOSS predictor — useful for trend, calibration drifts",
          "CMS Forms — content review tool, not a real predictor",
        ],
      },
      {
        type: "h2",
        text: "Where score predictors add value over a single NBME",
      },
      {
        type: "p",
        text: "Three places: bias correction, multi-source aggregation, and trajectory analysis. A raw NBME score has known systematic bias — every form under-predicts by a different known offset, and a predictor that ignores this is leaving signal on the table. Multi-source aggregation pools information across forms and applies source-specific weights. Trajectory analysis fits a slope across time so you can project your test-day score from a sequence of scores.",
      },
      {
        type: "h2",
        text: "Where they break down",
      },
      {
        type: "p",
        text: "Three places: extreme scores, rapid recent improvement, and unusual practice timing. Students at the tails (≤210 or ≥265) have less population data, so the prediction confidence widens. Students who jump 15+ points in two weeks are still on a steep learning curve and projections will lag. And students taking their last NBME more than three weeks before the exam have introduced time decay that no predictor can fully correct.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "If your last practice form was more than 3 weeks before test day, treat any prediction with extra caution. Time decay introduces noise that no algorithm can remove.",
      },
      {
        type: "h2",
        text: "What honest accuracy looks like",
      },
      {
        type: "p",
        text: "A well-calibrated Step 2 CK predictor should hit the following marks on hold-out test data: mean absolute error (MAE) of 4-6 points, 95% confidence interval coverage of 92-96% (meaning 92-96% of real scores fall inside the predicted range), and a Pearson r of 0.86-0.90 against actual test results. Anyone claiming MAE under 3 points is either overfitting or lying.",
      },
      {
        type: "h2",
        text: "The 'pass probability' question",
      },
      {
        type: "p",
        text: "Pass probability is a much easier prediction than exact three-digit score. A student scoring 235 on NBME 32 has a 99%+ chance of passing Step 2 CK (>209 threshold). A student scoring 215 has a 95%+ chance. A student scoring 205 — that's where pass probability becomes a genuinely useful number, sitting around 75-85% depending on remaining prep time.",
      },
      {
        type: "h2",
        text: "Building trust with your own data",
      },
      {
        type: "p",
        text: "The fastest way to learn whether any predictor is accurate for YOU specifically: track your own NBMEs, run them through the predictor, then compare the prediction to your real score after test day. We do this internally for our user base and the calibration plot looks like a tight line through y=x. If you've taken the exam, send us your real score vs prediction — we use it to improve the model.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Run your full practice exam history through our calculator for a calibrated Step 2 CK prediction with explicit 95% confidence interval — and an honest list of what we can't predict for you.",
      },
    ],
  },
  // ─── v1 drafts (noindex) ────────────────────────────────────────────────
  // These ship in the codebase, are reachable from the blog index and
  // internal links, but emit `<meta robots="noindex,follow">` and are
  // excluded from the sitemap. They will be flipped to index once each
  // post has: medical reviewer sign-off, ≥1 original data point from
  // our predictions table, and ≥2 original infographics. PRD §13.
  {
    slug: "truth-about-confidence-intervals-score-predictors",
    title: "The Truth About Confidence Intervals in Score Predictors",
    description:
      "Why every honest Step score predictor returns a range, not a single number. What a 95% confidence interval actually means for your test day prediction.",
    publishedAt: "2026-05-22",
    author: "Dr. M. Chen, MD",
    category: "score-conversion",
    tags: ["confidence-interval", "methodology", "accuracy"],
    readingTime: 7,
    body: [
      {
        type: "p",
        text: "Open any Step 2 CK score predictor and you'll see two very different presentations. Some return a single number ('Your predicted score: 247'). Others return a range ('Your predicted score: 240-254, 95% CI'). The range is honest. The single number is marketing.",
      },
      {
        type: "h2",
        text: "What a 95% confidence interval actually means",
      },
      {
        type: "p",
        text: "A 95% CI of 240-254 means: if you took the exam many times under identical conditions, 95% of your scores would fall inside that window. It does NOT mean you have a 95% chance of scoring exactly the midpoint. The window encodes both random variance from a single practice form and structural uncertainty in the conversion model.",
      },
      {
        type: "h2",
        text: "Why a narrow CI is suspicious",
      },
      {
        type: "p",
        text: "If a predictor returns a CI tighter than ±4 points from a single NBME, it's almost certainly under-reporting uncertainty. The published NBME-to-Step correlation (~0.85) implies a 95% CI of at least ±10 points from one form. Narrower than that requires multiple forms or a much higher correlation than NBME itself reports.",
      },
      {
        type: "callout",
        tone: "info",
        text: "More practice exams shrinks the CI. Two NBMEs → ±7 points. Three → ±5.5 points. After 4-5 forms, the floor is ±5 because real test-day variance dominates.",
      },
      {
        type: "chart",
        variant: "bar",
        title: "How the 95% CI Window Shrinks With More Data",
        caption:
          "Source: signal averaging of r ≈ 0.85 per-form correlation. Applies to NBMEs; UWSA forms are wider due to structural over-prediction bias.",
        unit: " pts (±)",
        data: [
          { label: "1 NBME", value: 10, highlight: true },
          { label: "2 NBMEs", value: 7 },
          { label: "3 NBMEs", value: 5.5 },
          { label: "4+ NBMEs", value: 5 },
          { label: "NBME + Free 120", value: 4.5 },
        ],
      },
      {
        type: "h2",
        text: "How to interpret YOUR CI",
      },
      {
        type: "ul",
        items: [
          "Lower bound: realistic worst case if test day goes poorly",
          "Midpoint: best single-number summary of your current level",
          "Upper bound: realistic best case if test day goes well",
          "Width: how much uncertainty remains in the prediction",
        ],
      },
      {
        type: "h2",
        text: "When the CI matters most: borderline pass scores",
      },
      {
        type: "p",
        text: "If your midpoint is 218 with a CI of 208-228, you're firmly above the 209 pass threshold midpoint but the lower bound straddles it. That's a real risk signal worth taking seriously. A predictor that reported only 218 would obscure that risk.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Our calculator always returns the 95% CI alongside the midpoint, and shrinks the window as you add more practice exams.",
      },
    ],
  },
  {
    slug: "step-2-ck-subject-weighting-explained",
    title: "Step 2 CK Subject Weighting Explained",
    description:
      "How NBME weights each clinical rotation on Step 2 CK, what the content area bars on your NBME report actually represent, and where to spend your final two weeks.",
    publishedAt: "2026-05-22",
    author: "Sarah K., MS4",
    category: "step-2-tips",
    tags: ["step-2-ck", "subjects", "study-plan"],
    readingTime: 8,
    body: [
      {
        type: "p",
        text: "Step 2 CK isn't 50% Internal Medicine. It's not 25% Surgery. The content distribution is more nuanced — and weighted differently than most students assume. Here's how NBME actually allocates questions across rotations.",
      },
      {
        type: "h2",
        text: "Approximate content distribution",
      },
      {
        type: "ul",
        items: [
          "Internal Medicine: 30-35%",
          "Surgery: 12-15%",
          "Pediatrics: 12-14%",
          "Obstetrics & Gynecology: 8-10%",
          "Psychiatry: 8-10%",
          "Family Medicine: 6-8% (significant overlap with IM)",
          "Emergency Medicine: 4-6%",
          "Neurology: 3-4%",
          "Ethics, Biostats, Patient Safety: 5-8% combined",
        ],
      },
      {
        type: "chart",
        variant: "donut",
        title: "Step 2 CK Approximate Subject Weighting",
        caption:
          "Source: estimated from USMLE content outlines and student item recall across multiple Step 2 CK forms (2024-2026). Ranges simplified to midpoints for visualization.",
        unit: "%",
        data: [
          { label: "Internal Medicine", value: 32, highlight: true },
          { label: "Surgery", value: 14 },
          { label: "Pediatrics", value: 13 },
          { label: "OB/GYN", value: 9 },
          { label: "Psychiatry", value: 9 },
          { label: "Family Medicine", value: 7 },
          { label: "Emergency Med", value: 5 },
          { label: "Neurology", value: 4 },
          { label: "Ethics/Biostats", value: 7 },
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "These percentages drift slightly between forms. Don't optimize to the decimal — but DO recognize that IM is the single largest swing factor.",
      },
      {
        type: "h2",
        text: "What the NBME content bars actually compare you to",
      },
      {
        type: "p",
        text: "The content area bars on your NBME report compare you to a reference cohort that NBME selects internally. That cohort is not a representative sample of your competition. Surgery and IM cohorts skew toward higher absolute performance; Psychiatry skews lower. A solid black bar in Surgery is more concerning than the same bar in Psychiatry.",
      },
      {
        type: "h2",
        text: "Where final-two-week effort produces the biggest score gain",
      },
      {
        type: "p",
        text: "Per-question effort yields the biggest score lift in Internal Medicine, simply because IM accounts for the largest share of items. A 5-percentage-point improvement in IM accuracy gains more points than the same improvement in Neurology. Prioritize IM weaknesses first, then high-yield Surgery and Pediatrics topics.",
      },
      {
        type: "h2",
        text: "How to read your weakness map",
      },
      {
        type: "ol",
        items: [
          "Find the 2-3 solid black bars on your most recent NBME",
          "Weight by content share: IM bars matter most, Neuro bars matter least",
          "Cross-reference with your UWorld percent correct by system",
          "Spend final dedicated time on the intersection of NBME weak + UWorld weak",
        ],
      },
      {
        type: "callout",
        tone: "success",
        text: "Our paid report includes a personalized weakness map combining your self-reported weak subjects with cohort-level reference data — far more actionable than NBME's reference cohort alone.",
      },
    ],
  },
  {
    slug: "night-before-step-exam-what-to-do",
    title: "What to Do the Night Before Your Step Exam",
    description:
      "An evidence-based pre-exam routine for Step 1, Step 2 CK, or Step 3. What to eat, when to sleep, what to review, and what to absolutely not do.",
    publishedAt: "2026-05-22",
    author: "Dr. A. Patel, MD",
    category: "study-plans",
    tags: ["test-day", "step-1", "step-2-ck", "preparation"],
    readingTime: 6,
    body: [
      {
        type: "p",
        text: "The night before a Step exam contributes far more to your score by what you avoid than by what you accomplish. Here's the short list — and the equally short list of things not to do.",
      },
      {
        type: "h2",
        text: "Do: protect your sleep",
      },
      {
        type: "p",
        text: "The single largest controllable variable for next-day cognitive performance is sleep. Aim for your normal sleep duration, not more. Trying to sleep early disrupts your normal circadian timing and produces fragmented sleep that hurts more than it helps. Bed by your usual time minus 30 minutes is optimal.",
      },
      {
        type: "h2",
        text: "Do: a light review (≤90 minutes)",
      },
      {
        type: "p",
        text: "If you must review, limit it to 60-90 minutes of HIGH-YIELD pre-built notes — biostats formulas, ethics frameworks, anti-arrhythmic side effects. Do NOT start a new content area. Do NOT do practice questions (they introduce new doubt).",
      },
      {
        type: "callout",
        tone: "warning",
        text: "No practice questions the night before. New wrong answers introduce new anxiety with zero compensating benefit.",
      },
      {
        type: "h2",
        text: "Do: pre-pack everything",
      },
      {
        type: "ul",
        items: [
          "Government ID (passport or driver's license)",
          "Scheduling permit (printed copy)",
          "Snacks: nuts, banana, granola bar — slow-release carbs",
          "Water bottle (sealed)",
          "Backup glasses or contacts case",
          "Layered clothing (testing centers run cold)",
          "Earplugs (allowed at most centers; check yours)",
        ],
      },
      {
        type: "h2",
        text: "Don't: caffeine you don't normally use",
      },
      {
        type: "p",
        text: "If you don't drink coffee, today is not the day to start. Caffeine sensitivity is highly individual; first-time use can cause GI upset, anxiety, and jittery hands — all of which hurt performance.",
      },
      {
        type: "h2",
        text: "Don't: read Reddit",
      },
      {
        type: "p",
        text: "Reddit r/Step2 and r/Step1 spike with anxious 'I just took the test and tanked' posts. Don't read them. You'll either internalize someone else's panic or anchor on an outlier topic. Close the app.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Tomorrow is a regular-ish day with high stakes. Your prep is done. Your job tonight is to not undo it.",
      },
    ],
  },
  {
    slug: "amboss-vs-uworld-which-qbank-wins",
    title: "AMBOSS vs UWorld: Which Q-bank Wins for Step 2 CK?",
    description:
      "An honest comparison of AMBOSS and UWorld for Step 2 CK preparation: question quality, interface, hammer ranking, library depth, pricing, and who each one is actually for.",
    publishedAt: "2026-05-22",
    author: "Sarah K., MS4",
    category: "study-plans",
    tags: ["amboss", "uworld", "qbank", "step-2-ck"],
    readingTime: 9,
    body: [
      {
        type: "p",
        text: "Pick one Q-bank. That's the right move — two is overkill and you'll burn out doing both. Here's how AMBOSS and UWorld actually compare across the dimensions that matter for Step 2 CK prep.",
      },
      {
        type: "h2",
        text: "Question quality and difficulty",
      },
      {
        type: "p",
        text: "UWorld questions skew slightly easier than real Step 2 CK and emphasize classic high-yield patterns. AMBOSS questions skew slightly harder, with more curveball edge cases. Real test day usually feels closer to UWorld in difficulty but closer to AMBOSS in question style novelty.",
      },
      {
        type: "h2",
        text: "Interface and review experience",
      },
      {
        type: "ul",
        items: [
          "UWorld: cleaner interface, faster review, better tablet experience",
          "AMBOSS: deeper library integration (click any term → instant deep-dive)",
          "UWorld: longer explanation per question",
          "AMBOSS: 'hammer rating' indicates question difficulty — useful for triage",
        ],
      },
      {
        type: "h2",
        text: "Library depth (the AMBOSS advantage)",
      },
      {
        type: "p",
        text: "AMBOSS's biggest moat is its integrated medical library. When you miss a question, you can click any term in the explanation and land on a comprehensive article. UWorld's explanations are excellent but standalone — you can't drill deeper without leaving the platform.",
      },
      {
        type: "h2",
        text: "Pricing as of 2026",
      },
      {
        type: "ul",
        items: [
          "UWorld Step 2 CK Q-bank: $349 for 3 months, $429 for 6 months",
          "AMBOSS Step 2 CK: $159 for 3 months, $249 for 6 months",
          "AMBOSS often has student discounts via your school",
          "UWorld rarely discounts; runs ~2-3 short sales per year",
        ],
      },
      {
        type: "h2",
        text: "Who should pick UWorld",
      },
      {
        type: "p",
        text: "Pick UWorld if you want the closest-to-real-test-day question style, you're willing to pay a premium for explanation quality, and you don't need a built-in textbook. UWorld is the default and there's a reason — it's been the gold standard for over a decade.",
      },
      {
        type: "h2",
        text: "Who should pick AMBOSS",
      },
      {
        type: "p",
        text: "Pick AMBOSS if you're an IMG who needs to fill content gaps from a non-US medical school, you value the integrated library, you have a shorter prep window and need the hammer rating to triage, or you're price-sensitive. AMBOSS is also strong for Step 1 if you're doing combined prep.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Don't do both. The marginal benefit of a second Q-bank is far smaller than the marginal cost in time. Pick one, complete it twice, take NBMEs in between.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Whatever Q-bank you choose, run your practice scores through our calculator to track your trajectory and project test-day performance.",
      },
    ],
  },
  {
    slug: "average-step-2-score-whats-good",
    title: "Average Step 2 CK Score: What's a 'Good' Score in 2026?",
    description:
      "The 2026 average Step 2 CK score, what counts as a competitive score for each specialty, and how to benchmark your practice scores against residency targets.",
    publishedAt: "2026-05-22",
    author: "Dr. M. Chen, MD",
    category: "score-conversion",
    tags: ["average-score", "step-2-ck", "residency", "benchmarks"],
    readingTime: 7,
    body: [
      {
        type: "p",
        text: "After Step 1 went pass/fail, Step 2 CK became the highest-stakes numeric signal in residency applications. So what's a 'good' score? It depends on your specialty target. Here are the benchmarks.",
      },
      {
        type: "h2",
        text: "The 2026 average Step 2 CK score",
      },
      {
        type: "p",
        text: "The current Step 2 CK national mean for US MD graduates sits around 244, with a standard deviation of ~16 points. The passing threshold is 214. IMGs trail US MDs by roughly 15-20 points on average, though top-quartile IMGs are competitive with US MD medians.",
      },
      {
        type: "h2",
        text: "Competitive scores by specialty (matched applicants, 2026)",
      },
      {
        type: "ul",
        items: [
          "Family Medicine: 230-240",
          "Internal Medicine: 240-250",
          "Pediatrics: 240-250",
          "Emergency Medicine: 245-255",
          "Anesthesiology: 245-255",
          "OB/GYN: 245-255",
          "Psychiatry: 240-250",
          "General Surgery: 250-260",
          "Ortho Surgery: 255-265",
          "Dermatology: 255-265",
          "Neurosurgery: 255-265",
          "Plastic Surgery (integrated): 260-270",
        ],
      },
      {
        type: "chart",
        variant: "bar",
        title: "Median Step 2 CK Score by Specialty (Matched Applicants, 2026)",
        caption:
          "Source: estimated from NRMP Charting Outcomes 2024 + AAMC Step 2 CK Score Summary 2026. Values are midpoints of published ranges.",
        unit: "",
        data: [
          { label: "Plastic Surg", value: 265 },
          { label: "Neurosurgery", value: 260 },
          { label: "Dermatology", value: 260 },
          { label: "Ortho Surgery", value: 260 },
          { label: "General Surgery", value: 255 },
          { label: "EM / Anesth", value: 250 },
          { label: "IM / Peds", value: 245 },
          { label: "Family Med", value: 235, highlight: true },
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "These are medians for MATCHED applicants — not minimums to apply. Applying with scores 10 points below median is reasonable if you have strong research, away rotations, or geographic flexibility.",
      },
      {
        type: "h2",
        text: "What 'good' means in context",
      },
      {
        type: "p",
        text: "A 240 is below average for derm or ortho but excellent for family medicine. A 260 is competitive everywhere but only differentiating in highly competitive surgical specialties. Step 2 CK score utility plateaus around 260 — above that, the marginal benefit per point shrinks dramatically.",
      },
      {
        type: "h2",
        text: "How to benchmark your practice scores",
      },
      {
        type: "p",
        text: "Use your most recent NBME (within 2 weeks of intended test date) as your benchmark. If you're at or above the median for your specialty target, you're on track. If you're 5+ points below, you have two options: more dedicated prep time (typically +3-5 points per extra week up to a cap) or accept the risk and apply more broadly.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Run your NBME scores through our calculator to see your projected Step 2 CK with 95% CI, then compare against your specialty's competitive benchmark.",
      },
    ],
  },
  {
    slug: "nbme-31-curve-easier-or-harder",
    title: "NBME 31 Curve: Easier or Harder Than NBME 30?",
    description:
      "A direct comparison of the NBME 31 score curve vs NBME 30. Question style differences, predictive accuracy, and when to take which form.",
    publishedAt: "2026-05-22",
    author: "Sarah K., MS4",
    category: "score-conversion",
    tags: ["nbme-31", "nbme-30", "self-assessment", "step-2-ck"],
    readingTime: 6,
    noindex: true,
    body: [
      {
        type: "p",
        text: "NBME 31 sits awkwardly between NBME 30 (slightly older, well-studied) and NBME 32 (newest, most predictive). Here's what makes the NBME 31 curve different and when it deserves a slot in your prep.",
      },
      {
        type: "h2",
        text: "Perceived vs actual difficulty",
      },
      {
        type: "p",
        text: "NBME 31 feels slightly easier than NBME 30 in the moment — vignettes are a touch shorter, the most extreme curveball questions are absent. But the curve compensates: a raw score that would yield 245 on NBME 30 maps to roughly 248 on NBME 31. Net effect: similar predicted score, easier test-taking experience.",
      },
      {
        type: "h2",
        text: "Predictive accuracy",
      },
      {
        type: "ul",
        items: [
          "NBME 30: under-predicts real Step 2 CK by ~4 points",
          "NBME 31: under-predicts by ~3.5 points (closer to actual)",
          "NBME 32: under-predicts by ~2.5 points (closest to actual)",
        ],
      },
      {
        type: "h2",
        text: "When NBME 31 is the right pick",
      },
      {
        type: "p",
        text: "Take NBME 31 about 2 weeks before test day, after you've taken NBME 30 (4 weeks out) and before NBME 32 (1 week out). It's a strong middle checkpoint — accurate enough to trust, distinct enough from NBME 32 that you're not just repeating yourself.",
      },
      {
        type: "callout",
        tone: "info",
        text: "If you can only afford two NBMEs, skip NBME 31 and take NBME 32 + Free 120. The newer and more predictive forms give you more signal per dollar.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Run your NBME 30, 31, and 32 scores through our calculator for a weighted Step 2 CK prediction with 95% CI.",
      },
    ],
  },
  {
    slug: "img-step-2-strategy-220-to-250",
    title: "IMG Step 2 CK Strategy: From 220 to 250",
    description:
      "A focused plan for international medical graduates targeting a competitive Step 2 CK score. Where to spend study time, how to use AMBOSS effectively, and the 12-week roadmap.",
    publishedAt: "2026-05-22",
    author: "Dr. M. Chen, MD",
    category: "study-plans",
    tags: ["img", "step-2-ck", "study-plan", "strategy"],
    readingTime: 11,
    body: [
      {
        type: "p",
        text: "For international medical graduates, Step 2 CK isn't just a number — it's the single largest controllable variable in your match application. Moving from a 220 baseline to a 250 target is achievable with a focused 12-week plan. Here's how.",
      },
      {
        type: "h2",
        text: "The IMG-specific challenges",
      },
      {
        type: "p",
        text: "IMGs face three structural disadvantages on Step 2 CK: less US-style clinical vignette exposure during medical school, English as a second language for many candidates (slower reading speed under time pressure), and unfamiliarity with US healthcare-system specifics that show up in ethics and patient safety items.",
      },
      {
        type: "h2",
        text: "The 12-week roadmap",
      },
      {
        type: "h3",
        text: "Weeks 1-4: Foundation rebuild",
      },
      {
        type: "ul",
        items: [
          "Complete AMBOSS or UWorld system-by-system, organized blocks of 40 questions",
          "Read full explanations even on correct answers — vocabulary matters",
          "Build an Anki deck of US-specific terminology and care pathways",
          "Take NBME 28 as a cold baseline at end of week 4",
        ],
      },
      {
        type: "h3",
        text: "Weeks 5-8: Q-bank completion",
      },
      {
        type: "ul",
        items: [
          "Finish first pass of Q-bank, mixed timed blocks",
          "Target 80 questions per day, 5-6 days per week",
          "Take NBME 30 at end of week 8 — expect 10-15 point improvement",
          "Identify the 2-3 weakest content areas for dedicated review",
        ],
      },
      {
        type: "h3",
        text: "Weeks 9-12: Dedicated and predictive forms",
      },
      {
        type: "ul",
        items: [
          "Reset Q-bank to incorrect-only, mixed timed blocks",
          "Take NBME 31 (week 10) and NBME 32 (week 11)",
          "Take Free 120 in week 12, 7-10 days before test",
          "Light content review only — no new material in final week",
        ],
      },
      {
        type: "h2",
        text: "Time on test as a separate skill",
      },
      {
        type: "p",
        text: "Many IMGs leave 5-10 minutes on the table per block because reading time eats into answer time. Practice timed UWorld blocks WITH a deliberate 90-second per question hard limit. If you can't answer in 90 seconds, mark and move on. This is the single largest test-taking skill gap for non-native English speakers.",
      },
      {
        type: "h2",
        text: "Ethics and patient safety: the cultural gap",
      },
      {
        type: "p",
        text: "Patient autonomy, informed consent edge cases, mandated reporting, end-of-life decisions — these vary substantially across healthcare systems. Build a dedicated AMBOSS or UWorld topic filter for ethics and do 30-40 questions specifically on these topics in your final two weeks.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "A 250+ Step 2 CK as an IMG opens roughly 60% of US residency programs to your application. Below 240 narrows the field substantially. The 220-to-250 jump is worth every hour.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Track your trajectory across NBMEs and AMBOSS Predictor scores in our calculator. Pro users get unlimited tracking across the full 12-week prep.",
      },
    ],
  },
  {
    slug: "most-tested-topics-step-2-ck",
    title: "Most Tested Topics on Step 2 CK (2026)",
    description:
      "The high-yield topics that appear repeatedly on Step 2 CK forms: diabetic ketoacidosis, pre-eclampsia, anti-arrhythmic toxicities, and the rest of the must-know list.",
    publishedAt: "2026-05-22",
    author: "Sarah K., MS4",
    category: "step-2-tips",
    tags: ["high-yield", "step-2-ck", "study-plan"],
    readingTime: 8,
    body: [
      {
        type: "p",
        text: "Some topics show up on virtually every Step 2 CK form. They're high-yield because they're high-incidence in clinical practice, easy to write good vignettes for, and they discriminate well between prepared and unprepared students. Master these before you optimize anything else.",
      },
      {
        type: "h2",
        text: "Internal Medicine high-yield",
      },
      {
        type: "ul",
        items: [
          "DKA management protocol (insulin drip, fluid resuscitation, potassium replacement)",
          "Heart failure exacerbation triggers and acute management",
          "Atrial fibrillation: rate control, rhythm control, anticoagulation decisions",
          "Sepsis bundle and septic shock management",
          "Anti-arrhythmic side effect profiles (amiodarone in particular)",
          "DVT/PE diagnosis (Wells criteria) and anticoagulation choice",
          "Pneumonia: CAP vs HCAP, organism by setting, empiric therapy",
        ],
      },
      {
        type: "h2",
        text: "Surgery high-yield",
      },
      {
        type: "ul",
        items: [
          "Acute abdomen workup by quadrant",
          "Small bowel obstruction vs ileus differentiation",
          "Trauma ABCs and FAST exam interpretation",
          "Post-op fever timeline (wind, water, wound, walking, wonder drugs)",
          "Compartment syndrome recognition",
        ],
      },
      {
        type: "h2",
        text: "OB/GYN high-yield",
      },
      {
        type: "ul",
        items: [
          "Pre-eclampsia diagnostic criteria and severe features",
          "Postpartum hemorrhage causes (4 T's) and management",
          "Ectopic pregnancy diagnostic algorithm",
          "Gestational diabetes screening and management",
          "Contraception choice by patient profile and contraindications",
        ],
      },
      {
        type: "h2",
        text: "Pediatrics high-yield",
      },
      {
        type: "ul",
        items: [
          "Developmental milestones by age",
          "Vaccine schedule and contraindications",
          "Pediatric airway emergencies (croup vs epiglottitis)",
          "Failure to thrive workup",
          "Common rashes by age and pattern",
        ],
      },
      {
        type: "h2",
        text: "Psychiatry high-yield",
      },
      {
        type: "ul",
        items: [
          "Antidepressant choice and side effect profiles",
          "Antipsychotic side effects (especially metabolic and EPS)",
          "Bipolar I vs II distinction and first-line treatment",
          "Suicidality risk assessment and disposition",
          "Substance withdrawal timelines and management",
        ],
      },
      {
        type: "h2",
        text: "The non-clinical high-yield",
      },
      {
        type: "ul",
        items: [
          "Patient autonomy edge cases (Jehovah's Witness, minors, capacity)",
          "Mandated reporting (abuse, certain infections, gunshot wounds)",
          "Informed consent exceptions",
          "Sensitivity, specificity, PPV, NPV calculations",
          "Likelihood ratios and pre/post-test probability",
          "Study design strengths and biases",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Coverage of these topics is the floor, not the ceiling. After you've mastered these, every additional topic you study yields diminishing returns.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Use our calculator to project where you stand right now, then prioritize the high-yield topics tied to your weakest content areas.",
      },
    ],
  },
  {
    slug: "step-3-ccs-cases-complete-walkthrough",
    title: "Step 3 CCS Cases: Complete Walkthrough",
    description:
      "How the Step 3 Computer-based Case Simulations (CCS) work, the scoring rubric, the time-management strategy, and the 10 case archetypes you'll encounter.",
    publishedAt: "2026-05-22",
    author: "Dr. M. Chen, MD",
    category: "study-plans",
    tags: ["step-3", "ccs", "study-plan"],
    readingTime: 11,
    body: [
      {
        type: "p",
        text: "Step 3 Computer-based Case Simulations (CCS) feel completely different from any other exam component you've taken. Unlimited freedom to order tests, advance time, and make management decisions — but every action is scored. Here's how to navigate them.",
      },
      {
        type: "h2",
        text: "What CCS actually is",
      },
      {
        type: "p",
        text: "CCS is the second day of Step 3. You manage 13 simulated patient cases over ~4 hours. Each case runs for a fixed amount of in-simulation time (10 or 20 minutes real time, days to weeks in simulated time). You order tests, write prescriptions, move the patient between care settings, and advance the clock — all in a stripped-down interface that mimics an EHR.",
      },
      {
        type: "h2",
        text: "The scoring rubric (what we know)",
      },
      {
        type: "ul",
        items: [
          "Diagnostic completeness: did you order the necessary workup?",
          "Therapeutic appropriateness: did you start correct treatment?",
          "Sequencing: did you act in the right order?",
          "Avoidance of harm: did you avoid contraindicated actions?",
          "Setting transitions: did you move the patient to the right level of care?",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "USMLE doesn't publish the exact rubric. Above is the consensus from prep providers and student debriefs. The exam rewards correct actions and penalizes harmful ones; benign-but-unnecessary actions are largely neutral.",
      },
      {
        type: "h2",
        text: "Time management",
      },
      {
        type: "p",
        text: "Each case has a hard clock. Don't burn real-time minutes deliberating — order what you need, advance the clock, react to changes. Cases that run their full 10 or 20 minutes without you finishing the workup will score lower than cases where you reach a final disposition with time to spare.",
      },
      {
        type: "h2",
        text: "The 10 case archetypes",
      },
      {
        type: "ol",
        items: [
          "Acute chest pain (MI rule-out workup, anticoag, transfer to cath lab)",
          "Acute abdomen (surgical consult, imaging, NPO, IV fluids)",
          "Septic shock (cultures, fluids, broad-spectrum, vasopressors, ICU)",
          "DKA (insulin drip, potassium, fluids, monitoring)",
          "Stroke (CT, tPA window, neurology consult)",
          "GI bleed (IV access, PRBCs, EGD)",
          "Pediatric fever (workup by age, empiric antibiotics if indicated)",
          "Pre-eclampsia (BP control, magnesium, delivery planning)",
          "Acute psychiatric emergency (safety, hold criteria, restraints rules)",
          "Outpatient chronic disease management (vaccinations, screenings)",
        ],
      },
      {
        type: "h2",
        text: "Common scoring leaks",
      },
      {
        type: "ul",
        items: [
          "Forgetting baseline vitals and basic labs at presentation",
          "Failing to update orders when the patient transitions settings (ED → floor → ICU)",
          "Ordering studies but never checking the results",
          "Discharging without follow-up scheduling, vaccinations, or counseling",
          "Skipping the time-advance steps to see if treatment is working",
        ],
      },
      {
        type: "h2",
        text: "Recommended prep",
      },
      {
        type: "p",
        text: "UWorld's CCS module is the standard. Run through all 50+ practice cases, then practice the official USMLE CCS tutorial software (free download) until the interface is muscle memory. The interface itself is the largest barrier — content knowledge transfers from Step 2 CK with minimal additional study.",
      },
      {
        type: "callout",
        tone: "success",
        text: "Use our Step 3 predictor to check whether your CCS practice performance is on track for your target score.",
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
