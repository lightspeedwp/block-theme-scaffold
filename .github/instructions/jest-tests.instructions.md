---
name: "Jest Tests"
description: "Comprehensive guide to writing and running Jest tests in the block theme scaffold"
applyTo: "**/*.js"
---

# Jest Tests Instructions

This document summarizes how to use Jest for JavaScript testing in the block-theme-scaffold repository.

## Overview

Jest is the primary JavaScript testing framework for this project. It is used for unit, integration, and utility tests across scripts, utils, and theme logic.

## Configuration

- Jest config: `jest.config.js` at the project root
- Setup files: `.github/tests/setup.js` (unified), `.github/tests/jest.setup.localstorage.js` (localStorage shim)
- Test logger: `.github/tests/test-logger.js` (file-based logging)
- Test utilities: `.github/tests/test-utils.js` (retry, helpers)

## Test File Location

- Place all Jest test files in `tests/` or relevant `scripts/**/tests/` subfolders
- Use `*.test.js` or `test-*.js` naming
- Example: `scripts/utils/__tests__/scan.test.js`

## Running Tests

- Run all JS tests: `npm run test:js`
- Run a single test: `npm run test:js -- scripts/utils/__tests__/scan.test.js`
- Coverage: `npm run test:js -- --coverage`

## Conventions

- Use `describe` and `it`/`test` blocks
- Prefer in-memory mocks for unit tests, file-based for integration
- Use `TestLogger` for consistent logging
- Use `retryOperation` for flaky async tests
- Mock WordPress dependencies as needed (see `.github/tests/setup.js`)

## Example

```js
describe("scanDirectory", () => {
  it("should find all .md files", () => {
    // ...test code...
  });
});
```

## References

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Project jest.config.js](../../jest.config.js)
- [Test setup](../tests/setup.js)

## Validation

- Ensure all new code has 80%+ test coverage
- Run `npm run lint` and `npm run test` before committing
- Place new tests in the correct subfolder

```js
describe("MyComponent", () => {
  let logger;
  beforeEach(() => {
    logger = new TestLogger("jest");
    logger.suiteStart("MyComponent");
  });
  afterEach(() => {
    logger.suiteEnd("MyComponent");
  });
  it("should render correctly", () => {
    expect(true).toBe(true);
  });
});
```

## Running Tests

- Run all tests: `npm run test`
- Run specific file: `npm run test -- src/js/my-file.test.js`
- Collect coverage: `npm run coverage`

## Coverage & Reporting

- Coverage reports: `coverage/` and `.github/reports/coverage/js/`
- Minimum coverage: 80%
- All reports must be ISO-dated and stored under `.github/reports/`

## Logging

- All test logs: `logs/test/YYYY-MM-DD-jest.log`
- Use `TestLogger` for all test logging
- Do not commit log files

## Linting

- Lint before PR: `npm run lint`
- Fix errors: `npm run lint -- --fix`

## Troubleshooting

- If tests fail, check logs in `logs/test/`
- Ensure only one Jest setup file is referenced
- Check for global state leaks

## References

