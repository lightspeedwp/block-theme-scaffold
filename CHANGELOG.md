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

- **PHP Naming Convention Standardization**: All theme functions and hooks now use `{{theme_slug|phpCase}}` placeholder filter for consistent snake_case naming
  - Updated `functions.php` - theme setup, asset enqueue, and utility functions
  - Updated `inc/block-patterns.php` - pattern registration functions
  - Updated `inc/block-styles.php` - block style registration functions  
  - Updated `inc/template-functions.php` - template helper functions
  - All function names now follow WordPress coding standards (e.g., `my_theme_setup()` instead of `my-theme_setup()`)

- **Asset Handle Unification**: Standardized all asset handles to use `{{theme_slug}}` prefix
  - Style handles: `{{theme_slug}}-style`, `{{theme_slug}}-editor-style`
  - Script handles: `{{theme_slug}}-script`, `{{theme_slug}}-editor-script`
  - Image size names: `{{theme_slug}}-featured`, `{{theme_slug}}-thumbnail`, `{{theme_slug}}-gallery`

- **Theme Generator Improvements**: Enhanced placeholder replacement system in `scripts/generate-theme.js`
  - Added support for multiple filter types: `upper`, `snakeCase`, `phpCase`, `pascalCase`, `camelCase`
  - Consolidated placeholder replacement into single-pass regex for better performance
  - Improved error handling and validation for theme slug and author URI
  - Better error messages for invalid inputs
  - Protocol validation for author URIs (must start with http:// or https://)

- **theme.json Structure Updates**: Improved typography configuration
  - Font families now use proper object structure with `slug`, `fontFamily`, and `name` properties
  - Changed from array of strings to array of objects for better WordPress compatibility
  - Removed redundant top-level `color` setting

- **Test Suite Modernization**: Updated all PHPUnit tests to reflect new naming conventions
  - Updated test discovery to use `Test_` prefix in `phpunit.xml`
  - Fixed block style registry method calls to use `get_registered_styles_for_block()`
  - Updated theme.json version assertion from 2 to 3
  - Aligned test structure with WordPress coding standards

### Added

- **New Placeholder Variables**:
  - `{{logo_width}}` - Logo width dimension (default: 250)
  - `{{logo_height}}` - Logo height dimension (default: 100)
  - `{{archive_excerpt_length}}` - Excerpt length for archive/listing pages (default: 40)
  - `{{content_width_num}}` - Numeric content width without units

- **Schema Enhancements**: Added `archive_excerpt_length` configuration option
  - Type: integer, default: 40, range: 20-200
  - Controls excerpt length specifically for archive and listing pages

- **Documentation Improvements**: Enhanced `.github/README.md`
  - Clearer installation instructions
  - Multiple theme generation methods (Interactive, CLI, JSON)
  - Available scripts reference
  - Prerequisites section
  - Better structure and organization

### Fixed

- **Content Width Type Bug**: Fixed critical bug where `$GLOBALS['content_width']` was incorrectly set as string instead of integer
  - Changed from `'{{content_width_px}}'` to `{{content_width_num}}`
  - Now properly passes integer value to WordPress for embed/media width calculations
  - Fixes PHPUnit test assertions for `assertIsInt($content_width)`

- **Placeholder Type Consistency**: Improved type handling in theme generator
  - Added string coercion for `content_width_num` calculation to prevent errors when config value is numeric
  - Better handling of missing or invalid placeholder values

- Automated mustache variable registry scan, update, and reporting:
  - Recursively scans all source, config, and documentation files for `{{mustache}}` variables.
  - Compares discovered variables to the canonical registry (`scripts/mustache-variables-registry.json`).
  - Auto-updates the registry to add new variables (with placeholder metadata), remove missing ones, and update changed entries.
  - Generates a dated validation report in `.github/reports/validation/` summarizing new, removed, updated, and unchanged variables.
  - Ensures all changes are tracked and reported for auditability and theme generation integrity.
  - Registry and report update is fully automated and non-interactive, supporting continuous validation workflows.
  - Husky pre-commit hooks and CI workflows now validate registry and report consistency before commit.

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

- Changelog updated on 2025-12-19 to document recent improvements to mustache variable registry scan, update, and reporting, and to clarify validation/reporting workflow for continuous integration.

- Updated mustache variable registry and validation report as of 2025-12-18 scan:
  - Registry date updated to `2025-12-18T00:00:00Z`.
  - No new, missing, or changed variables detected in this scan; registry is current.
  - Validation report generated at `.github/reports/validation/2025-12-18-mustache-registry-scan.json`.
  - Improved documentation and traceability for mustache variable management.

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
  - `theme-config.template.json` moved to `scripts/fixtures/`
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
- Schema relationship documentation in `validate-config-schema.js`
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
