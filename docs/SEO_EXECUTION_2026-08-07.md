# SEO execution ledger — 2026-08-07

Source of prioritization: first-party Google Search Console export through
2026-08-05. This file records actions and handoffs; it does not claim an
external placement until the live URL and target URL are verified.

## GSC decision record

| Cluster | Clicks | Impressions | Avg. position | Decision |
|---|---:|---:|---:|---|
| `/cms-converter` | 576 | 3,937 | 7.71 | Defend; improve task completion and accuracy |
| `/free-120-predictor` | 181 | 2,783 | 9.99 | Keep current/2021/2019 intent consolidated |
| `/nbme-score-conversion` | 108 | 2,626 | 17.52 | Primary on-page growth target |
| `/` | 47 | 1,015 | 22.49 | Keep homepage focused on NBME score calculator |
| `/amboss-converter` | 16 | 529 | 14.36 | Improve after the three clusters above |
| `/step-2-predictor` | 2 | 303 | 34.79 | Do not create more generic predictor pages yet |

The exact query `nbme cms form score conversion` already averaged position
2.30. The query `nbme 32 score conversion` produced 16 clicks from 70
impressions at position 6.41; it should receive a unique section inside the
existing NBME conversion hub before a separate URL is considered.

## Keyword-to-asset routing

| Intent | Canonical target | Linkable support asset | Anchor guidance |
|---|---|---|---|
| CMS score conversion | `/cms-converter` | CMS report-field interpretation table | Brand, URL, or “CMS form score conversion guide” |
| Free 120 scoring/version | `/free-120-predictor` | Current vs 2021 vs 2019 comparison | Brand, URL, or exact title where editorially natural |
| NBME score conversion | `/nbme-score-conversion` | NBME 32 interpretation section | Mostly partial-match and branded anchors |
| Model evidence | `/validation` | `/validation-status.json` | “NBMEcalc validation status” |
| Method details | `/methodology` | Public methodology/changelog | “methodology and assumptions” |

## Placement ledger

| Platform / publication | Asset | Target | Status | Evidence required |
|---|---|---|---|---|
| Medical-school resource/library pages | Validation protocol | `/validation` | Planned — owner outreach required | Live resource-page URL |
| USMLE study-guide maintainers | CMS/Free 120 guide | Relevant converter | Planned — editorial outreach required | Accepted link or PR URL |
| Reddit r/Step1 / r/Step2 | Calculator plus transparent caveat | Most relevant landing page | Planned — account owner action required | Live thread URL; no vote manipulation |
| GitHub educational resource lists | Machine-readable status/methodology | `/validation-status.json` | Planned — repository-fit review required | Pull request URL |
| Product launch directories | Product homepage | `/` | Planned — account owner action required | Published listing URL |

## Outreach guardrails

- Lead with the useful table, protocol, or calculator—not a request to trade links.
- Disclose that the model does not yet have a published holdout cohort.
- Never use fake reviews, school logos, sponsored-looking editorial placements,
  automated forum posting, or exact-match anchor quotas.
- Mark a placement complete only after checking that the source page is live,
  indexable, and links to the intended canonical URL.
- Recheck each live placement after 7 days and 30 days.

## Next review gate

Review GSC after 28 complete days. Split a new URL only if a query cluster has
repeat impressions, distinct user intent, and enough unique content to avoid a
thin or cannibalizing page. Do not use domain-rating targets as the success
metric; use qualified referral traffic, indexed editorial placements, and
movement on the routed landing page.
