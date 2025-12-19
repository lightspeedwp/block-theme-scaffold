// scripts/agents/template.agent.js
/**
 * Template Agent (stub)
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
	{
		name: 'templateType',
		type: 'list',
		choices: ['page', 'post', 'custom'],
		default: 'page',
		message: 'Template type:',
	},
	{ name: 'outputPath', type: 'input', message: 'Output path:' },
];

async function main() {
	const mode = process.env.WIZARD_MODE || 'cli';
	const config = await runWizard({ mode, questions });
	// TODO: Implement template generation logic using config
	console.log('Template Agent config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
