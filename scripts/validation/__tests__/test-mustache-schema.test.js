/**
 * Tests for test-mustache-schema.js
 *
 * @jest-environment jsdom
 */

const fs = require( 'fs' );

// Mock fs module
jest.mock( 'fs' );

describe( 'test-mustache-schema', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		jest.spyOn( console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		console.log.mockRestore();
		console.error.mockRestore();
	} );

	test( 'should validate mustache schema structure', () => {
		const schemaContent = {
			mustacheVariables: {
				theme_name: {
					type: 'string',
					required: true,
					description: 'Theme name',
				},
				theme_slug: {
					type: 'string',
					required: true,
					description: 'Theme slug',
				},
			},
		};

		fs.existsSync.mockReturnValue( true );
		fs.readFileSync.mockReturnValue( JSON.stringify( schemaContent ) );

		// Import and run validation
		delete require.cache[ require.resolve( '../../validation/test-mustache-schema' ) ];
		expect( () =>
			require( '../../validation/test-mustache-schema' )
		).not.toThrow();
	} );

	test( 'should validate required variables', () => {
		const schemaContent = {
			mustacheVariables: {
				theme_name: {
					type: 'string',
					required: true,
				},
				optional_var: {
					type: 'string',
					required: false,
				},
			},
		};

		fs.existsSync.mockReturnValue( true );
		fs.readFileSync.mockReturnValue( JSON.stringify( schemaContent ) );

		delete require.cache[ require.resolve( '../../validation/test-mustache-schema' ) ];
		expect( () =>
			require( '../../validation/test-mustache-schema' )
		).not.toThrow();
	} );

	test( 'should handle variable types', () => {
		const schemaContent = {
			mustacheVariables: {
				theme_name: {
					type: 'string',
				},
				version: {
					type: 'number',
				},
				is_child_theme: {
					type: 'boolean',
				},
			},
		};

		fs.existsSync.mockReturnValue( true );
		fs.readFileSync.mockReturnValue( JSON.stringify( schemaContent ) );

		delete require.cache[ require.resolve( '../../validation/test-mustache-schema' ) ];
		expect( () =>
			require( '../../validation/test-mustache-schema' )
		).not.toThrow();
	} );
} );
