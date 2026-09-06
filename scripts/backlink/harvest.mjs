#!/usr/bin/env node
// Build a deduplicated, pre-filtered candidate queue from the cached upstream datasets.
//   node scripts/backlink/harvest.mjs [--radar-min-score 40] [--out .backlink-cache/candidates.json]
//
// Filtering here is cheap and offline. Live checks happen in qualify.mjs.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { args, rootDomain, writeJson, writeText, nowISO } from './lib.mjs';

const opts = args();
const ROOT = process.cwd();
const CACHE = resolve(ROOT, '.backlink-cache');
const OUT = resolve(ROOT, opts.out || '.backlink-cache/candidates.json');
const RADAR_MIN = Number(opts['radar-min-score'] ?? 40);

// ---------- 1. domains we must not re-submit ----------

function knownDomains() {
  const known = new Map(); // rootDomain -> reason
  const ledger = resolve(ROOT, 'backlink-ledger.md');
  if (existsSync(ledger)) {
    const text = readFileSync(ledger, 'utf8');
    for (const m of text.matchAll(/https?:\/\/[^\s|)\]]+/g)) {
      const rd = rootDomain(m[0]);
      if (rd && rd !== 'nbmecalc.com' && rd !== 'github.com') known.set(rd, 'in ledger');
    }
  }
  for (const file of ['BACKLINK_BUILD_PLAN.md', 'BACKLINK_PROGRESS_LOG.md']) {
    const path = resolve(ROOT, file);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, 'utf8');
    for (const m of text.matchAll(/https?:\/\/[^\s|)\]]+/g)) {
      const rd = rootDomain(m[0]);
      if (rd && !known.has(rd) && rd !== 'nbmecalc.com' && rd !== 'github.com') {
        known.set(rd, `mentioned in ${file}`);
      }
    }
  }
  return known;
}

// ---------- 2. relevance model for a USMLE / medical-education tool ----------

const STRONG =
  /\b(usmle|nbme|step\s?[123]|shelf|medical|medicine|med[- ]?school|medschool|clinical|nursing|nurse|doctor|physician|health|anatomy|pharmacology|residency|premed)\b/i;
const EDU =
  /\b(education|educational|edu|student|study|studying|learning|learn|academic|university|college|school|teacher|teaching|exam|test\s?prep|course|tutor|library|oer|curriculum|quiz)\b/i;
const TOOLISH =
  /\b(calculator|tool|utility|converter|productivity|software|saas|app|directory|startup|product)\b/i;
const NEGATIVE =
  /\b(casino|gambling|betting|porn|adult|escort|forex\s?signals|payday|essay\s?writing|write\s?my\s?essay|link\s?exchange|link\s?farm|pbn|buy\s?backlinks)\b/i;

// Chinese status notes carried in the upstream list's 备注 column.
const NOTE_DEAD = /停服|已关闭|入口关闭|无提交入口|404/;
const NOTE_PAID = /收费|付费|可收费/;
const NOTE_RECIPROCAL = /反链引导|可反链接|互链/;
const NOTE_DUP = /重复/;
const NOTE_LISTED = /已收录|站内搜到/;

function relevance(text) {
  let score = 0;
  const hay = text.toLowerCase();
  if (STRONG.test(hay)) score += 50;
  if (EDU.test(hay)) score += 25;
  if (TOOLISH.test(hay)) score += 5;
  if (/\bai\b|artificial intelligence/i.test(hay)) score += 2; // AI-only directories are weakly relevant at best
  if (NEGATIVE.test(hay)) score -= 100;
  return score;
}

// ---------- 3. parse the flaqai free directory list ----------

function harvestFreeList(known) {
  const path = resolve(CACHE, 'backlink_skills/Free-backlink-list.md');
  if (!existsSync(path)) {
    console.warn('! Free-backlink-list.md missing - run scripts/backlink/sync-sources.mjs first');
    return [];
  }
  const rows = [];
  const seen = new Set();
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!/^\|\s*\d+\s*\|/.test(line)) continue;
    const cells = line.split('|').map((c) => c.trim());
    // '' | 编号 | 网站与入口 | 简介 | 批次 | 备注 | ''
    const entry = cells[2] || '';
    const desc = cells[3] || '';
    const batch = cells[4] || '';
    const note = cells[5] || '';
    const urlMatch =
      entry.match(/\(<?(https?:\/\/[^>)\s]+)>?\)/) || entry.match(/(https?:\/\/[^>)\s\]]+)/);
    if (!urlMatch) continue;
    const url = urlMatch[1].replace(/[),\s]+$/, '');
    const rd = rootDomain(url);
    if (!rd) continue;

    const blockers = [];
    if (known.has(rd)) blockers.push(`already handled: ${known.get(rd)}`);
    if (NOTE_DEAD.test(note)) blockers.push('upstream note: dead or no submit entry');
    if (NOTE_PAID.test(note)) blockers.push('upstream note: paid / paid upsell');
    if (NOTE_RECIPROCAL.test(note)) {
      blockers.push('upstream note: reciprocal link required (project policy forbids)');
    }
    if (NOTE_DUP.test(note)) blockers.push('upstream note: duplicate');
    if (seen.has(rd)) blockers.push('duplicate root domain within this list');
    seen.add(rd);

    rows.push({
      source: 'flaqai/backlink_skills',
      kind: 'directory',
      rootDomain: rd,
      submitUrl: url,
      note: note === '—' ? '' : note,
      batch: batch === '—' ? '' : batch,
      upstreamDesc: desc,
      alreadyListedUpstream: NOTE_LISTED.test(note),
      relevance: relevance(`${desc} ${rd} ${url}`),
      blockers,
    });
  }
  return rows;
}

