
/**
 * @file dry-run-test-theme-json.js
 * @description Dry-run script for theme.json validation tests.
 * @todo Add more granular theme.json test cases if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:theme-json']);
