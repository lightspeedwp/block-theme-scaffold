/**
 * Jest Configuration for Scripts Tests
 *
 * @package
 */

module.exports = {
	testEnvironment: 'jsdom',
	testMatch: ['**/__tests__/**/*.test.js'],
	collectCoverageFrom: ['../*.js', '!../__tests__/**'],
	coverageDirectory: '../../coverage/scripts',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	testTimeout: 30000,
};
