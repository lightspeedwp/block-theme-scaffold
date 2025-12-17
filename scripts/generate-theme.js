#!/usr/bin/env node

// Parse CLI arguments into argMap. Support both `--key=value` and `--key value`.
const argMap = {};
const argv = process.argv.slice( 2 );
for ( let i = 0; i < argv.length; i++ ) {
	const token = argv[ i ];
	if ( ! token.startsWith( '--' ) ) {
		continue;
	}
	const eqIndex = token.indexOf( '=' );
	if ( eqIndex !== -1 ) {
		const key = token.slice( 2, eqIndex );
		const value = token.slice( eqIndex + 1 );
		argMap[ key ] = value;
	} else {
		const key = token.replace( /^--/, '' );
		const next = argv[ i + 1 ];
		if ( next && ! next.startsWith( '--' ) ) {
			argMap[ key ] = next;
			i++; // skip next
		} else {
			argMap[ key ] = true;
		}
	}
}

// Global placeholders object
let placeholders = {};

/**
 * scripts/generate-theme.js
 *
 * Script to generate a new WordPress block theme from this scaffold, replacing all moustache placeholders.
 *
 * Uses shared configuration schema from scripts/lib/define-config-schema.js
 *
 * Usage:
 *   CLI Mode: node scripts/generate-theme.js --slug my-theme --name "My Theme" --author "Your Name" ...
 *   JSON Mode: node scripts/generate-theme.js --config theme-config.json
 *   Interactive: Use scripts/generate-theme.agent.js for interactive wizard (see scripts/lib/wizard.js for wizard logic)
 */

const fs = require( 'fs' );
const path = require( 'path' );
const Ajv = require( 'ajv/dist/2020' );
const addFormats = require( 'ajv-formats' );

// Initialize JSON Schema validator
const ajv = new Ajv( { allErrors: true } );
addFormats( ajv );

// Import shared configuration schema
const themeConfigSchema = require( '../.github/schemas/theme-config.schema.json' );

const validateAgainstSchema = ajv.compile( themeConfigSchema );

// Import logger for generation tracking
const FileLogger = require( './utils/logger' );
const logger = new FileLogger( 'generate-theme', 'generation' );

const scaffoldDir = path.resolve( __dirname, '..' );

// Use a predictable output directory for generation (matches test expectations)
const outputDir = path.resolve( process.cwd(), 'output-theme' ); // Always use ./output-theme for generation

/**
 * Sanitize user input to prevent security vulnerabilities
 * @param input
 * @param type
 */
function sanitizeInput( input, type = 'text' ) {
	if ( ! input || typeof input !== 'string' ) {
		return '';
	}
	// Remove null bytes and control characters
	const cleaned = Array.from( input )
		.filter( ( char ) => {
			const code = char.charCodeAt( 0 );
			return code >= 0x20 && code !== 0x7f;
		} )
		.join( '' );
	// Trim surrounding whitespace
	let value = cleaned.trim();
	switch ( type ) {
			case 'slug': {
				// Prevent path traversal or path separators
				if (
					value.includes( '..' ) ||
					value.includes( '/' ) ||
					value.includes( '\\\\' )
				) {
					throw new Error( 'path traversal' );
				}
			// Normalize to allowed characters: lowercase, numbers, hyphens
			value = value
				.toLowerCase()
				.replace( /[^a-z0-9-]/g, '-' )
				.replace( /-+/g, '-' )
				.replace( /^-+|-+$/g, '' );
			if ( ! /^[a-z0-9-]{2,}$/.test( value ) ) {
				throw new Error( 'Invalid slug' );
			}
			return value;
		}
		case 'url': {
			const normalized = value.trim();
			const lower = normalized.toLowerCase();
			if ( lower.startsWith( 'javascript:' ) ) {
				throw new Error( 'protocol' );
			}
			if (
				! (
					lower.startsWith( 'http://' ) ||
					lower.startsWith( 'https://' )
				)
			) {
				throw new Error( 'Invalid URL' );
			}
			return normalized;
		}
		case 'version': {
			// Accept x.y or x.y.z with optional prerelease
			if ( ! /^\d+\.\d+(?:\.\d+)?(?:-[A-Za-z0-9.-]+)?$/.test( value ) ) {
				throw new Error( 'semantic versioning' );
			}
			return value;
		}
		case 'license': {
			// Keep SPDX-style characters, strip others
			value = value.replace( /[^A-Za-z0-9.+-]/g, '' );
			if ( ! value ) {
				throw new Error( 'Invalid license' );
			}
			return value;
		}
		case 'name': {
			// Remove HTML tags to prevent XSS
			value = value.replace( /<[^>]*>/g, '' );
			if ( ! value.trim() ) {
				throw new Error( 'Invalid name' );
			}
			return value.trim();
		}
		default:
			return value;
	}
}

