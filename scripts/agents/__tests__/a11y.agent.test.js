// __tests__/a11y.agent.test.js
const { main, questions } = require('../a11y.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('a11y agent runs with mock wizard', async () => {
  const config = await wizardInterfaces.mock(questions, {});
  expect(config.auditType).toBe('quick');
  expect(config.target).toBe('mock-value');
});
