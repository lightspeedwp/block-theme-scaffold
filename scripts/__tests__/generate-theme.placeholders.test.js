/**
 * Generation leaves no unreplaced {{placeholder}} in a generated theme.
 * GitHub Actions expressions (${{ github.ref }}) have spaces and are not placeholders.
 *
 * Runs scripts/generate-theme.js in a temporary directory with the mock
 * config and with only the required keys, then scans every generated file.
 */
const { execFileSync } = require( 'child_process' );
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const generator = path.resolve( __dirname, '..', 'generate-theme.js' );
const mockConfig = path.resolve(
	__dirname,
	'..',
	'fixtures',
	'theme-config.mock.json'
);

function generate( configPath ) {
	const cwd = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-generate-' ) );
	execFileSync( process.execPath, [ generator, '--config', configPath ], {
		cwd,
		stdio: 'pipe',
	} );
	return { cwd, output: path.join( cwd, 'output-theme' ) };
}

function leftovers( dir ) {
	const found = [];
	for ( const entry of fs.readdirSync( dir, {
		recursive: true,
		withFileTypes: true,
	} ) ) {
		if ( ! entry.isFile() ) {
			continue;
		}
		const file = path.join( entry.parentPath, entry.name );
		const tokens = fs
			.readFileSync( file, 'utf8' )
			.match( /\{\{\{?[^{}\s]+\}?\}\}/g );
		if ( tokens ) {
			found.push(
				`${ path.relative( dir, file ) }: ${ tokens.join( ' ' ) }`
			);
		}
	}
	return found;
}

