#!/usr/bin/env node

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
const testPlaceholders = {
	// Theme identification
	'block-theme-scaffold': 'block-theme-scaffold',
	'Block Theme Scaffold': 'Block Theme Scaffold',
	'A modern WordPress block theme scaffold with full site editing support':
		'A modern WordPress block theme scaffold with full site editing support',
	'LightSpeed': 'LightSpeed',
	'https://lightspeedwp.com': 'https://lightspeedwp.com',
	'1.0.0': '1.0.0',
	'https://github.com/lightspeedwp/block-theme-scaffold': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'block-theme, full-site-editing, accessibility-ready': 'block-theme, full-site-editing, accessibility-ready',

	// WordPress requirements
	'6.0': '6.0',
	'6.9': '6.9',
	'7.4': '7.4',

	// License information
	'GPL-2.0-or-later': 'GPL-2.0-or-later',
	'https://www.gnu.org/licenses/gpl-2.0.html': 'https://www.gnu.org/licenses/gpl-2.0.html',

	// URLs and contact
	'https://github.com/lightspeedwp/block-theme-scaffold':
		'https://github.com/lightspeedwp/block-theme-scaffold',
	'https://wordpress.org/support/theme/block-theme-scaffold':
		'https://wordpress.org/support/theme/block-theme-scaffold',
	'support@lightspeedwp.com': 'support@lightspeedwp.com',
	'security@lightspeedwp.com': 'security@lightspeedwp.com',
	'contact@lightspeedwp.com': 'contact@lightspeedwp.com',
	'https://github.com/lightspeedwp/block-theme-scaffold/wiki': 'https://github.com/lightspeedwp/block-theme-scaffold/wiki',
	'https://github.com/lightspeedwp/block-theme-scaffold': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'https://discord.gg/lightspeedwp': 'https://discord.gg/lightspeedwp',
	'https://lightspeedwp.com': 'https://lightspeedwp.com',
	'https://lightspeedwp.com/support': 'https://lightspeedwp.com/support',
	'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md':
		'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md',

	// Namespace (used in PHP and JS)
	'block_theme_scaffold': 'block_theme_scaffold',

	// Color palette
	'#0073aa': '#0073aa',
	'#005177': '#005177',
	'#ffffff': '#ffffff',
	'#1e1e1e': '#1e1e1e',
	'#d63638': '#d63638',
	'#757575': '#757575',

	// Typography - Font families
	'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif':
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	'System Sans': 'System Sans',
	'Georgia, "Times New Roman", Times, serif': 'Georgia, "Times New Roman", Times, serif',
	'System Serif': 'System Serif',
	'"Courier New", Courier, monospace': '"Courier New", Courier, monospace',
	'Monospace': 'Monospace',

	// Typography - Font properties
	'700': '700',
	'1.2': '1.2',
	'1.6': '1.6',
	'600': '600',
	'4px': '4px',
	'700': '700',

	// Layout dimensions
	'640px': '640px',
	'1200px': '1200px',

	// Dates
	'2025': new Date().getFullYear().toString(),
	'2025-12-11T12:06:10.210Z': new Date().toISOString(),
	'2025-12-11T12:06:10.210Z': new Date().toISOString(),

	// JavaScript/UI specific
	'Skip to content': 'Skip to content',
	'blockThemeScaffold': 'blockThemeScaffold',
};

/**
 * Replace all mustache placeholders in a string with test values.
 *
 * @param {string} content - The content containing mustache placeholders
 * @return {string} Content with placeholders replaced
 */
function replacePlaceholders(content) {
	let result = content;
	for (const [key, value] of Object.entries(testPlaceholders)) {
		result = result.split(key).join(value);
	}
	return result;
}

/**
 * Check if the current project is in scaffold mode (has mustache variables).
 *
 * @param {string} packageJsonPath - Path to package.json
 * @return {boolean} True if scaffold mode detected
 */
function isScaffoldMode(packageJsonPath) {
	try {
		const fs = require('fs');
		const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
		return packageJson.includes('block-theme-scaffold');
	} catch (error) {
		// If we can't read the file, assume scaffold mode for safety
		return true;
	}
}

/**
 * Get a specific placeholder value.
 *
 * @param {string} key - The placeholder key (e.g., 'block-theme-scaffold')
 * @return {string|undefined} The test value or undefined if not found
 */
function getPlaceholder(key) {
	return testPlaceholders[key];
}

/**
 * Get all placeholder keys.
 *
 * @return {string[]} Array of all placeholder keys
 */
function getPlaceholderKeys() {
	return Object.keys(testPlaceholders);
}

/**
 * Get all placeholder values.
 *
 * @return {Object} Object containing all placeholder key-value pairs
 */
function getAllPlaceholders() {
	return { ...testPlaceholders };
}

// Export for use in other scripts
module.exports = {
	testPlaceholders,
	replacePlaceholders,
	isScaffoldMode,
	getPlaceholder,
	getPlaceholderKeys,
	getAllPlaceholders,
};

// If run directly, output JSON for shell scripts to consume
if (require.main === module) {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case 'list':
			// List all placeholder keys
			console.log(getPlaceholderKeys().join('\n'));
			break;

		case 'get':
			// Get a specific placeholder value
			if (args[1]) {
				const value = getPlaceholder(args[1]);
				if (value !== undefined) {
					console.log(value);
				} else {
					console.error(`Placeholder not found: ${args[1]}`);
					process.exit(1);
				}
			} else {
				console.error(
					'Usage: node test-placeholders.js get {{placeholder}}'
				);
				process.exit(1);
			}
			break;

		case 'json':
			// Output all placeholders as JSON
			console.log(JSON.stringify(testPlaceholders, null, 2));
			break;

		case 'check':
			// Check if in scaffold mode
			const packageJsonPath = args[1] || '../package.json';
			const inScaffoldMode = isScaffoldMode(packageJsonPath);
			console.log(inScaffoldMode ? 'true' : 'false');
			process.exit(inScaffoldMode ? 0 : 1);
			break;

		default:
			console.log('Test Placeholder Utilities');
			console.log('');
			console.log('Usage:');
			console.log(
				'  node test-placeholders.js list          - List all placeholder keys'
			);
			console.log(
				'  node test-placeholders.js get {{key}}   - Get value for specific key'
			);
			console.log(
				'  node test-placeholders.js json          - Output all as JSON'
			);
			console.log(
				'  node test-placeholders.js check [path]  - Check if in scaffold mode'
			);
			break;
	}
}
