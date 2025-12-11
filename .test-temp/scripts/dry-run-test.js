#!/usr/bin/env node

/**
 * Dry Run Test Runner for Block Theme Scaffold
 *
 * Temporarily replaces mustache variables with test values,
 * runs tests/linting, then restores original files.
 *
 * Usage:
 *   node scripts/dry-run-test.js                    # Run default commands
 *   node scripts/dry-run-test.js lint:js lint:css   # Run specific commands
 *   npm run dry-run:test                            # Run via npm script
 *
 * @package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import test placeholders from scripts directory
const { replacePlaceholders } = require('./test-placeholders');

// Create logs directory
const logsDir = path.resolve(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = path.join(logsDir, `dry-run-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

/**
 * Log function
 * @param level
 * @param message
 */
function dryRunLog(level, message) {
	const entry = `[${new Date().toISOString()}] [${level}] ${message}\n`;
	logStream.write(entry);
	const colorCode = colors[level.toLowerCase()] || colors.reset;
	console.log(`${colorCode}${entry.trim()}${colors.reset}`);
}

// ANSI color codes
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	error: '\x1b[31m',
	warn: '\x1b[33m',
	info: '\x1b[36m',
	debug: '\x1b[90m',
};

/**
 * Log with color
 * @param message
 * @param color
 */
function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Get files containing mustache variables
 */
function getTargetFiles() {
	const patterns = [
		'src/**/*.{js,jsx}',
		'src/**/*.scss',
		'inc/**/*.php',
		'tests/**/*.{js,php}',
		'patterns/**/*.php',
		'parts/**/*.html',
		'templates/**/*.html',
		'*.php',
		'style.css',
		'package.json',
		'composer.json',
		'theme.json',
	];

	const files = [];
	const baseDir = path.resolve(__dirname, '..');

	function scanDirectory(dir, pattern) {
		if (!fs.existsSync(dir)) {
			return;
		}

		const items = fs.readdirSync(dir);

		for (const item of items) {
			// Skip excluded directories
			if (
				[
					'node_modules',
					'vendor',
					'build',
					'.git',
					'bin',
					'scripts',
				].includes(item)
			) {
				continue;
			}

			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				scanDirectory(fullPath, pattern);
			} else if (stat.isFile()) {
				// Check if file matches extension patterns
				const ext = path.extname(item);
				if (
					[
						'.js',
						'.jsx',
						'.php',
						'.scss',
						'.css',
						'.html',
						'.json',
					].includes(ext)
				) {
					try {
						const content = fs.readFileSync(fullPath, 'utf8');
						if (/\{\{[a-z_]+\}\}/i.test(content)) {
							files.push(fullPath);
						}
					} catch (error) {
						// Skip files that can't be read
					}
				}
			}
		}
	}

	// Scan directories
	scanDirectory(baseDir, patterns);

	return files;
}

/**
 * Create backup of files
 * @param files
 */
function backupFiles(files) {
	const backupDir = path.resolve(__dirname, '..', '.dry-run-backup');

	if (!fs.existsSync(backupDir)) {
		fs.mkdirSync(backupDir, { recursive: true });
	}

	const backupMap = {};

	files.forEach((filePath) => {
		const relativePath = path.relative(
			path.resolve(__dirname, '..'),
			filePath
		);
		const backupPath = path.join(backupDir, relativePath);
		const backupDirPath = path.dirname(backupPath);

		if (!fs.existsSync(backupDirPath)) {
			fs.mkdirSync(backupDirPath, { recursive: true });
		}

		fs.copyFileSync(filePath, backupPath);
		backupMap[filePath] = backupPath;
	});

	return backupMap;
}

/**
 * Replace mustache variables in files
 * @param files
 */
function replaceInFiles(files) {
	files.forEach((filePath) => {
		const content = fs.readFileSync(filePath, 'utf8');
		const replaced = replacePlaceholders(content);
		fs.writeFileSync(filePath, replaced, 'utf8');
	});
}

/**
 * Restore files from backup
 * @param backupMap
 */
function restoreFiles(backupMap) {
	Object.entries(backupMap).forEach(([originalPath, backupPath]) => {
		if (fs.existsSync(backupPath)) {
			fs.copyFileSync(backupPath, originalPath);
		}
	});

	// Clean up backup directory
	const backupDir = path.resolve(__dirname, '..', '.dry-run-backup');
	if (fs.existsSync(backupDir)) {
		fs.rmSync(backupDir, { recursive: true, force: true });
	}
}

/**
 * Run a command
 * @param command
 * @param description
 */
