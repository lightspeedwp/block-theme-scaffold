/**
 * Jest Configuration
 *
 * @see https://jestjs.io/docs/configuration
 */

module.exports = {
	preset: '@wordpress/jest-preset-default',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/vendor/',
		'/public/',
		'/.test-temp/',
	],
	collectCoverageFrom: [
		'src/**/*.{js,jsx}',
		'!src/**/*.test.{js,jsx}',
		'!src/**/*.stories.{js,jsx}',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleNameMapper: {
		'\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
		'\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
	},
	modulePathIgnorePatterns: ['<rootDir>/.test-temp/'],
};
