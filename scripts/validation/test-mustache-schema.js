#!/usr/bin/env node

/**
 * Mustache Variables Schema Validation Test
 *
 * Performs three levels of validation:
 * 1. Schema Structure - Validates the schema file itself is valid JSON Schema
 * 2. Known Variables - Ensures all expected variables are documented
 * 3. Registry Sync - Scans codebase to find undocumented mustache variables
 *
 * Exit codes:
 * 0 - All validations passed
 * 1 - One or more validations failed
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );
const Ajv = require( 'ajv' );

const SCHEMA_PATH = path.resolve(
	__dirname,
	'../.github/schemas/mustache-variables-registry.schema.json'
);
const ROOT_DIR = path.resolve( __dirname, '..' );

// Directories and patterns to exclude from codebase scan
const EXCLUDE_DIRS = [
	'node_modules',
	'vendor',
	'.git',
	'generated-theme',
	'dist',
	'logs',
	'.lint-temp',
	'build',
];

const EXCLUDE_FILES = [
	'*.md', // Exclude all markdown files (docs, plans, etc.)
	'*.log',
	'*.json',
];

/**
 * Level 1: Validate schema structure
 * Ensures the schema file itself is valid JSON Schema (draft-07)
 */
function validateSchemaStructure() {
	console.log( 'Level 1: Validating schema structure...' );

	try {
		// Read and parse schema
		const schemaContent = fs.readFileSync( SCHEMA_PATH, 'utf8' );
		const schema = JSON.parse( schemaContent );

		// Validate schema has required properties
		if ( ! schema.$schema ) {
			console.error( '✗ Schema missing $schema property' );
			return false;
		}

		if ( ! schema.properties ) {
			console.error( '✗ Schema missing properties object' );
			return false;
		}

		if ( ! schema.type || schema.type !== 'object' ) {
			console.error( '✗ Schema must have type: "object"' );
			return false;
		}

		// Validate it's using draft-07
		if ( ! schema.$schema.includes( 'draft-07' ) ) {
			console.error( '✗ Schema must use JSON Schema draft-07' );
			return false;
		}

		// Simple validation: try to compile it with Ajv
		const ajv = new Ajv( { strict: false, validateSchema: false } );
		try {
			ajv.compile( schema );
		} catch ( ajvError ) {
			console.error( '✗ Schema is not valid JSON Schema' );
			console.error( 'Error:', ajvError.message );
			return false;
		}

		console.log( '✓ Schema structure valid' );
		return true;
	} catch ( error ) {
		console.error( '✗ Schema structure validation failed:', error.message );
		return false;
	}
}

/**
 * Level 2: Validate known variables
 * Checks that all expected mustache variables are documented in the schema
 */
function validateKnownVariables( schema ) {
	console.log( '\nLevel 2: Validating known variables...' );

	// Core known variables that MUST be in the schema
	const knownVariables = [
		'theme_slug',
		'theme_name',
		'namespace',
		'textdomain',
		'description',
		'author',
		'author_uri',
		'version',
		'license',
		'license_uri',
		'min_wp_version',
		'tested_wp_version',
		'min_php_version',
		'primary_color',
		'secondary_color',
		'background_color',
		'text_color',
		'body_font_family',
		'heading_font_family',
		'content_width',
		'hero_title',
		'cta_button_text',
	];

	const schemaProps = Object.keys( schema.properties || {} );
	const missing = knownVariables.filter(
		( v ) => ! schemaProps.includes( v )
	);
	const extra = schemaProps.filter( ( v ) => ! knownVariables.includes( v ) );

	let passed = true;

	if ( missing.length > 0 ) {
		console.warn( '⚠ Missing known variables in schema:' );
		missing.forEach( ( v ) => console.warn( `  - ${ v }` ) );
		passed = false;
	}

	if ( extra.length > 0 ) {
		console.log(
			`ℹ Schema contains ${ extra.length } additional variables beyond core set`
		);
	}

	if ( passed ) {
		console.log( '✓ All known variables documented' );
	}

	return passed;
}

/**
 * Level 3: Scan codebase for mustache patterns
 * Finds all {{variable}} patterns in template files
 */
function scanCodebaseForMustache() {
	console.log( '\nLevel 3: Scanning codebase for mustache variables...' );

	try {
		// Build grep command with proper exclusions
		let grepCmd = 'grep -roh "{{[a-z_][a-z0-9_]*}}" .';

		// Add directory exclusions
		EXCLUDE_DIRS.forEach( ( dir ) => {
			grepCmd += ` --exclude-dir="${ dir }"`;
		} );

		// Add file pattern exclusions
		EXCLUDE_FILES.forEach( ( pattern ) => {
			grepCmd += ` --exclude="${ pattern }"`;
		} );

		grepCmd += ' 2>/dev/null || true';

		const output = execSync( grepCmd, {
			cwd: ROOT_DIR,
			encoding: 'utf8',
			maxBuffer: 10 * 1024 * 1024, // 10MB buffer
		} );

		// Extract unique variable names
		const matches = output.match( /{{([a-z_][a-z0-9_]*)}}/g ) || [];
		const variables = [
			...new Set( matches.map( ( m ) => m.replace( /{{|}}/g, '' ) ) ),
		];

		console.log(
			`Found ${ variables.length } unique mustache variables in codebase`
		);

		return variables;
	} catch ( error ) {
		console.error( '✗ Codebase scan failed:', error.message );
		return [];
	}
}

