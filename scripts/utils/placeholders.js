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
  '{{theme_slug}}': 'block-theme-scaffold',
  '{{theme_name}}': 'Block Theme Scaffold',
  '{{description}}': 'A modern WordPress block theme scaffold with full site editing support',
  '{{author}}': 'LightSpeed',
  '{{author_uri}}': 'https://lightspeedwp.com',
  '{{version}}': '1.0.0',
  '{{theme_uri}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
  '{{tags}}': 'block-theme, full-site-editing, accessibility-ready',

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
  '{{security_email}}': 'security@lightspeedwp.com',
  '{{contact_email}}': 'contact@lightspeedwp.com',
  '{{docs_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold/wiki',
  '{{changelog_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold',
  '{{discord_url}}': 'https://discord.gg/lightspeedwp',
  '{{site_url}}': 'https://lightspeedwp.com',
  '{{support_site_url}}': 'https://lightspeedwp.com/support',
  '{{changelog_md_url}}': 'https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/CHANGELOG.md',

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
  '{{heading_font_family}}': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '{{heading_font_name}}': 'System Sans',
  '{{body_font_family}}': 'Georgia, "Times New Roman", Times, serif',
  '{{body_font_name}}': 'System Serif',
  '{{monospace_font_family}}': '"Courier New", Courier, monospace',
  '{{monospace_font_name}}': 'Monospace',

  // Typography - Font properties
  '{{heading_font_weight}}': '700',
  '{{heading_line_height}}': '1.2',
  '{{body_line_height}}': '1.6',
  '{{button_font_weight}}': '600',
  '{{button_border_radius}}': '4px',
  '{{site_title_font_weight}}': '700',

  // Layout dimensions
  '{{content_width_px}}': '640px',
  '{{wide_width_px}}': '1200px',
  '{{content_width_num}}': '640',

  // Dates
  '{{year}}': new Date().getFullYear().toString(),
  '{{iso_date}}': new Date().toISOString(),
  '{{iso_date2}}': new Date().toISOString(),

  // Image sizes
  '{{featured_image_width}}': '1200',
  '{{featured_image_height}}': '675',
  '{{gallery_image_width}}': '600',
  '{{gallery_image_height}}': '400',
  '{{thumbnail_width}}': '1440',
  '{{thumbnail_height}}': '1080',
  '{{logo_width}}': '250',
  '{{logo_height}}': '100',

  // Excerpt settings
  '{{excerpt_length}}': '32',
  '{{excerpt_more}}': '…',
  '{{archive_excerpt_length}}': '32',

  // JavaScript/UI specific
  '{{skip_link_text}}': 'Skip to content',
  '{{js_namespace}}': 'blockThemeScaffold',
};

/**
 * Replace all mustache placeholders in a string with test values.
 *
 * @param {string} content - The content containing mustache placeholders
 * @return {string} Content with placeholders replaced
 */
function replacePlaceholders(content, values = PLACEHOLDER_MAP) {
	let result = content;
	for (const [key, value] of Object.entries(values)) {
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
		return packageJson.includes('PLACEHOLDER');
	} catch (error) {
		if (typeof packageJsonPath === 'string') {
			const normalized = packageJsonPath.toLowerCase();
			if (
				normalized.includes('scaffold') ||
				normalized.includes('dev') ||
				normalized.includes('development')
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
function getPlaceholder(key) {
	return PLACEHOLDER_MAP[key];
}

/**
 * Get all placeholder keys.
 *
 * @return {string[]} Array of all placeholder keys
 */
function getPlaceholderKeys() {
	return Object.keys(PLACEHOLDER_MAP);
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
if (require.main === module) {
	const args = process.argv.slice(2);
	const command = args[0];

	switch (command) {
		case 'list':
			// List all placeholder keys
			// console.log(getPlaceholderKeys().join('\n'));
			break;

		case 'get':
			// Get a specific placeholder value
			if (args[1]) {
				const value = getPlaceholder(args[1]);
				if (value !== undefined) {
					// console.log(value);
				} else {
					// console.error(`Placeholder not found: ${args[1]}`);
					process.exit(1);
				}
			} else {
				// console.error(
				// 	'Usage: node test-placeholders.js get PLACEHOLDER'
				// );
				process.exit(1);
			}
			break;

		case 'json':
			// Output all placeholders as JSON
			// console.log(JSON.stringify(PLACEHOLDER_MAP, null, 2));
			break;

		case 'check': {
			// Check if in scaffold mode
			const packageJsonPath = args[1] || '../package.json';
			const inScaffoldMode = isScaffoldMode(packageJsonPath);
			// console.log(inScaffoldMode ? 'true' : 'false');
			process.exit(inScaffoldMode ? 0 : 1);
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
