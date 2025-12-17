const { expect } = require( '@playwright/test' );
const { injectAxe, checkA11y } = require( 'axe-playwright' );

const DEFAULT_THEME_NAME =
	process.env.THEME_NAME || 'Block Theme Scaffold';

async function assertMustacheRendered( page, route = '/' ) {
	await page.goto( route, { waitUntil: 'domcontentloaded' } );

	const html = await page.content();
	expect( html ).not.toMatch( /\{\{.+\}\}/ );
	await expect( page.locator( 'main, body' ).first() ).toBeVisible();
}

async function activateTheme( page, options = {} ) {
	const themeName = options.themeName || DEFAULT_THEME_NAME;
	await page.goto( '/wp-admin/themes.php', { waitUntil: 'domcontentloaded' } );

	const cards = page.locator(
		`.theme-card:has-text("${ themeName }"), .wp-theme:has-text("${ themeName }")`
	);

	if ( ( await cards.count() ) === 0 ) {
		return false;
	}

	const themeCard = cards.first();
	const alreadyActive = themeCard.locator( '.theme-status.active, .theme-is-active' );
	if ( ( await alreadyActive.count() ) > 0 ) {
		return true;
	}

	const activateButton = themeCard.locator(
		'button:has-text("Activate"), a:has-text("Activate")'
	);

	if ( ( await activateButton.count() ) === 0 ) {
		return false;
	}

	await activateButton.first().click();
	await page.waitForLoadState( 'networkidle' );
	return true;
}

async function runAccessibilityChecks( page, options = {} ) {
	await injectAxe( page );

	const checkOptions = {
		detailedReport: true,
		detailedReportOptions: { html: true },
		runOnly: options.runOnly,
		...options.checkOptions,
	};

	await checkA11y( page, options.context || null, checkOptions );
}

async function verifyNavigation( page, options = {} ) {
	const selector =
		options.selector ||
		'.wp-block-navigation, nav[role="navigation"], nav.navigation, nav';
	const nav = page.locator( selector );

	await expect( nav.first() ).toBeVisible();

	const links = nav.locator( 'a' );
	const linkCount = await links.count();
	expect( linkCount ).toBeGreaterThanOrEqual( 1 );

	for ( let i = 0; i < Math.min( linkCount, 5 ); i++ ) {
		const link = links.nth( i );
		await expect( link ).toBeVisible();
		await expect( link ).toHaveAttribute( 'href' );
	}
}

module.exports = {
	assertMustacheRendered,
	activateTheme,
	runAccessibilityChecks,
	verifyNavigation,
};