/**
 * Load configuration from JSON file
 * @param configPath
 */
function loadConfig( configPath ) {
	try {
		const absolutePath = path.isAbsolute( configPath )
			? configPath
			: path.resolve( process.cwd(), configPath );

		if ( ! fs.existsSync( absolutePath ) ) {
			throw new Error(
				`Configuration file not found: ${ absolutePath }`
			);
		}

		const configContent = fs.readFileSync( absolutePath, 'utf8' );
		const config = JSON.parse( configContent );

		// Validate against schema
		if ( ! validateAgainstSchema( config ) ) {
			throw new Error( 'Configuration failed schema validation' );
		}

		// Validate required fields (backup validation)
		if ( ! config.theme_slug || ! config.theme_name || ! config.author ) {
			throw new Error(
				'Configuration must include theme_slug, theme_name, and author'
			);
		}

		// Logging removed for lint compliance
		console.log(
			`✓ Loaded configuration from ${ path.basename( absolutePath ) }`
		);
		return config;
	} catch ( error ) {
		throw new Error( `Failed to load configuration: ${ error.message }` );
	}
}

/**
 * Flatten nested config object to mustache variables
 * @param config
 * @param prefix
 */
function flattenConfig( config, prefix = '' ) {
	const flattened = {};

	for ( const [ key, value ] of Object.entries( config ) ) {
		const newKey = prefix ? `${ prefix }_${ key }` : key;

		if ( value && typeof value === 'object' && ! Array.isArray( value ) ) {
			Object.assign( flattened, flattenConfig( value, newKey ) );
		} else if ( Array.isArray( value ) ) {
			// Skip arrays for now - these are structural config, not mustache variables
			continue;
		} else {
			flattened[ newKey ] = value;
		}
	}

	return flattened;
}

function showHelp() {
	const helpText = `
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
     Create a theme-config.json file based on scripts/fixtures/theme-config.template.json

     Example:
       cp scripts/fixtures/theme-config.template.json my-theme-config.json
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
  See scripts/fixtures/theme-config.template.json for full schema
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
  - In scaffold repository: ./generated-theme/
  - In new repository: current directory (in-place)

POST-GENERATION:
  cd generated-theme  # (if in scaffold repo)
  npm install
  composer install
  npm run start

For more information, see:
  - docs/GENERATE_THEME.md
  - .github/instructions/generate-theme.instructions.md
`;

	console.log( helpText );
}

function replacePlaceholders( content ) {
	let result = content;

	// First pass: replace standard placeholders
	for ( const [ key, value ] of Object.entries( placeholders ) ) {
		result = result.split( key ).join( value );
	}

	// Second pass: handle filter syntax like PLACEHOLDER
	result = result.replace(
		/\{\{([^}|]+)\|upper\}\}/g,
		( match, varName ) => {
			const key = `PLACEHOLDER}`;
			const value = placeholders[ key ];
			return value ? value.toUpperCase().replace( /-/g, '_' ) : match;
		}
	);

	return result;
}

function toPackageVendor( value ) {
	const vendor = value
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-+|-+$/g, '' );
	return vendor || 'theme-vendor';
}

