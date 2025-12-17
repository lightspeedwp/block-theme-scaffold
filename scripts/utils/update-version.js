/**
 * Update version number across all plugin files.
 *
 * Usage: node scripts/update-version.js <new-version>
 *
 * @package
 */

const fs = require( 'fs' );
const path = require( 'path' );


const newVersion = process.argv[2];
function log(level, message) {
	process.stdout.write(`[${level}] ${message}\n`);
}
if (!newVersion) {
	log('ERROR', 'Usage: node scripts/update-version.js <new-version>');
	process.exit(1);
}
const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!semverRegex.test(newVersion)) {
	log('ERROR', 'Invalid version format. Use semantic versioning (e.g., 1.0.0)');
	process.exit(1);
}
const rootDir = path.resolve(__dirname, '../..');


const filesToUpdate = [
	// Scaffold and generated theme meta files
	{
		file: path.join(rootDir, 'VERSION'),
		update: () => newVersion + '\n',
		label: 'VERSION',
	},
	{
		file: path.join(rootDir, 'package.json'),
		update: (content) => content.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`),
		label: 'package.json',
	},
	{
		file: path.join(rootDir, 'composer.json'),
		update: (content) => content.replace(/"version":\s*"[^"]+"/, `"version": "${newVersion}"`),
		label: 'composer.json',
	},
	// For generated themes: style.css header
	{
		file: path.join(rootDir, 'style.css'),
		update: (content) => content.replace(/Version:\s*[^\n]+/, `Version:     ${newVersion}`),
		label: 'style.css',
	},
];

log('INFO', `Updating version to ${newVersion}...`);
filesToUpdate.forEach(({ file, update, label }) => {
	if (!fs.existsSync(file)) {
		log('WARN', `File not found: ${file}`);
		return;
	}
	const content = fs.readFileSync(file, 'utf8');
	// Skip files with mustache placeholders
	if (/\{\{.*\}\}/.test(content)) {
		log('SKIP', `${label} contains mustache placeholders, skipping.`);
		return;
	}
	const updated = update(content);
	if (content !== updated) {
		fs.writeFileSync(file, updated);
		log('INFO', `Updated: ${path.relative(rootDir, file)}`);
	} else {
		log('INFO', `No changes: ${path.relative(rootDir, file)}`);
	}
});

// Output-theme meta files (release.agent.md, etc.)
const outputMetaFiles = [
	'.github/agents/release.agent.md',
	'.github/agents/release.agent.js',
	'.github/agents/release-scaffold.agent.md',
	'.github/agents/release-scaffold.agent.js',
	'.github/workflows/release.yml',
	'.github/workflows/release-scaffold.yml',
	'docs/RELEASE_PROCESS.md',
	'docs/RELEASE_PROCESS_SCAFFOLD.md',
];
outputMetaFiles.forEach((relPath) => {
	const file = path.join(rootDir, relPath);
	if (!fs.existsSync(file)) return;
	const content = fs.readFileSync(file, 'utf8');
	// Only update if no mustache placeholders
	if (/\{\{.*\}\}/.test(content)) {
		log('SKIP', `${relPath} contains mustache placeholders, skipping.`);
		return;
	}
	// Try to update version in YAML frontmatter or version fields
	let updated = content.replace(/version:\s*"[^"]+"/i, `version: "${newVersion}"`);
	updated = updated.replace(/last_updated:\s*"[^"]+"/i, `last_updated: "${new Date().toISOString().slice(0,10)}"`);
	if (content !== updated) {
		fs.writeFileSync(file, updated);
		log('INFO', `Updated: ${relPath}`);
	} else {
		log('INFO', `No changes: ${relPath}`);
	}
});

log('SUCCESS', 'Version update complete!');
