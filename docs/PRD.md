# nbmecalc.com — Product Requirements Document (PRD)

> **版本**: 1.0
> **最后更新**: 2026-05-17
> **状态**: Draft → Active
> **负责人**: Solo founder
> **目标读者**: 任何接手该项目的 AI / 工程师

---

## 0. 如何使用本文档

本 PRD 是 **nbmecalc.com** 项目的唯一事实来源（Single Source of Truth）。任何功能开发、技术决策、内容写作均应参考本文档。

- 修改需通过 PR 评审
- 章节使用稳定锚点，便于 AI 引用（如 `#5-3-pricing-tiers`）
- 所有 "TBD" 标记表示尚未决策，需在对应 Sprint 中明确

文档结构：

| 章节 | 内容 |
|---|---|
| §1 | 产品愿景与目标 |
| §2 | 市场与竞争 |
| §3 | 用户画像 |
| §4 | 用户流程与故事 |
| §5 | 商业模式 |
| §6 | 信息架构（路由地图） |
| §7 | 功能规格（细节到字段） |
| §8 | 数据模型（DB Schema） |
| §9 | API 设计 |
| §10 | 算法规格（预测模型） |
| §11 | UI/UX 规范 |
| §12 | SEO 策略 |
| §13 | 内容策略 |
| §14 | 法律 / 合规 / 隐私 |
| §15 | 性能 / 安全 |
| §16 | 技术栈与基础设施（含**SSG-first** 渲染策略） |
| §17 | 度量指标（KPI） |
| §18 | 里程碑（Sprints） |
| §19 | 风险与缓解 |
| §20 | 附录 |

---

## 1. 产品愿景与目标

### 1.1 一句话定义

> **nbmecalc 是一个面向美国医学生的 USMLE Step 分数预测器，把 NBME / UWSA / Free 120 / AMBOSS / CMS Forms 等练习考试分数转换成真实考试的预测分数（带 95% 置信区间），并提供个性化学习计划与 PDF 报告。**

### 1.2 产品目标

| # | 目标 | 度量 | 12 个月目标值 |
|---|---|---|---|
| G1 | 在 SEO 上击败 nbcalc.netlify.app | 月自然流量 | 100K UV/月 |
| G2 | 实现正向现金流 | MRR | $5,000 |
| G3 | 建立医学考试品牌权威 | DR (Domain Rating) | 25+ |
| G4 | 高用户满意度 | NPS | 50+ |

### 1.3 非目标（不做什么）

- ❌ **不做** 医师执照考试 USMLE 之外的考试（如 COMLEX、MCAT、IELTS）
- ❌ **不做** AI 题库 / 模拟题（避开 UWorld、AMBOSS 红海）
- ❌ **不做** 中国大陆市场 / 中文界面（目标 90%+ 美国流量）
- ❌ **不做** 实体产品 / 一对一辅导
- ❌ **不做** 退款（数字产品策略明确）

### 1.4 核心价值主张

| 卖点 | 描述 |
|---|---|
| **多源输入** | 唯一支持 5 种练习考试源（竞品多数只支持 NBME） |
| **置信区间** | 不是单一数字，而是 95% CI 范围，更符合统计实际 |
| **可信赖** | 由真实医师（PGY-2、Pediatrics Resident）审核方法论 |
| **现代 UI** | shadcn/ui + iPhone 17 Pro mockup，远超对手老旧界面 |
| **个性化** | 14 天学习计划 + 学科弱点定位 |

---

## 2. 市场与竞争

### 2.1 市场规模

| 数据 | 值 | 来源 |
|---|---|---|
| 美国年度 USMLE 考生 | ~30,000 | NBME 公开数据 |
| 国际医学毕业生（IMG）考生 | ~30,000 | ECFMG |
| 核心关键词总搜索量 | **17K/月** | Ahrefs |
| 单考生平均备考支出 | $3,000+ | Reddit 调研 |
| 类似 SaaS 工具 ARPU | $30-100/年 | 推断 |

### 2.2 竞争对手分析

| 对手 | UV/月 | DR | 反链 | 优势 | 弱点 | 我们的策略 |
|---|---|---|---|---|---|---|
| **nbcalc.netlify.app** | 80K | 92* | 0 | 老站、搜索排名第一 | UI 极差、跳出率 82%、无功能 | 现代 UI + 多源 + 付费深度 |
| **predictmystepscore.com** | 30K | 23 | 489 | 品牌词强、6 年老站 | 单 Step、无 CI、付费墙 | 免费基础预测 + 高质量 SEO 内容 |
| **usmlepredictor.com** | 4K | 2.3 | 290 | 新站激进做 SEO | 灰帽 PBN、信任度低 | 真实医师背书 |
| **AMBOSS Predictor** | DR 73 | - | - | 母品牌强 | 只是钩子页，UR 4 | 不直接对抗，做对比文吃流量 |

\* nbcalc 是 netlify 子域名，DR 来自母域

### 2.3 差异化矩阵

```
                    免费    多源    CI    报告   订阅   现代UI
nbcalc              ✓       ✗       ✗      ✗      ✗      ✗
predictmystepscore  部分    ✗       ✗      ✓      ✗      部分
amboss              ✓       ✗       ✗      ✗      ✗      ✓
nbmecalc (我们)     ✓       ✓       ✓      ✓      ✓      ✓
```

---

## 3. 用户画像

### 3.1 Persona 1: Sarah — 美国 MD 学生（主要用户，70%）

- **背景**: 美国 MD 项目 M2 / M3 / M4
- **年龄**: 23-28
- **痛点**:
  - 不知道当前 NBME 分数能换成 Step 2 多少分
  - 焦虑：练习分波动大，无法判断是否准备好
  - 希望知道哪些学科是弱点
- **使用场景**: 考前 4-12 周，每做完一次 NBME 就来用
- **支付意愿**: 中等。$15 一次性报告会买，订阅犹豫
- **流量来源**: Google 搜索 "nbme score conversion"、Reddit r/Step2

### 3.2 Persona 2: Raj — 国际医学毕业生 IMG（次要用户，25%）

- **背景**: 印度/巴基斯坦/中国/中东医学院毕业，目标匹配美国住院医
- **年龄**: 25-32
- **痛点**:
  - Step 2 分数对 IMG 至关重要（>250 才有竞争力）
  - 准备周期长（6-12 个月），需要持续追踪
  - 已支付大量在 UWorld、AMBOSS 上
- **使用场景**: 长周期备考，多次 UWSA + NBME，关注进度曲线
- **支付意愿**: 高。Pro 年付 $79 容易接受
- **流量来源**: Reddit r/IMGreddit、Discord、口碑

### 3.3 Persona 3: Dr. M — Residency Applicant / 复习考 Step 3（少量，5%）

- **背景**: PGY-1 / PGY-2 准备 Step 3
- **使用场景**: 一次性预测，不太可能订阅
- **支付意愿**: $15 报告 OK

### 3.4 用户决策路径（典型）

```
搜索 "nbme 30 score conversion"
    ↓
Google SERP → nbmecalc.com/nbme-30-conversion
    ↓
免费输入分数 → 看到 Step 预测 + CI
    ↓
对比段：看到 "想知道弱点学科？升级到完整报告"
    ↓
$14.99 PDF（70% 用户停在这里）
    ↓ 或
$9.99/月 Pro（重度用户，多 Step）
```

---

## 4. 用户流程与故事

### 4.1 核心用户故事（User Stories）

#### Epic 1: 免费预测（引流核心）

```
US-1.1: 作为访客，我希望无需注册就能输入 NBME 分数并立即看到 Step 预测，
        以便快速验证产品价值。

US-1.2: 作为访客，我希望输入多次 NBME 分数（最多 5 次），
        以便获得更准确的加权预测。

US-1.3: 作为访客，我希望看到 95% 置信区间（而非单一数字），
        以便理解预测的不确定性。

US-1.4: 作为访客，我希望看到通过概率（>196 for Step 1, >214 for Step 2），
        以便评估风险。
```

#### Epic 2: 付费报告（变现核心）

```
US-2.1: 作为付费用户，我希望下载 PDF 报告，
        以便离线查看与打印。

US-2.2: 作为付费用户，我希望看到每个学科的预测分数（如 Internal Medicine、Surgery），
        以便定位弱点。

US-2.3: 作为付费用户，我希望获得 14 天学习计划，
        以便知道每天该看什么。

US-2.4: 作为付费用户，我希望邮箱收到报告链接，
        以便随时回访。
```

#### Epic 3: 订阅追踪（高价值用户）

```
US-3.1: 作为 Pro 用户，我希望保存所有历史预测，
        以便看到分数趋势曲线。

US-3.2: 作为 Pro 用户，我希望同时追踪 Step 1 / 2 / 3 三场考试，
        以便贯穿整个 USMLE 周期。

US-3.3: 作为 Pro 用户，我希望分享我的进步到 Reddit / Twitter（含 watermark 链接），
        帮助产品获客。
```

#### Epic 4: SEO 长尾页（流量入口）

```
US-4.1: 作为搜索 "nbme 30 conversion" 的用户，
        我希望落地页直接展示 NBME 30 对应的 Step 预测表，
        以便不用计算。

US-4.2: 作为搜索 "uwsa 1 to step 1" 的用户，
        我希望页面同时提供 UWSA → Step 的转换器 + 解释文章。
```

#### Epic 5: 内容信任（权威建立）

```
US-5.1: 作为犹豫用户，我希望看到真实医师审核了方法论，
        以便信任预测准确性。

US-5.2: 作为犹豫用户，我希望看到 Reddit 真实评价，
        以便降低决策风险。
```

### 4.2 关键流程图

#### 4.2.1 免费 → 付费转化漏斗

```
[ 着陆页 SEO ] → [ 输入分数 ] → [ 查看预测 ]
                                       ↓
                          [ "解锁完整报告" CTA ]
                                       ↓
                         ┌─────────────┴──────────────┐
                         ↓                            ↓
                  [ $14.99 一次性 ]          [ $9.99/月 Pro ]
                         ↓                            ↓
                  [ Stripe Checkout ]        [ Stripe Subscription ]
                         ↓                            ↓
                 [ 邮箱发送 PDF ]              [ 创建 Pro 账号 ]
                                                      ↓
                                              [ Dashboard ]
```

#### 4.2.2 注册账号流程（Magic Link，无密码）

```
1. 用户在 Free 预测后点 "Save my prediction"
2. 输入邮箱
3. 收到 Magic Link 邮件
4. 点击 → 自动登录 → 历史预测自动归属该账号
```

