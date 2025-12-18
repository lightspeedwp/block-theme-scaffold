#!/usr/bin/env node

const fs = require( 'fs' );
const path = require( 'path' );
const { scanMustacheVariables } = require( './scan' );
const { PLACEHOLDER_MAP } = require( './placeholders' );
const { compareRegistries, generateMarkdownReport, generateConsoleSummary } = require( './registry-diff' );

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

// Compare two variable sets and summarize changes
function summarizeRegistryChanges(oldVars, newVars) {
	const oldKeys = new Set(Object.keys(oldVars));
	const newKeys = new Set(Object.keys(newVars));
	const added = Array.from(newKeys).filter((k) => !oldKeys.has(k));
	const removed = Array.from(oldKeys).filter((k) => !newKeys.has(k));
	const changed = Array.from(newKeys).filter((k) => oldKeys.has(k) && JSON.stringify(oldVars[k]) !== JSON.stringify(newVars[k]));
	return { added, removed, changed };
}

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
		meta: scanResults.meta || {
			undocumented: [],
			unused: [],
			scannedAt: new Date().toISOString()
		}
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

function reportPlaceholderSync(names) {
       const placeholderKeys = new Set(
	       Object.keys(PLACEHOLDER_MAP).map((key) =>
		       key.replace(/^\{\{|\}\}$/g, '')
	       )
       );
       const discovered = new Set(names);

       // Variables found in code but missing from placeholder map
       const missing = names.filter((name) => !placeholderKeys.has(name));
       // Variables in placeholder map but not found in any file
       const unused = Array.from(placeholderKeys).filter((key) => !discovered.has(key));

       if (missing.length > 0) {
	       console.warn(
		       '⚠️  The placeholder map is missing values for the following tokens:'
	       );
	       console.warn(missing.slice(0, 10).map((name) => `  - ${name}`).join('\n'));
	       if (missing.length > 10) {
		       console.warn(`  ...and ${missing.length - 10} more`);
	       }
	       console.warn(
		       'Add entries to scripts/utils/placeholders.js to keep dry-run helpers happy.'
	       );
       }

       if (unused.length > 0) {
	       console.warn(
		       '⚠️  The following placeholders are defined but not used in any file:'
	       );
	       console.warn(unused.slice(0, 10).map((name) => `  - ${name}`).join('\n'));
	       if (unused.length > 10) {
		       console.warn(`  ...and ${unused.length - 10} more`);
	       }
	       console.warn(
		       'Consider removing unused entries from scripts/utils/placeholders.js.'
	       );
       }

       return { missing, unused };
}


function main() {
	const args = process.argv.slice(2);
	const failOnSync = args.includes('--fail-on-sync');
       const scanResults = scanMustacheVariables();
       // Load previous registry for diff
       let prevRegistry = null;
       try {
	       prevRegistry = require(REGISTRY_PATH);
       } catch (e) {}
       const registry = updateRegistryFixture(scanResults);
       const schema = updateRegistrySchema(scanResults);
       updateVariablesSchema(Object.keys(schema.properties).sort());
	const { missing, unused } = reportPlaceholderSync(Object.keys(registry.variables));

	       // Registry change summary using new diff utility
	       let registryOutOfSync = false;
	       const quiet = args.includes('--quiet');

	       if (prevRegistry) {
		       const diff = compareRegistries(prevRegistry, registry);

		       if (diff.summary.totalChanges > 0) {
			       registryOutOfSync = true;

			       // Display console summary unless --quiet flag is set
			       if (!quiet) {
				       console.log(generateConsoleSummary(diff));
			       }

			       // Write markdown report to .github/agents/reports/
			       try {
				       const timestamp = new Date().toISOString();
				       const date = timestamp.split('T')[0];
				       const reportDir = path.join(ROOT_DIR, '.github/agents/reports');
				       if (!fs.existsSync(reportDir)) {
					       fs.mkdirSync(reportDir, { recursive: true });
				       }

				       // Save markdown report
				       const markdownPath = path.join(reportDir, `registry-changes-${date}.md`);
				       const markdownReport = generateMarkdownReport(diff, timestamp);
				       fs.writeFileSync(markdownPath, markdownReport, 'utf8');

				       // Also save JSON diff for programmatic access
				       const jsonPath = path.join(reportDir, `registry-changes-${date}.json`);
				       fs.writeFileSync(jsonPath, JSON.stringify(diff, null, 2), 'utf8');

				       if (!quiet) {
					       console.log(`\n📄 Reports saved to .github/agents/reports/`);
				       }
			       } catch (e) {
				       console.error('Failed to save diff reports:', e.message);
			       }
		       } else {
			       if (!quiet) {
				       console.log('No registry changes detected.');
			       }
		       }
	       }

	       if (missing.length === 0 && unused.length === 0 && !registryOutOfSync) {
		       console.log('✅ Placeholder map and registry are in sync.');
	       }
	       console.log(
		       `✅ Mustache registry refreshed (${registry.summary.uniqueVariables} variables).`
	       );
	       if (failOnSync && (missing.length > 0 || registryOutOfSync)) {
		       console.error('❌ CI/pre-commit: Registry or placeholder map is out of sync.');
		       process.exit(1);
	       }
}

if ( require.main === module ) {
	main();
}
