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

### Added

- Complete Phase 6 integration testing for logging and schema validation system
- Missing mustache variables: `year`, `excerpt_length`, `thumbnail_width`, `thumbnail_height`, `featured_image_width`, `featured_image_height`, `gallery_image_width`, `gallery_image_height`
- Support for mustache filter syntax (e.g., `{{theme_slug|upper}}`)
- **Dedicated scaffold release workflow** (`.github/workflows/release-scaffold.yml`) for validating scaffold releases
- **Schema validation step** in scaffold release process (`npm run test:schema`)
- **Phase 1 cleanup verification** in release workflows
- **Generation logging verification** in release workflows
- **Mustache placeholder checks** in generated theme release workflow
- **Workflow safeguards** preventing generated theme workflows from running in scaffold repository:
  - `release.yml` verifies no scaffold files exist and `{{theme_name}}` has been replaced
- **Organized agent script system**:
  - New `scripts/agents/` directory for all agent JavaScript implementations
  - `template.agent.js` - Template for creating new agent scripts
  - `template.agent.test.js` - Template for creating agent test suites
  - `release-scaffold.agent.js` - Dedicated scaffold release validation agent
  - NPM scripts for scaffold release validation:
    - `npm run release:scaffold:validate`
    - `npm run release:scaffold:report`
    - `npm run release:scaffold:placeholders`
    - `npm run release:scaffold:schema`
  - `agent-release.yml` verifies no scaffold files exist
  - Both exit with clear error messages if run in scaffold repository
- **Comprehensive testing documentation**:
  - **Jest testing instructions** (`.github/instructions/jest-tests.instructions.md`):
    - Complete guide for writing and running Jest tests
    - Explains all four test directories (scripts, dry-run, agents, lib)
    - Test patterns, mocking strategies, and best practices
    - Coverage configuration and debugging instructions
  - **Playwright E2E testing instructions** (`.github/instructions/playwright-tests.instructions.md`):
    - End-to-end testing with Playwright and @wordpress/e2e-test-utils-playwright
    - Accessibility testing with axe-playwright (WCAG 2.1 AA compliance)
    - WordPress-specific test patterns and utilities
    - Debugging tools and test report generation
  - **PHPUnit testing instructions** (`.github/instructions/phpunit-tests.instructions.md`):
    - PHP unit testing with PHPUnit 9.0+ and WordPress test suite
    - WordPress Coding Standards (WPCS 3.0) integration
    - PHPCompatibility checks for PHP 7.4+
    - Code coverage reporting and linting instructions
- **Comprehensive test coverage improvements**:
  - **scripts/lib/\*\*tests\*\*/**: Created test directory for library modules
    - `logger.test.js` - Tests for theme generation logging module (15 tests)
    - Moved `config-schema.test.js` from scripts/\*\*tests\*\*/
    - Moved `mode-detector.test.js` from scripts/\*\*tests\*\*/
  - **scripts/agents/\*\*tests\*\*/**: Organized agent test directory
    - `release-scaffold.agent.test.js` - Comprehensive scaffold release validation tests (new)
    - Moved `block-theme-build.agent.test.js` from scripts/\*\*tests\*\*/
    - Moved `development-assistant.agent.test.js` from scripts/ root
  - **scripts/validation/\*\*tests\*\*/**: Created validation test suite
    - `validate-theme-json.test.js` - Theme JSON schema validation tests (new)
    - `validate-agent-frontmatter.test.js` - Agent frontmatter validation tests (new)
    - `validate-mustache-registry.test.js` - Mustache variable registry tests (new)
    - `test-mustache-schema.test.js` - Mustache schema structure tests (new)

### Changed

- Documented script helper coverage improvements: `scripts/__tests__/jest.config.js` now anchors `<rootDir>` at the repo root, locks `roots` to the scripts tree, reuses CSS/file mocks from `tests/__mocks__`, routes coverage into `coverage/scripts`, and emits V8 reports that feed `coverage/scripts/lcov.info`.
- Generator now excludes `scripts/` and `logs/` directories from generated themes
- **Release process separation**: scaffold releases use `release-scaffold.agent.md` and `release-scaffold.yml`, generated themes use `release.agent.md` and `release.yml`
- **Enhanced scaffold release validation**: includes schema validation, generation smoke test, and Phase 1 cleanup verification
- **RELEASE_PROCESS.md now templated**: contains `{{mustache}}` placeholders for generated themes
- **RELEASE_PROCESS_SCAFFOLD.md updated**: includes schema validation and enhanced smoke test steps
- **Reorganized agent scripts**: all agent JavaScript files moved from `scripts/*.agent.js` to `scripts/agents/*.agent.js`
- **Updated all NPM script references** to use new `scripts/agents/` paths
- **Updated workflow references** in `.github/workflows/agent-*.yml` to use new paths
- **Generator Phase 1 cleanup** now includes `scripts/agents/release-scaffold.agent.js` in deletion list
- **Moved configuration files to logical locations**:
  - `dryrun-debug.log` moved to `logs/` (already ignored by .gitignore)
  - `theme-config.template.json` moved to `.github/schemas/examples/`
  - Updated all references in documentation and scripts
  - Updated `.gitignore` to include all example JSON files in schemas

### Fixed

- Theme generation now properly replaces all mustache variables including date, content, and image size variables
- Generator no longer copies scaffold build scripts to generated themes, preventing syntax errors
- Mustache filter syntax `{{theme_slug|upper}}` now correctly transforms to uppercase with underscores (e.g., `MY_THEME_SLUG`)

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
