// scripts/agents/release.questions.js
// Questions array for the release agent wizard (advanced, conditional, config-driven)

const questions = [
  // Confirm target version
  {
    type: 'input',
    name: 'target_version',
    message: 'Target release version (from VERSION file):',
    default: () => require('fs').readFileSync('VERSION', 'utf8').trim(),
    validate: val => /^\d+\.\d+(\.\d+)?(-[\w.]+)?$/.test(val) ? true : 'Must be valid semver.'
  },
  // Placeholder-free check
  {
    type: 'confirm',
    name: 'runPlaceholderCheck',
    message: 'Check for remaining {{mustache}} placeholders in theme?',
    default: true
  },
  // Version alignment
  {
    type: 'confirm',
    name: 'runVersionAlignment',
    message: 'Check version alignment across meta files and style.css?',
    default: true
  },
  // Lint/format/test/build
  {
    type: 'confirm',
    name: 'runQualityGates',
    message: 'Run lint, format, test, and build checks?',
    default: true
  },
  // CHANGELOG and docs
  {
    type: 'confirm',
    name: 'runDocsAudit',
    message: 'Audit CHANGELOG.md, README.md, and release docs?',
    default: true
  },
  // Security audit
  {
    type: 'confirm',
    name: 'runSecurityAudit',
    message: 'Run npm and composer security audit?',
    default: true
  },
  // Optional: skip non-critical checks
  {
    type: 'confirm',
    name: 'skipOptional',
    message: 'Skip optional checks (bundle size, Lighthouse, etc)?',
    default: false
  }
];

module.exports = questions;
