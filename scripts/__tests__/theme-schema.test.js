const Ajv = require( 'ajv' );
const addFormats = require( 'ajv-formats' );

// Use the local theme.json schema for the block theme scaffold
const themeSchema = require( '../../.github/schemas/theme.6.9.json' );

describe( 'Theme JSON schema fixture', () => {
	const ajv = new Ajv( { allErrors: true, strict: false } );
	addFormats( ajv );

	it( 'is a valid JSON Schema for WordPress block themes', () => {
		const isValidSchema = ajv.validateSchema( themeSchema );

		if ( ! isValidSchema ) {
			const errors = ajv.errorsText
				? ajv.errorsText( ajv.errors, { separator: '; ' } )
				: ( ajv.errors || [] )
						.map( ( error ) => error.message )
						.join( '; ' );
			throw new Error( `Theme schema validation failed: ${ errors }` );
		}

		expect( isValidSchema ).toBe( true );
	} );
} );
