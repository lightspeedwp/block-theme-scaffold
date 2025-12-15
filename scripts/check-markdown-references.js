#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirs = new Set([
  '.git',
  'node_modules',
  'vendor',
  'tmp',
  'public',
  'dist',
  'build',
  '.archive',
]);
const headingPattern = /^## (See Also|References)\b/i;

/**
 * List markdown files recursively, skipping ignored directories.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function listMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        return [];
      }
      return listMarkdownFiles(resolved);
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [resolved];
    }

    return [];
  });
}

let findings = 0;

listMarkdownFiles(root).forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let inHeading = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (headingPattern.test(trimmed)) {
      inHeading = true;
      continue;
    }

    if (inHeading && trimmed.startsWith('## ')) {
      inHeading = false;
    }

    if (inHeading && line.includes('.instructions.md')) {
      findings += 1;
      const relativePath = path.relative(process.cwd(), filePath);
      // console.log(`${relativePath}:${i + 1}: ${trimmed}`);
    }
  }
});

if (findings > 0) {
  // console.error(
  //   `Found ${findings} Markdown reference link(s) to .instructions.md under References/See Also headings.`
  // );
  process.exitCode = 1;
} else {
  // console.log('✅ No invalid markdown references found.');
}
