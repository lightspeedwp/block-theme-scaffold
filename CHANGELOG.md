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

- Placeholder for future changes

## [1.0.0] - 2025-12-10

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

### Changed

- Enhanced `scripts/generate-theme.js` with JSON Schema validation
- Improved URL sanitization to prevent false positives on valid URLs
- Updated `.gitignore` to exclude user config files while preserving template

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- Fixed URL validation in `sanitizeInput()` to properly handle https:// URLs

### Security

- Added security headers
- Implemented proper escaping and sanitization
- Added JSON Schema validation for configuration files

[Unreleased]: https://github.com/lightspeedwp/block-theme-scaffold/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lightspeedwp/block-theme-scaffold/releases/tag/v1.0.0
