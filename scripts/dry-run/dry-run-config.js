/**
 * @file dry-run-config.js
 * @description Provides test values for mustache template variables during pre-commit hooks and testing phases.
 * @todo Support loading dry-run config from external JSON for advanced test scenarios.
 */
/**
 * Dry Run Configuration
 *
 * Provides test values for mustache template variables during pre-commit hooks
 * and testing phases. This allows linting and testing to run on the scaffold
 * template files without requiring plugin generation.
 *
 * @package
 */

const { PLACEHOLDER_MAP } = require( '../utils/placeholders' );

/**
 * Default mustache variable values for dry-run testing
 */
const PLACEHOLDER_VALUES = Object.fromEntries(
	Object.entries( PLACEHOLDER_MAP ).map( ( [ key, value ] ) => [
		key.replace( /^\{\{|\}\}$/g, '' ),
		value,
	] )
);

const DRY_RUN_VALUES = {
	// Core Plugin Identity
	slug: 'example-plugin',
	name: 'Example Plugin',
	displayName: 'Example Plugin',
	namespace: 'example_plugin',
	textdomain: 'example-plugin',
	description: 'A multi-block WordPress plugin scaffold example',
	version: '1.0.0',
	author: 'Example Author',
	author_uri: 'https://example.com',
	license: 'GPL-2.0-or-later',
	license_uri: 'https://www.gnu.org/licenses/gpl-2.0.html',
	plugin_uri: 'https://example.com/plugins/example-plugin',

	// Post Type
	name_singular: 'Item',
	name_plural: 'Items',
	name_singular_lower: 'item',
	name_plural_lower: 'items',
	cpt_slug: 'item',
	cpt_icon: 'dashicons-admin-post',

	// Taxonomy
	taxonomy_singular: 'Category',
	taxonomy_plural: 'Categories',
	taxonomy_slug: 'category',

	// Requirements
	requires_wp: '6.5',
	requires_php: '8.0',
	tested_up_to: '6.7',

	// Meta
	website: 'https://example.com',
	docsUrl: 'https://example.com/docs',
	supportUrl: 'https://example.com/support',
	changelogUrl: 'https://example.com/changelog',
	createdDate: '2025-01-01',
	updatedDate: '2025-12-07',
	...PLACEHOLDER_VALUES,
};

/**
 * Get dry-run configuration
 *
 * @return {Object} Configuration object with all mustache variables
 */
function getDryRunConfig() {
	return { ...DRY_RUN_VALUES };
}

/**
 * Get a specific dry-run value
 *
 * @param {string} key          - The configuration key
 * @param {*}      defaultValue - Default value if key not found
 * @return {*} The configuration value
 */
function getDryRunValue( key, defaultValue = '' ) {
	return DRY_RUN_VALUES[ key ] ?? defaultValue;
}

/**
 * Check if we're in dry-run mode
 *
 * @return {boolean} True if DRY_RUN environment variable is set
 */
function isDryRun() {
	return process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
}

/**
 * Replace mustache variables in a string
 *
 * @param {string} content - Content with mustache variables
 * @param {Object} values  - Optional custom values (defaults to DRY_RUN_VALUES)
 * @return {string} Content with variables replaced
 */
function replaceMustacheVars( content, values = DRY_RUN_VALUES ) {
	let result = content;

	// Replace all PLACEHOLDER patterns
	Object.entries( values ).forEach( ( [ key, value ] ) => {
		const regex = new RegExp( `\\{\\{${ key }\\}\\}`, 'g' );
		result = result.replace( regex, value );
	} );

	// Support upper filter syntax (e.g., PLACEHOLDER)
	result = result.replace(
		/\{\{([^}|]+)\|upper\}\}/g,
		( match, varName ) => {
			const key = `PLACEHOLDER}`;
			const value = values[ key ] ?? DRY_RUN_VALUES[ key ];

			if ( ! value ) {
				return match;
			}

			return value.toUpperCase().replace( /-/g, '_' );
		}
	);

	// Replace any remaining placeholders with a safe fallback to avoid leaking PLACEHOLDER tokens.
	result = result.replace( /\{\{[^}]+\}\}/g, 'PLACEHOLDER' );

	return result;
}

