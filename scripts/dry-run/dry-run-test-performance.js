
/**
 * @file dry-run-test-performance.js
 * @description Dry-run script for performance tests.
 * @todo Add more performance metrics and scenarios as needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:performance']);
