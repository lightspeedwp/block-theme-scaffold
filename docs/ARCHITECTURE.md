# Repository Architecture & Structure

## Overview

This document defines the repository structure, folder conventions, and architectural principles for the block theme scaffold project. It serves as the authoritative reference for organizing code, tests, documentation, and generated artifacts.

## Core Principles

1. **Separation of Concerns**: Code, tests, documentation, and artifacts are logically separated
2. **Exclusivity by Purpose**: Each folder has a specific, well-defined purpose
3. **Clear Hierarchy**: Folder structure reflects logical organization and dependencies
4. **Distribution-Aware**: Folders are intentionally included or excluded from distribution
5. **Developer Experience**: Clear organization reduces cognitive load and onboarding time

## Directory Structure

```
block-theme-scaffold/
├── src/                      # Source code (excluded from dist)
│   ├── js/                   # JavaScript source files
│   │   ├── editor.js         # Editor enhancements
│   │   ├── theme.js          # Frontend functionality
│   │   └── blocks/           # Custom block scripts
│   ├── css/                  # SCSS/CSS source files
│   │   ├── style.scss        # Main stylesheet
│   │   ├── editor.scss       # Editor styles
│   │   └── blocks/           # Block-specific styles
│   └── README.md             # Source directory documentation
│
├── build/                    # Compiled/built assets (included in dist)
│   ├── js/                   # Compiled JavaScript
│   ├── css/                  # Compiled CSS
│   ├── images/               # Optimized images
│   └── fonts/                # Font files
│
├── inc/                      # PHP include files (included in dist)
│   ├── block-patterns.php    # Block pattern registration
│   ├── block-styles.php      # Block style registration
│   ├── template-functions.php # Template utility functions
│   ├── nonce.php             # Security nonce utilities
│   ├── deprecation.php       # Deprecated function handling
│   └── README.md             # PHP code documentation
│
├── patterns/                 # Block patterns PHP files (included in dist)
│   ├── header.php
│   ├── footer.php
│   ├── hero.php
│   └── README.md
│
├── parts/                    # Template parts HTML (included in dist)
│   ├── header.html
│   ├── footer.html
│   ├── sidebar.html
│   └── README.md
│
├── templates/                # Full page templates HTML (included in dist)
│   ├── index.html
│   ├── single.html
│   ├── archive.html
│   └── README.md
│
├── styles/                   # Global styles definitions (included in dist)
│   ├── dark.json
│   ├── blocks/
│   └── README.md
│
├── languages/                # Internationalization files (included in dist)
│   ├── {{theme_slug}}.pot    # Translation template
│   ├── {{theme_slug}}-en_US.json
│   └── README.md
│
├── tests/                    # Test files (excluded from dist)
│   ├── bootstrap.php         # PHPUnit bootstrap
│   ├── test-*.php            # PHP unit tests
│   ├── js/                   # JavaScript tests
│   ├── e2e/                  # End-to-end tests
│   └── README.md
│
├── bin/                      # Build & utility scripts (excluded from dist)
│   ├── build.js
│   ├── generate-theme.js
│   ├── lint-dry-run.js
│   ├── test-placeholders.js
│   └── install-wp-tests.sh
│
├── logs/                     # Application logs (excluded from dist, gitignored)
│   ├── lint/                 # Linter output logs
│   ├── test/                 # Test execution logs
│   ├── build/                # Build process logs
│   └── agents/               # AI agent execution logs
│
├── tmp/                      # Temporary files (excluded from dist, gitignored)
│   ├── .lint-temp/           # Temporary lint test files
│   ├── build-cache/          # Build cache
│   └── placeholder-temp/     # Placeholder processing cache
│
├── reports/                  # Generated reports (excluded from dist, gitignored)
│   ├── coverage/             # Code coverage reports
│   ├── performance/          # Lighthouse & performance reports
│   ├── bundle-analysis/      # Webpack bundle analysis
│   ├── test-results/         # Test execution reports
│   └── agents/               # AI agent analysis reports
│
├── docs/                     # Documentation (excluded from dist)
│   ├── ARCHITECTURE.md       # This file - repository structure
│   ├── README.md             # Documentation index
│   ├── BUILD_PROCESS.md
│   ├── HUSKY_PRECOMMIT.md
│   ├── GOVERNANCE.md         # Governance & policies
│   ├── FOLDER_STRUCTURE.md   # Folder conventions & naming
│   ├── LOGGING.md            # Logging standards & conventions
│   ├── config/               # Tool configuration docs
│   └── API_REFERENCE.md
│
├── .github/                  # GitHub specific files (excluded from dist)
│   ├── workflows/
│   ├── agents/
│   ├── instructions/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── README.md
│
├── .husky/                   # Git hooks (excluded from dist)
│   ├── pre-commit
│   └── README.md
│
├── vendor/                   # PHP Composer dependencies (excluded from dist)
├── node_modules/             # NPM dependencies (excluded from dist)
│
├── theme.json                # Theme configuration (included in dist)
├── functions.php             # Theme setup (included in dist)
├── style.css                 # Theme header (included in dist)
├── package.json              # Project manifest (excluded from dist)
├── composer.json             # PHP manifest (excluded from dist)
├── webpack.config.js         # Build config (excluded from dist)
├── jest.config.js            # Test config (excluded from dist)
├── phpunit.xml               # PHP test config (excluded from dist)
│
├── .distignore               # Distribution exclude list
├── .gitignore                # Git exclude list
├── README.md                 # Project overview
├── CHANGELOG.md              # Version history
├── CONTRIBUTING.md           # Contribution guidelines
├── VERSION                   # Version file
└── LICENSE                   # License

```

