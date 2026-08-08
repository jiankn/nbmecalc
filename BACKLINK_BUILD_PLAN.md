# NBMEcalc 外链建设计划与统计台账

更新日期：2026-08-08
维护文件：本文件是项目内锚文本、落地页和外链状态的汇总入口。已有的 [6 周投放计划](./nbmecalc-backlink-plan.md) 与 [首批免费提交指南](./FREE_BACKLINK_SUBMISSION_GUIDE.md) 保留为话术和平台细节参考。

每轮执行记录见 [BACKLINK_PROGRESS_LOG.md](./BACKLINK_PROGRESS_LOG.md)。重新接力时先读取日志最后一条，再按“下一步”和“验收标准”推进。

## 1. 基本约束

| 项目 | 当前值 |
|---|---|
| 品牌名 | NBMEcalc |
| 首选域名 | `https://nbmecalc.com` |
| 主要受众 | USMLE Step 1 / Step 2 CK / Step 3 医学生、教育者和医学图书馆 |
| 外链原则 | 先提供真实的学习规划、评分解释或验证资料，再自然引用对应页面 |
| 可接受属性 | `nofollow` / `ugc` 可作为发现和真实流量来源；需要单独统计，不视为 follow 链接 |
| 完成条件 | 公开详情页 HTTP 2xx、无 `noindex`、目标 URL 在最终渲染内容中出现，并记录锚文本与 `rel` |
| 禁止事项 | 买链接、PBN、批量评论、虚假评价、伪装学生推广、无关占位包、操纵投票 |

当前项目能真实对外复用的能力是：多来源 NBME/UWSA/Free 120/AMBOSS/CMS 结果解释、带不确定性的学习规划估计、公开方法论和验证状态。若建设开发者生态资产，应围绕这些真实能力制作可测试的报告解析、数据校验或教育资源示例，不创建只为放链接的空包。

## 2. 锚文本与目标 URL 路由

每个外部页面只选择一个主要搜索意图和一个 canonical 目标。平台自带的 `Homepage`、`Website`、`Project URL` 字段可以记录为元数据链接，但不计入关键词锚文本。

| 编号 | 主要意图 | 计划锚文本（原文） | Canonical 目标 URL | 适用外部资产 |
|---:|---|---|---|---|
| A1 | 品牌 | `NBMEcalc` | `https://nbmecalc.com/` | 产品档案、资源清单、发布页 |
| A2 | 品牌裸域 | `nbmecalc.com` | `https://nbmecalc.com/` | 论坛签名、邮件、引用文献 |
| A3 | 通用产品 | `free USMLE score predictor` | `https://nbmecalc.com/` | USMLE 资源清单、教育博客 |
| A4 | 通用产品 | `Free multi-source USMLE Step predictor w/ confidence intervals` | `https://nbmecalc.com/` | SDN 签名或产品介绍 |
| A5 | NBME 计算器 | `NBME score calculator` | `https://nbmecalc.com/` | 首页主能力相关的资源介绍 |
| A6 | NBME 转换 | `NBME score conversion`、`NBME score conversion calculator` | `https://nbmecalc.com/nbme-score-conversion` | NBME 结果解释、Step 备考指南 |
| A7 | CMS 专题 | `CMS form score conversion guide` | `https://nbmecalc.com/cms-converter` | CMS 指南、图书馆资源页、产品目录 |
| A8 | CMS 专题品牌标题 | `NBMEcalc CMS Form Score Interpretation Guide` | `https://nbmecalc.com/cms-converter` | SaaSHub、Product Hunt、SDN |
| A9 | Free 120 | `Free 120 Step 2 score conversion` | `https://nbmecalc.com/free-120-predictor` | Free 120 版本比较和学习指南 |
| A10 | Step 1 | `Step 1 predictor` | `https://nbmecalc.com/step-1-predictor` | Step 1 资源清单、UWSA 1 内容 |
| A11 | Step 2 CK | `Step 2 CK predictor`、`step 2 score predictor` | `https://nbmecalc.com/step-2-predictor` | Step 2 资源清单、教育者资料 |
| A12 | Step 3 | `Step 3 predictor` | `https://nbmecalc.com/step-3-predictor` | Step 3 资源清单 |
| A13 | AMBOSS | `AMBOSS converter` | `https://nbmecalc.com/amboss-converter` | AMBOSS 结果解释或对比内容 |
| A14 | 方法细节 | `methodology`、`methodology and assumptions` | `https://nbmecalc.com/methodology` | Reddit/SDN 回答、技术报告、审稿回复 |
| A15 | 证据状态 | `NBMEcalc validation status` | `https://nbmecalc.com/validation` | 医学院资源页、教育者/研究资料 |
| A16 | 机器可读证据 | `validation status JSON`（仅在技术语境自然出现时） | `https://nbmecalc.com/validation-status.json` | GitHub 教育资源列表、自动化文档 |
| A17 | 竞品比较 | `alternative to nbcalc` 或真实的品牌比较短语 | 对应的 `/compare/*` 页面 | 只有页面正文确实讨论该竞品时使用 |

