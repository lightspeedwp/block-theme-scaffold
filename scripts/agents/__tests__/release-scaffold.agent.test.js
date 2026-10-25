// __tests__/release-scaffold.agent.test.js
const fs = require( 'fs' );
const path = require( 'path' );
const { questions } = require( '../release-scaffold.agent' );
const { wizardInterfaces } = require( '../../lib/wizard' );

test( 'release-scaffold agent runs with mock wizard', async () => {
	const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
	const config = await wizardInterfaces.mock( questions, {
		logger: mockLogger,
	} );
	expect( config.releaseMode ).toBe( 'validation' );
	// The target version defaults to the scaffold's VERSION file.
	expect( config.target_version ).toBe(
		fs
			.readFileSync(
				path.resolve( __dirname, '../../../VERSION' ),
				'utf8'
			)
			.trim()
	);
	expect( config.runPlaceholderCheck ).toBe( true );
} );