function runCommand(command, description) {
	log(`\n🔄 ${description}...`, 'cyan');
	dryRunLog('INFO', `Running: ${command}`);

	try {
		execSync(command, {
			stdio: 'inherit',
			cwd: path.resolve(__dirname, '..'),
		});
		log(`✅ ${description} passed`, 'green');
		dryRunLog('INFO', `${description} passed`);
		return true;
	} catch (error) {
		log(`❌ ${description} failed`, 'red');
		dryRunLog('ERROR', `${description} failed`);
		return false;
	}
}

/**
 * Main execution
 */
async function main() {
	const args = process.argv.slice(2);
	const commands = args.length > 0 ? args : ['test:js', 'test:php'];

	dryRunLog('INFO', 'Dry Run Test Mode starting');
	dryRunLog('INFO', `Node version: ${process.version}`);
	dryRunLog('INFO', `Working directory: ${process.cwd()}`);
	dryRunLog('INFO', `Log file: ${logFile}`);

	log('\n🚀 Starting Dry Run Test Mode', 'bright');
	log('================================\n', 'bright');

	log('📝 Test values will replace mustache variables', 'yellow');
	log('   See scripts/test-placeholders.js for details\n', 'reset');

	// Get files with mustache variables
	log('🔍 Finding files with mustache variables...', 'cyan');
	dryRunLog('INFO', 'Scanning for files with mustache variables');
	const files = getTargetFiles();
	log(`   Found ${files.length} files\n`, 'reset');
	dryRunLog('INFO', `Found ${files.length} files with mustache variables`);

	if (files.length === 0) {
		log('ℹ️  No files with mustache variables found', 'yellow');
		log('   This might not be a scaffold template.\n', 'yellow');
		dryRunLog('WARN', 'No files with mustache variables found');
		logStream.end();
		process.exit(0);
	}

	// Backup files
	log('💾 Creating backup...', 'cyan');
	dryRunLog('INFO', 'Creating file backups');
	const backupMap = backupFiles(files);
	log(`   Backed up ${Object.keys(backupMap).length} files\n`, 'green');
	dryRunLog('INFO', `Backed up ${Object.keys(backupMap).length} files`);

	let allPassed = true;

	try {
		// Replace mustache variables
		log('🔧 Replacing mustache variables...', 'cyan');
		dryRunLog('INFO', 'Replacing mustache variables in files');
		replaceInFiles(files);
		log('   Variables replaced\n', 'green');
		dryRunLog('INFO', 'Variables replaced successfully');

		// Run commands
		for (const command of commands) {
			const npmCommand = command.startsWith('npm')
				? command
				: `npm run ${command}`;
			dryRunLog('INFO', `Executing: ${npmCommand}`);
			const passed = runCommand(npmCommand, `Running ${command}`);

			if (!passed) {
				allPassed = false;
				dryRunLog('ERROR', `Command failed: ${command}`);

				// In CI or non-interactive mode, stop on first failure
				if (process.env.CI || !process.stdin.isTTY) {
					dryRunLog('INFO', 'Stopping on first failure (CI mode)');
					break;
				}
			} else {
				dryRunLog('INFO', `Command passed: ${command}`);
			}
		}
	} finally {
		// Always restore files
		log('\n🔄 Restoring original files...', 'cyan');
		dryRunLog('INFO', 'Restoring original files from backup');
		restoreFiles(backupMap);
		log('   Files restored\n', 'green');
		dryRunLog('INFO', 'Files restored successfully');
	}

	// Summary
	log('\n================================', 'bright');
	if (allPassed) {
		log('✅ All tests passed!', 'green');
		dryRunLog('INFO', 'Dry run completed: All tests passed');
		log('================================\n', 'bright');
		logStream.end();
		process.exit(0);
	} else {
		log('❌ Some tests failed', 'red');
		dryRunLog('ERROR', 'Dry run completed: Some tests failed');
		log('================================\n', 'bright');
		logStream.end();
		process.exit(1);
	}
}

// Handle cleanup on interrupt
process.on('SIGINT', () => {
	log('\n\n⚠️  Interrupted! Cleaning up...', 'yellow');
	dryRunLog('WARN', 'Process interrupted (SIGINT), cleaning up');
	const backupDir = path.resolve(__dirname, '..', '.dry-run-backup');
	if (fs.existsSync(backupDir)) {
		log('🔄 Restoring files...', 'cyan');
		dryRunLog('INFO', 'Restoring files after interrupt');
		// Note: Full restoration logic would need backupMap from main scope
		// For safety, the backup directory is preserved for manual recovery
	}
	logStream.end();
	process.exit(130);
});

process.on('SIGTERM', () => {
	dryRunLog('WARN', 'Process terminated (SIGTERM)');
	logStream.end();
	process.exit(143);
});

// Run
main().catch((error) => {
	log(`\n❌ Fatal Error: ${error.message}`, 'red');
	dryRunLog('ERROR', `Fatal error: ${error.message}`);
	dryRunLog('ERROR', `Stack trace: ${error.stack}`);
	logStream.end();
	process.exit(1);
});
