#!/usr/bin/env node
// Live-qualify harvested candidates: is the page up, indexable, free, and does it
// actually link out? Replaces the manual "open 100 tabs and eyeball it" pass.
//
//   node scripts/backlink/qualify.mjs --tier A,B [--kind outreach] [--limit 150] [--concurrency 6]
//
// Writes .backlink-cache/qualified.json and .backlink-cache/qualified.md

import { resolve } from 'node:path';
import {
  args,
  readJson,
  writeJson,
  writeText,
  fetchPage,
  pool,
  pageTitle,
  metaRobots,
  isIndexable,
  stripTags,
  rootDomain,
  nowISO,
} from './lib.mjs';

const opts = args();
const ROOT = process.cwd();
const IN = resolve(ROOT, opts.in || '.backlink-cache/candidates.json');
const OUT = resolve(ROOT, opts.out || '.backlink-cache/qualified.json');
const TIERS = String(opts.tier || 'A,B').split(',').map((t) => t.trim().toUpperCase());
const KIND = opts.kind ? String(opts.kind) : null;
const LIMIT = Number(opts.limit ?? 200);
const CONCURRENCY = Number(opts.concurrency ?? 6);

const data = readJson(IN);
if (!data) {
  console.error(`missing ${IN} - run scripts/backlink/harvest.mjs first`);
  process.exit(1);
}

const queue = data.candidates
  .filter((c) => c.actionable && TIERS.includes(c.tier) && (!KIND || c.kind === KIND))
  .slice(0, LIMIT);

console.log(`qualifying ${queue.length} candidates (tiers ${TIERS.join('/')}${KIND ? `, kind=${KIND}` : ''})`);

// ---------- page signals ----------

const PAID = /\b(paid submission|pay to submit|submission fee|featured listing|\$\s?\d{1,4}(\.\d{2})?\s*(\/|per)?\s*(submission|listing|month)?|pricing plan|upgrade to (pro|premium))\b/i;
const RECIPROCAL = /\b(reciprocal link|link back to us|add our badge|backlink required|link exchange)\b/i;
const CAPTCHA = /(recaptcha|hcaptcha|cf-turnstile|turnstile\.js|g-recaptcha)/i;
const LOGIN = /\b(sign in to submit|log in to submit|create an account to submit|you must be logged in)\b/i;
const SUBMITTISH = /\b(submit|add your|list your|suggest a|contribute|nominate|share your tool|add a resource|resource submission)\b/i;
const CONTACTISH = /\b(contact us|contact|email us|get in touch|webmaster|librarian|feedback)\b/i;

function countOutboundLinks(html, baseUrl) {
  const self = rootDomain(baseUrl);
  let total = 0;
  let follow = 0;
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!href) continue;
    let u;
    try {
      u = new URL(href[1], baseUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(u.protocol)) continue;
    const rd = rootDomain(u.href);
    if (!rd || rd === self) continue;
    total += 1;
    const rel = (attrs.match(/rel\s*=\s*["']([^"']*)["']/i)?.[1] || '').toLowerCase();
    if (!/nofollow|ugc|sponsored/.test(rel)) follow += 1;
  }
  return { total, follow };
}

function firstEmail(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const m = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (!m) return '';
  if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(m[0])) return '';
  return m[0];
}

function contactPath(html, baseUrl) {
  const re = /<a\b([^>]*)>([\s\S]{0,120}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const label = stripTags(m[2]);
    const href = m[1].match(/href\s*=\s*["']([^"']+)["']/i);
    if (!href) continue;
    if (!CONTACTISH.test(label) && !/contact|submit|suggest/i.test(href[1])) continue;
    try {
      return new URL(href[1], baseUrl).href;
    } catch {
      continue;
    }
  }
  return '';
}

// ---------- run ----------

