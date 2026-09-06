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

## 2026-08-08 · Round 5 · npm v1.0.0 验收完成

### 完成项

- `nbmecalc-score-conversion@1.0.0` 已在 npm Registry 公开。
- 公共验收地址：`https://www.npmjs.com/package/nbmecalc-score-conversion`。
- Registry tarball：`https://registry.npmjs.org/nbmecalc-score-conversion/-/nbmecalc-score-conversion-1.0.0.tgz`。
- GitHub Actions 手动发布运行 `31263041431` 已完成，结论为 `success`。
- 用户于 2026-08-08 在浏览器确认公共页面并指示本地标记验收完成。

### 验收结果

- P15 状态：`Complete`。
- 完成的公开列表：`1`。
- 唯一引荐根域：`1`（`npmjs.com`）。
- 自动化最终 DOM 审计被 npm Cloudflare 403 challenge 阻止，因此未把该链接声明为 follow 或 nofollow；用户浏览器验收作为本轮完成依据。

### 下一步

1. 7 天后复查 npm 页面公开性、索引指令和链接 `rel`。
2. 下一项继续处理一个主题匹配的 GitHub 教育资源清单 PR，不批量投递。

## 2026-08-09 · Round 6 · 既有开发者资产盘点与待审队列复核

### 完成项

