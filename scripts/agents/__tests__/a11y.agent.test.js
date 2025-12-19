// __tests__/a11y.agent.test.js
const { main, questions } = require('../a11y.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('a11y agent runs with mock wizard', async () => {
	const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
	const config = await wizardInterfaces.mock(questions, {
		logger: mockLogger,
	});
	expect(config.auditType).toBe('quick');
	expect(config.target).toBe('mock-value');
});
