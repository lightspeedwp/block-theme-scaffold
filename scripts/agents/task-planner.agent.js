// scripts/agents/task-planner.agent.js
/**
 * Task Planner Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
	{
		name: 'planType',
		type: 'list',
		choices: ['feature', 'refactor', 'bugfix'],
		default: 'feature',
		message: 'Plan type:',
	},
	{
		name: 'priority',
		type: 'list',
		choices: ['low', 'medium', 'high'],
		default: 'medium',
		message: 'Priority:',
	},
];

async function main() {
	const mode = process.env.WIZARD_MODE || 'cli';
	const config = await runWizard({ mode, questions });
	// TODO: Implement planning logic using config
	console.log('Task Planner config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
