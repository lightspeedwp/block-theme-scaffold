const modeDetector = require( '../mode-detector' );

describe( 'mode detector utilities', () => {
	test( 'parseArguments builds arg map with values and flags', () => {
		const args = [
			'--slug',
			'tour-operator',
			'--force',
			'--description',
			'Test theme',
		];
		const parsed = modeDetector.parseArguments( args );
		expect( parsed.slug ).toBe( 'tour-operator' );
		expect( parsed.force ).toBe( true );
		expect( parsed.description ).toBe( 'Test theme' );
	} );

	test( 'detectMode prioritizes special flags', () => {
		expect( modeDetector.detectMode( [ '--help' ] ) ).toBe( 'help' );
		expect( modeDetector.detectMode( [ '--schema' ] ) ).toBe( 'schema' );
		expect( modeDetector.detectMode( [ '--validate' ] ) ).toBe(
			'validate'
		);
		expect( modeDetector.detectMode( [ '--json' ], true ) ).toBe(
			'json-stdin'
		);
		expect(
			modeDetector.detectMode( [ '--config', './theme-config.json' ] )
		).toBe( 'json-config' );
		expect( modeDetector.detectMode( [ '--slug', 'tour' ] ) ).toBe( 'cli' );
	} );

	test( 'requiresStdin flags modes that need stdin', () => {
		expect( modeDetector.requiresStdin( 'json-stdin' ) ).toBe( true );
		expect( modeDetector.requiresStdin( 'validate' ) ).toBe( true );
		expect( modeDetector.requiresStdin( 'cli' ) ).toBe( false );
	} );

	test( 'validateModeArguments guards each mode', () => {
		expect( modeDetector.validateModeArguments( 'validate', {} ) ).toEqual(
			{
				valid: false,
				error: '--validate requires a JSON argument',
			}
		);
		expect(
			modeDetector.validateModeArguments( 'validate', { validate: '{}' } )
		).toEqual( {
			valid: true,
		} );
		expect(
			modeDetector.validateModeArguments( 'json-config', {} )
		).toEqual( {
			valid: false,
			error: 'Config file path is required',
		} );
		expect(
			modeDetector.validateModeArguments( 'json-config', {
				config: 'theme-config.json',
			} )
		).toEqual( {
			valid: true,
		} );
		expect( modeDetector.validateModeArguments( 'schema', {} ) ).toEqual( {
			valid: true,
		} );
	} );

	test( 'getModeDescription returns fallback text', () => {
		expect( modeDetector.getModeDescription( 'schema' ) ).toContain(
			'configuration schema'
		);
		expect( modeDetector.getModeDescription( 'unknown-mode' ) ).toBe(
			'Unknown mode'
		);
	} );

	test( 'formatModeInfo includes relevant flags', () => {
		const info = modeDetector.formatModeInfo( 'cli', {
			slug: 'tour-op',
			name: 'Tour',
			help: true,
		} );
		expect( info ).toContain( 'Mode: cli' );
		expect( info ).toContain( '--slug tour-op' );
		expect( info ).toContain( '--name Tour' );
	} );
} );
