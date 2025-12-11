---
title: Prompt Templates
description: Quick reference for prompt templates
date: 2025-12-08
---

## 📂 Dynamic Prompt Index

This file serves as an index for all prompt templates used by AI agents and assistants in this repository. For a complete list of available prompts, refer to the dynamic index below.

- See`.github/prompts/*.prompt.md` for all prompt files.

## 🎯 Key Prompts

| Prompt                                                                 | Description                   | Usage                                     |
| ---------------------------------------------------------------------- | ----------------------------- | ----------------------------------------- |
| generate-theme.prompt.md                 | Interactive theme generator   | Start with "Generate a new block theme"   |
| block-theme-build.prompt.md           | Build and validation prompts  | Ask "Run full build validation"           |
| development-assistant.prompt.md   | Development assistant prompts | Ask "Switch to theme.json editing mode"   |
| release.prompt.md                               | Release workflow prompts      | Ask "Run release validation"              |
| release-scaffold.prompt.md             | Scaffold-only release prompts | Ask "Prepare scaffold release vX.Y.Z"     |

---

## 🎯 Key Prompts

| Prompt | Description | Usage |
|--------|-------------|-------|
| [generate-theme.prompt.md](./generate-theme.prompt.md) | Interactive theme generator | Start with "Generate a new block theme" |
| [block-theme-build.prompt.md](./block-theme-build.prompt.md) | Build and validation prompts | Ask "Run full build validation" |
| [development-assistant.prompt.md](./development-assistant.prompt.md) | Development assistant prompts | Ask "Switch to theme.json editing mode" |
| [release.prompt.md](./release.prompt.md) | Release workflow prompts | Ask "Run release validation" |

---

## Quick Start

```bash
# Generate new theme
node scripts/generate-theme.js --slug "my-theme" --name "My Theme"
```

**Or use:** [generate-theme.prompt.md](./generate-theme.prompt.md) in Copilot

---

**Guidelines:** Use mustache variables, follow WordPress standards, prioritize accessibility
