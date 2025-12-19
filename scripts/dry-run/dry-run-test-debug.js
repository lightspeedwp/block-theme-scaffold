/**
 * @file dry-run-test-debug.js
 * @description Debug wrapper for the dry run test runner. Adds logging and environment overrides.
 * @todo Add more granular debug levels and output options for dry-run debugging.
 */
/**
 * Debug wrapper for the dry run test runner. Keeps the original dry-run-test.js
 * logic intact while allowing additional logging or environment overrides.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'dry-run-test.js');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [scriptPath, ...args], {
	stdio: 'inherit',
	env: { ...process.env, DRY_RUN_DEBUG: '1' },
});

process.exit(result.status || 0);
