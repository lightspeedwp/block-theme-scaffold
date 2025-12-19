/**
 * @file test-dry-run.js
 * @description Temporary replacement of mustache variables with test values for running tests.
 * @todo Add support for custom placeholder sets and dry-run modes.
 */
/**
 * scripts/test-dry-run.js
 *
 * Temporary replacement of mustache variables with test values for running tests.
 * This creates a temporary copy of test files with placeholders replaced,
 * runs Jest/PHPUnit, then cleans up.
 *
 * All operations are logged to logs/test/YYYY-MM-DD-test-dry-run.log
 *
 * Usage: node scripts/test-dry-run.js [jest|phpunit|all]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import shared test placeholders
const { replacePlaceholders } = require('../utils/placeholders');

/**
 * Simple file logger for test operations
 */

// Unified logger for dry-run: always logs to logs/dryrun-debug.log
const DRYRUN_LOG_PATH = path.resolve(__dirname, '../../logs/dryrun-debug.log');
function formatLogMessage(level, message) {
	const timestamp = new Date().toISOString();
	return `[${timestamp}] [${level}] [dry-run] ${message}`;
}
const logger = {
	info: (msg) => {
		try {
			fs.appendFileSync(
				DRYRUN_LOG_PATH,
				formatLogMessage('INFO', msg) + '\n'
			);
		} catch (err) {
			void err;
		}
	},
	debug: (msg) => {
		try {
			fs.appendFileSync(
				DRYRUN_LOG_PATH,
				formatLogMessage('DEBUG', msg) + '\n'
			);
		} catch (err) {
			void err;
		}
	},
	error: (msg) => {
		try {
			fs.appendFileSync(
				DRYRUN_LOG_PATH,
				formatLogMessage('ERROR', msg) + '\n'
			);
		} catch (err) {
			void err;
		}
	},
	warn: (msg) => {
		try {
			fs.appendFileSync(
				DRYRUN_LOG_PATH,
				formatLogMessage('WARN', msg) + '\n'
			);
		} catch (err) {
			void err;
		}
	},
};

const scaffoldDir = path.resolve(__dirname, '../..');
const tempDir = path.join(scaffoldDir, '.test-temp');

/**
 * Copy and replace files
 * @param src
 * @param dest
 */
function copyAndReplace(src, dest) {
	const stat = fs.statSync(src);

	if (stat.isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}

		const files = fs.readdirSync(src);
		for (const file of files) {
			// Skip certain directories
			if (
				[
					'node_modules',
					'vendor',
					'build',
					'.git',
					'.test-temp',
					'.dry-run-backup', // Prevent recursive backup copying
				].includes(file)
			) {
				continue;
			}

			const srcPath = path.join(src, file);
			const destPath = path.join(dest, file);
			copyAndReplace(srcPath, destPath);
		}
	} else {
		// Skip placeholder test files that don't have corresponding scripts
		const basename = path.basename(src);
		const placeholderTests = [
			'agent-script.test.js',
			'audit-frontmatter.test.js',
		];

		if (placeholderTests.includes(basename)) {
			logger.debug(`Skipping placeholder test: ${basename}`);
			return;
		}

		// Only process text files that might contain placeholders
		const ext = path.extname(src);
		const textExtensions = [
			'.js',
			'.json',
			'.php',
			'.css',
			'.md',
			'.txt',
			'.html',
		];

		if (textExtensions.includes(ext)) {
			let content = fs.readFileSync(src, 'utf8');
			content = replacePlaceholders(content);
			fs.writeFileSync(dest, content);
		} else {
			// Binary files - just copy
			fs.copyFileSync(src, dest);
		}
	}
}

/**
 * Clean up temporary directory
 */
function cleanup() {
	if (fs.existsSync(tempDir)) {
		fs.rmSync(tempDir, { recursive: true, force: true });
		logger.info('Cleaned up temporary files');
	}
}

/**
 * Main function
 */
