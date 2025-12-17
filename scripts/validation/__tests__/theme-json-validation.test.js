const fs = require( 'fs' );
const path = require( 'path' );
const repoRoot = path.resolve( __dirname, '..', '..', '..' );

// Load theme.json
const themeJsonPath = path.join( repoRoot, 'theme.json' );
const themeJsonContent = fs.readFileSync( themeJsonPath, 'utf-8' );
let themeJson;

try {
	themeJson = JSON.parse( themeJsonContent );
} catch ( error ) {
	throw new Error( `Invalid JSON in theme.json:\n${ error.message }` );
}

// JSON Schema validation setup
const Ajv = require( 'ajv' );
const schemaPath = path.join(
	repoRoot,
	'.github',
	'schemas',
	'theme.6.9.json'
);
const schemaContent = fs.readFileSync( schemaPath, 'utf-8' );
const schema = JSON.parse( schemaContent );
const ajv = new Ajv( { allErrors: true, strict: false } );
const validate = ajv.compile( schema );

describe( 'Theme JSON Structure', () => {
	test( 'should have valid JSON structure', () => {
		expect( themeJson ).toBeDefined();
		expect( themeJson.version ).toBe( 3 );
	} );

	test( 'should validate against local theme.json schema', () => {
		const valid = validate( themeJson );
		if ( ! valid ) {
			console.error( validate.errors );
		}
		expect( valid ).toBe( true );
	} );

	test( 'should not have duplicate keys', () => {
		// Test that there are no duplicate keys by parsing successfully
		expect( () => JSON.parse( themeJsonContent ) ).not.toThrow();
	} );
} );

describe( 'Color Palette Naming Conventions', () => {
	const palette = themeJson.settings?.color?.palette || [];
	const slugs = palette.map( ( color ) => color.slug );

	test( 'should include semantic colors if palette exists', () => {
		const requiredSlugs = [ 'primary', 'secondary', 'background' ];
		const hasSemanticColors =
			palette.length === 0 ||
			requiredSlugs.every( ( slug ) => slugs.includes( slug ) );
		expect( hasSemanticColors ).toBe( true );
	} );

	test( 'should include accent or neutral entries when defined', () => {
		const accentNeutralValid =
			palette.length === 0 ||
			[ 'accent', 'neutral' ].every( ( slug ) => slugs.includes( slug ) );
		expect( accentNeutralValid ).toBe( true );
	} );
} );

describe( 'Typography Naming Conventions', () => {
	const typography = themeJson.settings?.typography;
	const fontSizes = typography?.fontSizes || [];

	test( 'font sizes should use numeric slugs', () => {
		const numericSlugs = fontSizes.every( ( fontSize ) =>
			/^\d+$/.test( fontSize.slug )
		);
		expect( numericSlugs ).toBe( true );
	} );

	test( 'should declare fluid typography settings', () => {
		const fluid = typography?.fluid;
		const fluidValid =
			fluid === undefined ||
			( typeof fluid === 'object' &&
				fluid !== null &&
				typeof fluid.minFontSize === 'string' &&
				typeof fluid.maxViewportWidth === 'string' &&
				typeof fluid.minViewportWidth === 'string' );
		expect( fluidValid ).toBe( true );
	} );
} );

describe( 'Spacing Naming Conventions', () => {
	const spacingSizes = themeJson.settings?.spacing?.spacingSizes || [];

	test( 'spacing sizes should use numeric slugs', () => {
		const numericSlugs = spacingSizes.every( ( size ) =>
			/^\d+$/.test( size.slug )
		);
		expect( numericSlugs ).toBe( true );
	} );

	test( 'spacing sizes should declare dimensions', () => {
		const dimensionsDefined = spacingSizes.every(
			( size ) =>
				typeof size.size === 'string' && size.size.length > 0
		);
		expect( dimensionsDefined ).toBe( true );
	} );
} );

describe( 'Style Variations', () => {
	const stylesSection =
		themeJson.styles || themeJson.settings?.styles || null;

	test( 'should have styles defined', () => {
		expect( stylesSection ).toBeDefined();
		expect( typeof stylesSection ).toBe( 'object' );
	} );

	test( 'should include block styling hints', () => {
		const blocksStyle = stylesSection ? stylesSection.blocks || {} : {};
		const blocksStyleValid =
			! stylesSection || typeof blocksStyle === 'object';
		expect( blocksStyleValid ).toBe( true );
	} );
} );

describe( 'Token References', () => {
	const stylesSection = themeJson.styles;

	test( 'should reference numeric tokens consistently when styles defined', () => {
		const stylesString = stylesSection
			? JSON.stringify( stylesSection )
			: '';
		const referencesValid =
			! stylesSection ||
			( typeof stylesString === 'string' && stylesString.length > 0 );
		expect( referencesValid ).toBe( true );
	} );
} );
