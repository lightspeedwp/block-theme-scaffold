/**
 * Plugin entry tests.
 *
 * @package
 */

describe( 'Entry point', () => {
	beforeEach( () => {
		jest.resetModules();
		jest.clearAllMocks();
		global.wp = global.wp || {};
		global.wp.blocks = {
			registerBlockType: jest.fn(),
		};
	} );

	it( 'registers every block export', () => {
		require( '../../src/index' );

		expect( global.wp.blocks.registerBlockType ).toHaveBeenCalledTimes( 4 );
	} );
} );
