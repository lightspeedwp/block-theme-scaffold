// TODO: Add log rotation and environment overrides for build logs.
/**
 * Block Theme Build Agent
 *
 * Orchestrates dependency installation, linting, building, and testing for the
 * WordPress block theme scaffold build workflow.
 *
 * @module scripts/agents/block-theme-build.agent
 */
// Usage: node scripts/agents/block-theme-build.agent.js

const { execSync } = require('child_process');

function run(cmd) {
	console.log(`$ ${cmd}`);
	execSync(cmd, { stdio: 'inherit' });
}

function main() {
	console.log('Block theme build agent starting...');

	// 1. Install dependencies
	run('npm ci');

	// 2. Lint
	run('npm run lint');

	// 3. Build
	run('npm run build');

	// 4. Test
	run('npm test');

	// 5. Report success
	console.log(
		'Block theme build agent completed successfully. All steps completed successfully.'
	);
}

module.exports = {
	main,
	run,
};

if (require.main === module) {
	main();
}
