#!/usr/bin/env node

/**
 * scripts/utils/scan.js
 *
 * Scans the repository for mustache placeholders and provides a reusable
 * result set for registry generation, validation, and debugging.
 */

const fs = require( 'fs' );
const path = require( 'path' );
const fastGlob = require( 'fast-glob' );

const ROOT_DIR = path.resolve( __dirname, '..', '..' );
const SCAN_PATTERNS = [
	'**/*.php',
	'**/*.js',
	'**/*.ts',
	'**/*.tsx',
	'**/*.json',
	'**/*.md',
	'**/*.css',
	'**/*.scss',
	'**/*.html',
	'**/*.yml',
	'**/*.yaml',
	'**/*.txt',
];
const SCAN_IGNORE = [
	'node_modules/**',
	'vendor/**',
	'build/**',
	'dist/**',
	'.git/**',
	'generated-theme/**',
	'coverage/**',
	'logs/**',
	'tmp/dry-run/**',
	'scripts/mustache-variables-registry.json',
	'tests/fixtures/**',
];
const MUSTACHE_REGEX = /\{\{([a-zA-Z0-9_]+(?:\|[a-zA-Z0-9_]+)?)\}\}/g;

function categorizeVariable( varName ) {
	const cleanName = varName.split( '|' )[ 0 ];

	if ( [ 'theme_slug', 'theme_name', 'namespace', 'description' ].includes( cleanName ) ) {
		return 'core_identity';
	}

	if ( cleanName.includes( 'author' ) || cleanName.includes( 'email' ) || cleanName === 'year' ) {
		return 'author_contact';
	}

	if ( cleanName.includes( 'version' ) || cleanName.includes( '_wp_' ) || cleanName.includes( '_php_' ) ) {
		return 'versioning';
	}

	if ( cleanName.includes( '_url' ) || cleanName.includes( '_uri' ) ) {
		return 'urls';
	}

	if ( cleanName.includes( 'license' ) ) {
		return 'license';
	}

	if ( cleanName.includes( 'color' ) || cleanName.includes( '_colour' ) ) {
		return 'design_colors';
	}

	if ( cleanName.includes( 'font' ) || cleanName.includes( 'line_height' ) || cleanName.includes( 'weight' ) ) {
		return 'design_typography';
	}

	if ( cleanName.includes( 'width' ) || cleanName.includes( 'spacing' ) || cleanName.includes( 'size' ) ) {
		return 'design_layout';
	}

	if (
		cleanName.includes( 'text' ) ||
		cleanName.includes( 'title' ) ||
		cleanName.includes( 'excerpt' ) ||
		cleanName.includes( 'skip_link' ) ||
		cleanName.includes( 'copyright' )
	) {
		return 'content_strings';
	}

	if ( cleanName.includes( 'image' ) || cleanName.includes( 'thumbnail' ) ) {
		return 'images';
	}

	if ( cleanName.includes( 'tags' ) || cleanName.includes( 'textdomain' ) || cleanName.includes( 'audience' ) ) {
		return 'theme_metadata';
	}

	if ( cleanName.includes( 'button' ) || cleanName.includes( 'border' ) ) {
		return 'ui_components';
	}

	return 'other';
}

function isDerivedVariable( varName ) {
	const derived = [
		'namespace',
		'support_url',
		'support_email',
		'security_email',
		'business_email',
		'docs_url',
		'docs_repo_url',
		'content_width_px',
		'year',
		'created_date',
		'updated_date',
	];

	return derived.includes( varName );
}

function flattenConfig( config, prefix = '' ) {
	const flattened = {};

	for ( const [ key, value ] of Object.entries( config ) ) {
		const newKey = prefix ? `${ prefix }_${ key }` : key;

		if ( value && typeof value === 'object' && !Array.isArray( value ) ) {
			Object.assign( flattened, flattenConfig( value, newKey ) );
		} else if ( !Array.isArray( value ) ) {
			flattened[ newKey ] = value;
		}
	}

	return flattened;
}

function scanMustacheVariables( options = {} ) {
	const root = options.root || ROOT_DIR;
	const patterns = options.patterns || SCAN_PATTERNS;
	const ignore = options.ignore || SCAN_IGNORE;

	const files = fastGlob.sync( patterns, {
		cwd: root,
		dot: true,
		onlyFiles: true,
		absolute: false,
		ignore,
	} );

	const summary = {
		totalFiles: files.length,
		filesWithVariables: 0,
		uniqueVariables: 0,
		totalOccurrences: 0,
	};
	const variables = {};
	const categories = {};

	for ( const relativePath of files ) {
		const absolutePath = path.join( root, relativePath );
		let content;

		try {
			content = fs.readFileSync( absolutePath, 'utf8' );
		} catch ( error ) {
			continue;
		}

		const regex = new RegExp( MUSTACHE_REGEX );
		const seenInFile = new Set();
		let match;

		while ( ( match = regex.exec( content ) ) !== null ) {
			const rawName = match[ 1 ];
			const name = rawName.split( '|' )[ 0 ];

			summary.totalOccurrences += 1;

			if ( ! variables[ name ] ) {
				const category = categorizeVariable( name );
				variables[ name ] = {
					name,
					category,
					files: [],
					count: 0,
				};

				if ( ! categories[ category ] ) {
					categories[ category ] = {
						variables: [],
						count: 0,
					};
				}
				categories[ category ].variables.push( name );
			}

			variables[ name ].count += 1;

			if ( ! seenInFile.has( name ) ) {
				variables[ name ].files.push( relativePath );
				seenInFile.add( name );
			}
		}

		if ( seenInFile.size > 0 ) {
			summary.filesWithVariables += 1;
		}
	}

	summary.uniqueVariables = Object.keys( variables ).length;

	Object.values( variables ).forEach( ( entry ) => entry.files.sort() );
	Object.values( categories ).forEach( ( category ) => {
		category.count = category.variables.length;
	} );

	return {
		summary,
		variables,
		categories,
	};
}

