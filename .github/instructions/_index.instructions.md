---
file_type: instructions
title: Master Instructions Index
description: >-
  A concise navigation layer that maps each instruction document to its role in
  the WordPress block theme scaffold.
version: '1.1'
last_updated: '2025-12-13'
author: LightSpeedWP Team
tags:
  - index
  - navigation
  - documentation
applyTo: '**'
domain: meta
stability: stable
---
# Master Instructions Index

Use this file as your first stop when you need to know which instruction set to follow. It keeps the guide hierarchy clean: Agents and humans read `custom-instructions.md` first, then this index, then the topic-specific files described below.

## How to Navigate
1. **Start with the entry point** — read `custom-instructions.md` for global policies and the taxonomy used across instruction files.
2. **Consult this index** — the tables below categorize each instruction set so you can zero in on the right one.
3. **Open the domain file** — every instruction file lives under `.github/instructions/` and should reference only this index and `custom-instructions.md` via metadata.
4. **Use See Also sections** — related topics belong in the See Also area inside each instruction file; they keep the reference graph acyclic.

## Instruction Catalog

| Area | Key Files | When to Use | Aligns With |
| --- | --- | --- | --- |
| Block Theme Development | `block-theme-development.instructions.md`, `theme-json.instructions.md`, `html-markup.instructions.md` | When building templates, patterns, or any block-driven UI inside a theme | Block-first rollout, theme.json design, semantic markup |
| AI & Agent Operations | `agent-spec.instructions.md`, `copilot-ai-agent.instructions.md`, `generate-theme.instructions.md` | When writing agent specs, relying on a Copilot-style assistant, or generating themes from the scaffold | Automation guidelines, Mustache placeholders, prompt-validation |
| Coding Standards & Naming | `javascript.instructions.md`, `naming-conventions.instructions.md`, `wpcs-php.instructions.md`, `wpcs-css.instructions.md` | When modifying PHP, JS, CSS, or naming anything (files, classes, patterns) | WordPress coding standards, component naming rules |
| Planning & Reporting | `planning.instructions.md`, `reporting.instructions.md`, `release.instructions.md`, `release-scaffold.instructions.md` | When planning work, generating milestone reports, or running a release (scaffold vs generated-theme) | Release playbooks, reporting practices, scaffold vs generated release boundaries |
| Security & Localization | `a11y.instructions.md`, `i18n.instructions.md`, `security-nonce.instructions.md` | When ensuring accessibility, translation readiness, or nonce/security context | WCAG 2.2 AA, translation/localization, nonce handling |
| Developer Reference | `instructions.instructions.md`, `README.md` | When authoring new instruction files or reading the repository-wide instruction conventions | Instruction author guide, README-driven summaries |

> **Tip:** This index focuses on discovery. The linked files contain the details and validation steps you need for each domain.

## Reference Structure
```
custom-instructions.md (Tier 1 entry point)
  ↓
_index.instructions.md (Tier 2 navigator)
  ↓
*.instructions.md topic files (Tier 3 subjects)
```
- Tier 3 files should only reference `custom-instructions.md` and `_index.instructions.md` in their metadata.
- Keep other links in body sections such as `
