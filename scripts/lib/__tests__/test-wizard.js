const fs = require('fs');
const path = require('path');
const { runWizard } = require('../wizard');

const createLogger = () => ( {
	info: jest.fn(),
	error: jest.fn(),
	warn: jest.fn(),
} );

describe( 'runWizard', () => {
	const testConfigPath = path.join( __dirname, 'test-plugin-config.json' );
	const testConfig = {
		slug: 'test-theme',
		name: 'Test Theme',
		version: '1.2.3',
		author: 'Test Author',
		author_uri: 'https://example.com',
	};

	beforeAll( () => {
		fs.writeFileSync( testConfigPath, JSON.stringify( testConfig, null, 2 ) );
	} );

	afterAll( () => {
		fs.unlinkSync( testConfigPath );
	} );

	it( 'loads config from JSON file if provided', () => {
		const logger = createLogger();
		const config = runWizard( { configPath: testConfigPath, logger } );
		expect( config.slug ).toBe( 'test-theme' );
		expect( config.name ).toBe( 'Test Theme' );
		expect( config.version ).toBe( '1.2.3' );
		expect( config.author ).toBe( 'Test Author' );
		expect( config.author_uri ).toBe( 'https://example.com' );
	} );

	it( 'returns empty config if no file provided', () => {
		const logger = createLogger();
		const config = runWizard( { logger } );
		expect( config ).toEqual( {} );
	} );

	it( 'falls back to manual if file missing', () => {
		const logger = createLogger();
		const config = runWizard( { configPath: 'nonexistent.json', logger } );
		expect( config ).toEqual( {} );
	} );
} );
