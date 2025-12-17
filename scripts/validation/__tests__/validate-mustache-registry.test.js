/**
 * Tests for validate-mustache-registry.js
 *
 * @jest-environment jsdom
 */

const fs = require( 'fs' );

// Mock fs module
jest.mock( 'fs' );

describe( 'validate-mustache-registry', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		jest.spyOn( console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		console.log.mockRestore();
		console.error.mockRestore();
	} );

	test( 'should validate mustache variables in files', () => {
		const fileContent = `
			Theme Name: {{theme_name}}
			Slug: {{theme_slug}}
			Version: {{version}}
		`;

		fs.existsSync.mockReturnValue( true );
		fs.readdirSync.mockReturnValue( [ 'test.txt' ] );
		fs.statSync.mockReturnValue( {
			isDirectory: () => false,
			isFile: () => true,
		} );
		fs.readFileSync.mockReturnValue( fileContent );

		// Import and run validation
		delete require.cache[ require.resolve( '../../validation/validate-mustache-registry' ) ];
		expect( () =>
			require( '../../validation/validate-mustache-registry' )
		).not.toThrow();
	} );

	test( 'should handle files without mustache variables', () => {
		const fileContent = `Plain text file without variables`;

		fs.existsSync.mockReturnValue( true );
		fs.readdirSync.mockReturnValue( [ 'test.txt' ] );
		fs.statSync.mockReturnValue( {
			isDirectory: () => false,
			isFile: () => true,
		} );
		fs.readFileSync.mockReturnValue( fileContent );

		delete require.cache[ require.resolve( '../../validation/validate-mustache-registry' ) ];
		expect( () =>
			require( '../../validation/validate-mustache-registry' )
		).not.toThrow();
	} );

	test( 'should handle filter syntax', () => {
		const fileContent = `
			Uppercase: {{theme_slug|upper}}
			Lowercase: {{theme_name|lower}}
		`;

		fs.existsSync.mockReturnValue( true );
		fs.readdirSync.mockReturnValue( [ 'test.txt' ] );
		fs.statSync.mockReturnValue( {
			isDirectory: () => false,
			isFile: () => true,
		} );
		fs.readFileSync.mockReturnValue( fileContent );

		delete require.cache[ require.resolve( '../../validation/validate-mustache-registry' ) ];
		expect( () =>
			require( '../../validation/validate-mustache-registry' )
		).not.toThrow();
	} );
} );
