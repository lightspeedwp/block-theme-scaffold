const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { performance } = require('perf_hooks');
const readline = require('readline');
const FileLogger = require('../utils/logger');

const projectRoot = path.resolve(__dirname, '../../'); // Assumes script is in a subdirectory of root

const IGNORE_PATTERNS = [
	'node_modules',
	'vendor',
	'.git',
	'build',
	'dist',
	'coverage',
	'.test-temp',
	'output-theme',
	'composer.lock',
	'package-lock.json',
];

/**
 * Calculates the SHA256 hash of a file.
 * @param {string} filePath - The path to the file.
 * @returns {string} The hex-encoded hash of the file.
 */
function getFileHash(filePath) {
	try {
		const fileBuffer = fs.readFileSync(filePath);
		const hashSum = crypto.createHash('sha256');
		hashSum.update(fileBuffer);
		return hashSum.digest('hex');
	} catch (error) {
		console.warn(`\n⚠️  Could not read file: ${filePath}. Skipping.`);
		return null;
	}
}

/**
 * Recursively finds all files in a directory, respecting ignore patterns.
 * @param {string} dir - The directory to scan.
 * @param {string[]} fileList - The list of files found so far.
 * @returns {string[]} The updated list of files.
 */
function getAllFiles(dir, fileList = []) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (IGNORE_PATTERNS.some((pattern) => fullPath.includes(pattern))) {
			continue;
		}

		if (entry.isDirectory()) {
			getAllFiles(fullPath, fileList);
		} else if (entry.isFile()) {
			fileList.push(fullPath);
		}
	}
	return fileList;
}

/**
 * Finds duplicate files in a given directory path.
 * @param {string} rootDir - The root directory to start scanning from.
 */
async function findDuplicates(rootDir) {
	const logger = new FileLogger('find-duplicates', 'agents');
	const shouldDelete = process.argv.includes('--delete');
	const forceDelete = process.argv.includes('--force');
	const startTime = performance.now();

	logger.info(`🔍 Scanning for duplicate files in ${rootDir}...`);
	if (shouldDelete) {
		logger.warn(
			'\n⚠️  --delete flag is enabled. Duplicate files will be removed, keeping one copy.'
		);
		if (forceDelete) {
			logger.warn(
				'⚡ --force flag detected. Deletion will be automatic.'
			);
		}
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const ask = (question) =>
		new Promise((resolve) => rl.question(question, resolve));

	const allFiles = getAllFiles(rootDir);
	const hashes = new Map();

	allFiles.forEach((filePath) => {
		const hash = getFileHash(filePath);
		if (hash) {
			const relativePath = path.relative(rootDir, filePath);
			if (!hashes.has(hash)) {
				hashes.set(hash, []);
			}
			hashes.get(hash).push(relativePath);
		}
	});

	let duplicatesFound = false;
	logger.info('\n--- Duplicate File Report ---');
	for (const [hash, files] of hashes.entries()) {
		if (files.length > 1) {
			duplicatesFound = true;
			const [fileToKeep, ...filesToDelete] = files;

			logger.info(
				`\n[!] Found ${files.length} identical files (hash: ${hash.substring(0, 12)}...):`
			);
			logger.info(`  - ✅ Keeping: ${fileToKeep}`);
			filesToDelete.forEach((file) =>
				logger.warn(`  - 🗑️  To be deleted: ${file}`)
			);

			if (shouldDelete) {
				let confirmed = forceDelete;
				if (!forceDelete) {
					const answer = await ask(
						'  -> Proceed with deletion? (y/N): '
					);
					confirmed = answer.toLowerCase() === 'y';
				}

				if (confirmed) {
					filesToDelete.forEach((file) => {
						try {
							fs.unlinkSync(path.join(rootDir, file));
							logger.info(`    -> Successfully deleted ${file}`);
						} catch (err) {
							logger.error(
								`    -> ❌ Error deleting ${file}: ${err.message}`
							);
						}
					});
				} else {
					logger.info('  -> Deletion skipped.');
				}
			}
		}
	}

	rl.close();

	if (!duplicatesFound) {
		logger.info('\n✅ No duplicate files found.');
	}

	if (shouldDelete && !duplicatesFound) {
		logger.info('No duplicates to delete.');
	} else if (shouldDelete) {
		logger.info('\n✅ Deletion process complete.');
	}

	const endTime = performance.now();
	logger.info(
		`\n✨ Scan complete in ${((endTime - startTime) / 1000).toFixed(2)}s. Found ${allFiles.length} files.`
	);
	await logger.save();
}

(async () => {
	await findDuplicates(projectRoot);
})().catch((err) => {
	console.error('An unexpected error occurred:', err);
	process.exit(1);
});
