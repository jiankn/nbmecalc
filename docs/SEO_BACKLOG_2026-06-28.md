# SEO implementation backlog — 2026-06-28

Source: Google Search Console export through 2026-06-26, enriched with
DataForSEO US-English search volume and keyword difficulty on 2026-06-28.

## Completed in this pass

- [x] Remove invalid `app/nbme-[number]-conversion` route.
- [x] Permanently redirect the exposed NBME 28-32 conversion URLs to the
      canonical conversion hub.
- [x] Remove 404 URLs from the sitemap.
- [x] Stop using build time as the sitemap `lastmod` value.
- [x] Separate CBSSA, CCSSA, and CCMSA form selectors by target Step exam.
- [x] Update the Step 2 CK passing standard to 218.
- [x] Separate intent across the conversion hub, calculator, and forms guide.
- [x] Align Step 2, Free 120, CMS, and Step 3 metadata and visible headings
      with the validated GSC keyword clusters.
- [x] Replace unsupported fixed-adjustment and “most predictive” claims on
      the priority landing pages with uncertainty-aware language.
- [x] Add descriptive internal links to both the calculator and forms guide.

## Editorial and trust work completed

- [x] Remove cohort-size, holdout-error, and accuracy claims that cannot be
      reproduced from a versioned dataset in this repository.
- [x] Add visible official-source notes, model limitations, a methodology
      page, material change log, and correction path.
- [x] Review older blog posts for obsolete Step 2 pass thresholds, incorrect
      CBSSA/CCSSA form references, and unsupported accuracy claims.
- [x] Exclude affected drafts from the sitemap, blog indexes, category pages,
      and related-post modules until they are rewritten and source-checked.
- [x] Record the admission decision for individual form pages: do not publish
      keyword-swapped pages without unique evidence and a verified
      form-to-exam mapping.
- [x] Remove synthetic cohort subject averages and cohort percentile output
      until a reproducible subject-level dataset exists.
- [x] Replace unverified physician-reviewer identities with a transparent
      editorial review status.
- [x] Add an automated index audit covering sitemap status, metadata,
      canonicals, H1s, noindex conflicts, JSON-LD, duplicate snippets,
      internal links, and permanent redirects.

## External follow-up

- [ ] Deploy the reviewed code to production.
- [ ] Re-submit or ping the production sitemap after deployment.
- [ ] Re-check query-to-page mapping and coverage in GSC 28 days after
      production deployment.
- [ ] Publish individual form pages only after unique, evidence-backed
      editorial material is supplied for each form.
- [ ] Publish validation metrics only after a versioned outcome dataset and
      holdout methodology are added to the repository.

## Acceptance checks

- Priority public pages build successfully and expose one title, description,
  H1, self-canonical, and crawlable body.
- `/nbme-28-conversion` through `/nbme-32-conversion` redirect permanently.
- No redirecting or 404 URL appears in `sitemap.xml`.
- Step 2 calculator form choices use CCSSA 9-15.
- Step 1 choices use CBSSA 26-32.
- Step 3 choices use CCMSA 5-7.
