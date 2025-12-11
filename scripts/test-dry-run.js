#!/usr/bin/env node

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
const { replacePlaceholders } = require('./test-placeholders');

/**
 * Simple file logger for test operations
 */
class TestLogger {
	constructor() {
		this.logDir = path.resolve(__dirname, '../logs/test');
		this.ensureLogDir();
		this.logPath = this.getLogPath();
	}

	ensureLogDir() {
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir, { recursive: true });
		}
	}

	getLogPath() {
		const date = new Date().toISOString().split('T')[0];
		return path.join(this.logDir, `${date}-test-dry-run.log`);
	}

	formatMessage(level, message) {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level}] [test-dry-run] ${message}`;
	}

	write(level, message) {
		const formatted = this.formatMessage(level, message);
		try {
			fs.appendFileSync(this.logPath, formatted + '\n');
		} catch (error) {
			// Silently fail if cannot write to log
		}
		console.log(formatted);
	}

	info(msg) {
		this.write('INFO', msg);
	}
	debug(msg) {
		this.write('DEBUG', msg);
	}
	error(msg) {
		this.write('ERROR', msg);
	}
	warn(msg) {
		this.write('WARN', msg);
	}
}

const logger = new TestLogger();

const scaffoldDir = path.resolve(__dirname, '..');
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
			'.eslintrc.js',
			'.stylelintrc.js',
			'phpcs.xml',
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
			try {
				execSync('npm run test:scripts', {
					cwd: tempDir,
					stdio: 'inherit',
				});
				logger.info('JavaScript tests: ✓ passed');
			} catch (error) {
				logger.error('JavaScript tests: ✗ failed');
				success = false;
			}
		}

		if (testType === 'phpunit' || testType === 'all') {
			logger.info('PHP tests started (PHPUnit)');
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

		logger.info('Test dry-run complete');
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
