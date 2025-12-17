const { test } = require( '@playwright/test' );
const { assertMustacheRendered } = require( './helpers/theme.helpers' );

test( 'renders mustache frontend output', async ( { page } ) => {
	await assertMustacheRendered( page, '/' );
} );
