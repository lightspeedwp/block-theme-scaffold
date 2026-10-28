/**
 * End-to-end smoke checks: the theme renders, loads its built assets and
 * opens every template in the Site Editor with valid blocks.
 */
const { readdirSync } = require( 'node:fs' );
const path = require( 'node:path' );
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

const slug = require( '../../package.json' ).name;

test.describe( 'Theme front end', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( slug );
	} );

	test( 'renders the header, main content and footer', async ( { page } ) => {
		const response = await page.goto( '/' );
		expect( response.status() ).toBe( 200 );

		await expect( page.locator( 'header' ).first() ).toBeVisible();
		await expect( page.locator( 'main' ).first() ).toBeVisible();
		await expect( page.locator( 'footer' ).first() ).toBeVisible();

		// No placeholder left over from generation.
		expect( await page.content() ).not.toMatch( /\{\{[^}]+\}\}/ );
	} );

	test( 'loads the built stylesheet and script', async ( { page } ) => {
		const assets = [];
		page.on( 'response', ( response ) => {
			if ( response.url().includes( `/themes/${ slug }/build/` ) ) {
				assets.push( {
					path: new URL( response.url() ).pathname.replace(
						/^.*\/build\//,
						'build/'
					),
					status: response.status(),
				} );
			}
		} );
		await page.goto( '/' );

		// A missing build/ file would be absent here or answer 404.
		expect( assets ).toEqual(
			expect.arrayContaining( [
				{ path: 'build/css/style.css', status: 200 },
				{ path: 'build/js/theme.js', status: 200 },
			] )
		);
	} );
} );

// Every template the theme ships, opened in the Site Editor.
const templates = readdirSync( path.join( __dirname, '../../templates' ) )
	.filter( ( file ) => file.endsWith( '.html' ) )
	.map( ( file ) => file.replace( /\.html$/, '' ) );

test.describe( 'Site Editor', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( slug );
	} );

	for ( const template of templates ) {
		test( `opens the ${ template } template with valid blocks`, async ( {
			admin,
			page,
		} ) => {
			const errors = [];
			page.on( 'pageerror', ( error ) => errors.push( error.message ) );
			// Invalid block markup in the template, its parts or its patterns.
			page.on( 'console', ( message ) => {
				if ( message.text().startsWith( 'Block validation' ) ) {
					errors.push( message.text() );
				}
			} );

			await admin.visitSiteEditor( {
				postId: `${ slug }//${ template }`,
				postType: 'wp_template',
				canvas: 'edit',
			} );
			await expect(
				page.locator( 'iframe[name="editor-canvas"]' )
			).toBeVisible();

			expect( errors ).toEqual( [] );
		} );
	}
} );
