/**
 * Mock verification tests
 * Demonstrates that Jest mock files are working correctly
 *
 * @package
 */

/**
 * Test that style mocks work correctly
 */
describe('Style Mock', () => {
	test('should return empty object for CSS imports', () => {
		const styleMock = require('./styleMock');
		expect(styleMock).toEqual({});
	});

	test('mock file exists', () => {
		const fs = require('fs');
		const path = require('path');
		const mockPath = path.join(__dirname, 'styleMock.js');
		expect(fs.existsSync(mockPath)).toBe(true);
	});
});

/**
 * Test that file mocks work correctly
 */
describe('File Mock', () => {
	test('should return test stub for file imports', () => {
		const fileMock = require('./fileMock');
		expect(fileMock).toBe('test-file-stub');
	});

	test('mock file exists', () => {
		const fs = require('fs');
		const path = require('path');
		const mockPath = path.join(__dirname, 'fileMock.js');
		expect(fs.existsSync(mockPath)).toBe(true);
	});
});

/**
 * Test Jest configuration
 */
describe('Jest Configuration', () => {
	test('moduleNameMapper is configured', () => {
		const jestConfig = require('../../jest.config.js');
		expect(jestConfig.moduleNameMapper).toBeDefined();
		expect(jestConfig.moduleNameMapper).toHaveProperty(
			'\\.(css|scss|sass)$'
		);
		expect(jestConfig.moduleNameMapper).toHaveProperty(
			'\\.(jpg|jpeg|png|gif|svg)$'
		);
	});

	test('mock paths are correct', () => {
		const jestConfig = require('../../jest.config.js');
		const cssPath = jestConfig.moduleNameMapper['\\.(css|scss|sass)$'];
		const filePath =
			jestConfig.moduleNameMapper['\\.(jpg|jpeg|png|gif|svg)$'];

		expect(cssPath).toContain('styleMock.js');
		expect(filePath).toContain('fileMock.js');
	});
});
