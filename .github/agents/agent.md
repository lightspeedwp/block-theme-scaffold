---
title: Agent Specifications
description: Documentation of automation agents and their configurations
category: Project
type: Reference
audience: AI Assistants, Developers
date: 2025-12-01
---

## Overview & Related Files

This file documents the primary automation agent(s) for this repository, their purpose, usage, and integration with workflows. Reference this file for agent specs, triggers, and environment variables.

**Related Files:**
- [Custom Instructions](../custom-instructions.md) — main AI/Copilot and theme instructions
- [Prompts](../prompts/prompts.md) — prompt templates for consistent output
- [Global AI Rules (AGENTS.md)](../../AGENTS.md) — org-wide agent rules and standards

**Dynamic References:**
- All instruction files: [`*.instructions.md`](../instructions/)
- All agent files: [`*.agent.md`](../agents/) and [`*.agent.js`](../agents/)
- All prompt files: [`*.prompt.md`](../prompts/)

---

## Available Agents

### Gemini Agent (MCP)

- **Agent Spec:** `.github/agents/gemini.agent.md`
- **Agent Script:** `.github/agents/gemini.agent.js`
- **Purpose:** Primary agent for interfacing with Google's Gemini models for advanced code generation, refactoring, and other development tasks.
- **Usage:** Activated via the Gemini CLI.

### Scaffold Generator Agent

- **Agent Spec:** `.github/agents/scaffold-generator.agent.md`
- **Purpose:** Interactive agent that guides you through creating a new WordPress block theme from this scaffold. Collects requirements through a multi-stage conversation and generates the theme.
- **Usage:** Say "Generate a new block theme" or "Create theme from scaffold"
- **Related Prompt:** [generate-theme.prompt.md](../prompts/generate-theme.prompt.md)

### Development Assistant Agent

- **Agent Spec:** `.github/agents/development-assistant.agent.md`
- **Purpose:** AI-powered development assistant for block theme development, providing guidance on patterns, templates, theme.json, and best practices.
- **Modes:** Pattern Authoring, Theme.json Editing, PHP/JS/SCSS Expert, Testing & QA

### Block Theme Build Agent

- **Agent Script:** `.github/agents/block-theme-build.agent.js`
- **Spec:** `.github/agents/block-theme-build.agent.md`
- **Workflow:** `.github/workflows/block-theme-build-and-e2e.yml`
- **Purpose:** Automate build, lint, test, and validation for this block theme using WordPress and org standards.

### Usage
- **GitHub Actions:** See the workflow file for triggers and environment variables
- **Local:** `node .github/agents/block-theme-build.agent.js`

### Environment Variables
- `DRY_RUN` (default: `false`)
- `VERBOSE` (default: `false`)
- Additional secrets per workflow (e.g., `GITHUB_TOKEN` for label operations)

### Maintenance
- Keep the agent aligned with repo tooling (linters, build, tests)
- Update documentation and scripts as workflows evolve
- See [Block Theme Build Agent Spec](./block-theme-build.agent.md) for detailed build process and requirements

---

## Example: Agent Spec Template (for new agents)


> **Note:** The following is a template for documenting new agents. The files `agent-script.js` and `agent-workflow.yml` are placeholders and do not exist in this repository. Replace them with your actual agent script and workflow filenames when adding new agents.

Use the following as a template for documenting new agents:

---

- **Agent:** `agent-script.js`
- **Workflow:** `.github/workflows/agent-workflow.yml`
- **Purpose:** Automate a common, repeatable quality task for this repository type.
- **Usage:**
	- GitHub Actions: see the workflow file for triggers and environment variables
	- Local: `node .github/agents/agent-script.js`
- **Environment variables:**
	- `DRY_RUN` (default: `false`), `VERBOSE` (default: `false`)
	- Additional secrets per workflow (e.g., `GITHUB_TOKEN` for label ops)
- **Maintenance:** Keep the agent aligned with repo tooling (linters, build, tests)

---

For more information on agent usage, see [Custom Instructions](../custom-instructions.md) and [Workflows](../../workflows/).