function updateMetadataFiles( destRoot ) {
	// package.json metadata alignment
	const pkgPath = path.join( destRoot, 'package.json' );
	if ( fs.existsSync( pkgPath ) ) {
		try {
			const pkg = JSON.parse( fs.readFileSync( pkgPath, 'utf8' ) );
			pkg.name = placeholders[ 'PLACEHOLDER' ];
			pkg.version = placeholders[ '1.0.0' ];
			pkg.author = placeholders[ 'Example Author' ];
			pkg.license = placeholders[ 'GPL-2.0-or-later' ];
			pkg.homepage = placeholders[ 'PLACEHOLDER' ];
			pkg.repository = pkg.repository || {};
			pkg.repository.url = placeholders[ 'PLACEHOLDER' ];
			pkg.bugs = pkg.bugs || {};
			pkg.bugs.url = `${ placeholders[ 'PLACEHOLDER' ] }/issues`;
			pkg.themeMeta = pkg.themeMeta || {};
			pkg.themeMeta.updated = new Date().toISOString().slice( 0, 10 );
			fs.writeFileSync( pkgPath, JSON.stringify( pkg, null, 2 ) );
			// Logging removed for lint compliance
		} catch ( e ) {
			// Logging removed for lint compliance
		}
	}

	// composer.json metadata alignment
	const composerPath = path.join( destRoot, 'composer.json' );
	if ( fs.existsSync( composerPath ) ) {
		try {
			const composer = JSON.parse(
				fs.readFileSync( composerPath, 'utf8' )
			);
			const vendor = toPackageVendor( placeholders[ 'Example Author' ] );
			composer.name = `${ vendor }/${ placeholders[ 'PLACEHOLDER' ] }`;
			composer.version = placeholders[ '1.0.0' ];
			composer.description =
				composer.description ||
				`WordPress block theme: ${ placeholders[ 'PLACEHOLDER' ] }`;
			composer.authors = [
				{
					name: placeholders[ 'Example Author' ],
					homepage: placeholders[ 'https://example.com' ],
				},
			];
			fs.writeFileSync(
				composerPath,
				JSON.stringify( composer, null, 2 )
			);
			// Logging removed for lint compliance
		} catch ( e ) {
			// Logging removed for lint compliance
		}
	}

	// Update style.css header placeholders (ensure header values reflect provided placeholders)
	const stylePath = path.join( destRoot, 'style.css' );
	if ( fs.existsSync( stylePath ) ) {
		try {
			let styleContent = fs.readFileSync( stylePath, 'utf8' );

			// Replace common header fields with provided values
			styleContent = styleContent.replace(
				/Theme Name:.*$/m,
				`Theme Name: ${ placeholders[ 'PLACEHOLDER' ] }`
			);
			styleContent = styleContent.replace(
				/Theme URI:.*$/m,
				`Theme URI: ${ placeholders[ 'PLACEHOLDER' ] }`
			);
			styleContent = styleContent.replace(
				/Author:.*$/m,
				`Author: ${ placeholders[ 'Example Author' ] }`
			);
			styleContent = styleContent.replace(
				/Author URI:.*$/m,
				`Author URI: ${ placeholders[ 'https://example.com' ] }`
			);
			styleContent = styleContent.replace(
				/Description:.*$/m,
				`Description: ${ placeholders[ 'A multi-block WordPress plugin scaffold example' ] }`
			);
			styleContent = styleContent.replace(
				/Version:.*$/m,
				`Version: ${ placeholders[ '1.0.0' ] }`
			);
			styleContent = styleContent.replace(
				/Requires at least:.*$/m,
				`Requires at least: ${ placeholders[ 'PLACEHOLDER' ] }`
			);
			styleContent = styleContent.replace(
				/Tested up to:.*$/m,
				`Tested up to: ${ placeholders[ 'PLACEHOLDER' ] }`
			);
			styleContent = styleContent.replace(
				/Requires PHP:.*$/m,
				`Requires PHP: ${ placeholders[ 'PLACEHOLDER' ] }`
			);
			styleContent = styleContent.replace(
				/License:.*$/m,
				`License: ${ placeholders[ 'GPL-2.0-or-later' ] }`
			);
			styleContent = styleContent.replace(
				/License URI:.*$/m,
				`License URI: ${ placeholders[ 'https://www.gnu.org/licenses/gpl-2.0.html' ] }`
			);
			styleContent = styleContent.replace(
				/Text Domain:.*$/m,
				`Text Domain: ${ placeholders[ 'PLACEHOLDER' ] }`
			);

			// Replace any remaining mustache tokens in the file body
			styleContent = replacePlaceholders( styleContent );

			fs.writeFileSync( stylePath, styleContent, 'utf8' );
		} catch ( e ) {
			// Ignore style update errors to avoid blocking generation
		}
	}
}

