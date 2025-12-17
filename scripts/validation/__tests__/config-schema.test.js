const {
	CONFIG_SCHEMA,
	validateValue,
	validateConfig,
	applyDefaults,
	getStageQuestions,
	buildCommandArgs,
	buildCommand,
} = require( '../config-schema' );

describe( 'configuration schema helpers', () => {
	test( 'validateValue enforces slug pattern and accepts valid slug', () => {
		const slugSchema = CONFIG_SCHEMA.slug;
		const invalid = validateValue( 'slug', 'Invalid Slug', slugSchema );
		expect( invalid.some( ( msg ) => msg.includes( 'pattern' ) ) ).toBe(
			true
		);
		const valid = validateValue( 'slug', 'tour-theme', slugSchema );
		expect( valid ).toEqual( [] );
	} );

	test( 'validateValue rejects unsupported URL protocols', () => {
		const urlSchema = CONFIG_SCHEMA.author_uri;
		const errors = validateValue(
			'author_uri',
			'ftp://example.com',
			urlSchema
		);
		expect( errors ).toHaveLength( 1 );
		expect( errors[ 0 ] ).toContain( 'http or https' );
	} );

	test( 'validateConfig reports required fields and optional warnings', () => {
		const missing = validateConfig( { slug: 'tour-theme' } );
		expect( missing.valid ).toBe( false );
		expect(
			missing.errors.some( ( msg ) => msg.includes( 'name is required' ) )
		).toBe( true );
		const warningConfig = validateConfig( {
			slug: 'tour-theme',
			name: 'Tour Theme',
			license: 'BSD-3-Clause',
		} );
		expect( warningConfig.valid ).toBe( true );
		expect(
			warningConfig.warnings.some( ( warning ) =>
				warning.includes( 'license' )
			)
		).toBe( true );
	} );

	test( 'applyDefaults fills computed metadata', () => {
		const prepared = applyDefaults( {
			slug: 'tour-theme',
			author: 'LightSpeed',
		} );
		expect( prepared.version ).toBe( '1.0.0' );
		expect( prepared.namespace ).toBe( 'tour_theme' );
		expect( prepared.theme_uri ).toBe(
			'https://wordpress.org/themes/tour-theme'
		);
	} );

	test( 'getStageQuestions scopes questions to the requested stage', () => {
		const stageOne = getStageQuestions( 1 );
		expect( stageOne.some( ( item ) => item.key === 'slug' ) ).toBe( true );
		const stageTwo = getStageQuestions( 2 );
		expect( stageTwo.every( ( item ) => item.stage === 2 ) ).toBe( true );
	} );

	test( 'buildCommand helpers compose CLI strings', () => {
		const args = buildCommandArgs( {
			slug: 'tour-theme',
			name: 'TourTheme',
		} );
		expect( args ).toBe( '--slug tour-theme --name TourTheme' );
		const command = buildCommand(
			{ slug: 'tour-theme', name: 'TourTheme' },
			'scripts/generate-theme.js'
		);
		expect( command ).toContain( 'node scripts/generate-theme.js' );
		expect( command ).toContain( '--slug tour-theme' );
	} );
} );
