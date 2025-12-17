// Dry-run script for mustache schema validation
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'validate:mustache']);
