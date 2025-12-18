
/**
 * @file dry-run-validate-config.js
 * @description Dry-run script for config validation.
 * @todo Add more config validation scenarios if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'validate:config']);
