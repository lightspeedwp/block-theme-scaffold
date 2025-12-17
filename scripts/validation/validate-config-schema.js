/**
 * Validation wrapper that exposes the shared theme config helpers.
 *
 * This module now simply re-exports the canonical helpers defined in
 * `scripts/lib/define-config-schema.js` so that the agent and validator
 * remain in sync without circular dependencies.
 */

const {
	CONFIG_SCHEMA,
	buildCommandArgs,
} = require( '../lib/define-config-schema' );

module.exports = require( '../lib/define-config-schema' );

if ( require.main === module ) {
	const args = process.argv.slice( 2 );
	const command = args[ 0 ];

	switch ( command ) {
		case '--schema':
			console.log( JSON.stringify( CONFIG_SCHEMA, null, 2 ) );
			break;

		case '--stages': {
			const stages = new Set(
				Object.values( CONFIG_SCHEMA ).map( ( s ) => s.stage )
			);
			console.log( 'Available stages:', Array.from( stages ).sort().join( ', ' ) );
			break;
		}

		case '--keys':
			console.log( Object.keys( CONFIG_SCHEMA ).join( '\n' ) );
			break;

		case '--build-args': {
			const config = args[ 1 ] ? JSON.parse( args[ 1 ] ) : {};
			console.log( buildCommandArgs( config ) );
			break;
		}

		default:
			console.log( 'Config Schema Utilities' );
			console.log( '' );
			console.log( 'Usage:' );
			console.log( '  node scripts/validation/validate-config-schema.js --schema     Output schema as JSON' );
			console.log( '  node scripts/validation/validate-config-schema.js --stages     List available stages' );
			console.log( '  node scripts/validation/validate-config-schema.js --keys       List all config keys' );
			break;
	}
}