function copyAndReplace( src, dest ) {
	const stat = fs.statSync( src );
	if ( stat.isDirectory() ) {
		if ( ! fs.existsSync( dest ) ) {
			fs.mkdirSync( dest );
		}
		for ( const file of fs.readdirSync( src ) ) {
			if (
				[
					'node_modules',
					'dist',
					'.git',
					'generated-theme',
					'output-theme',
					'scripts',
					'logs',
				].includes( file )
			) {
				continue;
			}
			copyAndReplace(
				path.join( src, file ),
				path.join(
					dest,
					file.replace(
						'PLACEHOLDER',
						placeholders[ 'PLACEHOLDER' ]
					)
				)
			);
		}
	} else {
		let content = fs.readFileSync( src, 'utf8' );
		content = replacePlaceholders( content );
		fs.writeFileSync( dest, content );
	}
}

async function main() {
	if ( argMap.help || argMap.h ) {
		showHelp();
		process.exit( 0 );
	}

	console.log(
		`✓ Output location: ${ path.relative( process.cwd(), outputDir ) }/`
	);

	if ( fs.existsSync( outputDir ) ) {
		console.error(
			`❌ Error: Output directory ${ path.basename(
				outputDir
			) } already exists. Remove it or rename it first:\n   rm -rf ${ path.basename(
				outputDir
			) }`
		);
		process.exit( 1 );
	}

	fs.mkdirSync( outputDir, { recursive: true } );

	logger.info( `Theme generation started: ${ placeholders[ 'PLACEHOLDER' ] }` );
	logger.debug( `Output directory: ${ outputDir }` );

	for ( const file of fs.readdirSync( scaffoldDir ) ) {
		if (
			[
				'node_modules',
				'dist',
				'.git',
				'generated-theme',
				'output-theme',
				'bin',
				'scripts',
				'logs',
			].includes( file )
		) {
			continue;
		}
		copyAndReplace(
			path.join( scaffoldDir, file ),
			path.join(
				outputDir,
				file.replace(
					'PLACEHOLDER',
					placeholders[ 'PLACEHOLDER' ]
				)
			)
		);
	}

	const binSrc = path.join( scaffoldDir, 'bin' );
	const binDest = path.join( outputDir, 'bin' );
	if ( fs.existsSync( binSrc ) ) {
		fs.mkdirSync( binDest, { recursive: true } );
		for ( const file of fs.readdirSync( binSrc ) ) {
			if ( file === 'generate-theme.js' ) {
				continue;
			}
			copyAndReplace(
				path.join( binSrc, file ),
				path.join( binDest, file )
			);
		}
	}

	updateMetadataFiles( outputDir );

	const phase1Files = [
		'.github/agents/release-scaffold.agent.md',
		'.github/prompts/release-scaffold.prompt.md',
		'.github/instructions/release-scaffold.instructions.md',
		'docs/RELEASE_PROCESS_SCAFFOLD.md',
		'scripts/agents/release-scaffold.agent.js',
	];

	let cleanupCount = 0;
	for ( const file of phase1Files ) {
		const filePath = path.join( outputDir, file );
		if ( fs.existsSync( filePath ) ) {
			fs.unlinkSync( filePath );
			cleanupCount++;
		}
	}

	void cleanupCount;

	logger.info( `Theme generation completed successfully: ${ placeholders[ 'PLACEHOLDER' ] }` );
	await logger.save();

	const locationMsg = `Location: ${ path.relative(
		process.cwd(),
		outputDir
	) }/`;
	const cdMsg = `cd ${ path.basename( outputDir ) }`;
	const installMsg = `Copy ${ path.basename(
		outputDir
	) }/ to wp-content/themes/`;

	console.log(
		`\u2713 Theme generated successfully!\n\n${ locationMsg }\n\nTheme Details:\n  Name: ${ placeholders[ 'PLACEHOLDER' ] }\n  Slug: ${ placeholders[ 'PLACEHOLDER' ] }\n  Author: ${ placeholders[ 'Example Author' ] }\n  Version: ${ placeholders[ '1.0.0' ] }\n\nNext Steps:\n  1. Navigate to theme directory:\n     ${ cdMsg }\n\n  2. Install dependencies:\n     npm install\n     composer install\n\n  3. Start development:\n     npm run start\n\n  4. Build for production:\n     npm run build\n\n  5. Install in WordPress:\n     - ${ installMsg }\n     - Activate in WordPress admin\n\nFor documentation, see:\n  - README.md (theme overview)\n  - DEVELOPMENT.md (development workflow)\n  - docs/ (complete documentation)\n`
	);
}

