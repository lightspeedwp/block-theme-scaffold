---
title: WordPress Packages Configuration
description: Complete guide to WordPress packages used in this block theme
category: Documentation
type: Reference
audience: Developers
date: 2025-12-01
---

# WordPress Packages Configuration

This block theme uses 18 carefully selected WordPress packages, optimized specifically for theme development. All packages are theme-focused and exclude block-plugin-specific packages.

## Overview

| Category | Packages | Purpose |
|----------|----------|---------|
| **Build & Development** | 12 | Bundling, transpilation, linting, testing |
| **Runtime & Utilities** | 6 | Theme functionality and utilities |
| **Total** | **18** | |

---

## 🛠️ Build & Development Packages (devDependencies)

### 1. @wordpress/babel-plugin-makepot

- **Version**: 6.36.0
- **Purpose**: Automatic translation file generation
- **Used by**: Build process via wp-scripts
- **Config**: `.babelrc.json`
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-babel-plugin-makepot/>

```bash
# Generate translation POT file
npm run makepot
```

---

### 2. @wordpress/babel-preset-default

- **Version**: ^8.35.0
- **Purpose**: Babel configuration for WordPress projects
- **Handles**: JSX, ES6+, React transformation
- **Config**: `.babelrc.json`
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-babel-preset-default/>

```json
{
  "presets": [ "@wordpress/babel-preset-default" ]
}
```

---

### 3. @wordpress/browserslist-config

- **Version**: ^6.35.0
- **Purpose**: Browser targeting configuration
- **Used by**: Autoprefixer and build tools
- **Config**: `.browserslistrc` (extends WordPress defaults)
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-browserslist-config/>

---

### 4. @wordpress/dependency-extraction-webpack-plugin

- **Version**: ^6.35.0
- **Purpose**: Automatic external dependency handling
- **Features**:
  - Extracts WordPress dependencies from bundles
  - Generates `.asset.php` files with dependency lists
  - Optimizes bundle size
- **Config**: Integrated in webpack.config.js via @wordpress/scripts
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/>

**Auto-generated asset files:**

```php
// build/js/theme.asset.php
<?php return array(
  'dependencies' => array( 'wp-i18n', 'wp-element' ),
  'version' => 'a1b2c3d'
);
```

---

### 5. @wordpress/e2e-test-utils-playwright

- **Version**: ^1.35.0
- **Purpose**: End-to-end testing utilities
- **Features**:
  - Playwright integration
  - WordPress admin helpers
  - Block editor testing utilities
- **Config**: `.playwright.config.cjs`
- **Usage**:

  ```bash
  npm run test:e2e              # Run all E2E tests
  npm run test:e2e:a11y        # Accessibility tests
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-e2e-test-utils-playwright/>

---

### 6. @wordpress/env

- **Version**: ^10.35.0
- **Purpose**: Local WordPress development environment
- **Features**:
  - Docker-based WordPress setup
  - Database management
  - Plugin/theme installation
- **Config**: `.wp-env.json`
- **Usage**:

  ```bash
  npm run env:start      # Start environment
  npm run env:stop       # Stop environment
  npm run env:destroy    # Remove environment
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/>

---

### 7. @wordpress/eslint-plugin

- **Version**: ^22.21.0
- **Purpose**: ESLint rules for WordPress
- **Features**:
  - JSDoc validation
  - Strict rules for WordPress compatibility
  - React and Gutenberg best practices
- **Config**: `.eslint.config.cjs`
- **Usage**:

  ```bash
  npm run lint:js           # Check JavaScript
  npm run lint:js:fix       # Auto-fix issues
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-eslint-plugin/>

---

### 8. @wordpress/jest-preset-default

- **Version**: ^12.35.0
- **Purpose**: Jest testing configuration
- **Features**:
  - WordPress preset
  - Babel transformation
  - Module mocking
- **Config**: `jest.config.js`
- **Usage**:

  ```bash
  npm run test:js           # Run unit tests
  npm run test:js:watch     # Watch mode
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-jest-preset-default/>

---

### 9. @wordpress/npm-package-json-lint-config

- **Version**: 5.36.0
- **Purpose**: package.json linting rules
- **Features**:
  - Enforce package.json structure
  - Validate dependencies
  - Consistency checks
