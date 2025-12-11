#!/usr/bin/env node

/**
 * scripts/generate-theme.js
 *
 * Script to generate a new WordPress block theme from this scaffold, replacing all moustache placeholders.
 *
 * Uses shared configuration schema from scripts/lib/config-schema.js
 *
 * Usage:
 *   CLI Mode: node scripts/generate-theme.js --slug my-theme --name "My Theme" --author "Your Name" ...
 *   JSON Mode: node scripts/generate-theme.js --config theme-config.json
 *   Interactive: Use scripts/generate-theme.agent.js for interactive wizard
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Initialize JSON Schema validator
const ajv = new Ajv({ allErrors: true });

// Import shared configuration schema
const { CONFIG_SCHEMA } = require('./lib/config-schema');

const scaffoldDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(process.cwd(), 'output-theme');

/**
 * Sanitize user input to prevent security vulnerabilities
 * @param input
 * @param type
 */
function sanitizeInput(input, type = 'text') {
	if (!input || typeof input !== 'string') {
		return null;
	}

	// Remove null bytes and control characters
	let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

	// Handle URL type separately (URLs contain slashes and dots)
	if (type === 'url') {
		try {
			const url = new URL(sanitized);
			if (!['http:', 'https:'].includes(url.protocol)) {
				throw new Error('URL must use http or https protocol');
			}
			sanitized = url.toString();
		} catch (e) {
			throw new Error(`Invalid URL format: ${e.message}`);
		}
		return sanitized;
	}

	// Prevent path traversal (after URL check)
	if (
		sanitized.includes('..') ||
		sanitized.includes('/') ||
		sanitized.includes('\\')
	) {
		throw new Error(`Invalid input: path traversal detected in "${input}"`);
	}

	switch (type) {
		case 'slug':
			// Only allow lowercase letters, numbers, and hyphens
			sanitized = sanitized
				.toLowerCase()
				.replace(/[^a-z0-9-]/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '');
			if (!sanitized || sanitized.length < 2) {
				throw new Error(
					'Slug must be at least 2 characters long and contain only letters, numbers, and hyphens'
				);
			}
			break;
		case 'name':
			// Allow alphanumeric and common punctuation
			sanitized = sanitized.replace(/[^a-zA-Z0-9 \-_.,']/g, '').trim();
			if (!sanitized || sanitized.length < 2) {
				throw new Error('Name must be at least 2 characters long');
			}
			break;
		case 'version':
			// Validate semver or WordPress version format
			const versionRegex = /^\d+\.\d+(\.\d+)?(-[a-zA-Z0-9.-]+)?$/;
			if (!versionRegex.test(sanitized)) {
				throw new Error(
					'Version must follow semantic versioning (e.g., 1.0.0 or 6.5)'
				);
			}
			break;
		case 'license':
			// Allow only common license identifiers
			sanitized = sanitized.replace(/[^a-zA-Z0-9.-]/g, '');
			break;
		default:
			// General text sanitization
			sanitized = sanitized.replace(/[<>"'`]/g, '').trim();
	}

	return sanitized;
}

const args = process.argv.slice(2);
const argMap = {};
args.forEach((arg, i) => {
	if (arg.startsWith('--')) {
		argMap[arg.replace('--', '')] = args[i + 1];
	}
});

/**
 * Validate configuration against JSON schema
 *
 * @param {Object} config - Configuration object to validate
 * @return {boolean} True if valid, exits process if invalid
 */
function validateAgainstSchema(config) {
	try {
		const schema = require('../.github/schemas/theme-config.schema.json');
		const validate = ajv.compile(schema);
		const valid = validate(config);

		if (!valid) {
			console.error('\n❌ Configuration validation errors:\n');
			validate.errors.forEach((err) => {
				const path = err.instancePath || 'root';
				const message = err.message;
				const value =
					err.params.limit !== undefined
						? ` (got: ${JSON.stringify(err.data)})`
						: '';
				console.error(`  ${path}: ${message}${value}`);
			});
			return false;
		}

		console.log('✓ Configuration validated against schema');
		return true;
	} catch (error) {
		console.warn(`⚠️  Schema validation skipped: ${error.message}`);
		return true; // Don't fail if schema file missing
	}
}

/**
 * Load configuration from JSON file
 * @param configPath
 */
function loadConfig(configPath) {
	try {
		const absolutePath = path.isAbsolute(configPath)
			? configPath
			: path.resolve(process.cwd(), configPath);

		if (!fs.existsSync(absolutePath)) {
			throw new Error(`Configuration file not found: ${absolutePath}`);
		}

		const configContent = fs.readFileSync(absolutePath, 'utf8');
		const config = JSON.parse(configContent);

		// Validate against schema
		if (!validateAgainstSchema(config)) {
			throw new Error('Configuration failed schema validation');
		}

		// Validate required fields (backup validation)
		if (!config.theme_slug || !config.theme_name || !config.author) {
			throw new Error(
				'Configuration must include theme_slug, theme_name, and author'
			);
		}

		console.log(
			`✓ Loaded configuration from ${path.basename(absolutePath)}`
		);
		return config;
	} catch (error) {
		throw new Error(`Failed to load configuration: ${error.message}`);
	}
}

/**
 * Flatten nested config object to mustache variables
 * @param config
 * @param prefix
 */
function flattenConfig(config, prefix = '') {
	const flattened = {};

	for (const [key, value] of Object.entries(config)) {
		const newKey = prefix ? `${prefix}_${key}` : key;

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			Object.assign(flattened, flattenConfig(value, newKey));
		} else if (Array.isArray(value)) {
			// Skip arrays for now - these are structural config, not mustache variables
			continue;
		} else {
			flattened[newKey] = value;
		}
	}

	return flattened;
}

try {
	let configData = {};

	// Check if config file provided
	if (argMap.config) {
		const rawConfig = loadConfig(argMap.config);
		configData = flattenConfig(rawConfig);
	}

	// Override with CLI arguments (CLI takes precedence over config file)
	Object.keys(argMap).forEach((key) => {
		if (key !== 'config' && argMap[key]) {
			configData[key] = argMap[key];
		}
	});

	const author =
		sanitizeInput(configData.author || argMap.author, 'name') ||
		'Author Name';
	const authorUri =
		sanitizeInput(configData.author_uri || argMap.author_uri, 'url') ||
		'https://example.com';
	const themeSlug =
		sanitizeInput(configData.theme_slug || argMap.slug, 'slug') ||
		'my-theme';

	const placeholders = {
		'block-theme-scaffold': themeSlug,
		'Block Theme Scaffold':
			sanitizeInput(configData.theme_name || argMap.name, 'name') ||
			'My Theme',
		'A modern WordPress block theme scaffold with full site editing support':
			sanitizeInput(
				configData.description || argMap.description,
				'text'
			) || 'A WordPress block theme.',
		'LightSpeed': author,
		'https://lightspeedwp.com': authorUri,
		'1.0.0':
			sanitizeInput(configData.version || argMap.version, 'version') ||
			'1.0.0',
		'https://github.com/lightspeedwp/block-theme-scaffold':
			sanitizeInput(configData.theme_uri || argMap.theme_uri, 'url') ||
			'https://example.com/theme',
		'6.0':
			sanitizeInput(
				configData.min_wp_version || argMap.min_wp_version,
				'version'
			) || '6.5',
		'6.9':
			sanitizeInput(
				configData.tested_wp_version || argMap.tested_wp_version,
				'version'
			) || '6.7',
		'7.4':
			sanitizeInput(
				configData.min_php_version || argMap.min_php_version,
				'version'
			) || '8.0',
		'GPL-2.0-or-later':
			sanitizeInput(configData.license || argMap.license, 'license') ||
			'GPL-2.0-or-later',
		'https://www.gnu.org/licenses/gpl-2.0.html':
			sanitizeInput(
				configData.license_uri || argMap.license_uri,
				'url'
			) || 'https://www.gnu.org/licenses/gpl-2.0.html',
		'https://github.com/lightspeedwp/block-theme-scaffold':
			sanitizeInput(
				configData.theme_repo_url || argMap.theme_repo_url,
				'url'
			) || `https://github.com/${author}/${themeSlug}`,
		'block_theme_scaffold': themeSlug.replace(/-/g, '_'),
		'https://wordpress.org/support/theme/block-theme-scaffold': `https://wordpress.org/support/theme/${themeSlug}`,
		'support@lightspeedwp.com': `support@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'security@lightspeedwp.com': `security@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'contact@lightspeedwp.com': `contact@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'https://github.com/lightspeedwp/block-theme-scaffold/wiki': `https://github.com/${author}/${themeSlug}/wiki`,
		'https://github.com/lightspeedwp/block-theme-scaffold': `https://github.com/${author}/${themeSlug}`,
		'https://discord.gg/lightspeedwp': authorUri,
		'https://lightspeedwp.com': authorUri,
		'https://lightspeedwp.com/support': authorUri,
		// Design system variables
		'#0073aa':
			configData.design_system_colors_primary_color || '#0073aa',
		'#005177':
			configData.design_system_colors_secondary_color || '#005177',
		'#ffffff':
			configData.design_system_colors_background_color || '#ffffff',
		'#1e1e1e':
			configData.design_system_colors_text_color || '#1a1a1a',
		'#d63638':
			configData.design_system_colors_accent_color || '#ff6b35',
		'#757575':
			configData.design_system_colors_neutral_color || '#6c757d',
		'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif':
			configData.design_system_typography_heading_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'System Sans':
			configData.design_system_typography_heading_font_name ||
			'System Font',
		'Georgia, "Times New Roman", Times, serif':
			configData.design_system_typography_body_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'System Serif':
			configData.design_system_typography_body_font_name || 'System Font',
		'700':
			configData.design_system_typography_heading_font_weight || '700',
		'1.6':
			configData.design_system_typography_body_line_height || '1.6',
		'1.2':
			configData.design_system_typography_heading_line_height || '1.2',
		'600':
			configData.design_system_typography_button_font_weight || '600',
		'700':
			configData.design_system_typography_site_title_font_weight || '700',
		'640px':
			configData.design_system_layout_content_width || '720px',
		'1200px':
			configData.design_system_layout_wide_width || '1200px',
		'{{content_width_px}}': (
			configData.design_system_layout_content_width || '720px'
		).replace(/[^\d]/g, ''),
		'4px':
			configData.content_button_border_radius || '4px',
		'{{excerpt_more}}': configData.content_excerpt_more || '...',
		'Skip to content':
			configData.content_skip_link_text || 'Skip to content',
	};

	// Validate that placeholders aren't using defaults when user provided input
	if (argMap.author && placeholders['LightSpeed'] === 'Author Name') {
		throw new Error('Invalid author name provided');
	}

	function showHelp() {
		console.log(`
WordPress Block Theme Generator
================================

Generate a custom WordPress block theme from the scaffold.

USAGE:
  JSON Config Mode (Recommended):
    node bin/generate-theme.js --config theme-config.json

  CLI Mode:
    node bin/generate-theme.js --slug SLUG --name "NAME" --author "AUTHOR" [OPTIONS]

  Help:
    node bin/generate-theme.js --help

MODES:

  1. JSON Config Mode (Recommended for complex themes)
     Create a theme-config.json file based on theme-config.template.json

     Example:
       cp theme-config.template.json my-theme-config.json
       # Edit my-theme-config.json with your values
       node bin/generate-theme.js --config my-theme-config.json

  2. CLI Mode (Quick generation with minimal customization)
     Pass arguments directly via command line

     Example:
       node bin/generate-theme.js \\
         --slug tour-operator \\
         --name "Tour Operator" \\
         --author "LightSpeed" \\
         --author_uri "https://developer.lsdev.biz"

REQUIRED ARGUMENTS (CLI Mode):
  --slug SLUG              Theme slug (lowercase, hyphens only)
  --name "NAME"            Theme display name
  --author "AUTHOR"        Author/organization name

OPTIONAL ARGUMENTS (CLI Mode):
  --description "TEXT"     Theme description
  --author_uri "URL"       Author website URL
  --version "X.Y.Z"        Starting version (default: 1.0.0)
  --min_wp_version "X.Y"   Min WordPress version (default: 6.5)
  --tested_wp_version "X.Y" Tested WordPress version (default: 6.7)
  --min_php_version "X.Y"  Min PHP version (default: 8.0)

CONFIGURATION FILE FORMAT:
  See theme-config.template.json for full schema
  See theme-config.example.json for a complete example

  JSON config supports:
    - Core identity (slug, name, author, etc.)
    - Design system (colors, typography, spacing)
    - Theme structure (templates, patterns, style variations)
    - Features (editor styles, post thumbnails, etc.)
    - Content strings (excerpt settings, copyright, etc.)

EXAMPLES:

  Generate from config file:
    node bin/generate-theme.js --config theme-config.json

  Quick CLI generation:
    node bin/generate-theme.js \\
      --slug my-theme \\
      --name "My Theme" \\
      --author "Jane Developer" \\
      --author_uri "https://jane.dev"

  Override config with CLI:
    node bin/generate-theme.js \\
      --config theme-config.json \\
      --version "2.0.0"

OUTPUT:
  Generated theme will be in: ./output-theme/

POST-GENERATION:
  cd output-theme
  npm install
  composer install
  npm run start

For more information, see:
  - docs/GENERATE_THEME.md
  - .github/instructions/generate-theme.instructions.md
`);
	}

	function replacePlaceholders(content) {
		let result = content;
		for (const [key, value] of Object.entries(placeholders)) {
			result = result.split(key).join(value);
		}
		return result;
	}

	function copyAndReplace(src, dest) {
		const stat = fs.statSync(src);
		if (stat.isDirectory()) {
			if (!fs.existsSync(dest)) {
				fs.mkdirSync(dest);
			}
			for (const file of fs.readdirSync(src)) {
				// Skip node_modules, dist, .git, output-theme
				if (
					['node_modules', 'dist', '.git', 'output-theme'].includes(
						file
					)
				) {
					continue;
				}
				copyAndReplace(
					path.join(src, file),
					path.join(
						dest,
						file.replace(
							'block-theme-scaffold',
							placeholders['block-theme-scaffold']
						)
					)
				);
			}
		} else {
			let content = fs.readFileSync(src, 'utf8');
			content = replacePlaceholders(content);
			fs.writeFileSync(dest, content);
		}
	}

	function main() {
		// Show help if requested
		if (argMap.help || argMap.h) {
			showHelp();
			process.exit(0);
		}

		if (fs.existsSync(outputDir)) {
			console.error(
				`Output directory ${outputDir} already exists. Remove it or choose another location.`
			);
			process.exit(1);
		}
		fs.mkdirSync(outputDir);
		// Copy everything except node_modules, dist, .git, output-theme
		for (const file of fs.readdirSync(scaffoldDir)) {
			if (
				[
					'node_modules',
					'dist',
					'.git',
					'output-theme',
					'bin',
				].includes(file)
			) {
				continue;
			}
			copyAndReplace(
				path.join(scaffoldDir, file),
				path.join(
					outputDir,
					file.replace(
						'block-theme-scaffold',
						placeholders['block-theme-scaffold']
					)
				)
			);
		}
		// Copy bin directory but skip generate-theme.js itself
		const binSrc = path.join(scaffoldDir, 'bin');
		const binDest = path.join(outputDir, 'bin');
		fs.mkdirSync(binDest);
		for (const file of fs.readdirSync(binSrc)) {
			if (file === 'generate-theme.js') {
				continue;
			}
			copyAndReplace(path.join(binSrc, file), path.join(binDest, file));
		}

		console.log(`
✓ Theme generated successfully!

Location: ${outputDir}

Theme Details:
  Name: ${placeholders['Block Theme Scaffold']}
  Slug: ${placeholders['block-theme-scaffold']}
  Author: ${placeholders['LightSpeed']}
  Version: ${placeholders['1.0.0']}

Next Steps:
  1. Navigate to theme directory:
     cd ${path.basename(outputDir)}

  2. Install dependencies:
     npm install
     composer install

  3. Start development:
     npm run start

  4. Build for production:
     npm run build

  5. Install in WordPress:
     - Copy ${path.basename(outputDir)}/ to wp-content/themes/
     - Activate in WordPress admin

For documentation, see:
  - README.md (theme overview)
  - DEVELOPMENT.md (development workflow)
  - docs/ (complete documentation)
`);
	}

	main();
} catch (error) {
	console.error(`❌ Error: ${error.message}`);
	process.exit(1);
}
