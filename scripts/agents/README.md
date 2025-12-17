# Agent Scripts Directory

This folder contains all agent automation scripts and templates for the block-theme-scaffold project.

## Structure

- Each agent script implements a specific automation or validation workflow (e.g., theme generation, release, reporting).
- Templates (template.agent.js, template.agent.test.js) are provided for new agent development. These files throw errors if executed directly.
- Tests for agents are in scripts/agents/__tests__/

## Conventions

- Use mustache variables for all config and output.
- Document agent requirements and permissions in the agent spec.
- Do not include scripts/agents/ in generated themes.

## Key Files

- generate-theme.agent.js: Theme generation automation
- release.agent.js: Release automation for generated themes
- release-scaffold.agent.js: Release automation for the scaffold repo only
- template.agent.js: Template for new agents (not executable)

See .github/agents/ for agent specs and documentation.
