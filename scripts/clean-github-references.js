#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sectionsRegex = /^(## (?:See Also(?: [^\n]*)?|References))[\s\S]*?(?=\n## |$)/gm;

function getMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getMarkdownFiles(resolved);
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [resolved];
    }
    return [];
  });
}

getMarkdownFiles(root).forEach((filePath) => {
  const original = fs.readFileSync(filePath, 'utf8');
  const cleaned = original.replace(sectionsRegex, '').replace(/\n{3,}/g, '\n\n');

  if (cleaned.trim() !== original.trim()) {
    fs.writeFileSync(filePath, `${cleaned.trim()}\n`);
    console.log(`Cleaned sections from ${path.relative(process.cwd(), filePath)}`);
  }
});
