# npm 发布提交包：`nbmecalc-score-conversion`

状态：Prepared，等待 npm 账号绑定、最终 `npm publish` 和公共页面验证。

## 发布前确认

- Package name: `nbmecalc-score-conversion`
- Version: `1.0.0`
- Homepage / primary backlink target: `https://nbmecalc.com/nbme-score-conversion`
- Contextual methodology link: `https://nbmecalc.com/methodology`
- Source repository: `https://github.com/jiankn/nbmecalc/tree/main/packages/nbmecalc-score-conversion`
- Primary visible anchor in README: `NBME score conversion`
- Secondary visible anchor in README: `methodology and assumptions`
- Registry availability check: npm returned `E404` for this package name on 2026-08-08

## Prepared asset verification

- Node tests: 3 passed, 0 failed
- Syntax build: passed (`node --check index.js`)
- Pack check: 5 public files, 4.3 kB tarball, 10.8 kB unpacked
- Tarball SHA-1 from the verified build: `a137ded688228719a2281a0748d2fca895ca9585`
- Installed-from-tarball invocation: `v1.1`, point estimate `249`, interval `235-263`

## Maintainer action

Preferred path: push the prepared files, add an npm automation token as the repository secret `NPM_TOKEN`, then run the `Score conversion package` GitHub Actions workflow with **Run workflow**. The publish job is manual-dispatch-only and runs only after the Node 18/20/22 test matrix is green.

Local fallback, from this directory after npm login and any required 2FA:

```bash
npm test
npm run build
npm run pack:check
npm publish --access public
```

Never put the npm token in the repository, workflow YAML, or chat.

Do not publish until the package name is still available and the final package contents match the checked-in files.

## Acceptance evidence to return

Record the public package URL, publication date, package version, rendered README URL, HTTP status, `noindex` evidence, and the final `rel` tokens for the two keyword-bearing links. The expected package page is:

`https://www.npmjs.com/package/nbmecalc-score-conversion`

This package listing counts as one public listing and, if indexable, one referring root domain (`npmjs.com`). It must not be counted as complete from the source repository alone.
