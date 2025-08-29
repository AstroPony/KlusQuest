#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'coverage', 'playwright-report', 'test-results'
]);

const ALLOWED_EXTS = new Set([
  '.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.sass',
  '.html', '.txt', '.yml', '.yaml', '.toml', '.mjs', '.cjs', '.env', '.env.local', '.env.example'
]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function isTextFile(file) {
  const ext = path.extname(file);
  return ALLOWED_EXTS.has(ext) || /\.env(\..*)?$/.test(path.basename(file));
}

async function main() {
  const root = process.cwd();
  const bad = [];
  for await (const file of walk(root)) {
    if (!isTextFile(file)) continue;
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }
    if (content.includes('\uFFFD')) {
      bad.push(path.relative(root, file));
    }
  }
  if (bad.length) {
    console.error('Found mojibake (U+FFFD) in files:');
    for (const f of bad) console.error(' - ' + f);
    process.exit(1);
  } else {
    console.log('No mojibake found.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

