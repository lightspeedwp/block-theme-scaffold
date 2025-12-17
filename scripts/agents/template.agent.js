// TODO: Add CLI doc/help sync when new mode flags are added.


/**
 * 🚨 THIS IS A TEMPLATE FILE - NOT A FUNCTIONAL AGENT 🚨
 *
 * Template Agent Implementation
 *
 * This file serves as a template for creating new agent script implementations.
 * Follow the specification in .github/agents/{{agent_slug}}.agent.md
 *
 * USAGE INSTRUCTIONS:
 * 1. Copy this file to: scripts/agents/{{agent_slug}}.agent.js
 * 2. Copy template.agent.test.js to: tests/agents/{{agent_slug}}.agent.test.js
 * 3. Replace ALL {{placeholders}} with actual values
 * 4. Implement the core functions according to your agent's specification
 * 5. Update the command list in the help text
 * 6. Export functions for testing
 * 7. Create corresponding .agent.md file in .github/agents/
 *
 * TEMPLATE PLACEHOLDERS TO REPLACE:
 * - {{agent_name}}: Human-readable agent name (e.g., "Release Scaffold Agent")
 * - {{agent_slug}}: Kebab-case slug (e.g., "release-scaffold")
 * - {{agent_description}}: Brief description of what the agent does
 * - {{agent_md_path}}: Path to agent spec (e.g., ".github/agents/release-scaffold.agent.md")
 * - {{command_name}}: Primary command name (e.g., "validate", "generate", "check")
 * - {{npm_script}}: NPM script name (e.g., "npm run {{agent_slug}}:{{command}}")
 *
* DO NOT use this file directly - it's a template!
*/

/**
 * Template Agent Boilerplate
 *
 * Provides structured guidance for creating new agent scripts within the scaffold.
 *
 * @module scripts/agents/template.agent
 */
// TODO: Replace this boilerplate with a concrete agent implementation before executing.

const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

// ============================================================================
// CONFIGURATION & SCHEMA ACCESS
// ============================================================================

const AGENT_NAME = '{{agent_name}}'; // e.g., "Release Scaffold Agent"
const AGENT_SLUG = '{{agent_slug}}'; // e.g., "release-scaffold"
const AGENT_SPEC = '{{agent_md_path}}'; // e.g., ".github/agents/release-scaffold.agent.md"

// Canonical config schema access (update this for new agents)
const { getCanonicalConfigSchema } = require('../lib/config-schema');

// ============================================================================
// COLOR OUTPUT HELPERS
// ============================================================================

/**
 * Display help text
 */
