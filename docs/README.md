---
title: Documentation Index
description: Comprehensive documentation index and navigation guide
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

Comprehensive documentation for the {{theme_name}} block theme scaffold.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Getting["Getting Started"]
        Generate["GENERATE-THEME.md<br/>Theme Generation"]
        Setup["SETUP-SUMMARY.md<br/>Setup Overview"]
    end

    subgraph Development["Development"]
        Build["BUILD-PROCESS.md<br/>Build System"]
        Source["SRC-FOLDER-STRUCTURE.md<br/>Source Files"]
        I18n["INTERNATIONALIZATION.md<br/>Translations"]
    end

    subgraph Tools["Tools & Configuration"]
        WPScripts["WP-SCRIPTS-*.md<br/>wp-scripts Docs"]
        ToolConfigs["TOOL-CONFIGS.md<br/>Tool Overview"]
        Config["config/<br/>Detailed Configs"]
    end

    Generate --> Setup
    Setup --> Build
    Build --> Source
    Source --> I18n
    WPScripts --> ToolConfigs
    ToolConfigs --> Config
```

## Quick Start

New to this scaffold? Start here:

1. 📖 [Theme Generation Guide](./GENERATE_THEME.md) - How to create a theme from this scaffold
2. 🎯 [Setup Summary](./SETUP-SUMMARY.md) - Overview of what's configured
3. 🏗️ [Build Process](./BUILD_PROCESS.md) - Understanding the build system
4. 📚 [API Reference](./API_REFERENCE.md) - Complete API documentation

## Documentation Structure

### Getting Started

| Document | Description |
|----------|-------------|
| [GENERATE_THEME.md](./GENERATE_THEME.md) | Complete guide to generating a theme from this scaffold |
| [SETUP-SUMMARY.md](./SETUP-SUMMARY.md) | Overview of completed setup tasks and configurations |

### Development Guides

| Document | Description |
|----------|-------------|
| [BUILD_PROCESS.md](./BUILD_PROCESS.md) | Complete build process documentation with webpack, Babel, and asset compilation |
| [SRC-FOLDER-STRUCTURE.md](./SRC-FOLDER-STRUCTURE.md) | Source directory structure and file organization |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Translation and localization guide |
| [LINTING.md](./LINTING.md) | Linting standards and lint dry-run mode with scaffold variables |
| [HUSKY_PRECOMMIT.md](./HUSKY_PRECOMMIT.md) | Automatic pre-commit linting with scaffold mode detection |
| [TESTING.md](./TESTING.md) | Testing standards and test execution patterns |
| [VALIDATION.md](./VALIDATION.md) | Validation commands and quick reference |

### wp-scripts Documentation

Detailed documentation for `@wordpress/scripts` build system:

| Document | Description |
|----------|-------------|
| [WP-SCRIPTS-SUMMARY.md](./WP-SCRIPTS-SUMMARY.md) | Overview of wp-scripts configuration and features |
| [WP-SCRIPTS-CONFIGURATION.md](./WP-SCRIPTS-CONFIGURATION.md) | Complete configuration guide for wp-scripts |
| [WP-SCRIPTS-QUICK-REFERENCE.md](./WP-SCRIPTS-QUICK-REFERENCE.md) | Quick reference for common commands and patterns |

### Tool Configuration

| Document | Description |
|----------|-------------|
| [TOOL-CONFIGS.md](./TOOL-CONFIGS.md) | Overview of all development tools and their purposes |
| [config/](./config/) | Detailed configuration guides for individual tools |

### Security & Best Practices

| Document | Description |
|----------|-------------|
| [SECURITY-NONCE.md](./SECURITY-NONCE.md) | Nonce utilities for secure AJAX and form handling |
| [SECURITY-HEADERS.md](./SECURITY-HEADERS.md) | Security headers and content security policies |
| [DEPRECATION.md](./DEPRECATION.md) | Deprecation workflow for functions and hooks |

### Governance & Architecture

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Repository structure and architectural overview |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Folder organization and naming conventions |
| [LOGGING.md](./LOGGING.md) | Logging standards and implementation guide |
| [REPORTING.md](./REPORTING.md) | Report generation, organization, and management |
| [GOVERNANCE.md](./GOVERNANCE.md) | Project policies and decision-making rules |

**For AI Agents & Contributors:**

- [AI Agent Instructions](../.github/instructions/copilot-ai-agent.instructions.md) - Guidelines for Copilot and AI agents
- [Naming Conventions Instructions](../.github/instructions/naming-conventions.instructions.md) - File/folder naming rules with examples

### Performance & Quality

| Document | Description |
|----------|-------------|
| [PERFORMANCE.md](./PERFORMANCE.md) | Performance monitoring with Lighthouse CI and bundle analysis |
| [API_REFERENCE.md](./API_REFERENCE.md) | Complete API reference for PHP and JavaScript |

## Configuration Files

The `config/` directory contains detailed documentation for each tool:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Build["Build Tools"]
        Webpack["webpack.md"]
        Babel["babel.md"]
        PostCSS["postcss.md"]
    end

    subgraph Quality["Code Quality"]
        ESLint["eslint.md"]
        Stylelint["stylelint.md"]
        Prettier["prettier.md"]
        NPMLint["npm-package-json-lint.md"]
    end

    subgraph Testing["Testing Tools"]
        Jest["jest.md"]
        Playwright["playwright.md"]
    end

    Build --> Quality
    Quality --> Testing
```

