# Husky Pre-commit Integration

## Overview

The pre-commit hook has been enhanced to automatically detect whether you're working in **scaffold mode** (with mustache variables) or **generated theme mode**, and run the appropriate linting strategy.

## How It Works

```mermaid
flowchart TD
    A[Git Commit] --> B{Check Mode}
    B -->|Has {{mustache}}| C[Scaffold Mode]
    B -->|No {{mustache}}| D[Generated Theme]
    C --> E[Run lint:dry-run]
    D --> F[Run standard lint]
    E --> G{Pass?}
    F --> H{Pass?}
    G -->|Yes| I[✅ Commit]
    G -->|No| J[❌ Block Commit]
    H -->|Yes| I
    H -->|No| J
```

## Scaffold Mode Detection

The hook uses `bin/test-placeholders.js` to check if `package.json` contains mustache variables:

```bash
node bin/test-placeholders.js check package.json
# Exit code 0 = scaffold mode
# Exit code 1 = generated theme mode
```

## What Gets Tested

### Scaffold Mode (Automatic)

When working on the scaffold itself:

```text
🔍 Scaffold mode detected - using dry-run linting...

📁 Creating temporary test files...
✓ Temporary files created

🔍 Running linters...
→ JavaScript linting
→ CSS linting
→ PHP linting

✅ All scaffold pre-commit checks passed!
```

- JavaScript files (ESLint + Prettier)
- CSS/SCSS files (Stylelint)
- PHP files (PHPCS + WordPress Standards)
- No security audit (since package.json has placeholders)

### Generated Theme Mode (Standard)

When working on a generated theme:

```text
🔍 Generated theme mode detected - running standard linting...

🟡 Linting JavaScript...
✓ JavaScript linting passed

🟡 Linting CSS...
✓ CSS linting passed

🟡 Linting PHP...
✓ PHP linting passed

🔒 Running security audit...
✓ No vulnerabilities detected

✅ All pre-commit checks passed!
```

- All standard linting
- Full security audit with `npm audit`

## Bypassing the Hook

If you need to commit without running checks (not recommended):

```bash
git commit --no-verify -m "Your message"
```

## Configuration Files

| File | Purpose |
|------|---------|
| [.husky/pre-commit](../.husky/pre-commit) | Main hook that detects mode and routes to appropriate linter |
| [bin/test-placeholders.js](../bin/test-placeholders.js) | Core module for scaffold detection and test values |
| [bin/lint-dry-run.js](../bin/lint-dry-run.js) | Dry-run linting implementation for scaffold mode |
| [package.json](../package.json) | Contains `lint:dry-run` npm script |

## Troubleshooting

### Hook Not Running

```bash
# Reinstall hooks
npx husky install

# Make hook executable
chmod +x .husky/pre-commit

# Verify hook is present
ls -la .husky/pre-commit
```

### Wrong Mode Detected

```bash
# Check what mode is detected
node bin/test-placeholders.js check package.json

# Should output:
# "true" for scaffold mode
# "false" for generated theme mode
```

### Linting Fails

```bash
# Run the appropriate linter manually
npm run lint:dry-run  # For scaffold
npm run lint          # For generated theme

# Auto-fix common issues
npm run lint:js:fix
npm run lint:css:fix
composer run lint:fix
```

## Integration with CI/CD

For GitHub Actions or other CI systems:

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linting (auto-detects mode)
        run: |
          if node bin/test-placeholders.js check package.json; then
            npm run lint:dry-run
          else
            npm run lint
          fi
```

## Benefits

1. **Zero Configuration**: Developers don't need to remember which lint command to use
2. **Consistent Quality**: Both scaffold and generated themes maintain code quality
3. **Faster Development**: No need to generate a theme just to test changes
4. **CI-Ready**: Same logic works in pre-commit and CI pipelines
5. **Type Safety**: Prevents commits with unresolved linting issues

## See Also

- [Lint Dry-Run Documentation](./LINTING.md#lint-dry-run-mode) - Detailed dry-run documentation
- [Test Placeholders](../bin/test-placeholders.js) - Core placeholder module
- [Contributing Guidelines](../CONTRIBUTING.md) - General contribution guidelines