- [jestjs.io](https://jestjs.io/)
- [block-theme-scaffold CONTRIBUTING.md](../../CONTRIBUTING.md)
- [block-theme-scaffold LOGGING.md](../../docs/LOGGING.md)

---

> For questions, see `.github/tests/` or ask a maintainer.
> **Purpose**: Tests for dry-run validation scripts (lint, test, build without side effects)

**What lives here**:

- Tests for dry-run validation utilities
- Mock implementations for safe testing

**Run with**:

```bash
npm run test:dry-run
```

**Key concept**: Dry-run tests ensure validation scripts work correctly without modifying files.

### 3. `scripts/agents/__tests__/` - Agent Script Tests

**Purpose**: Tests for agent JavaScript implementations

**What lives here**:

- `config.test.js` - Configuration loading tests
- `mustache-vars.test.js` - Mustache variable validation tests
- Tests for individual agent scripts

**Run with**:

```bash
npm run test:agents
npm run test:agents:watch     # Watch mode
npm run test:agents:coverage  # With coverage
```

**Example test structure**:

```javascript
const agent = require("../../scripts/agents/release.agent.js");

describe("Release Agent", () => {
  test("checkVersionConsistency returns version data", () => {
    const result = agent.checkVersionConsistency();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("version");
  });
});
```

### 4. `scripts/lib/__tests__/` - Library Tests

**Purpose**: Tests for shared library code and utilities

**What lives here**:

- Tests for logger utilities
- Tests for configuration schema
- Tests for mode detection
- Tests for shared helper functions

**Run with**: Included in `npm run test:scripts`

## Running Tests

### All Tests

```bash
# Run all JavaScript tests
npm test

# Run all tests with coverage
npm run test:js:coverage
```

### Specific Test Suites

```bash
# Main scripts tests
npm run test:scripts

# Agent tests only
npm run test:agents

# Watch mode (auto-rerun on changes)
npm run test:scripts:watch
npm run test:agents:watch

# Coverage reports
npm run test:scripts:coverage
npm run test:agents:coverage
```

### Single Test File

```bash
# Run specific test file
npx jest scripts/__tests__/config-schema.test.js

# Run with watch mode
npx jest scripts/__tests__/config-schema.test.js --watch

# Run specific test by name pattern
npx jest -t "should validate config schema"
```

### Debugging Tests

```bash
# Run with verbose output
npx jest --verbose

# Run with coverage
npx jest --coverage

# Debug in Node
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Writing Tests

### Basic Test Structure

```javascript
/**
 * Test description and purpose
 * @jest-environment node
 */

describe("Module or Feature Name", () => {
  // Setup before each test
  beforeEach(() => {
    // Reset state, clear mocks, etc.
  });

  // Cleanup after each test
  afterEach(() => {
    // Restore mocks, clean temp files, etc.
  });

  describe("Specific Functionality", () => {
    test("should do something specific", () => {
      // Arrange: Set up test data
      const input = "test";

      // Act: Execute the code under test
      const result = functionUnderTest(input);

      // Assert: Verify the result
      expect(result).toBe("expected");
    });
  });
});
```

### Test Organization

**Good organization**:

```javascript
describe("ConfigSchema", () => {
  describe("validation", () => {
    test("accepts valid config", () => {
      /* ... */
    });
    test("rejects invalid config", () => {
      /* ... */
    });
    test("provides helpful error messages", () => {
      /* ... */
    });
  });

  describe("default values", () => {
    test("applies defaults for missing fields", () => {
      /* ... */
    });
    test("preserves user-provided values", () => {
      /* ... */
    });
  });
});
```

### Common Matchers

```javascript
// Equality
expect(value).toBe(4); // Strict equality (===)
expect(value).toEqual(4); // Deep equality for objects

// Truthiness
expect(value).toBeTruthy(); // Truthy value
expect(value).toBeFalsy(); // Falsy value
expect(value).toBeNull(); // Null
expect(value).toBeUndefined(); // Undefined
expect(value).toBeDefined(); // Not undefined

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3); // Floating point

// Strings
expect("team").toMatch(/tea/);
expect("Christoph").toContain("Chris");

// Arrays and iterables
expect(array).toContain("item");
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toHaveProperty("key", "value");
expect(obj).toMatchObject({ key: "value" });

// Exceptions
expect(() => {
  throw new Error("test");
}).toThrow();
expect(() => {
  throw new Error("test");
}).toThrow("test");
expect(() => {
  throw new Error("test");
}).toThrow(Error);

// Async/Promises
await expect(promise).resolves.toBe("value");
await expect(promise).rejects.toThrow("error");
```

## Test Patterns

### Testing Async Code

```javascript
// Using async/await (recommended)
test("async function returns data", async () => {
  const data = await fetchData();
  expect(data).toEqual({ success: true });
});

// Using promises
test("promise resolves with data", () => {
  return fetchData().then((data) => {
    expect(data).toEqual({ success: true });
  });
});

// Testing rejections
test("handles errors", async () => {
  await expect(fetchInvalidData()).rejects.toThrow("Invalid");
});
```

### Testing File Operations

```javascript
const fs = require("fs");
const path = require("path");

test("creates config file", () => {
  const testDir = path.join(__dirname, "temp");
  const configPath = path.join(testDir, "config.json");

  // Setup
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Execute
  createConfig(configPath, { key: "value" });

  // Assert
  expect(fs.existsSync(configPath)).toBe(true);
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  expect(config).toEqual({ key: "value" });

  // Cleanup
  fs.rmSync(testDir, { recursive: true, force: true });
});
```

### Testing CLI Scripts

```javascript
const { execSync } = require("child_process");

test("CLI returns expected output", () => {
  const output = execSync("node scripts/my-script.js", {
    encoding: "utf8",
    env: { ...process.env, NODE_ENV: "test" },
  });

  expect(output).toContain("Success");
});
```

### Parameterized Tests

```javascript
describe.each([
  ["input1", "expected1"],
  ["input2", "expected2"],
  ["input3", "expected3"],
])("sanitizeInput(%s)", (input, expected) => {
  test(`returns ${expected}`, () => {
    expect(sanitizeInput(input)).toBe(expected);
  });
});
```

## Mocking

### Mocking Modules

```javascript
// Mock entire module
jest.mock("fs");
const fs = require("fs");

// Mock specific functions
fs.readFileSync.mockReturnValue("mocked content");
fs.existsSync.mockReturnValue(true);

test("uses mocked fs", () => {
  const content = fs.readFileSync("file.txt");
  expect(content).toBe("mocked content");
  expect(fs.readFileSync).toHaveBeenCalledWith("file.txt");
});
```

### Mocking Functions

```javascript
// Create mock function
const mockCallback = jest.fn((x) => x + 1);

