/**
 * Tests for validate-theme-json.js
 */

const fs = require( 'fs' );

// Mock fs module
jest.mock( 'fs' );

describe( 'validate-theme-json', () => {
	let originalExit;

	beforeEach( () => {
		jest.clearAllMocks();
		originalExit = process.exit;
		process.exit = jest.fn();
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		jest.spyOn( console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		process.exit = originalExit;
		console.log.mockRestore();
		console.error.mockRestore();
	} );

	test( 'should validate theme.json successfully', () => {
		const themeJson = {
			$schema: 'https://example.com/schema.json',
			version: 2,
			settings: {},
			styles: {},
		};

		const schema = {
			type: 'object',
			properties: {
				version: { type: 'number' },
				settings: { type: 'object' },
				styles: { type: 'object' },
			},
		};

		fs.readFileSync.mockImplementation( ( filePath ) => {
			if ( filePath.includes( 'theme.json' ) ) {
				return JSON.stringify( themeJson );
			}
			if ( filePath.includes( 'schema' ) ) {
				return JSON.stringify( schema );
			}
			return '';
		} );

		// Import and run validation
		delete require.cache[ require.resolve( '../../validation/validate-theme-json' ) ];
		require( '../../validation/validate-theme-json' );

		expect( console.log ).toHaveBeenCalledWith(
			expect.stringContaining( 'valid' )
		);
	} );

	test( 'should handle mustache placeholders', () => {
		const themeJsonWithPlaceholders = {
			version: 2,
			settings: {
				custom: {
					name: '{{theme_name}}',
				},
			},
		};

		const schema = {
			type: 'object',
			properties: {
				version: { type: 'number' },
				settings: { type: 'object' },
			},
		};

		fs.readFileSync.mockImplementation( ( filePath ) => {
			if ( filePath.includes( 'theme.json' ) ) {
				return JSON.stringify( themeJsonWithPlaceholders );
			}
			if ( filePath.includes( 'schema' ) ) {
				return JSON.stringify( schema );
			}
			return '';
		} );

		// Should not throw and should validate successfully
		delete require.cache[ require.resolve( '../../validation/validate-theme-json' ) ];
		expect( () =>
			require( '../../validation/validate-theme-json' )
		).not.toThrow();
	} );
} );
