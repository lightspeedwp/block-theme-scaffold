---
title: Build Process
description: Detailed documentation of the build system and asset compilation
category: Development
type: Guide
audience: Developers
date: 2025-12-01
---

## Overview

This WordPress block theme uses `@wordpress/scripts` (wp-scripts) for its build process. wp-scripts provides a standardized toolchain that handles all aspects of modern theme development:

| Feature | Description | Tool |
|---------|-------------|------|
| **Compilation** | Converts ESNext and JSX into browser-compatible JavaScript | Babel |
| **Bundling** | Combines multiple files into optimized bundles | Webpack |
| **Code Linting** | Enforces JavaScript and CSS coding standards | ESLint, Stylelint |
| **Code Formatting** | Maintains consistent code style | Prettier |
| **Sass Compilation** | Converts .scss files to standard CSS | sass-loader |
| **Code Minification** | Reduces file sizes for production | Terser (JS), cssnano (CSS) |

For more details, see the official WordPress documentation:

- [Build Process](https://developer.wordpress.org/themes/advanced-topics/build-process/)
- [Get started with wp-scripts](https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-wp-scripts/)

### Build Process Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Source["Source Files"]
        JS["src/js/*.js"]
        SCSS["src/css/*.scss"]
    end

    subgraph BuildProcess["Build Process"]
        direction TB
        Babel["Babel<br/>ESNext/JSX → ES5"]
        Sass["Sass Compiler<br/>.scss → .css"]
        PostCSS["PostCSS<br/>Autoprefixer"]
        Webpack["Webpack<br/>Bundling"]
        Terser["Terser<br/>JS Minification"]
        cssnano["cssnano<br/>CSS Minification"]
    end

    subgraph Output["Build Output"]
        JSOut["build/js/*.js"]
        CSSOut["build/css/*.css"]
        Assets["*.asset.php"]
    end

    JS --> Babel
    Babel --> Webpack
    SCSS --> Sass
    Sass --> PostCSS
    PostCSS --> cssnano
    Webpack --> Terser
    Terser --> JSOut
    cssnano --> CSSOut
    Webpack --> Assets
```

## Prerequisites

- Node.js 18.0+ and npm 9.0+
- PHP 8.0+
- WordPress 6.4+

## Quick Start

```bash
# Install dependencies
npm install
composer install

# Start development mode with hot reload
npm run start

# Build for production
npm run build
```

## Build Scripts

### Development

```bash
npm run start
```

Starts webpack in development mode with:

- Hot module replacement (HMR)
- Source maps for debugging
- File watching for auto-rebuild
- Development-optimized bundles

### Production Build

```bash
npm run build
```

Creates optimized production assets:

- Minified JavaScript and CSS
- Optimized images and fonts
- Tree-shaking for smaller bundle sizes
- Cache-friendly filenames

```bash
npm run build:production
```

Same as `npm run build` but with explicit NODE_ENV=production flag.

### Development vs Production Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Dev["Development (npm start)"]
        DevWatch["Watch Mode"]
        DevMaps["Source Maps"]
        DevHMR["Hot Reload"]
        DevFast["Fast Builds"]
    end

    subgraph Prod["Production (npm build)"]
        ProdMin["Minification"]
        ProdTree["Tree Shaking"]
        ProdOpt["Optimization"]
        ProdHash["Cache Busting"]
    end

    Source["Source Files"] --> Dev
    Source --> Prod
    Dev --> DevBuild["Development Build<br/>Readable, Debuggable"]
    Prod --> ProdBuild["Production Build<br/>Optimized, Minified"]
```

## Build Configuration

### Webpack Configuration (`webpack.config.cjs`)

The webpack config extends `@wordpress/scripts` defaults with custom settings:

**Entry Points:**

- `theme.js` - Main theme JavaScript
- `editor.js` - Block editor JavaScript
- `style.scss` - Frontend styles
- `editor.scss` - Editor-only styles

**Output:**

- Directory: `build/`
- JavaScript: `build/js/[name].js`
- CSS: `build/css/[name].css`
- Images: `build/images/`
- Fonts: `build/fonts/`

**Key Plugins:**

- `webpack-remove-empty-scripts` - Removes empty .js files from CSS-only entry points
- `@wordpress/dependency-extraction-webpack-plugin` - Extracts WordPress dependencies

**Path Aliases:**

- `@` → `src/` directory
- `@css` → `src/css/` directory
- `@js` → `src/js/` directory

**Asset Handling:**

- Images (png, jpg, gif, svg) → `build/images/`
- Fonts (woff, woff2, eot, ttf, otf) → `build/fonts/`
- SCSS compiled to CSS with PostCSS processing
- Automatic vendor prefixing
- CSS minification and optimization

### Source Structure

```
src/
├── css/
│   ├── style.scss          # Main stylesheet (frontend)
│   └── editor.scss         # Editor stylesheet
└── js/
    ├── theme.js            # Main JavaScript (frontend)
    └── editor.js           # Editor JavaScript
```

### Build Output

```
build/
├── css/
│   ├── style.css           # Compiled frontend CSS
│   ├── style.asset.php     # Dependency metadata
│   ├── editor-style.css    # Compiled editor CSS
│   └── editor-style.asset.php
├── js/
│   ├── theme.js            # Compiled frontend JS
│   ├── theme.asset.php     # Dependency metadata
│   ├── editor.js           # Compiled editor JS
│   └── editor.asset.php
├── images/                 # Optimized images
└── fonts/                  # Font files
```

## Asset Loading

The theme automatically loads compiled assets using WordPress dependency system:

### Frontend Assets (`functions.php`)

```php
wp_enqueue_style( 'theme-slug-style', get_theme_file_uri( 'build/css/style.css' ) );
wp_enqueue_script( 'theme-slug-script', get_theme_file_uri( 'build/js/theme.js' ) );
```

### Editor Assets

```php
wp_enqueue_style( 'theme-slug-editor-style', get_theme_file_uri( 'build/css/editor-style.css' ) );
```

## Internationalization (i18n)

### Generate Translation Template

```bash
npm run makepot
```

This creates `languages/{{theme_slug}}.pot` file containing all translatable strings.

### Translation Setup

1. **Text Domain:** All strings use `{{theme_slug}}` text domain
2. **Load Translations:** Handled in `functions.php`:

   ```php
   load_theme_textdomain( '{{theme_slug}}', get_template_directory() . '/languages' );
   ```

3. **Translation Files:** Place `.po` and `.mo` files in `languages/` directory

### Using Translations in Code

**PHP:**

```php
<?php esc_html_e( 'Text to translate', '{{theme_slug}}' ); ?>
<?php esc_html_x( 'Text', 'context', '{{theme_slug}}' ); ?>
<?php printf( esc_html__( 'Hello %s', '{{theme_slug}}' ), $name ); ?>
```

**JavaScript:**

```javascript
import { __ } from '@wordpress/i18n';

const text = __( 'Text to translate', '{{theme_slug}}' );
```

**Block Patterns (PHP):**

```php
<?php esc_html_e( 'Pattern text', '{{theme_slug}}' ); ?>
<?php echo esc_html_x( 'Text', 'Context', '{{theme_slug}}' ); ?>
```

## Code Quality & Testing

For comprehensive guides on code validation and testing, see:

- **[LINTING.md](./LINTING.md)** - Complete linting standards for JavaScript, CSS, and PHP
- **[TESTING.md](./TESTING.md)** - Testing strategies and examples for all test types
- **[VALIDATION.md](./VALIDATION.md)** - Reference for all validation and code quality tools

## WordPress Environment

### Local Development

```bash
npm run env:start        # Start WordPress environment
npm run env:stop         # Stop environment
npm run env:destroy      # Remove environment
```

Access at:

- Site: <http://localhost:8888>
- Admin: <http://localhost:8888/wp-admin>
- Username: `admin`
- Password: `password`

## Performance

For performance monitoring, optimization strategies, and bundle analysis, see **[PERFORMANCE.md](./PERFORMANCE.md)**.

The build system supports asset minification and compression through webpack configuration.

## References

- [WordPress Scripts Package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [WordPress Theme Build Process](https://developer.wordpress.org/themes/advanced-topics/build-process/)
- [WordPress Internationalization](https://developer.wordpress.org/themes/advanced-topics/internationalization/)
- [Block Theme Development](https://developer.wordpress.org/themes/block-themes/)

## Related Documentation

- [LINTING.md](./LINTING.md) - Code quality standards and lint dry-run mode
- [TESTING.md](./TESTING.md) - Testing guide for all test types
- [VALIDATION.md](./VALIDATION.md) - Comprehensive validation tools reference
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance monitoring and optimization
- [LOGGING.md](./LOGGING.md) - Logging standards for build processes