---

## 5. 商业模式

### 5.1 收入结构（目标 1 年内）

| 来源 | 占比预期 | 触达路径 |
|---|---|---|
| Single Report ($14.99) | 60% | 免费预测 → 升级 |
| Pro Monthly ($9.99) | 20% | 重度用户 |
| Pro Annual ($79) | 15% | 长备考周期用户（IMG） |
| Affiliate（UWorld、AMBOSS） | 5% | Blog + Resource Hub |

### 5.2 定价方案 <a id="5-3-pricing-tiers"></a>

| 方案 | 价格 | 功能 |
|---|---|---|
| **Free** | $0 | 单次预测、95% CI、基础学科预览、不能下载 PDF |
| **Single Report** | $14.99 一次性 | + 完整 PDF 报告 + 14 天学习计划 + 完整学科地图 |
| **Pro Monthly** | $9.99/月 | + 无限刷新 + 多 Step 追踪 + 实时时间线 + 所有未来功能 |
| **Pro Annual** | $79/年 | 同 Pro Monthly，年付省 33% |

### 5.3 退款政策

**不退款**。原因：数字产品 PDF 立即下载/可访问。条款写明：

> "All purchases are final. No refunds will be issued for digital products including PDF reports and subscriptions. You may cancel Pro subscriptions at any time to prevent future charges."

### 5.4 Affiliate 计划（次要收入）

- **UWorld 链接**：在 "Recommended Resources" 区域用 affiliate 链接
- **AMBOSS**：同上
- **Anki Premium**：同上
- **Press Kit 页面**：吸引博客 / Reddit KOL 推广

需在每个 affiliate 链接旁加 disclosure：`Affiliate link — we earn a small commission at no extra cost to you.`

---

## 6. 信息架构（路由地图）

### 6.1 完整路由表

```
/                                       # 首页（主预测器 + 全部 section）
├── /pricing                            # 独立定价页
├── /about                              # 关于我们
├── /contact                            # 联系
├── /press                              # Press Kit（媒体/KOL 资源）
├── /privacy                            # 隐私政策
├── /terms                              # 服务条款
├── /affiliate-disclosure               # 联盟链接披露
├── /dmca                               # DMCA
│
├── /login                              # Magic Link 登录
├── /signup                             # 注册（同 login，统一入口）
├── /verify                             # Magic Link 验证回调
├── /dashboard                          # 用户主页（Pro/付费用户）
│   ├── /predictions                    # 历史预测列表
│   ├── /timeline                       # 时间线视图
│   ├── /settings                       # 账户设置
│   └── /billing                        # Stripe Customer Portal 入口
│
├── /report/[id]                        # 单份 PDF 报告页（付费访问）
├── /checkout                           # Stripe Checkout 重定向
├── /checkout/success                   # 支付成功
├── /checkout/cancel                    # 支付取消
│
# === SEO 工具页（核心流量入口）===
├── /nbme-score-calculator              # KW: nbme score calculator (5.5K)
├── /nbme-calculator                    # KW: nbme calculator (3.65K)
├── /nbme-score-conversion              # KW: nbme score conversion (5.08K)
│   ├── /step-1                         # 分场景
│   └── /step-2                         # KW: nbme score conversion step 2 (1.83K)
│
# === Predictor 分流页（每个表单一个独立 URL）===
├── /step-1-predictor                   # KW: step 1 score predictor
├── /step-2-predictor                   # KW: step 2 score predictor
├── /step-3-predictor
├── /uwsa-1-to-step-1                   # KW: uwsa 1 to step 1
├── /uwsa-2-to-step-2                   # KW: uwsa 2 to step 2
├── /free-120-predictor                 # KW: free 120 predictor
├── /amboss-converter                   # KW: amboss to step conversion
├── /cms-converter                      # KW: cms form to step
│
# === 长尾 NBME Form 页（每个分数一个页面）===
├── /nbme-30-conversion                 # KW: nbme 30 conversion
├── /nbme-31-conversion
├── /nbme-32-conversion
... (扩展到 27、28、29、33+)
│
# === Compare 对比页 ===
├── /compare/
│   ├── best-usmle-score-predictor      # 综合对比
│   ├── vs-predictmystepscore
│   ├── vs-amboss-predictor
│   └── vs-nbcalc
│
# === Blog ===
├── /blog                               # 列表
├── /blog/[slug]                        # 详情（MDX）
├── /blog/category/[slug]               # 分类页
│   ├── /study-plans
│   ├── /score-conversion
│   ├── /step-1-tips
│   └── /step-2-tips
│
# === API ===
├── /api/predict                        # POST 预测
├── /api/auth/[...]                     # Magic Link 流程
├── /api/checkout                       # Stripe Checkout session
├── /api/webhook/stripe                 # Stripe webhook
├── /api/report/[id]                    # 生成/获取 PDF
├── /api/user/predictions               # GET 用户历史
└── /api/health                         # 健康检查
│
# === 系统文件 ===
├── /sitemap.xml                        # Next.js generateSitemap
├── /robots.txt
├── /manifest.json                      # PWA
└── /opengraph-image.png                # Default OG
```

### 6.2 页面优先级（建设顺序）

| 优先级 | 页面 | 理由 |
|---|---|---|
| **P0** | `/`, `/api/predict`, `/checkout`, `/dashboard`, `/login` | 闭环 MVP |
| **P0** | `/pricing`, `/privacy`, `/terms` | 法律必需 |
| **P1** | `/nbme-score-conversion`, `/nbme-score-calculator`, `/nbme-calculator` | 高 SEO 流量 |
| **P1** | `/step-1-predictor`, `/step-2-predictor`, `/step-3-predictor` | 品牌词 |
| **P2** | `/blog`, `/blog/[slug]` | 长期 SEO |
| **P2** | `/uwsa-*`, `/free-120-predictor`, `/amboss-converter` | 二级 SEO |
| **P2** | `/compare/*` | 拦截竞品搜索 |
| **P3** | `/nbme-30-conversion` 等长尾页 | 程序化生成 |
| **P3** | `/about`, `/press`, `/contact` | 信任建设 |

---

## 7. 功能规格（详细到字段层级）

### 7.1 F-CORE-1: 预测计算器（核心交互）

**位置**: `/`（首页主区域）、所有 SEO 工具页内嵌

**用户故事**: US-1.1, US-1.2, US-1.3, US-1.4

**输入字段**:

| 字段 | 类型 | 必填 | 校验 | 默认 |
|---|---|---|---|---|
| `step` | `"step1" \| "step2" \| "step3"` | ✅ | enum | `"step2"` |
| `exams[]` | `PracticeExam[]` | ✅ | 至少 1 个，最多 10 个 | `[]` |
| `exams[].source` | `ExamSource` | ✅ | enum: NBME / UWSA1 / UWSA2 / FREE120 / AMBOSS / CMS | - |
| `exams[].formNumber` | `number?` | NBME 必填 | 25-35 | - |
| `exams[].score` | `number` | ✅ | 见下方源对应范围 | - |
| `exams[].date` | `ISO date?` | ❌ | 不晚于今天 | 今天 |

**分数范围校验**:

| Source | Range |
|---|---|
| NBME | 200-300 |
| UWSA1 / UWSA2 | 130-300 |
| FREE120 | 0-120（百分比 0-100% 也接受） |
| AMBOSS | 1-10（难度等级）|
| CMS | 0-100（百分比） |

**输出结构**:

```typescript
interface PredictionResult {
  step: "step1" | "step2" | "step3";
  pointEstimate: number;        // 主预测分（取整）
  ciLower: number;              // 95% CI 下界
  ciUpper: number;              // 95% CI 上界
  cohortSize: number;           // 同分段历史样本量
  passProbability: number;      // 0-1 概率
  passThreshold: number;        // Step 1: 196, Step 2: 214, Step 3: 198
  percentileRank: number;       // 0-100 相对所有 nbmecalc 用户的百分位
  readinessLevel: "not-ready" | "borderline" | "ready" | "strong";
  subjectBreakdown: SubjectScore[]; // 仅 Pro/Paid 看完整，Free 看 2 个
  recommendation: string;       // 一句话建议
  predictionId: string;         // UUID，用于保存/分享
}

interface SubjectScore {
  name: string;
  estimate: number;             // 0-100
  weak: boolean;                // estimate < 60
  recommendedHours: number;     // 建议每周学习小时
}
```

**Free vs Paid 输出差异**:

| 字段 | Free | Single Report | Pro |
|---|---|---|---|
| `pointEstimate` + CI | ✅ | ✅ | ✅ |
| `passProbability` | ✅ | ✅ | ✅ |
| `subjectBreakdown` (Top 2 弱项) | ✅ | ✅ | ✅ |
| `subjectBreakdown` (完整 14 个学科) | ❌ 模糊 | ✅ | ✅ |
| 14 天学习计划 | ❌ | ✅ PDF | ✅ Web + PDF |
| 历史保存 | ❌ | 30 天链接 | 无限 |
| 多 Step 时间线 | ❌ | ❌ | ✅ |

**交互行为**:

- 表单立即响应（onChange 触发预览预测，无需提交）
- "Add another exam" 按钮：动态添加行（最多 10 个）
- 删除按钮（每行右侧 × 图标）
- 拖拽排序（按考试日期）
- 实时校验，红字提示
- 提交按钮："Predict My Step 2 Score" → 调用 `/api/predict`
- 成功后滚动到结果区，URL 加 `?prediction=[id]` 便于分享

**移动端**:

- 表单改为单列垂直布局
- "Add exam" 改为粘底按钮
- 结果区独立全屏视图

---

### 7.2 F-CORE-2: 预测结果展示

**位置**: 首页预测器下方、`/report/[id]`、`/dashboard/predictions`

**主要组件**:

1. **大数字卡片**:
   - 点估计分数（48px 大字）
   - CI 范围（"248 — 256"）
   - 通过概率徽章（绿色 "98% likely to pass" 或红色 "borderline"）

2. **分布图**:
   - 钟形曲线，标注用户位置
   - 同分段对照（"You're in the top 25%"）

3. **学科地图**（雷达图 / 柱状图）:
   - 14 个学科（Step 2 CK）：Internal Medicine, Surgery, Pediatrics, OB/GYN, Psychiatry, Family Medicine, Emergency, Neurology, Dermatology, Radiology, Pathology, Biostatistics, Ethics, Public Health
   - Free 用户：只显示 Top 2 弱项 + 模糊其他（"Upgrade to see all"）