- 按公开 Java 仓库的历史审计记录，将既有跨生态资产同步到本项目的 [能力地图](./capability-map.md) 与 [外链总台账](./backlink-ledger.md)。
- 已核验历史合格根域为 15 个；加上用户验收的 npm `1.0.0`，当前完成公开列表和唯一根域均为 16。
- 复核当前待审平台：
  - Package Control PR [#9510](https://github.com/sublimehq/package_control_channel/pull/9510) 仍为 Open，目录详情页仍未公开；
  - Open VSX 的 SPA 路径返回 200，但其扩展 API 返回 404，未形成公开条目；
  - NetBeans 预期门户路由仅返回通用页面，不能当作验收；
  - MCP Hub 预期详情页仍未公开。

### 当前状态

- 新增构建：`0`。现有语言库和编辑器资产已足够，不新增重复包装器。
- 可立即验收的新增平台：`0`。
- 需用户授权后可推进：Open VSX、JetBrains Marketplace；其余项目均在第三方审核队列。

### 下一步

1. 等待 Package Control、NetBeans 或 MCP Hub 出现公共详情页后，先做最终页面审计再计入新根域。
2. 若要主动推进，优先处理 Open VSX 的 Publisher Agreement 与 `OVSX_PAT`，它使用现有已测试 VS Code 扩展并可带来一个新根域。

## 2026-08-09 · Round 7 · Open VSX 扩展发布与验收完成

### 完成项

- 用户已配置 `OVSX_PAT` GitHub Secret。
- 触发 [Publish Open VSX](https://github.com/jiankn/nbmecalc-vscode/actions/runs/31293145756) 手动工作流；依赖安装、5 个测试、VSIX 打包、publisher namespace 创建及发布全部成功。
- 工作流日志确认发布：`jiankn.nbmecalc-score-tools v0.1.0`。
- Registry API 最终返回公开版本与可下载 VSIX：`https://open-vsx.org/api/jiankn/nbmecalc-score-tools/0.1.0`。
- 最终页面审计通过：
  - `https://open-vsx.org/extension/jiankn/nbmecalc-score-tools` 返回 HTTP 200；
  - 未发现页面级 `noindex` 或 `X-Robots-Tag`；
  - `USMLE Step score calculator` 精确指向 `https://nbmecalc.com/`；
  - 目标锚文本 `rel` 为空，属于 ordinary follow。

### 当前状态

- Open VSX：`Complete`，新增 `open-vsx.org` 根域。
- 完成公开列表：`17`；唯一引荐根域：`17`；已核验 ordinary-follow + indexable 根域：`16`。
- 待处理：Package Control、JetBrains Marketplace、NetBeans Plugin Portal、MCP Hub。

### 下一步

1. 继续等待三个已提交平台生成公共详情页；公开后先审计，后计数。
2. 若要主动新增下一根域，下一项是 JetBrains Marketplace 的首次人工上传与 Vendor profile 授权。

## 2026-08-09 · Round 8 · 待审队列与 JetBrains 发布通道复核

### 完成项

- 发布后镜像检索没有发现可单独验收的新根域；搜索结果仅返回已有主站、GitHub、Maven Central、docs.rs 等已记录页面。
- 复核 Package Control PR [#9510](https://github.com/sublimehq/package_control_channel/pull/9510)：仍为 Open，无 review、comment、status check 或可由仓库端修复的冲突。
- 复核 `jiankn/nbmecalc-jetbrains`：
  - `Publish JetBrains Marketplace` 手动工作流已存在；
  - 工作流会执行测试、插件构建和配置验证后才发布；
  - 目前没有 GitHub Actions Secret，预期名称为 `JETBRAINS_MARKETPLACE_TOKEN`。

### 当前状态

- 新增公开外链：`0`（Open VSX 已是上一轮新增并验收）。
- 无用户操作可继续的项目：Package Control、NetBeans、MCP Hub，均等待第三方审核。
- 可由一次用户授权主动推进的项目：JetBrains Marketplace。

### 下一步

1. 用户完成 JetBrains Marketplace 首次开发者授权并将 token 作为 `JETBRAINS_MARKETPLACE_TOKEN` 添加到仓库 Secret 后，运行发布工作流。
2. 发布后审计 `plugins.jetbrains.com` 公开详情页的 HTTP、robots、精确锚文本和 `rel`，通过才计入新根域。

## 2026-08-09 · Round 9 · JetBrains 自动发布首轮验证

### 完成项

- 确认 `jiankn/nbmecalc-jetbrains` 的 GitHub Actions Secret `JETBRAINS_MARKETPLACE_TOKEN` 已配置。
- 触发 [Publish JetBrains Marketplace workflow 31318724351](https://github.com/jiankn/nbmecalc-jetbrains/actions/runs/31318724351)。
- `./gradlew test buildPlugin verifyPluginProjectConfiguration --stacktrace` 完成成功；测试、插件 ZIP 构建与配置校验通过。

### 验证结果与阻塞

- `publishPlugin` 上传阶段返回：`Cannot find plugin`。
- 这是 Marketplace 的首发规则，不是 token 或代码/构建失败：官方要求第一个版本先通过后台 `Add new plugin` 手动上传，以补全许可证、仓库 URL 等页面资料；之后 GitHub workflow 才能自动发布更新。
- 通过独立临时 JDK 在本机构建并校验了首发 ZIP：`backlink-artifacts/nbmecalc-jetbrains-0.1.0.zip`（287,049 bytes，包含插件 JAR 与依赖）；未安装或修改系统 Java。

### 当前状态与下一步

- JetBrains Marketplace 首发 ZIP 已提交，当前为 `pending Marketplace review`；没有公共详情页，不能计入新增根域。
- 用户在 [Marketplace Profile](https://plugins.jetbrains.com/author/me) 点击 **Add new plugin**，上传 [本地首发 ZIP](./backlink-artifacts/nbmecalc-jetbrains-0.1.0.zip)，填写首发页面资料并提交。
- 用户完成首发后，等待并审计最终公开页面的 HTTP、robots、精确锚文本与 `rel`；后续版本更新才运行 `publish-jetbrains.yml`。

## 2026-08-09 · Round 10 · JetBrains Marketplace 审核中

### 当前状态

- 用户已手动提交 `nbmecalc-jetbrains-0.1.0.zip` 首发版本，等待 JetBrains Marketplace 审核。
- 状态标记为 `pending Marketplace review`；没有公开详情页、HTTP/robots/锚文本/`rel` 验收证据，不计入新增外链或引荐根域。

### 下一步

- 审核通过且公开详情页出现后，立即运行最终页面审计；通过后才将 `plugins.jetbrains.com` 计入完成统计。
