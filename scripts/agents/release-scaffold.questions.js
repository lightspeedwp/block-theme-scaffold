// scripts/agents/release-scaffold.questions.js
// Questions array for the release-scaffold agent wizard (advanced, conditional, config-driven)

const questions = [
  // Confirm target version
  {
    type: 'input',
    name: 'target_version',
    message: 'Target release version (from VERSION file):',
    default: () => require('fs').readFileSync('VERSION', 'utf8').trim(),
    validate: val => /^\d+\.\d+(\.\d+)?(-[\w.]+)?$/.test(val) ? true : 'Must be valid semver.'
  },
  // Placeholder integrity check
  {
    type: 'confirm',
    name: 'runPlaceholderCheck',
    message: 'Run placeholder integrity check (scan for {{mustache}} tokens)?',
    default: true
  },
  // Meta version alignment
  {
    type: 'confirm',
    name: 'runMetaVersionCheck',
    message: 'Check meta version alignment (VERSION, package.json, composer.json)?',
    default: true
  },
  // Schema validation
  {
    type: 'confirm',
    name: 'runSchemaValidation',
    message: 'Run mustache variable schema validation?',
    default: true
  },
  // Release template sanity
  {
    type: 'confirm',
    name: 'runTemplateSanity',
    message: 'Check release template sanity (placeholders in agent/prompt/docs)?',
    default: true
  },
  // Quality gates
  {
    type: 'confirm',
    name: 'runQualityGates',
    message: 'Run dry-run lint/format/test and npm audit?',
    default: true
  },
  // Generation smoke test
  {
    type: 'confirm',
    name: 'runSmokeTest',
    message: 'Run generation smoke test (generate sample theme and check output)?',
    default: true
  },
  // Custom: skip optional steps
  {
    type: 'confirm',
    name: 'skipOptional',
    message: 'Skip optional checks (docs, dependencies, etc)?',
    default: false
  }
];

module.exports = questions;
