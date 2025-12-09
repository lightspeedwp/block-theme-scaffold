#!/usr/bin/env node

/**
 * bin/generate-theme.js
 *
 * Script to generate a new WordPress block theme from this scaffold, replacing all moustache placeholders.
 *
 * Usage:
 *   CLI Mode: node bin/generate-theme.js --slug my-theme --name "My Theme" --author "Your Name" ...
 *   JSON Mode: node bin/generate-theme.js --config theme-config.json
 *   Interactive: node bin/generate-theme.js (wizard mode - not yet implemented, use CLI or JSON)
 */

const fs = require('fs');
const path = require('path');

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

	// Prevent path traversal
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
		case 'url':
			// Basic URL validation
			try {
				const url = new URL(sanitized);
				if (!['http:', 'https:'].includes(url.protocol)) {
					throw new Error('URL must use http or https protocol');
				}
				sanitized = url.toString();
			} catch (e) {
				throw new Error(`Invalid URL format: ${e.message}`);
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

		// Validate required fields
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
		'{{theme_slug}}': themeSlug,
		'{{theme_name}}':
			sanitizeInput(configData.theme_name || argMap.name, 'name') ||
			'My Theme',
		'{{description}}':
			sanitizeInput(
				configData.description || argMap.description,
				'text'
			) || 'A WordPress block theme.',
		'{{author}}': author,
		'{{author_uri}}': authorUri,
		'{{version}}':
			sanitizeInput(configData.version || argMap.version, 'version') ||
			'1.0.0',
		'{{theme_uri}}':
			sanitizeInput(configData.theme_uri || argMap.theme_uri, 'url') ||
			'https://example.com/theme',
		'{{min_wp_version}}':
			sanitizeInput(
				configData.min_wp_version || argMap.min_wp_version,
				'version'
			) || '6.5',
		'{{tested_wp_version}}':
			sanitizeInput(
				configData.tested_wp_version || argMap.tested_wp_version,
				'version'
			) || '6.7',
		'{{min_php_version}}':
			sanitizeInput(
				configData.min_php_version || argMap.min_php_version,
				'version'
			) || '8.0',
		'{{license}}':
			sanitizeInput(configData.license || argMap.license, 'license') ||
			'GPL-2.0-or-later',
		'{{license_uri}}':
			sanitizeInput(
				configData.license_uri || argMap.license_uri,
				'url'
			) || 'https://www.gnu.org/licenses/gpl-2.0.html',
		'{{theme_repo_url}}':
			sanitizeInput(
				configData.theme_repo_url || argMap.theme_repo_url,
				'url'
			) || `https://github.com/${author}/${themeSlug}`,
		'{{namespace}}': themeSlug.replace(/-/g, '_'),
		'{{support_url}}': `https://wordpress.org/support/theme/${themeSlug}`,
		'{{support_email}}': `support@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'{{security_email}}': `security@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'{{business_email}}': `contact@${authorUri.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
		'{{docs_url}}': `https://github.com/${author}/${themeSlug}/wiki`,
		'{{docs_repo_url}}': `https://github.com/${author}/${themeSlug}`,
		'{{discord_url}}': authorUri,
		'{{custom_dev_url}}': authorUri,
		'{{premium_support_url}}': authorUri,
		// Design system variables
		'{{primary_color}}':
			configData.design_system_colors_primary_color || '#0073aa',
		'{{secondary_color}}':
			configData.design_system_colors_secondary_color || '#005177',
		'{{background_color}}':
			configData.design_system_colors_background_color || '#ffffff',
		'{{text_color}}':
			configData.design_system_colors_text_color || '#1a1a1a',
		'{{accent_color}}':
			configData.design_system_colors_accent_color || '#ff6b35',
		'{{neutral_color}}':
			configData.design_system_colors_neutral_color || '#6c757d',
		'{{heading_font_family}}':
			configData.design_system_typography_heading_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'{{heading_font_name}}':
			configData.design_system_typography_heading_font_name ||
			'System Font',
		'{{body_font_family}}':
			configData.design_system_typography_body_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'{{body_font_name}}':
			configData.design_system_typography_body_font_name || 'System Font',
		'{{heading_font_weight}}':
			configData.design_system_typography_heading_font_weight || '700',
		'{{body_line_height}}':
			configData.design_system_typography_body_line_height || '1.6',
		'{{heading_line_height}}':
			configData.design_system_typography_heading_line_height || '1.2',
		'{{button_font_weight}}':
			configData.design_system_typography_button_font_weight || '600',
		'{{site_title_font_weight}}':
			configData.design_system_typography_site_title_font_weight || '700',
		'{{content_width}}':
			configData.design_system_layout_content_width || '720px',
		'{{wide_width}}':
			configData.design_system_layout_wide_width || '1200px',
		'{{content_width_px}}': (
			configData.design_system_layout_content_width || '720px'
		).replace(/[^\d]/g, ''),
		'{{button_border_radius}}':
			configData.content_button_border_radius || '4px',
		'{{excerpt_more}}': configData.content_excerpt_more || '...',
		'{{skip_link_text}}':
			configData.content_skip_link_text || 'Skip to content',
	};

	// Validate that placeholders aren't using defaults when user provided input
	if (argMap.author && placeholders['{{author}}'] === 'Author Name') {
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
							'{{theme_slug}}',
							placeholders['{{theme_slug}}']
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
						'{{theme_slug}}',
						placeholders['{{theme_slug}}']
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
  Name: ${placeholders['{{theme_name}}']}
  Slug: ${placeholders['{{theme_slug}}']}
  Author: ${placeholders['{{author}}']}
  Version: ${placeholders['{{version}}']}

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
