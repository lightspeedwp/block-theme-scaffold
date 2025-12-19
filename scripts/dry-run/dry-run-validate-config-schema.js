/**
 * @file dry-run-validate-config-schema.js
 * @description Dry-run script for config schema validation.
 * @todo Add more schema validation scenarios if needed.
 */
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'validate:config:schema']);
