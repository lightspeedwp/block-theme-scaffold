// Dry-run script for config validation
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'validate:config']);
