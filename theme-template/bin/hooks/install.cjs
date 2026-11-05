#!/usr/bin/env node
/**
 * Installs the Lefthook git hooks; npm runs it as the prepare script.
 *
 * Outside a git checkout (an unpacked release, or a theme just generated
 * from the scaffold) there is nothing to install, so it exits quietly, as
 * Husky did. `--reset-hooks-path` moves a clone that used Husky over.
 */
const { execFileSync } = require( 'node:child_process' );

try {
	execFileSync( 'git', [ 'rev-parse', '--git-dir' ], { stdio: 'ignore' } );
} catch {
	process.exit( 0 );
}

execFileSync( 'lefthook', [ 'install', '--reset-hooks-path' ], {
	stdio: 'inherit',
	shell: process.platform === 'win32',
} );