`NBME score calculator` 保持指向首页，因为首页的标题和主要行为拥有该通用意图；`/nbme-calculator` 是 NBME 表单与自评指南，不作为本计划的通用计算器外链目标。不要把所有链接都指向首页，也不要把 CMS、Free 120 或验证类锚文本指向泛化页面。

### 锚文本组合统计规则

旧计划提供过一个组合参考：品牌约 40%、描述性约 30%、页面相关约 20%、裸 URL/方法论约 10%。这只是观察和调节用的组合参考，不是硬性 exact-match 配额；最新执行台账要求根据上下文自然变化。

统计时按“关键词-bearing 可见链接”计数，不把平台字段标签或同一个 README 在多个镜像中的复制计算为新的锚文本机会。每个外部页面原则上只放一个主要关键词链接，确有双重任务时才增加一个相关的辅助链接。

## 3. 平台与来源计划

| 编号 | 外部来源/平台 | 主要锚文本 | 目标 URL | 资产/动作 | 预期属性 | 状态 |
|---:|---|---|---|---|---|---|
| P1 | SaaSHub | A8 | `/cms-converter` | 真实产品档案和截图 | 待核验 | Planned |
| P2 | Product Hunt | A8 或 A1 | `/cms-converter` | 产品发布页和公开说明 | 待核验 | Planned |
| P3 | Student Doctor Network | A7 或 A14 | `/cms-converter` 或 `/methodology` | 披露开发者身份后参与真实讨论 | 通常 nofollow/UGC，待核验 | Planned |
| P4 | UIC Library Step 2 guide | A7，辅助 A14 | `/cms-converter`，辅助 `/methodology` | 人工资源收录邮件 | 待核验 | Planned |
| P5 | OER Commons | A8 | `/cms-converter` | 先发布真实开放许可，再提交教育资源 | 待核验 | Blocked: license |
| P6 | G2 | A8 | `/cms-converter` | 真实产品档案 | 待核验 | Planned |
| P7 | Capterra | A8 | `/cms-converter` | 真实产品档案 | 待核验 | Planned |
| P8 | 医学院图书馆/学生事务资源页 | A3、A6、A7 或 A15 | 与页面主题匹配 | 提供可编辑的评分解释表、验证协议或 CMS 指南 | 需逐页核验 | Planned |
| P9 | USMLE 学习指南维护者 | A6、A7 或 A9 | 对应转换页 | 提交有独立信息价值的指南补充或 PR | 需逐页核验 | Planned |
| P10 | Reddit r/Step1 / r/Step2 | A14 或最相关的 A6/A9/A11 | 对应页面 | 先参与真实问题，再自然引用 | nofollow/UGC 常见 | Planned |
| P11 | GitHub 教育资源列表 | A15 或 A16 | `/validation` 或 `/validation-status.json` | 只提交符合仓库主题的 PR | README 链接属性待核验 | Planned |
| P12 | YouTube USMLE 博主 | A14 或对应工具页 | 对应页面 | 真实演示/说明，描述区链接 | 通常 nofollow，待核验 | Planned |
| P13 | Quora/医学生博客 | A14、A6 或对应专题锚文本 | 对应页面 | 回答真实问题或获得编辑许可 | 属性待核验 | Planned |
| P14 | 竞品提及回收 | A17 | 对应 `/compare/*` | 只在真实竞品语境中提供替代方案 | 需逐页核验 | Planned |
| P15 | npm Registry | A6，辅助 A14 | `https://nbmecalc.com/nbme-score-conversion`，辅助 `/methodology` | `packages/nbmecalc-score-conversion` 可安装包；README 解释真实能力和限制 | README 链接待核验 | Pending user action |

