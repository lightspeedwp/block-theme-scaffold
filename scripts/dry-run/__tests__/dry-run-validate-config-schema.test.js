const { spawnSync } = require('child_process');
const path = require('path');

describe('dry-run-validate-config-schema', () => {
	it('runs without error', () => {
		const script = path.resolve(
			__dirname,
			'../dry-run-validate-config-schema.js'
		);
		const result = spawnSync('node', [script], { stdio: 'pipe' });
		expect(result.status).toBe(0);
	});
});
