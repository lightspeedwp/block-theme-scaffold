#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );
const { scanMustacheVariables } = require( './scan' );
const { PLACEHOLDER_MAP } = require( './placeholders' );

const ROOT_DIR = path.resolve( __dirname, '..', '..' );
const REGISTRY_PATH = path.join(
	ROOT_DIR,
	'scripts/mustache-variables-registry.json'
);
const REGISTRY_SCHEMA_PATH = path.join(
	ROOT_DIR,
	'.github/schemas/mustache-variables-registry.schema.json'
);
const VARIABLES_SCHEMA_PATH = path.join(
	ROOT_DIR,
	'.github/schemas/mustache-variables.schema.json'
);

function writeJsonFile( filePath, value ) {
	fs.writeFileSync( filePath, JSON.stringify( value, null, 2 ) + '\n', 'utf8' );
}

function updateRegistryFixture( scanResults ) {
	const sortedVariables = {};
	Object.keys( scanResults.variables )
		.sort()
		.forEach( ( key ) => {
			sortedVariables[ key ] = scanResults.variables[ key ];
		} );

	const registry = {
		summary: scanResults.summary,
		variables: sortedVariables,
	};

	writeJsonFile( REGISTRY_PATH, registry );
	return registry;
}

function ensureSchemaStructure( existingSchema ) {
	const defaults = {
		title: 'Mustache Variables Registry',
		description: 'Auto-generated list of mustache placeholders used in the scaffold',
		type: 'object',
		properties: {},
		required: [ 'theme_slug', 'theme_name', 'author' ],
		additionalProperties: false,
	};

	return {
		...defaults,
		...existingSchema,
		properties: existingSchema?.properties || {},
		required: Array.from(
			new Set( [
				...( existingSchema?.required || [] ),
				'theme_slug',
				'theme_name',
				'author',
			] )
		),
	};
}

function updateRegistrySchema( scanResults ) {
	const existing = loadJson( REGISTRY_SCHEMA_PATH );
	const schema = ensureSchemaStructure( existing );
	const updatedProperties = {};
	const variableNames = Object.keys( scanResults.variables ).sort();

	variableNames.forEach( ( name ) => {
		if ( schema.properties[ name ] ) {
			updatedProperties[ name ] = schema.properties[ name ];
			return;
		}

		const category = scanResults.variables[ name ]?.category || 'other';
		updatedProperties[ name ] = {
			type: 'string',
			description: `Auto-discovered placeholder (${ category })`,
			examples: [ name ],
		};
	} );

	schema.properties = updatedProperties;
	writeJsonFile( REGISTRY_SCHEMA_PATH, schema );

	return schema;
}

function updateVariablesSchema( names ) {
	const schema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		$id: 'https://github.com/lightspeedwp/block-theme-scaffold/schemas/mustache-variables',
		title: 'Mustache Variable Names',
		description: 'Enumerates every mustache placeholder currently discovered in the scaffold.',
		type: 'string',
		enum: names,
		examples: names.slice( 0, 3 ),
	};

	writeJsonFile( VARIABLES_SCHEMA_PATH, schema );
	return schema;
}

function loadJson( filePath ) {
	try {
		const text = fs.readFileSync( filePath, 'utf8' );
		return JSON.parse( text );
	} catch ( error ) {
		return null;
	}
}

function reportMissingPlaceholders( names ) {
	const placeholderKeys = new Set(
		Object.keys( PLACEHOLDER_MAP ).map( ( key ) =>
			key.replace( /^\{\{|\}\}$/g, '' )
		)
	);
	const missing = names.filter( ( name ) => !placeholderKeys.has( name ) );

	if ( missing.length > 0 ) {
		console.warn(
			'⚠️  The placeholder map is missing values for the following tokens:'
		);
		console.warn( missing.slice( 0, 10 ).map( ( name ) => `  - ${ name }` ).join( '\n' ) );
		if ( missing.length > 10 ) {
			console.warn( `  ...and ${ missing.length - 10 } more` );
		}
		console.warn(
			'Add entries to scripts/utils/placeholders.js to keep dry-run helpers happy.'
		);
	}

	return missing;
}

function main() {
	const scanResults = scanMustacheVariables();
	const registry = updateRegistryFixture( scanResults );
	const schema = updateRegistrySchema( scanResults );
	updateVariablesSchema( Object.keys( schema.properties ).sort() );
	reportMissingPlaceholders( Object.keys( registry.variables ) );

	console.log(
		`✅ Mustache registry refreshed (${ registry.summary.uniqueVariables } variables).`
	);
}

if ( require.main === module ) {
	main();
}
