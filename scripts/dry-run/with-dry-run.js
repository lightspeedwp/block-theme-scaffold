const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
	getFilesWithMustacheVars,
	replaceMustacheVars,
} = require('./dry-run-config');

const rootDir = path.resolve(__dirname, '..');
const TARGET_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.scss']);

function filterTargetFiles(files) {
	return files.filter((relative) => {
		const ext = path.extname(relative).toLowerCase();
		return TARGET_EXTENSIONS.has(ext);
	});
}

function resolveFilePaths(files) {
	return files.map((relative) => path.join(rootDir, relative));
}

function replaceFiles(filePaths) {
	const backup = new Map();
	for (const absolutePath of filePaths) {
		const content = fs.readFileSync(absolutePath, 'utf8');
		backup.set(absolutePath, content);
		const replaced = replaceMustacheVars(content);
		fs.writeFileSync(absolutePath, replaced, 'utf8');
	}
	return backup;
}

function restoreFiles(backup) {
	for (const [filePath, original] of backup.entries()) {
		fs.writeFileSync(filePath, original, 'utf8');
	}
}

function runWithDryRun(command, args = [], options = {}) {
	if (!command) {
		throw new Error('Command is required for dry-run wrapper.');
	}

	const cwd = options.cwd || process.cwd();
	const pattern = options.pattern || '**/*.{js,jsx,ts,tsx,scss}';
	const rawFiles = getFilesWithMustacheVars(pattern);
	const targetFiles = resolveFilePaths(filterTargetFiles(rawFiles));

	if (targetFiles.length === 0) {
		console.warn('No mustache-containing JS/SCSS files detected.');
	} else {
		console.log(
			`Replacing placeholders in ${targetFiles.length} file(s)...`
		);
	}

	const backup = replaceFiles(targetFiles);
	let exitCode = 0;
	try {
		const spawnResult = spawnSync(command, args, {
			stdio: 'inherit',
			cwd,
			env: options.env ?? process.env,
			shell: options.shell ?? false,
		});
		exitCode = spawnResult.status ?? 0;
	} finally {
		restoreFiles(backup);
	}

	return exitCode;
}

function main() {
	const rawArgs = process.argv.slice(2);
	if (rawArgs.length === 0) {
		console.error(
			'Usage: node scripts/dry-run/with-dry-run.js <command> [args]'
		);
		process.exit(1);
	}

	const command = rawArgs[0];
	const args = rawArgs.slice(1);

	const exitCode = runWithDryRun(command, args);
	process.exit(exitCode);
}

if (require.main === module) {
	main();
}

module.exports = {
	runWithDryRun,
};
