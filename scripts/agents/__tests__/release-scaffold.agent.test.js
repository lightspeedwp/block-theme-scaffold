// __tests__/release-scaffold.agent.test.js
const { main, questions } = require('../release-scaffold.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('release-scaffold agent runs with mock wizard', async () => {
	const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
	const config = await wizardInterfaces.mock(questions, {
		logger: mockLogger,
	});
	expect(config.scaffoldType).toBe('theme');
	expect(config.version).toBe('mock-value');
});
