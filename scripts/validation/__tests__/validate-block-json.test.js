// tests/js/validate-block-json.test.js
// Block JSON validation test for all block.json files in src/blocks/

const fs = require( 'fs' );
const path = require( 'path' );
const Ajv = require( 'ajv' );
const glob = require( 'glob' );

// Load block.json schema from instructions
const repoRoot = path.resolve( __dirname, '..', '..', '..' );
const schemaPath = path.join(
	repoRoot,
	'.github',
	'instructions',
	'block-json.schema.json'
);
let blockJsonSchema;
try {
	blockJsonSchema = JSON.parse( fs.readFileSync( schemaPath, 'utf8' ) );
} catch ( e ) {
	throw new Error( 'Could not load block-json.schema.json: ' + e.message );
}

const ajv = new Ajv( { allErrors: true, allowUnionTypes: true } );
const validate = ajv.compile( blockJsonSchema );

describe( 'Block JSON schema validation', () => {
	const blockJsonFiles = glob.sync(
		path.join( repoRoot, 'src', 'blocks', '**', 'block.json' )
	);

	if ( blockJsonFiles.length === 0 ) {
		test( 'No block.json files found', () => {
			expect( blockJsonFiles ).toHaveLength( 0 );
		} );
		return;
	}

	blockJsonFiles.forEach( ( file ) => {
		test( `Validates ${ path.relative( process.cwd(), file ) }`, () => {
			const json = JSON.parse( fs.readFileSync( file, 'utf8' ) );
			const valid = validate( json );
			if ( ! valid ) {
				// Print all errors for easier debugging
				// eslint-disable-next-line no-console
				console.error( validate.errors );
			}
			expect( valid ).toBe( true );
		} );
	} );
} );
