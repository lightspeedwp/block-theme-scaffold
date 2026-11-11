/**
 * Every input the theme config schema offers is read by the generator.
 *
 * generate-theme.js flattens the config (design_system.typography.body_font_family
 * becomes configData.design_system_typography_body_font_family), so each leaf
 * key in the schema must appear as a configData read. A key that nothing reads
 * lets a project set a value that silently does nothing (BTS-40).
 */
const fs = require( 'fs' );
const path = require( 'path' );

const root = path.resolve( __dirname, '..', '..' );
const schema = JSON.parse(
	fs.readFileSync(
		path.join( root, '.github/schemas/theme-config.schema.json' ),
		'utf8'
	)
);
const generator = fs.readFileSync(
	path.join( root, 'scripts/generate-theme.js' ),
	'utf8'
);

function leafKeys( node, trail = [] ) {
	if ( ! node || ! node.properties ) {
		return [ trail ];
	}
	return Object.entries( node.properties ).flatMap( ( [ key, child ] ) =>
		leafKeys( child, [ ...trail, key ] )
	);
}

describe( 'theme config schema', () => {
	it( 'offers only inputs the generator reads', () => {
		const unread = leafKeys( schema )
			// _comment is documentation inside the config file, not an input.
			.filter( ( trail ) => trail[ 0 ] !== '_comment' )
			.map( ( trail ) => trail.join( '_' ) )
			.filter(
				( flat ) =>
					! new RegExp( `configData\\.${ flat }\\b` ).test(
						generator
					)
			);
		expect( unread ).toEqual( [] );
	} );
} );
