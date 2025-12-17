const fs = require( 'fs' );
const path = require( 'path' );

const repoRoot = path.resolve( __dirname, '..', '..', '..' );

	describe( 'theme.json Schema Validation', () => {
		const themeJsonPath = path.join( repoRoot, 'theme.json' );
		let themeJson;

		beforeAll( () => {
			if ( ! fs.existsSync( themeJsonPath ) ) {
				throw new Error( 'theme.json is missing' );
			}
			const content = fs.readFileSync( themeJsonPath, 'utf8' );
			themeJson = JSON.parse( content );
		} );

		test( 'theme.json file exists', () => {
			expect( fs.existsSync( themeJsonPath ) ).toBe( true );
		} );

	test( 'theme.json is valid JSON', () => {
		expect( themeJson ).toBeDefined();
		expect( typeof themeJson ).toBe( 'object' );
	} );

	test( 'has required top-level properties', () => {
		expect( themeJson ).toHaveProperty( '$schema' );
		expect( themeJson ).toHaveProperty( 'version' );
		expect( typeof themeJson.version ).toBe( 'number' );
		expect( themeJson.version ).toBeGreaterThanOrEqual( 2 );
	} );

	describe( 'Settings section', () => {
		test( 'settings section exists', () => {
			expect( themeJson ).toHaveProperty( 'settings' );
			expect( typeof themeJson.settings ).toBe( 'object' );
		} );

		test( 'has color settings', () => {
			const colorSettings = themeJson.settings?.color;
			const paletteValid =
				typeof colorSettings === 'object' &&
				colorSettings !== null &&
				Object.prototype.hasOwnProperty.call( colorSettings, 'palette' ) &&
				Array.isArray( colorSettings.palette ) &&
				colorSettings.palette.every(
					( color ) =>
						typeof color === 'object' &&
						color !== null &&
						typeof color.slug === 'string' &&
						typeof color.color === 'string' &&
						typeof color.name === 'string' &&
						/^#[0-9A-Fa-f]{6}$/.test( color.color )
				);

			const colorSettingsValid =
				colorSettings === undefined ||
				typeof colorSettings === 'boolean' ||
				paletteValid;

			expect( colorSettingsValid ).toBe( true );
		} );

		test( 'has typography settings', () => {
			const typography = themeJson.settings?.typography;

			const fontSizesValid =
				! typography?.fontSizes ||
				( Array.isArray( typography.fontSizes ) &&
					typography.fontSizes.every(
						( size ) =>
							typeof size === 'object' &&
							size !== null &&
							typeof size.slug === 'string' &&
							typeof size.size === 'string' &&
							typeof size.name === 'string'
					) );

			const fontFamiliesValid =
				! typography?.fontFamilies ||
				( Array.isArray( typography.fontFamilies ) &&
					typography.fontFamilies.every(
						( family ) => typeof family === 'string'
					) );

			const typographyValid =
				typography === undefined ||
				( typeof typography === 'object' &&
					fontSizesValid &&
					fontFamiliesValid );

			expect( typographyValid ).toBe( true );
		} );

		test( 'has spacing settings', () => {
			const spacing = themeJson.settings?.spacing;

			const spacingSizesValid =
				! spacing?.spacingSizes ||
				( Array.isArray( spacing.spacingSizes ) &&
					spacing.spacingSizes.every(
						( size ) =>
							typeof size === 'object' &&
							size !== null &&
							typeof size.slug === 'string' &&
							typeof size.size === 'string' &&
							typeof size.name === 'string'
					) );

			const spacingValid =
				spacing === undefined ||
				( typeof spacing === 'object' && spacingSizesValid );

			expect( spacingValid ).toBe( true );
		} );
	} );

	describe( 'Styles section', () => {
		const resolveStylesSection = () =>
			themeJson
				? themeJson.styles || themeJson.settings?.styles || {}
				: {};

		test( 'styles section exists', () => {
			const stylesSection = resolveStylesSection();
			expect( stylesSection ).toBeDefined();
			expect( typeof stylesSection ).toBe( 'object' );
		} );

		test( 'has valid color styles', () => {
			const stylesSection = resolveStylesSection();
			const color = stylesSection.color;

			const colorStylesValid =
				! color ||
				( typeof color === 'object' &&
					( color.background === undefined ||
						typeof color.background === 'string' ) &&
					( color.text === undefined || typeof color.text === 'string' ) );

			expect( colorStylesValid ).toBe( true );
		} );

		test( 'has valid typography styles', () => {
			const stylesSection = resolveStylesSection();
			const typography = stylesSection.typography;

			const typographyValid =
				! typography ||
				( typeof typography === 'object' &&
					( typography.fontSize === undefined ||
						typeof typography.fontSize === 'string' ) &&
					( typography.lineHeight === undefined ||
						typeof typography.lineHeight === 'string' ) );

			expect( typographyValid ).toBe( true );
		} );

		test( 'has valid elements styles', () => {
			const stylesSection = resolveStylesSection();
			const elements = stylesSection.elements;

			const elementNames = [
				'link',
				'button',
				'heading',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
			];

			const elementsValid =
				! elements ||
				( typeof elements === 'object' &&
					elementNames.every(
						( element ) =>
							elements[ element ] === undefined ||
							typeof elements[ element ] === 'object'
					) );

			expect( elementsValid ).toBe( true );
		} );

		test( 'has valid blocks styles', () => {
			const stylesSection = resolveStylesSection();
			const blocks = stylesSection.blocks;

			const blocksValid =
				! blocks ||
				( typeof blocks === 'object' &&
					Object.keys( blocks ).every(
						( blockName ) =>
							/^core\//.test( blockName ) &&
							typeof blocks[ blockName ] === 'object'
					) );

			expect( blocksValid ).toBe( true );
		} );
	} );

	describe( 'Template Parts', () => {
		test( 'templateParts section is valid', () => {
			const templateParts = themeJson.templateParts;
			const validAreas = [
				'header',
				'footer',
				'general',
				'uncategorized',
			];

			const templatePartsValid =
				! templateParts ||
				( Array.isArray( templateParts ) &&
					templateParts.every(
						( part ) =>
							typeof part === 'object' &&
							part !== null &&
							typeof part.name === 'string' &&
							typeof part.area === 'string' &&
							validAreas.includes( part.area )
					) );

			expect( templatePartsValid ).toBe( true );
		} );
	} );

	describe( 'Custom Templates', () => {
		test( 'customTemplates section is valid', () => {
			const customTemplates = themeJson.customTemplates;

			const customTemplatesValid =
				! customTemplates ||
				( typeof customTemplates === 'object' &&
					Object.values( customTemplates ).every( ( template ) => {
						const postTypesValid =
							! template.postTypes ||
							( Array.isArray( template.postTypes ) &&
								template.postTypes.every(
									( postType ) => typeof postType === 'string'
								) );

						return (
							typeof template === 'object' &&
							template !== null &&
							typeof template.title === 'string' &&
							postTypesValid
						);
					} ) );

			expect( customTemplatesValid ).toBe( true );
		} );
	} );

	describe( 'Patterns', () => {
		test( 'patterns section is valid', () => {
			const patterns = themeJson.patterns;
			expect(
				! patterns || Array.isArray( patterns )
			).toBe( true );
		} );
	} );

	describe( 'Color palette validation', () => {
		test( 'color slugs are unique', () => {
			const palette = themeJson.settings?.color?.palette || [];
			const slugs = palette.map( ( c ) => c.slug );
			const uniqueSlugs = new Set( slugs );
				expect( slugs ).toHaveLength( uniqueSlugs.size );
		} );

		test( 'color values are valid hex', () => {
			const palette = themeJson.settings?.color?.palette || [];
			const allValid = palette.every( ( color ) =>
				/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test( color.color )
			);
			expect( allValid ).toBe( true );
		} );
	} );

	describe( 'Font size validation', () => {
		test( 'font size slugs are unique', () => {
			const fontSizes =
				themeJson.settings?.typography?.fontSizes || [];
			const slugs = fontSizes.map( ( f ) => f.slug );
			const uniqueSlugs = new Set( slugs );
				expect( slugs ).toHaveLength( uniqueSlugs.size );
		} );

		test( 'font sizes have valid units', () => {
			const fontSizes =
				themeJson.settings?.typography?.fontSizes || [];
			const allMatchUnit = fontSizes.every( ( size ) =>
				/(px|em|rem|%|vw|vh)$/.test( size.size )
			);
			expect( allMatchUnit ).toBe( true );
		} );
	} );

	describe( 'Spacing scale validation', () => {
		test( 'spacing slugs are unique', () => {
			const spacingSizes =
				themeJson.settings?.spacing?.spacingSizes || [];
			const slugs = spacingSizes.map( ( s ) => s.slug );
			const uniqueSlugs = new Set( slugs );
				expect( slugs ).toHaveLength( uniqueSlugs.size );
		} );

		test( 'spacing sizes have valid units', () => {
			const spacingSizes =
				themeJson.settings?.spacing?.spacingSizes || [];
			const allMatchUnit = spacingSizes.every( ( size ) =>
				/(px|em|rem|%|vw|vh)$/.test( size.size )
			);
			expect( allMatchUnit ).toBe( true );
		} );
	} );
} );
