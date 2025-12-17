// Dry-run script for template validation tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:templates']);
