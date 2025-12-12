#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const instructionsDir = path.resolve(__dirname, '../.github/instructions');
const allowedPatterns = ['../custom-instructions.md', './_index.instructions.md'];
const referenceFields = ['references', 'related_files', 'relatedFiles', 'see_also', 'seeAlso', 'depends_on', 'dependsOn'];
const autoSectionHeader = '## See Also (Auto-generated references)';
const autoSectionRegex = /## See Also \(Auto-generated references\)[\s\S]*?(?=\n##|$)/g;

function isAllowed(ref) {
  return allowedPatterns.some((pattern) => ref.includes(pattern));
}

function buildAutoSection(resources) {
  const list = resources
    .map((ref) => `- [${path.basename(ref)}](${ref})`)
    .join('\n');

  return `${autoSectionHeader}\n\nRelated instruction files:\n${list}`;
}

function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const references = [];

  referenceFields.forEach((field) => {
    const value = parsed.data[field];

    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      references.push(...value);
    } else if (typeof value === 'string') {
      references.push(value);
    }
  });

  if (!references.length) {
    return;
  }

  const allowed = references.filter(isAllowed);
  const disallowed = references.filter((ref) => !isAllowed(ref));
  const uniqueAllowed = [...new Set(allowed)];
  const uniqueDisallowed = [...new Set(disallowed)];

  if (!uniqueDisallowed.length) {
    return; // Nothing to move
  }

  if (uniqueAllowed.length) {
    parsed.data.references = uniqueAllowed;
  } else {
    delete parsed.data.references;
  }

  const trimmedContent = parsed.content.trim();
  const bodyWithoutAuto = trimmedContent.replace(autoSectionRegex, '').trim();
  const updatedBody = `${bodyWithoutAuto}\n\n${buildAutoSection(uniqueDisallowed)}`.trim();
  const newRaw = matter.stringify(updatedBody, parsed.data);

  if (newRaw.trim() !== raw.trim()) {
    fs.writeFileSync(filePath, `${newRaw.trim()}\n`);
    console.log(`Fixed references for ${path.relative(process.cwd(), filePath)}`);
  }
}

function main() {
  const entries = fs.readdirSync(instructionsDir, { withFileTypes: true });
  const targets = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.instructions.md'))
    .map((entry) => path.join(instructionsDir, entry.name));

  targets.forEach(fixFile);
}

main();
