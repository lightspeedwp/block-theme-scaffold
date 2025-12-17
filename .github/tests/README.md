# .github/tests/

This folder contains Jest test configuration and shared test utilities for the block theme scaffold.

## Files

- Provides global test helpers and mocks
Referenced in `jest.config.js` via `setupFilesAfterEnv`.
Configures localStorage shim for Jest tests that require browser localStorage API.
Referenced in `jest.config.js` via `setupFilesAfterEnv`.
TestLogger class for consistent logging across Jest, PHPUnit, and E2E tests.

```
Logs are written to `logs/test/YYYY-MM-DD-{testType}.log`.
Shared test utilities and helpers for Jest tests.
```

## Configuration

- `scripts/__tests__/jest.config.js`

## Notes

- All test setup should import from this centralized location