4. **行动建议**:
   - "Your weakest subject is OB/GYN. Focus 8 hours/week here."
   - 链接到 Resource Hub 或 Affiliate

5. **CTA 卡片**:
   - "Download full PDF report ($14.99)" — 蓝色按钮
   - "Get Pro for unlimited tracking ($9.99/mo)" — mint 按钮
   - "Email me my prediction" — 灰色次要

6. **分享卡**:
   - 一键生成图片（Vercel OG Image / Cloudflare Image Resizing）
   - "Share to Reddit" / "Share to X" 按钮
   - 含 watermark `nbmecalc.com/p/[id]`

7. **✨ 个性化分析模块**（仅付费报告 `/report/[id]` 展示，不在免费结果区暴露）:

   下列模块全部由 `lib/data.ts` 中的纯函数计算，输入只用用户已提交的 `exams[] + targetScore + selfReportedWeakSubjects`，不涉及任何外部数据。

   - **Score Trajectory**（`buildScoreTrajectory`）: 把 `exams[]` 按 `takenDaysAgo` 排序，按时序绘点 + 拟合 30 天斜率（least-squares），输出 `points[]`、`slopePer30Days`、`trend: improving | stable | declining | insufficient_data` 和一句 `insight`。需要 ≥ 2 个带 `takenDaysAgo` 的考试才会出 slope，否则 `insufficient_data`。`|slope| < 1.5 pts/月` 判 `stable`，避免给随机噪声贴趋势标签。
   - **Source Insight**（`buildSourceInsight`）: 按 source（NBME / UWSA / Free120 / AMBOSS / CMS）分组求转换后均值，输出 `rows[]`（按均值降序）+ `insight`。当 spread < 4 pts 时给出"一致性高"评语；spread ≥ 4 pts 时按已知 source 系统性偏差（AMBOSS / UWSA1 over-predict 等）给出一句对比建议。
   - **Target Gap**（`buildTargetGap`）: 仅在用户填了 `targetScore` 时启用。计算 `gap = current − target`（正 = 已超过目标）、`projectedAtExam`（按当前 slope 投射到考试日）、`daysToTargetAtPace`（按当前斜率到目标所需天数）。
   - **Postpone Recommendation**（`buildPostponeRecommendation`）: 输出 `show`（仅 `passProbability < 0.7` 时为 true）+ `onSchedule / postponed14d / postponed28d` 三个 scenario，每个 scenario 含 `daysAdded / projectedScore / projectedPassProbability`。projection 用实测 slope，未实测时回退到 +6 pts/month 经验值；单窗口最多加 +12 pts 体现 diminishing returns。
   - **Personalized Weak Subjects**（`buildPersonalizedWeakSubjects`）: 仅在用户在计算器里勾选了自报弱项时返回非空对象，输出 `selfReported / cohortWeakest / doublyWeak / insight`，`doublyWeak` 仅保留同时被用户自报且 cohort 均分 ≤ cohort 平均的学科。若用户未勾选，函数返回 `null`，由 `ReportView` 决定是否回退到 cohort 平均最低的 N 个学科作为 14 天学习计划的输入。

   **诚信声明**: cohort subject averages 表头显式标注"reference cohort average — not your subject scores"，避免误导用户以为这是其个人学科分。

---

### 7.3 F-CORE-3: PDF 报告（v1 已实现 ✅）

**触发**: 用户购买 Single Report 后跳转到 `/report/[session_id]`，点击"Download PDF"按钮，触发 `GET /api/report/[session_id]/pdf`。

**PDF 内容**（A4，多页，与 web 视图同源数据；由 `components/report-pdf.tsx` 渲染）:

```
Page 1: Cover + Score Hero
  - Logo + 预测 Step（Step 1 / 2 CK / 3）
  - 大字点估计 + 95% CI + Pass probability
  - 生成日期 + Session ID 后 14 位（防止用户被泄漏 full id）
  - 输入 exam 列表（source, formNumber, score, daysAgo）

Page 2: Personalized Analytics
  - Score Trajectory（含趋势小图 + slope/方向）
  - Source Insight（最强/最弱 source + spread）
  - Target Gap（若填了 target）
  - Postpone Recommendation（take_it / borderline / postpone）
  - Personalized Weak Subjects（用户自报 → 优先；否则 cohort 最低）

Page 3: Cohort Reference Table
  - 14 学科（Step 2 CK）/ 7 学科（Step 1 / 3）cohort average
  - 表头明示 "reference cohort, not your subject score"

Page 4-5: 14-Day Study Plan
  - 每天一格，绑定到 personalized weak subjects
  - 推荐学习时长 + 学科 + 一句话方法

Page 6: Methodology + Disclaimer
  - 算法版本（v1.0）+ 数据来源
  - "Not affiliated with NBME / USMLE"
```

**技术实现**:
- 路由: `app/api/report/[session_id]/pdf/route.ts`（`runtime = "edge"`、`dynamic = "force-dynamic"`）
- 引擎: `@react-pdf/renderer` 的 `pdf(documentElement).toBlob()`；React tree 与 web 同样由 `lib/session-report.ts::loadReportFromSession` 提供，保证两端数据一致
- 鉴权: session_id 本身即 token；用户失去 URL = 失去访问，与 web 报告页一致策略
- 缓存: `Cache-Control: private, max-age=3600` — 私有 1 小时浏览器缓存，避免脏 CDN 副本；服务端按需重渲染（算法升级后下次下载自动反映）
- 文件名: `nbmecalc-<STEP>-<point>.pdf`，方便用户在 Downloads 文件夹查找

**v2 计划（暂未实现）**:
- R2 持久化 + 签名 URL（30 天有效）以便分享
- PDF 中嵌入用户姓名（需要先做 magic link 登录绑定）

---

### 7.4 F-AUTH-1: 认证（Magic Link）

**方式**: 无密码，仅邮箱 Magic Link

**流程**:

```
1. 用户输入邮箱
2. 服务器生成 token（UUID v4 + 1 小时过期），存 DB
3. 发邮件：包含 https://nbmecalc.com/verify?token=xxx
4. 用户点击 → 服务器校验 token → 创建 session（HttpOnly cookie，30 天）
5. 重定向到 /dashboard 或 ?next= 参数指定的页面
```

**Session 管理**:

- Cookie 名: `nb_session`
- 加密: JWT (HS256) with secret in env
- 过期: 30 天滑动续期
- Logout: DELETE cookie + 删除 server-side session

**安全**:

- Token 一次性使用，使用后立即删除
- 1 分钟内同邮箱限发 1 次（防滥用）
- 速率限制：IP 每小时 10 次

---

### 7.5 F-AUTH-2: Dashboard

**入口**: `/dashboard`（登录后才能访问）

**功能模块**:

| 模块 | 路由 | 描述 |
|---|---|---|
| 概览 | `/dashboard` | 最近预测、订阅状态、快捷链接 |
| 历史预测 | `/dashboard/predictions` | 表格列表，支持筛选 step、日期 |
| 时间线 | `/dashboard/timeline` | 图表：所有预测分数随时间变化（Pro only） |
| 设置 | `/dashboard/settings` | 邮箱、姓名、删除账户 |
| 计费 | `/dashboard/billing` | 跳转 Stripe Customer Portal |

**Free 用户访问** `/dashboard`:

- 显示最近 1 条预测
- 提示 "Upgrade to save unlimited predictions"

---

### 7.6 F-PAY-1: Stripe Checkout

**Single Report 流程**:

```
1. 用户点击 "Buy Report" → POST /api/checkout
   { type: "single_report", predictionId: "xxx" }
2. 服务器创建 Stripe Checkout Session
   - mode: "payment"
   - price: $14.99
   - success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}
   - cancel_url: /checkout/cancel
3. 返回 session.url → 客户端 redirect
4. 用户在 Stripe 完成支付
5. Webhook 收到 checkout.session.completed
6. 创建 report 记录，关联 predictionId
7. 生成 PDF，发邮件包含下载链接
8. 用户点 success_url → 显示 "Check your email" + 直接下载按钮
```

**Pro Subscription 流程**:

```
1. 用户点击 "Go Pro Monthly/Annual" → POST /api/checkout
   { type: "pro_monthly" | "pro_annual" }
2. 创建 Stripe Subscription Checkout Session
3. 支付成功 → Webhook customer.subscription.created
4. 更新 user.pro_tier = "monthly" | "annual"
5. user.pro_expires_at = subscription.current_period_end
6. 创建 Pro 账号（如无）+ Magic Link 登录
```

**Webhook 处理（必需事件）**:

| Event | 处理 |
|---|---|
| `checkout.session.completed` | 创建 report 或激活 subscription |
| `customer.subscription.updated` | 更新 expires_at |
| `customer.subscription.deleted` | 设 pro_tier = null |
| `invoice.payment_failed` | 邮件通知 + 给宽限期 3 天 |

**Stripe 产品配置**（手动在 Dashboard 创建）:

| Product | Price ID（env） | 类型 |
|---|---|---|
| Single Report | `STRIPE_PRICE_SINGLE` | one-time $14.99 |
| Pro Monthly | `STRIPE_PRICE_PRO_MONTHLY` | recurring monthly $9.99 |
| Pro Annual | `STRIPE_PRICE_PRO_ANNUAL` | recurring yearly $79 |

---

### 7.7 F-SEO-1: 工具页模板（程序化）

**示例**: `/nbme-30-conversion`

**页面结构**（同模板，参数化）:

```
1. H1: "NBME 30 Score Conversion to USMLE Step 2 CK (2026 Updated)"
2. 简介段（300 词）
3. 内嵌预测器（默认 source=NBME, formNumber=30）
4. 大表格：NBME 30 分数 200-280 对应 Step 2 预测
5. FAQ（10 个常见问题）
6. 相关链接（NBME 31、UWSA、Free 120）
7. CTA：升级到完整报告
```

**程序化生成**: `app/nbme-[number]-conversion/page.tsx` 用 dynamic params + generateStaticParams

**KW 矩阵**:

| Form | 月搜索量 | Page |
|---|---|---|
| NBME 30 | ~800 | `/nbme-30-conversion` |
| NBME 31 | ~700 | `/nbme-31-conversion` |
| NBME 32 | ~600 | `/nbme-32-conversion` |
| NBME 29 | ~400 | `/nbme-29-conversion` |
| NBME 28 | ~300 | `/nbme-28-conversion` |

---

### 7.8 F-SEO-2: Compare 对比页

**模板**: `/compare/vs-[competitor]`

**结构**:

