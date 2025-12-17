// Dry-run script for E2E accessibility tests
const { runWithDryRun } = require('./with-dry-run');
runWithDryRun('npm', ['run', 'test:e2e:a11y']);
