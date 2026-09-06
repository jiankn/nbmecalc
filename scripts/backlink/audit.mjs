#!/usr/bin/env node
// Audit live backlinks against the project's own acceptance rules:
// public page 2xx, no noindex (meta or X-Robots-Tag), target URL present in the
// rendered HTML, and the rel tokens on that exact anchor.
//
//   node scripts/backlink/audit.mjs                          # re-audit every row in backlink-ledger.md
//   node scripts/backlink/audit.mjs --url <public> --target <canonical>
//
// Exits 1 when a previously accepted link regressed - safe to wire into a cron.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  args,
  writeJson,
  writeText,
  fetchPage,
  pool,
  metaRobots,
  isIndexable,
  findLinks,
  rootDomain,
  nowISO,
} from './lib.mjs';

const opts = args();
const ROOT = process.cwd();
const OUT = resolve(ROOT, opts.out || '.backlink-cache/audit.json');
const HOME = 'https://nbmecalc.com';

function fromLedger() {
  const path = resolve(ROOT, opts.ledger || 'backlink-ledger.md');
  if (!existsSync(path)) {
    console.error(`missing ${path}`);
    process.exit(1);
  }
  const rows = [];
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    // Asset | Platform | Root domain | Public URL | Canonical target | anchor | rel | Indexable | Status | Evidence
    if (cells.length < 11) continue;
    const publicUrl = (cells[4].match(/https?:\/\/\S+/) || [])[0];
    if (!publicUrl) continue;
    const rawTarget = cells[5].replace(/`/g, '').trim();
    if (!rawTarget) continue;
    const target = rawTarget.startsWith('http') ? rawTarget : `${HOME}${rawTarget}`;
    rows.push({
      asset: cells[1],
      platform: cells[2],
      publicUrl,
      target,
      recordedAnchor: cells[6],
      recordedRel: cells[7],
      recordedStatus: cells[9],
    });
  }
  return rows;
}

const targets = opts.url
  ? [{ asset: 'ad-hoc', platform: rootDomain(opts.url), publicUrl: opts.url, target: opts.target || HOME }]
  : fromLedger();

if (!targets.length) {
  console.error('no rows parsed - check the ledger table shape');
  process.exit(1);
}
console.log(`auditing ${targets.length} public listing(s)`);

const results = await pool(targets, Number(opts.concurrency ?? 5), async (row) => {
  const res = await fetchPage(row.publicUrl);
  const html = res.body || '';
  const meta = metaRobots(html);
  const indexable = isIndexable({ metaValues: meta, xRobots: res.xRobots });
  const links = findLinks(html, res.finalUrl, row.target);
  const exact = links.filter((l) => l.exactTarget);
  const best = exact.find((l) => l.follow) || exact[0] || links.find((l) => l.follow) || links[0] || null;

  const problems = [];
  if (!res.ok) problems.push(`unreachable: ${res.error}`);
  else if (res.status >= 400) problems.push(`http ${res.status}`);
  if (res.ok && res.status < 400 && !indexable) problems.push('noindex');
  if (res.ok && res.status < 400 && !html) problems.push('no HTML body returned (JS-rendered or blocked)');
  if (html && links.length === 0) problems.push('target link not found in rendered HTML');
  if (html && links.length > 0 && exact.length === 0) {
    problems.push('links to the domain but not to the recorded canonical path');
  }
  if (best && !best.follow) problems.push(`link is ${best.rel.join('/')}`);

  return {
    ...row,
    checked: nowISO(),
    status: res.status,
    finalUrl: res.finalUrl,
    indexable,
    metaRobots: meta,
    xRobots: res.xRobots,
    linksFound: links.length,
    exactTargetLinks: exact.length,
    anchor: best ? best.anchor : '',
    rel: best ? best.rel : [],
    follow: best ? best.follow : false,
    verdict: problems.length ? 'FAIL' : 'PASS',
    problems,
  };
});

const pass = results.filter((r) => r.verdict === 'PASS');
const fail = results.filter((r) => r.verdict === 'FAIL');
const followRoots = new Set(pass.filter((r) => r.follow).map((r) => rootDomain(r.publicUrl)));

const summary = {
  generated: nowISO(),
  audited: results.length,
  pass: pass.length,
  fail: fail.length,
  uniqueFollowIndexableRootDomains: followRoots.size,
};

writeJson(OUT, { summary, results });

const md = [];
md.push('# 外链存活与属性审计');
md.push('');
md.push(`审计日期：${summary.generated}　审计条目：${summary.audited}　通过：${summary.pass}　失败：${summary.fail}`);
md.push(`　follow + 可索引的唯一根域：${summary.uniqueFollowIndexableRootDomains}`);
md.push('');
md.push('| 判定 | 平台 | HTTP | 可索引 | 命中/精确 | 实际锚文本 | rel | 问题 | 公开页 |');
md.push('|---|---|---:|---|---:|---|---|---|---|');
for (const r of [...fail, ...pass]) {
  md.push(
    `| ${r.verdict} | ${r.platform} | ${r.status} | ${r.indexable ? 'yes' : 'no'} | ${r.linksFound}/${r.exactTargetLinks} | ${(r.anchor || '').slice(0, 50)} | ${r.rel.join(' ') || 'none'} | ${r.problems.join('; ') || '-'} | ${r.publicUrl.slice(0, 70)} |`,
  );
}
md.push('');
md.push('`FAIL` 不等于链接一定掉了：反爬 403、JS 渲染页面和 Cloudflare 挑战都会以 FAIL 出现，需人工复核后再改台账。');
writeText(OUT.replace(/\.json$/, '.md'), `${md.join('\n')}\n`);

console.log(JSON.stringify(summary, null, 2));
for (const r of fail) console.log(`FAIL ${r.platform}: ${r.problems.join('; ')}`);
console.log(`\nwrote ${OUT}`);
console.log(`wrote ${OUT.replace(/\.json$/, '.md')}`);

if (fail.length) process.exitCode = 1;
