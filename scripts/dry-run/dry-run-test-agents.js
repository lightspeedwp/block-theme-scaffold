// Dry-run script for agent Jest tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:agents']);
