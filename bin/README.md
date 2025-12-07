---
title: Binary Scripts
description: Build and utility scripts
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

# Build Scripts

This directory contains build and generation scripts for the block theme scaffold.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Scripts["Build Scripts"]
        Generate["generate-theme.js<br/>Theme Generator"]
        Build["build.js<br/>Build Orchestrator"]
        WPTests["install-wp-tests.sh<br/>Test Environment"]
    end

    subgraph Actions["Script Actions"]
        Copy["Copy Scaffold"]
        Replace["Replace Placeholders"]
        Init["Initialize Project"]
        Compile["Compile Assets"]
        Dist["Create Distribution"]
    end

    Generate --> Copy
    Generate --> Replace
    Build --> Init
    Build --> Compile
    Build --> Dist
    WPTests --> Init
```

## Scripts

### `test-placeholders.js`

**New!** Centralized test placeholder values for mustache variables. Enables linting and testing of scaffold templates.

**Module Usage:**

```javascript
const {
    testPlaceholders,
    replacePlaceholders,
    isScaffoldMode,
} = require('./bin/test-placeholders');

// Replace placeholders in content
const processedContent = replacePlaceholders(templateContent);

// Check if in scaffold mode
if (isScaffoldMode('package.json')) {
    // Use dry-run linting
}
```

**CLI Usage:**

```bash
# Check if in scaffold mode
node bin/test-placeholders.js check package.json

# Get a specific placeholder value
node bin/test-placeholders.js get "{{theme_slug}}"

# List all placeholder keys
node bin/test-placeholders.js list

# Output all as JSON
node bin/test-placeholders.js json
```

See [Lint Dry-Run Documentation](../docs/LINT-DRY-RUN.md) for details.

### `lint-dry-run.js`

Runs linting with test placeholder values, enabling code quality checks on scaffold templates.

**Usage:**

```bash
# Run full linting with test values
node bin/lint-dry-run.js

# Or via npm script
npm run lint:dry-run
```

This script:

- Creates temporary directory with processed files
- Runs JavaScript, CSS, and PHP linting
- Cleans up automatically
- Used by pre-commit hook in scaffold mode

See [Lint Dry-Run Documentation](../docs/LINT-DRY-RUN.md) for details.

### `generate-theme.js`

Generates a new theme from the scaffold template by replacing mustache placeholders with provided values.

**Usage:**

```bash
node bin/generate-theme.js \
  --slug my-theme \
  --name "My Theme" \
  --description "A custom block theme" \
  --author "Your Name" \
  --author_uri "https://example.com" \
  --version "1.0.0"
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `--slug` | Yes | Theme slug (kebab-case) |
| `--name` | No | Theme display name |
| `--description` | No | Theme description |
| `--author` | No | Author name |
| `--author_uri` | No | Author website URL |
| `--version` | No | Theme version |

### `build.js`

Orchestrates the build process for the generated theme.

**Commands:**

```bash
# Initialize project (install dependencies)
node bin/build.js init

# Build assets for production
node bin/build.js build

# Build with stats for bundle analyzer
node bin/build.js build --stats

# Create distribution ZIP
node bin/build.js dist

# Run all checks (lint, test)
node bin/build.js check

# Run performance checks
node bin/build.js performance
```

### `install-wp-tests.sh`

Sets up the WordPress test environment for PHPUnit testing.

**Usage:**

```bash
./bin/install-wp-tests.sh <db-name> <db-user> <db-pass> [db-host] [wp-version]
```

**Example:**

```bash
./bin/install-wp-tests.sh wordpress_test root '' localhost latest
```

## Script Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    A["1. Generate Theme"] --> B["2. Initialize"]
    B --> C["3. Develop"]
    C --> D["4. Build"]
    D --> E["5. Test"]
    E --> F["6. Distribute"]

    subgraph Generate["generate-theme.js"]
        A
    end

    subgraph BuildJS["build.js"]
        B
        D
        F
    end
```

## Related Documentation

- [Theme Generation Guide](../docs/GENERATE-THEME.md)
- [Build Process](../docs/BUILD-PROCESS.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