## Folder Descriptions

### Distribution-Included Folders

These folders are packaged in the final theme distribution:

| Folder | Purpose | Status |
|--------|---------|--------|
| `build/` | Compiled & optimized assets | Included ✓ |
| `inc/` | PHP backend functionality | Included ✓ |
| `patterns/` | Block pattern definitions | Included ✓ |
| `parts/` | Reusable template parts | Included ✓ |
| `templates/` | Full page templates | Included ✓ |
| `styles/` | Global style definitions | Included ✓ |
| `languages/` | Translation files | Included ✓ |

### Distribution-Excluded Folders

These folders are NOT packaged in the final theme (development & testing only):

| Folder | Purpose | Status |
|--------|---------|--------|
| `src/` | Source code pre-compilation | Excluded ✗ |
| `tests/` | Test files & test suites | Excluded ✗ |
| `bin/` | Build scripts & utilities | Excluded ✗ |
| `docs/` | Documentation & guides | Excluded ✗ |
| `.github/` | GitHub workflows & config | Excluded ✗ |
| `.husky/` | Git hooks | Excluded ✗ |
| `node_modules/` | NPM dependencies | Excluded ✗ |
| `vendor/` | Composer dependencies | Excluded ✗ |

### Temporary & Excluded Folders

These folders contain runtime artifacts and are gitignored:

| Folder | Purpose | Gitignored | Distignored |
|--------|---------|-----------|------------|
| `logs/` | Application/process logs | ✓ Yes | ✓ Yes |
| `tmp/` | Temporary working files | ✓ Yes | ✓ Yes |
| `reports/` | Generated analysis reports | ✓ Yes | ✓ Yes |

## Logging Architecture

### Log Organization

Logs are organized in `logs/` by process type and date:

```
logs/
├── lint/
│   ├── 2025-12-07-lint-dry-run.log
│   ├── 2025-12-07-eslint.log
│   └── 2025-12-07-stylelint.log
├── test/
│   ├── 2025-12-07-jest.log
│   ├── 2025-12-07-phpunit.log
│   └── 2025-12-07-e2e.log
├── build/
│   ├── 2025-12-07-webpack.log
│   └── 2025-12-07-build.log
└── agents/
    ├── 2025-12-07-theme-generator.log
    └── 2025-12-07-build-agent.log
```

### Log Format

Each log file should include:

```
[TIMESTAMP] [LEVEL] [PROCESS] [MESSAGE]
[2025-12-07T10:30:45.123Z] [INFO] [lint-dry-run] Starting lint dry-run
[2025-12-07T10:30:46.456Z] [INFO] [lint-dry-run] JavaScript linting: ✓ passed
[2025-12-07T10:30:47.789Z] [ERROR] [lint-dry-run] CSS linting: ✗ failed (3 errors)
```

### Log Rotation

Logs older than 30 days should be automatically archived or removed. Configuration in each tool's script.

## Reports Architecture

### Report Organization

Reports are organized in `reports/` by type and date:

```
.github/reports/
├── coverage/
│   ├── 2025-12-07-js-coverage.html
│   ├── 2025-12-07-php-coverage.html
│   └── coverage-summary.json
├── performance/
│   ├── 2025-12-07-lighthouse.json
│   ├── 2025-12-07-lighthouse.html
│   └── performance-trends.json
├── bundle-analysis/
│   ├── 2025-12-07-bundle-report.html
│   └── bundle-stats.json
├── test-results/
│   ├── 2025-12-07-jest-results.json
│   ├── 2025-12-07-phpunit-results.xml
│   └── test-summary.html
└── agents/
    ├── 2025-12-07-theme-generator.json
    ├── 2025-12-07-build-analysis.json
    └── agent-metrics.json
```

## Temporary Files Architecture

### Temp Organization

Temporary files are organized in `tmp/` by process:

