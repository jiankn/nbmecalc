# AI Image Prompts

Each `.prompt.txt` file is the input that gets POSTed to the Evolink.ai Z Image Turbo API by `scripts/gen-images.mjs`.

## Generate

```bash
# From project root:
npm run gen:images           # missing only
npm run gen:images:force     # regenerate all
```

Output goes to `/public/images/*.jpg` (NOT here).

## Generation tools (recommended)

- **Midjourney** (best photorealism)
- **Flux Pro 1.1** (great consistency)
- **DALL-E 3 / GPT-4o** (built-in to ChatGPT Plus)
- **Ideogram** (best at avoiding stock-photo feel)

## Usage

1. Open the prompt file you want to generate
2. Copy the full prompt
3. Paste into your AI image tool
4. Download the result as `[name].jpg` (same name as the .prompt.txt)
5. The site will automatically show it (no code change needed)

## Required placeholders

- `hero-student-v1.jpg` — Hero main subject
- `how-it-works-study.jpg` — Section 8 left image
- `reviewer-1.jpg` — Internal Med MD headshot
- `reviewer-2.jpg` — Pediatrics resident headshot
- `reviewer-3.jpg` — M4 anonymous headshot
- `blog-cover-nbme.jpg` — NBME conversion guide
- `blog-cover-ci.jpg` — Confidence interval guide
- `blog-cover-cram.jpg` — 5-day cram strategy
- `excited-student.jpg` — Optional, for hero variation
