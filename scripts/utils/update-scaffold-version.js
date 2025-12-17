/**
 * Update version number for scaffold meta files only.
 *
 * Usage: node scripts/update-scaffold-version.js <new-version>
 *
 * Only updates: VERSION, package.json, composer.json
 * Does NOT touch style.css or any output-theme files.
 */

const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

function log(level, message) {
  process.stdout.write(`[${level}] ${message}\n`);
}

if (!newVersion) {
  log('ERROR', 'Usage: node scripts/update-scaffold-version.js <new-version>');
  process.exit(1);
}

const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!semverRegex.test(newVersion)) {
  log('ERROR', 'Invalid version format. Use semantic versioning (e.g., 1.0.0)');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '../..');

const filesToUpdate = [
  {
    file: path.join(rootDir, 'VERSION'),
    update: () => newVersion + '\n',
  },
  {
    file: path.join(rootDir, 'package.json'),
    update: (content) => content.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`),
  },
  {
    file: path.join(rootDir, 'composer.json'),
    update: (content) => content.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`),
  },
];

log('INFO', `Updating scaffold meta files to version ${newVersion}...`);

filesToUpdate.forEach(({ file, update }) => {
  if (!fs.existsSync(file)) {
    log('WARN', `File not found: ${file}`);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const updated = update(content);
  if (content !== updated) {
    fs.writeFileSync(file, updated);
    log('INFO', `Updated: ${path.relative(rootDir, file)}`);
  } else {
    log('INFO', `No changes: ${path.relative(rootDir, file)}`);
  }
});

log('SUCCESS', 'Scaffold version update complete!');
