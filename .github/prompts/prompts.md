---
title: Prompt Templates
description: Quick reference for prompt templates
date: 2025-12-08
---

# Prompt Templates

**See:** [custom-instructions.md](../custom-instructions.md) | [agent.md](../agents/agent.md)

---

## Available Prompts

| Prompt | Description | Usage |
|--------|-------------|-------|
| [generate-theme.prompt.md](./generate-theme.prompt.md) | Interactive theme generator | Start with "Generate a new block theme" |
| [block-theme-build.prompt.md](./block-theme-build.prompt.md) | Build and validation prompts | Ask "Run full build validation" |
| [development-assistant.prompt.md](./development-assistant.prompt.md) | Development assistant prompts | Ask "Switch to theme.json editing mode" |
| [gemini.prompt.md](./gemini.prompt.md) | Gemini agent prompt tips | Ask "Optimize for Gemini context window" |
| [release.prompt.md](./release.prompt.md) | Release workflow prompts | Ask "Run release validation" |

## Quick Start

```bash
# Generate new theme
node scripts/generate-theme.js --slug "my-theme" --name "My Theme"
```

**Or use:** [generate-theme.prompt.md](./generate-theme.prompt.md) in Copilot

---

**Guidelines:** Use mustache variables, follow WordPress standards, prioritize accessibility
