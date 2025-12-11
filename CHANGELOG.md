---
title: Changelog
description: Release history and version changes
category: Project
type: Reference
audience: Users, Developers
date: 2025-12-01
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Placeholder for upcoming changes

## [1.0.0] - 2025-12-11

### Added

- Initial theme scaffold with mustache templates
- Full Site Editing support
- Block patterns and template parts
- Style variations (dark mode)
- Modern build pipeline with Webpack
- Automated testing (PHP, JS, CSS, E2E)
- CI/CD workflows
- GitHub Copilot integration
- Security headers and best practices
- JSON Schema validation for theme configuration files
- Theme configuration template file (`theme-config.template.json`)
- VS Code JSON schema integration for autocomplete and validation
- Schema relationship documentation in `config-schema.js`
- Configuration template usage guide in documentation
- Sidebar template part and blog-with-sidebar template for layout flexibility
- Husky pre-commit workflow to run linting and testing automatically
- Release automation/reporting assets to support the new agent workflows

### Changed

- Enhanced `scripts/generate-theme.js` with JSON Schema validation
- Improved URL sanitization to prevent false positives on valid URLs
- Updated `.gitignore` to exclude user config files while preserving template

### Deprecated

- N/A

### Removed

- N/A
- Converted templates and parts to a pattern-based architecture
- Modernized theme generation with validation, documentation improvements, and repo cleanup
- Brought styles and theme setup in line with WordPress 6.9 requirements
- Reorganized documentation into `docs/` and consolidated governance/instruction files

### Fixed

- Fixed URL validation in `sanitizeInput()` to properly handle https:// URLs
- Restored AI tool configuration files under `.github/` and tightened `.distignore` to exclude dev artifacts
- Stabilized tests and JavaScript utilities while refining configuration defaults

### Documentation

- Added security headers
- Implemented proper escaping and sanitization
- Added JSON Schema validation for configuration files
- Added DEVELOPMENT guide, generator system documentation, and README coverage across project folders
- Applied consistent frontmatter to `.github` docs to standardize metadata

[Unreleased]: https://github.com/lightspeedwp/block-theme-scaffold/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lightspeedwp/block-theme-scaffold/releases/tag/v1.0.0
