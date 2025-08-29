#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'coverage', 'playwright-report', 'test-results'
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

function isMarkdown(file) {
  return file.endsWith('.md') || file.endsWith('.mdx');
}

function isExternal(href) {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

async function validateMarkdown(file) {
  const text = await fs.readFile(file, 'utf8');
  const dir = path.dirname(file);
  const errors = [];
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let m;
  while ((m = linkRe.exec(text)) != null) {
    const href = m[2].trim();
    if (!href || isExternal(href) || href.startsWith('#')) continue;
    const [p] = href.split('#');
    // Allow absolute site paths, skip for now
    if (p.startsWith('/')) continue;
    const resolved = path.resolve(dir, p);
    try {
      const stat = await fs.stat(resolved);
      if (!stat.isFile()) {
        errors.push({ type: 'not-a-file', href, file });
      }
    } catch {
      errors.push({ type: 'missing', href, file });
    }
  }
  return errors;
}

async function main() {
  const root = process.cwd();
  const allErrors = [];
  for await (const file of walk(root)) {
    if (!isMarkdown(file)) continue;
    const errs = await validateMarkdown(file);
    for (const e of errs) allErrors.push(e);
  }
  if (allErrors.length) {
    console.error('Broken/invalid markdown links found:');
    for (const e of allErrors) {
      console.error(` - ${path.relative(root, e.file)} -> ${e.href} (${e.type})`);
    }
    process.exit(1);
  } else {
    console.log('All markdown links look good.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

