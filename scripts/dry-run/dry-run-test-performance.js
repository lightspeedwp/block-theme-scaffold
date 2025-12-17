// Dry-run script for performance tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:performance']);
