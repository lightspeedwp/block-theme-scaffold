const { spawnSync } = require('child_process');
const path = require('path');

describe('dry-run-validate-mustache', () => {
	it('runs without error', () => {
		const script = path.resolve(
			__dirname,
			'../dry-run-validate-mustache.js'
		);
		const result = spawnSync('node', [script], { stdio: 'pipe' });
		expect(result.status).toBe(0);
	});
});
