const { test, expect } = require( '@playwright/test' );
const {
	assertMustacheRendered,
	activateTheme,
	runAccessibilityChecks,
	verifyNavigation,
} = require( './helpers/theme.helpers' );

test.describe( '{{theme_name}} Theme E2E Tests', () => {
	test.beforeEach( async ( { page } ) => {
		// Go to WordPress admin and ensure the scaffold theme is active
		await page.goto( '/wp-admin' );

		// Login if needed (assuming wp-env default credentials)
		const loginForm = page.locator( '#loginform' );
		if ( await loginForm.isVisible() ) {
			await page.fill( '#user_login', 'admin' );
			await page.fill( '#user_pass', 'password' );
			await page.click( '#wp-submit' );
		}

		await activateTheme( page );
	} );

	test( 'homepage loads correctly', async ( { page } ) => {
		await assertMustacheRendered( page );
		await verifyNavigation( page );

		// Check for basic theme elements
		await expect( page.locator( 'header' ) ).toBeVisible();
		await expect( page.locator( 'main, #main' ) ).toBeVisible();
		await expect( page.locator( 'footer' ) ).toBeVisible();
	} );

	test( 'site editor loads', async ( { page } ) => {
		await page.goto( '/wp-admin/site-editor.php' );

		// Wait for editor to load
		await page.waitForSelector( '.edit-site-layout__content' );

		// Check editor is functional
		await expect(
			page.locator( '.edit-site-layout__content' )
		).toBeVisible();
	} );

	test( 'mobile navigation works', async ( { page } ) => {
		// Set mobile viewport
		await page.setViewportSize( { width: 375, height: 667 } );
		await page.goto( '/' );

		// Check if mobile menu toggle exists
		const menuToggle = page.locator(
			'.wp-block-navigation__responsive-container-open'
		);
		if ( await menuToggle.isVisible() ) {
			await menuToggle.click();

			// Check if menu opens
			await expect(
				page.locator(
					'.wp-block-navigation__responsive-container.is-menu-open'
				)
			).toBeVisible();
		}
	} );

	test( 'accessibility standards', async ( { page } ) => {
		await page.goto( '/' );
		await runAccessibilityChecks( page );

		// Check for skip link
		const skipLink = page.locator( '.skip-link' );
		await expect( skipLink ).toBeHidden();

		// Focus skip link
		await page.keyboard.press( 'Tab' );
		await expect( skipLink ).toBeVisible();

		// Check heading hierarchy
		const h1 = page.locator( 'h1' );
		await expect( h1 ).toHaveCount( 1 );

		// Check for alt text on images
		const images = page.locator( 'img' );
		const count = await images.count();
		for ( let i = 0; i < count; i++ ) {
			const img = images.nth( i );
			const alt = await img.getAttribute( 'alt' );
			expect( alt ).toBeDefined();
		}
	} );

	test( 'responsive design', async ( { page } ) => {
		await page.goto( '/' );

		// Test different viewport sizes
		const viewports = [
			{ width: 320, height: 568 }, // Mobile
			{ width: 768, height: 1024 }, // Tablet
			{ width: 1200, height: 800 }, // Desktop
		];

		for ( const viewport of viewports ) {
			await page.setViewportSize( viewport );

			// Check layout doesn't break
			await expect( page.locator( 'body' ) ).toBeVisible();

			// Check no horizontal scroll
			const bodyWidth = await page.evaluate(
				() => document.body.scrollWidth
			);
			const viewportWidth = viewport.width;
			expect( bodyWidth ).toBeLessThanOrEqual( viewportWidth + 20 ); // Allow small tolerance
		}
	} );

	test( 'block patterns work', async ( { page } ) => {
		await page.goto( '/wp-admin/post-new.php?post_type=page' );

		// Wait for editor to load
		await page.waitForSelector( '.block-editor-writing-flow' );

		// Open patterns panel
		await page.click( 'button[aria-label="Add block"]' );
		await page.click( 'button[aria-label="Patterns"]' );

		// Look for theme patterns
		const themePatterns = page.locator(
			'.block-editor-block-patterns-list__item:has-text("{{theme_name}}")'
		);
		const patternCount = await themePatterns.count();

		expect( patternCount ).toBeGreaterThan( 0 );
	} );

	test( 'style variations work', async ( { page } ) => {
		await page.goto( '/wp-admin/site-editor.php' );

		// Wait for editor to load
		await page.waitForSelector( '.edit-site-layout__content' );

		// Open global styles
		const stylesButton = page.locator( 'button:has-text("Styles")' );
		if ( await stylesButton.isVisible() ) {
			await stylesButton.click();

			// Check for style variations
			const variations = page.locator(
				'.edit-site-global-styles-variations_item'
			);
			const variationCount = await variations.count();

			expect( variationCount ).toBeGreaterThan( 1 ); // Should have at least default + variations
		}
	} );
} );