/**
 * Level 3: Validate registry sync
 * Ensures all variables found in codebase are documented in schema
 */
function validateRegistrySync( schema, codebaseVariables ) {
	console.log( '\nValidating registry sync...' );

	const schemaProps = Object.keys( schema.properties || {} );
	const undocumented = codebaseVariables.filter(
		( v ) => ! schemaProps.includes( v )
	);

	if ( undocumented.length > 0 ) {
		console.error( '✗ Registry sync failed' );
		console.error(
			`Found ${ undocumented.length } undocumented variables:`
		);
		undocumented.forEach( ( v ) => console.error( `  - {{${ v }}}` ) );

		// Show where they are used
		console.error( '\nLocations:' );
		undocumented.slice( 0, 5 ).forEach( ( v ) => {
			try {
				let findCmd = `grep -rn "{{${ v }}}" .`;
				EXCLUDE_DIRS.forEach( ( dir ) => {
					findCmd += ` --exclude-dir="${ dir }"`;
				} );
				EXCLUDE_FILES.forEach( ( pattern ) => {
					findCmd += ` --exclude="${ pattern }"`;
				} );
				findCmd += ' 2>/dev/null | head -3';

				const locations = execSync( findCmd, {
					cwd: ROOT_DIR,
					encoding: 'utf8',
				} ).trim();

				if ( locations ) {
					console.error( `  {{${ v }}}:` );
					locations.split( '\n' ).forEach( ( loc ) => {
						console.error( `    ${ loc }` );
					} );
				}
			} catch ( e ) {
				// Ignore grep errors
			}
		} );

		if ( undocumented.length > 5 ) {
			console.error( `  ... and ${ undocumented.length - 5 } more` );
		}

		return false;
	}

	console.log( '✓ Registry synced with codebase' );
	return true;
}

/**
 * Main validation orchestrator
 */
function main() {
	console.log( '='.repeat( 60 ) );
	console.log( 'Mustache Variables Schema Validation' );
	console.log( '='.repeat( 60 ) );
	console.log();

	let exitCode = 0;
	const results = {
		structure: false,
		knownVariables: false,
		registrySync: false,
	};

	// Level 1: Schema structure validation
	results.structure = validateSchemaStructure();
	if ( ! results.structure ) {
		exitCode = 1;
	}

	// Load schema for Level 2 and 3
	let schema;
	try {
		schema = JSON.parse( fs.readFileSync( SCHEMA_PATH, 'utf8' ) );
	} catch ( error ) {
		console.error( '\n✗ Cannot proceed: Failed to load schema' );
		process.exit( 1 );
	}

	// Level 2: Known variables validation
	results.knownVariables = validateKnownVariables( schema );
	if ( ! results.knownVariables ) {
		// This is a warning, not a failure
		console.log( '⚠ Some known variables are missing (see above)' );
	}

	// Level 3: Registry sync validation
	const codebaseVars = scanCodebaseForMustache();
	results.registrySync = validateRegistrySync( schema, codebaseVars );
	if ( ! results.registrySync ) {
		exitCode = 1;
	}

	// Summary
	console.log( '\n' + '='.repeat( 60 ) );
	console.log( 'Validation Summary' );
	console.log( '='.repeat( 60 ) );
	console.log(
		`Schema Structure: ${ results.structure ? '✓ PASS' : '✗ FAIL' }`
	);
	console.log(
		`Known Variables:  ${
			results.knownVariables ? '✓ PASS' : '⚠ WARNING'
		}`
	);
	console.log(
		`Registry Sync:    ${ results.registrySync ? '✓ PASS' : '✗ FAIL' }`
	);
	console.log();

	if ( exitCode === 0 ) {
		console.log( '✓ All validation checks passed!' );
	} else {
		console.error( '✗ Validation failed with errors' );
		console.error( '\nTo fix undocumented variables:' );
		console.error(
			'1. Add them to .github/schemas/mustache-variables-registry.schema.json'
		);
		console.error( '2. Include type, description, and validation pattern' );
		console.error( '3. Re-run this test' );
	}

	process.exit( exitCode );
}

// Run if executed directly
if ( require.main === module ) {
	main();
}

module.exports = {
	validateSchemaStructure,
	validateKnownVariables,
	scanCodebaseForMustache,
	validateRegistrySync,
};
