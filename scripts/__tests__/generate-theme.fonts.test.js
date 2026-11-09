/**
 * The four role-named font families come from the config, with defaults.
 */
const { execFileSync } = require( 'child_process' );
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const generator = path.resolve( __dirname, '..', 'generate-theme.js' );
const cleanup = [];

function generateWith( typography ) {
	const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-fonts-' ) );
	cleanup.push( dir );
	const configPath = path.join( dir, 'theme-config.json' );
	fs.writeFileSync(
		configPath,
		JSON.stringify( {
			theme_slug: 'font-theme',
			theme_name: 'Font Theme',
			author: 'LightSpeed',
			theme_uri: 'https://lightspeedwp.agency/themes/font-theme',
			design_system: { typography },
		} )
	);
	execFileSync( process.execPath, [ generator, '--config', configPath ], {
		cwd: dir,
		stdio: 'pipe',
	} );
	const themeJson = JSON.parse(
		fs.readFileSync(
			path.join( dir, 'output-theme', 'font-theme', 'theme.json' ),
			'utf8'
		)
	);
	return Object.fromEntries(
		themeJson.settings.typography.fontFamilies.map( ( family ) => [
			family.slug,
			family,
		] )
	);
}

afterAll( () => {
	for ( const dir of cleanup ) {
		fs.rmSync( dir, { recursive: true, force: true } );
	}
} );

describe( 'font families', () => {
	it( 'uses the configured font for every role', () => {
		const families = generateWith( {
			heading_font_family: 'Moret, Georgia, serif',
			heading_font_name: 'Moret',
			body_font_family: '"Argesta Display", Georgia, serif',
			body_font_name: 'Argesta Display',
			accent_font_family: '"Playfair Display", Georgia, serif',
			accent_font_name: 'Playfair Display',
			mono_font_family: '"JetBrains Mono", monospace',
			mono_font_name: 'JetBrains Mono',
		} );

		expect( Object.keys( families ).sort() ).toEqual( [
			'accent',
			'body',
			'heading',
			'monospace',
		] );
		expect( families.heading.name ).toBe( 'Moret' );
		expect( families.body.name ).toBe( 'Argesta Display' );
		expect( families.accent ).toMatchObject( {
			name: 'Playfair Display',
			fontFamily: '"Playfair Display", Georgia, serif',
		} );
		expect( families.monospace.name ).toBe( 'JetBrains Mono' );
	} );

	it( 'falls back to Georgia for the accent font', () => {
		const families = generateWith( {} );
		expect( families.accent.name ).toBe( 'Georgia' );
		expect( families.accent.fontFamily ).toContain( 'Georgia' );
	} );
} );
