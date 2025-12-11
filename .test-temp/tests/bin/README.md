---
title: Tests
description: Test files and test configuration
category: Testing
type: Index
audience: Developers
date: 2025-12-01
---

# Build Script Tests

This directory contains tests for the build and generation scripts.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Scripts["Build Scripts"]
        Build["build.js"]
        Generate["generate-theme.js"]
    end

    subgraph Tests["Test Files"]
        BuildTest["build.test.js"]
        GenerateTest["generate-theme.test.js"]
    end

    Build --> BuildTest
    Generate --> GenerateTest
```

## Test Files

### `build.test.js`

Tests for the build orchestration script.

**What it tests:**

- Build initialization
- Asset compilation
- Distribution package creation
- Dependency checking

### `generate-theme.test.js`

Tests for the theme generation script.

**What it tests:**

- Theme scaffold creation
- Placeholder replacement
- File copying
- Directory structure validation

## Running Tests

```bash
# Run all tests
npm run test:js

# Run specific test file
npm run test:js -- build.test.js

# Watch mode
npm run test:js:watch
```

## Test Structure

```javascript
describe('build.js', () => {
    describe('init command', () => {
        it('installs npm dependencies', () => {
            // Test implementation
        });

        it('installs composer dependencies', () => {
            // Test implementation
        });
    });

    describe('build command', () => {
        it('compiles assets', () => {
            // Test implementation
        });
    });
});
```

## Related Documentation

- [Build Scripts](../../bin/README.md)
- [Jest Configuration](../../docs/config/jest.md)
- [Tests Overview](../README.md)