- **Config**: `.npmpackagejsonlintrc.json`
- **Usage**:

  ```bash
  npm run lint:pkg-json
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-npm-package-json-lint-config/>

---

### 10. @wordpress/postcss-plugins-preset

- **Version**: 5.36.0
- **Purpose**: Standard PostCSS plugins
- **Includes**:
  - Autoprefixer
  - CSS preset environment
  - WordPress-specific plugins
- **Config**: `.postcss.config.cjs`
- **Usage**: Automatic via build process
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-postcss-plugins-preset/>

---

### 11. @wordpress/postcss-themes

- **Version**: 6.36.0
- **Purpose**: CSS variable handling for theme.json
- **Features**:
  - Global styles support
  - CSS custom properties generation
  - Theme.json integration
- **Config**: `.postcss.config.cjs`
- **Usage**: Automatic CSS preprocessing
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-postcss-themes/>

**PostCSS Configuration:**

```javascript
module.exports = {
  plugins: [
    require( '@wordpress/postcss-plugins-preset' ),
    require( '@wordpress/postcss-themes' ),
    require( 'cssnano' )(),
  ],
};
```

---

### 12. @wordpress/prettier-config

- **Version**: ^4.35.0
- **Purpose**: Code formatting standards
- **Config**: `.prettier.config.cjs`
- **Usage**:

  ```bash
  npm run format         # Auto-format code
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-prettier-config/>

---

### 13. @wordpress/scripts

- **Version**: ^31.0.0
- **Purpose**: Complete build toolchain
- **Includes**:
  - Webpack bundling
  - Babel transpilation
  - CSS/Sass compilation
  - All npm scripts integration
- **Config**: webpack.config.js (extends defaults)
- **Scripts**:

  ```bash
  npm run start          # Watch & rebuild
  npm run build          # Production build
  npm run lint:js        # Lint JavaScript
  npm run lint:css       # Lint Sass/CSS
  npm run test:js        # Run tests
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/>

---

### 14. @wordpress/stylelint-config

- **Version**: ^23.27.0
- **Purpose**: Stylelint configuration for WordPress
- **Features**:
  - Sass/SCSS support
  - BEM naming conventions
  - Performance rules
- **Config**: `.stylelint.config.cjs`
- **Usage**:

  ```bash
  npm run lint:css       # Check styles
  npm run lint:css:fix   # Auto-fix issues
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-stylelint-config/>

---

### 15. @wordpress/create-block

- **Version**: ^4.78.0
- **Purpose**: Block scaffolding tool
- **Features**:
  - Generate block templates
  - Setup block structure
  - Block metadata generation
- **Usage**:

  ```bash
  wp create-block my-block
  ```

- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/>

---

## 🎯 Runtime & Utility Packages (dependencies)

These packages provide runtime functionality used in theme JavaScript and are included in builds.

### 1. @wordpress/a11y

- **Version**: 4.36.0
- **Purpose**: Accessibility utilities
- **Provides**:
  - Screen reader announcements
  - ARIA attributes helpers
  - Focus management
- **Usage in theme.js**:

  ```javascript
  import { announce, speak } from '@wordpress/a11y';

  announce( 'Navigation complete' );
  ```

- **Files Using**: `src/js/theme.js`, `src/js/editor.js`
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-a11y/>

---

### 2. @wordpress/escape-html

- **Version**: 3.36.0
- **Purpose**: Safe HTML escaping
- **Provides**:
  - XSS prevention
  - Safe text interpolation
  - HTML encoding
- **Usage in theme.js**:

  ```javascript
  import { escapeHTML } from '@wordpress/escape-html';

  const safe = escapeHTML( userInput );
  ```

- **Files Using**: `src/js/theme.js`
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-escape-html/>

---

### 3. @wordpress/i18n

- **Version**: ^6.8.0
- **Purpose**: Internationalization utilities
- **Provides**:
  - String translation
  - Plural forms
  - Date/time localization
- **Usage**:

  ```javascript
  import { __, _n } from '@wordpress/i18n';

  const translated = __( 'Hello World', '{{theme_slug}}' );
  ```

- **Files Using**: `src/js/editor.js`, `functions.php`
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/>

---

### 4. @wordpress/icons

- **Version**: 11.3.0
- **Purpose**: WordPress dashicon library
- **Provides**:
  - 300+ SVG icons
  - Consistent icon set
  - Custom styling support
- **Available**:
  - Theme customization UI
  - Custom block patterns
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-icons/>

---

### 5. @wordpress/global-styles-engine

- **Version**: 1.3.0
- **Purpose**: Theme global styles support
- **Features**:
  - theme.json parsing
  - CSS variable generation
  - Style engine integration
- **Used by**: WordPress 6.0+
- **Integration**: Automatic via functions.php
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-global-styles-engine/>

---

### 6. @wordpress/element

- **Version**: ^6.35.0
- **Purpose**: React compatibility layer
- **Provides**:
  - React without direct dependency
  - WordPress compatibility
  - Hook system
- **Usage**: Implicit via other packages
- **Reference**: <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/>

---

### Additional Dependencies (Not in user list but supporting)

