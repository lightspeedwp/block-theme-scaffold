# Husky Pre-commit Integration

## Overview

The pre-commit hook automatically runs **linting and tests** before allowing commits. It intelligently detects whether you're working in **scaffold mode** (with mustache variables) or **generated theme mode**, and runs the appropriate checks.

## How It Works

```mermaid
flowchart TD
    A[Git Commit] --> B{Check Mode}
    B -->|Has {{mustache}}| C[Scaffold Mode]
    B -->|No {{mustache}}| D[Generated Theme]
    C --> E[Run lint:dry-run]
    C --> F[Run scripts tests]
    D --> G[Run standard lint]
    D --> H[Run all tests]
    E --> I{Pass?}
    F --> I
    G --> J{Pass?}
    H --> J
    I -->|Yes| K[✅ Commit]
    I -->|No| L[❌ Block Commit]
    J -->|Yes| K
    J -->|No| L
```

## Scaffold Mode Detection

The hook uses `scripts/test-placeholders.js` to check if `package.json` contains mustache variables:

```bash
node scripts/test-placeholders.js check package.json
# Exit code 0 = scaffold mode
# Exit code 1 = generated theme mode
```

## What Gets Tested

### Scaffold Mode (Automatic)

When working on the scaffold itself:

```text
🔍 Scaffold mode detected - using dry-run linting and testing...

📁 Creating temporary test files...
✓ Temporary files created

🔍 Running linters...
→ JavaScript linting
→ CSS linting
→ PHP linting

🧪 Running tests...
→ Scripts tests (115 tests)

✅ All scaffold pre-commit checks passed!
```

**Checks Performed:**

- ✅ JavaScript files (ESLint + Prettier)
- ✅ CSS/SCSS files (Stylelint)
- ✅ PHP files (PHPCS + WordPress Standards)
- ✅ Scripts tests (`scripts/__tests__/`)
- ⏭️ Security audit skipped (package.json has placeholders)
- ⏭️ Main test suite skipped (has placeholder dependencies)

### Generated Theme Mode (Standard)

When working on a generated theme:

```text
🔍 Generated theme mode detected - running standard linting and testing...

🟡 Linting JavaScript...
✓ JavaScript linting passed

🟡 Linting CSS...
✓ CSS linting passed

🟡 Linting PHP...
✓ PHP linting passed

🧪 Running JavaScript tests...
✓ All JavaScript tests passed

🧪 Running PHP tests...
✓ All PHP tests passed

🔒 Running security audit...
✓ No vulnerabilities detected

✅ All pre-commit checks passed!
```

**Checks Performed:**

- ✅ All standard linting
- ✅ JavaScript tests (`npm run test:js`)
- ✅ PHP tests (`composer run test`)
- ✅ Full security audit with `npm audit`

## Bypassing the Hook

If you need to commit without running checks (not recommended):

```bash
git commit --no-verify -m "Your message"
```

## Configuration Files

| File | Purpose |
|------|---------|
| [.husky/pre-commit](../.husky/pre-commit) | Main hook that detects mode and routes to appropriate linter |
| [scripts/test-placeholders.js](../scripts/test-placeholders.js) | Core module for scaffold detection and test values |
| [scripts/lint-dry-run.js](../scripts/lint-dry-run.js) | Dry-run linting implementation for scaffold mode |
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
node scripts/test-placeholders.js check package.json

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

### Tests Fail

```bash
# Run tests manually to see failures
npm run test:scripts          # Scripts tests (scaffold mode)
npm run test:js               # JavaScript tests (generated theme)
npm run test:php              # PHP tests (generated theme)

# Run with watch mode for development
npm run test:scripts:watch    # Watch scripts tests
npm run test:js:watch         # Watch JS tests

# Run with coverage
npm run test:scripts:coverage
npm run test:js:coverage
```

## Integration with CI/CD

For GitHub Actions or other CI systems:

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linting and tests (auto-detects mode)
        run: |
          if node scripts/test-placeholders.js check package.json; then
            # Scaffold mode
            npm run lint:dry-run
            npm run test:scripts
          else
            # Generated theme mode
            npm run lint
            npm run test
          fi
```

## Benefits

1. **Zero Configuration**: Developers don't need to remember which commands to use
2. **Consistent Quality**: Both scaffold and generated themes maintain code quality
3. **Faster Development**: No need to generate a theme just to test changes
4. **CI-Ready**: Same logic works in pre-commit and CI pipelines
5. **Type Safety**: Prevents commits with linting issues or failing tests
6. **Comprehensive Testing**: Runs all appropriate tests before allowing commits
7. **Fast Feedback**: Catches issues before they reach CI/CD pipeline
