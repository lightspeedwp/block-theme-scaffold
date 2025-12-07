---
title: API Reference
description: Complete API documentation for PHP and JavaScript functions
category: Documentation
type: Reference
audience: Developers
date: 2025-12-01
---

Complete API documentation for the {{theme_name}} block theme scaffold.

## PHP APIs

### LSWP_Theme_Nonce - Nonce Utilities

Secure AJAX and form submission handling for themes.

```php
// Get nonce utilities instance
$nonce = new LSWP_Theme_Nonce( 'your-action-name' );

// Generate nonce for AJAX
$nonce_value = $nonce->create_nonce();

// Verify nonce (AJAX)
if ( ! $nonce->verify_ajax() ) {
    wp_send_json_error( 'Invalid nonce' );
}

// Verify nonce (POST)
if ( ! $nonce->verify_request() ) {
    wp_die( 'Security check failed' );
}
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `__construct()` | `$action = 'lswp-theme-action'` | `void` | Initialize with action name |
| `create_nonce()` | - | `string` | Generate a new nonce |
| `verify_ajax()` | - | `bool` | Verify nonce from AJAX request |
| `verify_request()` | `$nonce_key = '_wpnonce'` | `bool` | Verify nonce from POST request |
| `get_action()` | - | `string` | Get the current action name |
| `render_nonce_field()` | `$referer = true` | `void` | Output nonce hidden field |

---

### LSWP_Theme_Deprecation - Deprecation Utilities

Standard deprecation workflow for theme functions and hooks.

```php
// Deprecate a function
LSWP_Theme_Deprecation::deprecated_function(
    'old_function_name',
    '2.0.0',
    'new_function_name'
);

// Deprecate a hook
LSWP_Theme_Deprecation::deprecated_hook(
    'old_filter_name',
    '2.0.0',
    'new_filter_name'
);

// Deprecate a template
LSWP_Theme_Deprecation::deprecated_template(
    'old-template.html',
    '2.0.0',
    'new-template.html'
);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `deprecated_function()` | `$function, $version, $replacement` | `void` | Mark function as deprecated |
| `deprecated_hook()` | `$hook, $version, $replacement` | `void` | Mark hook as deprecated |
| `deprecated_template()` | `$template, $version, $replacement` | `void` | Mark template as deprecated |
| `deprecated_argument()` | `$function, $version, $message` | `void` | Mark argument as deprecated |
| `get_log()` | - | `array` | Get all deprecation notices |
| `clear_log()` | - | `void` | Clear deprecation log |

---

## Theme Functions

### Block Patterns

```php
// Register a custom block pattern
lswp_register_block_pattern( 'pattern-name', array(
    'title'       => __( 'Pattern Title', 'lswp-theme' ),
    'description' => __( 'Pattern description', 'lswp-theme' ),
    'content'     => '<!-- wp:paragraph --><p>Content</p><!-- /wp:paragraph -->',
    'categories'  => array( 'featured' ),
) );

// Unregister a pattern
lswp_unregister_block_pattern( 'pattern-name' );
```

### Block Styles

```php
// Register a block style
lswp_register_block_style( 'core/button', array(
    'name'  => 'outline',
    'label' => __( 'Outline', 'lswp-theme' ),
) );

// Unregister a block style
lswp_unregister_block_style( 'core/button', 'outline' );
```

### Template Functions

```php
// Get template part with context
lswp_get_template_part( 'parts/header', 'primary', array(
    'show_search' => true,
) );

// Check if template exists
if ( lswp_template_exists( 'templates/custom.html' ) ) {
    // Use custom template
}
```

---

## Hooks Reference

### Actions

| Hook | Parameters | Description |
|------|------------|-------------|
| `lswp_theme_setup` | - | Fires after theme setup |
| `lswp_after_header` | - | Fires after header output |
| `lswp_before_footer` | - | Fires before footer output |
| `lswp_enqueue_assets` | - | Fires when assets are enqueued |
| `lswp_deprecation_notice` | `$function, $version` | Fires when deprecation triggered |

### Filters

| Hook | Parameters | Default | Description |
|------|------------|---------|-------------|
| `lswp_theme_supports` | `$supports` | `[]` | Filter theme supports |
| `lswp_block_pattern_categories` | `$categories` | `[]` | Filter pattern categories |
| `lswp_block_styles` | `$styles` | `[]` | Filter block styles |
| `lswp_nonce_action` | `$action` | `'lswp-theme-action'` | Filter nonce action name |
| `lswp_deprecation_should_trigger` | `$should_trigger, $function` | `true` | Control deprecation notices |

---

## CLI Commands

### Development

```bash
# Start development server
npm run start

# Build for production
npm run build

# Quick build (no cleaning)
npm run build:quick
```

### Testing

```bash
# All tests
npm run test

# JavaScript unit tests
npm run test:unit

# PHP unit tests
npm run test:php
composer run test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:e2e:a11y

# Theme JSON validation
npm run test:theme-json
```

### Code Quality

```bash
# Lint all
npm run lint

# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Lint PHP
composer run lint

# Format code
npm run format
```

### Internationalization

```bash
# Generate POT file
npm run makepot

# Generate JSON translations
npm run makejson

# Full i18n workflow
npm run i18n
```

### Performance

```bash
# Run Lighthouse CI
npm run lighthouse

# Check bundle size
npm run size-limit

# Analyze bundle
npm run analyze-bundle

# Full performance check
npm run performance
```

---

## Theme.json Reference

### Settings Structure

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "palette": [],
      "gradients": [],
      "custom": true
    },
    "typography": {
      "fontFamilies": [],
      "fontSizes": [],
      "customFontSize": true
    },
    "spacing": {
      "spacingScale": {},
      "units": ["px", "em", "rem", "%", "vw", "vh"]
    },
    "layout": {
      "contentSize": "800px",
      "wideSize": "1200px"
    }
  }
}
```

### Style Variations

Style variations are stored in the `styles/` directory:

| File | Description |
|------|-------------|
| `styles/dark.json` | Dark mode color scheme |
| `styles/contrast.json` | High contrast accessibility variant |

---

## Template Parts

### Available Parts

| Part | Location | Description |
|------|----------|-------------|
| `header` | `parts/header.html` | Site header with navigation |
| `footer` | `parts/footer.html` | Site footer with widgets |
| `post-meta` | `parts/post-meta.html` | Post metadata display |
| `pagination` | `parts/pagination.html` | Post/archive pagination |
| `comments` | `parts/comments.html` | Comments section |
| `sidebar` | `parts/sidebar.html` | Widget area sidebar |

### Using Template Parts

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `theme.json` | Theme settings and styles |
| `style.css` | Theme metadata and base styles |
| `functions.php` | PHP functionality |
| `webpack.config.js` | Webpack bundling configuration |
| `postcss.config.js` | PostCSS processing |
| `eslint.config.js` | ESLint rules |
| `stylelint.config.js` | Stylelint rules |
| `jest.config.js` | Jest testing |
| `playwright.config.js` | E2E testing |
| `phpcs.xml` | PHP CodeSniffer rules |
| `phpunit.xml` | PHPUnit configuration |
| `codecov.yml` | Code coverage settings |

---

## Related Documentation

- [README](./README.md) - Main documentation index
- [Deprecation Guide](./DEPRECATION.md) - Deprecation workflow
- [Security Nonce](./SECURITY-NONCE.md) - Nonce utilities
- [Performance](./PERFORMANCE.md) - Performance monitoring
- [Build Process](./BUILD-PROCESS.md) - Build system documentation
