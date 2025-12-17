/**
 * @file test-dry-run-php.js
 * @description Dry-run for PHP/SCF tests with mustache placeholder replacement.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { replacePlaceholders } = require('../utils/placeholders');

const scaffoldDir = path.resolve(__dirname, '..');
const tempDir = path.join(scaffoldDir, '.test-temp-php');

function copyAndReplace(src, dest) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
		const files = fs.readdirSync(src);
		for (const file of files) {
			if ([
				'node_modules', 'vendor', 'build', '.git', '.test-temp-php', '.dry-run-backup',
			].includes(file)) continue;
			copyAndReplace(path.join(src, file), path.join(dest, file));
		}
	} else {
		const ext = path.extname(src);
		const textExtensions = ['.js', '.json', '.php', '.css', '.md', '.txt', '.html'];
		if (textExtensions.includes(ext)) {
			let content = fs.readFileSync(src, 'utf8');
			content = replacePlaceholders(content);
			fs.writeFileSync(dest, content);
		} else {
			fs.copyFileSync(src, dest);
		}
	}
}

function cleanup() {
	if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
}

function main() {
	cleanup();
	fs.mkdirSync(tempDir, { recursive: true });
	const filesToCopy = [
		'package.json', 'style.css', 'theme.json', 'src', 'inc', 'patterns', 'parts', 'templates', 'styles', 'tests', 'scripts', '.eslintrc.js', '.stylelintrc.js', 'phpcs.xml',
	];
	for (const file of filesToCopy) {
		const srcPath = path.join(scaffoldDir, file);
		const destPath = path.join(tempDir, file);
		if (fs.existsSync(srcPath)) copyAndReplace(srcPath, destPath);
	}
	try {
		execSync('composer run test', { cwd: tempDir, stdio: 'inherit' });
	} catch (error) {
		process.exit(1);
	}
	cleanup();
}

main();
