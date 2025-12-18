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

	it( 'loads config from JSON file if provided', async () => {
		const logger = createLogger();
		const config = await runWizard( { mode: 'json', configPath: testConfigPath, logger } );
		expect( config.slug ).toBe( 'test-theme' );
		expect( config.name ).toBe( 'Test Theme' );
		expect( config.version ).toBe( '1.2.3' );
		expect( config.author ).toBe( 'Test Author' );
		expect( config.author_uri ).toBe( 'https://example.com' );
	} );

	it( 'returns empty object in mock mode with no questions', async () => {
		const logger = createLogger();
		const config = await runWizard( { mode: 'mock', logger } );
		expect( config ).toEqual( {} );
		expect( logger.info ).toHaveBeenCalledWith( 'Using mock wizard mode (for tests/dry-run)...' );
	} );

	it( 'throws error if file missing in json mode', async () => {
		const logger = createLogger();
		await expect( runWizard( { mode: 'json', configPath: 'nonexistent.json', logger } ) ).rejects.toThrow();
	} );
} );
