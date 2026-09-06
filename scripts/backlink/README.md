# 外链流水线（scripts/backlink）

把 NBMEcalc 外链工作里可机器完成的部分自动化：候选采集 → 现场核验 → 生成话术 → 上线验收。
只用 Node 内置能力，不需要 `npm install`，不需要 API key。

人只负责三件机器不该替他做的事：**注册账号 / 过验证码 / 按下最后的提交或发送键**。

## 一次跑通

```bash
npm run backlink:sync                                   # 拉取两个上游数据集到 .backlink-cache/
npm run backlink:harvest                                # 离线筛选，去重，排除已有根域
npm run backlink:qualify -- --tier A --limit 20         # 现场核验：活着吗？可索引吗？真给 follow 外链吗？
npm run backlink:draft                                  # 为通过的目标生成可直接发的邮件/表单字段
npm run backlink:audit                                  # 对 backlink-ledger.md 的每条链接做存活与 rel 审计
```

## 各步在做什么

| 脚本 | 输入 | 输出 | 作用 |
|---|---|---|---|
| `sync-sources.mjs` | — | `.backlink-cache/` | 浅克隆 `flaqai/backlink_skills`（743 个免费目录入口）与 `ppop123/ai-tools-radar`（12,000 个真实给过 dofollow 的页面） |
| `harvest.mjs` | 上述两份数据 + `backlink-ledger.md` | `candidates.json` / `.md` | 解析、去重、按根域排除已完成项，按医学教育相关度打分分 Tier；上游备注里的「停服 / 收费 / 反链引导 / 无提交入口」直接淘汰 |
| `qualify.mjs` | `candidates.json` | `qualified.json` / `.md` | 并发抓取每个入口：HTTP 状态、`noindex`（meta 与 `X-Robots-Tag`）、付费与互链话术、captcha、登录墙、**出站链接里有多少是 follow** |
| `draft.mjs` | `qualified.json` + `kit.json` | `backlink-submissions/outbox/*.md` | 按目标页主题路由锚文本（A1–A16），套 `kit.json` 的字段包，生成可直接粘贴的邮件或表单值 |
| `audit.mjs` | `backlink-ledger.md` | `audit.json` / `.md` | 逐条验收：页面 2xx、无 noindex、目标 URL 出现在最终 HTML、抓出**真实锚文本与 `rel` tokens**；有回退时退出码 1 |

## kit.json

所有对外字段的唯一出处：品牌、定价口径、分类、标签、三档长度的描述、必带的免责声明、禁用措辞（`forbiddenClaims`），以及 A1–A16 的锚文本↔落地页路由表。改文案只改这一个文件。

## 判定口径

`qualify.mjs` 的 `reject`：不可达、4xx/5xx、`noindex`、页面出现付费或互链要求、或所有出站链接都是 nofollow。
`manual`：有 captcha 或需要账号——必须人来做。
`go`：页面活着、可索引、且确实给出过 follow 出站链接。

`audit.mjs` 的 `FAIL` 不等于链接掉了：反爬 403（npm、Codeberg、R-universe）和 JS 渲染页面（Open VSX）会以 FAIL 出现，需人工复核后再改台账。

## 边界

- 不绕验证码、不代注册、不用假身份批量投递、不做评论群发、不买链接、不做互链交换——这些既违反本项目 `BACKLINK_BUILD_PLAN.md` 的原则，也不在本流水线的能力里。
- `draft.mjs` 产出的是**草稿**。发信前确认收件人、语气和对方当前条款；不要群发。
- 提交完成后把公开详情页 URL 补进 `backlink-ledger.md`，再跑 `backlink:audit` 验收，通过才计入根域。

## 数据来源的真实情况

- `flaqai/backlink_skills` 的 743 个入口几乎全是 AI 工具目录，对一个 USMLE 计算器的相关度只有 5–7 分，因此全部落在 Tier C。它的价值主要在配套的 SPD 提交技能，不在这份清单本身。
- `ppop123/ai-tools-radar` 的流量表不含任何 USMLE/医学教育竞品（`nbcalc.com`、`uworld.com`、`amboss.com` 命中数均为 0），但它的 12,000 条 dofollow 来源页里筛得出医学院图书馆、护理学院博客、医学教育机构的资源页——那才是对本项目有用的部分。
