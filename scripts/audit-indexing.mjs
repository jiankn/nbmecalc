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
const remediatedPaths = new Set([
  "/about",
  "/blog",
  "/blog/amboss-vs-uworld-which-qbank-wins",
  "/blog/most-tested-topics-step-2-ck",
  "/blog/night-before-step-exam-what-to-do",
  "/blog/step-2-ck-subject-weighting-explained",
  "/blog/step-3-ccs-cases-complete-walkthrough",
  "/compare/vs-predictmystepscore",
  "/cms-forms-step-2-ck",
  "/educators",
  "/methodology",
  "/nbme-calculator",
  "/uwsa-1-to-step-1",
]);
const evidenceSensitivePaths = new Set([
  "/blog/amboss-vs-uworld-which-qbank-wins",
  "/blog/most-tested-topics-step-2-ck",
  "/blog/night-before-step-exam-what-to-do",
  "/blog/step-2-ck-subject-weighting-explained",
  "/blog/step-3-ccs-cases-complete-walkthrough",
  "/compare/vs-amboss-predictor",
  "/compare/vs-nbcalc",
  "/compare/vs-predictmystepscore",
  "/cms-forms-step-2-ck",
  "/nbme-calculator",
  "/step-1-predictor",
  "/uwsa-1-to-step-1",
]);
// Baseline snapshots that guard already-ranking pages against accidental
// metadata drift. Rebase an entry only alongside a deliberate rewrite.
// `/` and `/nbme-score-conversion` were rebased on 2026-08-10 after the
// Search Console export showed page-one positions with near-zero CTR.
const frozenSeo = new Map([
  [
    "/",
    {
      title: "Free NBME Score Calculator — Step Score Estimate in Seconds",
      description: "Combine Step 2 CCSSA, UWSA, Free 120, AMBOSS, or CMS results into an independent Step estimate and planning range. Free, no signup.",
      h1: "NBME Score Calculator — Predict Your Step Score in 5 Seconds",
    },
  ],
  [
    "/nbme-score-conversion",
    {
      title: "NBME Score Conversion Chart — Step 2 CK, Step 1 & Step 3 Forms",
      description: "Read NBME score reports without mixing scales: Step 2 CCSSA Total Scores, Step 1 CBSSA EPC and pass probability, and Step 3 CCMSA limits.",
      h1: "NBME Score Conversion and Report Guide",
    },
  ],
  [
    "/nbme-calculator",
    {
      title: "NBME Self-Assessment Guide: Forms & Scores | NBMEcalc",
      description: "Learn the difference between CBSSA, CCSSA, and CCMSA forms, how to read an NBME score report, and when to use an independent score calculator.",
      h1: "NBME Self-Assessments: Forms, Scores, and Next Steps",
    },
  ],
  [
    "/step-1-predictor",
    {
      title: "Step 1 Predictor — Pass Probability Calculator (Free) | NBMEcalc",
      description: "Estimate Step 1 pass readiness from compatible UWSA and Free 120 inputs. For a current NBME CBSSA, use the probability and EPC range on the official report.",
      h1: "Step 1 Predictor: Calculate Your Pass Probability",
    },
  ],
  [
    "/step-2-predictor",
    {
      title: "Step 2 Score Predictor & CK Calculator | NBMEcalc",
      description: "Free Step 2 score predictor and CK calculator. Combine CCSSA forms 9-15, UWSA, Free 120, AMBOSS, and CMS inputs with a transparent planning range.",
      h1: "Step 2 Score Predictor and CK Calculator",
    },
  ],
  [
    "/step-3-predictor",
    {
      title: "NBME 6 & 7 Step 3 Score Conversion — Limits & Alternatives",
      description: "There is no official one-to-one CCMSA-to-Step 3 conversion. See the current 10-800 scale, why Forms 6 and 7 are not converted here, and what to use instead.",
      h1: "Step 3 Predictor: NBME 6 & 7 Conversion Limits",
    },
  ],
]);

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

