// scripts/agents/a11y.agent.js
/**
 * Accessibility Agent
 * Uses wizard.js for interactive configuration.
 * Supports: cli, mock
 */
const { runWizard } = require('../lib/wizard');

const questions = [
  { name: 'auditType', type: 'list', choices: ['quick', 'full'], default: 'quick', message: 'Audit type:' },
  { name: 'target', type: 'input', message: 'Target URL or path:' },
];

async function main() {
  const mode = process.env.WIZARD_MODE || 'cli';
  const config = await runWizard({ mode, questions });
  // TODO: Implement accessibility audit logic using config
  console.log('A11y Agent config:', config);
}

if (require.main === module) main();
module.exports = { main, questions };