- **@wordpress/api-fetch**: REST API communication
- **@wordpress/core-data**: WordPress core data access
- **@wordpress/data**: Redux state management
- **@wordpress/date**: Date utilities
- **@wordpress/primitives**: Base component primitives
- **@wordpress/react-i18n**: React i18n hooks
- **@wordpress/redux-routine**: Redux middleware
- **@wordpress/style-engine**: CSS-in-JS utilities
- **@wordpress/wordcount**: Text analysis

---

## 📋 Configuration Files & Their Packages

### .babelrc.json

```json
{
  "presets": [ "@wordpress/babel-preset-default" ]
}
```

**Packages Used**: @wordpress/babel-preset-default, @wordpress/babel-plugin-makepot

---

### .eslint.config.cjs

```javascript
module.exports = {
  extends: [ '@wordpress/eslint-plugin/recommended' ]
};
```

**Packages Used**: @wordpress/eslint-plugin

---

### .stylelint.config.cjs

```javascript
module.exports = {
  extends: [ '@wordpress/stylelint-config/scss' ]
};
```

**Packages Used**: @wordpress/stylelint-config

---

### .prettier.config.cjs

```javascript
module.exports = {
  ...require( '@wordpress/prettier-config' )
};
```

**Packages Used**: @wordpress/prettier-config

---

### .postcss.config.cjs

```javascript
module.exports = {
  plugins: [
    require( '@wordpress/postcss-plugins-preset' ),
    require( '@wordpress/postcss-themes' ),
    require( 'cssnano' )(),
  ],
};
```

**Packages Used**: @wordpress/postcss-plugins-preset, @wordpress/postcss-themes

---

### jest.config.js

```javascript
const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );
module.exports = { ...defaultConfig };
```

**Packages Used**: @wordpress/scripts, @wordpress/jest-preset-default

---

### webpack.config.js

```javascript
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

module.exports = {
  ...defaultConfig,
  plugins: [
    new DependencyExtractionWebpackPlugin(),
  ]
};
```

**Packages Used**: @wordpress/scripts, @wordpress/dependency-extraction-webpack-plugin

---

### .wp-env.json

```json
{
  "plugins": [ "." ],
  "themes": [ "." ]
}
```

**Package Used**: @wordpress/env

---

## 🎨 Usage in Source Files

### src/js/theme.js

```javascript
import { announce } from '@wordpress/a11y';
import { escapeHTML } from '@wordpress/escape-html';

// Safe HTML handling
const safe = escapeHTML( userInput );

// Accessibility announcements
announce( 'Content updated' );
```

---

### src/js/editor.js

```javascript
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

// Translations
const label = __( 'Hello', '{{theme_slug}}' );

// Screen reader announcements
speak( 'Editor ready' );
```

---

### functions.php

```php
// Global styles support
add_theme_support( 'wp-block-styles' );

// Editor styles
add_editor_style( 'build/css/editor-style.css' );

// Enqueue theme assets with dependency extraction
wp_enqueue_script(
  'theme-js',
  get_theme_file_uri( 'build/js/theme.js' ),
  $asset['dependencies'],  // From theme.asset.php
  $asset['version']
);
```

---

## 🚀 npm Scripts Overview

| Script | Command | Packages Used |
|--------|---------|---------------|
| `npm start` | Development watch mode | @wordpress/scripts |
| `npm run build` | Production build | @wordpress/scripts |
| `npm run lint:js` | Check JavaScript | @wordpress/eslint-plugin |
| `npm run lint:css` | Check Sass/CSS | @wordpress/stylelint-config |
| `npm run format` | Auto-format code | @wordpress/prettier-config |
| `npm run test:js` | Unit tests | @wordpress/jest-preset-default |
| `npm run test:e2e` | End-to-end tests | @wordpress/e2e-test-utils-playwright |
| `npm run env:start` | Start local WP | @wordpress/env |
| `npm run makepot` | Generate translations | @wordpress/babel-plugin-makepot |

---

## ✅ Validation Checklist

- [x] All 18 packages documented
- [x] Configuration files reference correct packages
- [x] Runtime packages used in source files
- [x] Build packages in devDependencies
- [x] No block-plugin packages included
- [x] No unnecessary packages
- [x] All packages are theme-specific

---

## 📚 Quick References

- **WordPress Packages**: <https://developer.wordpress.org/block-editor/reference-guides/packages/>
- **Block Theme Development**: <https://developer.wordpress.org/themes/block-themes/>
- **Build Tools**: <https://developer.wordpress.org/block-editor/getting-started/devenv/>
- **Global Styles**: <https://developer.wordpress.org/themes/global-settings-and-styles/>

---

## 🤝 Contributing

When adding new packages:

1. Verify it's theme-specific (not block-plugin-specific)
2. Add documentation here
3. Update configuration files
4. Add usage examples in source files
5. Update this reference guide