function visibleText(value) {
  return decodeHtml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  if (sitemapUrls.length !== 30) {
    errors.push(`sitemap.xml contains ${sitemapUrls.length} URLs, expected 30`);
  }

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
  const contextualIncomingLinks = new Map(
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
    const h1 = visibleText(
      page.text.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1] || ""
    );
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
    const frozen = frozenSeo.get(pathname);
    if (frozen) {
      if (title !== frozen.title) {
        errors.push(`${pathname} frozen title changed from "${frozen.title}" to "${title}"`);
      }
      if (description !== frozen.description) {
        errors.push(`${pathname} frozen description changed`);
      }
      if (h1 !== frozen.h1) {
        errors.push(`${pathname} frozen H1 changed from "${frozen.h1}" to "${h1}"`);
      }
    }
    if (
      evidenceSensitivePaths.has(pathname) &&
      !page.text.includes('data-evidence-source="primary"')
    ) {
      errors.push(`${pathname} has no visible primary-source marker`);
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
        const parsed = JSON.parse(decodeHtml(jsonLd[1]));
        const nodes = parsed?.["@graph"] || [parsed];
        for (const node of nodes) {
          const types = Array.isArray(node?.["@type"])
            ? node["@type"]
            : [node?.["@type"]];
          if (!types.includes("Article")) continue;
          const authors = Array.isArray(node.author)
            ? node.author
            : [node.author];
          if (authors.some((author) => author?.["@type"] === "Person")) {
            errors.push(`${pathname} Article JSON-LD uses Person authorship`);
          }
        }
      } catch (error) {
        errors.push(`${pathname} has invalid JSON-LD: ${error.message}`);
      }
    }

    for (const anchorMatch of page.text.matchAll(/<a\b([^>]*)>/gi)) {
      const attributes = anchorMatch[1];
      const hrefMatch = attributes.match(/href="([^"]+)"/i);
      if (!hrefMatch) continue;
      const linkedPath = normalizePath(decodeHtml(hrefMatch[1]));
      if (linkedPath && incomingLinks.has(linkedPath) && linkedPath !== pathname) {
        incomingLinks.set(linkedPath, incomingLinks.get(linkedPath) + 1);
        if (/data-indexing-context="related"/i.test(attributes)) {
          contextualIncomingLinks.set(
            linkedPath,
            contextualIncomingLinks.get(linkedPath) + 1
          );
        }
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
  for (const pathname of remediatedPaths) {
    if (!contextualIncomingLinks.has(pathname)) {
      errors.push(`${pathname} is missing from the canonical sitemap`);
    } else if (contextualIncomingLinks.get(pathname) === 0) {
      errors.push(`${pathname} has no contextual incoming link from another sitemap page`);
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

  const productionDraft = await fetchText(
    "/blog/nbme-30-vs-31-vs-32-which-is-hardest",
    "manual"
  );
  if (productionDraft.response.status !== 404) {
    errors.push(
      `Production draft returned ${productionDraft.response.status}, expected 404`
    );
  }

  for (const pathname of ["/login", "/recover", "/verify"]) {
    const utilityPage = await fetchText(pathname, "manual");
    if (utilityPage.response.status !== 200) {
      errors.push(
        `${pathname} returned ${utilityPage.response.status}, expected 200`
      );
      continue;
    }
    const robotsMeta = firstMatch(
      utilityPage.text,
      /<meta\s+name="robots"\s+content="([\s\S]*?)"\s*\/?>/i
    );
    if (!robotsMeta.toLowerCase().includes("noindex")) {
      errors.push(`${pathname} is missing a noindex robots directive`);
    }
  }

  const home = await fetchText("/");
  if (home.response.headers.get("x-content-type-options") !== "nosniff") {
    errors.push("Homepage is missing X-Content-Type-Options: nosniff");
  }
  if (home.response.headers.get("x-frame-options") !== "DENY") {
    errors.push("Homepage is missing X-Frame-Options: DENY");
  }
  if (
    !home.response.headers
      .get("permissions-policy")
      ?.includes("geolocation=()")
  ) {
    errors.push("Homepage is missing the restricted Permissions-Policy");
  }

  const adsTxt = await fetchText("/ads.txt");
  if (!adsTxt.response.ok) errors.push("ads.txt does not return 200");
  if (!adsTxt.response.headers.get("content-type")?.startsWith("text/plain")) {
    errors.push("ads.txt is not served as text/plain");
  }
  if (/<(?:html|script)\b/i.test(adsTxt.text)) {
    errors.push("ads.txt unexpectedly contains HTML or script markup");
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
