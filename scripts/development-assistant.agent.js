#!/usr/bin/env node

/**
 * Development Assistant Agent Implementation
 *
 * Interactive development assistant for WordPress block theme development
 * following the specification in .github/agents/development-assistant.agent.md
 *
 * Usage:
 *   node scripts/development-assistant.agent.js [command] [options]
 *
 * Commands:
 *   help [topic]      - Get help on a specific topic
 *   pattern <type>    - Generate or get help with patterns
 *   template <name>   - Generate or get help with templates
 *   styles [type]     - Theme.json and styling help
 *   js [function]     - JavaScript functionality help
 *   testing [type]    - Testing strategies and examples
 *   build             - Build process information
 *   mode <mode-name>  - Switch development mode
 *
 * Development Modes:
 *   pattern-authoring - Focus on block pattern creation
 *   theme-json-editing - Focus on theme.json configuration
 *   expert - Advanced PHP/JS/SCSS development
 *   testing-qa - Focus on testing and quality assurance
 *
 * Or from npm:
 *   npm run agent:dev-assistant
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
	log(colors.blue, 'ℹ️ ', ...args);
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

// Current development mode
let currentMode = 'general';

/**
 * Display main help information
 */
function showHelp(topic = null) {
	if (topic) {
		showTopicHelp(topic);
		return;
	}

	header('Development Assistant - Help');

	console.log(
		'Usage: node scripts/development-assistant.agent.js [command]\n'
	);

	console.log('Commands:\n');
	console.log('  help [topic]      Get help on a specific topic');
	console.log('  pattern <type>    Generate or get help with patterns');
	console.log('  template <name>   Generate or get help with templates');
	console.log('  styles [type]     Theme.json and styling help');
	console.log('  js [function]     JavaScript functionality help');
	console.log('  testing [type]    Testing strategies and examples');
	console.log('  build             Build process information');
	console.log('  mode <mode-name>  Switch development mode\n');

	console.log('Help Topics:\n');
	console.log('  patterns          Block pattern development');
	console.log('  templates         Template and template parts');
	console.log('  styles            Styling and theme.json');
	console.log('  js                JavaScript functionality');
	console.log('  testing           Testing strategies');
	console.log('  build             Build process\n');

	console.log('Development Modes:\n');
	console.log('  pattern-authoring   Focus on block pattern creation');
	console.log('  theme-json-editing  Focus on theme.json configuration');
	console.log('  expert              Advanced PHP/JS/SCSS development');
	console.log('  testing-qa          Focus on testing and QA\n');

	console.log('Examples:\n');
	console.log('  node scripts/development-assistant.agent.js help patterns');
	console.log('  node scripts/development-assistant.agent.js pattern hero');
	console.log('  node scripts/development-assistant.agent.js mode expert');
	console.log('  node scripts/development-assistant.agent.js testing unit\n');

	console.log(
		'Current Mode:',
		colors.cyan + currentMode + colors.reset + '\n'
	);
}

/**
 * Show topic-specific help
 */
