#!/usr/bin/env node

/**
 * bin/test-placeholders.js
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
	'{{theme_slug}}': 'block-theme-scaffold',
	'{{theme_name}}': 'Block Theme Scaffold',
	'{{description}}': 'A modern WordPress block theme scaffold with full site editing support',
	'{{author}}': 'LightSpeed',
	'{{author_uri}}': 'https://lightspeedwp.com',
	'{{version}}': '1.0.0',
	'{{theme_uri}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{theme_tags}}': 'block-theme, full-site-editing, accessibility-ready',

	// WordPress requirements
	'{{min_wp_version}}': '6.0',
	'{{tested_wp_version}}': '6.9',
	'{{min_php_version}}': '7.4',

	// License information
	'{{license}}': 'GPL-2.0-or-later',
	'{{license_uri}}': 'https://www.gnu.org/licenses/gpl-2.0.html',

	// URLs and contact
	'{{theme_repo_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{support_url}}': 'https://wordpress.org/support/theme/block-theme-scaffold',
	'{{support_email}}': 'support@lightspeedwp.com',
	'{{security_email}}': 'security@lightspeedwp.com',
	'{{business_email}}': 'contact@lightspeedwp.com',
	'{{docs_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold/wiki',
	'{{docs_repo_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
	'{{discord_url}}': 'https://discord.gg/lightspeedwp',
	'{{custom_dev_url}}': 'https://lightspeedwp.com',
	'{{premium_support_url}}': 'https://lightspeedwp.com/support',
	'{{changelog_url}}':
		'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md',

	// Namespace (used in PHP and JS)
	'{{namespace}}': 'block_theme_scaffold',

	// Color palette
	'{{primary_color}}': '#0073aa',
	'{{secondary_color}}': '#005177',
	'{{background_color}}': '#ffffff',
	'{{text_color}}': '#1e1e1e',
	'{{accent_color}}': '#d63638',
	'{{neutral_color}}': '#757575',

	// Typography - Font families
	'{{heading_font_family}}':
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	'{{heading_font_name}}': 'System Sans',
	'{{body_font_family}}': 'Georgia, "Times New Roman", Times, serif',
	'{{body_font_name}}': 'System Serif',
	'{{mono_font_family}}': '"Courier New", Courier, monospace',
	'{{mono_font_name}}': 'Monospace',

	// Typography - Font properties
	'{{heading_font_weight}}': '700',
	'{{heading_line_height}}': '1.2',
	'{{body_line_height}}': '1.6',
	'{{button_font_weight}}': '600',
	'{{button_border_radius}}': '4px',
	'{{site_title_font_weight}}': '700',

	// Layout dimensions
	'{{content_width}}': '640px',
	'{{wide_width}}': '1200px',

	// Dates
	'{{year}}': new Date().getFullYear().toString(),
	'{{created_date}}': new Date().toISOString(),
	'{{updated_date}}': new Date().toISOString(),

	// JavaScript/UI specific
	'{{skip_link_text}}': 'Skip to content',
	'{{theme_slug|camelCase}}': 'blockThemeScaffold',
};

/**
 * Replace all mustache placeholders in a string with test values.
 *
 * @param {string} content - The content containing mustache placeholders
 * @returns {string} Content with placeholders replaced
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
 * @returns {boolean} True if scaffold mode detected
 */
function isScaffoldMode(packageJsonPath) {
	try {
		const fs = require('fs');
		const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
		return packageJson.includes('{{theme_slug}}');
	} catch (error) {
		// If we can't read the file, assume scaffold mode for safety
		return true;
	}
}

/**
 * Get a specific placeholder value.
 *
 * @param {string} key - The placeholder key (e.g., '{{theme_slug}}')
 * @returns {string|undefined} The test value or undefined if not found
 */
function getPlaceholder(key) {
	return testPlaceholders[key];
}

/**
 * Get all placeholder keys.
 *
 * @returns {string[]} Array of all placeholder keys
 */
function getPlaceholderKeys() {
	return Object.keys(testPlaceholders);
}

/**
 * Get all placeholder values.
 *
 * @returns {Object} Object containing all placeholder key-value pairs
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
				console.error('Usage: node test-placeholders.js get {{placeholder}}');
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
			console.log('  node test-placeholders.js list          - List all placeholder keys');
			console.log(
				'  node test-placeholders.js get {{key}}   - Get value for specific key'
			);
			console.log('  node test-placeholders.js json          - Output all as JSON');
			console.log(
				'  node test-placeholders.js check [path]  - Check if in scaffold mode'
			);
			break;
	}
}
