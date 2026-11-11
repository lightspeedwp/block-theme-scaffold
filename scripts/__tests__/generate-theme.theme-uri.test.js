/**
 * The Theme URI is required: generation stops without it, and the value
 * reaches style.css and package.json.
 */
const { spawnSync } = require( 'child_process' );
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const generator = path.resolve( __dirname, '..', 'generate-theme.js' );
const cleanup = [];

function run( args ) {
	const cwd = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-theme-uri-' ) );
	cleanup.push( cwd );
	const result = spawnSync( process.execPath, [ generator, ...args ], {
		cwd,
		encoding: 'utf8',
	} );
	return { ...result, cwd };
}

function writeConfig( config ) {
	const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-config-' ) );
	cleanup.push( dir );
	const file = path.join( dir, 'theme-config.json' );
	fs.writeFileSync( file, JSON.stringify( config ) );
	return file;
}

const identity = [
	'--slug',
	'uri-theme',
	'--name',
	'URI Theme',
	'--author',
	'LightSpeed',
];

afterAll( () => {
	for ( const dir of cleanup ) {
		fs.rmSync( dir, { recursive: true, force: true } );
	}
} );

describe( 'theme URI', () => {
	it( 'still shows the help without a theme URI', () => {
		const result = run( [ '--help' ] );
		expect( result.status ).toBe( 0 );
		expect( result.stdout ).toContain( '--theme_uri' );
	} );

	it( 'stops CLI generation when --theme_uri is missing', () => {
		const result = run( identity );
		expect( result.status ).not.toBe( 0 );
		expect( result.stderr ).toContain( 'Theme URI is required' );
	} );

	it( 'stops config generation when theme_uri is missing', () => {
		const config = writeConfig( {
			theme_slug: 'uri-theme',
			theme_name: 'URI Theme',
			author: 'LightSpeed',
		} );
		const result = run( [ '--config', config ] );
		expect( result.status ).not.toBe( 0 );
	} );

	it( 'rejects a theme URI without http or https', () => {
		const result = run( [
			...identity,
			'--theme_uri',
			'example.com/theme',
		] );
		expect( result.status ).not.toBe( 0 );
		expect( result.stderr ).toContain( 'Invalid theme URI' );
	} );

	it( 'writes the theme URI to style.css and package.json', () => {
		const uri = 'https://lightspeedwp.agency/themes/uri-theme';
		const result = run( [ ...identity, '--theme_uri', uri ] );
		expect( result.status ).toBe( 0 );

		const output = path.join( result.cwd, 'output-theme' );
		const style = fs.readFileSync(
			path.join( output, 'style.css' ),
			'utf8'
		);
		const pkg = JSON.parse(
			fs.readFileSync( path.join( output, 'package.json' ), 'utf8' )
		);
		expect( style ).toContain( `Theme URI: ${ uri }` );
		expect( pkg.homepage ).toBe( uri );
	} );
} );
