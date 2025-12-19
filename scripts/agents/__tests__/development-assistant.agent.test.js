/**
 * Tests for Development Assistant Agent
 * @jest-environment jsdom
 */

const {
	showHelp,
	patternHelp,
	templateHelp,
	switchMode,
} = require('../development-assistant.agent');

describe('Development Assistant Agent', () => {
	test('exports main functions', () => {
		expect(typeof showHelp).toBe('function');
		expect(typeof patternHelp).toBe('function');
		expect(typeof templateHelp).toBe('function');
		expect(typeof switchMode).toBe('function');
	});

	// TODO: Add tests for help topics and mode switching
});
