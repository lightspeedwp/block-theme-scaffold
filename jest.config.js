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
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: [
		'<rootDir>/.github/tests/setup.js',
		'<rootDir>/.github/tests/jest.setup.localstorage.js',
	],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/vendor/',
		'/public/',
		'/output-theme/',
		'/.test-temp/',
		'/.github/',
	],
	collectCoverageFrom: [
		'src/**/*.{js,jsx}',
		'!src/**/*.test.{js,jsx}',
		'!src/**/*.stories.{js,jsx}',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleNameMapper,
	modulePathIgnorePatterns: [
		'<rootDir>/.test-temp/',
		'<rootDir>/output-theme/',
	],
};
