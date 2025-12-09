# Jest Mock Files

This directory contains Jest mock files for handling non-JavaScript imports in tests.

## Files

### `styleMock.js`

Mocks CSS/SCSS imports. When your components import stylesheets:

```javascript
import './component.scss';
```

Jest will use this mock instead of trying to parse CSS.

### `fileMock.js`

Mocks static file imports (images, fonts, etc.). When your components import assets:

```javascript
import logo from './logo.png';
```

Jest will return `'test-file-stub'` instead of trying to load the file.

## Configuration

These mocks are activated via `moduleNameMapper` in `jest.config.js`:

```javascript
moduleNameMapper: {
  '\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
  '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
}
```

## Usage

No direct usage required - Jest automatically uses these mocks when:

1. A test file imports a component
2. That component imports CSS or static files
3. The import path matches the `moduleNameMapper` patterns

## Example

If you have a component:

```javascript
// src/js/components/Header.jsx
import './header.scss';
import logo from './logo.svg';

export const Header = () => (
  <header>
    <img src={logo} alt="Logo" />
  </header>
);
```

And a test:

```javascript
// src/js/components/Header.test.jsx
import { Header } from './Header';

test('renders header', () => {
  // The scss and svg imports are automatically mocked
  const { container } = render(<Header />);
  expect(container.querySelector('header')).toBeInTheDocument();
});
```

The mocks will:

- Replace `./header.scss` import with empty object `{}`
- Replace `./logo.svg` import with string `'test-file-stub'`

## When Are These Used?

**Scripts tests (`scripts/__tests__/`)**: ❌ Not used - scripts only import
Node.js modules

**Component tests (`src/js/`)**: ✅ Used - when you add tests for `editor.js`
or `theme.js` components that import styles/assets

**E2E tests (`tests/e2e/`)**: ❌ Not used - Playwright tests run in real
browser

## Verification

To verify mocks are configured correctly:

```bash
node -e "const config = require('./jest.config.js'); console.log(config.moduleNameMapper)"
```

Should output:

```javascript
{
  '\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
  '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
}
```