describe( 'generate-theme placeholders', () => {
	const cleanup = [];

	afterAll( () => {
		for ( const dir of cleanup ) {
			fs.rmSync( dir, { recursive: true, force: true } );
		}
	} );

	it( 'replaces every placeholder with the full mock config', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		expect( leftovers( output ) ).toEqual( [] );
	} );

	it( 'replaces every placeholder with only the required keys', () => {
		const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-config-' ) );
		cleanup.push( dir );
		const configPath = path.join( dir, 'minimal.json' );
		fs.writeFileSync(
			configPath,
			JSON.stringify( {
				theme_slug: 'minimal-theme',
				theme_name: 'Minimal & Theme',
				author: 'LightSpeed',
			} )
		);
		const { cwd, output } = generate( configPath );
		cleanup.push( cwd );
		expect( leftovers( output ) ).toEqual( [] );

		// The XML-escaped name keeps phpcs.xml well formed.
		expect(
			fs.readFileSync( path.join( output, 'phpcs.xml' ), 'utf8' )
		).toContain( 'name="Minimal &amp; Theme"' );
	} );

	it.each( [
		{
			name: 'defaults with a customized primary',
			colors: { primary_color: '#aa00cc' },
			primary: '#aa00cc',
			brand: [
				'#ccdce4',
				'#99b9c9',
				'#6697ad',
				'#337492',
				'#005177',
				'#00415f',
				'#003147',
				'#002030',
				'#001018',
			],
			cta: [
				'#ffe1d7',
				'#ffc4ae',
				'#ffa686',
				'#ff895d',
				'#ff6b35',
				'#cc562a',
				'#994020',
				'#662b15',
				'#33150b',
			],
		},
		{
			name: 'custom colors including alpha',
			colors: {
				primary_color: '#123456',
				secondary_color: '#ff000080',
				accent_color: '#0000ff',
			},
			primary: '#123456',
			brand: [
				'#ffcccc80',
				'#ff999980',
				'#ff666680',
				'#ff333380',
				'#ff000080',
				'#cc000080',
				'#99000080',
				'#66000080',
				'#33000080',
			],
			cta: [
				'#ccccff',
				'#9999ff',
				'#6666ff',
				'#3333ff',
				'#0000ff',
				'#0000cc',
				'#000099',
				'#000066',
				'#000033',
			],
		},
	] )(
		'generates consistent ramps for $name',
		( { colors, primary, brand, cta } ) => {
			const dir = fs.mkdtempSync(
				path.join( os.tmpdir(), 'bts-config-' )
			);
			cleanup.push( dir );
			const configPath = path.join( dir, 'colors.json' );
			fs.writeFileSync(
				configPath,
				JSON.stringify( {
					theme_slug: 'color-theme',
					theme_name: 'Color Theme',
					author: 'LightSpeed',
					design_system: { colors },
				} )
			);
			const { cwd, output } = generate( configPath );
			cleanup.push( cwd );
			const palette = JSON.parse(
				fs.readFileSync( path.join( output, 'theme.json' ), 'utf8' )
			).settings.color.palette;
			const get = ( slug ) =>
				palette.find( ( entry ) => entry.slug === slug ).color;
			expect( get( 'primary-500' ) ).toBe( primary );
			for ( const [ family, expected ] of [
				[ 'brand', brand ],
				[ 'cta', cta ],
			] ) {
				expect(
					Array.from( { length: 9 }, ( _, i ) =>
						get( `${ family }-${ ( i + 1 ) * 100 }` )
					)
				).toEqual( expected );
			}
			// The dark variation inherits the palette from theme.json and only remaps semantic tokens.
			const dark = JSON.parse(
				fs.readFileSync(
					path.join( output, 'styles/dark.json' ),
					'utf8'
				)
			);
			expect( dark.settings.color ).toBeUndefined();
		}
	);

	it( 'gives every semantic colour token a dark value that references the palette', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const read = ( file ) =>
			JSON.parse( fs.readFileSync( path.join( output, file ), 'utf8' ) )
				.settings.custom.color;
		const flatten = ( node, prefix = '' ) =>
			Object.entries( node ).flatMap( ( [ key, value ] ) =>
				value && typeof value === 'object'
					? flatten( value, `${ prefix }${ key }.` )
					: [ [ `${ prefix }${ key }`, value ] ]
			);
		const light = Object.fromEntries( flatten( read( 'theme.json' ) ) );
		const dark = Object.fromEntries(
			flatten( read( 'styles/dark.json' ) )
		);
		expect( Object.keys( dark ).sort() ).toEqual(
			Object.keys( light ).sort()
		);
		for ( const value of [
			...Object.values( light ),
			...Object.values( dark ),
		] ) {
			expect( value ).not.toMatch( /#[0-9a-f]{3,8}\b/i );
			expect( value ).toMatch( /var\(--wp--(preset|custom)--color--/ );
		}
	} );

	it( 'defines the LightSpeed layer and motion tokens', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const { layer, motion } = JSON.parse(
			fs.readFileSync( path.join( output, 'theme.json' ), 'utf8' )
		).settings.custom;
		// Values follow the lightspeedwp/.github layer and animation standards,
		// plus a skip-link role and a 200ms duration-100 (BTS-26).
		expect( layer ).toEqual( {
			base: '1',
			sticky: '10',
			dropdown: '20',
			popover: '30',
			overlay: '40',
			modal: '50',
			toast: '60',
			'skip-link': '70',
		} );
		expect( motion.duration ).toEqual( {
			100: '200ms',
			200: '300ms',
			300: '500ms',
			400: '700ms',
			500: '1000ms',
		} );
		expect( Object.keys( motion.easing ) ).toEqual( [
			'standard',
			'accelerate',
			'decelerate',
			'sharp',
			'linear',
		] );
		expect( motion.delay ).toEqual( {
			micro: '50ms',
			small: '100ms',
			medium: '200ms',
			large: '400ms',
		} );
	} );

	it( 'reads the repository URL from urls.theme_repo_url', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const pkg = JSON.parse(
			fs.readFileSync( path.join( output, 'package.json' ), 'utf8' )
		);
		expect( pkg.repository.url ).toBe(
			'https://github.com/lightspeedwp/tour-operator'
		);
	} );
} );