function showTopicHelp(topic) {
	header(
		`Development Assistant - ${topic.charAt(0).toUpperCase() + topic.slice(1)} Help`
	);

	const topics = {
		patterns: {
			description:
				'Block patterns combine multiple blocks into reusable layouts',
			structure: `patterns/
├── hero.php           # Hero section pattern
├── cta.php            # Call-to-action pattern
└── testimonials.php   # Testimonial layout`,
			examples: [
				'Create hero with image and CTA',
				'Generate testimonial grid',
				'Build team member section',
			],
			commands: [
				'pattern hero - Hero pattern help',
				'pattern cta - Call-to-action help',
				'pattern testimonials - Testimonials help',
			],
		},
		templates: {
			description: 'Block templates define page layouts using HTML',
			structure: `templates/
├── index.html         # Default template
├── single.html        # Single post
├── page.html          # Pages
└── parts/
    ├── header.html    # Site header
    └── footer.html    # Site footer`,
			examples: [
				'Create custom page template',
				'Build template part',
				'Modify header/footer',
			],
			commands: [
				'template page - Page template help',
				'template single - Single post help',
				'template part - Template parts help',
			],
		},
		styles: {
			description:
				'Theme.json defines global styles, settings, and design tokens',
			structure: `theme.json              # Global configuration
styles/
├── dark.json          # Dark mode variation
├── light.json         # Light mode variation
└── blocks/
    └── button.json    # Button block styles`,
			examples: [
				'Add color palette',
				'Configure typography',
				'Create style variation',
				'Define block styles',
			],
			commands: [
				'styles colors - Color palette help',
				'styles typography - Typography help',
				'styles variations - Style variations help',
			],
		},
		js: {
			description: 'JavaScript for theme functionality and interactivity',
			structure: `src/
└── js/
    ├── theme.js       # Main theme JS
    ├── blocks/        # Block-specific JS
    └── utils/         # Utility functions`,
			examples: [
				'Add navigation toggle',
				'Implement scroll effects',
				'Create interactive blocks',
			],
			commands: [
				'js navigation - Navigation JS help',
				'js blocks - Block JS help',
				'js utils - Utility functions help',
			],
		},
		testing: {
			description: 'Testing strategies for WordPress block themes',
			structure: `tests/
├── e2e/              # Playwright E2E tests
├── unit/             # Jest unit tests
└── php/              # PHPUnit tests`,
			examples: [
				'Write block pattern tests',
				'Test theme functionality',
				'Add accessibility tests',
			],
			commands: [
				'testing unit - Unit testing help',
				'testing e2e - E2E testing help',
				'testing a11y - Accessibility testing help',
			],
		},
		build: {
			description: 'Build process and asset compilation',
			commands: [
				'npm run build - Production build',
				'npm run dev - Development build',
				'npm run watch - Watch mode',
			],
			info: [
				'Uses @wordpress/scripts for building',
				'Compiles SCSS to CSS',
				'Bundles and minifies JavaScript',
				'Optimizes assets for production',
			],
		},
	};

	const topicData = topics[topic];

	if (!topicData) {
		error(`Unknown topic: ${topic}`);
		info(
			'Available topics: patterns, templates, styles, js, testing, build'
		);
		return;
	}

	console.log(colors.bold + 'Description:\n' + colors.reset);
	console.log(topicData.description + '\n');

	if (topicData.structure) {
		console.log(colors.bold + 'File Structure:\n' + colors.reset);
		console.log(topicData.structure + '\n');
	}

	if (topicData.examples) {
		console.log(colors.bold + 'Examples:\n' + colors.reset);
		topicData.examples.forEach((example) => {
			console.log(`  • ${example}`);
		});
		console.log();
	}

	if (topicData.commands) {
		console.log(colors.bold + 'Commands:\n' + colors.reset);
		topicData.commands.forEach((cmd) => {
			console.log(`  $ ${cmd}`);
		});
		console.log();
	}

	if (topicData.info) {
		console.log(colors.bold + 'Info:\n' + colors.reset);
		topicData.info.forEach((item) => {
			console.log(`  • ${item}`);
		});
		console.log();
	}

	console.log(colors.blue + `Run 'help' for more topics\n` + colors.reset);
}

/**
 * Pattern help and generation
 */
