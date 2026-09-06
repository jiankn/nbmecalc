# nbmecalc-score-conversion

Small, dependency-free JavaScript helpers for interpreting NBME-style practice-assessment inputs during USMLE study planning.

This package supports UWSA 1/2 and Free 120 inputs across Step workflows. Direct NBME CCSSA, AMBOSS Step 2 Self-Assessment, and CMS inputs are supported only for Step 2 CK because the current assessment families use different report scales. It returns an internally equated three-digit planning value and a model-generated interval so downstream tools can show uncertainty instead of a falsely precise single number.

The mappings are independent assumptions. They are not official NBME or USMLE conversions, do not represent NBME endorsement, and have not been evaluated in a published independent holdout cohort. Read the [NBME score conversion](https://nbmecalc.com/nbme-score-conversion) page for the browser workflow and the public [methodology and assumptions](https://nbmecalc.com/methodology) before using the output.

## Install

```bash
npm install nbmecalc-score-conversion
```

## Use

```js
import { computeEstimate, convertExam } from "nbmecalc-score-conversion";

const single = convertExam({ source: "NBME", score: 240, formNumber: 32 }, "step2");
console.log(single); // 249 under algorithm v1.3 assumptions

const estimate = computeEstimate([
  { source: "NBME", score: 240, formNumber: 32, takenDaysAgo: 2 },
  { source: "FREE120", score: 75, takenDaysAgo: 8 },
], "step2");

console.log(estimate.pointEstimate, estimate.ciLower, estimate.ciUpper);
```

`source` is one of `NBME`, `UWSA1`, `UWSA2`, `FREE120`, `AMBOSS`, or `CMS`. Enter the 3-digit result from the AMBOSS Step 2 Self-Assessment report, not a block percentage or percentile. Enter the current CMS report's 0-100 Total Equated Percent Correct value. Neither source has an official one-to-one Step 2 CK conversion; both remain lower-weight inputs in this independent, unvalidated planning model.

The package deliberately performs local deterministic calculations and makes no network requests. It is intended for educational planning and software integration, not eligibility, clinical, licensing, or institutional decisions.

## Related NBMEcalc resources

- [Free NBME Score Calculator](https://nbmecalc.com/)
- [CMS Form Score Interpretation Guide](https://nbmecalc.com/cms-converter)
- [NBMEcalc validation status](https://nbmecalc.com/validation)

## Development

```bash
npm test
npm run build
npm run pack:check
```

Source repository: [github.com/jiankn/nbmecalc](https://github.com/jiankn/nbmecalc/tree/main/packages/nbmecalc-score-conversion)
