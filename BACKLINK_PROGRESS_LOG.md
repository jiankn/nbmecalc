# 外链建设进度日志

本文件采用追加式记录。每次完成外链筛选、资产制作、测试、提交准备、平台发布或公开页面验证，都新增一个日期条目；不得用新的状态覆盖旧证据。

## 接力规则

1. 每个条目必须写明日期、完成项、证据文件、验证结果、当前状态和下一步。
2. `Prepared` 只表示资产已经制作并通过本地验证；不表示平台已经发布。
3. 只有公共详情页可访问、目标 URL 在最终渲染页面中出现、索引指令和 `rel` 属性完成审计后，才可以记为 `Complete`。
4. 账号登录、邮箱验证、CAPTCHA、2FA、命名空间绑定和最终提交属于用户动作；日志中记录为 `Pending user action`，不请求或保存密码、token。
5. 每次重新打开项目时，先读本文件最后一个条目的“下一步”和 [总计划](./BACKLINK_BUILD_PLAN.md)。

## 2026-08-08 · Round 1 · 开发者资产准备完成

### 完成项

- 建立并维护 [总外链计划](./BACKLINK_BUILD_PLAN.md)，包含锚文本→canonical URL 路由、平台台账和统计口径。
- 建立 [平台提交文件索引](./backlink-submissions/platform-submission-index.md)。
- 从项目现有纯函数评分逻辑制作 `nbmecalc-score-conversion` npm 包：
  - [package.json](./packages/nbmecalc-score-conversion/package.json)
  - [运行时代码](./packages/nbmecalc-score-conversion/index.js)
  - [TypeScript 类型声明](./packages/nbmecalc-score-conversion/index.d.ts)
  - [公开 README](./packages/nbmecalc-score-conversion/README.md)
  - [MIT License](./packages/nbmecalc-score-conversion/LICENSE)
  - [Node 测试](./packages/nbmecalc-score-conversion/test/index.test.mjs)
- 准备 npm 发布文件和 GitHub 教育资源清单 PR 文件：
  - [npm-release.md](./backlink-submissions/npm-release.md)
  - [github-resource-list-entry.md](./backlink-submissions/github-resource-list-entry.md)
- 检查 `nbmecalc-score-conversion` npm 包名：2026-08-08 返回 `E404`，当时未发现已注册版本。
- 检查生产目标页：首页、`/nbme-score-conversion`、`/cms-converter`、`/methodology`、`/validation` 均返回 HTTP 200，并声明 `index, follow`。

### 验证结果

- 包内测试：3 passed / 0 failed。
- JavaScript 语法构建：`node --check index.js` 通过。
- npm 打包检查：通过；公开 tarball 包含 5 个文件。
- 从 tarball 安装：通过。
- 安装后真实调用：返回 `algorithmVersion=v1.1`、`pointEstimate=249`、区间 `235-263`。
- 项目原有 Vitest：11 个测试文件、103 个测试全部通过。
- `git diff --check`：通过。

### 当前状态

- 已完成公开外链：`0`。
- 已确认引荐根域：`0`。
- 已准备开发者资产：`1`（npm 包）。
- 计划中的平台/来源：`13`。
- 阻塞：`1`（OER Commons，等待站内明确开放许可）。
- npm 平台状态：`Pending user action`，等待 npm 登录/2FA 后执行发布。
- GitHub 资源清单状态：`Pending user action`，等待选择符合主题的公开仓库并创建 PR。

### 用户接力动作

1. 进入 `packages/nbmecalc-score-conversion`，完成 npm 登录/2FA，运行 `npm publish --access public`。
2. 将公共 npm 页面 URL、版本和发布日期记录回来；下一轮审计该页面的 HTTP、`noindex`、README 锚文本和 `rel`。
3. 选择一个真实匹配的 GitHub 教育资源清单，按 [PR 文件](./backlink-submissions/github-resource-list-entry.md) 粘贴并提交；不要批量复制到多个仓库。
4. SaaSHub、Product Hunt、SDN、UIC Library 等平台继续使用 [首批提交指南](./FREE_BACKLINK_SUBMISSION_GUIDE.md)，每提交一个平台就在本日志新增一条完成或阻塞记录。

### 下一轮验收标准

- npm 公共页面可以返回 HTTP 2xx；
- 页面没有 `noindex` 或阻止索引的 `X-Robots-Tag`；
- README 中的 `NBME score conversion` 指向 `https://nbmecalc.com/nbme-score-conversion`；
- `methodology and assumptions` 指向 `https://nbmecalc.com/methodology`；
- 记录最终 `rel` tokens、公开 URL、根域和发布日期后，才将 P15 改为 `Complete`。

## 2026-08-08 · Round 2 · npm 包 CI 与发布前复核

### 完成项

- 为 `nbmecalc-score-conversion` 增加独立 GitHub Actions 工作流：
  - [score-conversion-package.yml](./.github/workflows/score-conversion-package.yml)
  - 在 Ubuntu 上覆盖 Node 18、20、22。
  - 对包目录执行测试、语法检查和 `npm pack --dry-run` 内容检查。
