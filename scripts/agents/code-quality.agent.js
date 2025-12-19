// scripts/agents/code-quality.agent.js
/**
 * Code Quality Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
	{
		name: 'checkType',
		type: 'list',
		choices: ['lint', 'test', 'coverage'],
		default: 'lint',
		message: 'Check type:',
	},
	{ name: 'target', type: 'input', message: 'Target file or folder:' },
];

async function main() {
	const mode = process.env.WIZARD_MODE || 'cli';
	const config = await runWizard({ mode, questions });
	// TODO: Implement code quality logic using config
	console.log('Code Quality Agent config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
