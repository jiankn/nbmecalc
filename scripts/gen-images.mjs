#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * gen-images.mjs
 *
 * Generates all AI images defined in scripts/prompts.config.mjs
 * using the Evolink.ai Z Image Turbo API.
 *
 * Usage:
 *   node scripts/gen-images.mjs                  # generate all missing
 *   node scripts/gen-images.mjs --force          # regenerate everything
 *   node scripts/gen-images.mjs reviewer-1       # only one name
 *   node scripts/gen-images.mjs --force blog-cover-nbme
 *
 * Requires .env.local with EVOLINK_API_KEY=sk-...
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prompts } from "./prompts.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROMPT_DIR = path.join(ROOT, "public", "placeholders");
const OUT_DIR = path.join(ROOT, "public", "images");

const API_URL = "https://api.evolink.ai/v1/images/generations";
const TASK_URL = (id) => `https://api.evolink.ai/v1/tasks/${id}`;
const MODEL = "z-image-turbo";

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90_000;
const MAX_RETRIES = 2;

// ---------- ANSI colors (no deps) ----------
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ---------- minimal .env.local loader (no deps) ----------
async function loadEnv() {
  const envPaths = [
    path.join(ROOT, ".env.local"),
    path.join(ROOT, "..", ".env.local"),
  ];
  for (const envPath of envPaths) {
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
    return;
  } catch {
    // Try next .env.local location, then rely on existing process.env
  }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postJSON(url, body, apiKey) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON ${res.status} response: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || text;
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return json;
}

async function getJSON(url, apiKey) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON ${res.status} response: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || text;
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }
  return json;
}

async function createTask(prompt, size, apiKey) {
  return postJSON(
    API_URL,
    { model: MODEL, prompt, size },
    apiKey
  );
}

async function pollTask(taskId, apiKey, name) {
  const start = Date.now();
  let lastProgress = -1;
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const t = await getJSON(TASK_URL(taskId), apiKey);
    if (typeof t.progress === "number" && t.progress !== lastProgress) {
      process.stdout.write(`\r  ${c.dim(`${name}  →  ${t.status} ${t.progress}%   `)}`);
      lastProgress = t.progress;
    }
    if (t.status === "completed") {
      process.stdout.write("\n");
      const url = Array.isArray(t.results) ? t.results[0] : null;
      if (!url) throw new Error("Task completed but no image URL");
      return url;
    }
    if (t.status === "failed" || t.status === "cancelled") {
      process.stdout.write("\n");
      const errMsg = t?.error?.message || t.status;
      throw new Error(errMsg);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`Task ${taskId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}

async function downloadImage(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(entry, apiKey, { force }) {
  const promptPath = path.join(PROMPT_DIR, entry.promptFile);
  const outPath = path.join(OUT_DIR, `${entry.name}.jpg`);

  if (!force && (await pathExists(outPath))) {
    console.log(`  ${c.dim("skip")}  ${entry.name}.jpg ${c.dim("(exists)")}`);
    return { name: entry.name, status: "skipped" };
  }

  let prompt;
  try {
    prompt = (await fs.readFile(promptPath, "utf8")).trim();
  } catch {
    console.log(
      `  ${c.yellow("warn")}  ${entry.name}  prompt file missing: ${entry.promptFile}`
    );
    return { name: entry.name, status: "missing-prompt" };
  }
  if (!prompt) {
    console.log(`  ${c.yellow("warn")}  ${entry.name}  prompt file empty`);
    return { name: entry.name, status: "empty-prompt" };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      console.log(`  ${c.cyan("gen ")}  ${entry.name}  (${entry.size})`);
      const task = await createTask(prompt, entry.size, apiKey);
      const imageUrl = await pollTask(task.id, apiKey, entry.name);
      const bytes = await downloadImage(imageUrl, outPath);
      console.log(
        `  ${c.green("ok  ")}  ${entry.name}.jpg ${c.dim(
          `(${(bytes / 1024).toFixed(0)} KB)`
        )}`
      );
      return { name: entry.name, status: "ok" };
    } catch (err) {
      const msg = err?.message || String(err);
      if (attempt > MAX_RETRIES) {
        console.log(`  ${c.red("fail")}  ${entry.name}  ${msg}`);
        return { name: entry.name, status: "failed", error: msg };
      }
      console.log(
        `  ${c.yellow("retry")} ${entry.name}  attempt ${attempt}/${MAX_RETRIES} — ${msg}`
      );
      await sleep(2000 * attempt);
    }
  }
  return { name: entry.name, status: "failed" };
}

async function main() {
  await loadEnv();
  const apiKey = process.env.EVOLINK_API_KEY;
  if (!apiKey) {
    console.error(
      c.red(
        "\n[error] EVOLINK_API_KEY is not set. Create .env.local from .env.example and put your key.\n"
      )
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const filters = args.filter((a) => !a.startsWith("--"));

  await fs.mkdir(OUT_DIR, { recursive: true });

  let targets = prompts;
  if (filters.length > 0) {
    targets = prompts.filter((p) => filters.includes(p.name));
    if (targets.length === 0) {
      console.error(c.red(`No prompt matched: ${filters.join(", ")}`));
      console.log("\nAvailable names:");
      for (const p of prompts) console.log(`  - ${p.name}`);
      process.exit(1);
    }
  }

  console.log(
    c.bold(
      `\n  Z Image Turbo — generating ${targets.length} image${
        targets.length === 1 ? "" : "s"
      }${force ? " (force)" : ""}\n`
    )
  );

  const results = [];
  for (const entry of targets) {
    const r = await generateOne(entry, apiKey, { force });
    results.push(r);
  }

  const summary = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  console.log("\n  " + c.bold("Summary:"));
  for (const [k, v] of Object.entries(summary)) {
    const color =
      k === "ok"
        ? c.green
        : k === "failed" || k.includes("missing")
          ? c.red
          : c.dim;
    console.log(`    ${color(k.padEnd(16))} ${v}`);
  }
  console.log("");

  const anyFail = results.some((r) => r.status === "failed");
  process.exit(anyFail ? 2 : 0);
}

main().catch((err) => {
  console.error(c.red(`\n[fatal] ${err?.stack || err}\n`));
  process.exit(1);
});