```
1. H1: "nbmecalc vs PredictMyStepScore: Which Is More Accurate?"
2. 摘要表格（功能对比）
3. 详细对比章节（5-7 个维度）：
   - Accuracy
   - Free vs Paid
   - User Experience
   - Multi-source support
   - Confidence intervals
4. 各家用户评价（Reddit quotes）
5. 我们的结论（自然偏向自己但实事求是）
6. CTA：试试 nbmecalc Free
```

**避免风险**: 不能造谣对手，所有声明可验证。

---

### 7.9 F-BLOG: 博客系统

**技术**: MDX + Contentlayer 或 Next.js 内置 MDX

**目录**: `/content/blog/[slug].mdx`

**Front matter 必填字段**:

```yaml
---
title: "How to Read Your NBME Score Report"
slug: "how-to-read-nbme-score"
description: "..."
publishedAt: "2026-05-17"
updatedAt: "2026-05-17"
author: "Sarah K., MS4"
authorAvatar: "/images/authors/sarah.jpg"
coverImage: "/images/blog/nbme-score-report.jpg"
category: "score-conversion"
tags: ["nbme", "step-2", "score-reading"]
readingTime: 8
draft: false
---
```

**功能**:

- 列表页：`/blog`（最新 + 分类筛选）
- 详情页：TOC、阅读时间、相关文章、分享按钮、评论区（Disqus 或自建）
- RSS：`/feed.xml`
- 分类页：`/blog/category/[slug]`

**SEO**:

- 每篇文章自动生成 OG Image
- Schema.org Article 结构化数据
- Sitemap 自动包含

---

### 7.10 F-MISC: 其他功能

| ID | 功能 | 描述 |
|---|---|---|
| F-COOKIE | Cookie 同意横幅 | 首访显示，localStorage 30 天不再弹 |
| F-PWA | PWA 安装 | manifest.json + service worker + 离线缓存 |
| F-SHARE | 社交分享 | OG Image 动态生成（Vercel @vercel/og） |
| F-ANALYTICS | 埋点 | Plausible + 自定义事件 |
| F-FEEDBACK | 反馈表单 | Footer "Report a bug"，发邮件到 hello@nbmecalc.com |
| F-NEWSLETTER | 邮件订阅 | Footer 输入邮箱 → 邮件服务受众列表 |

---

## 8. 数据模型（Database Schema）

**数据库**: Cloudflare D1（SQLite）
**ORM**: Drizzle ORM
**迁移**: drizzle-kit

### 8.1 表结构

```sql
-- =============================================
-- users: 注册用户
-- =============================================
CREATE TABLE users (
  id            TEXT PRIMARY KEY,           -- nanoid(12)
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  
  pro_tier      TEXT,                       -- NULL / "monthly" / "annual"
  pro_started_at  INTEGER,                  -- unix ms
  pro_expires_at  INTEGER,                  -- unix ms
  stripe_customer_id TEXT,
  
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,
  deleted_at    INTEGER,                    -- 软删除
  
  -- 营销字段
  source        TEXT,                       -- 注册来源：reddit, google, twitter, direct
  utm_source    TEXT,
  utm_campaign  TEXT,
  
  -- 设置
  email_marketing_consent INTEGER DEFAULT 0  -- 0 或 1
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_pro_tier ON users(pro_tier);

-- =============================================
-- magic_links: 登录令牌
-- =============================================
CREATE TABLE magic_links (
  token       TEXT PRIMARY KEY,             -- UUID v4
  email       TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,             -- unix ms
  used_at     INTEGER,                      -- 一次性
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_magic_links_email ON magic_links(email);

-- =============================================
-- sessions: 用户会话（也可以纯 JWT 不入库）
-- =============================================
CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  ip          TEXT,
  user_agent  TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- =============================================
-- predictions: 预测记录
-- =============================================
CREATE TABLE predictions (
  id              TEXT PRIMARY KEY,         -- nanoid(12)
  user_id         TEXT,                     -- NULL = 匿名预测
  
  step            TEXT NOT NULL,            -- "step1" / "step2" / "step3"
  
  -- 输入快照（JSON 序列化）
  input_exams     TEXT NOT NULL,            -- JSON: PracticeExam[]
  
  -- 输出快照
  point_estimate  INTEGER NOT NULL,
  ci_lower        INTEGER NOT NULL,
  ci_upper        INTEGER NOT NULL,
  pass_probability REAL NOT NULL,
  cohort_size     INTEGER NOT NULL,
  subject_breakdown TEXT NOT NULL,           -- JSON: SubjectScore[]
  
  algorithm_version TEXT NOT NULL,          -- "v1.0", 便于回溯
  
  -- 元数据
  created_at      INTEGER NOT NULL,
  ip              TEXT,
  user_agent      TEXT,
  referrer        TEXT,
  
  -- 共享
  is_public       INTEGER DEFAULT 0,        -- 1 = 可通过 URL 访问
  share_count     INTEGER DEFAULT 0,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_created ON predictions(created_at DESC);

-- =============================================
-- reports: 已购买的 PDF 报告
-- =============================================
CREATE TABLE reports (
  id              TEXT PRIMARY KEY,         -- nanoid(12)
  user_id         TEXT,
  prediction_id   TEXT NOT NULL,
  
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  amount_paid     INTEGER NOT NULL,         -- cents, e.g. 1499
  currency        TEXT NOT NULL DEFAULT 'usd',
  
  pdf_url         TEXT,                     -- R2 公开 URL 或签名 URL
  pdf_generated_at INTEGER,
  
  email_sent_at   INTEGER,
  download_count  INTEGER DEFAULT 0,
  
  expires_at      INTEGER,                  -- 30 天后 PDF URL 失效
  created_at      INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (prediction_id) REFERENCES predictions(id)
);
CREATE INDEX idx_reports_user ON reports(user_id);

-- =============================================
-- subscriptions: Stripe 订阅同步状态
-- =============================================
CREATE TABLE subscriptions (
  id                    TEXT PRIMARY KEY,    -- Stripe sub id
  user_id               TEXT NOT NULL,
  stripe_customer_id    TEXT NOT NULL,
  
  status                TEXT NOT NULL,       -- active, past_due, canceled
  tier                  TEXT NOT NULL,       -- monthly / annual
  
  current_period_start  INTEGER NOT NULL,
  current_period_end    INTEGER NOT NULL,
  cancel_at_period_end  INTEGER DEFAULT 0,
  canceled_at           INTEGER,
  
  created_at            INTEGER NOT NULL,
  updated_at            INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_subs_user ON subscriptions(user_id);

-- =============================================
-- rate_limits: API 限流
-- =============================================
CREATE TABLE rate_limits (
  key         TEXT PRIMARY KEY,             -- "predict:ip:1.2.3.4" 或 "auth:email:a@b.com"
  count       INTEGER NOT NULL,
  reset_at    INTEGER NOT NULL              -- unix ms
);

-- =============================================
-- newsletter_subscribers: 邮件订阅
-- =============================================
CREATE TABLE newsletter_subscribers (
  email           TEXT PRIMARY KEY,
  source          TEXT,                     -- footer, blog, popup
  status          TEXT NOT NULL,            -- pending, active, unsubscribed
  confirm_token   TEXT,
  confirmed_at    INTEGER,
  unsubscribed_at INTEGER,
  created_at      INTEGER NOT NULL
);

-- =============================================
-- events: 业务事件日志（用于分析）
-- =============================================
CREATE TABLE events (
  id          TEXT PRIMARY KEY,
  user_id     TEXT,
  type        TEXT NOT NULL,                -- predict, upgrade_click, signup, ...
  payload     TEXT,                         -- JSON
  ip          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_created ON events(created_at DESC);
```

### 8.2 关键查询模式

```sql
-- 用户最近 10 条预测
SELECT * FROM predictions
WHERE user_id = ? ORDER BY created_at DESC LIMIT 10;

-- 检查用户是否 Pro
SELECT pro_tier, pro_expires_at FROM users WHERE id = ?;
-- 在应用层判断 pro_expires_at > Date.now()

-- 同分段对照（cohortSize 计算）
SELECT COUNT(*) FROM predictions
WHERE step = ?
  AND point_estimate BETWEEN ? - 5 AND ? + 5;
```

### 8.3 数据保留与 GDPR

- 用户删除账户：标记 `deleted_at`，30 天后硬删除 + 关联 predictions/reports
- 匿名预测：90 天后清理（除非已购买报告）
- 事件日志：保留 180 天

---

## 9. API 设计

**风格**: REST，JSON
**Base URL**: `https://nbmecalc.com/api`
**版本**: 通过 path（`/api/v1/...`，但 MVP 先不加版本号）
**错误格式**:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Score must be between 200-300 for NBME",
    "field": "exams[0].score"
  }
}
```

**通用 HTTP 状态码**:

| Code | 含义 |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | 输入校验失败 |
| 401 | 未登录 |
| 403 | 权限不足（Pro 功能） |
| 404 | 资源不存在 |
| 429 | 限流 |
| 500 | 服务器错误 |

### 9.1 POST `/api/predict` ✅ 已实现

**用途**: 服务端预测 + 漏斗落库 + 限流。客户端 calculator 在用户点 "Predict" 时同步本地计算（即时 UX），并 fire-and-forget POST 到此端点；输入字段与 `predictStepScore()` 形参 1:1 对应。

**Auth**: 当前不要求；Magic Link 落地后会在请求里附 session cookie 把 prediction 关联到用户。

**Request**:

```json
{
  "step": "step2",
  "exams": [
    { "id": "row-1", "source": "NBME", "formNumber": 30, "score": 235, "takenDaysAgo": 30 },
    { "id": "row-2", "source": "UWSA1", "score": 248, "takenDaysAgo": 10 }
  ],
  "daysUntilExam": 14,
  "options": {
    "targetScore": 250,
    "selfReportedWeakSubjects": ["OB/GYN", "Psychiatry"]
  }
}
```

**Response 200**:

```json
{
  "predictionId": "uuid-v4",
  "result": { /* full PredictionResult */ }
}
```

`predictionId` 是 D1 `predictions.id`，客户端可以把它透传给 `/api/checkout`，让 Stripe Checkout Session 的 metadata 关联到精确的预测行（漏斗归因）。

**Response 429**:

```json
{ "error": "Too many requests. Try again later.", "resetAt": 1716080400000 }
```

**Headers (200 + 429 通用)**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`（unix 秒）。

**Rate Limit**: 当前固定 20 次/IP/小时（固定窗口，键含窗口起点；D1 不可达时 fail-open）。后续按用户分层：
- 匿名: 20/h（当前默认）
- Free 用户: 20/h
- Pro: 无限

