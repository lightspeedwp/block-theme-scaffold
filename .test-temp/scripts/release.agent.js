#!/usr/bin/env node

/**
 * Release Agent Implementation
 *
 * Automated release validation and preparation assistant following
 * the specification in .github/agents/release.agent.md
 *
 * Usage:
 *   node scripts/release.agent.js [command]
 *
 * Commands:
 *   validate    - Run full validation suite
 *   version     - Check version consistency
 *   quality     - Run quality gates (lint, format, test)
 *   docs        - Verify documentation
 *   generate    - Test theme generation
 *   security    - Run security audit
 *   status      - Quick readiness status
 *   report      - Generate full readiness report
 *
 * Or from npm:
 *   npm run release:validate
 *   npm run release:status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color output helpers
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m',
};

function log(color, ...args) {
	console.log(color, ...args, colors.reset);
}

function error(...args) {
	log(colors.red, '❌', ...args);
}

function success(...args) {
	log(colors.green, '✅', ...args);
}

function warning(...args) {
	log(colors.yellow, '⚠️ ', ...args);
}

function info(...args) {
	log(colors.blue, 'ℹ', ...args);
}

function header(text) {
	console.log(
		'\n' + colors.magenta + colors.bold + '═'.repeat(60) + colors.reset
	);
	log(colors.magenta + colors.bold, text);
	console.log(
		colors.magenta + colors.bold + '═'.repeat(60) + colors.reset + '\n'
	);
}

// Validation state tracker
const validationResults = {
	critical: [],
	warnings: [],
	passed: [],
	failed: [],
};

function addResult(type, category, message, status = 'pass') {
	const result = { category, message, status };

	if (status === 'pass') {
		validationResults.passed.push(result);
	} else if (status === 'fail') {
		validationResults.failed.push(result);
		if (type === 'critical') {
			validationResults.critical.push(result);
		}
	} else if (status === 'warn') {
		validationResults.warnings.push(result);
	}
}

// Execute command safely
function runCommand(command, options = {}) {
	try {
		const output = execSync(command, {
			encoding: 'utf8',
			stdio: options.silent ? 'pipe' : 'inherit',
			...options,
		});
		return { success: true, output };
	} catch (err) {
		return { success: false, error: err.message, output: err.stdout };
	}
}

// Version consistency check
function checkVersionConsistency() {
	info('Checking version consistency...');

	try {
		// Read VERSION file
		const versionFile = path.resolve(__dirname, '..', 'VERSION');
		const version = fs.readFileSync(versionFile, 'utf8').trim();

		// Read package.json
		const packageFile = path.resolve(__dirname, '..', 'package.json');
		const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

		// Read style.css
		const styleFile = path.resolve(__dirname, '..', 'style.css');
		const styleContent = fs.readFileSync(styleFile, 'utf8');
		const styleVersionMatch = styleContent.match(
			/Version:\s*([\d.]+(-[a-zA-Z0-9.-]+)?)/
		);
		const styleVersion = styleVersionMatch ? styleVersionMatch[1] : null;

		// Compare versions
		const versions = {
			VERSION: version,
			'package.json': pkg.version,
			'style.css': styleVersion,
		};

		const allMatch = Object.values(versions).every((v) => v === version);

		if (allMatch) {
			success(`Version consistency: ${version}`);
			addResult(
				'critical',
				'version',
				`All version files match: ${version}`,
				'pass'
			);
			return { success: true, version };
		} else {
			error('Version mismatch detected:');
			Object.entries(versions).forEach(([file, ver]) => {
				console.log(`  ${file}: ${ver}`);
			});
			addResult(
				'critical',
				'version',
				'Version files do not match',
				'fail'
			);
			return { success: false, versions };
		}
	} catch (err) {
		error(`Failed to check versions: ${err.message}`);
		addResult(
			'critical',
			'version',
			`Version check failed: ${err.message}`,
			'fail'
		);
		return { success: false, error: err.message };
	}
}

// Quality gates validation
function checkQualityGates() {
	header('Quality Gates');

	let allPassed = true;

	// Linting
	info('Running linting...');
	const lintResult = runCommand('npm run lint:dry-run', { silent: true });
	if (lintResult.success) {
		success('Linting: PASSED');
		addResult('critical', 'quality', 'Linting passed', 'pass');
	} else {
		error('Linting: FAILED');
		addResult('critical', 'quality', 'Linting failed', 'fail');
		allPassed = false;
	}

	// Format check
	info('Checking code formatting...');
	const formatResult = runCommand('npm run format -- --check', {
		silent: true,
	});
	if (
		formatResult.success ||
		formatResult.output?.includes('All matched files')
	) {
		success('Formatting: PASSED');
		addResult('important', 'quality', 'Code properly formatted', 'pass');
	} else {
		warning('Formatting: needs attention');
		addResult(
			'important',
			'quality',
			'Code formatting inconsistent',
			'warn'
		);
	}

	// Dry-run tests
	info('Running dry-run tests...');
	const testResult = runCommand('npm run test:dry-run:all', { silent: true });
	if (testResult.success) {
		success('Tests: PASSED');
		addResult('critical', 'quality', 'Dry-run tests passed', 'pass');
	} else {
		error('Tests: FAILED');
		addResult('critical', 'quality', 'Dry-run tests failed', 'fail');
		allPassed = false;
	}

	return allPassed;
}

// Documentation verification
function checkDocumentation() {
	header('Documentation Verification');

	const rootDir = path.resolve(__dirname, '..');

	// Check README.md exists and is current
	const readmePath = path.join(rootDir, 'README.md');
	if (fs.existsSync(readmePath)) {
		success('README.md exists');
		addResult('important', 'docs', 'README.md present', 'pass');

		// Check for version references
		const readmeContent = fs.readFileSync(readmePath, 'utf8');
		if (readmeContent.includes('1.0.0')) {
			warning('README.md contains mustache variables');
			addResult(
				'important',
				'docs',
				'README.md has unreplaced variables',
				'warn'
			);
		}
	} else {
		error('README.md not found');
		addResult('important', 'docs', 'README.md missing', 'fail');
	}

	// Check CHANGELOG.md
	const changelogPath = path.join(rootDir, 'CHANGELOG.md');
	if (fs.existsSync(changelogPath)) {
		const changelogContent = fs.readFileSync(changelogPath, 'utf8');

		// Check for unreleased section
		if (changelogContent.includes('## [Unreleased]')) {
			success('CHANGELOG.md has Unreleased section');
			addResult(
				'critical',
				'docs',
				'CHANGELOG.md structured correctly',
				'pass'
			);
		}

		// Check for dated releases
		const releasePattern = /## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}/;
		if (releasePattern.test(changelogContent)) {
			success('CHANGELOG.md has properly dated releases');
			addResult(
				'critical',
				'docs',
				'CHANGELOG.md has release dates',
				'pass'
			);
		} else {
			warning('CHANGELOG.md missing release dates');
			addResult(
				'critical',
				'docs',
				'CHANGELOG.md needs release dates',
				'warn'
			);
		}
	} else {
		error('CHANGELOG.md not found');
		addResult('critical', 'docs', 'CHANGELOG.md missing', 'fail');
	}

	// Check CONTRIBUTING.md
	const contributingPath = path.join(rootDir, 'CONTRIBUTING.md');
	if (fs.existsSync(contributingPath)) {
		success('CONTRIBUTING.md exists');
		addResult('important', 'docs', 'CONTRIBUTING.md present', 'pass');
	} else {
		warning('CONTRIBUTING.md not found');
		addResult('important', 'docs', 'CONTRIBUTING.md missing', 'warn');
	}
}

// Theme generation test
function testThemeGeneration() {
	header('Theme Generation Test');

	info('Testing theme generation with dry-run...');

	// Check if generate-theme script exists
	const scriptPath = path.resolve(__dirname, 'generate-theme.js');
	if (!fs.existsSync(scriptPath)) {
		error('generate-theme.js not found');
		addResult(
			'critical',
			'generation',
			'Theme generator script missing',
			'fail'
		);
		return false;
	}

	// Run theme generation test (dry-run validation)
	const result = runCommand('npm run test:dry-run:all', { silent: true });
	if (result.success) {
		success('Theme generation: PASSED');
		addResult('critical', 'generation', 'Theme generation works', 'pass');
		return true;
	} else {
		error('Theme generation: FAILED');
		addResult('critical', 'generation', 'Theme generation failed', 'fail');
		return false;
	}
}

// Security audit
function runSecurityAudit() {
	header('Security Audit');

	info('Running npm audit...');
	const result = runCommand('npm audit --audit-level=high', { silent: true });

	if (result.success) {
		success('Security audit: No high/critical vulnerabilities');
		addResult(
			'critical',
			'security',
			'No critical vulnerabilities',
			'pass'
		);
		return true;
	} else {
		const output = result.output || '';
		if (output.includes('found 0 vulnerabilities')) {
			success('Security audit: No vulnerabilities');
			addResult(
				'critical',
				'security',
				'No vulnerabilities found',
				'pass'
			);
			return true;
		} else {
			error('Security audit: Vulnerabilities found');
			console.log(output);
			addResult(
				'critical',
				'security',
				'High/critical vulnerabilities found',
				'fail'
			);
			return false;
		}
	}
}

// Generate full report
function generateReport() {
	header('Release Readiness Report');

	const version = checkVersionConsistency().version || 'Unknown';

	console.log(
		colors.cyan +
			colors.bold +
			`\n## Release Readiness for v${version}\n` +
			colors.reset
	);

	// Summary
	const totalChecks =
		validationResults.passed.length +
		validationResults.failed.length +
		validationResults.warnings.length;

	console.log(colors.bold + '### Summary\n' + colors.reset);
	console.log(`Total Checks: ${totalChecks}`);
	success(`Passed: ${validationResults.passed.length}`);
	warning(`Warnings: ${validationResults.warnings.length}`);
	error(`Failed: ${validationResults.failed.length}`);

	// Ready to release?
	const isReady = validationResults.critical.length === 0;

	console.log('\n' + colors.bold + '### Status\n' + colors.reset);
	if (isReady) {
		success('✓ READY TO RELEASE');
	} else {
		error('✗ RELEASE BLOCKED');
	}

	// Passed checks
	if (validationResults.passed.length > 0) {
		console.log(
			'\n' +
				colors.green +
				colors.bold +
				'### ✅ Passed Checks\n' +
				colors.reset
		);
		validationResults.passed.forEach((result) => {
			console.log(`- [x] ${result.message}`);
		});
	}

	// Warnings
	if (validationResults.warnings.length > 0) {
		console.log(
			'\n' +
				colors.yellow +
				colors.bold +
				'### ⚠️  Warnings\n' +
				colors.reset
		);
		validationResults.warnings.forEach((result) => {
			console.log(`- [ ] ${result.message}`);
		});
	}

	// Blockers
	if (validationResults.critical.length > 0) {
		console.log(
			'\n' +
				colors.red +
				colors.bold +
				'### ❌ Critical Blockers\n' +
				colors.reset
		);
		validationResults.critical.forEach((result) => {
			console.log(`- [ ] ${result.message}`);
		});

		console.log(
			'\n' +
				colors.red +
				'⚠️  Cannot proceed until critical issues are resolved.\n' +
				colors.reset
		);
	}

	// Next steps
	console.log('\n' + colors.bold + '### Next Steps\n' + colors.reset);
	if (isReady) {
		console.log('1. Review changes: git diff');
		console.log('2. Create release branch: git checkout -b release/1.0.0');
		console.log(
			'3. Commit: git commit -am "chore: prepare release v1.0.0"'
		);
		console.log('4. Follow: docs/RELEASE_PROCESS.md');
	} else {
		console.log('1. Fix critical blockers listed above');
		console.log('2. Re-run validation: npm run release:validate');
		console.log('3. Review warnings and fix if possible');
	}

	console.log('\n' + colors.magenta + '═'.repeat(60) + colors.reset + '\n');

	return isReady;
}

// Main function
function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'validate';

	console.log(colors.cyan + colors.bold);
	console.log('╔══════════════════════════════════════════════════════════╗');
	console.log('║        Block Theme Scaffold - Release Agent             ║');
	console.log('╚══════════════════════════════════════════════════════════╝');
	console.log(colors.reset);

	switch (command) {
		case 'validate':
		case 'full':
			checkVersionConsistency();
			checkQualityGates();
			checkDocumentation();
			testThemeGeneration();
			runSecurityAudit();
			return generateReport();

		case 'version':
			return checkVersionConsistency().success;

		case 'quality':
			return checkQualityGates();

		case 'docs':
			checkDocumentation();
			return validationResults.failed.length === 0;

		case 'generate':
			return testThemeGeneration();

		case 'security':
			return runSecurityAudit();

		case 'status':
		case 'report':
			checkVersionConsistency();
			checkQualityGates();
			checkDocumentation();
			return generateReport();

		case 'help':
		case '--help':
		case '-h':
			console.log('\nUsage: node scripts/release.agent.js [command]\n');
			console.log('Commands:');
			console.log('  validate    Run full validation suite (default)');
			console.log('  version     Check version consistency');
			console.log('  quality     Run quality gates (lint, format, test)');
			console.log('  docs        Verify documentation');
			console.log('  generate    Test theme generation');
			console.log('  security    Run security audit');
			console.log('  status      Quick readiness status');
			console.log('  report      Generate full readiness report');
			console.log('  help        Show this help\n');
			return true;

		default:
			error(`Unknown command: ${command}`);
			console.log('Run with --help for usage information\n');
			return false;
	}
}

// Run main function
if (require.main === module) {
	const success = main();
	process.exit(success ? 0 : 1);
}

module.exports = {
	checkVersionConsistency,
	checkQualityGates,
	checkDocumentation,
	testThemeGeneration,
	runSecurityAudit,
	generateReport,
};
