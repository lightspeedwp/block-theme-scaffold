// __tests__/task-planner.agent.test.js
const { main, questions } = require('../task-planner.agent');
const { wizardInterfaces } = require('../../lib/wizard');

test('task planner agent runs with mock wizard', async () => {
  const config = await wizardInterfaces.mock(questions, {});
  expect(config.planType).toBe('feature');
  expect(config.priority).toBe('medium');
});
