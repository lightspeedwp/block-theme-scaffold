/**
 * scripts/test-placeholders.js
 *
 * Centralized test placeholder values for mustache variables.
 * Used by lint-dry-run and pre-commit hooks to enable testing
 * of scaffold templates without full theme generation.
 *
 * @module test-placeholders
 */

/**
 * Test values for all mustache variables used in the scaffold.
 * These values allow linting and testing to run successfully
 * on template files before theme generation.
 */
const PLACEHOLDER_MAP = {
	// Theme identification
	'PLACEHOLDER': 'block-theme-scaffold',
	'PLACEHOLDER': 'Block Theme Scaffold',
	'A multi-block WordPress plugin scaffold example':
		'A modern WordPress block theme scaffold with full site editing support',
	'Example Author': 'LightSpeed',
	'https://example.com': 'https://lightspeedwp.com',
	'1.0.0': '1.0.0',
	'PLACEHOLDER': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'PLACEHOLDER': 'block-theme, full-site-editing, accessibility-ready',

	// WordPress requirements
	'PLACEHOLDER': '6.0',
	'PLACEHOLDER': '6.9',
	'PLACEHOLDER': '7.4',

	// License information
	'GPL-2.0-or-later': 'GPL-2.0-or-later',
	'https://www.gnu.org/licenses/gpl-2.0.html': 'https://www.gnu.org/licenses/gpl-2.0.html',

	// URLs and contact
	'PLACEHOLDER':
		'https://github.com/lightspeedwp/block-theme-scaffold',
	'PLACEHOLDER':
		'https://wordpress.org/support/theme/block-theme-scaffold',
	'PLACEHOLDER': 'support@lightspeedwp.com',
	'PLACEHOLDER': 'security@lightspeedwp.com',
	'PLACEHOLDER': 'contact@lightspeedwp.com',
	'PLACEHOLDER': 'https://github.com/lightspeedwp/block-theme-scaffold/wiki',
	'PLACEHOLDER': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'PLACEHOLDER': 'https://discord.gg/lightspeedwp',
	'PLACEHOLDER': 'https://lightspeedwp.com',
	'PLACEHOLDER': 'https://lightspeedwp.com/support',
	'PLACEHOLDER':
		'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md',

	// Namespace (used in PHP and JS)
	'example_plugin': 'block_theme_scaffold',

	// Color palette
	'PLACEHOLDER': '#0073aa',
	'PLACEHOLDER': '#005177',
	'PLACEHOLDER': '#ffffff',
	'PLACEHOLDER': '#1e1e1e',
	'PLACEHOLDER': '#d63638',
	'PLACEHOLDER': '#757575',

	// Typography - Font families
	'PLACEHOLDER':
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	'PLACEHOLDER': 'System Sans',
	'PLACEHOLDER': 'Georgia, "Times New Roman", Times, serif',
	'PLACEHOLDER': 'System Serif',
	'PLACEHOLDER': '"Courier New", Courier, monospace',
	'PLACEHOLDER': 'Monospace',

	// Typography - Font properties
	'PLACEHOLDER': '700',
	'PLACEHOLDER': '1.2',
	'PLACEHOLDER': '1.6',
	'PLACEHOLDER': '600',
	'PLACEHOLDER': '4px',
	'PLACEHOLDER': '700',

	// Layout dimensions
	'PLACEHOLDER': '640px',
	'PLACEHOLDER': '1200px',
	'PLACEHOLDER': '640',

	// Dates
	'PLACEHOLDER': new Date().getFullYear().toString(),
	'PLACEHOLDER': new Date().toISOString(),
	'PLACEHOLDER': new Date().toISOString(),
	'PLACEHOLDER': '1200',
	'PLACEHOLDER': '675',
	'PLACEHOLDER': '600',
	'PLACEHOLDER': '400',
	'PLACEHOLDER': '1440',
	'PLACEHOLDER': '1080',
	'PLACEHOLDER': '32',
	'PLACEHOLDER': '…',

	// JavaScript/UI specific
	'PLACEHOLDER': 'Skip to content',
	'PLACEHOLDER': 'blockThemeScaffold',
};

