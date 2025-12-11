# Scripts Tests

Comprehensive Jest tests for all scripts in the `scripts/` directory.

## Overview

This directory contains unit and integration tests for:

- **agent-script.js** - Minimal agent script for demonstration
- **audit-frontmatter.js** - Frontmatter audit and analysis tool
- **block-theme-build.agent.js** - Build automation agent
- **generate-theme.agent.js** - Interactive theme scaffold generator

## Pre-commit Integration

These tests **automatically run** as part of the Husky pre-commit hook in
scaffold mode. Before any commit is allowed, the hook will:

1. ✅ Run lint:dry-run (handles mustache variables)
2. ✅ Run scripts tests (`npm run test:scripts`)
3. ✅ Block commit if any test fails

This ensures all scripts remain functional and tested. See
[HUSKY_PRECOMMIT.md](../../docs/HUSKY_PRECOMMIT.md) for details.

## Running Tests

### NPM Scripts (Recommended)

```bash
# From project root - run all scripts tests
npm run test:scripts

# Watch mode - auto-rerun on file changes
npm run test:scripts:watch

# With coverage reports
npm run test:scripts:coverage
```

### Direct Jest Commands

```bash
cd scripts/__tests__
npx jest --config jest.config.js
```

### Run Specific Test File

```bash
npx jest --config jest.config.js agent-script.test.js
```

### Run with Coverage

```bash
npx jest --config jest.config.js --coverage
```

### Watch Mode

```bash
npx jest --config jest.config.js --watch
```

## Test Structure

Each test file follows Jest best practices:

```javascript
describe('script-name.js', () => {
  describe('Feature Group', () => {
    test('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Test Files

### agent-script.test.js

Tests for the minimal agent script including:

- ✅ Script existence and executability
- ✅ Argument parsing and handling
- ✅ Environment variable processing
- ✅ Output formatting
- ✅ Exit codes

**115 total tests passing**

### audit-frontmatter.test.js

Tests for the frontmatter audit tool including:

- ✅ Frontmatter extraction (YAML parsing)
- ✅ CSV output formatting
- ✅ Reference counting and recommendations
- ✅ Circular reference detection
- ✅ Recursive file discovery
- ✅ Error handling for invalid frontmatter

### block-theme-build.agent.test.js

Tests for the build automation agent including:

- ✅ Script structure validation
- ✅ Build workflow (npm ci, lint, build, test)
- ✅ Command execution and logging
- ✅ Error scenario handling
- ✅ Integration with npm scripts

### generate-theme.agent.test.js

Tests for the interactive scaffold generator including:

- ✅ Configuration schema validation
- ✅ Input validation (slugs, URLs, versions)
- ✅ Default value application
- ✅ Command building
- ✅ Stage-based question flow
- ✅ Edge case handling

## Configuration

### jest.config.js

Custom Jest configuration for scripts tests:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['../*.js', '!../__tests__/**'],
  coverageDirectory: '../../coverage/scripts',
  verbose: true,
  testTimeout: 30000
};
```

## Coverage

Coverage reports are generated in:

```
coverage/scripts/
├── index.html      # Interactive HTML report
├── lcov.info       # LCOV format for CI
└── coverage.json   # JSON format for parsing
```

## Test Patterns

### Testing CLI Scripts

```javascript
const { execSync } = require('child_process');

test('should execute script', () => {
  const result = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
  expect(result).toContain('expected output');
});
```

### Testing File System Operations

```javascript
const fs = require('fs');
const path = require('path');

beforeEach(() => {
  cleanupTestDir();
  fs.mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
  cleanupTestDir();
});
```

### Testing Exported Functions

```javascript
const { validateValue, validateConfig } = require('../generate-theme.agent');

test('should validate input', () => {
  const errors = validateValue('slug', 'my-theme', schema);
  expect(errors.length).toBe(0);
});
```

## Best Practices

1. **Isolation** - Each test is independent with proper setup/teardown
2. **Descriptive Names** - Test names clearly describe what they test
3. **AAA Pattern** - Arrange, Act, Assert structure
4. **Real Execution** - Tests run actual scripts where possible
5. **Error Cases** - Tests cover both success and failure paths
6. **Edge Cases** - Tests handle boundary conditions and special inputs

## Troubleshooting

### Tests Failing Locally

1. Ensure you're in the `scripts/__tests__/` directory
2. Check that all dependencies are installed: `npm install`
3. Clear Jest cache: `npx jest --clearCache`

### Coverage Not Generating

Ensure the coverage directory exists:

```bash
mkdir -p ../../coverage/scripts
```

### Environment Issues

If you encounter localStorage errors, ensure `testEnvironment: 'jsdom'` is set in jest.config.js.

## Contributing

When adding new scripts to the `scripts/` directory:

1. Create a corresponding `.test.js` file in `__tests__/`
2. Follow existing test patterns
3. Ensure minimum 80% code coverage
4. Test both success and error paths
5. Document any special test requirements

## Related Documentation

- [Main Testing Guide](../../tests/README.md)
- [Jest Configuration](../../jest.config.js)
- [Testing Standards](../../docs/TESTING.md)
- [Scripts Documentation](../README.md)

## Status

**✅ All 115 tests passing**

Last Updated: 2025-12-09