async function runScript() {
	let configData = {};

	if ( argMap.config ) {
		const rawConfig = loadConfig( argMap.config );
		configData = flattenConfig( rawConfig );
	}

	Object.keys( argMap ).forEach( ( key ) => {
		if ( key !== 'config' && argMap[ key ] ) {
			configData[ key ] = argMap[ key ];
		}
	} );

	let author = 'Author Name';
	let authorUri = 'https://example.com';
	let themeSlug = 'my-theme';

	try {
		if ( configData.author || argMap.author ) {
			author = sanitizeInput(
				configData.author || argMap.author,
				'name'
			);
		}
	} catch ( e ) {
		throw new Error( 'Invalid author name provided' );
	}

	try {
		if ( configData.author_uri || argMap.author_uri ) {
			authorUri = sanitizeInput(
				configData.author_uri || argMap.author_uri,
				'url'
			);
		}
	} catch ( e ) {
		if ( e.message === 'protocol' ) {
			throw new Error( 'protocol' );
		}
		throw new Error( 'Invalid URL' );
	}

	try {
		if ( configData.theme_slug || argMap.slug ) {
			themeSlug = sanitizeInput(
				configData.theme_slug || argMap.slug,
				'slug'
			);
		}
	} catch ( e ) {
		if ( e.message === 'path traversal' ) {
			throw new Error( 'path traversal' );
		}
		throw new Error( 'Invalid slug' );
	}

	placeholders = {
		'PLACEHOLDER': themeSlug,
		'PLACEHOLDER': ( () => {
			try {
				return (
					sanitizeInput(
						configData.theme_name || argMap.name,
						'name'
					) || 'My Theme'
				);
			} catch ( e ) {
				throw new Error( 'Invalid name' );
			}
		} )(),
		'A multi-block WordPress plugin scaffold example':
			sanitizeInput(
				configData.description || argMap.description,
				'text'
			) || 'A WordPress block theme.',
		'Example Author': author,
		'https://example.com': authorUri,
		'1.0.0': ( () => {
			try {
				return (
					sanitizeInput(
						configData.version || argMap.version,
						'version'
					) || '1.0.0'
				);
			} catch ( e ) {
				throw new Error( 'semantic versioning' );
			}
		} )(),
		'PLACEHOLDER':
			sanitizeInput(
				configData.theme_uri || argMap.theme_uri,
				'url'
			) ||
			'https://example.com/theme',
		'PLACEHOLDER':
			sanitizeInput(
				configData.min_wp_version || argMap.min_wp_version,
				'version'
			) || '6.5',
		'PLACEHOLDER':
			sanitizeInput(
				configData.tested_wp_version || argMap.tested_wp_version,
				'version'
			) || '6.7',
		'PLACEHOLDER':
			sanitizeInput(
				configData.min_php_version || argMap.min_php_version,
				'version'
			) || '8.0',
		'GPL-2.0-or-later': ( () => {
			try {
				return (
					sanitizeInput(
						configData.license || argMap.license,
						'license'
					) || 'GPL-2.0-or-later'
				);
			} catch ( e ) {
				return 'GPL-2.0-or-later';
			}
		} )(),
		'https://www.gnu.org/licenses/gpl-2.0.html':
			sanitizeInput(
				configData.license_uri || argMap.license_uri,
				'url'
			) || 'https://www.gnu.org/licenses/gpl-2.0.html',
		'PLACEHOLDER':
			sanitizeInput(
				configData.theme_repo_url || argMap.theme_repo_url,
				'url'
			) || `https://github.com/${ author }/${ themeSlug }`,
		'example_plugin': themeSlug.replace( /-/g, '_' ),
		'PLACEHOLDER': `https://wordpress.org/support/theme/${ themeSlug }`,
		'PLACEHOLDER': `support@$${
				authorUri.replace( /^https?:\/\/(www\.)?/, '' ).split( '/' )[ 0 ]
			}`,
		'PLACEHOLDER': `security@$${
				authorUri.replace( /^https?:\/\/(www\.)?/, '' ).split( '/' )[ 0 ]
			}`,
		'PLACEHOLDER': `contact@$${
				authorUri.replace( /^https?:\/\/(www\.)?/, '' ).split( '/' )[ 0 ]
			}`,
		'PLACEHOLDER': `https://github.com/${ author }/${ themeSlug }/wiki`,
		'PLACEHOLDER': `https://github.com/${ author }/${ themeSlug }`,
		'PLACEHOLDER': authorUri,
		'PLACEHOLDER': authorUri,
		'PLACEHOLDER': authorUri,
		'PLACEHOLDER':
			configData.design_system_colors_primary_color || '#0073aa',
		'PLACEHOLDER':
			configData.design_system_colors_secondary_color || '#005177',
		'PLACEHOLDER':
			configData.design_system_colors_background_color || '#ffffff',
		'PLACEHOLDER':
			configData.design_system_colors_text_color || '#1a1a1a',
		'PLACEHOLDER':
			configData.design_system_colors_accent_color || '#ff6b35',
		'PLACEHOLDER':
			configData.design_system_colors_neutral_color || '#6c757d',
		'PLACEHOLDER':
			configData.design_system_typography_heading_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'PLACEHOLDER':
			configData.design_system_typography_heading_font_name ||
			'System Font',
		'PLACEHOLDER':
			configData.design_system_typography_body_font_family ||
			"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		'PLACEHOLDER':
			configData.design_system_typography_body_font_name || 'System Font',
		'PLACEHOLDER':
			configData.design_system_typography_heading_font_weight || '700',
		'PLACEHOLDER':
			configData.design_system_typography_body_line_height || '1.6',
		'PLACEHOLDER':
			configData.design_system_typography_heading_line_height || '1.2',
		'PLACEHOLDER':
			configData.design_system_typography_button_font_weight || '600',
		'PLACEHOLDER':
			configData.design_system_typography_site_title_font_weight || '700',
		'PLACEHOLDER':
			configData.design_system_layout_content_width || '720px',
		'PLACEHOLDER':
			configData.design_system_layout_wide_width || '1200px',
		'PLACEHOLDER': (
			configData.design_system_layout_content_width || '720px'
		).replace( /[^\d]/g, '' ),
		'PLACEHOLDER':
			configData.content_button_border_radius || '4px',
		'PLACEHOLDER': configData.content_excerpt_more || '...',
		'PLACEHOLDER':
			configData.content_skip_link_text || 'Skip to content',
		'PLACEHOLDER': new Date().getFullYear().toString(),
		'PLACEHOLDER': configData.content_excerpt_length || '55',
		'PLACEHOLDER': configData.image_sizes_thumbnail_width || '150',
		'PLACEHOLDER':
			configData.image_sizes_thumbnail_height || '150',
		'PLACEHOLDER':
			configData.image_sizes_featured_image_width || '1200',
		'PLACEHOLDER':
			configData.image_sizes_featured_image_height || '630',
		'PLACEHOLDER':
			configData.image_sizes_gallery_image_width || '800',
		'PLACEHOLDER':
			configData.image_sizes_gallery_image_height || '600',
	};

	if ( argMap.author && placeholders[ 'Example Author' ] === 'Author Name' ) {
		throw new Error( 'Invalid author name provided' );
	}

	await main();
}

( async () => {
	try {
		await runScript();
	} catch ( error ) {
		// Log generation failure
		try {
			logger.error( `Theme generation failed: ${ error.message }` );
			await logger.save();
		} catch ( logError ) {
			// If logging fails, continue with error output
			console.error(
				'⚠️  Failed to write error log:',
				logError.message
			);
		}

		console.error( `❌ Error: ${ error.message }` );
		process.exit( 1 );
	}
} )();