**落库**: 每次成功请求写 `predictions` + `events(type='predict')` 两行（D1 batch）。算法版本 (`ALGORITHM_VERSION`) 与 IP / UA / referrer 一并落库；Stripe metadata 上限 500 字符所以 prediction 输入快照 *不* 进 Stripe，只进 D1。

### 9.2 POST `/api/auth/login`

**Request**: `{ "email": "user@example.com", "next": "/dashboard" }`

**Response 200**: `{ "sent": true, "message": "Check your email" }`

**Rate Limit**: 同邮箱 1 次/分钟

### 9.3 GET `/api/auth/verify?token=xxx`

**Response**: Redirect 到 `?next` 或 `/dashboard`，set cookie

### 9.4 POST `/api/auth/logout`

**Response 200**: `{ "ok": true }`，删除 cookie

### 9.5 POST `/api/checkout`

**Request**:

```json
{ "type": "single_report" | "pro_monthly" | "pro_annual", "predictionId": "xxx?" }
```

**Response 200**: `{ "url": "https://checkout.stripe.com/..." }`

### 9.6 POST `/api/webhook/stripe`

**Headers**: `Stripe-Signature: ...`

**Body**: Stripe event

**Response**: 200 ack（即使失败也返回 200，避免重试风暴；内部用队列重试）

### 9.7 GET `/api/user/predictions`

**Auth**: 必需

**Query**: `?step=step2&limit=20&offset=0`

**Response 200**: `{ "predictions": [...], "total": 45 }`

### 9.8 GET `/api/report/[id]`

**Auth**: 必需（必须是 report owner）

**Response 200**: `{ "pdfUrl": "https://r2.../report.pdf", "expiresAt": 1234567890 }`

**Response 404**: 不存在或已过期

### 9.9 GET `/api/health`

**Response 200**: `{ "status": "ok", "version": "1.0.0", "uptime": 12345 }`

---

## 10. 算法规格（预测模型）

### 10.1 v1.0（MVP）— 已实现

**核心预测**（`predictStepScore`）: 加权线性插值 + 固定 CI 公式

```
1. 将每个 exam 通过对应 source 的转换表插值得到 Step 估计分
2. 加权平均（最新考试权重最大）：weight_i = 1.15^i
3. CI 宽度 = max(4, 12 - n * 1.5)  // 越多考试越窄
4. Pass probability = 阶梯函数（>thresh+5: 99%, >thresh: 92%, else: 70%）
```

**v1.x 增量（已实现 ✅，纯函数、无数据依赖、随核心预测结果一起返回）**:

| 子算法 | 输入 | 输出关键字段 | 何时启用 |
|---|---|---|---|
| `buildScoreTrajectory` | `exams[]`（含可选 `takenDaysAgo`） | `points[]`, `slopePer30Days`, `trend`, `insight` | 始终调用；< 2 个带日期 exam 时 `trend = insufficient_data` |
| `buildSourceInsight` | `exams[]` 按 source 分组求转换后均值 | `rows[]`, `insight` | 始终调用；< 2 source 时 `insight = null` |
| `buildTargetGap` | `targetScore`, `point`, `slopePer30Days`, `daysUntilExam` | `gap`, `projectedAtExam`, `daysToTargetAtPace`, `insight` | 仅当用户填了 `targetScore` |
| `buildPostponeRecommendation` | `point`, `passProbability`, `slopePer30Days`, `step`, `ciHalfWidth` | `show`, `onSchedule / postponed14d / postponed28d`, `insight` | 始终调用；`show` 仅 `passProbability < 0.7` 时为 true |
| `buildPersonalizedWeakSubjects` | `selfReportedWeakSubjects[]?`, `cohortSubjectAverages[]` | `selfReported`, `cohortWeakest`, `doublyWeak`, `insight` 或 `null` | 仅当用户自报弱项非空 |

**问题（待 v2 修）**:

- 转换表硬编码，仅 5-10 个数据点
- CI 没有统计学依据
- cohort 学科平均仍是参考值（不是用户个人学科分），表头已明示

### 10.2 v2.0（目标）— 真实数据驱动

**数据集**:

- 1,200+ 真实样本（reviewers 提供 + Reddit 公开数据 + 用户自愿提交）
- 每条记录：(source, formNumber, score, actualStepScore, daysToExam)

**模型**:

```python
# Pseudocode
features = [
  practice_score,         # 主要特征
  source_one_hot,         # NBME/UWSA/Free120/AMBOSS/CMS
  form_number,            # NBME 27-35
  days_to_exam,           # 距离真实考试天数
  num_practice_exams,     # 已做过多少次练习
  trajectory_slope        # 进步斜率
]

model = GradientBoostingRegressor / Ridge / LinearRegression
```

**部署**:

- 模型在本地训练，导出 ONNX 或 JSON 权重
- Cloudflare Worker 加载 + 推理（< 1ms）

**CI 计算**:

- Conformal Prediction：用 holdout set 校准残差
- 95% CI = prediction ± quantile(|residuals|, 0.95)

**学科分布**:

- 用 NBME 公开的 content category breakdown
- 用户分数 → 推断各学科 estimate
- 公式：`subject_estimate = base + (overall_score - mean) * subject_correlation`

### 10.3 算法版本管理

- 每次算法变更：bump `algorithm_version`（如 v1.0 → v1.1）
- 数据库 predictions 表记录用的哪个版本
- 不回填旧记录（保留历史快照）

### 10.4 准确度评估

**指标**:

| 指标 | 目标 |
|---|---|
| MAE (Mean Absolute Error) | < 5 分 |
| RMSE | < 7 分 |
| 95% CI Coverage | 92-98% |
| Pass prediction accuracy | > 95% |

**评估方式**: Holdout 20% 数据 / K-fold

---

## 11. UI/UX 规范

### 11.1 设计系统 Tokens

**颜色**:

| Token | 值 | 用途 |
|---|---|---|
| `mint-50` | `#ECFDF5` | 卡片背景、淡色徽章 |
| `mint-100` | `#D1FAE5` | 高亮背景 |
| `mint-500` | `#34D399` | **品牌主色**、CTA、导航栏 |
| `mint-600` | `#10B981` | hover 状态 |
| `mint-700` | `#047857` | 文字强调 |
| `gray-50` | `#F9FAFB` | 页面 section 背景 |
| `gray-100` | `#F3F4F6` | 卡片边框 |
| `gray-200` | `#E5E7EB` | 分隔线 |
| `gray-400` | `#9CA3AF` | 次要文字 |
| `gray-700` | `#374151` | 正文 |
| `gray-900` | `#111827` | 标题 |
| `gray-950` | `#030712` | 强调文字 |
| `red-500` | `#EF4444` | 错误、警告 |
| `amber-500` | `#F59E0B` | 注意、borderline |

**字体**:

- **Display + Body**: Plus Jakarta Sans（加载自 Google Fonts，display: swap）
- **Mono / 数字**: JetBrains Mono（分数显示用）
- **Weight**: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

**尺寸（Type Scale）**:

| Class | px | 用途 |
|---|---|---|
| `text-xs` | 12 | 标签、Caption |
| `text-sm` | 14 | 次要文字 |
| `text-base` | 16 | 正文 |
| `text-lg` | 18 | 副标题 |
| `text-xl` | 20 | 卡片标题 |
| `text-2xl` | 24 | H3 |
| `text-3xl` | 30 | H2 mobile |
| `text-4xl` | 36 | H2 |
| `text-5xl` | 48 | H1 |
| `text-6xl` | 60 | Hero |
| `text-7xl` | 72 | 分数大字 |

**圆角**:

- Buttons: `rounded-full`
- Cards: `rounded-3xl` (24px)
- Inputs: `rounded-2xl` (16px)
- Badges: `rounded-full`
- Modals: `rounded-3xl`

**间距网格**:

- 基准: 4px
- Section 上下间距: `py-20 lg:py-28`（80px / 112px）
- 卡片 padding: `p-6` 或 `p-8`
- Container max-width: `max-w-7xl` + `mx-auto px-4 sm:px-6 lg:px-8`

**阴影**:

- `shadow-sm` — 卡片默认
- `shadow-lg` — hover / 强调
- `shadow-xl shadow-mint-500/10` — 主推方案

**动画**:

- 标准 transition: `transition duration-200 ease-out`
- hover 抬升: `hover:-translate-y-0.5 hover:shadow-lg`
- 滚动出现: Framer Motion `whileInView`（避免过度使用）

### 11.2 组件库（已实现 + 待补）

**已有**（`components/ui/`）:

- `Button`（6 variants × 5 sizes）
- `Input`
- `Accordion`（FAQ 用）
- `Badge`
- `Logo` + `LogoMark`
- `IPhoneMockup`

**需新增**:

| 组件 | 用途 |
|---|---|
| `Select` | 表单下拉（Step 选择、Source 选择） |
| `DatePicker` | 考试日期 |
| `Slider` | 分数滑块（移动端友好） |
| `Toast` | 操作反馈 |
| `Dialog / Modal` | 升级 paywall、登录 |
| `Tabs` | Dashboard 切换 |
| `Tooltip` | 表单 hint |
| `Skeleton` | 加载占位 |
| `Chart` | 钟形曲线（recharts 或 d3） |
| `RadarChart` | 学科雷达 |
| `Table` | Dashboard 列表 |
| `Avatar` | 用户头像 |
| `EmptyState` | 无数据展示 |
| `PaywallCard` | 升级提示卡（统一样式） |

### 11.3 响应式断点

| 断点 | min-width | 含义 |
|---|---|---|
| `sm` | 640px | 大手机横屏 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 笔记本 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大屏 |

**关键响应式行为**:

- 导航: `< lg` 改为汉堡菜单
- Hero: `< md` iPhone mockup 改为顶部、文案在下
- Calculator: `< md` 单列
- Pricing 卡: `< md` 单列堆叠
- Footer: `< md` 4 列变 2 列

### 11.4 无障碍（A11y）

- 所有交互元素 keyboard accessible
- ARIA 标签（`aria-label`, `aria-labelledby`, `role`）
- 颜色对比度 ≥ AA（mint-500 + 黑字 = 4.6:1 ✓）
- 表单错误用文字 + 颜色双重提示
- Skip-to-content 链接
- Focus 可见（`focus-visible:ring-2 focus-visible:ring-mint-500`）

### 11.5 国际化（i18n）

**v1.0**: 英文 only

**v2.0**（可选）: 支持中文（针对中国海外医学生）、西班牙语（针对拉美 IMG）

