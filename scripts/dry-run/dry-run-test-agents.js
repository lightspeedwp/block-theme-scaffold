/**
 * @file dry-run-test-agents.js
 * @description Dry-run script for agent Jest tests.
 * @todo Expand to support more agent test types if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:agents']);