/**
 * Replace mustache variables in a file
 *
 * @param {string} filePath - Path to the file
 * @param {Object} values   - Optional custom values
 * @return {string} Content with variables replaced
 */
function replaceMustacheVarsInFile( filePath, values = DRY_RUN_VALUES ) {
	const fs = require( 'fs' );
	const content = fs.readFileSync( filePath, 'utf8' );
	return replaceMustacheVars( content, values );
}

/**
 * Get list of files with mustache variables
 *
 * @param {string} pattern - Glob pattern (optional)
 * @return {Array} Array of file paths
 */
function getFilesWithMustacheVars(
	pattern = '**/*.{js,jsx,php,json,scss,css,html}'
) {
	const glob = require( 'glob' );
	const fs = require( 'fs' );
	const path = require( 'path' );

	const baseDir = path.resolve( __dirname, '..' );
	const matches = glob.sync( pattern, {
		cwd: baseDir,
		ignore: [ 'node_modules/**', 'vendor/**', 'build/**', '.git/**' ],
		nodir: true,
		follow: true,
	} );

	return matches
		.map( ( relativePath ) => path.join( baseDir, relativePath ) )
		.filter( ( absolutePath ) => {
			const stat = fs.statSync( absolutePath );
			if ( ! stat.isFile() ) {
				return false;
			}
			const content = fs.readFileSync( absolutePath, 'utf8' );
			return /\{\{[a-z_]+\}\}/i.test( content );
		} )
		.map( ( absolutePath ) =>
			path.relative( baseDir, absolutePath ).replace( /\\/g, '/' )
		);
}

module.exports = {
	DRY_RUN_VALUES,
	getDryRunConfig,
	getDryRunValue,
	isDryRun,
	replaceMustacheVars,
	replaceMustacheVarsInFile,
	getFilesWithMustacheVars,
};

/**
 * Structured log helper for CLI output
 *
 * @param {string} level
 * @param {string} message
 */
function log( level, message ) {
	process.stdout.write( `[${ level }] ${ message }\n` );
}

/**
 * Print raw lines (including blank ones)
 *
 * @param {string} message
 */
function print( message = '' ) {
	process.stdout.write( `${ message }\n` );
}

// CLI usage
if ( require.main === module ) {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ];

	switch ( command ) {
		case 'config':
			print( JSON.stringify( getDryRunConfig(), null, 2 ) );
			break;

		case 'value':
			print( getDryRunValue( args[ 1 ] ) );
			break;

		case 'files':
			print( getFilesWithMustacheVars( args[ 1 ] ).join( '\n' ) );
			break;

		case 'replace':
			if ( args[ 1 ] ) {
				print( replaceMustacheVarsInFile( args[ 1 ] ) );
			} else {
				log( 'ERROR', 'Please provide a file path for replacement' );
				process.exit( 1 );
			}
			break;

		default:
			print(
				`
Dry Run Configuration Tool

Usage:
  node scripts/dry-run/dry-run-config.js [command] [arguments]

Commands:
  config           Output full configuration as JSON
  value <key>      Get a specific configuration value
  files [pattern]  List files containing mustache variables
  replace <file>   Replace mustache variables in a file

Examples:
  node scripts/dry-run/dry-run-config.js config
  node scripts/dry-run/dry-run-config.js value slug
  node scripts/dry-run/dry-run-config.js files "src/**/*.js"
  node scripts/dry-run/dry-run-config.js replace src/index.js
				`.trim()
			);
			if ( args.length === 0 ) {
				process.exit( 0 );
			}
			break;
	}
}