- 用 `next-intl`
- 默认 `en-US`
- URL 结构: `/zh/`, `/es/`（不影响英文 SEO）

---

## 12. SEO 策略

### 12.1 关键词矩阵

**Tier 1（高量低难度，必拿）**:

| Keyword | 月搜索 | 目标排名 | 落地页 |
|---|---|---|---|
| nbme score calculator | 5.51K | Top 3 | `/nbme-score-calculator` |
| nbme score conversion | 5.08K | Top 3 | `/nbme-score-conversion` |
| nbme calculator | 3.65K | Top 5 | `/nbme-calculator` |
| nbme score conversion step 2 | 1.83K | Top 3 | `/nbme-score-conversion/step-2` |
| step 2 score converter | 1.06K | Top 5 | `/step-2-predictor` |

**Tier 2（品牌 / 长尾）**:

- usmle step score predictor、step 1 predictor、step 2 predictor
- nbme 30/31/32 conversion、free 120 to step 2
- uwsa 1 to step 1、uwsa 2 to step 2、amboss to step

**Tier 3（信息查询）**:

- how to read nbme score
- how accurate is nbme score
- when to take step 2
- step 2 vs step 1 difficulty

### 12.2 On-page SEO 规范

每个页面必须有：

| 元素 | 规则 |
|---|---|
| `<title>` | 50-60 字符，含主关键词 + 品牌 |
| `<meta description>` | 150-160 字符，CTA 句 |
| `<h1>` | 唯一，含主关键词 |
| `<h2>-<h6>` | 层级清晰，含 LSI 关键词 |
| Internal links | 每页至少 3 个站内链 |
| Image `alt` | 描述性，必要时含关键词 |
| URL slug | 短、含连字符、含关键词 |
| Schema.org | JSON-LD 嵌入 |
| OG / Twitter cards | 每页定制 |
| Canonical | 自指（避免重复内容） |

**Schema.org 类型**:

| 页面 | Schema |
|---|---|
| 首页 | `WebSite` + `SoftwareApplication` |
| Predictor 页 | `SoftwareApplication` |
| Blog | `Article` + `BreadcrumbList` |
| FAQ | `FAQPage` |
| Compare 页 | `Article` |
| 关于 | `Organization` |

### 12.3 技术 SEO

- **Sitemap**: `app/sitemap.ts` 动态生成（含所有静态页 + 博客）
- **Robots**: `app/robots.ts` 允许全部，禁 `/api/`、`/dashboard/`
- **Core Web Vitals 目标**:
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1
- **图片**: `next/image` + WebP/AVIF 自动转换
- **字体**: `next/font/google` 自托管
- **JS bundle**: 首屏 < 100KB gzipped
- **HTTPS / HSTS**: Cloudflare 自动
- **301 重定向**: trailing slash 统一

### 12.4 链接建设

| 策略 | 行动 |
|---|---|
| Reddit 内容营销 | 每周在 r/Step1、r/Step2 分享有价值帖（不直发链接） |
| 客座博客 | Student Doctor Network、Kaplan Blog 投稿 |
| HARO | 回复 USMLE 相关记者询问 |
| 工具目录 | 提交 Product Hunt、Slant、AlternativeTo |
| 数据研究 | 发布 "USMLE Score Trends 2026" 报告（PDF） |
| Reddit AMA | 邀请 Reviewers 做 AMA |

---

## 13. 内容策略

### 13.1 Blog 内容日历（前 3 个月，15 篇）

| Week | Title (草拟) | KW 目标 |
|---|---|---|
| 1 | How to Read Your NBME Score Report | nbme score report |
| 1 | NBME 30 vs 31 vs 32: Which Is Hardest? | nbme form comparison |
| 2 | Free 120 to Step 2 Conversion: 2026 Guide | free 120 conversion |
| 2 | Why Your UWSA Score Is Misleading | uwsa accuracy |
| 3 | The Truth About Confidence Intervals in Score Predictors | score prediction accuracy |
| 3 | Cramming for Step 2: Day-by-Day Plan | step 2 cram plan |
| 4 | How Accurate Are NBME Score Predictions? | nbme prediction accuracy |
| 4 | Step 2 CK Subject Weighting Explained | step 2 subjects |
| 5 | What to Do the Night Before Your Step Exam | night before step exam |
| 6 | AMBOSS vs UWorld: Which Q-bank Wins? | amboss vs uworld |
| 7 | Average Step 2 Score: What's "Good"? | average step 2 score |
| 8 | NBME 31 Curve: Easier or Harder? | nbme 31 curve |
| 9 | IMG Step 2 Strategy: From 220 to 250 | img step 2 strategy |
| 10 | Most Tested Topics on Step 2 CK | most tested step 2 |
| 12 | Step 3 CCS Cases: Complete Walkthrough | step 3 ccs |

### 13.2 内容质量标准

- 每篇 1500-2500 词
- 至少 1 张原创信息图
- 引用 3+ 个权威来源（NBME、PubMed、官方文档）
- 含目录（TOC）
- 结尾 CTA 引导使用预测器
- 由真实医师 reviewer 校验事实

### 13.3 现有审稿团队

| Name | Role | 校验内容 |
|---|---|---|
| Dr. M. Chen, MD (Internal Medicine, PGY-2) | Score conversion & algorithm | 算法、IM 学科 |
| Dr. A. Patel, MD (Pediatrics Resident) | Pediatrics subject mapping | Peds 学科 |
| Dr. S. Garcia, MD (US MD candidate) | Dataset & methodology | 数据集 |

**注意**: 项目记忆里写了用 placeholder name，未来真实 reviewer 签合作协议后再公开真名。

---

## 14. 法律 / 合规 / 隐私

### 14.1 必须页面

| 页面 | 内容要点 | 模板 |
|---|---|---|
| `/privacy` | GDPR/CCPA 合规、Cookie 用途、数据保留 | Termly / 自写 |
| `/terms` | 使用条款、订阅条款、不退款政策、IP 归属 | Termly / 自写 |
| `/affiliate-disclosure` | FTC 要求的联盟披露 | 自写 |
| `/dmca` | DMCA 通知与反通知流程 | 模板 |

### 14.2 关键免责声明（每页 Footer）

> **Disclaimer**: nbmecalc is not affiliated with, endorsed by, or in any way connected to the National Board of Medical Examiners (NBME), Federation of State Medical Boards (FSMB), United States Medical Licensing Examination (USMLE), USMLE-Rx, AMBOSS, UWorld, or Kaplan. All trademarks belong to their respective owners. Predictions are statistical estimates for educational purposes only and do not guarantee actual exam results.

### 14.3 Cookie / 隐私横幅

- 首访显示
- 接受 / 拒绝两个按钮
- localStorage 存储 30 天不再弹
- 拒绝 → 只用必要 cookie（session），不用 analytics

### 14.4 数据处理

- **个人数据收集**: 仅 email + 预测输入
- **存储位置**: Cloudflare D1（全球边缘，欧盟数据存欧盟节点）
- **第三方处理**:
  - Stripe（支付，必要）
  - Postal SMTP（邮件，必要）
  - Plausible（分析，cookieless）
- **数据导出**: 用户可在 Settings 导出全部数据 (JSON)
- **删除请求**: 用户可一键删除账户，30 天硬删除

### 14.5 商标 / 版权

- 不使用 NBME、USMLE 等商标 logo
- 标题中可用商标作为引用关键词（合理使用）
- 所有原创图表、文字归 nbmecalc 所有
- 用户提交的数据归用户所有，授权我们用于改善算法

---

## 15. 性能 / 安全

### 15.1 性能预算

| 指标 | 目标 | 工具 |
|---|---|---|
| First Contentful Paint | < 1.0s | Lighthouse |
| Largest Contentful Paint | < 2.5s | CrUX |
| Total Blocking Time | < 200ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | CrUX |
| Speed Index | < 2.0s | Lighthouse |
| Initial JS bundle | < 100KB gzipped | next-bundle-analyzer |
| Initial CSS | < 30KB | - |
| Time to Interactive | < 3.5s | Lighthouse |

### 15.2 缓存策略

| 资源 | TTL | 备注 |
|---|---|---|
| 静态资源 (`/_next/static/*`) | 1 year, immutable | hash 文件名 |
| 预渲染 HTML 页面 | 1 year, immutable | **全部 SSG，构建时生成** |
| ISR 页面（博客/Compare） | 1d edge cache + revalidate | on-demand 重建 |
| API `/api/*` | 不缓存 | Cloudflare Functions |
| 图片 | 1 year | next/image + R2 |
| Sitemap | 1 hour | 动态生成 |

### 15.3 安全清单

- ✅ HTTPS only（Cloudflare 自动）
- ✅ HSTS 头
- ✅ CSP（Content-Security-Policy）严格策略
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Rate limiting（D1 表）
- ✅ Input validation（Zod schema）
- ✅ SQL Injection 防护（Drizzle parameterized queries）
- ✅ XSS 防护（React auto-escape）
- ✅ CSRF（同源 + SameSite cookies）
- ✅ Stripe Webhook 签名校验
- ✅ Magic Link token 单次使用 + 1h 过期
- ✅ Secrets 走 env，不入仓
- ✅ Dependabot / Renovate 自动升级
- ✅ 不存信用卡（Stripe Hosted）

### 15.4 监控 / 告警

- **错误**: Sentry（前端 + Worker）
- **日志**: Axiom 或 Cloudflare Logs
- **Uptime**: BetterUptime（5min interval）
- **业务**: 自建 events 表 + Metabase / Looker Studio

**告警阈值**:

- 5xx 错误率 > 1% / 5min → Slack
- /api/predict P95 latency > 1s → 邮件
- Stripe webhook 失败 → 即时
- DB 连接失败 → 即时

---

## 16. 技术栈与基础设施

### 16.1 完整技术栈

