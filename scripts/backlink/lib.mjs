// Shared helpers for the NBMEcalc backlink pipeline.
// Node built-ins only: no dependency install required.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/131.0.0.0 Safari/537.36 NBMEcalc-backlink-audit/1.0 (+https://nbmecalc.com/)';

export function rootDomain(input) {
  let host;
  try {
    host = new URL(input.startsWith('http') ? input : `https://${input}`).hostname;
  } catch {
    return null;
  }
  host = host.toLowerCase().replace(/^www\./, '');
  // Two-label suffixes we actually meet in this dataset.
  const multi = /\.(co|com|net|org|gov|edu|ac)\.[a-z]{2}$/;
  const parts = host.split('.');
  if (multi.test(host) && parts.length > 3) return parts.slice(-3).join('.');
  if (parts.length > 2 && !multi.test(host)) {
    // Keep known public-suffix-ish hosting labels distinct (github.io, r-universe.dev, ...).
    const keepThree = /\.(github\.io|codeberg\.page|gitbook\.io|r-universe\.dev|weebly\.com|edublogs\.org|blogspot\.com|wordpress\.com|netlify\.app|vercel\.app|pages\.dev)$/;
    if (keepThree.test(host)) return parts.slice(-3).join('.');
    return parts.slice(-2).join('.');
  }
  return host;
}

export function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, 'utf8');
}

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i += 1;
      }
    } else out._.push(a);
  }
  return out;
}

// ---------- HTTP ----------

export async function fetchPage(url, { timeout = 20000, method = 'GET' } = {}) {
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
      },
    });
    const contentType = res.headers.get('content-type') || '';
    const xRobots = res.headers.get('x-robots-tag') || '';
    let body = '';
    if (method === 'GET' && /text\/html|text\/plain|application\/(xhtml|json)/i.test(contentType)) {
      body = (await res.text()).slice(0, 900000);
    }
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url || url,
      contentType,
      xRobots,
      body,
      ms: Date.now() - started,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      contentType: '',
      xRobots: '',
      body: '',
      error: String(err && err.message ? err.message : err),
      ms: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = cursor;
      cursor += 1;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

// ---------- HTML ----------

export function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function pageTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]).slice(0, 180) : '';
}

export function metaRobots(html) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const values = [];
  for (const tag of tags) {
    const name = tag.match(/name\s*=\s*["']?(robots|googlebot)["']?/i);
    if (!name) continue;
    const content = tag.match(/content\s*=\s*["']([^"']*)["']/i);
    if (content) values.push(content[1].trim().toLowerCase());
  }
  return values;
}

export function isIndexable({ metaValues, xRobots }) {
  const all = [...metaValues, (xRobots || '').toLowerCase()].join(' ');
  if (/\bnoindex\b/.test(all)) return false;
  return true;
}

// Returns every <a> whose href resolves onto the target URL (or its origin).
export function findLinks(html, baseUrl, targetUrl) {
  const target = new URL(targetUrl);
  const wantHost = target.hostname.replace(/^www\./, '');
  const wantPath = target.pathname.replace(/\/+$/, '');
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    let href;
    try {
      href = new URL(hrefMatch[1], baseUrl);
    } catch {
      continue;
    }
    if (href.hostname.replace(/^www\./, '') !== wantHost) continue;
    const gotPath = href.pathname.replace(/\/+$/, '');
    const exact = gotPath === wantPath;
    const relMatch = attrs.match(/rel\s*=\s*["']([^"']*)["']/i);
    const rel = relMatch ? relMatch[1].trim().toLowerCase().split(/\s+/).filter(Boolean) : [];
    out.push({
      href: href.href,
      exactTarget: exact,
      anchor: stripTags(m[2]).slice(0, 160),
      rel,
      follow: !rel.some((r) => r === 'nofollow' || r === 'ugc' || r === 'sponsored'),
    });
  }
  return out;
}

export const nowISO = () => new Date().toISOString().slice(0, 10);
