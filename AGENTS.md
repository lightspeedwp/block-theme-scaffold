---
title: Global AI & Agent Rules
description: Repository-wide rules and guidelines for AI agents and contributors
category: Project
type: Policy
audience: Developers, AI Agents
date: 2025-12-01
---

This repository is block theme–first and designed for advanced AI/Copilot/agent automation. All contributors and agents must follow these rules for safe, maintainable, and scalable WordPress block theme development.

---

## Agent Directory & Index

- See [Main Agent Index](.github/agents/agent.md) for all agent implementations, specs, and usage.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- The main build agent for block themes is documented in [block-theme-build.agent.md](.github/agents/block-theme-build.agent.md) and implemented in [block-theme-build.agent.js](.github/agents/block-theme-build.agent.js), both referenced by the main agent index and all AI ops files.
- The build/test/lint workflow is defined in [block-theme-build-and-e2e.yml](.github/workflows/block-theme-build-and-e2e.yml).
- All contributors must follow the org [Coding Standards](.github/instructions/coding-standards.instructions.md) and [Linting Standards](.github/instructions/linting.instructions.md).
- For block theme–specific automation, agents should:
  - Prefer `theme.json` and block components over bespoke code.
  - Use the [Block Theme Build Agent](.github/agents/block-theme-build.agent.js) and [workflow](.github/workflows/block-theme-build-and-e2e.yml) for all build/lint/test automation.
  - Use mustache variables for all template and config generation.
  - Validate all JSON and PHP output.
  - Document all agent actions in PRs and commit messages.

---

## Agent Test Status

| Agent | Tests | Notes |
| ----- | ----- | ---------------------------- |
| Generate Theme | ✅ | Passing - tests/bin/generate-theme.test.js, tests/agents/generate-theme.agent.test.js |

> **Note:** As agents are developed and tested, this table will be updated with their status. ✅ indicates passing tests, ❌ indicates failing tests, and ⏳ indicates tests pending implementation.

---

## Block Theme Automation Guidelines

For block theme–specific automation:

- Prefer `theme.json` and block components over bespoke code
- Use the [Block Theme Build Agent](.github/agents/block-theme-build.agent.js) for build/lint/test automation
- Use mustache variables for all templates and config generation
- Validate all JSON and PHP output
- Document all agent actions in PRs and commit messages

**Build Workflow:** [block-theme-build-and-e2e.yml](.github/workflows/block-theme-build-and-e2e.yml)

---

## Quick Reference

| Resource | Link |
| -------- | ---- |
| Custom AI Instructions | [.github/custom-instructions.md](.github/custom-instructions.md) |
| Agent Directory | [.github/agents/agent.md](.github/agents/agent.md) |
| Development Assistant | [.github/agents/development-assistant.agent.md](.github/agents/development-assistant.agent.md) |
| Prompts | [.github/prompts/prompts.md](.github/prompts/prompts.md) |
| Coding Standards | [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md) |
| Linting Standards | [.github/instructions/linting.instructions.md](.github/instructions/linting.instructions.md) |

---

> See [.github/custom-instructions.md](.github/custom-instructions.md) for detailed AI guidance and [.github/instructions/](.github/instructions/) for all coding standards.