| 层 | 技术 | 版本 | 备注 |
|---|---|---|---|
| **框架** | Next.js | 15.x (App Router) | **SSG-first**, 静态导出兼容；交互全 client component；Server Actions 禁用 |
| **语言** | TypeScript | 5.x | strict mode |
| **样式** | Tailwind CSS | 3.x | + custom tokens |
| **组件** | shadcn/ui-style + Radix UI | latest | |
| **图标** | lucide-react | latest | |
| **图表** | recharts | 2.x | 钟形曲线、雷达图 |
| **PDF** | @react-pdf/renderer | 3.x | |
| **OG 图** | @vercel/og | latest | |
| **MDX** | next-mdx-remote + remark plugins | latest | 博客 |
| **数据库** | Cloudflare D1 (SQLite) | - | |
| **ORM** | Drizzle ORM | latest | |
| **认证** | 自建 Magic Link | - | 简单，免 Auth0 费用 |
| **支付** | Stripe | 2024-* API | |
| **邮件** | Postal SMTP | - | SMTP credentials in env |
| **文件存储** | Cloudflare R2 | - | PDF 存储 |
| **分析** | Plausible (self-host?) | - | 或 CF Web Analytics（免费） |
| **错误** | Sentry | - | |
| **部署** | Cloudflare Pages | - | 自动 from Git |
| **CI/CD** | GitHub Actions | - | lint + test + deploy preview |
| **域名** | Cloudflare DNS | - | 已购 nbmecalc.com |
| **CDN** | Cloudflare（自带） | - | |
| **图像生成** | Evolink.ai (Z Image Turbo) | - | AI 真人图 |

### 16.2 环境变量

```bash
# .env.local（开发） / Cloudflare Pages 设置（生产）

# Database
DATABASE_URL="..."                # Cloudflare D1 binding

# Auth
JWT_SECRET="..."                  # 64-char random
SESSION_COOKIE_NAME="nb_session"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_SINGLE="price_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_ANNUAL="price_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Email
SMTP_HOST="mail.removexif.com"
SMTP_PORT="25"
SMTP_USER="removexif/jkn-mail-server"
SMTP_PASSWORD="..."
SMTP_FROM="noreply@nbmecalc.com"

# Storage
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET="nbmecalc-reports"

# Analytics
PLAUSIBLE_DOMAIN="nbmecalc.com"
SENTRY_DSN="..."

# Site
NEXT_PUBLIC_SITE_URL="https://nbmecalc.com"

# AI Image Gen (开发用)
EVOLINK_API_KEY="sk-..."
```

### 16.3 项目结构（目标）