function patternHelp(type = null) {
	header(`Development Assistant - Pattern Help`);

	if (!type) {
		console.log('Common block patterns:\n');
		console.log('  hero          - Hero section with image and CTA');
		console.log('  cta           - Call-to-action block');
		console.log('  testimonials  - Testimonial grid or carousel');
		console.log('  team          - Team member grid');
		console.log('  gallery       - Image gallery layouts');
		console.log('  pricing       - Pricing table patterns\n');

		console.log('Usage:');
		console.log('  pattern <type> - Get specific pattern help\n');
		return;
	}

	const patterns = {
		hero: {
			description:
				'Hero section pattern with heading, text, image, and CTA',
			file: 'patterns/hero.php',
			blocks: [
				'core/cover',
				'core/heading',
				'core/paragraph',
				'core/buttons',
			],
			example: `<!-- wp:cover -->
<div class="wp-block-cover">
  <!-- wp:heading {"level":1} -->
  <h1>Welcome to Our Theme</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph -->
  <p>Build amazing websites with blocks</p>
  <!-- /wp:paragraph -->

  <!-- wp:buttons -->
  <div class="wp-block-buttons">
    <!-- wp:button -->
    <div class="wp-block-button">
      <a class="wp-block-button__link">Get Started</a>
    </div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:cover -->`,
		},
		cta: {
			description:
				'Call-to-action pattern with heading, text, and button',
			file: 'patterns/cta.php',
			blocks: [
				'core/group',
				'core/heading',
				'core/paragraph',
				'core/buttons',
			],
			example: `<!-- wp:group {"backgroundColor":"primary"} -->
<div class="wp-block-group has-primary-background-color">
  <!-- wp:heading {"textAlign":"center"} -->
  <h2 class="has-text-align-center">Ready to Get Started?</h2>
  <!-- /wp:heading -->

  <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
  <div class="wp-block-buttons">
    <!-- wp:button -->
    <div class="wp-block-button">
      <a class="wp-block-button__link">Contact Us</a>
    </div>
    <!-- /wp:button -->
  </div>
  <!-- /wp:buttons -->
</div>
<!-- /wp:group -->`,
		},
		testimonials: {
			description: 'Testimonial pattern with quotes and author info',
			file: 'patterns/testimonials.php',
			blocks: [
				'core/columns',
				'core/column',
				'core/quote',
				'core/paragraph',
			],
			example: `<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:quote -->
    <blockquote class="wp-block-quote">
      <p>"Great theme for our project!"</p>
      <cite>— Jane Doe, CEO</cite>
    </blockquote>
    <!-- /wp:quote -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->`,
		},
	};

	const patternData = patterns[type];

	if (!patternData) {
		error(`Unknown pattern type: ${type}`);
		info('Run "pattern" without arguments to see available types');
		return;
	}

	console.log(colors.bold + 'Description:\n' + colors.reset);
	console.log(patternData.description + '\n');

	console.log(colors.bold + 'File Location:\n' + colors.reset);
	console.log(patternData.file + '\n');

	console.log(colors.bold + 'Blocks Used:\n' + colors.reset);
	patternData.blocks.forEach((block) => {
		console.log(`  • ${block}`);
	});
	console.log();

	console.log(colors.bold + 'Example Markup:\n' + colors.reset);
	console.log(patternData.example + '\n');

	success('Pattern help displayed');
}

/**
 * Template help and generation
 */
function templateHelp(name = null) {
	header('Development Assistant - Template Help');

	if (!name) {
		console.log('Common templates:\n');
		console.log('  index    - Default template');
		console.log('  single   - Single post template');
		console.log('  page     - Page template');
		console.log('  archive  - Archive template');
		console.log('  header   - Header template part');
		console.log('  footer   - Footer template part\n');

		console.log('Usage:');
		console.log('  template <name> - Get specific template help\n');
		return;
	}

	info(`Template help for: ${name}`);
	console.log(
		`File location: ${name === 'header' || name === 'footer' ? 'parts/' : 'templates/'}${name}.html\n`
	);
	console.log(
		'Templates use block markup (HTML comments) to define layouts.\n'
	);
	success('Template help displayed');
}

/**
 * Styles help
 */
function stylesHelp(type = null) {
	header('Development Assistant - Styles Help');

	if (!type) {
		console.log('Theme.json Configuration:\n');
		console.log('  colors      - Color palette and settings');
		console.log('  typography  - Font families and sizes');
		console.log('  spacing     - Spacing scale');
		console.log('  layout      - Layout settings');
		console.log('  variations  - Style variations (dark mode, etc.)\n');

		console.log('Usage:');
		console.log('  styles <type> - Get specific styling help\n');
		return;
	}

	info(`Styles help for: ${type}`);
	console.log('Configure in theme.json at the root of the theme.\n');
	success('Styles help displayed');
}

/**
 * JavaScript help
 */
function jsHelp(type = null) {
	header('Development Assistant - JavaScript Help');

	if (!type) {
		console.log('JavaScript Features:\n');
		console.log('  navigation  - Navigation functionality');
		console.log('  blocks      - Block-specific JavaScript');
		console.log('  utils       - Utility functions');
		console.log('  animations  - Animation and transitions\n');

		console.log('Usage:');
		console.log('  js <type> - Get specific JavaScript help\n');
		return;
	}

	info(`JavaScript help for: ${type}`);
	console.log('JavaScript files go in src/js/ directory.\n');
	console.log('Build with: npm run build\n');
	success('JavaScript help displayed');
}

