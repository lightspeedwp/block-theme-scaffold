// scripts/agents/task-researcher.agent.js
/**
 * Task Researcher Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
	{ name: 'researchTopic', type: 'input', message: 'Research topic:' },
	{
		name: 'depth',
		type: 'list',
		choices: ['summary', 'detailed'],
		default: 'summary',
		message: 'Depth:',
	},
];

async function main() {
	const mode = process.env.WIZARD_MODE || 'cli';
	const config = await runWizard({ mode, questions });
	// TODO: Implement research logic using config
	console.log('Task Researcher config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