function displayResults( results, sortedVariables ) {
	console.log( 'Mustache Variable Scan Report' );
	console.log( '=============================' );
	console.log( `Files scanned: ${ results.summary.totalFiles }` );
	console.log( `Files with variables: ${ results.summary.filesWithVariables }` );
	console.log( `Unique variables: ${ results.summary.uniqueVariables }` );
	console.log( `Total occurrences: ${ results.summary.totalOccurrences }` );
	console.log( '' );

	const categoryEntries = Object.entries( results.categories ).sort(
		( [, a ], [, b ] ) => b.count - a.count
	);

	if ( categoryEntries.length > 0 ) {
		console.log( 'Category distribution:' );
		categoryEntries.forEach( ( [ category, data ] ) => {
			console.log( `  - ${ category }: ${ data.count } variable${ data.count === 1 ? '' : 's' }` );
		} );
		console.log( '' );
	}

	if ( sortedVariables.length === 0 ) {
		console.log( 'No mustache variables discovered.' );
		return;
	}

	console.log( 'Top variables:' );
	const limit = Math.min( 15, sortedVariables.length );
	for ( let i = 0; i < limit; i += 1 ) {
		const variable = sortedVariables[ i ];
		console.log(
			`  ${ i + 1 }. {{${ variable.name }}} — ${ variable.count } occurrences in ${ variable.files.length } file${ variable.files.length === 1 ? '' : 's' }`
		);
	}

	if ( sortedVariables.length > limit ) {
		console.log( `  ...and ${ sortedVariables.length - limit } more variables.` );
	}
}

function validateConfig( configPath, results ) {
	try {
		const config = JSON.parse( fs.readFileSync( configPath, 'utf8' ) );
		const flatConfig = flattenConfig( config );
		const configKeys = new Set( Object.keys( flatConfig ) );
		const discoveredVars = new Set( Object.keys( results.variables ).map( ( name ) => name.split( '|' )[ 0 ] ) );

		const missing = [];
		const extra = [];

		for ( const varName of discoveredVars ) {
			if ( ! configKeys.has( varName ) && ! isDerivedVariable( varName ) ) {
				missing.push( varName );
			}
		}

		for ( const key of configKeys ) {
			if (
				! discoveredVars.has( key ) &&
				! key.startsWith( '_' ) &&
				key !== 'design_system' &&
				key !== 'theme_structure' &&
				key !== 'features' &&
				key !== 'content'
			) {
				extra.push( key );
			}
		}

		if ( missing.length > 0 ) {
			console.error( 'Missing theme config keys for discovered placeholders:' );
			missing.forEach( ( name ) => console.error( `  - ${ name }` ) );
		}

		if ( extra.length > 0 ) {
			console.error( 'Theme config contains extra keys that are not used in templates:' );
			extra.forEach( ( key ) => console.error( `  - ${ key }` ) );
		}

		if ( missing.length > 0 || extra.length > 0 ) {
			process.exit( 1 );
		}

		console.log( '✅ Theme config contains every discovered placeholder.' );
	} catch ( error ) {
		console.error( `Unable to validate config: ${ error.message }` );
		process.exit( 1 );
	}
}

function main() {
	const args = process.argv.slice( 2 );
	const outputJson = args.includes( '--json' );
	const validateIndex = args.indexOf( '--validate' );

	const { summary, variables, categories } = scanMustacheVariables();
	const latestResults = { summary, variables, categories };
	const sortedVariables = Object.values( variables ).sort( ( a, b ) => b.count - a.count );

	if ( validateIndex !== -1 ) {
		const configPath = args[ validateIndex + 1 ];
		if ( ! configPath ) {
			console.error( 'Please provide the path to theme config after --validate' );
			process.exit( 1 );
		}
		validateConfig( configPath, latestResults );
		return;
	}

	if ( outputJson ) {
		console.log( JSON.stringify( latestResults, null, 2 ) );
		return;
	}

	displayResults( latestResults, sortedVariables );
}

module.exports = {
	scanMustacheVariables,
	categorizeVariable,
	flattenConfig,
	isDerivedVariable,
};

if ( require.main === module ) {
	main();
}
