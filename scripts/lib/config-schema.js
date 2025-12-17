const CONFIG_SCHEMA = {
	slug: {
		pattern: /^[a-z0-9-]{2,}$/,
	},
	author_uri: {
		protocols: [ 'http', 'https' ],
	},
};

function validateValue( key, value, schema ) {
	const errors = [];
	if ( schema?.pattern && ! schema.pattern.test( value ) ) {
		errors.push( `${ key } must match the required pattern` );
	}

	if ( schema?.protocols ) {
		const hasProtocol = schema.protocols.some( ( protocol ) =>
			value.toLowerCase().startsWith( `${ protocol }://` )
		);
		if ( ! hasProtocol ) {
			errors.push( `${ key } must use ${ schema.protocols.join( ' or ' ) }` );
		}
	}

	return errors;
}

function validateConfig( config ) {
	const errors = [];
	const warnings = [];

	if ( ! config.slug ) {
		errors.push( 'slug is required' );
	}
	if ( ! config.name ) {
		errors.push( 'name is required' );
	}
	if ( config.license && config.license !== 'GPL-2.0-or-later' ) {
		warnings.push( 'license uses a non-default SPDX identifier' );
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

function applyDefaults( config ) {
	const slug = config.slug || 'tour-theme';
	return {
		...config,
		version: config.version || '1.0.0',
		namespace: slug.replace( /-/g, '_' ),
		theme_uri: `https://wordpress.org/themes/${ slug }`,
	};
}

function getStageQuestions( stage ) {
	if ( stage === 1 ) {
		return [
			{ key: 'slug', stage: 1 },
			{ key: 'name', stage: 1 },
		];
	}

	if ( stage === 2 ) {
		return [
			{ key: 'description', stage: 2 },
			{ key: 'license', stage: 2 },
		];
	}

	return [];
}

function buildCommandArgs( args ) {
	return Object.entries( args )
		.map( ( [ key, value ] ) => `--${ key } ${ value }` )
		.join( ' ' );
}

function buildCommand( args, scriptPath ) {
	const argsString = buildCommandArgs( args );
	return `node ${ scriptPath } ${ argsString }`;
}

function getCanonicalConfigSchema() {
	return CONFIG_SCHEMA;
}

module.exports = {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	getStageQuestions,
	buildCommandArgs,
	buildCommand,
	getCanonicalConfigSchema,
};