test("mock function", () => {
  // Call the mock
  const result = mockCallback(1);

  // Assertions
  expect(result).toBe(2);
  expect(mockCallback).toHaveBeenCalled();
  expect(mockCallback).toHaveBeenCalledWith(1);
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback.mock.calls).toHaveLength(1);
  expect(mockCallback.mock.results[0].value).toBe(2);
});
```

### Spy on Methods

```javascript
const myObject = {
  doSomething: (x) => x * 2,
};

test("spy on method", () => {
  const spy = jest.spyOn(myObject, "doSomething");

  myObject.doSomething(5);

  expect(spy).toHaveBeenCalledWith(5);
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore(); // Restore original implementation
});
```

### Mock Implementation

```javascript
const mockFn = jest.fn().mockReturnValue("default").mockReturnValueOnce("first call").mockReturnValueOnce("second call");

expect(mockFn()).toBe("first call");
expect(mockFn()).toBe("second call");
expect(mockFn()).toBe("default");
expect(mockFn()).toBe("default");
```

## Coverage

### Viewing Coverage

```bash
# Generate coverage report
npm run test:js:coverage

# Coverage reports are saved to:
# - coverage/lcov-report/index.html (HTML report)
# - coverage/lcov.info (LCOV format)
# - coverage/coverage-final.json (JSON format)
```

### Coverage Thresholds

Configure in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Excluding from Coverage

```javascript
// Exclude specific files
coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/__tests__/"];

// Exclude lines in code
/* istanbul ignore next */
function uncoveredFunction() {
  // This won't be counted in coverage
}

// Exclude entire file at top
/* istanbul ignore file */
```

## Best Practices

### 1. Test Organization

- **One concept per test**: Each test should verify one specific behavior
- **Descriptive names**: Use clear, specific test names
- **AAA pattern**: Arrange, Act, Assert

```javascript
// Good
test("sanitizeInput removes HTML tags from user input", () => {
  const input = '<script>alert("xss")</script>Hello';
  const result = sanitizeInput(input);
  expect(result).toBe("Hello");
});

// Bad
test("sanitize works", () => {
  expect(sanitizeInput("<script>test</script>")).toBe("test");
});
```

### 2. Isolation

- Tests should not depend on each other
- Use `beforeEach` to reset state
- Clean up after tests (files, mocks, etc.)

```javascript
describe("FileManager", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = path.join(__dirname, "temp-" + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("creates file", () => {
    // Test uses tempDir, which is fresh for each test
  });
});
```

### 3. Mock Sparingly

- Only mock external dependencies
- Don't mock the code you're testing
- Prefer integration tests when possible

```javascript
// Good: Mock external API
jest.mock("node-fetch");
const fetch = require("node-fetch");
fetch.mockResolvedValue({ json: () => ({ data: "test" }) });

// Bad: Mocking everything
jest.mock("./my-module");
// Now you're testing mocks, not real code
```

### 4. Meaningful Assertions

```javascript
// Good: Specific assertions
expect(result).toHaveProperty("status", "success");
expect(result.data).toHaveLength(3);
expect(result.data[0]).toMatchObject({
  id: expect.any(String),
  name: "test",
});

// Bad: Generic assertions
expect(result).toBeTruthy();
expect(result.data).toBeDefined();
```

### 5. Test Error Cases

```javascript
describe("validateConfig", () => {
  test("accepts valid config", () => {
    expect(validateConfig({ valid: true })).toBe(true);
  });

  test("rejects missing required field", () => {
    expect(() => validateConfig({})).toThrow("Missing required");
  });

  test("rejects invalid type", () => {
    expect(() => validateConfig({ field: 123 })).toThrow("Invalid type");
  });

  test("provides helpful error message", () => {
    try {
      validateConfig({});
      fail("Should have thrown");
    } catch (error) {
      expect(error.message).toContain("field: required");
    }
  });
});
```

### 6. Keep Tests Fast

- Avoid unnecessary file I/O
- Mock slow operations
- Use `test.only()` during development
- Run specific tests during development

```bash
# Run only tests matching pattern
npx jest -t "config validation"

# Run single file
npx jest config-schema.test.js

# Watch mode for rapid feedback
npm run test:scripts:watch
```

## Resources

### Official Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest API Reference](https://jestjs.io/docs/api)
- [Expect Matchers](https://jestjs.io/docs/expect)
- [Mock Functions](https://jestjs.io/docs/mock-functions)

### Project-Specific

- [Testing Guide](../../docs/TESTING.md) - Overall testing strategy
- [Contributing Guide](../../CONTRIBUTING.md) - Contribution workflow
- [Development Guide](../../docs/DEVELOPMENT.md) - Development setup

### Quick Reference

```bash
# Run all tests
npm test

# Run specific suite
npm run test:scripts
npm run test:agents

# Watch mode
npm run test:scripts:watch

# Coverage
npm run test:scripts:coverage

# Single file
npx jest path/to/test.test.js

# Debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

**Last Updated**: 2025-12-16
**Maintainers**: LightSpeedWP Engineering Team