// ---------- 4. parse the ai-tools-radar dofollow link library ----------

function harvestRadar(known) {
  const path = resolve(CACHE, 'ai-tools-radar/data/library.json');
  if (!existsSync(path)) {
    console.warn('! ai-tools-radar/data/library.json missing - run scripts/backlink/sync-sources.mjs first');
    return [];
  }
  const lib = JSON.parse(readFileSync(path, 'utf8'));
  const rows = [];
  const seen = new Set();
  for (const item of lib) {
    const text = `${item.title || ''} ${item.src || ''} ${item.url || ''}`;
    const rel = relevance(text);
    // Radar is an AI-tools dataset. Only keep pages that read as education/medical,
    // otherwise every row is an off-topic AI directory.
    if (rel < 25) continue;
    if (Number(item.ascore || 0) < RADAR_MIN) continue;
    const rd = rootDomain(item.url || item.src);
    if (!rd) continue;

    const blockers = [];
    if (known.has(rd)) blockers.push(`already handled: ${known.get(rd)}`);
    if (seen.has(rd)) blockers.push('duplicate root domain within this list');
    seen.add(rd);

    rows.push({
      source: 'ppop123/ai-tools-radar',
      kind: 'outreach', // a page that has given dofollow links before - pitch it, no submit form
      rootDomain: rd,
      submitUrl: item.url,
      note: `ascore ${item.ascore}, ${item.nt} outbound targets, plat=${item.plat || 'n/a'}`,
      batch: '',
      upstreamDesc: (item.title || '').slice(0, 200),
      alreadyListedUpstream: false,
      relevance: rel + Math.round(Number(item.ascore || 0) / 10),
      blockers,
    });
  }
  return rows;
}

// ---------- 5. assemble ----------

const known = knownDomains();
const free = harvestFreeList(known);
const radar = harvestRadar(known);
const all = [...free, ...radar];

for (const row of all) {
  row.actionable = row.blockers.length === 0 && row.relevance > 0;
  row.tier = !row.actionable ? 'excluded' : row.relevance >= 70 ? 'A' : row.relevance >= 40 ? 'B' : 'C';
}

all.sort((a, b) => b.relevance - a.relevance || a.rootDomain.localeCompare(b.rootDomain));

const summary = {
  generated: nowISO(),
  knownDomains: known.size,
  totals: {
    all: all.length,
    directory: free.length,
    outreach: radar.length,
    actionable: all.filter((r) => r.actionable).length,
    tierA: all.filter((r) => r.tier === 'A').length,
    tierB: all.filter((r) => r.tier === 'B').length,
    tierC: all.filter((r) => r.tier === 'C').length,
    excluded: all.filter((r) => r.tier === 'excluded').length,
  },
};

writeJson(OUT, { summary, candidates: all });

const md = [];
md.push('# 外链候选队列（自动生成，未经现场核验）');
md.push('');
md.push(`生成日期：${summary.generated}　候选总数：${summary.totals.all}　可执行：${summary.totals.actionable}`);
md.push('');
md.push(`已排除的既有根域：${summary.knownDomains}（来自 backlink-ledger.md 与计划/日志文件）`);
md.push('');
md.push('| Tier | 根域 | 类型 | 相关度 | 入口 | 上游备注 |');
md.push('|---|---|---|---:|---|---|');
for (const r of all.filter((x) => x.actionable).slice(0, 200)) {
  md.push(`| ${r.tier} | ${r.rootDomain} | ${r.kind} | ${r.relevance} | ${r.submitUrl} | ${r.note || ''} |`);
}
md.push('');
md.push('下一步：`node scripts/backlink/qualify.mjs` 对 Tier A/B 做现场核验（HTTP、noindex、付费信号、是否真有提交入口）。');
writeText(OUT.replace(/\.json$/, '.md'), `${md.join('\n')}\n`);

console.log(JSON.stringify(summary, null, 2));
console.log(`\nwrote ${OUT}`);
console.log(`wrote ${OUT.replace(/\.json$/, '.md')}`);
