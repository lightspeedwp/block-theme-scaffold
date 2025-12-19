const templateAgent = require('../../scripts/agents/template.agent.js');

describe('Template agent', () => {
	test('exports the expected helpers', () => {
		expect(templateAgent).toHaveProperty('main');
		expect(typeof templateAgent.main).toBe('function');
		expect(templateAgent).toHaveProperty('questions');
		expect(Array.isArray(templateAgent.questions)).toBe(true);
	});

	test('questions includes expected fields', () => {
		const questionNames = templateAgent.questions.map((q) => q.name);
		expect(questionNames).toContain('templateType');
		expect(questionNames).toContain('outputPath');
	});
});
