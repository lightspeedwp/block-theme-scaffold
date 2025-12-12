#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sectionsRegex = /## (?:See Also(?: [^\n]*)?|References)[\s\S]*?(?=\n## |$)/g;
const instructionLinkRegex = /_index\.instructions\.md/;
const ignoredDirs = ['node_modules', 'vendor', '.git', 'build', 'dist'];

function getMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.includes(entry.name)) {
        return [];
      }
      return getMarkdownFiles(resolved);
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [resolved];
    }
    return [];
  });
}

let violationsFound = false;

getMarkdownFiles(root).forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.match(sectionsRegex);

  if (sections) {
    sections.forEach((section) => {
      if (instructionLinkRegex.test(section)) {
        violationsFound = true;
        console.error(
          `❌ Violation in ${path.relative(process.cwd(), filePath)}: Found link to '.instructions.md' in a 'References' or 'See Also' section.`
        );
      }
    });
  }
});

if (violationsFound) {
  console.error('\nPlease remove these references to maintain a clean hierarchy.');
  process.exit(1);
}

console.log('✅ No invalid markdown references found.');
