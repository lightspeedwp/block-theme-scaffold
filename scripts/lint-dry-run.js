#!/usr/bin/env node
/**
 * lint-dry-run.js
 * Runs JS, CSS, and PHP lint checks in dry-run mode for pre-release validation.
 */
const { execSync } = require('child_process');

function run(cmd, label) {
	try {
		execSync(cmd, { stdio: 'inherit' });
		console.log(`\u2714 ${label}`);
	} catch (e) {
		console.error(`\u274c ${label}`);
		process.exit(1);
	}
}

run('npm run lint:js', 'JS lint');
run('npm run lint:css', 'CSS lint');
run('composer run lint', 'PHP lint');
