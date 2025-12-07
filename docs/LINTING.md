---
title: Linting Standards & Practices
description: Comprehensive guide to linting for WordPress block theme development
category: Development
type: Guide
audience: Developers, Contributors
date: 2025-12-07
---

# Linting Standards & Practices

## Overview

This document defines linting standards, practices, and tools for the block theme scaffold. It covers JavaScript, CSS, PHP linting, and special considerations for scaffold templates with mustache variables.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Linting Tools](#linting-tools)
- [Lint Dry-Run Mode](#lint-dry-run-mode)
- [JavaScript Linting](#javascript-linting)
- [CSS/SCSS Linting](#cssscss-linting)
- [PHP Linting](#php-linting)
- [Package.json Linting](#packagejson-linting)
- [Pre-Commit Hooks](#pre-commit-hooks)
- [CI/CD Integration](#cicd-integration)
- [Logging](#logging)
- [Troubleshooting](#troubleshooting)

## Quick Reference

### Available Commands

```bash
# Run all linters
npm run lint

# Lint with auto-fix
npm run lint:js:fix
npm run lint:css:fix
npm run lint:php:fix

# Individual linters
npm run lint:js           # ESLint
npm run lint:css          # Stylelint
npm run lint:php          # PHP_CodeSniffer
npm run lint:pkg-json     # package.json validation

# Scaffold-specific (with placeholder replacement)
npm run lint:dry-run      # Test scaffold files before generation
```

### When to Use What

| Scenario | Command | Notes |
|----------|---------|-------|
| **Regular development** | `npm run lint` | Standard linting |
| **Before commit** | Automatic via Husky | Pre-commit hook |
| **Scaffold development** | `npm run lint:dry-run` | Replaces placeholders first |
| **CI/CD pipeline** | `npm run lint` | With logging enabled |
| **Quick fixes** | `npm run lint:js:fix` | Auto-fix minor issues |

## Linting Tools

### Tool Stack

| Tool | Purpose | Config File | Documentation |
|------|---------|-------------|---------------|
| **ESLint** | JavaScript linting | `.eslintrc.js` | [docs/config/eslint.md](./config/eslint.md) |
| **Stylelint** | CSS/SCSS linting | `.stylelintrc.js` | [docs/config/stylelint.md](./config/stylelint.md) |
| **PHP_CodeSniffer** | PHP linting | `phpcs.xml` | [docs/config/phpcs.md](./config/phpcs.md) |
| **wp-scripts** | WordPress tooling | `package.json` | [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts) |

### Installation

All linting tools are installed automatically:

```bash
# Node dependencies
npm install

# PHP dependencies (Composer)
composer install
```

## Lint Dry-Run Mode

### Overview

The **lint dry-run mode** is a special feature for scaffold template development. It allows you to run full linting on the scaffold theme template without generating a complete theme first. This is useful for development and continuous integration testing of the scaffold itself.

**New in this version**: The pre-commit hook now automatically detects scaffold mode and uses dry-run linting, so you can commit changes to the scaffold without manual intervention.

### Purpose

The **lint dry-run mode** temporarily replaces mustache variables with test values, runs all linters, then cleans up.

### Problem It Solves

This scaffold theme uses mustache variables (e.g., `{{theme_slug}}`, `{{theme_name}}`) throughout the codebase. These placeholders prevent standard linting tools from running successfully because they create invalid syntax in JSON, JavaScript, and other files.

The dry-run script temporarily replaces all mustache variables with valid test values, runs the linters, and then cleans up.

### Why It's Needed

Scaffold files contain placeholders like `{{theme_name}}`, `{{namespace}}`, `{{slug}}` which cause linting errors:

```javascript
// ❌ This fails linting (invalid syntax)
const themeName = '{{theme_name}}';

// ✅ After dry-run replacement
const themeName = 'Test Theme Name';
```

### How It Works

```mermaid
flowchart LR
    A[Scaffold Files] --> B[Copy to .lint-temp/]
    B --> C[Replace Placeholders]
    C --> D[Run Linters]
    D --> E[Clean Up]
    E --> F[Report Results]

    style A fill:#e3f2fd
    style F fill:#c8e6c9
```

### Usage

```bash
# Run lint dry-run
npm run lint:dry-run

# What it does:
# 1. Creates .lint-temp/ directory
# 2. Copies scaffold files
# 3. Replaces {{placeholders}} with test values
# 4. Runs ESLint, Stylelint, PHP_CodeSniffer
# 5. Removes .lint-temp/ directory
# 6. Logs all operations to logs/lint/YYYY-MM-DD-lint-dry-run.log
```

### Automatic Mode (Pre-commit Hook)

The pre-commit hook automatically detects whether you're working in scaffold mode or with a generated theme:

```bash
# Just commit normally - the hook handles everything
git add .
git commit -m "Your commit message"

# In scaffold mode: Uses lint:dry-run automatically
# In generated theme: Uses standard linting
```

### Manual Testing

```bash
# Run full dry-run linting manually
npm run lint:dry-run

# Check if in scaffold mode
node bin/test-placeholders.js check package.json

# Get a specific placeholder value
node bin/test-placeholders.js get "{{theme_slug}}"

# List all placeholder keys
node bin/test-placeholders.js list

# Output all placeholders as JSON
node bin/test-placeholders.js json
```

### What Gets Tested

The dry-run lints:

- **JavaScript**: All files in `src/js/` using WordPress Scripts ESLint config
- **CSS/SCSS**: All files in `src/css/` using WordPress Scripts Stylelint config
- **PHP**: All PHP files using PHPCS with WordPress Coding Standards

### Placeholder Replacement

Test values used during dry-run:

```javascript
{
  theme_name: 'Test Theme Name',
  theme_slug: 'test-theme-slug',
  theme_uri: 'https://example.com/test-theme',
  description: 'Test theme description',
  version: '1.0.0',
  author: 'Test Author',
  author_uri: 'https://example.com',
  namespace: 'TestNamespace',
  slug: 'test-slug',
  textdomain: 'test-textdomain',
  // ... see bin/test-placeholders.js for full list
}
```

### Implementation Details

The lint dry-run script (`bin/lint-dry-run.js`) implements:

#### File Copying & Replacement

```javascript
function copyAndReplace(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    // Recursively copy directories
    // Skip: node_modules, vendor, build, .git, .lint-temp
  } else {
    // For text files: replace placeholders
    // For binary files: copy as-is
    const textExtensions = ['.js', '.json', '.php', '.css', '.md', '.txt', '.html'];
    if (textExtensions.includes(path.extname(src))) {
      let content = fs.readFileSync(src, 'utf8');
      content = replacePlaceholders(content);
      fs.writeFileSync(dest, content);
    }
  }
}
```

#### Linting Execution

```javascript
// JavaScript linting
execSync('npx wp-scripts lint-js', { cwd: tempDir });

// CSS linting
execSync('npx wp-scripts lint-style', { cwd: tempDir });

// PHP linting (from original dir - needs composer)
execSync('composer run lint', { cwd: scaffoldDir });
```

#### Cleanup

```javascript
// Automatic cleanup on:
// - Normal completion
// - Error
// - Process exit (SIGINT, SIGTERM)
function cleanup() {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
```

### Logging

All dry-run operations are logged:

```log
[2025-12-07T10:30:45.123Z] [INFO] [lint-dry-run] Starting lint dry-run...
[2025-12-07T10:30:45.234Z] [DEBUG] [lint-dry-run] Cleaning up any existing temporary files
[2025-12-07T10:30:45.345Z] [INFO] [lint-dry-run] Creating temporary test files...
[2025-12-07T10:30:46.456Z] [DEBUG] [lint-dry-run] Copied: package.json
[2025-12-07T10:30:46.567Z] [DEBUG] [lint-dry-run] Copied: src
[2025-12-07T10:30:47.678Z] [INFO] [lint-dry-run] Temporary files created
[2025-12-07T10:30:47.789Z] [INFO] [lint-dry-run] Running linters...
[2025-12-07T10:30:48.890Z] [INFO] [lint-dry-run] JavaScript linting started
[2025-12-07T10:30:50.000Z] [INFO] [lint-dry-run] JavaScript linting: ✓ passed
[2025-12-07T10:30:50.111Z] [INFO] [lint-dry-run] CSS linting started
[2025-12-07T10:30:51.222Z] [INFO] [lint-dry-run] CSS linting: ✓ passed
[2025-12-07T10:30:51.333Z] [INFO] [lint-dry-run] PHP linting started
[2025-12-07T10:30:52.444Z] [INFO] [lint-dry-run] PHP linting: ✓ passed
[2025-12-07T10:30:52.555Z] [INFO] [lint-dry-run] Lint dry-run complete
[2025-12-07T10:30:52.666Z] [DEBUG] [lint-dry-run] Cleaning up temporary files
[2025-12-07T10:30:52.777Z] [INFO] [lint-dry-run] Cleaned up temporary files
```

Log files: `logs/lint/YYYY-MM-DD-lint-dry-run.log`

### When to Use Lint Dry-Run

✅ **Use lint dry-run when:**

- Developing scaffold templates
- Adding new mustache variables
- Testing scaffold generation workflow
- Debugging placeholder-related linting issues
- Contributing to scaffold development

❌ **Don't use lint dry-run for:**

- Generated theme development (use `npm run lint`)
- Regular code changes
- Production builds
- CI/CD pipelines (unless testing scaffold)

### Customising Test Values

To customise the test values used during dry-run:

1. Open [bin/test-placeholders.js](../bin/test-placeholders.js)
2. Modify the `testPlaceholders` object
3. Save and run `npm run lint:dry-run`

Example:

```javascript
const testPlaceholders = {
    '{{theme_slug}}': 'my-custom-slug',
    '{{primary_color}}': '#ff0000',
    // ... other values
};
```

The changes will automatically be used by:

- `npm run lint:dry-run`
- `.husky/pre-commit` hook
- Any future testing tools that import the module

### Pre-commit Hook Behaviour

#### Scaffold Mode Detection

The pre-commit hook automatically detects scaffold mode by checking if `package.json` contains mustache variables:

```bash
# Hook checks this
node bin/test-placeholders.js check package.json

# Returns exit code 0 (true) if scaffold mode
# Returns exit code 1 (false) if generated theme
```

#### Scaffold Mode (Automatic Dry-Run)

When mustache variables are detected:

```
🔍 Scaffold mode detected - using dry-run linting...

📁 Creating temporary test files...
✓ Temporary files created

🔍 Running linters...
→ JavaScript linting: ✓
→ CSS linting: ✓
→ PHP linting: ✓

✅ All scaffold pre-commit checks passed!
```

#### Generated Theme Mode (Standard Linting)

When no mustache variables are detected:

```
🔍 Generated theme mode detected - running standard linting...

🟡 Linting JavaScript...
✓ JavaScript linting passed

🟡 Linting CSS...
✓ CSS linting passed

🟡 Linting PHP...
✓ PHP linting passed

🔒 Running security audit...
✓ No high or critical vulnerabilities

✅ All pre-commit checks passed!
```

#### Bypassing the Hook

If you need to bypass the pre-commit hook (not recommended):

```bash
git commit --no-verify -m "Your message"
```

### API Reference

#### test-placeholders.js Module

```javascript
const {
    testPlaceholders,        // Object with all test values
    replacePlaceholders,     // Function to replace placeholders in text
    isScaffoldMode,          // Function to detect scaffold mode
    getPlaceholder,          // Get a specific placeholder value
    getPlaceholderKeys,      // Get array of all keys
    getAllPlaceholders,      // Get copy of all placeholders
} = require('./bin/test-placeholders');
```

#### CLI Usage

```bash
# Check scaffold mode (exit code 0 = scaffold, 1 = generated)
node bin/test-placeholders.js check [path/to/package.json]

# Get specific placeholder value
node bin/test-placeholders.js get "{{theme_slug}}"

# List all placeholder keys
node bin/test-placeholders.js list

# Output all as JSON
node bin/test-placeholders.js json
```

### CI/CD Integration (Scaffold)

You can use dry-run linting in GitHub Actions or other CI systems:

```yaml
- name: Run lint dry-run
  run: npm run lint:dry-run
```

This allows you to catch linting issues in the scaffold template before they're propagated to generated themes.

### Limitations

1. **Doesn't modify source files**: The dry-run only tests in a temporary copy. To fix actual source files, use the individual `lint:*:fix` commands.
2. **PHP linting still uses original directory**: Since PHP linting requires Composer dependencies, it runs from the original directory.
3. **Not a replacement for full theme generation**: This is for scaffold development only. Always generate and test a full theme before release.
4. **Pre-commit hook requires Node.js**: The scaffold detection uses Node.js, so ensure it's available in your Git environment.

## JavaScript Linting

### ESLint Configuration

Based on `@wordpress/eslint-plugin` with custom rules.

**Config file:** `.eslintrc.js`

```javascript
module.exports = {
  extends: ['plugin:@wordpress/eslint-plugin/recommended'],
  rules: {
    // Custom rules
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // ... see .eslintrc.js for complete configuration
  }
};
```

### Running ESLint

```bash
# Lint JavaScript files
npm run lint:js

# Auto-fix issues
npm run lint:js:fix

# Lint specific file
npx eslint src/js/theme.js

# Lint with output to log
npm run lint:js 2>&1 | tee logs/lint/$(date +%Y-%m-%d)-eslint.log
```

### Common ESLint Rules

| Rule | Severity | Description |
|------|----------|-------------|
| `no-console` | warn | Console statements in production |
| `no-unused-vars` | error | Unused variables |
| `no-undef` | error | Undefined variables |
| `quotes` | error | Single quotes (WordPress standard) |
| `semi` | error | Semicolons required |
| `indent` | error | Tab indentation |

### ESLint Ignores

```javascript
// .eslintignore (or in package.json)
node_modules/
vendor/
build/
.lint-temp/
```

## CSS/SCSS Linting

### Stylelint Configuration

Based on `@wordpress/stylelint-config` with SCSS support.

**Config file:** `.stylelintrc.js`

```javascript
module.exports = {
  extends: ['@wordpress/stylelint-config/scss'],
  rules: {
    // Custom rules
    'selector-class-pattern': null, // Allow BEM naming
    'no-descending-specificity': null,
    // ... see .stylelintrc.js for complete configuration
  }
};
```

### Running Stylelint

```bash
# Lint CSS/SCSS files
npm run lint:css

# Auto-fix issues
npm run lint:css:fix

# Lint specific file
npx stylelint src/css/style.scss

# Lint with output to log
npm run lint:css 2>&1 | tee logs/lint/$(date +%Y-%m-%d)-stylelint.log
```

### Common Stylelint Rules

| Rule | Severity | Description |
|------|----------|-------------|
| `color-hex-length` | error | Short hex colors (#fff) |
| `declaration-block-no-duplicate-properties` | error | No duplicate properties |
| `selector-max-specificity` | warning | Specificity limit |
| `property-no-unknown` | error | Unknown CSS properties |
| `unit-no-unknown` | error | Unknown CSS units |

### BEM Naming Convention

```scss
// ✅ Good - BEM methodology
.wp-block-card {}
.wp-block-card__title {}
.wp-block-card__content {}
.wp-block-card--featured {}

// ❌ Bad - Generic names
.card {}
.title {}
```

## PHP Linting

### PHP_CodeSniffer Configuration

Based on WordPress Coding Standards.

**Config file:** `phpcs.xml`

```xml
<ruleset name="Block Theme Scaffold">
  <config name="minimum_supported_wp_version" value="6.0"/>
  <rule ref="WordPress"/>
  <rule ref="WordPress-Core"/>
  <rule ref="WordPress-Docs"/>
  <rule ref="WordPress-Extra"/>
</ruleset>
```

### Running PHPCS

```bash
# Lint PHP files
npm run lint:php

# Auto-fix issues
npm run lint:php:fix

# Using Composer directly
composer run lint
composer run lint:fix

# Lint specific file
./vendor/bin/phpcs --standard=phpcs.xml inc/template-functions.php

# Lint with output to log
npm run lint:php 2>&1 | tee logs/lint/$(date +%Y-%m-%d)-php-lint.log
```

### Common PHPCS Rules

| Rule | Description |
|------|-------------|
| `WordPress.NamingConventions.PrefixAllGlobals` | Prefix all global functions/classes |
| `WordPress.Security.EscapeOutput` | Escape all output |
| `WordPress.Security.NonceVerification` | Verify nonces for forms |
| `WordPress.WP.I18n` | Proper internationalization |
| `WordPress.PHP.YodaConditions` | Yoda conditions for comparisons |

### PHP Linting Best Practices

```php
// ✅ Good - Prefixed, escaped, i18n
function bts_get_theme_name() {
    return esc_html__( '{{theme_name}}', '{{textdomain}}' );
}

// ❌ Bad - No prefix, no escape, no i18n
function get_theme_name() {
    return '{{theme_name}}';
}
```

## Package.json Linting

Validate package.json structure and dependencies:

```bash
# Lint package.json
npm run lint:pkg-json

# What it checks:
# - Valid JSON syntax
# - Required fields present
# - Dependency versions valid
# - Script definitions correct
```

## Pre-Commit Hooks

### Husky Configuration

Linting runs automatically before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": ["npm run lint:js:fix", "git add"],
    "*.{css,scss}": ["npm run lint:css:fix", "git add"],
    "*.php": ["composer run lint:fix", "git add"]
  }
}
```

### What Happens on Commit

1. Husky detects git commit
2. lint-staged identifies changed files
3. Runs appropriate linters with auto-fix
4. Stages fixed files
5. Allows commit if no errors
6. Blocks commit if errors exist

### Bypass Pre-Commit (Emergency)

```bash
# Skip pre-commit hooks (use sparingly!)
git commit --no-verify -m "Emergency commit"
```

## CI/CD Integration

### GitHub Actions Workflow

Linting runs in CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    name: Code Quality & Linting
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Lint JavaScript
        run: npm run lint:js | tee logs/lint/$(date +%Y-%m-%d)-eslint.log
      - name: Lint CSS
        run: npm run lint:css | tee logs/lint/$(date +%Y-%m-%d)-stylelint.log
      - name: Lint PHP
        run: npm run lint:php | tee logs/lint/$(date +%Y-%m-%d)-php-lint.log
      - name: Upload lint logs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: lint-logs
          path: logs/lint/
```

### CI/CD Logging

All linting operations are logged:

```bash
# Logs saved to:
logs/lint/YYYY-MM-DD-eslint.log
logs/lint/YYYY-MM-DD-stylelint.log
logs/lint/YYYY-MM-DD-php-lint.log
```

## Logging

### Log Format

All linting operations use consistent logging:

```
[TIMESTAMP] [LEVEL] [PROCESS] [MESSAGE]
```

Example:

```log
[2025-12-07T10:30:45.123Z] [INFO] [eslint] Starting JavaScript linting
[2025-12-07T10:30:46.234Z] [ERROR] [eslint] src/js/theme.js:10:5 - Unexpected console statement
[2025-12-07T10:30:47.345Z] [INFO] [eslint] JavaScript linting complete - 1 error, 0 warnings
```

### Log Levels

- `[DEBUG]` - Detailed diagnostic information
- `[INFO]` - General informational messages
- `[WARN]` - Warning messages (non-blocking)
- `[ERROR]` - Error messages (blocking)
- `[FATAL]` - Critical failures

### Log Files

```
logs/lint/
├── YYYY-MM-DD-lint-dry-run.log   # Dry-run operations
├── YYYY-MM-DD-eslint.log         # JavaScript linting
├── YYYY-MM-DD-stylelint.log      # CSS linting
└── YYYY-MM-DD-php-lint.log       # PHP linting
```

### Viewing Logs

```bash
# View today's lint logs
cat logs/lint/$(date +%Y-%m-%d)-*.log

# Find all errors
grep -r "\[ERROR\]" logs/lint/

# Count errors by type
grep "\[ERROR\]" logs/lint/*.log | wc -l

# View with context
grep -B2 -A2 "\[ERROR\]" logs/lint/$(date +%Y-%m-%d)-eslint.log
```

## Troubleshooting

### Common Issues

#### 1. Placeholder Linting Errors

**Problem:** Linting fails with syntax errors on `{{placeholders}}`

**Solution:** Use lint dry-run mode:

```bash
npm run lint:dry-run
```

#### 2. ESLint Configuration Not Found

**Problem:** `Error: Cannot find module '@wordpress/eslint-plugin'`

**Solution:**

```bash
npm install
npm run lint:js
```

#### 3. PHP_CodeSniffer Not Found

**Problem:** `phpcs: command not found`

**Solution:**

```bash
composer install
npm run lint:php
```

#### 4. Pre-Commit Hook Fails

**Problem:** Commit blocked by pre-commit hook

**Solution:**

```bash
# Fix linting errors first
npm run lint:js:fix
npm run lint:css:fix
npm run lint:php:fix

# Then commit
git add .
git commit -m "Your message"
```

#### 5. Temporary Files Not Cleaned

**Problem:** `.lint-temp/` directory remains after dry-run

**Solution:**

```bash
# Manual cleanup
rm -rf .lint-temp/

# Check for process locks
ps aux | grep lint-dry-run
```

### Debug Mode

Enable verbose logging:

```bash
# ESLint debug
DEBUG=eslint:* npm run lint:js

# Stylelint debug
DEBUG=stylelint:* npm run lint:css

# PHP_CodeSniffer verbose
./vendor/bin/phpcs -v inc/
```

## Best Practices

### Development Workflow

1. **Write code** following standards
2. **Run linters** before committing

   ```bash
   npm run lint
   ```

3. **Fix auto-fixable issues**

   ```bash
   npm run lint:js:fix
   npm run lint:css:fix
   npm run lint:php:fix
   ```

4. **Manually fix** remaining issues
5. **Commit** (pre-commit hook runs automatically)

### Scaffold Development Workflow

1. **Write scaffold code** with `{{placeholders}}`
2. **Run lint dry-run** to test

   ```bash
   npm run lint:dry-run
   ```

3. **Check logs** for issues

   ```bash
   cat logs/lint/$(date +%Y-%m-%d)-lint-dry-run.log
   ```

4. **Fix issues** in scaffold files
5. **Re-test** until clean
6. **Commit** scaffold changes

### Code Quality Checklist

- [ ] All linters pass (`npm run lint`)
- [ ] No console statements in production code
- [ ] All output is escaped (PHP)
- [ ] All text is translatable (i18n)
- [ ] Functions/classes are prefixed
- [ ] BEM naming for CSS classes
- [ ] No hardcoded values (use variables)
- [ ] Comments for complex logic
- [ ] Accessibility attributes present

## Related Documentation

### Process Guides

- [VALIDATION.md](./VALIDATION.md) - Quick validation command reference for all tools
- [TESTING.md](./TESTING.md) - Testing guide and examples
- [WORKFLOWS.md](./WORKFLOWS.md) - CI/CD workflows including linting jobs
- [BUILD_PROCESS.md](./BUILD_PROCESS.md) - Build system (which includes formatting)
- [LOGGING.md](./LOGGING.md) - Logging standards for linting output

### Configuration & Governance

- [GOVERNANCE.md](./GOVERNANCE.md) - Project policies and standards
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Naming conventions
- [GENERATE_THEME.md](./GENERATE_THEME.md) - Theme generation with mustache variables

### Tool Configuration Details

- [docs/config/eslint.md](./config/eslint.md) - ESLint configuration
- [docs/config/stylelint.md](./config/stylelint.md) - Stylelint configuration
- [docs/config/phpcs.md](./config/phpcs.md) - PHP_CodeSniffer configuration

## Related Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | Run all linters (fails on scaffold with mustache variables) |
| `npm run lint:dry-run` | Run all linters with test values (use for scaffold) |
| `npm run lint:js` | ESLint (JavaScript) |
| `npm run lint:js:fix` | Auto-fix JavaScript linting issues |
| `npm run lint:css` | Stylelint (CSS/SCSS) |
| `npm run lint:css:fix` | Auto-fix CSS linting issues |
| `npm run lint:php` | PHP_CodeSniffer (PHP) |
| `npm run lint:php:fix` | Auto-fix PHP linting issues |
| `npm run lint:pkg-json` | Validate package.json |
| `composer run lint` | Direct PHP_CodeSniffer command |
| `composer run lint:fix` | Direct PHPCS auto-fix command |
| `node bin/generate-theme.js` | Generate a complete theme from scaffold |
| `node bin/test-placeholders.js check` | Check if in scaffold mode |
| `node bin/test-placeholders.js get` | Get specific placeholder value |
| `node bin/test-placeholders.js list` | List all placeholder keys |
| `node bin/test-placeholders.js json` | Output all placeholders as JSON |
| `git commit` | Commit changes (pre-commit hook handles linting automatically) |
| `git commit --no-verify` | Bypass pre-commit hook (not recommended) |

## Version History

| Date | Change |
|------|--------|
| 2025-12-07 | Merged LINT-DRY-RUN.md into LINTING.md with comprehensive dry-run documentation |
| 2025-12-07 | Added API reference and related commands sections |
| 2025-12-07 | Initial linting standards documentation with lint dry-run feature |