/**
 * Testing help
 */
function testingHelp(type = null) {
	header('Development Assistant - Testing Help');

	if (!type) {
		console.log('Testing Types:\n');
		console.log('  unit   - Jest unit tests for JavaScript');
		console.log('  e2e    - Playwright end-to-end tests');
		console.log('  php    - PHPUnit tests for PHP');
		console.log('  a11y   - Accessibility testing\n');

		console.log('Commands:\n');
		console.log('  npm run test:dry-run:all  - Run all dry-run tests');
		console.log('  npm run test:unit          - Run Jest tests');
		console.log('  npm run test:e2e           - Run Playwright tests\n');

		console.log('Usage:');
		console.log('  testing <type> - Get specific testing help\n');
		return;
	}

	info(`Testing help for: ${type}`);
	console.log(`Tests go in tests/ directory.\n`);
	success('Testing help displayed');
}

/**
 * Build process help
 */
function buildHelp() {
	header('Development Assistant - Build Help');

	console.log('Build Commands:\n');
	console.log('  npm run build  - Production build (minified, optimized)');
	console.log('  npm run dev    - Development build (with source maps)');
	console.log('  npm run watch  - Watch mode for development\n');

	console.log('Build Process:\n');
	console.log('  1. Compiles SCSS to CSS');
	console.log('  2. Transpiles and bundles JavaScript');
	console.log('  3. Optimizes assets');
	console.log('  4. Generates source maps (dev mode)\n');

	console.log('Build Tool:\n');
	console.log('  Uses @wordpress/scripts (Webpack under the hood)\n');

	console.log('Output Directory:\n');
	console.log('  build/ - Compiled assets\n');

	success('Build help displayed');
}

/**
 * Switch development mode
 */
function switchMode(mode) {
	const validModes = [
		'general',
		'pattern-authoring',
		'theme-json-editing',
		'expert',
		'testing-qa',
	];

	if (!validModes.includes(mode)) {
		error(`Invalid mode: ${mode}`);
		info('Valid modes:', validModes.join(', '));
		return;
	}

	currentMode = mode;
	header(`Switched to ${mode} mode`);

	const modeDescriptions = {
		general: 'General development assistance',
		'pattern-authoring': 'Focus on block pattern creation and markup',
		'theme-json-editing': 'Focus on theme.json schema and validation',
		expert: 'Advanced PHP/JS/SCSS development and refactoring',
		'testing-qa': 'Focus on testing strategies and quality assurance',
	};

	console.log(modeDescriptions[mode] + '\n');
	success(`Mode set to: ${mode}`);
}

/**
 * Main CLI handler
 */
async function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'help';
	const subCommand = args[1] || null;

	try {
		switch (command) {
			case 'help':
				showHelp(subCommand);
				break;

			case 'pattern':
				patternHelp(subCommand);
				break;

			case 'template':
				templateHelp(subCommand);
				break;

			case 'styles':
				stylesHelp(subCommand);
				break;

			case 'js':
				jsHelp(subCommand);
				break;

			case 'testing':
				testingHelp(subCommand);
				break;

			case 'build':
				buildHelp();
				break;

			case 'mode':
				if (!subCommand) {
					error('Mode command requires a mode name');
					info('Usage: mode <mode-name>');
					info(
						'Valid modes: pattern-authoring, theme-json-editing, expert, testing-qa'
					);
					process.exit(1);
				}
				switchMode(subCommand);
				break;

			case '--help':
			case '-h':
				showHelp();
				break;

			default:
				error(`Unknown command: ${command}`);
				info('Run "help" for usage information');
				process.exit(1);
		}
	} catch (err) {
		error('Fatal error:', err.message);
		console.error(err);
		process.exit(1);
	}
}

// Run if executed directly
if (require.main === module) {
	main();
}

module.exports = {
	showHelp,
	patternHelp,
	templateHelp,
	stylesHelp,
	jsHelp,
	testingHelp,
	buildHelp,
	switchMode,
};
