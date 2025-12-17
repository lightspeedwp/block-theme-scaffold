// __tests__/code-quality.agent.test.js
const { main, questions } = require('../code-quality.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('code-quality agent runs with mock wizard', async () => {
  const config = await wizardInterfaces.mock(questions, {});
  expect(config.checkType).toBe('lint');
  expect(config.target).toBe('mock-value');
});
