// scripts/agents/release.agent.js
/**
 * Release Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
  { name: 'releaseType', type: 'list', choices: ['major', 'minor', 'patch'], default: 'patch', message: 'Release type:' },
  { name: 'changelog', type: 'input', message: 'Changelog entry:' },
];

async function main() {
  const mode = process.env.WIZARD_MODE || 'cli';
  const config = await runWizard({ mode, questions });
  // TODO: Implement release logic using config
  console.log('Release Agent config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