function showHelp() {
			 console.log( `

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
	critical: [], // Must pass for success
	warnings: [], // Should pass but not blocking
	passed: [], // All passed checks
	failed: [], // All failed checks
};

/**
 * Add a validation result
 * @param {'critical'|'important'} type - Severity level
 * @param {string} category - Category name (e.g., 'version', 'quality', 'docs')
 * @param {string} message - Result message
 * @param {'pass'|'fail'|'warn'} status - Status
 */
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

/**
 * Reset validation results (useful for testing)
 */
function resetResults() {
	validationResults.critical = [];
	validationResults.warnings = [];
	validationResults.passed = [];
	validationResults.failed = [];
}

// ============================================================================
// COMMAND EXECUTION HELPERS
// ============================================================================

/**
 * Execute a shell command safely
 * @param {string} command - Command to execute
 * @param {object} options - Execution options
 * @returns {{success: boolean, output?: string, error?: string}}
 */
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

/**
 * Check if a file exists
 * @param {string} filePath - Path to check
 * @returns {boolean}
 */
function fileExists( filePath ) {
	try {
		return fs.existsSync( filePath );
	} catch {
		return false;
	}
}

/**
 * Read a file safely
 * @param {string} filePath - File to read
 * @returns {{success: boolean, content?: string, error?: string}}
 */
function readFile( filePath ) {
	try {
		const content = fs.readFileSync( filePath, 'utf8' );
		return { success: true, content };
	} catch ( err ) {
		return { success: false, error: err.message };
	}
}

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================
// Replace these with your agent's actual validation logic

/**
 * TODO: Replace with your validation function
 * Example: Check version consistency, validate configuration, etc.
 */
function checkExample() {
	header( 'Example Check' );

	info( 'Running example validation...' );

	// Example validation logic
	const exampleFile = path.resolve( __dirname, '..', '..', 'package.json' );

	if ( fileExists( exampleFile ) ) {
		success( 'package.json exists' );
		addResult( 'critical', 'example', 'package.json found', 'pass' );
		return true;
	}

	error( 'package.json not found' );
	addResult( 'critical', 'example', 'package.json missing', 'fail' );
	return false;
}

/**
 * TODO: Add more validation functions as needed
 * Each function should:
 * 1. Print a header with header()
 * 2. Run checks with info() output
 * 3. Log results with success()/error()/warning()
 * 4. Add results to tracker with addResult()
 * 5. Return boolean success status
 */

// ============================================================================
// REPORT GENERATION
// ============================================================================

/**
 * Generate full validation report
 * @returns {boolean} - True if ready to proceed
 */
function generateReport() {
	header( `${ AGENT_NAME } Report` );

	const totalChecks =
		validationResults.passed.length +
		validationResults.failed.length +
		validationResults.warnings.length;

	console.log( '\n' + colors.bold + '📊 Summary\n' + colors.reset );
	console.log( `Total checks: ${ totalChecks }` );
	success( `Passed: ${ validationResults.passed.length }` );
	warning( `Warnings: ${ validationResults.warnings.length }` );
	error( `Failed: ${ validationResults.failed.length }` );

	// Determine if ready
	const isReady = validationResults.critical.length === 0;

	console.log( '\n' + colors.bold + '🎯 Status\n' + colors.reset );
	if ( isReady ) {
		success( '✓ VALIDATION PASSED' );
	} else {
		error( '✗ VALIDATION FAILED' );
	}

	// Show passed checks
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

	// Show warnings
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

	// Show critical blockers
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
		console.log( '  1. TODO: Add success next steps here' );
		console.log( '  2. TODO: Add more steps as needed' );
	} else {
		console.log( '  1. Review critical blockers above' );
		console.log( '  2. Fix issues and re-run validation' );
		console.log( `  3. Run: node scripts/agents/${ AGENT_SLUG }.agent.js` );
	}

	console.log( '' ); // Empty line

	return isReady;
}

// ============================================================================
// MAIN COMMAND ROUTER
// ============================================================================

/**
 * Display help text
 */
function showHelp() {
	console.log( `
${ colors.cyan }${ colors.bold }${ AGENT_NAME }${ colors.reset }

${ colors.bold }Usage:${ colors.reset }
  node scripts/agents/${ AGENT_SLUG }.agent.js [command]

${ colors.bold }Commands:${ colors.reset }
  validate    - Run full validation suite (default)
  example     - Run example check only
  report      - Generate validation report
  help        - Show this help text

${ colors.bold }NPM Scripts:${ colors.reset }
  npm run ${ AGENT_SLUG }:validate
  npm run ${ AGENT_SLUG }:report

${ colors.bold }Specification:${ colors.reset }
  ${ AGENT_SPEC }

${ colors.yellow }⚠️  This is a TEMPLATE file. Replace {{placeholders}} before use!${ colors.reset }
` );
}

/**
 * Main function - command router
 * @returns {boolean} - Success status
 */
function main() {
       const args = process.argv.slice( 2 );
       const command = args[ 0 ] || 'validate';

       // Check if still a template
       if ( AGENT_NAME.includes( '{{' ) || AGENT_SLUG.includes( '{{' ) ) {
	       error( '🚨 THIS IS A TEMPLATE FILE!' );
	       console.log( '' );
	       console.log(
		       'This file contains unreplaced {{placeholders}}. Please:'
	       );
	       console.log( '1. Copy this file to your agent name' );
	       console.log( '2. Replace all {{placeholders}} with actual values' );
	       console.log( '3. Implement the validation functions' );
	       console.log( '4. Remove this warning check' );
	       console.log( '' );
	       console.log( 'See file header for detailed instructions.' );
	       console.log( '' );
	       return false;
       }

       switch ( command ) {
	       case 'validate':
	       case 'full':
		       // Run all validation checks
		       resetResults();
		       checkExample();
		       // TODO: Add more validation functions here
		       return generateReport();

	       case 'example':
		       resetResults();
		       return checkExample();

	       case 'report':
		       return generateReport();

	       case 'schema': {
		       // Output canonical config schema
		       const schema = getCanonicalConfigSchema();
		       console.log( JSON.stringify( schema, null, 2 ) );
		       return true;
	       }

	       case 'help':
	       case '--help':
	       case '-h':
		       showHelp();
		       return true;

	       default:
		       error( `Unknown command: ${ command }` );
		       console.log(
			       `Run 'node scripts/agents/${ AGENT_SLUG }.agent.js help' for usage.`
		       );
		       return false;
       }
}

// ============================================================================
// EXPORTS & EXECUTION
// ============================================================================

// Run main function if executed directly
if ( require.main === module ) {
	const success = main();
	process.exit( success ? 0 : 1 );
}

// Export functions for testing
module.exports = {
	// Validation functions
	checkExample,
	generateReport,

	// Helper functions
	runCommand,
	fileExists,
	readFile,
	addResult,
	resetResults,

	// State access for testing
	getResults: () => validationResults,
};
