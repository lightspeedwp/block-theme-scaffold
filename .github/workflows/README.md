---
title: Workflows Directory
description: CI/CD workflow automation and configuration
category: Project
type: Index
audience: Developers
date: 2025-12-01
---

# GitHub Actions Workflows

This directory contains GitHub Actions workflow definitions for CI/CD automation.

## Workflows

| Workflow | Description |
|----------|-------------|
| **block-theme-build-and-e2e.yml** | Build and end-to-end testing workflow |
| **code-quality.yml** | Code coverage, bundle analysis, and quality metrics |
| **deploy-wporg.yml** | WordPress.org theme directory deployment |
| **release.yml** | Automated release management and changelog generation |

## Purpose

These workflows automate:

- Building theme assets on push/PR
- Running automated tests (unit, integration, E2E)
- Code quality checks (linting, formatting)
- Code coverage collection and reporting (Codecov)
- Bundle size analysis and tracking
- Theme version management and releases
- WordPress.org theme directory deployment

## Workflow Details

### code-quality.yml

Code quality metrics and analysis:

- Test coverage with Codecov integration
- Bundle size analysis with size limits
- Lint result summaries

### deploy-wporg.yml

WordPress.org theme directory deployment:

- Triggered on GitHub releases
- SVN sync to WordPress.org
- Asset and screenshot updates

### release.yml

Automated release management:

- Semantic versioning
- Changelog generation
- GitHub release creation

## Triggers

| Trigger | Workflows |
|---------|-----------|
| Push to main/develop | code-quality.yml |
| Pull request | code-quality.yml |
| Release published | deploy-wporg.yml |
| Manual dispatch | release.yml |

## Configuration

Required repository secrets:

- `CODECOV_TOKEN` - Codecov upload token
- `SVN_USERNAME` - WordPress.org SVN username
- `SVN_PASSWORD` - WordPress.org SVN password

## Usage

GitHub Actions automatically executes these workflows based on configured triggers. Check individual workflow files for specific configuration details.
