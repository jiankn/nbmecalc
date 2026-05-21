#!/usr/bin/env node
/**
 * Generate the OAuth consent screen logo from the existing icon.svg.
 *
 * Google requires:
 *   - JPG / PNG / BMP, ≤ 1 MB
 *   - Square, recommended 120×120
 *
 * We export at 512×512 PNG so the image looks crisp regardless of how
 * Google's UI downscales it (consent screens have shifted between 72px
 * and 144px renderings over the years). 512 also matches the size most
 * stores expect, so the same file can be reused for press kits.
 *
 * Output: public/brand/oauth-logo.png
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE = path.join(ROOT, "public", "icon.svg");
const OUT_DIR = path.join(ROOT, "public", "brand");
const OUT_FILE = path.join(OUT_DIR, "oauth-logo.png");

const SIZE = 512; // master export

async function main() {
  const svg = await fs.readFile(SOURCE);
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Render the SVG at 512×512 with a transparent background.
  // (Some OAuth themes show the logo on light, some on dark — transparent
  // PNG with the dark rounded-square baked into the SVG works in both.)
  const buffer = await sharp(svg, { density: 512 })
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await fs.writeFile(OUT_FILE, buffer);

  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`✓ wrote ${path.relative(ROOT, OUT_FILE)} (${SIZE}×${SIZE}, ${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
