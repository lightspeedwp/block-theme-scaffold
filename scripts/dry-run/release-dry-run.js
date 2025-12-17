/**
 * Dry-run wrapper for the release agents.
 *
 * Substitutes mustache placeholders before invoking the release or release-scaffold
 * agents so we can smoke-test release flows without generating a full theme.
 */
const path = require( 'path' );
const { runWithDryRun } = require( './with-dry-run' );

const AGENT_TARGETS = {
  release: path.resolve( __dirname, '..', 'agents', 'release.agent.js' ),
  scaffold: path.resolve( __dirname, '..', 'agents', 'release-scaffold.agent.js' ),
};

function printUsage() {
  console.log( 'Usage: node scripts/dry-run/release-dry-run.js <release|scaffold> [agent arguments]' );
  console.log( 'Example: node scripts/dry-run/release-dry-run.js release validate' );
  console.log( 'If no agent arguments are provided, `validate` is used.' );
}

function main() {
  const args = process.argv.slice( 2 );
  const flow = args.shift();
  if ( ! flow || ! AGENT_TARGETS[ flow.toLowerCase() ] ) {
    printUsage();
    process.exit( 1 );
  }

  const agentPath = AGENT_TARGETS[ flow.toLowerCase() ];
  const agentArgs = args.length ? args : [ 'validate' ];

  const exitCode = runWithDryRun( 'node', [ agentPath, ...agentArgs ], {
    shell: false,
    cwd: process.cwd(),
  } );
  process.exit( exitCode );
}

if ( require.main === module ) {
  main();
}
