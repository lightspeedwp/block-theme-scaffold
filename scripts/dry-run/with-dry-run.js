/**
 * Run a command with a dry-run copy of theme-template/.
 *
 * Copies theme-template/ (without node_modules, vendor, build or dist) to a
 * temporary folder, replaces its {{placeholders}} with the dry-run values,
 * runs the command with DRY_RUN_THEME_DIR pointing at that copy, then deletes
 * the copy. theme-template/ itself is never written: replacing in place and
 * restoring afterwards corrupted it whenever two runs overlapped (Jest runs
 * the dry-run tests in parallel workers).
 *
 * Usage: node scripts/dry-run/with-dry-run.js <command> [args]
 */
const fs = require( 'fs' );
const os = require( 'os' );
const path = require( 'path' );
const { spawnSync } = require( 'child_process' );
const { replaceMustacheVars } = require( './dry-run-config' );

const templateDir = path.resolve( __dirname, '..', '..', 'theme-template' );
const SKIPPED = new Set( [
	'node_modules',
	'vendor',
	'build',
	'dist',
	'.DS_Store',
] );
const TEXT_EXTENSIONS = new Set( [
	'.js',
	'.jsx',
	'.ts',
	'.tsx',
	'.cjs',
	'.mjs',
	'.scss',
	'.css',
	'.json',
	'.php',
	'.html',
	'.md',
	'.txt',
	'.xml',
	'.yml',
	'.yaml',
	'.neon',
	'.pot',
] );

/**
 * Copy theme-template/ into dest, replacing placeholders in text files.
 *
 * @param {string} src  Source folder.
 * @param {string} dest Destination folder.
 */
function copyRendered( src, dest ) {
	fs.mkdirSync( dest, { recursive: true } );
	for ( const entry of fs.readdirSync( src, { withFileTypes: true } ) ) {
		if ( SKIPPED.has( entry.name ) ) {
			continue;
		}
		const from = path.join( src, entry.name );
		const to = path.join( dest, replaceMustacheVars( entry.name ) );
		if ( entry.isDirectory() ) {
			copyRendered( from, to );
		} else if (
			TEXT_EXTENSIONS.has( path.extname( entry.name ).toLowerCase() )
		) {
			fs.writeFileSync(
				to,
				replaceMustacheVars( fs.readFileSync( from, 'utf8' ) ),
				'utf8'
			);
		} else {
			fs.copyFileSync( from, to );
		}
	}
}

/**
 * Render theme-template/ into a new temporary folder.
 *
 * @return {string} The rendered copy's path.
 */
function createDryRunCopy() {
	const dir = fs.mkdtempSync( path.join( os.tmpdir(), 'bts-dry-run-' ) );
	copyRendered( templateDir, dir );
	return dir;
}

/**
 * Run a command with DRY_RUN_THEME_DIR set to a rendered copy of the template.
 *
 * @param {string}   command The command.
 * @param {string[]} args    Its arguments.
 * @param {Object}   options cwd, env and shell for spawnSync.
 * @return {number} The command's exit code.
 */
function runWithDryRun( command, args = [], options = {} ) {
	if ( ! command ) {
		throw new Error( 'Command is required for dry-run wrapper.' );
	}

	const themeDir = createDryRunCopy();
	try {
		const result = spawnSync( command, args, {
			stdio: 'inherit',
			cwd: options.cwd || process.cwd(),
			env: {
				...( options.env ?? process.env ),
				DRY_RUN_THEME_DIR: themeDir,
			},
			shell: options.shell ?? false,
		} );
		return result.status ?? 1;
	} finally {
		fs.rmSync( themeDir, { recursive: true, force: true } );
	}
}

function main() {
	const rawArgs = process.argv.slice( 2 );
	if ( rawArgs.length === 0 ) {
		console.error(
			'Usage: node scripts/dry-run/with-dry-run.js <command> [args]'
		);
		process.exit( 1 );
	}

	process.exit( runWithDryRun( rawArgs[ 0 ], rawArgs.slice( 1 ) ) );
}

if ( require.main === module ) {
	main();
}

module.exports = {
	createDryRunCopy,
	runWithDryRun,
};
