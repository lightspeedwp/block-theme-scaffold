// block-theme-build.agent.js
// Automation agent for WordPress block theme build, lint, and test lifecycle.
// Usage: node .github/agents/block-theme-build.agent.js

const { execSync } = require('child_process');

function run(cmd) {
	console.log(`$ ${cmd}`);
	execSync(cmd, { stdio: 'inherit' });
}

function main() {
	// 1. Install dependencies
	run('npm ci');

	// 2. Lint
	run('npm run lint');

	// 3. Build
	run('npm run build');

	// 4. Test
	run('npm test');

	// 5. Report success
	console.log('Block theme build agent: All steps completed successfully.');
}

if (require.main === module) {
	main();
}
