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
		},
		{
			name: 'custom colors including alpha',
			colors: {
				primary_color: '#123456',
				secondary_color: '#ff000080',
				accent_color: '#0000ff',
			},
		},
	] )(
		'builds every ramp around its configured colour for $name',
		( { colors } ) => {
			const colorRamp = require( '../utils/color-ramp' );
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
			const configured = {
				primary: colors.primary_color,
				brand: colors.secondary_color || '#005177',
				cta: colors.accent_color || '#ff6b35',
			};
			for ( const [ family, color ] of Object.entries( configured ) ) {
				const ramp = colorRamp.RAMP_STEPS.map( ( step ) =>
					get( `${ family }-${ step }` )
				);
				// The configured colour sits, unchanged, at its nearest step.
				expect( ramp ).toContain( color );
				expect( ramp ).toEqual( Object.values( colorRamp( color ) ) );
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

	it( 'builds every palette ramp in OKLCH, lightest to darkest', () => {
		const { Color, RAMP_STEPS } = require( '../utils/color-ramp' );
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const palette = JSON.parse(
			fs.readFileSync( path.join( output, 'theme.json' ), 'utf8' )
		).settings.color.palette;
		const get = ( slug ) =>
			palette.find( ( entry ) => entry.slug === slug ).color;
		for ( const family of [ 'primary', 'neutral', 'brand', 'cta' ] ) {
			const lightness = RAMP_STEPS.map(
				( step ) =>
					Color.fromHex( get( `${ family }-${ step }` ) ).toOklch().l
			);
			for ( let i = 1; i < lightness.length; i++ ) {
				expect( lightness[ i ] ).toBeLessThan( lightness[ i - 1 ] );
			}
		}
	} );

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

	it( 'uses numeric shadow slugs, and every shadow reference matches a preset', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const { presets } = JSON.parse(
			fs.readFileSync( path.join( output, 'theme.json' ), 'utf8' )
		).settings.shadow;
		// The figma-to-block-theme Tokens mode writes the same slugs (BTS-30).
		const slugs = presets.map( ( preset ) => preset.slug );
		expect( slugs ).toEqual( [ '100', '200', '300', '400', '500', '600' ] );

		const unknown = [];
		for ( const entry of fs.readdirSync( output, {
			recursive: true,
			withFileTypes: true,
		} ) ) {
			const file = path.join( entry.parentPath, entry.name );
			const relative = path.relative( output, file );
			if (
				! entry.isFile() ||
				/(^|\/)(\.agents|\.claude|node_modules)\//.test( relative )
			) {
				continue;
			}
			const text = fs.readFileSync( file, 'utf8' );
			for ( const [ , slug ] of text.matchAll(
				/(?:--wp--preset--shadow--|var:preset\|shadow\|)([a-z0-9-]+)/g
			) ) {
				if ( ! slugs.includes( slug ) ) {
					unknown.push( `${ relative }: ${ slug }` );
				}
			}
		}
		expect( unknown ).toEqual( [] );
	} );

	it( 'ships the per-block stylesheet loader and an example block stylesheet', () => {
		const { cwd, output } = generate( mockConfig );
		cleanup.push( cwd );
		const read = ( file ) =>
			fs.readFileSync( path.join( output, file ), 'utf8' );
		expect( read( 'functions.php' ) ).toContain(
			"'inc/block-stylesheets.php'"
		);
		expect( read( 'inc/block-stylesheets.php' ) ).toContain(
			'wp_enqueue_block_style('
		);
		expect( read( 'src/styles/core-button.scss' ) ).toContain(
			'.wp-block-button'
		);
		expect( read( 'webpack.config.js' ) ).toContain( '...blockStyles' );
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
