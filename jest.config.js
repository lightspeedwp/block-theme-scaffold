/**
 * Jest Configuration
 *
 * @see https://jestjs.io/docs/configuration
 */

const fs = require('fs');
const path = require('path');

const localStorageDir = path.join(__dirname, '.test-temp', 'localstorage');
fs.mkdirSync(localStorageDir, { recursive: true });
process.env.LOCAL_STORAGE_DIRECTORY =
	process.env.LOCAL_STORAGE_DIRECTORY || localStorageDir;

const moduleNameMapper = {
	'\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
	'\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
};

module.exports = {
	preset: '@wordpress/jest-preset-default',
	// The tooling is Node code; its tests need no DOM.
	testEnvironment: 'node',
	setupFilesAfterEnv: [
		'<rootDir>/.github/tests/setup.js',
		'<rootDir>/.github/tests/jest.setup.localstorage.js',
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/vendor/',
		'/public/',
		'/output-theme/',
		'/theme-template/',
		'/.test-temp/',
		'/.github/',
	],
	collectCoverageFrom: [
		'scripts/**/*.js',
		'!scripts/**/__tests__/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleNameMapper,
	modulePathIgnorePatterns: [
		'<rootDir>/.test-temp/',
		'<rootDir>/output-theme/',
		'<rootDir>/theme-template/',
	],
};
