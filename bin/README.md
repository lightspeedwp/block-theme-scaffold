---
title: Binary Scripts
description: Build and utility scripts
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

# Build Scripts

This directory contains the WordPress test installation script. Other build and utility scripts have been moved to the `scripts/` directory for better organization.

## Scripts in This Directory

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

## Scripts in `scripts/` Directory

The following scripts have been organized in the `scripts/` directory:

- **[test-placeholders.js](../scripts/test-placeholders.js)** - Centralized test placeholder values for mustache variables
- **[lint-dry-run.js](../scripts/lint-dry-run.js)** - Dry-run linting with test values
- **[generate-theme.js](../scripts/generate-theme.js)** - Theme generation from scaffold
- **[build.js](../scripts/build.js)** - Build orchestrator
- **[audit-frontmatter.js](../scripts/audit-frontmatter.js)** - Frontmatter audit utilities
- **[generate-theme.agent.js](../scripts/generate-theme.agent.js)** - Generate theme agent
- **[block-theme-build.agent.js](../scripts/block-theme-build.agent.js)** - Build agent
- **[agent-script.js](../scripts/agent-script.js)** - Generic agent script
- **[dry-run-test.js](../scripts/dry-run-test.js)** - Dry-run test runner

See [scripts/README.md](../scripts/README.md) for detailed documentation on each script.

## Related Documentation

- [Scripts Directory](../scripts/README.md)
- [Theme Generation Guide](../docs/GENERATE_THEME.md)
- [Build Process](../docs/BUILD_PROCESS.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