- 重新检查 npm 注册状态：
  - `npm view nbmecalc-score-conversion` 仍返回 `E404`，包名当前未注册。
  - `npm whoami` 返回 `E401`，本机没有 npm 登录会话。
- 重新执行本地发布前验证：3 个测试通过、语法检查通过、发布包仍为 5 个公开文件、`git diff --check` 通过。

### 验证结果

- CI 配置只监听包源码、测试、README、许可证、包元数据及自身工作流变更。
- 工作流不包含 npm token，不会在未授权时尝试发布。
- GitHub API 确认 `jiankn/nbmecalc` 为公开仓库、默认分支为 `main`；新增包路径尚未推送，审计该路径当前返回 HTTP 404，因此不能计为公开列表。
- 当前公共 npm 页面不存在，因此没有新增可计数的公开列表或引荐根域。

### 当前状态

- 已完成公开外链：`0`。
- 已确认引荐根域：`0`。
- 已准备开发者资产：`2`（npm 包、包专用 CI 工作流）。
- npm 平台状态：`Pending user action`，等待 npm 登录/2FA 后执行发布。
- GitHub 资源清单状态：`Pending user action`，等待选择符合主题的公开仓库并创建 PR。

### 下一步

1. 将本轮文件推送到公开 GitHub 仓库并等待 CI 至少完成一轮绿灯运行。
2. 在 `packages/nbmecalc-score-conversion` 目录完成 npm 登录/2FA 后运行发布命令。
3. 返回 npm 公共页面 URL、版本和发布日期；再审计 README 链接、`noindex` 和最终 `rel`。
4. 选择一个真实匹配的 GitHub 教育资源清单，仅提交一次 PR，并在合并后审计最终渲染文件。

## 2026-08-08 · Round 3 · 手动 npm 发布通道准备完成

### 完成项

- 在 [score-conversion-package.yml](./.github/workflows/score-conversion-package.yml) 增加 `workflow_dispatch` 发布 job：
  - 仅手动触发；
  - 依赖 Node 18/20/22 测试矩阵全部通过；
  - 使用仓库 Secret `NPM_TOKEN`，不在代码或日志中保存 token。
- 更新 [npm-release.md](./backlink-submissions/npm-release.md)，明确仓库 Secret 名称、触发入口和本地 fallback。

### 当前状态

- npm 仍为 `Pending user action`：需要把本轮文件推送到公开仓库、配置 `NPM_TOKEN`，然后手动运行工作流。
- 未生成公共 npm 页面，完成公开外链和引荐根域仍为 `0`。

### 用户接力动作

1. 将本轮文件推送到 `https://github.com/jiankn/nbmecalc` 的 `main` 分支。
2. 在仓库 Settings → Secrets and variables → Actions 中新增 Secret：`NPM_TOKEN`（npm automation token）。
3. Actions → `Score conversion package` → Run workflow；确认三套 Node 测试通过后才会发布。
4. 将 `https://www.npmjs.com/package/nbmecalc-score-conversion` 的版本、发布日期和页面审计结果发回，以便完成 P15 验收。

## 2026-08-08 · Round 4 · 公开仓库与 CI 证据核验

### 完成项

- 提交 `db206251fcb108497739b2c70d485f1b9b004b15` 已推送到公开仓库 `https://github.com/jiankn/nbmecalc` 的 `main` 分支。
- GitHub Actions 运行 [31259586679](https://github.com/jiankn/nbmecalc/actions/runs/31259586679)（`Score conversion package`）完成，结论为 `success`。
- 审计公开包 README：
  - 页面 `https://github.com/jiankn/nbmecalc/blob/main/packages/nbmecalc-score-conversion/README.md` 返回 HTTP 200；
  - 未发现页面级 `noindex` 或 `X-Robots-Tag`；
  - `NBME score conversion` → `/nbme-score-conversion`，`methodology and assumptions` → `/methodology`；
  - 两条链接均由 GitHub 渲染为 `rel="nofollow"`，因此只记录为公开源资产和发现路径，不计入 follow 完成外链。

### 当前状态

- 完成的公开列表：`0`；唯一引荐根域：`0`。
- 公开源仓库/配置资产：`1`（GitHub）；npm 公共包仍不存在。
- npm 平台：`Pending user action`，需要 `NPM_TOKEN` Secret 和手动运行工作流。
- GitHub 教育资源清单：仍为 `Pending user action`，源仓库 README 本身不等同于已合并清单 PR。

### 下一步

1. 配置仓库 Secret `NPM_TOKEN` 并手动运行发布 job，发布前确认包名仍可用。
2. 审计 npm 公共页面的 HTTP、robots、README 可见锚文本和 `rel`，通过后再把 P15 记为 `Complete`。
3. 选择一个主题匹配的教育资源清单，提交一次 GitHub PR；合并后审计最终渲染文件并单独统计其 `rel`。
