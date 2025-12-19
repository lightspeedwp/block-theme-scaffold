// scripts/agents/release.agent.js
/**
 * Release Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */

const { runWizard } = require('../lib/wizard');
const questions = require('./release.questions');

async function main() {
	const mode = process.env.WIZARD_MODE || 'cli';
	let config = {};
	try {
		config = await runWizard({ mode, questions });
	} catch (err) {
		console.error('Wizard failed:', err.message);
		process.exit(1);
	}

	// Example: Use config to control workflow (expand as needed)
	console.log('Release Agent config:', config);
	if (config.runPlaceholderCheck) {
		console.log('Running placeholder check...');
		// ... implement check ...
	}
	if (config.runVersionAlignment) {
		console.log('Checking version alignment...');
		// ... implement check ...
	}
	if (config.runQualityGates) {
		console.log('Running lint/format/test/build...');
		// ... implement checks ...
	}
	if (config.runDocsAudit) {
		console.log('Auditing docs and changelog...');
		// ... implement audit ...
	}
	if (config.runSecurityAudit) {
		console.log('Running security audit...');
		// ... implement audit ...
	}
	if (config.skipOptional) {
		console.log('Skipping optional checks.');
	}
	// ... add more logic as needed ...
}

if (require.main === module) main();
module.exports = { main, questions };
