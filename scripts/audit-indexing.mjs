import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const port = Number(process.env.INDEX_AUDIT_PORT || 3118);
const localBase = `http://127.0.0.1:${port}`;
const productionBase = "https://nbmecalc.com";
const nextBin = path.join(
  cwd,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  cwd,
  env: { ...process.env, NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const errors = [];
const warnings = [];

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function firstMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtml(match[1].trim()) : "";
}

function normalizePath(href) {
  try {
    const url = new URL(href, productionBase);
    if (url.origin !== productionBase) return null;
    return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next server exited early.\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${localBase}/robots.txt`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for Next server.\n${serverOutput}`);
}

async function fetchText(pathname, redirect = "follow") {
  const response = await fetch(`${localBase}${pathname}`, { redirect });
  return { response, text: await response.text() };
}

try {
  await waitForServer();

  const robots = await fetchText("/robots.txt");
  if (!robots.response.ok) errors.push("robots.txt does not return 200");
  if (!robots.text.includes(`${productionBase}/sitemap.xml`)) {
    errors.push("robots.txt does not advertise the canonical sitemap");
  }

  const sitemapResult = await fetchText("/sitemap.xml");
  if (!sitemapResult.response.ok) errors.push("sitemap.xml does not return 200");

  const sitemapUrls = [
    ...sitemapResult.text.matchAll(/<loc>(.*?)<\/loc>/g),
  ].map((match) => decodeHtml(match[1]));

  if (sitemapUrls.length === 0) errors.push("sitemap.xml contains no URLs");

  const duplicateSitemapUrls = sitemapUrls.filter(
    (url, index) => sitemapUrls.indexOf(url) !== index
  );
  if (duplicateSitemapUrls.length > 0) {
    errors.push(`Duplicate sitemap URLs: ${[...new Set(duplicateSitemapUrls)].join(", ")}`);
  }

  const titles = new Map();
  const descriptions = new Map();
  const incomingLinks = new Map(
    sitemapUrls.map((url) => [normalizePath(url), 0])
  );

  for (const sitemapUrl of sitemapUrls) {
    const url = new URL(sitemapUrl);
    const pathname = url.pathname;
    const expectedCanonical = `${productionBase}${pathname === "/" ? "" : pathname}`;
    const page = await fetchText(pathname, "manual");

    if (page.response.status !== 200) {
      errors.push(`${pathname} returned ${page.response.status}, expected 200`);
      continue;
    }

    const title = firstMatch(page.text, /<title>([\s\S]*?)<\/title>/i);
    const description = firstMatch(
      page.text,
      /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i
    );
    const canonical = firstMatch(
      page.text,
      /<link\s+rel="canonical"\s+href="([\s\S]*?)"\s*\/?>/i
    );
    const h1Count = [...page.text.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;
    const robotsMeta = firstMatch(
      page.text,
      /<meta\s+name="robots"\s+content="([\s\S]*?)"\s*\/?>/i
    );

    if (!title) errors.push(`${pathname} has no title`);
    if (!description) errors.push(`${pathname} has no meta description`);
    if (h1Count !== 1) errors.push(`${pathname} has ${h1Count} H1 elements`);
    if (canonical !== expectedCanonical) {
      errors.push(
        `${pathname} canonical is "${canonical}", expected "${expectedCanonical}"`
      );
    }
    if (robotsMeta.toLowerCase().includes("noindex")) {
      errors.push(`${pathname} is both noindex and present in sitemap`);
    }

    if (title) {
      const paths = titles.get(title) || [];
      paths.push(pathname);
      titles.set(title, paths);
    }
    if (description) {
      const paths = descriptions.get(description) || [];
      paths.push(pathname);
      descriptions.set(description, paths);
    }

    for (const jsonLd of page.text.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    )) {
      try {
        JSON.parse(decodeHtml(jsonLd[1]));
      } catch (error) {
        errors.push(`${pathname} has invalid JSON-LD: ${error.message}`);
      }
    }

    for (const hrefMatch of page.text.matchAll(/<a[^>]+href="([^"]+)"/gi)) {
      const linkedPath = normalizePath(decodeHtml(hrefMatch[1]));
      if (linkedPath && incomingLinks.has(linkedPath) && linkedPath !== pathname) {
        incomingLinks.set(linkedPath, incomingLinks.get(linkedPath) + 1);
      }
    }
  }

  for (const [title, paths] of titles) {
    if (paths.length > 1) {
      errors.push(`Duplicate title "${title}" on ${paths.join(", ")}`);
    }
  }
  for (const [description, paths] of descriptions) {
    if (paths.length > 1) {
      errors.push(
        `Duplicate description "${description}" on ${paths.join(", ")}`
      );
    }
  }
  for (const [pathname, count] of incomingLinks) {
    if (pathname !== "/" && count === 0) {
      warnings.push(`${pathname} has no incoming link from another sitemap page`);
    }
  }

  for (const form of [28, 29, 30, 31, 32]) {
    const pathname = `/nbme-${form}-conversion`;
    const redirect = await fetchText(pathname, "manual");
    if (![301, 308].includes(redirect.response.status)) {
      errors.push(
        `${pathname} returned ${redirect.response.status}, expected permanent redirect`
      );
    }
    if (redirect.response.headers.get("location") !== "/nbme-score-conversion") {
      errors.push(`${pathname} redirects to an unexpected destination`);
    }
  }

  console.log(
    `Index audit checked ${sitemapUrls.length} canonical sitemap pages.`
  );
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Index audit passed with ${warnings.length} warning(s).`);
  }
} finally {
  server.kill("SIGTERM");
}