不优先投入 Uneed、Fazier、泛目录批量提交站；若平台要求付费、徽章交换、无关内容或只有不可索引链接，标记为 `Rejected` 或 `Blocked`。

## 4. 外链统计基线

统计口径遵循技能要求：公开列表数和唯一引荐根域分开计算；同一个根域下的多个页面只算一个 referring domain；只有最终公开详情页验证通过才计入已完成。

| 指标 | 当前基线（2026-08-08） | 统计方法 |
|---|---:|---|
| 源仓库/配置资产 | 1 个公开源仓库；6 个本地/可准备资产已推送 | GitHub 源仓库已公开并有包 README/CI；README 外链为平台 `nofollow`，不计入完成列表 |
| 完成的公开列表 | 0 | `Status = Complete` 且有公开 URL |
| 唯一引荐根域 | 0 | 已完成公开 URL 的根域去重 |
| Follow + 可索引 | 0 | 页面 2xx、无 noindex，且目标链接无 `nofollow`/`ugc`/`sponsored` |
| Nofollow / UGC | 0 已验证 | 只在最终 DOM 和 `rel` 验证后计数 |
| Noindex | 0 已验证 | 检查 HTML 与 `X-Robots-Tag` |
| Prepared assets | 2 个 | npm 包及其专用 CI 已完成本地验证，尚未形成公共列表 |
| Planned | 13 个平台/来源 | P1-P4、P6-P14 |
| Blocked | 1 个 | P5，等待站内明确开放许可 |
| Pending user action | 1 个 | P15，等待 npm 登录/2FA 和最终发布 |
| Rejected | 0 | 发现不符合硬门槛的平台后记录原因 |
| 待用户完成的账号动作 | 14 类来源中的账号/邮箱/2FA | 包括 P15 npm；不在聊天中收集密码或 token |

### 目标页可用性检查（2026-08-08）

以下 canonical 目标页均返回 HTTP 200，并在最终 HTML 中声明 `index, follow`：

| 目标页 | HTTP | 页面 robots |
|---|---:|---|
| `https://nbmecalc.com/` | 200 | `index, follow` |
| `https://nbmecalc.com/nbme-score-conversion` | 200 | `index, follow` |
| `https://nbmecalc.com/cms-converter` | 200 | `index, follow` |
| `https://nbmecalc.com/methodology` | 200 | `index, follow` |
| `https://nbmecalc.com/validation` | 200 | `index, follow` |

### 验证后更新的字段

每完成一次提交，必须补齐平台行中的：

1. 公开详情页 URL和根域；
2. 实际可见锚文本、目标 URL 和链接位置；
3. HTTP 状态、`noindex`/`X-Robots-Tag` 证据；
4. 最终 DOM 中的 `rel` tokens（区分普通链接、nofollow、UGC、sponsored）；
5. 发布日期、截图或审计结果、下一次 7 天/30 天复查日期。

没有公开 URL、仍在审核队列、只有 GitHub 源码仓库、或尚未完成 CI/安装验证的资产，不得计入“完成的公开列表”。

## 5. 执行顺序

1. 先确认生产环境的 `/cms-converter`、`/methodology`、`/validation` 可公开访问，并在部署后重新提交 sitemap。
2. 准备 CMS 解释指南、截图和统一合规说明；完成 SaaSHub 产品档案与 Product Hunt 草稿。
3. 阅读 SDN 版规，在获得允许并披露关联关系后只发布一次有实质内容的讨论。
4. 向 UIC Library 和相关医学院资源页发送一次人工收录请求，不要求特定锚文本或 dofollow。
5. 评估并发布真实的开放许可后，再处理 OER Commons；否则保持 Blocked。
6. 建立 GitHub 教育资源列表 PR，优先使用验证协议和机器可读状态资产，不重复复制同一 README 句子。
7. 每个已发布页面在 7 天和 30 天复查公开性、索引指令、目标 URL 和 `rel` 属性。

## 6. 风险与衡量

外链用于发现、实体佐证和合格引荐流量，不承诺排名或流量增长。主要观察指标是：已索引的编辑型引用、合格 referral、目标落地页的 GSC 展现/点击，以及“已发现-尚未编入索引”的变化；不以 Domain Rating 或链接数量单独判断成功。
