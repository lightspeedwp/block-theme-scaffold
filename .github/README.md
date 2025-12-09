---
title: GitHub Configuration
description: GitHub-specific configuration and workflow files
category: Project
type: Index
audience: Developers
date: 2025-12-01
---

# GitHub Configuration

This directory contains GitHub-specific configuration files for the {{theme_name}} theme.

## Contents

- **agents/** - AI agent configurations for automated development tasks
- **instructions/** - Development instructions and guidelines for AI tools
- **projects/** - Active Copilot projects and in-progress work
- **prompts/** - Reusable prompt templates for AI-assisted development
- **reports/** - Completed task reports and validation outcomes
- **schemas/** - JSON schemas and configuration templates
- **workflows/** - GitHub Actions CI/CD workflow definitions
- `copilot-tasks.md` - Copilot task definitions and specifications
- `custom-instructions.md` - Custom AI instructions for Copilot

## Documentation

Permanent user-facing documentation is stored in the [docs/](../docs/) folder. See [docs/FILE_ORGANIZATION.md](../docs/FILE_ORGANIZATION.md) for the complete file organization guide.

## Workflows

| Workflow | Description |
|----------|-------------|
| `ci-cd.yml` | Main CI/CD pipeline (lint, test, security audit, E2E) |
| `code-quality.yml` | Code coverage, quality gates, bundle analysis |
| `deploy-wporg.yml` | Automated WordPress.org theme directory deployment |
| `release.yml` | Version bumping, changelog generation, releases |

## Purpose

These files enable:

- Automated build and test workflows
- Code coverage tracking with Codecov
- Quality gates for PRs
- AI-assisted development with context-specific instructions
- Consistent code review and quality checks
- Automated release and deployment processes
- WordPress.org theme directory deployment

## Usage

These files are automatically used by GitHub Actions and compatible AI development tools. They are excluded from theme distribution packages via `.distignore`.
