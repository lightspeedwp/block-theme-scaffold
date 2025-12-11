#!/usr/bin/env node
/**
 * Verify Jest mock configuration
 *
 * @package
 */

const fs = require('fs');
const path = require('path');

console.log('Jest Mock Configuration Verification\n');
console.log('=====================================\n');

// Check Jest config
try {
	const jestConfig = require('../../jest.config.js');

	console.log('✓ Jest config loaded successfully');

	if (jestConfig.moduleNameMapper) {
		console.log('✓ moduleNameMapper is configured\n');

		const cssPattern = '\\.(css|scss|sass)$';
		const filePattern = '\\.(jpg|jpeg|png|gif|svg)$';

		if (jestConfig.moduleNameMapper[cssPattern]) {
			console.log(
				'  CSS/SCSS mock:',
				jestConfig.moduleNameMapper[cssPattern]
			);
		}

		if (jestConfig.moduleNameMapper[filePattern]) {
			console.log(
				'  Image mock:',
				jestConfig.moduleNameMapper[filePattern]
			);
		}
	} else {
		console.log('✗ moduleNameMapper is NOT configured');
	}
} catch (error) {
	console.error('✗ Error loading Jest config:', error.message);
	process.exit(1);
}

console.log('\n');

// Check mock files exist
const mockDir = path.join(__dirname);
const styleMockPath = path.join(mockDir, 'styleMock.js');
const fileMockPath = path.join(mockDir, 'fileMock.js');

console.log('Mock Files:');
console.log('✓ styleMock.js exists:', fs.existsSync(styleMockPath));
console.log('✓ fileMock.js exists:', fs.existsSync(fileMockPath));

console.log('\n');

// Test mock content
try {
	const styleMock = require('./styleMock.js');
	const fileMock = require('./fileMock.js');

	console.log('Mock Content:');
	console.log('✓ styleMock returns:', JSON.stringify(styleMock));
	console.log('✓ fileMock returns:', JSON.stringify(fileMock));

	// Validate content
	const styleIsObject =
		typeof styleMock === 'object' && !Array.isArray(styleMock);
	const fileIsString = typeof fileMock === 'string';

	console.log('\n');
	console.log('Validation:');
	console.log(styleIsObject ? '✓' : '✗', 'styleMock is an object');
	console.log(fileIsString ? '✓' : '✗', 'fileMock is a string');

	if (styleIsObject && fileIsString) {
		console.log('\n✅ All mocks are properly configured and working!\n');
		process.exit(0);
	} else {
		console.log('\n✗ Mock validation failed\n');
		process.exit(1);
	}
} catch (error) {
	console.error('\n✗ Error loading mocks:', error.message);
	process.exit(1);
}
