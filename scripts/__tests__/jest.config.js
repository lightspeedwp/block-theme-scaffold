/**
 * Jest Configuration for Scripts Tests
 *
 * @package
 */

const assert = require( 'node:assert' );
const fs = require( 'fs' );
const path = require( 'path' );

const repoRoot = path.resolve( __dirname, '..', '..' );
const localStorageDir = path.join( repoRoot, '.test-temp', 'localstorage' );
fs.mkdirSync( localStorageDir, { recursive: true } );
const localStorageFile = path.join( localStorageDir, 'localstorage.json' );
if ( ! fs.existsSync( localStorageFile ) ) {
	fs.writeFileSync( localStorageFile, '{}' );
}
process.env.LOCAL_STORAGE_DIRECTORY =
	process.env.LOCAL_STORAGE_DIRECTORY || localStorageDir;
process.env.LOCAL_STORAGE_FILE =
	process.env.LOCAL_STORAGE_FILE || localStorageFile;

const moduleNameMapper = {
	'\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
	'\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
};

const coverageDirectory = path.join( repoRoot, 'coverage', 'scripts' );

const config = {
	rootDir: repoRoot,
	roots: [
		'<rootDir>/scripts/__tests__',
		'<rootDir>/scripts/validation/__tests__',
		'<rootDir>/scripts/lib/__tests__',
		'<rootDir>/scripts/dry-run/__tests__',
		'<rootDir>/scripts/agents/__tests__',
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/.github/',
	],
	testEnvironment: 'node',
	testMatch: [ '**/*.test.js' ],
	collectCoverage: true,
	collectCoverageFrom: [
		'<rootDir>/scripts/**/*.js',
		'!<rootDir>/scripts/**/__tests__/**',
		'!<rootDir>/scripts/**/*.test.js',
	],
	coverageDirectory,
	coverageProvider: 'v8',
	coverageReporters: [ 'text', 'lcov', 'html' ],
	verbose: true,
	testTimeout: 30000,
	moduleNameMapper,
	setupFilesAfterEnv: [
		'<rootDir>/.github/tests/jest.setup.localstorage.js',
	],
};

assert(
	Array.isArray( config.testMatch ) && config.testMatch.length > 0,
	'Scripts jest.config must provide at least one testMatch entry.'
);

assert(
	moduleNameMapper[ '\\.(css|scss|sass)$' ] &&
		moduleNameMapper[ '\\.(jpg|jpeg|png|gif|svg)$' ],
	'Scripts moduleNameMapper must include CSS and file stubs.'
);

module.exports = config;
