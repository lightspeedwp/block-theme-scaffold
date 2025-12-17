# Code Quality Agent Specification

## Purpose

Run linting, testing, and code quality checks for the block theme scaffold. Outputs are stored in `.github/reports/validation/`.

## Wizard Integration

This agent uses the pluggable wizard.js interface for configuration. Supports at least 'cli' and 'mock' modes for interactive and test/dev use. The agent's questions array is passed to runWizard(), and the mode can be set via the WIZARD_MODE environment variable.

## Usage

- Interactive: `node scripts/agents/code-quality.agent.js`
- Dry-run: `WIZARD_MODE=mock node scripts/agents/code-quality.agent.js`