/**
 * Replace all mustache placeholders in a string with test values.
 *
 * @param {string} content - The content containing mustache placeholders
 * @return {string} Content with placeholders replaced
 */
function replacePlaceholders( content, values = PLACEHOLDER_MAP ) {
	let result = content;
	for ( const [ key, value ] of Object.entries( values ) ) {
		result = result.split( key ).join( value );
	}
	return result;
}

/**
 * Check if the current project is in scaffold mode (has mustache variables).
 *
 * @param {string} packageJsonPath - Path to package.json
 * @return {boolean} True if scaffold mode detected
 */
function isScaffoldMode( packageJsonPath ) {
	try {
		const fs = require( 'fs' );
		const packageJson = fs.readFileSync( packageJsonPath, 'utf8' );
		return packageJson.includes( 'PLACEHOLDER' );
	} catch ( error ) {
		if ( typeof packageJsonPath === 'string' ) {
			const normalized = packageJsonPath.toLowerCase();
			if (
				normalized.includes( 'scaffold' ) ||
				normalized.includes( 'dev' ) ||
				normalized.includes( 'development' )
			) {
				return true;
			}
		}
		// Default to false when we can't read the file and path looks production-like
		return false;
	}
}

/**
 * Get a specific placeholder value.
 *
 * @param {string} key - The placeholder key (e.g., 'PLACEHOLDER')
 * @return {string|undefined} The test value or undefined if not found
 */
function getPlaceholder( key ) {
	return PLACEHOLDER_MAP[ key ];
}

/**
 * Get all placeholder keys.
 *
 * @return {string[]} Array of all placeholder keys
 */
function getPlaceholderKeys() {
	return Object.keys( PLACEHOLDER_MAP );
}

/**
 * Get all placeholder values.
 *
 * @return {Object} Object containing all placeholder key-value pairs
 */
function getAllPlaceholders() {
	return { ...PLACEHOLDER_MAP };
}

// Export for use in other scripts
module.exports = {
	PLACEHOLDER_MAP,
	replacePlaceholders,
	isScaffoldMode,
	getPlaceholder,
	getPlaceholderKeys,
	getAllPlaceholders,
};

// If run directly, output JSON for shell scripts to consume
if ( require.main === module ) {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ];

	switch ( command ) {
		case 'list':
			// List all placeholder keys
			// console.log(getPlaceholderKeys().join('\n'));
			break;

		case 'get':
			// Get a specific placeholder value
			if ( args[ 1 ] ) {
				const value = getPlaceholder( args[ 1 ] );
				if ( value !== undefined ) {
					// console.log(value);
				} else {
					// console.error(`Placeholder not found: ${args[1]}`);
					process.exit( 1 );
				}
			} else {
				// console.error(
				// 	'Usage: node test-placeholders.js get PLACEHOLDER'
				// );
				process.exit( 1 );
			}
			break;

		case 'json':
			// Output all placeholders as JSON
			// console.log(JSON.stringify(PLACEHOLDER_MAP, null, 2));
			break;

		case 'check': {
			// Check if in scaffold mode
			const packageJsonPath = args[ 1 ] || '../package.json';
			const inScaffoldMode = isScaffoldMode( packageJsonPath );
			// console.log(inScaffoldMode ? 'true' : 'false');
			process.exit( inScaffoldMode ? 0 : 1 );
			break;
		}

		default:
			// console.log('Test Placeholder Utilities');
			// console.log('');
			// console.log('Usage:');
			// console.log(
			// 	'  node test-placeholders.js list          - List all placeholder keys'
			// );
			// console.log(
			// 	'  node test-placeholders.js get PLACEHOLDER   - Get value for specific key'
			// );
			// console.log(
			// 	'  node test-placeholders.js json          - Output all as JSON'
			// );
			// console.log(
			// 	'  node test-placeholders.js check [path]  - Check if in scaffold mode'
			// );
			break;
	}
}
