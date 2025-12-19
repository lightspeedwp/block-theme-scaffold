// __tests__/task-researcher.agent.test.js
const { main, questions } = require('../task-researcher.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('task researcher agent runs with mock wizard', async () => {
	const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
	const config = await wizardInterfaces.mock(questions, {
		logger: mockLogger,
	});
	expect(config.researchTopic).toBe('mock-value');
	expect(config.depth).toBe('summary');
});
