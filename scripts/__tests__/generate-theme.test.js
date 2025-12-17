/**
 * Tests for scripts/generate-theme.js
 *
 * @package
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { execFileSync } = require( 'child_process' );

const scriptPath = path.resolve( __dirname, '..', 'generate-theme.js' );
const outputDir = path.resolve( process.cwd(), 'output-theme' );

const runScript = ( ...args ) =>
	execFileSync( 'node', [ scriptPath, ...args ], {
		encoding: 'utf8',
		stdio: [ 'pipe', 'pipe', 'pipe' ],
	} );

const cleanupOutput = () => {
	if ( fs.existsSync( outputDir ) ) {
		fs.rmSync( outputDir, { recursive: true, force: true } );
	}
};

describe( 'scripts/generate-theme.js', () => {
	beforeEach( () => {
		cleanupOutput();
	} );

	afterEach( () => {
		cleanupOutput();
	} );

	test( 'prints the help message when --help is passed', () => {
		const output = runScript( '--help' );
		expect( output ).toContain( 'WordPress Block Theme Generator' );
		expect( output ).toContain( 'USAGE:' );
	} );

	test( 'fails fast for an invalid slug before writing output', () => {
		let execError;
		try {
			runScript(
				'--slug',
				'a',
				'--name',
				'Test Theme',
				'--author',
				'Tester',
				'--author_uri',
				'https://example.com'
			);
		} catch ( error ) {
			execError = error;
		}

		expect( execError ).toBeDefined();
		expect( execError.stderr ).toContain( '❌ Error: Invalid slug' );
		expect( fs.existsSync( outputDir ) ).toBe( false );
	} );
} );
