// Dry-run script for mustache schema test
const { runWithDryRun } = require( './with-dry-run' );
process.exitCode = runWithDryRun( 'npm', [ 'run', 'test:schema' ] );
