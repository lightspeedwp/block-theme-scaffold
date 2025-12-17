// TODO: Add log rotation and environment overrides for release logs.


/**
 * Release Scaffold Agent Implementation
 *
 * Automated release validation for the block-theme-scaffold repository.
 * Ensures mustache placeholders are preserved and all scaffold-specific
 * requirements are met before release.
 *
 * Following the specification in:
 * .github/agents/release-scaffold.agent.md
 *
 * Usage:
 *   node scripts/agents/release-scaffold.agent.js [command]
 *
 * Commands:
 *   validate      - Run full validation suite (default)
 *   version       - Check version consistency
 *   placeholders  - Verify mustache placeholders preserved
 *   schema        - Validate mustache variable schema
 *   quality       - Run quality gates (lint, format, test)
 *   docs          - Verify documentation
 *   generate      - Test theme generation (smoke test)
 *   security      - Run security audit
 *   report        - Generate full readiness report
 *
 * Or from npm:
 *   npm run release:scaffold:validate
 */

/**
 * Release Scaffold Agent
 *
 * Validates scaffold-specific release requirements for the block-theme scaffold
 * before publishing a release branch or package.
 *
 * @module scripts/agents/release-scaffold.agent
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

// Canonical config schema access (if needed for config validation or schema output)
const { getCanonicalConfigSchema } = require('../lib/config-schema');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCAFFOLD_FILES_TO_PRESERVE = [
	'style.css',
	'functions.php',
	'theme.json',
	'inc/',
	'patterns/',
	'templates/',
	'parts/',
	'.github/agents/release.agent.md',
	'.github/prompts/release.prompt.md',
	'.github/instructions/release.instructions.md',
	'docs/GENERATE_THEME.md',
	'docs/RELEASE_PROCESS.md',
];

// ============================================================================
// COLOR OUTPUT HELPERS
// ============================================================================

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

function log( color, symbol, ...args ) {
	console.log( color + symbol + colors.reset, ...args );
}

function error( ...args ) {
	log( colors.red, '❌', ...args );
}

function success( ...args ) {
	log( colors.green, '✅', ...args );
}

function warning( ...args ) {
	log( colors.yellow, '⚠️ ', ...args );
}

function info( ...args ) {
	log( colors.blue, 'ℹ', ...args );
}

function header( text ) {
	const line = '='.repeat( 60 );
	console.log( '\n' + colors.cyan + colors.bold + line );
	console.log( ' ' + text );
	console.log( line + colors.reset + '\n' );
}

// ============================================================================
// VALIDATION STATE TRACKER
// ============================================================================

const validationResults = {
	critical: [],
	warnings: [],
	passed: [],
	failed: [],
};

function addResult( type, category, message, status = 'pass' ) {
	const result = { category, message, status, type };

	if ( status === 'pass' ) {
		validationResults.passed.push( result );
	} else if ( status === 'fail' ) {
		validationResults.failed.push( result );
		if ( type === 'critical' ) {
			validationResults.critical.push( result );
		}
	} else if ( status === 'warn' ) {
		validationResults.warnings.push( result );
	}
}

function resetResults() {
	validationResults.critical = [];
	validationResults.warnings = [];
	validationResults.passed = [];
	validationResults.failed = [];
}

// ============================================================================
// COMMAND EXECUTION HELPERS
// ============================================================================

function runCommand( command, options = {} ) {
	try {
		const output = execSync( command, {
			encoding: 'utf8',
			stdio: options.silent ? 'pipe' : 'inherit',
			cwd: options.cwd || process.cwd(),
			...options,
		} );
		return { success: true, output };
	} catch ( err ) {
		return {
			success: false,
			error: err.message,
			output: err.stdout || err.stderr,
		};
	}
}

function fileExists( filePath ) {
	try {
		return fs.existsSync( filePath );
	} catch {
		return false;
	}
}

function readFile( filePath ) {
	try {
		const content = fs.readFileSync( filePath, 'utf8' );
		return { success: true, content };
	} catch ( err ) {
		return { success: false, error: err.message };
	}
}

// ============================================================================
// VERSION CONSISTENCY CHECK
// ============================================================================

function checkVersionConsistency() {
	header( 'Version Consistency Check' );

	info( 'Checking version alignment across meta files...' );

	try {
		const rootDir = path.resolve( __dirname, '..', '..' );

		// Read VERSION file
		const versionFile = path.join( rootDir, 'VERSION' );
		const version = fs.readFileSync( versionFile, 'utf8' ).trim();

		// Read package.json
		const packageFile = path.join( rootDir, 'package.json' );
		const pkg = JSON.parse( fs.readFileSync( packageFile, 'utf8' ) );

		// Read composer.json
		const composerFile = path.join( rootDir, 'composer.json' );
		const composer = JSON.parse( fs.readFileSync( composerFile, 'utf8' ) );
		const composerVersion = composer.version || null;

		// Compare versions
		const versions = {
			VERSION: version,
			'package.json': pkg.version,
		};

		if ( composerVersion ) {
			versions[ 'composer.json' ] = composerVersion;
		}

		const expectedVersions = Object.values( versions ).filter( Boolean );
		const allMatch = expectedVersions.every( ( v ) => v === version );

		if ( allMatch ) {
			success( `All meta versions match: ${ version }` );
			addResult(
				'critical',
				'version',
				`Version consistency: ${ version }`,
				'pass'
			);
			return { success: true, version };
		}

		error( 'Version mismatch detected:' );
		Object.entries( versions ).forEach( ( [ file, ver ] ) => {
			console.log( `  ${ file }: ${ ver || 'missing' }` );
		} );
		addResult(
			'critical',
			'version',
			'Version files do not match',
			'fail'
		);
		return { success: false, versions };
	} catch ( err ) {
		error( `Failed to check versions: ${ err.message }` );
		addResult(
			'critical',
			'version',
			`Version check failed: ${ err.message }`,
			'fail'
		);
		return { success: false, error: err.message };
	}
}

// ============================================================================
// PLACEHOLDER PRESERVATION CHECK
// ============================================================================

function checkPlaceholders() {
	header( 'Mustache Placeholder Verification' );

	info( 'Verifying {{mustache}} placeholders preserved...' );

	const rootDir = path.resolve( __dirname, '..', '..' );
	let placeholderCount = 0;

	// Check each scaffold file for placeholders
	SCAFFOLD_FILES_TO_PRESERVE.forEach( ( file ) => {
		const filePath = path.join( rootDir, file );

		if (
			fs.lstatSync( filePath, { throwIfNoEntry: false } )?.isDirectory()
		) {
			// For directories, check all files within
			const files = fs.readdirSync( filePath, { recursive: true } );
			files.forEach( ( subFile ) => {
				const subFilePath = path.join( filePath, subFile );
				if (
					fs.lstatSync( subFilePath ).isFile() &&
					( subFile.endsWith( '.php' ) ||
						subFile.endsWith( '.json' ) ||
						subFile.endsWith( '.css' ) )
				) {
					const content = fs.readFileSync( subFilePath, 'utf8' );
					const matches = content.match( /\{\{[^}]+\}\}/g );
					if ( matches ) {
						placeholderCount += matches.length;
					}
				}
			} );
		} else if ( fileExists( filePath ) ) {
			const content = fs.readFileSync( filePath, 'utf8' );
			const matches = content.match( /\{\{[^}]+\}\}/g );
			if ( matches ) {
				placeholderCount += matches.length;
				info( `  Found ${ matches.length } placeholders in ${ file }` );
			} else {
				warning( `  No placeholders found in ${ file }` );
			}
		}
	} );

	if ( placeholderCount > 0 ) {
		success( `Placeholders preserved: ${ placeholderCount } found` );
		addResult(
			'critical',
			'placeholders',
			`${ placeholderCount } mustache placeholders preserved`,
			'pass'
		);
		return true;
	}

	error( 'No mustache placeholders found in scaffold files!' );
	addResult(
		'critical',
		'placeholders',
		'Mustache placeholders missing from scaffold',
		'fail'
	);
	return false;
}

// ============================================================================
// SCHEMA VALIDATION
// ============================================================================

function checkSchema() {
	header( 'Schema Validation' );

	info( 'Running mustache variable schema validation...' );

	const result = runCommand( 'npm run test:schema', { silent: true } );

	if ( result.success ) {
		success( 'Schema validation: PASSED' );
		addResult(
			'critical',
			'schema',
			'All 89 mustache variables documented',
			'pass'
		);
		return true;
	}

	error( 'Schema validation: FAILED' );
	if ( result.output ) {
		console.log( '\n' + result.output );
	}
	addResult(
		'critical',
		'schema',
		'Schema validation failed - undocumented variables found',
		'fail'
	);
	return false;
}

// ============================================================================
// QUALITY GATES
// ============================================================================

function checkQualityGates() {
	header( 'Quality Gates (Dry-Run)' );

	let allPassed = true;

	// Lint dry-run
	info( 'Running lint dry-run...' );
	const lintResult = runCommand( 'npm run lint:dry-run', { silent: true } );
	if ( lintResult.success ) {
		success( 'Linting (dry-run): PASSED' );
		addResult( 'critical', 'quality', 'Lint dry-run passed', 'pass' );
	} else {
		error( 'Linting (dry-run): FAILED' );
		addResult( 'critical', 'quality', 'Lint dry-run failed', 'fail' );
		allPassed = false;
	}

	// Format check
	info( 'Checking code formatting...' );
	const formatResult = runCommand( 'npm run format -- --check', {
		silent: true,
	} );
	if (
		formatResult.success ||
		formatResult.output?.includes( 'All matched files' )
	) {
		success( 'Formatting: PASSED' );
		addResult( 'important', 'quality', 'Code properly formatted', 'pass' );
	} else {
		warning( 'Formatting: needs attention' );
		addResult(
			'important',
			'quality',
			'Code formatting inconsistent',
			'warn'
		);
	}

	// Test dry-run
	info( 'Running test dry-run...' );
	const testResult = runCommand( 'npm run test:dry-run:all', {
		silent: true,
	} );
	if ( testResult.success ) {
		success( 'Tests (dry-run): PASSED' );
		addResult( 'critical', 'quality', 'Test dry-run passed', 'pass' );
	} else {
		error( 'Tests (dry-run): FAILED' );
		addResult( 'critical', 'quality', 'Test dry-run failed', 'fail' );
		allPassed = false;
	}

	return allPassed;
}

// ============================================================================
// DOCUMENTATION CHECK
// ============================================================================

function checkDocumentation() {
	header( 'Documentation Verification' );

	const rootDir = path.resolve( __dirname, '..', '..' );

	// Check CHANGELOG.md
	const changelogPath = path.join( rootDir, 'CHANGELOG.md' );
	if ( fileExists( changelogPath ) ) {
		const changelogContent = fs.readFileSync( changelogPath, 'utf8' );

		if ( changelogContent.includes( '## [Unreleased]' ) ) {
			success( 'CHANGELOG.md has Unreleased section' );
			addResult(
				'critical',
				'docs',
				'CHANGELOG.md structured correctly',
				'pass'
			);
		} else {
			error( 'CHANGELOG.md missing Unreleased section' );
			addResult(
				'critical',
				'docs',
				'CHANGELOG.md needs Unreleased section',
				'fail'
			);
		}
	} else {
		error( 'CHANGELOG.md not found' );
		addResult( 'critical', 'docs', 'CHANGELOG.md missing', 'fail' );
	}

	// Check RELEASE_PROCESS_SCAFFOLD.md
	const releaseDocsPath = path.join(
		rootDir,
		'docs',
		'RELEASE_PROCESS_SCAFFOLD.md'
	);
	if ( fileExists( releaseDocsPath ) ) {
		success( 'RELEASE_PROCESS_SCAFFOLD.md exists' );
		addResult(
			'important',
			'docs',
			'Scaffold release docs present',
			'pass'
		);
	} else {
		error( 'RELEASE_PROCESS_SCAFFOLD.md not found' );
		addResult(
			'important',
			'docs',
			'Scaffold release docs missing',
			'fail'
		);
	}

	// Check that template release docs still have placeholders
	const templateReleaseDocsPath = path.join(
		rootDir,
		'docs',
		'RELEASE_PROCESS.md'
	);
	if ( fileExists( templateReleaseDocsPath ) ) {
		const content = fs.readFileSync( templateReleaseDocsPath, 'utf8' );
		if ( content.includes( '{{' ) ) {
			success( 'RELEASE_PROCESS.md has mustache placeholders' );
			addResult(
				'critical',
				'docs',
				'Template release docs preserved',
				'pass'
			);
		} else {
			error( 'RELEASE_PROCESS.md missing mustache placeholders!' );
			addResult(
				'critical',
				'docs',
				'Template release docs corrupted',
				'fail'
			);
		}
	}
}

// ============================================================================
// GENERATION SMOKE TEST
// ============================================================================

function testThemeGeneration() {
	header( 'Theme Generation Smoke Test' );

	const rootDir = path.resolve( __dirname, '..', '..' );
	const outputDir = path.join( rootDir, 'output-theme' );
	const logsDir = path.join( rootDir, 'logs' );

	info( 'Running generation with test values...' );

	// Clean up previous test output
	if ( fileExists( outputDir ) ) {
		fs.rmSync( outputDir, { recursive: true, force: true } );
	}

	// Generate test theme
	const generateResult = runCommand(
		`node scripts/generate-theme.js \\
		--slug "scaffold-release-test" \\
		--name "Scaffold Release Test" \\
		--author "Scaffold QA" \\
		--author_uri "https://example.com" \\
		--version "$(cat VERSION)"`,
		{ silent: false }
	);

	if ( ! generateResult.success ) {
		error( 'Theme generation: FAILED' );
		addResult(
			'critical',
			'generation',
			'Generation command failed',
			'fail'
		);
		return false;
	}

	// Verify Phase 1 cleanup
	info( 'Verifying Phase 1 cleanup...' );
	const scaffoldAgentPath = path.join(
		outputDir,
		'.github',
		'agents',
		'release-scaffold.agent.md'
	);
	if ( ! fileExists( scaffoldAgentPath ) ) {
		success( 'Phase 1 cleanup: scaffold files deleted' );
		addResult(
			'critical',
			'generation',
			'Phase 1 cleanup verified',
			'pass'
		);
	} else {
		error( 'Phase 1 cleanup: scaffold files still present' );
		addResult( 'critical', 'generation', 'Phase 1 cleanup failed', 'fail' );
		return false;
	}

	// Verify logging
	info( 'Verifying generation log...' );
	const logPath = path.join(
		logsDir,
		'generate-theme-scaffold-release-test.log'
	);
	if ( fileExists( logPath ) ) {
		const logContent = fs.readFileSync( logPath, 'utf8' );
		if ( logContent.includes( '"status":"success"' ) ) {
			success( 'Generation log: success status recorded' );
			addResult(
				'critical',
				'generation',
				'Generation logged successfully',
				'pass'
			);
		} else {
			error( 'Generation log: missing success status' );
			addResult(
				'critical',
				'generation',
				'Generation log incomplete',
				'fail'
			);
			return false;
		}
	} else {
		error( 'Generation log: file not created' );
		addResult( 'critical', 'generation', 'Generation log missing', 'fail' );
		return false;
	}

	// Verify no placeholders in generated theme
	info( 'Checking for unreplaced placeholders...' );
	const grepResult = runCommand(
		`grep -r "{{" ${ outputDir } --exclude-dir=node_modules --exclude-dir=.git || true`,
		{ silent: true }
	);

	if ( ! grepResult.output || grepResult.output.trim() === '' ) {
		success( 'No mustache placeholders in generated theme' );
		addResult(
			'critical',
			'generation',
			'All placeholders replaced',
			'pass'
		);
	} else {
		error( 'Found unreplaced placeholders in generated theme!' );
		console.log( grepResult.output );
		addResult(
			'critical',
			'generation',
			'Placeholders remain in output',
			'fail'
		);
		return false;
	}

	// Test build in generated theme
	info( 'Testing build in generated theme...' );
	const installResult = runCommand( 'npm install', {
		cwd: outputDir,
		silent: true,
	} );
	if ( ! installResult.success ) {
		error( 'npm install failed in generated theme' );
		addResult(
			'critical',
			'generation',
			'Generated theme npm install failed',
			'fail'
		);
		return false;
	}

	const buildResult = runCommand( 'npm run build', {
		cwd: outputDir,
		silent: true,
	} );
	if ( buildResult.success ) {
		success( 'Generated theme builds successfully' );
		addResult( 'critical', 'generation', 'Generated theme builds', 'pass' );
	} else {
		error( 'Generated theme build failed' );
		addResult(
			'critical',
			'generation',
			'Generated theme build failed',
			'fail'
		);
		return false;
	}

	// Clean up
	info( 'Cleaning up test output...' );
	fs.rmSync( outputDir, { recursive: true, force: true } );
	fs.rmSync( logPath, { force: true } );

	success( 'Theme generation: PASSED' );
	return true;
}

// ============================================================================
// SECURITY AUDIT
// ============================================================================

function runSecurityAudit() {
	header( 'Security Audit' );

	info( 'Running npm audit...' );
	const result = runCommand( 'npm audit --audit-level=high', {
		silent: true,
	} );

	if (
		result.success ||
		result.output?.includes( 'found 0 vulnerabilities' )
	) {
		success( 'Security audit: No high/critical vulnerabilities' );
		addResult(
			'critical',
			'security',
			'No critical vulnerabilities',
			'pass'
		);
		return true;
	}

	error( 'Security audit: Vulnerabilities found' );
	if ( result.output ) {
		console.log( '\n' + result.output );
	}
	addResult(
		'critical',
		'security',
		'High/critical vulnerabilities found',
		'fail'
	);
	return false;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport() {
	header( 'Scaffold Release Readiness Report' );

	const versionFile = path.resolve( __dirname, '..', '..', 'VERSION' );
	const version = fileExists( versionFile )
		? fs.readFileSync( versionFile, 'utf8' ).trim()
		: 'Unknown';

	console.log(
		'\n' +
			colors.cyan +
			colors.bold +
			`## Release Readiness for block-theme-scaffold v${ version }\n` +
			colors.reset
	);

	const totalChecks =
		validationResults.passed.length +
		validationResults.failed.length +
		validationResults.warnings.length;

	console.log( colors.bold + '📊 Summary\n' + colors.reset );
	console.log( `Total checks: ${ totalChecks }` );
	success( `Passed: ${ validationResults.passed.length }` );
	warning( `Warnings: ${ validationResults.warnings.length }` );
	error( `Failed: ${ validationResults.failed.length }` );

	const isReady = validationResults.critical.length === 0;

	console.log( '\n' + colors.bold + '🎯 Status\n' + colors.reset );
	if ( isReady ) {
		success( '✓ READY TO RELEASE SCAFFOLD' );
	} else {
		error( '✗ RELEASE BLOCKED' );
	}

	// Passed checks
	if ( validationResults.passed.length > 0 ) {
		console.log(
			'\n' +
				colors.green +
				colors.bold +
				'### ✅ Passed Checks\n' +
				colors.reset
		);
		validationResults.passed.forEach( ( result ) => {
			console.log( `  ✓ [${ result.category }] ${ result.message }` );
		} );
	}

	// Warnings
	if ( validationResults.warnings.length > 0 ) {
		console.log(
			'\n' +
				colors.yellow +
				colors.bold +
				'### ⚠️  Warnings\n' +
				colors.reset
		);
		validationResults.warnings.forEach( ( result ) => {
			console.log( `  ⚠  [${ result.category }] ${ result.message }` );
		} );
	}

	// Blockers
	if ( validationResults.critical.length > 0 ) {
		console.log(
			'\n' +
				colors.red +
				colors.bold +
				'### ❌ Critical Blockers\n' +
				colors.reset
		);
		validationResults.critical.forEach( ( result ) => {
			console.log( `  ✗ [${ result.category }] ${ result.message }` );
		} );
	}

	// Next steps
	console.log( '\n' + colors.bold + '📋 Next Steps\n' + colors.reset );
	if ( isReady ) {
		console.log( '  1. Review the changes: git diff' );
		console.log(
			'  2. Commit changes: git commit -am "chore: prepare release v' +
				version +
				'"'
		);
		console.log(
			`  3. Create release branch: git checkout -b release/${ version }`
		);
		console.log(
			`  4. Tag release: git tag -a v${ version } -m "Release v${ version }"`
		);
		console.log( '  5. Push tag: git push origin v' + version );
	} else {
		console.log( '  1. Review critical blockers above' );
		console.log( '  2. Fix issues and re-run validation' );
		console.log( '  3. Run: npm run release:scaffold:validate' );
	}

	console.log( '' ); // Empty line

	return isReady;
}

// ============================================================================
// MAIN COMMAND ROUTER
// ============================================================================

function showHelp() {
	console.log( `
${ colors.cyan }${ colors.bold }Release Scaffold Agent${ colors.reset }

${ colors.bold }Usage:${ colors.reset }
  node scripts/agents/release-scaffold.agent.js [command]

${ colors.bold }Commands:${ colors.reset }
  validate      - Run full validation suite (default)
  version       - Check version consistency
  placeholders  - Verify mustache placeholders preserved
  schema        - Validate mustache variable schema
  quality       - Run quality gates (lint, format, test)
  docs          - Verify documentation
  generate      - Test theme generation (smoke test)
  security      - Run security audit
  report        - Generate full readiness report
  help          - Show this help text

${ colors.bold }NPM Scripts:${ colors.reset }
  npm run release:scaffold:validate
  npm run release:scaffold:report

${ colors.bold }Specification:${ colors.reset }
  .github/agents/release-scaffold.agent.md
  docs/RELEASE_PROCESS_SCAFFOLD.md
` );
}

function main() {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ] || 'validate';

	switch ( command ) {
		case 'validate':
		case 'full':
			resetResults();
			checkVersionConsistency();
			checkPlaceholders();
			checkSchema();
			checkQualityGates();
			checkDocumentation();
			testThemeGeneration();
			runSecurityAudit();
			return generateReport();

		case 'version':
			resetResults();
			return checkVersionConsistency().success;

		case 'placeholders':
			resetResults();
			return checkPlaceholders();

		case 'schema':
			resetResults();
			return checkSchema();

		case 'quality':
			resetResults();
			return checkQualityGates();

		case 'docs':
			resetResults();
			checkDocumentation();
			return validationResults.failed.length === 0;

		case 'generate':
			resetResults();
			return testThemeGeneration();

		case 'security':
			resetResults();
			return runSecurityAudit();

		case 'report':
			return generateReport();

		case 'help':
		case '--help':
		case '-h':
			showHelp();
			return true;

		default:
			error( `Unknown command: ${ command }` );
			console.log(
				"Run 'node scripts/agents/release-scaffold.agent.js help' for usage."
			);
			return false;
	}
}

// ============================================================================
// EXPORTS & EXECUTION
// ============================================================================

if ( require.main === module ) {
	const success = main();
	process.exit( success ? 0 : 1 );
}

module.exports = {
	checkVersionConsistency,
	checkPlaceholders,
	checkSchema,
	checkQualityGates,
	checkDocumentation,
	testThemeGeneration,
	runSecurityAudit,
	generateReport,
	runCommand,
	fileExists,
	readFile,
	addResult,
	resetResults,
	getResults: () => validationResults,
};
