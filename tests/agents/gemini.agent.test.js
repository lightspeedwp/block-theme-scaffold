/**
 * Tests for Gemini Agent
 * @jest-environment node
 */

const {
	chatSession,
	generateCode,
	refactorCode,
	explainCode,
	generateTests,
} = require('../../scripts/gemini.agent');

describe('Gemini Agent', () => {
	test('exports main functions', () => {
		expect(typeof generateCode).toBe('function');
		expect(typeof refactorCode).toBe('function');
		expect(typeof explainCode).toBe('function');
		expect(typeof generateTests).toBe('function');
	});

	// TODO: Add integration tests with mocked Gemini API
});
