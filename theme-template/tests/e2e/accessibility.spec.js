/**
 * End-to-end accessibility and viewport checks on the front end.
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );
const { default: AxeBuilder } = require( '@axe-core/playwright' );

const slug = require( '../../package.json' ).name;

const viewports = {
	mobile: { width: 375, height: 812 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1280, height: 800 },
};

test.describe( 'Theme front end accessibility', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( slug );
	} );

	for ( const [ name, size ] of Object.entries( viewports ) ) {
		test( `fits and passes axe on ${ name }`, async ( { page } ) => {
			await page.setViewportSize( size );
			await page.goto( '/' );

			// Nothing scrolls sideways.
			const scrollWidth = await page.evaluate(
				() => document.documentElement.scrollWidth
			);
			expect( scrollWidth ).toBeLessThanOrEqual( size.width );

			// One main landmark and at least one heading.
			await expect( page.locator( 'main' ) ).toHaveCount( 1 );
			expect( await page.locator( 'h1, h2' ).count() ).toBeGreaterThan(
				0
			);

			const results = await new AxeBuilder( { page } )
				.withTags( [
					'wcag2a',
					'wcag2aa',
					'wcag21a',
					'wcag21aa',
					'wcag22aa',
				] )
				.analyze();
			expect( results.violations ).toEqual( [] );
		} );
	}
} );