const results = await pool(queue, CONCURRENCY, async (c) => {
  const res = await fetchPage(c.submitUrl);
  const html = res.body || '';
  const meta = metaRobots(html);
  const indexable = isIndexable({ metaValues: meta, xRobots: res.xRobots });
  const out = countOutboundLinks(html, res.finalUrl);
  const bodyText = stripTags(html).slice(0, 200000);

  const flags = [];
  if (!res.ok) flags.push(`unreachable: ${res.error}`);
  else if (res.status >= 400) flags.push(`http ${res.status}`);
  if (!indexable) flags.push('noindex');
  if (PAID.test(bodyText)) flags.push('paid signal on page');
  if (RECIPROCAL.test(bodyText)) flags.push('reciprocal link required');
  if (CAPTCHA.test(html)) flags.push('captcha (needs a human)');
  if (LOGIN.test(bodyText)) flags.push('account required');
  if (out.follow === 0 && out.total > 0) flags.push('all outbound links nofollow');

  const hasForm = /<form\b/i.test(html);
  const hasSubmitLanguage = SUBMITTISH.test(bodyText.slice(0, 20000));

  const blocking = flags.filter((f) =>
    /unreachable|http [45]|noindex|paid signal|reciprocal|all outbound links nofollow/.test(f),
  );

  return {
    ...c,
    check: {
      date: nowISO(),
      status: res.status,
      finalUrl: res.finalUrl,
      title: pageTitle(html),
      metaRobots: meta,
      xRobots: res.xRobots,
      indexable,
      outboundLinks: out.total,
      outboundFollow: out.follow,
      hasForm,
      hasSubmitLanguage,
      contactEmail: firstEmail(html),
      contactUrl: contactPath(html, res.finalUrl),
      ms: res.ms,
    },
    flags,
    verdict: blocking.length ? 'reject' : flags.length ? 'manual' : 'go',
  };
});

const byVerdict = { go: [], manual: [], reject: [] };
for (const r of results) byVerdict[r.verdict].push(r);

// Sort each bucket: best evidence of giving follow links first.
for (const k of Object.keys(byVerdict)) {
  byVerdict[k].sort((a, b) => b.check.outboundFollow - a.check.outboundFollow || b.relevance - a.relevance);
}

const summary = {
  generated: nowISO(),
  checked: results.length,
  go: byVerdict.go.length,
  manual: byVerdict.manual.length,
  reject: byVerdict.reject.length,
};

writeJson(OUT, { summary, results });

const md = [];
md.push('# 外链候选现场核验结果');
md.push('');
md.push(`核验日期：${summary.generated}　已检查：${summary.checked}　可推进：${summary.go}　需人工判断：${summary.manual}　淘汰：${summary.reject}`);
md.push('');
md.push('判定口径：`reject` = 不可达/4xx/5xx、noindex、页面有付费或互链要求、或所有出站链接都是 nofollow。');
md.push('`manual` = 有 captcha、需要账号，或其他必须人来决定的信号。`go` = 页面活着、可索引、确实给出过 follow 出站链接。');
md.push('');
for (const [bucket, label] of [['go', '可推进'], ['manual', '需人工判断'], ['reject', '淘汰']]) {
  const rows = byVerdict[bucket];
  if (!rows.length) continue;
  md.push(`## ${label}（${rows.length}）`);
  md.push('');
  md.push('| 根域 | 类型 | HTTP | 出站 follow/总数 | 联系方式 | 标记 | 入口 |');
  md.push('|---|---|---:|---:|---|---|---|');
  for (const r of rows) {
    const contact = r.check.contactEmail || r.check.contactUrl || '';
    md.push(
      `| ${r.rootDomain} | ${r.kind} | ${r.check.status} | ${r.check.outboundFollow}/${r.check.outboundLinks} | ${contact.slice(0, 60)} | ${r.flags.join('; ') || '-'} | ${r.check.finalUrl.slice(0, 80)} |`,
    );
  }
  md.push('');
}
md.push('下一步：对 `可推进` 的条目用 `kit.json` 的字段包生成提交/外联内容；提交或发信前由人确认。');
writeText(OUT.replace(/\.json$/, '.md'), `${md.join('\n')}\n`);

console.log(JSON.stringify(summary, null, 2));
console.log(`\nwrote ${OUT}`);
console.log(`wrote ${OUT.replace(/\.json$/, '.md')}`);
