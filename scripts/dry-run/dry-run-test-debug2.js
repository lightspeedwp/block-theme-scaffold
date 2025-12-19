/**
 * @file dry-run-test-debug2.js
 * @description Debug entry for dry-run test runner (variant 2).
 * @todo Document differences between debug variants and consolidate if possible.
 */
console.log('START dry-run-test-debug2');

const { spawnSync } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'dry-run-test.js');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [scriptPath, ...args], {
	stdio: 'inherit',
	env: { ...process.env, DRY_RUN_DEBUG: '2' },
});

process.exit(result.status || 0);
