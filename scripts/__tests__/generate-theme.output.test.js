/**
 * The theme is written to ./output-theme/<slug>/, or to --output, and the
 * next steps tell you where to copy it.
 */
const { spawnSync } = require( 'child_process' );
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );

const generator = path.resolve( __dirname, '..', 'generate-theme.js' );
const cleanup = [];

const identity = [
	'--slug',
	'out-theme',
	'--name',
	'Out Theme',
	'--author',
	'LightSpeed',
	'--theme_uri',
	'https://lightspeedwp.agency/themes/out-theme',
];

function tempDir() {
	const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-output-' ) );
	cleanup.push( dir );
	return dir;
}

function run( cwd, args ) {
	return spawnSync( process.execPath, [ generator, ...identity, ...args ], {
		cwd,
		encoding: 'utf8',
	} );
}

afterAll( () => {
	for ( const dir of cleanup ) {
		fs.rmSync( dir, { recursive: true, force: true } );
	}
} );

describe( 'output folder', () => {
	it( 'writes to output-theme/<slug>/ by default', () => {
		const cwd = tempDir();
		const result = run( cwd, [] );
		expect( result.status ).toBe( 0 );
		expect(
			fs.existsSync(
				path.join( cwd, 'output-theme', 'out-theme', 'style.css' )
			)
		).toBe( true );
		expect( result.stdout ).toContain(
			'Copy output-theme/out-theme/ to wp-content/themes/out-theme/'
		);
	} );

	it( 'writes to the --output folder', () => {
		const cwd = tempDir();
		const target = path.join( cwd, 'wp-content', 'themes', 'out-theme' );
		const result = run( cwd, [ '--output', target ] );
		expect( result.status ).toBe( 0 );
		expect( fs.existsSync( path.join( target, 'style.css' ) ) ).toBe(
			true
		);
		expect( fs.existsSync( path.join( cwd, 'output-theme' ) ) ).toBe(
			false
		);
		expect( result.stdout ).toContain( 'Already in wp-content/themes/' );
	} );

	it( 'stops when the folder already exists', () => {
		const cwd = tempDir();
		fs.mkdirSync( path.join( cwd, 'output-theme', 'out-theme' ), {
			recursive: true,
		} );
		const result = run( cwd, [] );
		expect( result.status ).not.toBe( 0 );
		expect( result.stderr ).toContain( 'already exists' );
	} );
} );
