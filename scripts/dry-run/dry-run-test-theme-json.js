// Dry-run script for theme.json validation tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:theme-json']);
