// Dry run tests for validating {{mustache}} placeholder variables in scaffold files
const fs = require( 'fs' );
const path = require( 'path' );
const {
	replaceMustacheVars,
	DRY_RUN_VALUES,
} = require( '../../dry-run-config' );
const glob = require( 'glob' );

// Use glob to find all files, including ignored ones, then filter for mustache variables
function findMustacheFilesGlob( rootDir ) {
	const baseDir = rootDir || process.cwd();
	// Match all relevant file types recursively, including dotfiles and ignored files
	const patterns = [
		'**/*.{js,jsx,ts,tsx,php,json,scss,md,txt,html}',
		'**/readme.txt',
		'**/composer.json',
		'**/package.json',
		'**/*.php',
		'**/*.md',
		'**/*.js',
		'**/*.json',
		'**/*.scss',
		'**/*.html',
		'**/*.txt',
	];
	let files = [];
	patterns.forEach( ( pattern ) => {
		const matched = glob.sync( pattern, {
			cwd: baseDir,
			absolute: true,
			dot: true,
			ignore: [], // Don't ignore anything
			nodir: true,
			follow: true,
		} );
		files = files.concat( matched );
	} );
	// Remove duplicates
	files = Array.from( new Set( files ) );
	// Only keep files containing mustache variables
	const mustacheFiles = files.filter( ( file ) => {
		try {
			const content = fs.readFileSync( file, 'utf8' );
			return /\{\{[a-z_]+\}\}/i.test( content );
		} catch ( e ) {
			return false;
		}
	} );
	return mustacheFiles;
}

describe( 'Dry Run Mustache Variable Validation', () => {
	const ROOT_DIR = path.resolve( __dirname, '../../..' );

	test( 'All scaffold files with mustache variables are detected', () => {
		const files = findMustacheFilesGlob( ROOT_DIR );
		expect( Array.isArray( files ) ).toBe( true );
		expect( files.length ).toBeGreaterThan( 0 );
		files.forEach( ( file ) => {
			expect( typeof file ).toBe( 'string' );
			expect( file ).toMatch(
				/\.(js|jsx|ts|tsx|php|json|scss|md|txt|html)$/
			);
		} );
	} );

	test( 'All mustache files can be dry-run replaced without placeholders', () => {
		const files = findMustacheFilesGlob( ROOT_DIR );
		expect( files.length ).toBeGreaterThan( 0 );
		files.forEach( ( file ) => {
			const content = fs.readFileSync( file, 'utf8' );
			const replaced = replaceMustacheVars( content, DRY_RUN_VALUES );
			expect( replaced ).not.toMatch( /\{\{[a-z_]+\}\}/i );
		} );
	} );

	test( 'All mustache variables in DRY_RUN_VALUES are valid', () => {
		Object.keys( DRY_RUN_VALUES ).forEach( ( key ) => {
			expect( DRY_RUN_VALUES[ key ] ).toBeDefined();
			expect( DRY_RUN_VALUES[ key ] ).not.toMatch( /\{\{.*?\}\}/ );
		} );
	} );
} );