```
tmp/
├── .lint-temp/               # Lint dry-run temporary files
│   ├── package.json
│   ├── src/
│   └── [processed scaffold files]
├── build-cache/              # Build cache & intermediate files
│   ├── webpack-cache/
│   └── babel-cache/
└── placeholder-temp/         # Placeholder processing cache
    └── [interpolated templates]
```

## Naming Conventions

### Log Files

Format: `{process-name}-{date}-{sequence}.log` or `{date}-{process-name}.log`

Examples:

- `2025-12-07-lint-dry-run.log`
- `jest-2025-12-07-001.log`
- `build-process-2025-12-07.log`

### Report Files

Format: `{date}-{report-type}.{extension}` or `{report-type}-{date}.{extension}`

Examples:

- `2025-12-07-lighthouse.json`
- `coverage-report-2025-12-07.html`
- `bundle-analysis-2025-12-07.json`

### Temporary Files

Format: `.{process}-temp/` or `{process}-temp-{timestamp}/`

Examples:

- `.lint-temp/`
- `build-cache-1701949200000/`
- `placeholder-temp-{uuid}/`

## Governance & Policy Folders

All governance-related documentation lives in `docs/`:

| Document | Purpose |
|----------|---------|
| `GOVERNANCE.md` | Policies, rules, and decision-making |
| `FOLDER-STRUCTURE.md` | Folder conventions & naming rules |
| `LOGGING.md` | Logging standards & best practices |
| `ARCHITECTURE.md` | This file - structural overview |
| `.github/instructions/` | Copilot & agent instructions |

## Distribution Files

### .distignore

The `.distignore` file defines what's excluded from distribution:

```
# Development & build tools
src/
tests/
bin/
.github/
.husky/
node_modules/
vendor/

# Documentation
docs/

# Temporary & logs
logs/
tmp/
.github/reports/

# Config & manifest files
package.json
composer.json
webpack.config.js
jest.config.js
phpunit.xml
```

### .gitignore

The `.gitignore` file defines what's excluded from version control:

```
# Runtime directories
logs/
tmp/
.github/reports/

# Dependencies
node_modules/
vendor/

# Build output (keep as artifact in git during dev)
/public
/dist
build/

# System files
.DS_Store
Thumbs.db
```

## Continuous Integration Workflows

Workflows in `.github/workflows/` use these folders:

```yaml
- Logs output: `logs/{workflow-name}/`
- Reports: `reports/{report-type}/`
- Temporary: `tmp/{workflow-name}-{run-id}/`
```

Example workflow:

```yaml
name: Build & Test

jobs:
  build:
    steps:
      - name: Run tests
        run: npm run test:js 2>&1 | tee logs/test/$(date +%Y-%m-%d)-jest.log

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: reports/coverage/
```

## File Permissions

### Executable Files

Scripts in `bin/` should be executable:

```bash
chmod +x bin/*.js
chmod +x bin/*.sh
```

### Log Files

Log directories should be writable:

```bash
chmod 755 logs/
chmod 755 tmp/
chmod 755 reports/
```

## Integration with Tools

### ESLint & Prettier

- Source: `src/js/`
- Config: `.eslintrc.js`, `prettier.config.js`
- Logs: `logs/lint/`
- Reports: `reports/`

### Jest (JavaScript Tests)

- Tests: `tests/js/`
- Config: `jest.config.js`
- Logs: `logs/test/`
- Reports: `reports/test-results/`

### PHPUnit (PHP Tests)

- Tests: `tests/php/`
- Config: `phpunit.xml`
- Logs: `logs/test/`
- Reports: `reports/test-results/`

### Webpack (Build)

- Source: `src/`
- Output: `build/`
- Config: `webpack.config.js`
- Cache: `tmp/build-cache/`
- Logs: `logs/build/`
- Reports: `reports/bundle-analysis/`

### Playwright (E2E Tests)

- Tests: `tests/e2e/`
- Config: `playwright.config.js`
- Logs: `logs/test/`
- Reports: `reports/test-results/`

## Scaffolding New Features

When adding new features, follow this structure:

```
feature-name/
├── src/
│   ├── js/feature.js
│   └── css/feature.scss
├── inc/
│   └── feature-functions.php
├── patterns/
│   └── feature.php
├── tests/
│   ├── test-feature.php
│   └── test-feature.js
└── docs/
    └── FEATURE.md
```

## Related Documentation

- [Folder Structure & Naming](./FOLDER_STRUCTURE.md) - Detailed conventions
- [Logging Standards](./LOGGING.md) - Log format & implementation
- [Governance](./GOVERNANCE.md) - Rules & policies
- [Contributing](../CONTRIBUTING.md) - How to contribute

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Initial architecture documentation |
| 2025-12-07 | Added logs/, tmp/, reports/ folders |
| 2025-12-07 | Integrated governance documentation |