```
nbmecalc/
├── app/
│   ├── (marketing)/                # 营销页 layout
│   │   ├── page.tsx                # 首页
│   │   ├── pricing/page.tsx
│   │   ├── nbme-score-conversion/page.tsx
│   │   ├── nbme-[number]-conversion/page.tsx  # 程序化
│   │   ├── step-[number]-predictor/page.tsx
│   │   ├── compare/[slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── ...
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── verify/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # 登录检查
│   │   ├── dashboard/page.tsx
│   │   ├── predictions/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── settings/page.tsx
│   │   └── billing/page.tsx
│   ├── api/
│   │   ├── predict/route.ts
│   │   ├── auth/
│   │   ├── checkout/route.ts
│   │   ├── webhook/stripe/route.ts
│   │   ├── report/[id]/route.ts
│   │   └── user/predictions/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── manifest.ts
│   ├── icon.svg / apple-icon.svg
│   ├── opengraph-image.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # Primitives
│   ├── sections/                   # 首页 sections
│   ├── calculator/                 # 预测器组件
│   ├── dashboard/
│   ├── pdf/                        # PDF 模板
│   └── shared/
├── lib/
│   ├── db/                         # Drizzle schema + queries
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── queries/
│   ├── algorithms/                 # 预测算法
│   │   ├── v1.ts (current)
│   │   └── v2.ts (ML)
│   ├── auth/                       # Magic Link
│   ├── stripe/                     # Stripe client
│   ├── email/                      # SMTP templates
│   ├── rate-limit.ts
│   ├── events.ts                   # 埋点
│   ├── seo.ts                      # 通用 metadata
│   └── utils.ts
├── content/
│   └── blog/                       # MDX 文章
├── public/
│   ├── images/
│   ├── placeholders/               # AI prompts
│   └── ...
├── scripts/
│   ├── gen-images.mjs              # AI 图片生成
│   ├── seed-db.ts                  # 测试数据
│   └── train-model.py              # ML 训练（独立）
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                        # Playwright
├── docs/
│   ├── PRD.md                      # 本文档
│   ├── ALGORITHM.md                # 算法详解
│   ├── DESIGN-SYSTEM.md
│   └── DEPLOYMENT.md
├── drizzle/                        # 迁移文件
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 16.4 渲染与部署策略（核心架构原则）

> **🔒 强制原则**: 所有面向公众的页面 **100% 预渲染（SSG）**，部署到 Cloudflare Pages 静态托管。任何 SSR / dynamic rendering 必须在 PR 里专门论证。

**为什么**:

1. **SEO 极致**: 静态 HTML = 最快 LCP、最佳爬虫友好度、零 cold start
2. **成本为零**: Cloudflare Pages 静态部分免费无限流量
3. **稳定性**: 没有 server runtime 错误，DB 挂了营销页仍可访问
4. **抗 DDoS**: CDN 边缘缓存天然防护

#### 16.4.1 每类页面的渲染方式

| 路径 | 渲染 | Next.js 配置 | 说明 |
|---|---|---|---|
| `/`, `/pricing`, `/about`, `/contact`, `/press`, `/privacy`, `/terms`, `/affiliate-disclosure`, `/dmca` | **SSG** | `export const dynamic = "force-static"` | 营销/法律页 |
| `/nbme-score-conversion`, `/nbme-score-calculator`, `/nbme-calculator` | **SSG** | 同上 | SEO 主入口 |
| `/step-1-predictor`, `/step-2-predictor`, `/step-3-predictor` | **SSG** | 同上 | |
| `/uwsa-1-to-step-1`, `/uwsa-2-to-step-2`, `/free-120-predictor`, `/amboss-converter`, `/cms-converter` | **SSG** | 同上 | |
| `/nbme-[N]-conversion` (27-35) | **SSG** | `generateStaticParams` 全部预生成 | 9 个静态页 |
| `/compare/[slug]` | **SSG (ISR 1d)** | `generateStaticParams` + `revalidate: 86400` | 偶尔更新数据 |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | **SSG (ISR 1d)** | 同上 | 新文章 on-demand 触发 |
| `/login`, `/verify`, `/checkout/success`, `/checkout/cancel` | **SSG 静态壳 + Client** | `"use client"` 内部组件 | 表单/逻辑全 client |
| `/dashboard/*` | **SSG 静态壳 + Client (CSR)** | layout 静态、数据 fetch 客户端 | 不需要 SEO |
| `/report/[id]` | **CSR** | 客户端 fetch `/api/report/[id]` | 需要鉴权，不预渲染 |
| `/p/[id]` 分享页 | **ISR (5min)** | 公开预测分享，需要 OG 抓取 | 实时性弱 |
| `/api/*` | **Edge Function** | Cloudflare Pages Functions | runtime: "edge" |
| `/sitemap.xml`, `/robots.txt`, `/manifest.json` | **SSG** | Next.js 内置约定 | |
| `/opengraph-image.tsx` | **Edge** | `@vercel/og` 动态生成 | 边缘函数 |

#### 16.4.2 关键约束（编码必读）

**禁止使用**（会触发 dynamic rendering）:

- ❌ `cookies()`, `headers()` 在 Server Component（除非已经在 client component）
- ❌ `searchParams` 直接读（改用 client component 读 `useSearchParams`）
- ❌ `fetch` 不带 `cache` 选项（默认 no-store 会动态化）
- ❌ Server Actions（用 `/api/*` Edge Functions 替代）
- ❌ 任何路由 `export const dynamic = "force-dynamic"`

**允许且推荐**:

- ✅ `"use client"` 客户端组件做交互（Calculator、Dashboard、表单）
- ✅ `generateStaticParams` 预生成动态路由
- ✅ `generateMetadata` 静态生成 SEO meta
- ✅ `revalidate` ISR
- ✅ Client-side `fetch('/api/*')` 调动态数据

#### 16.4.3 受影响功能的实现方式

| 功能 | 实现 |
|---|---|
| 预测计算（Calculator） | Client component → fetch `/api/predict` |
| Magic Link 登录 | `/login` 静态页 → client 提交到 `/api/auth/login` → cookie 由 API 设置 |
| Verify 回调 | `/verify` 静态页 → client 读 `?token=` → fetch `/api/auth/verify` → set cookie + redirect |
| Dashboard 数据 | layout 静态 + `useEffect` fetch `/api/user/predictions` |
| Stripe Checkout | client click → fetch `/api/checkout` → window.location = url |
| PDF 下载 | client fetch `/api/report/[id]` → 拿 R2 签名 URL → 直接下载 |
| 受保护路由 | client-side `useAuth()` 检查，未登录 redirect /login |

#### 16.4.4 Cloudflare Pages 部署配置

**适配器**: `@cloudflare/next-on-pages`（推荐）或 `output: "export"` 纯静态

```json
// package.json scripts
{
  "build": "next build",
  "pages:build": "npx @cloudflare/next-on-pages",
  "deploy": "wrangler pages deploy .vercel/output/static"
}
```

**`next.config.ts`**:

```ts
const nextConfig = {
  images: { unoptimized: false }, // 用 next/image, CF 会处理
  experimental: { serverComponentsHmrCache: false }
};
```

**Cloudflare 资源绑定** (`wrangler.toml`):

```toml
[[d1_databases]]
binding = "DB"
database_name = "nbmecalc-prod"
database_id = "..."

[[r2_buckets]]
binding = "REPORTS"
bucket_name = "nbmecalc-reports"

[vars]
SMTP_HOST = "mail.removexif.com"
SMTP_PORT = "25"
SMTP_FROM = "noreply@nbmecalc.com"
# secrets 用 wrangler secret put
```

**API Routes 必须**:

```ts
export const runtime = "edge"; // 每个 /api/*/route.ts
```

#### 16.4.5 构建产物校验清单

构建后 `npm run build` 输出必须满足：

- [ ] 所有营销/SEO 页标记为 `○ (Static)` 或 `● (SSG)`
- [ ] 没有 `λ (Dynamic)` 标记的公开页面
- [ ] `/api/*` 标记为 `ƒ (Edge)`
- [ ] First Load JS < 100KB（关键页 < 80KB）
- [ ] 任何意外的 dynamic 必须在 PR 中说明

---

### 16.5 测试策略

| 类型 | 工具 | 覆盖率目标 |
|---|---|---|
| 单元测试 | Vitest | 80% (lib/) |
| 组件测试 | React Testing Library | 关键组件 100% |
| 集成测试 | Vitest + Mock D1 | API routes 90% |
| E2E | Playwright | 关键用户路径（预测 → 付费） |
| 视觉回归 | Playwright snapshots | 主要页面 |
| 性能 | Lighthouse CI | 每次部署 |

---

## 17. 度量指标（KPI）

### 17.1 北极星指标

> **Paid Conversions Per Month**（月付费用户数）

### 17.2 指标分层

**Acquisition（获客）**:

| 指标 | 目标（M3） | 目标（M12） |
|---|---|---|
| 月独立访客 (UV) | 10K | 100K |
| Organic Traffic % | 60% | 80% |
| Bounce Rate | < 60% | < 50% |
| Avg Session Duration | > 2min | > 3min |

**Activation（激活）**:

| 指标 | 目标 |
|---|---|
| Predict Started Rate | > 40% of UV |
| Predict Completed Rate | > 30% of UV |
| Email Capture Rate | > 5% of completed |

**Revenue（变现）**:

| 指标 | 目标 (M3) | 目标 (M12) |
|---|---|---|
| Free → Paid 转化率 | 1% | 3% |
| ARPU | $8 | $15 |
| MRR | $200 | $5,000 |
| Single Report 销量 / 月 | 30 | 500 |
| Pro Subscriptions Active | 10 | 200 |
| Churn (monthly) | < 10% | < 5% |

**Retention（留存）**:

| 指标 | 目标 |
|---|---|
| Pro D7 Retention | > 50% |
| Pro M1 Retention | > 70% |
| Email Open Rate | > 30% |

**Quality（质量）**:

| 指标 | 目标 |
|---|---|
| Prediction Accuracy (MAE) | < 5 分 |
| NPS | > 50 |
| Customer Support Tickets | < 5/week |
| Error Rate (5xx) | < 0.5% |

### 17.3 事件埋点清单

| 事件名 | Payload | 触发时机 |
|---|---|---|
| `page_view` | { path, referrer } | 路由变化 |
| `predict_started` | { step, num_exams } | 用户填第一个分数 |
| `predict_completed` | { predictionId, step, score } | API 200 返回 |
| `paywall_viewed` | { source: "result" \| "blog" } | Paywall 弹出 |
| `upgrade_click` | { plan, source } | 点击 CTA |
| `checkout_started` | { plan, predictionId? } | 进 Stripe |
| `checkout_completed` | { plan, amount } | Webhook |
| `signup_completed` | { source } | 首次 verify |
| `download_pdf` | { reportId } | 下载报告 |
| `share_click` | { platform, predictionId } | 分享按钮 |
| `cancel_subscription` | { plan, reason? } | 取消订阅 |

---

## 18. 里程碑（Sprint 计划）

### Sprint 0（已完成 ✅）

- [x] 项目脚手架（Next.js + Tailwind + shadcn/ui）
- [x] 设计系统（mint 品牌色 + Plus Jakarta Sans）
- [x] Logo + Favicon
- [x] 首页 16 个 sections
- [x] 简易预测算法 v1.0（`lib/data.ts`）
- [x] AI 图片生成脚本
- [x] Cookie 横幅

### Sprint 1（变现 MVP，2 周）— P0

**目标**: 能完整跑通"匿名预测 → 付费 → 获得 PDF"流程

| 任务 | 工时 | 状态 |
|---|---|---|
| Cloudflare D1 + Drizzle schema 初始化（predictions / reports / rate_limits / events） | 0.5d | ✅ |
| API `/api/predict` + 限流（20/h IP，fail-open） | 1d | ✅ |
| 独立 `/pricing` 页 | 0.5d | ✅ |
| Stripe 集成（Checkout + Webhook） | 2d | ✅ Checkout（含 predictionId 关联）/ ⏳ Webhook entitlement handler |
| Magic Link 认证 | 1.5d | ⏳ |
| `/dashboard` 基础（最近预测） | 1d | ⏳（依赖 Magic Link） |
| PDF 模板 + 生成（@react-pdf/renderer on edge） | 2d | ✅ |
| 个性化分析（trajectory / source / target gap / postpone / weak） | — | ✅ |
| 邮件发送（Postal SMTP）+ 模板 | 1d | ✅ |
| `/privacy`, `/terms`, `/affiliate-disclosure` | 0.5d | ✅ |
| 测试 + 修 bug（vitest 36 用例：data 27 / rate-limit 9） | 2d | 🔄 持续 |

**交付**: 用户能花 $14.99 买 PDF，能买 Pro

### Sprint 2（核心 SEO 流量，2 周）— P1

| 任务 | 工时 |
|---|---|
| `/nbme-score-conversion` 主页 | 1d |
| `/nbme-score-calculator` + `/nbme-calculator` | 1d |
| `/step-1-predictor`, `/step-2-predictor`, `/step-3-predictor` | 1.5d |
| Sitemap + robots + Schema.org | 1d |
| OG Image 动态生成 | 1d |
| 6 篇启动博客 | 5d |
| 性能优化（Lighthouse > 95） | 1.5d |

**交付**: 主要 SEO 页上线，Google 提交

### Sprint 3（深度 SEO + 内容，2 周）— P2

| 任务 | 工时 |
|---|---|
| `/uwsa-*-to-step-*` (4 页) | 1.5d |
| `/free-120-predictor`, `/amboss-converter`, `/cms-converter` | 1.5d |
| 程序化 `/nbme-[N]-conversion` (5 页) | 1d |
| `/compare/*` (4 篇) | 3d |
| 4 篇博客 | 3d |
| Newsletter 订阅功能 | 1d |
| Reddit / Twitter / Discord 冷启动 | 持续 |

**交付**: 二级 SEO 矩阵完成

### Sprint 4（产品深度，2 周）— P2

| 任务 | 工时 |
|---|---|
| Dashboard 时间线视图（多 Step 追踪） | 2d |
| 真实数据集收集 + ML 模型 v2 | 4d |
| 学科细分 + 14 天学习计划生成 | 2d |
| 分享卡 + 社交分享 | 1d |
| PWA manifest + service worker | 1d |

**交付**: Pro 价值兑现，付费转化提升

### Sprint 5（增长 + 优化，持续）— P3

- A/B 测试（定价、文案、CTA）
- Affiliate 系统
- Reddit / Discord KOL 合作
- Press Kit + 媒体 outreach
- 客服流程优化
- 国际化（中文 / 西班牙语）

### 18.1 关键决策时间点

| 决策 | 时机 | 依据 |
|---|---|---|
| 是否上 ML 模型 | Sprint 4 | 数据集 ≥ 1000 条 |
| 是否做评论区 | Sprint 5 | Blog 月 UV > 5000 |
| 是否做移动 App | M6+ | Web PWA 使用率 < 20% |
| 是否融资 | M9+ | MRR > $3000 + 增长 > 20%/月 |

---

## 19. 风险与缓解

### 19.1 商业风险

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| **NBME 法律警告（商标 / 数据）** | 中 | 高 | 严格免责 + 不抓取版权数据 + 律师审核 |
| **Google 算法更新打压** | 中 | 高 | 多元化流量（Reddit、Twitter、直接） |
| **竞品降价 / 推免费** | 中 | 中 | 深度功能差异化 |
| **付费转化率低于预期** | 高 | 高 | A/B 测试、改进 paywall、优化定价 |
| **预测准确度被质疑** | 中 | 高 | 透明算法说明 + 真实医师背书 |

### 19.2 技术风险

| 风险 | 缓解 |
|---|---|
| Cloudflare D1 限制（10GB） | 监控 + 定期清理 events 表 |
| Stripe webhook 丢失 | 队列重试 + 每日对账脚本 |
| PDF 生成超时（Edge 30s 限制） | 异步队列 + 邮件投递 |
| 关键 secrets 泄露 | secret rotation + .gitignore 严格 |
| AI 图片 API 涨价 / 倒闭 | 本地 SD 备选 |

### 19.3 法律风险

| 风险 | 缓解 |
|---|---|
| GDPR 罚款 | Cookie 同意 + 数据导出/删除 |
| DMCA 投诉（博客图片） | 仅用自有 + Pexels CC0 + AI 生成 |
| 用户提交数据被泄露 | 加密 at rest + 限权 |
| 商标侵权（用了 NBME 名字） | 仅作引用，加 disclaimer |

### 19.4 团队风险（单人开发）

| 风险 | 缓解 |
|---|---|
| Bus factor = 1 | 完善文档（本 PRD）+ 自动化 |
| Burnout | 严格 Sprint 节奏 + 不夜班 |
| Skills gap (ML 模型) | 外包 / 学习 / 简化模型 |

---

## 20. 附录

### 20.1 术语表

| 术语 | 含义 |
|---|---|
| **USMLE** | United States Medical Licensing Examination |
| **NBME** | National Board of Medical Examiners |
| **Step 1** | 美国医师执照第一阶段（基础医学） |
| **Step 2 CK** | Clinical Knowledge（临床知识） |
| **Step 3** | 第三阶段（独立行医资格） |
| **UWSA** | UWorld Self-Assessment |
| **CMS Form** | Comprehensive Clinical Science Self-Assessment |
| **Free 120** | NBME 官方免费 120 题样卷 |
| **AMBOSS** | 第三方医学题库 |
| **IMG** | International Medical Graduate |
| **MD** | Medical Doctor（美国本土医学生） |
| **DO** | Doctor of Osteopathic Medicine |
| **CI** | Confidence Interval |
| **PGY** | Post-Graduate Year |
| **ARPU** | Average Revenue Per User |
| **MRR** | Monthly Recurring Revenue |
| **NPS** | Net Promoter Score |

### 20.2 参考资料

- NBME Official Score Conversion: https://www.nbme.org/
- USMLE Pass Score Thresholds (2024): Step 1 = 196, Step 2 CK = 214, Step 3 = 198
- Reddit r/Step1: https://reddit.com/r/step1
- Reddit r/Step2: https://reddit.com/r/step2
- Student Doctor Network: https://studentdoctor.net
- 竞品: nbcalc.netlify.app, predictmystepscore.com, usmlepredictor.com

### 20.3 版本历史

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-05-17 | 初版，完整功能、数据、API、UI 规格 |
| 1.1 | 2026-05-17 | **新增 §16.4 SSG-first 渲染与 Cloudflare 部署策略**（核心架构强制原则）；更新 §15.2 缓存策略；标记 Server Actions 禁用 |

### 20.4 联系方式

- **产品负责人**: Solo founder
- **邮箱**: hello@nbmecalc.com
- **域名**: nbmecalc.com（已购）

### 20.5 文档更新规则

- 任何功能开发前：先更新对应章节
- Sprint 完成后：勾选 §18 里程碑 + 写入版本历史
- 算法变更：必须同步更新 §10 + bump version

---

**[END OF PRD v1.0]**

