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
const MUSTACHEIGNORE_PATH = path.resolve(ROOT_DIR, '.mustacheignore');
let SCAN_IGNORE = [
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
// Load custom ignore patterns from .mustacheignore if present
if (fs.existsSync(MUSTACHEIGNORE_PATH)) {
	const customIgnores = fs.readFileSync(MUSTACHEIGNORE_PATH, 'utf8')
		 .split(/\r?\n/)
		 .map((line) => line.trim())
		 .filter((line) => line && !line.startsWith('#'));
	if (customIgnores.length > 0) {
		 SCAN_IGNORE = customIgnores;
	}
}
const MUSTACHE_REGEX = /\{\{([a-zA-Z0-9_]+(?:\|[a-zA-Z0-9_]+)?)\}\}/g;

// Infer variable type/format from name
function inferVariableType(varName) {
	const n = varName.toLowerCase();
	if (n.includes('color') || n.includes('colour')) return 'color';
	if (n.includes('url') || n.includes('uri')) return 'url';
	if (n.includes('email')) return 'email';
	if (n.includes('date') || n === 'year') return 'date';
	if (n.includes('font') || n.includes('weight') || n.includes('line_height')) return 'font';
	if (n.includes('image') || n.includes('thumbnail')) return 'image';
	if (n.includes('version')) return 'version';
	if (n.includes('slug')) return 'slug';
	if (n.includes('name') || n.includes('title')) return 'string';
	if (n.includes('width') || n.includes('size') || n.includes('spacing')) return 'number';
	if (n.includes('bool') || n.startsWith('is_') || n.startsWith('has_')) return 'boolean';
	return 'string';
}

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

			       const lines = content.split(/\r?\n/);
			       const seenInFile = new Set();
			       for (let lineNum = 0; lineNum < lines.length; lineNum++) {
				       let line = lines[lineNum];
				       let match;
				       const regex = new RegExp(MUSTACHE_REGEX, 'g');
				       while ((match = regex.exec(line)) !== null) {
					       const rawName = match[1];
					       const name = rawName.split('|')[0];

					       summary.totalOccurrences += 1;

					       if (!variables[name]) {
						       const category = categorizeVariable(name);
						       const type = inferVariableType(name);
						       variables[name] = {
							       name,
							       category,
							       type,
							       files: [],
							       count: 0,
							       usage: []
						       };

						       if (!categories[category]) {
							       categories[category] = {
								       variables: [],
								       count: 0,
							       };
						       }
						       categories[category].variables.push(name);
					       }

					       variables[name].count += 1;

					       // Track usage context (file and line number)
					       variables[name].usage.push({ file: relativePath, line: lineNum + 1 });

					       if (!seenInFile.has(name)) {
						       variables[name].files.push(relativePath);
						       seenInFile.add(name);
					       }
				       }
			       }
			       if (seenInFile.size > 0) {
				       summary.filesWithVariables += 1;
			       }
		       }

	summary.uniqueVariables = Object.keys( variables ).length;

	Object.values( variables ).forEach( ( entry ) => entry.files.sort() );
	Object.values( categories ).forEach( ( category ) => {
		category.count = category.variables.length;
	} );

	// Detect undocumented and unused variables
	const variablesInCode = new Set(Object.keys(variables));
	let variablesInRegistry = new Set();
	let undocumented = [];
	let unused = [];

	// Try to load existing registry to compare
	const registryPath = path.resolve(root, 'scripts/mustache-variables-registry.json');
	if (fs.existsSync(registryPath)) {
		try {
			const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
			if (registry.variables) {
				variablesInRegistry = new Set(Object.keys(registry.variables));
			}
		} catch (error) {
			// If registry doesn't exist or is invalid, skip comparison
		}
	}

	// Calculate undocumented (in code but not in registry)
	// and unused (in registry but not in code)
	if (variablesInRegistry.size > 0) {
		undocumented = Array.from(variablesInCode).filter(v => !variablesInRegistry.has(v));
		unused = Array.from(variablesInRegistry).filter(v => !variablesInCode.has(v));
	}

	return {
		summary,
		variables,
		categories,
		meta: {
			undocumented,
			unused,
			scannedAt: new Date().toISOString()
		}
	};
}

function displayResults( results, sortedVariables, options = {} ) {
	const { showUsage = false, showTypes = false } = options;

	console.log( 'Mustache Variable Scan Report' );
	console.log( '=============================' );
	console.log( `Files scanned: ${ results.summary.totalFiles }` );
	console.log( `Files with variables: ${ results.summary.filesWithVariables }` );
	console.log( `Unique variables: ${ results.summary.uniqueVariables }` );
	console.log( `Total occurrences: ${ results.summary.totalOccurrences }` );
	console.log( '' );

	// Display undocumented/unused variables if present
	if (results.meta) {
		if (results.meta.undocumented && results.meta.undocumented.length > 0) {
			console.log( `⚠️  Undocumented variables (${results.meta.undocumented.length}):` );
			results.meta.undocumented.slice(0, 10).forEach(v => {
				const usage = results.variables[v]?.usage?.[0];
				const location = usage ? ` (found in ${usage.file}:${usage.line})` : '';
				console.log( `  - ${v}${location}` );
			});
			if (results.meta.undocumented.length > 10) {
				console.log( `  ...and ${results.meta.undocumented.length - 10} more` );
			}
			console.log( '' );
		}

		if (results.meta.unused && results.meta.unused.length > 0) {
			console.log( `📋 Unused variables in registry (${results.meta.unused.length}):` );
			results.meta.unused.slice(0, 10).forEach(v => {
				console.log( `  - ${v}` );
			});
			if (results.meta.unused.length > 10) {
				console.log( `  ...and ${results.meta.unused.length - 10} more` );
			}
			console.log( '' );
		}

		if (results.meta.undocumented.length === 0 && results.meta.unused.length === 0) {
			console.log( '✅ All variables are documented and in use.' );
			console.log( '' );
		}
	}

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
		let output = `  ${ i + 1 }. {{${ variable.name }}}`;

		if ( showTypes && variable.type ) {
			output += ` [${variable.type}]`;
		}

		output += ` — ${ variable.count } occurrences in ${ variable.files.length } file${ variable.files.length === 1 ? '' : 's' }`;
		console.log( output );

		if ( showUsage && variable.usage && variable.usage.length > 0 ) {
			const usageLimit = Math.min( 3, variable.usage.length );
			for ( let j = 0; j < usageLimit; j += 1 ) {
				const usage = variable.usage[ j ];
				console.log( `     - ${usage.file}:${usage.line}` );
			}
			if ( variable.usage.length > usageLimit ) {
				console.log( `     ...and ${variable.usage.length - usageLimit} more locations` );
			}
		}
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
	const showUsage = args.includes( '--show-usage' );
	const showTypes = args.includes( '--show-types' );
	const validateIndex = args.indexOf( '--validate' );

	const { summary, variables, categories, meta } = scanMustacheVariables();
	const latestResults = { summary, variables, categories, meta };
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

	displayResults( latestResults, sortedVariables, { showUsage, showTypes } );
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
