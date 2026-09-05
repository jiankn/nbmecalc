/**
 * IndexNow submitter for nbmecalc.com (Bing / Yandex / Seznam / Naver).
 *
 * IndexNow only tells engines *which* URLs changed — it does not replace the
 * sitemap, and it does not guarantee indexing. The engine still crawls and
 * decides. Submitting unchanged URLs repeatedly is explicitly discouraged by
 * the protocol, so the default run submits the sitemap once per deploy and
 * targeted runs (`--urls`) are preferred for one-off content updates.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                    # every sitemap URL
 *   node scripts/indexnow-submit.mjs --urls /blog,/pricing
 *   node scripts/indexnow-submit.mjs --dry-run
 */

import process from "node:process";

const SITE_URL = "https://nbmecalc.com";
// Must stay in sync with the file at public/<key>.txt — the engine fetches
// that file and refuses the batch if its contents do not match this key.
const KEY = "f93ebbe9ad6718fc405f59a099c1b06f";
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
// Protocol cap is 10,000 URLs per request.
const BATCH_SIZE = 10000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

function readFlag(name) {
  const inline = args.find((a) => a.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

/** Accepts absolute URLs or site-relative paths; rejects other hosts. */
function normalizeUrl(raw) {
  const value = raw.trim();
  if (!value) return null;
  const url = new URL(value, SITE_URL);
  if (url.origin !== SITE_URL) {
    throw new Error(`URL is not on ${SITE_URL}: ${value}`);
  }
  url.hash = "";
  return url.toString();
}

async function urlsFromSitemap() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { "user-agent": "nbmecalc-indexnow/1.0" },
  });
  if (!res.ok) {
    throw new Error(`sitemap.xml returned HTTP ${res.status}`);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) {
    throw new Error("sitemap.xml contained no <loc> entries");
  }
  return locs.map(normalizeUrl).filter(Boolean);
}

/**
 * The key file has to be publicly readable before a batch is accepted; a
 * failed deploy would otherwise turn every submission into a silent 403.
 */
async function verifyKeyFile() {
  const res = await fetch(KEY_LOCATION, {
    headers: { "user-agent": "nbmecalc-indexnow/1.0" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`key file ${KEY_LOCATION} returned HTTP ${res.status}`);
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    throw new Error(`key file ${KEY_LOCATION} does not contain the expected key`);
  }
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "user-agent": "nbmecalc-indexnow/1.0",
    },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  // 200 = accepted, 202 = accepted but key validation still pending.
  if (res.status !== 200 && res.status !== 202) {
    const detail = (await res.text()).slice(0, 500);
    throw new Error(`IndexNow returned HTTP ${res.status}: ${detail || "(no body)"}`);
  }
  return res.status;
}

async function main() {
  const explicit = readFlag("--urls");
  const urls = explicit
    ? [...new Set(explicit.split(",").map(normalizeUrl).filter(Boolean))]
    : [...new Set(await urlsFromSitemap())];

  console.log(`IndexNow: ${urls.length} URL(s) from ${explicit ? "--urls" : "sitemap.xml"}`);
  for (const url of urls) console.log(`  ${url}`);

  if (dryRun) {
    console.log("Dry run — nothing submitted.");
    return;
  }

  await verifyKeyFile();
  console.log(`Key file verified at ${KEY_LOCATION}`);

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const status = await submit(batch);
    console.log(`Submitted ${batch.length} URL(s) — HTTP ${status}`);
  }
}

main().catch((error) => {
  console.error(`IndexNow submission failed: ${error.message}`);
  process.exitCode = 1;
});
