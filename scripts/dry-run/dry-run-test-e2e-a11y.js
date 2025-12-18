
/**
 * @file dry-run-test-e2e-a11y.js
 * @description Dry-run script for E2E accessibility tests.
 * @todo Integrate with additional a11y test runners if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:e2e:a11y']);
