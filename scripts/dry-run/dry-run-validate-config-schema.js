// Dry-run script for config schema validation
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'validate:config:schema']);
