// Dry-run script for scripts/__tests__ Jest tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:scripts']);
