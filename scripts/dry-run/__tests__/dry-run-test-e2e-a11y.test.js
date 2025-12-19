const { spawnSync } = require('child_process');
const path = require('path');

describe('dry-run-test-e2e-a11y', () => {
	it('runs without error', () => {
		const script = path.resolve(__dirname, '../dry-run-test-e2e-a11y.js');
		const result = spawnSync('node', [script], { stdio: 'pipe' });
		expect(result.status).toBe(0);
	});
});
