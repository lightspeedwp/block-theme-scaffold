---
title: Agent Index
description: Complete reference for automation agents
date: 2025-12-08
---

# Agent Index

**See:** [custom-instructions.md](../custom-instructions.md) | [AGENTS.md](../../AGENTS.md) | [prompts.md](../prompts/prompts.md)

## Available Agents

| Agent                     | Spec                                                             | Purpose                          |
| ------------------------- | ---------------------------------------------------------------- | -------------------------------- |
| **Gemini**                | [gemini.agent.md](gemini.agent.md)                               | Google Gemini model interface    |
| **Generate Theme**        | [generate-theme.agent.md](generate-theme.agent.md)               | Interactive theme generator      |
| **Development Assistant** | [development-assistant.agent.md](development-assistant.agent.md) | AI development assistant         |
| **Block Theme Build**     | [block-theme-build.agent.md](block-theme-build.agent.md)         | Build automation                 |
| **Release Manager**       | [release.agent.md](release.agent.md)                             | Release preparation & validation |

---

## Agent File Mapping

Complete mapping of agent files to their implementation, instructions, and related resources:

| Agent                 | Spec                                                             | Script                                                                                 | Instructions                                                                                                            | Prompts                                                                                       | Tests                                                                                                        | Workflow                                                                                      |
| --------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Block Theme Build     | [block-theme-build.agent.md](block-theme-build.agent.md)         | [scripts/block-theme-build.agent.js](../../scripts/block-theme-build.agent.js)         | [.github/instructions/block-theme-development.instructions.md](../instructions/block-theme-development.instructions.md) | [.github/prompts/block-theme-build.prompt.md](../prompts/block-theme-build.prompt.md)         | [scripts/**tests**/block-theme-build.agent.test.js](../../scripts/__tests__/block-theme-build.agent.test.js) | [.github/workflows/block-theme-build-and-e2e.yml](../workflows/block-theme-build-and-e2e.yml) |
| Generate Theme        | [generate-theme.agent.md](generate-theme.agent.md)               | [scripts/generate-theme.agent.js](../../scripts/generate-theme.agent.js)               | [.github/instructions/generate-theme.instructions.md](../instructions/generate-theme.instructions.md)                   | [.github/prompts/generate-theme.prompt.md](../prompts/generate-theme.prompt.md)               | [tests/agents/generate-theme.agent.test.js](../../tests/agents/generate-theme.agent.test.js)                 | [.github/workflows/agent-generate-theme.yml](../workflows/agent-generate-theme.yml)           |
| Development Assistant | [development-assistant.agent.md](development-assistant.agent.md) | [scripts/development-assistant.agent.js](../../scripts/development-assistant.agent.js) | [.github/instructions/copilot-ai-agent.instructions.md](../instructions/copilot-ai-agent.instructions.md)               | [.github/prompts/development-assistant.prompt.md](../prompts/development-assistant.prompt.md) | [tests/agents/development-assistant.agent.test.js](../../tests/agents/development-assistant.agent.test.js)   | TBD                                                                                           |
| Gemini                | [gemini.agent.md](gemini.agent.md)                               | [scripts/gemini.agent.js](../../scripts/gemini.agent.js)                               | [.github/instructions/copilot-ai-agent.instructions.md](../instructions/copilot-ai-agent.instructions.md)               | [.github/prompts/gemini.prompt.md](../prompts/gemini.prompt.md)                               | [tests/agents/gemini.agent.test.js](../../tests/agents/gemini.agent.test.js)                                 | TBD                                                                                           |
| Release Manager       | [release.agent.md](release.agent.md)                             | [scripts/release.agent.js](../../scripts/release.agent.js)                             | [docs/RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md)                                                                | [.github/prompts/release.prompt.md](../prompts/release.prompt.md)                             | [tests/agents/release.agent.test.js](../../tests/agents/release.agent.test.js)                               | [.github/workflows/agent-release.yml](../workflows/agent-release.yml)                         |
| Reporting             | [reporting.agent.md](reporting.agent.md)                         | [scripts/reporting.agent.js](../../scripts/reporting.agent.js)                         | [.github/instructions/reporting.instructions.md](../instructions/reporting.instructions.md)                             | TBD                                                                                           | [tests/agents/reporting.agent.test.js](../../tests/agents/reporting.agent.test.js)                           | [.github/workflows/agent-reporting.yml](../workflows/agent-reporting.yml)                     |

---

**Usage:** See individual agent spec files for details

**New agents:** Follow existing agent spec patterns
