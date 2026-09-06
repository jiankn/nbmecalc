#!/usr/bin/env node
// Turn qualified targets into ready-to-send outreach emails / form payloads.
// Anchor + landing page are routed from the target page's own topic, so a nursing
// blog gets the Step 2 CK route and a library resource page gets the CMS guide.
//
//   node scripts/backlink/draft.mjs [--verdict go] [--limit 50]
//
// Writes one .md per target into backlink-submissions/outbox/ plus an index.

import { resolve } from 'node:path';
import { args, readJson, writeText, nowISO } from './lib.mjs';

const opts = args();
const ROOT = process.cwd();
const IN = resolve(ROOT, opts.in || '.backlink-cache/qualified.json');
const KIT = readJson(resolve(ROOT, 'scripts/backlink/kit.json'));
const OUTDIR = resolve(ROOT, opts.outdir || 'backlink-submissions/outbox');
const VERDICTS = String(opts.verdict || 'go').split(',').map((v) => v.trim());
const LIMIT = Number(opts.limit ?? 50);

const data = readJson(IN);
if (!data || !KIT) {
  console.error(`missing ${IN} or kit.json - run scripts/backlink/qualify.mjs first`);
  process.exit(1);
}

const anchorById = Object.fromEntries(KIT.anchorRouting.map((a) => [a.id, a]));

// Route by what the target page is actually about.
const ROUTES = [
  { id: 'A7', test: /\b(shelf|clerkship|rotation|clinical science|cms)\b/i },
  { id: 'A11', test: /\b(step 2|step2|ck|nursing|nurse)\b/i },
  { id: 'A10', test: /\b(step 1|step1|preclinical|basic science)\b/i },
  { id: 'A12', test: /\b(step 3|step3|residency|resident|intern)\b/i },
  { id: 'A15', test: /\b(librar|research|evidence|validation|methodolog|faculty|institutional)\b/i },
  { id: 'A6', test: /\b(nbme|score report|self[- ]assessment|practice exam)\b/i },
  { id: 'A3', test: /\b(usmle|medical student|med school|premed)\b/i },
];

function route(row) {
  const hay = `${row.check.title} ${row.upstreamDesc} ${row.check.finalUrl}`;
  for (const r of ROUTES) if (r.test.test(hay)) return anchorById[r.id];
  return anchorById[KIT.defaultAnchorId];
}

function slug(s) {
  return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

function emailDraft(row, anchor) {
  const to = row.check.contactEmail || '(no address found - use the contact form below)';
  return `**To:** ${to}
**Contact form:** ${row.check.contactUrl || '-'}
**Subject:** Free CMS/NBME score-interpretation resource for your ${row.check.title ? 'page' : 'resource list'}

Hello,

I maintain ${KIT.brand}, a free browser tool that helps medical students interpret NBME, UWSA, Free 120, AMBOSS and CMS practice-exam results and turn them into subject-level study priorities with a stated uncertainty range.

I came across ${row.check.finalUrl} while looking for well-maintained resources on this topic. If it is useful to your readers, the page below may be worth a line in that list:

  ${anchor.anchor} - ${anchor.target}

A few things you may want to check before deciding:
- It is free to use in a browser, with no account required for the core tool.
- The methodology and its limits are documented publicly: ${anchorById.A14.target}
- Current validation status: ${anchorById.A15.target}

${KIT.disclosure}

I am the developer, so treat this as a suggestion rather than an independent recommendation. Happy to provide a plain-text description you can edit, or to answer any question about how the ranges are produced.

Thanks for your time,
${KIT.brand}
${KIT.homepage}
`;
}

function formDraft(row, anchor) {
  return `**Submit URL:** ${row.check.finalUrl}
**Has form on page:** ${row.check.hasForm ? 'yes' : 'no'}${row.flags.includes('captcha (needs a human)') ? '　(CAPTCHA present - a human must complete it)' : ''}

| Field | Value |
|---|---|
| Product name | ${KIT.brand} |
| Website / URL | ${anchor.target} |
| Anchor to request (${anchor.id}) | ${anchor.anchor} |
| Tagline | ${KIT.copy.tagline80} |
| Short description | ${KIT.copy.short160} |
| Category | ${KIT.categories.join(' / ')} |
| Pricing | ${KIT.pricing} - ${KIT.pricingNote} |
| Tags | ${KIT.tags.join(', ')} |
| Vendor | ${KIT.vendor} |
| Contact email | ${KIT.contactEmailSlot} |
| Image | ${KIT.image} |

**Full description**

${KIT.copy.long}

**Required disclosure (always include)**

${KIT.disclosure}
`;
}

const rows = data.results.filter((r) => VERDICTS.includes(r.verdict)).slice(0, LIMIT);
const index = [];

for (const row of rows) {
  const anchor = route(row);
  const body = row.kind === 'outreach' ? emailDraft(row, anchor) : formDraft(row, anchor);
  const file = `${slug(row.rootDomain)}.md`;
  const doc = `# ${row.rootDomain}

- 目标页：${row.check.finalUrl}
- 页面标题：${row.check.title || '-'}
- 类型：${row.kind}　核验判定：${row.verdict}　标记：${row.flags.join('; ') || '-'}
- 出站 follow/总数：${row.check.outboundFollow}/${row.check.outboundLinks}
- 路由锚文本：${anchor.id} \`${anchor.anchor}\` → ${anchor.target}
- 草稿生成：${nowISO()}

> 这是草稿。发信或提交前由人确认收件人、语气和当前页面条款；不要在未确认的情况下群发。

${body}
`;
  writeText(resolve(OUTDIR, file), doc);
  index.push({ rootDomain: row.rootDomain, kind: row.kind, anchor: anchor.id, target: anchor.target, file });
}

const md = [
  '# 待发送队列（草稿）',
  '',
  `生成日期：${nowISO()}　草稿数：${index.length}`,
  '',
  '| 根域 | 类型 | 锚文本路由 | 落地页 | 草稿 |',
  '|---|---|---|---|---|',
  ...index.map((i) => `| ${i.rootDomain} | ${i.kind} | ${i.anchor} | ${i.target} | [${i.file}](./${i.file}) |`),
  '',
  '发出去之后：把公开详情页 URL 追加到 `backlink-ledger.md`，再跑 `node scripts/backlink/audit.mjs` 做验收。',
];
writeText(resolve(OUTDIR, 'README.md'), `${md.join('\n')}\n`);

console.log(`wrote ${index.length} drafts to ${OUTDIR}`);