function main() {
	logger.info('Starting test dry-run...');

	const args = process.argv.slice(2);
	const testType = args[0] || 'jest';

	try {
		// Clean up any existing temp directory
		logger.debug('Cleaning up any existing temporary files');
		cleanup();

		// Create temp directory and copy files
		logger.info('Creating temporary test files...');
		fs.mkdirSync(tempDir, { recursive: true });

		// Copy essential files for testing
		const filesToCopy = [
			'package.json',
			'composer.json',
			'composer.lock',
			'jest.config.js',
			'style.css',
			'theme.json',
			'src',
			'inc',
			'patterns',
			'parts',
			'templates',
			'styles',
			'tests',
			'scripts',
			'.github/tests',
			'.github/prompts',
			'.github/agents',
			'.eslintrc.js',
			'.stylelintrc.js',
			'phpcs.xml',
			'phpunit.xml',
		];

		for (const file of filesToCopy) {
			const srcPath = path.join(scaffoldDir, file);
			const destPath = path.join(tempDir, file);

			if (fs.existsSync(srcPath)) {
				copyAndReplace(srcPath, destPath);
				logger.debug(`Copied: ${file}`);
			}
		}

		logger.info('Temporary files created');

		// Run tests based on type
		let success = true;

		if (testType === 'jest' || testType === 'all') {
			logger.info('JavaScript tests started (Jest)');
			const jestConfigPath = path.join(tempDir, 'jest.config.js');
			const jestCommand = `npx jest scripts/dry-run/__tests__ --config "${jestConfigPath}" --testPathIgnorePatterns="^$"`;
			try {
				execSync(jestCommand, {
					cwd: tempDir,
					stdio: 'inherit',
				});
				logger.info('JavaScript tests: ✓ passed');
			} catch (error) {
				logger.error('JavaScript tests: ✗ failed');
				success = false;
			}

			const filesToCheck = [
				'.github/prompts/create-release-scaffold.prompt.md',
				'.github/prompts/create-release.prompt.md',
				'.github/agents/release.agent.md',
				'.github/agents/release-scaffold.agent.md',
				'.github/agents/generate-theme.agent.md',
				'scripts/agents/generate-theme.questions.js',
				'scripts/agents/generate-theme.agent.js',
				'scripts/agents/release-scaffold.questions.js',
				'scripts/agents/release-scaffold.agent.js',
				'scripts/agents/release.questions.js',
				'scripts/agents/release.agent.js',
			];

			filesToCheck.forEach((relPath) => {
				const absPath = path.join(tempDir, relPath);
				if (fs.existsSync(absPath)) {
					logger.info(`File exists: ${relPath}`);
					if (relPath.endsWith('.js')) {
						try {
							require(absPath);
							logger.info(`JS file loads: ${relPath}`);
						} catch (e) {
							logger.error(
								`JS file failed to load: ${relPath} - ${e.message}`
							);
							success = false;
						}
					}
				} else {
					logger.error(`File missing: ${relPath}`);
					success = false;
				}
			});
		}

		if (testType === 'phpunit' || testType === 'all') {
			logger.info('PHP tests started (PHPUnit)');
			const composerJsonPath = path.join(tempDir, 'composer.json');
			let composerInstalled = false;

			if (fs.existsSync(composerJsonPath)) {
				const installCommand =
					'composer install --no-interaction --prefer-dist --ansi --no-progress';
				try {
					logger.info(
						'Installing PHP dependencies (composer install)'
					);
					execSync(installCommand, {
						cwd: tempDir,
						stdio: 'inherit',
					});
					logger.info('PHP dependencies installed');
					composerInstalled = true;
				} catch (error) {
					logger.error('Composer install: ✗ failed');
					success = false;
				}
			} else {
				logger.error('composer.json missing in temporary directory');
				success = false;
			}

			if (composerInstalled) {
				try {
					execSync('composer run test', {
						cwd: tempDir,
						stdio: 'inherit',
					});
					logger.info('PHP tests: ✓ passed');
				} catch (error) {
					logger.error('PHP tests: ✗ failed');
					success = false;
				}
			}
		}

		process.exit(success ? 0 : 1);
	} catch (error) {
		logger.error(`Error during test dry-run: ${error.message}`);
		process.exit(1);
	} finally {
		// Always clean up
		logger.debug('Cleaning up temporary files');
		cleanup();
	}
}

// Handle cleanup on exit
process.on('exit', () => {
	logger.debug('Process exit - cleanup');
	cleanup();
});
process.on('SIGINT', () => {
	logger.warn('Process interrupted (SIGINT) - cleanup');
	cleanup();
	process.exit(130);
});
process.on('SIGTERM', () => {
	logger.warn('Process terminated (SIGTERM) - cleanup');
	cleanup();
	process.exit(143);
});

main();
