---
title: Tests
description: Test files and test configuration
category: Testing
type: Index
audience: Developers
date: 2025-12-01
---

# JavaScript Unit Tests

This directory contains Jest unit tests for theme JavaScript.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Source["Source Files"]
        ThemeJS["src/js/theme.js"]
        EditorJS["src/js/editor.js"]
    end

    subgraph Tests["Test Files"]
        ThemeTest["theme.test.js"]
        ExampleTest["example.test.js"]
    end

    ThemeJS --> ThemeTest
    EditorJS --> ExampleTest
```

## Test Files

### `theme.test.js`

Tests for frontend theme JavaScript.

**Coverage:**

- DOM manipulation
- Event handlers
- Utility functions
- Frontend interactions

### `example.test.js`

Example test file demonstrating testing patterns.

**Demonstrates:**

- Jest syntax
- Test structure
- Assertions
- Mocking

## Running Tests

```bash
# Run all JavaScript tests
npm run test:js

# Run specific test file
npm run test:js -- theme.test.js

# Watch mode for development
npm run test:js:watch

# Coverage report
npm run test:js -- --coverage
```

## Test Patterns

### Testing Functions

```javascript
import { myFunction } from '../../src/js/theme';

describe('myFunction', () => {
    it('returns expected value', () => {
        const result = myFunction('input');
        expect(result).toBe('expected');
    });

    it('handles edge cases', () => {
        expect(myFunction(null)).toBeNull();
        expect(myFunction('')).toBe('');
    });
});
```

### Testing DOM Manipulation

```javascript
describe('DOM interactions', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="test">
                <button>Click me</button>
            </div>
        `;
    });

    it('modifies DOM correctly', () => {
        const button = document.querySelector('button');
        button.click();
        expect(button.classList.contains('active')).toBe(true);
    });
});
```

### Testing WordPress Packages

```javascript
import { __ } from '@wordpress/i18n';

jest.mock('@wordpress/i18n', () => ({
    __: jest.fn((text) => text),
}));

describe('i18n', () => {
    it('translates strings', () => {
        const translated = __('Hello', 'theme-slug');
        expect(translated).toBe('Hello');
    });
});
```

## Test Utilities

The `test-utils.js` file provides helper functions:

```javascript
import { render, waitFor } from './test-utils';

describe('Component', () => {
    it('renders', async () => {
        const { container } = render(<Component />);
        await waitFor(() => {
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
```

## Related Documentation

- [JavaScript Source](../../src/js/README.md)
- [Jest Configuration](../../docs/config/jest.md)
- [Tests Overview](../README.md)
