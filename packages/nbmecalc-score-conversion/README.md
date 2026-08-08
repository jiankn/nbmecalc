# nbmecalc-score-conversion

Small, dependency-free JavaScript helpers for interpreting NBME-style practice-assessment inputs during USMLE study planning.

This package supports NBME, UWSA 1/2, Free 120, AMBOSS, and CMS inputs for Step 1, Step 2 CK, and Step 3 workflows. It returns an internally equated three-digit planning value and a model-generated interval so downstream tools can show uncertainty instead of a falsely precise single number.

The mappings are independent assumptions. They are not official NBME or USMLE conversions, do not represent NBME endorsement, and have not been evaluated in a published independent holdout cohort. Read the [NBME score conversion](https://nbmecalc.com/nbme-score-conversion) page for the browser workflow and the public [methodology and assumptions](https://nbmecalc.com/methodology) before using the output.

## Install

```bash
npm install nbmecalc-score-conversion
```

## Use

```js
import { computeEstimate, convertExam } from "nbmecalc-score-conversion";

const single = convertExam({ source: "NBME", score: 240, formNumber: 32 }, "step2");
console.log(single); // 249 under algorithm v1.1 assumptions

const estimate = computeEstimate([
  { source: "NBME", score: 240, formNumber: 32, takenDaysAgo: 2 },
  { source: "FREE120", score: 75, takenDaysAgo: 8 },
], "step2");

console.log(estimate.pointEstimate, estimate.ciLower, estimate.ciUpper);
```

`source` is one of `NBME`, `UWSA1`, `UWSA2`, `FREE120`, `AMBOSS`, or `CMS`. Percent-correct inputs are represented by their numeric percentage; three-digit inputs are represented by their reported score. CMS inputs below 150 are treated as percent-correct subject signals, while values at or above 150 are treated as already-equated inputs.

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
