/**
 * Every block in the theme's templates, parts and patterns is a block
 * WordPress registers, so no template renders an unknown block.
 *
 * The list of core blocks comes from WordPress itself. To refresh it after
 * a WordPress update, on a Studio site with no plugins active:
 *
 *   studio wp eval 'echo json_encode( array_values( array_filter(
 *     array_keys( WP_Block_Type_Registry::get_instance()->get_all_registered() ),
 *     fn( $n ) => str_starts_with( $n, "core/" ) ) ) );'
 *
 * and put the sorted result in scripts/fixtures/core-blocks-wp-7.1.json.
 */
const fs = require( 'fs' );
const path = require( 'path' );

const templateDir = path.resolve( __dirname, '..', '..', 'theme-template' );
const { blocks: coreBlocks } = require( '../fixtures/core-blocks-wp-7.1.json' );
const known = new Set( coreBlocks );

const folders = [ 'templates', 'parts', 'patterns' ];

function blockNames( file ) {
	const source = fs.readFileSync( file, 'utf8' );
	const names = [];
	for ( const match of source.matchAll(
		/<!--\s+wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)/g
	) ) {
		const name = match[ 1 ].includes( '/' )
			? match[ 1 ]
			: `core/${ match[ 1 ] }`;
		names.push( name );
	}
	return names;
}

const files = folders.flatMap( ( folder ) =>
	fs
		.readdirSync( path.join( templateDir, folder ) )
		.filter( ( name ) => /\.(html|php)$/.test( name ) )
		.map( ( name ) => path.join( folder, name ) )
);

describe( 'block names in templates, parts and patterns', () => {
	it( 'finds theme files to check', () => {
		expect( files.length ).toBeGreaterThan( 10 );
	} );

	it.each( files )( '%s uses only registered blocks', ( file ) => {
		const unknown = blockNames( path.join( templateDir, file ) ).filter(
			( name ) => ! known.has( name )
		);
		expect( unknown ).toEqual( [] );
	} );
} );
