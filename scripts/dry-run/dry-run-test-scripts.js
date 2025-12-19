/**
 * @file dry-run-test-scripts.js
 * @description Dry-run script for scripts/__tests__ Jest tests.
 * @todo Expand to support additional script test scenarios if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:scripts']);
