/**
 * Validate agent frontmatter for `.github/agents/*.agent.md`
 *
 * Ensures each spec exposes the minimal metadata shape and that the optional
 * `permissions` array only contains sanctioned values.
 */

const fs = require( 'fs' );
const path = require( 'path' );
const YAML = require( 'js-yaml' );

const AGENT_DIR = path.join( __dirname, '..', '..', '.github', 'agents' );
const PERMISSIONS = new Set( [
	'read',
	'write',
	'execute',
	'filesystem',
	'network',
	'shell',
	'github:repo',
	'github:issues',
	'github:pulls',
	'github:workflows',
	'github:checks',
	'github:actions',
] );

function getMockAgentSpecs() {
	if ( ! process.env.AGENT_FRONTMATTER_SPECS ) {
		return null;
	}

	try {
		const parsed = JSON.parse( process.env.AGENT_FRONTMATTER_SPECS );
		if ( typeof parsed !== 'object' || parsed === null ) {
			throw new Error( 'specs payload must be an object' );
		}

		return parsed;
	} catch ( err ) {
		console.error( 'Invalid AGENT_FRONTMATTER_SPECS:', err.message );
		return null;
	}
}

function loadFrontmatter( content, file ) {
	const lines = content.split( /\r?\n/ );
	if ( lines[ 0 ].trim() !== '---' ) {
		throw new Error( `Missing frontmatter start in ${ file }` );
	}

	let endIndex = -1;
	for ( let i = 1; i < lines.length; i++ ) {
		if ( lines[ i ].trim() === '---' ) {
			endIndex = i;
			break;
		}
	}

	if ( endIndex === -1 ) {
		throw new Error( `Missing frontmatter end in ${ file }` );
	}

	const yamlContent = lines.slice( 1, endIndex ).join( '\n' );
	return YAML.load( yamlContent ) || {};
}

function validatePermissions( permissions, file, errors ) {
	if ( ! Array.isArray( permissions ) ) {
		errors.push( `${ file }: "permissions" must be an array` );
		return;
	}

	for ( const value of permissions ) {
		if ( typeof value !== 'string' ) {
			errors.push(
				`${ file }: permission values must be strings (got ${ typeof value })`
			);
			continue;
		}

		if ( ! PERMISSIONS.has( value ) ) {
			errors.push(
				`${ file }: unsupported permission "${ value }" (allowed: ${ [
						...PERMISSIONS,
					].join( ', ' ) })`
			);
		}
	}
}

function validateTools( tools, file, errors ) {
	if ( ! Array.isArray( tools ) || tools.length === 0 ) {
		errors.push( `${ file }: "tools" must be a non-empty array` );
		return;
	}

	for ( const tool of tools ) {
		if ( typeof tool !== 'string' ) {
			errors.push( `${ file }: tool entries must be strings` );
		}
	}
}

function gatherAgentFiles( specs ) {
	if ( specs ) {
		return Object.keys( specs );
	}

	if ( ! fs.existsSync( AGENT_DIR ) ) {
		return null;
	}

	return fs
		.readdirSync( AGENT_DIR )
		.filter( ( name ) => name.endsWith( '.agent.md' ) );
}

function getAgentContent( file, specs ) {
	if ( specs ) {
		const content = specs[ file ];
		if ( typeof content !== 'string' ) {
			throw new Error( `${ file }: mocked content must be a string` );
		}
		return content;
	}

	const filepath = path.join( AGENT_DIR, file );
	return fs.readFileSync( filepath, 'utf8' );
}

function validateAgentFrontmatter( specs = null ) {
	const files = gatherAgentFiles( specs );
	const isMock = Boolean( specs );

	if ( ! files || files.length === 0 ) {
		if ( isMock ) {
			console.warn( 'No mocked agent specs provided for validation' );
		} else {
			console.warn( 'No agent specs found in', AGENT_DIR );
		}
		return 0;
	}

	const errors = [];

	for ( const file of files ) {
		let content;
		try {
			content = getAgentContent( file, specs );
		} catch ( err ) {
			errors.push( err.message );
			continue;
		}

		let data;
		try {
			data = loadFrontmatter( content, file );
		} catch ( error ) {
			errors.push( error.message );
			continue;
		}

		if ( 'tools' in data ) {
			validateTools( data.tools, file, errors );
		}

		if ( 'permissions' in data ) {
			validatePermissions( data.permissions, file, errors );
		}
	}

	if ( errors.length > 0 ) {
		const message =
			'Agent frontmatter validation failed:\n' +
			errors.map( ( error ) => `  - ${ error }` ).join( '\n' );
		throw new Error( message );
	}

	return files.length;
}

function main() {
	const mockSpecs = getMockAgentSpecs();

	if ( ! mockSpecs && ! fs.existsSync( AGENT_DIR ) ) {
		console.error( 'Agents directory missing:' );
		console.error( `  ${ AGENT_DIR }` );
		process.exit( 1 );
	}

	const count = validateAgentFrontmatter( mockSpecs );
	if ( count > 0 ) {
		console.log(
			`Validated ${ count } agent spec${
				count === 1 ? '' : 's'
			} successfully.`
		);
	}
}

try {
	main();
} catch ( error ) {
	if ( require.main === module ) {
		console.error( error.message );
		process.exit( 1 );
	}
	throw error;
}

module.exports = {
	validateAgentFrontmatter,
	loadFrontmatter,
	validatePermissions,
	validateTools,
};