### Available Configuration Guides

- [babel.md](./config/babel.md) - Babel transpilation configuration
- [eslint.md](./config/eslint.md) - JavaScript linting rules
- [jest.md](./config/jest.md) - JavaScript testing configuration
- [npm-package-json-lint.md](./config/npm-package-json-lint.md) - Package.json validation
- [playwright.md](./config/playwright.md) - End-to-end testing setup
- [postcss.md](./config/postcss.md) - CSS processing and optimization
- [prettier.md](./config/prettier.md) - Code formatting rules
- [stylelint.md](./config/stylelint.md) - CSS/SCSS linting configuration
- [webpack.md](./config/webpack.md) - Module bundling configuration

## Common Tasks

### Development Workflow

```bash
# Install dependencies
npm install

# Start development server with watch mode
npm run start

# Build for production
npm run build
```

### Code Quality

```bash
# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Lint with test values (for scaffold development)
npm run lint:dry-run

# Format all files
npm run format

# Run all linters
npm run lint
```

### Testing

```bash
# Run all tests
npm run test

# JavaScript unit tests
npm run test:js

# End-to-end tests
npm run test:e2e

# PHP tests
npm run test:php
```

### Internationalization

```bash
# Generate .pot file for translations
npm run makepot

# Generate JSON translations for JavaScript
npm run make-json
```

## Development Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
sequenceDiagram
    participant Dev as Developer
    participant Files as Source Files
    participant Build as Build System
    participant Tests as Tests
    participant WP as WordPress

    Dev->>Files: Edit src/ files
    Files->>Build: npm run start (watch mode)
    Build->>Build: Compile & Bundle
    Build->>WP: Output to build/
    Dev->>Tests: npm run test
    Tests->>Dev: Test results
    Dev->>Build: npm run build (production)
    Build->>WP: Optimized build/
    WP->>Dev: Theme ready
```

## Build System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Source["Source Files (src/)"]
        JS["JavaScript<br/>.js"]
        CSS["Stylesheets<br/>.scss"]
        Assets["Assets<br/>images, fonts"]
    end

    subgraph Build["Build Process"]
        Babel["Babel<br/>ES6+ → ES5"]
        Webpack["Webpack<br/>Bundle"]
        Sass["Sass<br/>SCSS → CSS"]
        PostCSS["PostCSS<br/>Optimize"]
    end

    subgraph Output["Build Output (build/)"]
        JSOut["theme.js<br/>editor.js"]
        CSSOut["style.css<br/>editor.css"]
        AssetOut["Optimized Assets"]
    end

    JS --> Babel
    Babel --> Webpack
    CSS --> Sass
    Sass --> PostCSS
    Assets --> Webpack
    Webpack --> JSOut
    PostCSS --> CSSOut
    Webpack --> AssetOut
```

## Theme Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Core["Core Files"]
        ThemeJSON["theme.json<br/>Theme Configuration"]
        Functions["functions.php<br/>Theme Setup"]
        StyleCSS["style.css<br/>Theme Header"]
    end

    subgraph Templates["Templates"]
        TemplateFiles["templates/<br/>index.html, etc."]
        Parts["parts/<br/>header.html, footer.html"]
        Patterns["patterns/<br/>Block Patterns"]
    end

    subgraph Assets["Compiled Assets"]
        BuildCSS["build/css/<br/>Stylesheets"]
        BuildJS["build/js/<br/>JavaScript"]
        BuildAssets["build/<br/>Images, Fonts"]
    end

    subgraph PHP["PHP Files"]
        Inc["inc/<br/>Theme Functions"]
        BlockPatterns["inc/block-patterns.php"]
        BlockStyles["inc/block-styles.php"]
    end

    ThemeJSON --> TemplateFiles
    Functions --> Inc
    Inc --> BlockPatterns
    Inc --> BlockStyles
    TemplateFiles --> Parts
    Parts --> Patterns
    BuildCSS --> TemplateFiles
    BuildJS --> TemplateFiles
```

## Prerequisites

- **Node.js**: 18.0+ and npm 9.0+
- **PHP**: 8.0+
- **WordPress**: 6.4+
- **Composer**: 2.0+ (for PHP dependencies)

## Support Resources

### Official WordPress Documentation

- [Block Theme Handbook](https://developer.wordpress.org/themes/block-themes/)
- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Theme Developer Handbook](https://developer.wordpress.org/themes/)
- [@wordpress/scripts Documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)

### WordPress Packages

- [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts)
- [@wordpress/eslint-plugin](https://www.npmjs.com/package/@wordpress/eslint-plugin)
- [@wordpress/stylelint-config](https://www.npmjs.com/package/@wordpress/stylelint-config)

## Contributing

When contributing to this scaffold:

1. Follow WordPress coding standards
2. Update relevant documentation
3. Test with the generation script
4. Ensure all linters pass
5. Update version numbers appropriately

## License

This scaffold is licensed under {{license}}. Generated themes inherit this license unless modified.

## Related Documentation

- [Main README](../README.md) - Repository root documentation
- [Source Directory](../src/README.md) - Source files documentation
- [Tests Directory](../tests/README.md) - Testing documentation
- [Build Scripts](../bin/README.md) - Build script documentation
