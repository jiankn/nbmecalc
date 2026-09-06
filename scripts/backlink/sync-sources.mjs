#!/usr/bin/env node
// Clone or refresh the upstream backlink datasets into .backlink-cache/ (gitignored).
//   node scripts/backlink/sync-sources.mjs

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CACHE = resolve(process.cwd(), '.backlink-cache');

const SOURCES = [
  {
    dir: 'backlink_skills',
    url: 'https://github.com/flaqai/backlink_skills.git',
    why: '743-entry free directory list + the SPD submission skills',
  },
  {
    dir: 'ai-tools-radar',
    url: 'https://github.com/ppop123/ai-tools-radar.git',
    why: '12k dofollow source pages + 21k AI-tool traffic table (63MB, shallow clone)',
  },
];

mkdirSync(CACHE, { recursive: true });

for (const src of SOURCES) {
  const path = resolve(CACHE, src.dir);
  try {
    if (existsSync(path)) {
      execFileSync('git', ['-C', path, 'pull', '--ff-only', '--depth', '1'], { stdio: 'inherit' });
      console.log(`updated ${src.dir}  (${src.why})`);
    } else {
      execFileSync('git', ['clone', '--depth', '1', src.url, path], { stdio: 'inherit' });
      console.log(`cloned  ${src.dir}  (${src.why})`);
    }
  } catch (err) {
    console.error(`FAILED  ${src.dir}: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log(`\ncache: ${CACHE}`);
