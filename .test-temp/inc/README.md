---
title: Includes Directory
description: PHP include files and classes
category: Documentation
type: Index
audience: Developers
date: 2025-12-01
---

# Theme Includes

This directory contains PHP include files that extend the theme's functionality.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TB
    subgraph Functions["functions.php"]
        Load["Theme Setup<br/>& Loading"]
    end

    subgraph Includes["inc/"]
        Patterns["block-patterns.php<br/>Pattern Registration"]
        Styles["block-styles.php<br/>Style Registration"]
        Templates["template-functions.php<br/>Template Helpers"]
    end

    Load --> Patterns
    Load --> Styles
    Load --> Templates

    subgraph WordPress["WordPress Hooks"]
        Init["init"]
        AfterSetup["after_setup_theme"]
    end

    Init --> Patterns
    Init --> Styles
    AfterSetup --> Templates
```

## Files

### `nonce.php`

Provides secure nonce utilities for AJAX and form handling.

**Class:** `LSWP_Theme_Nonce`

**Usage:**

```php
$nonce = new LSWP_Theme_Nonce( 'my-action' );
$nonce_value = $nonce->create_nonce();

// Verify in AJAX handler
if ( ! $nonce->verify_ajax() ) {
    wp_send_json_error( 'Security check failed' );
}
```

### `deprecation.php`

Standard deprecation workflow for theme functions and hooks.

**Class:** `LSWP_Theme_Deprecation`

**Usage:**

```php
LSWP_Theme_Deprecation::deprecated_function(
    'old_function',
    '2.0.0',
    'new_function'
);
```

### `block-patterns.php`

Registers custom block patterns for the theme.

**Functions:**

- `block-theme-scaffold_register_block_patterns()` - Registers pattern categories and patterns

**Hook:** `init`

**Example Pattern Registration:**

```php
register_block_pattern(
    'block-theme-scaffold/hero',
    array(
        'title'       => __( 'Hero', 'block-theme-scaffold' ),
        'description' => __( 'A hero section with heading and call to action.', 'block-theme-scaffold' ),
        'content'     => '<!-- wp:pattern {"slug":"block-theme-scaffold/hero"} /-->',
        'categories'  => array( 'block-theme-scaffold-patterns' ),
    )
);
```

### `block-styles.php`

Registers custom block styles for core blocks.

**Functions:**

- `block-theme-scaffold_register_block_styles()` - Registers block style variations

**Hook:** `init`

**Example Style Registration:**

```php
register_block_style(
    'core/button',
    array(
        'name'  => 'rounded',
        'label' => __( 'Rounded', 'block-theme-scaffold' ),
    )
);
```

### `template-functions.php`

Provides helper functions for templates.

**Functions:**

- Template utility functions
- Conditional display helpers
- Custom template tags

## Loading Order

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TD
    A["WordPress Loads Theme"] --> B["functions.php"]
    B --> C["require inc/block-patterns.php"]
    B --> D["require inc/block-styles.php"]
    B --> E["require inc/template-functions.php"]

    C --> F["Hook: init"]
    D --> F
    E --> G["Hook: after_setup_theme"]

    F --> H["Patterns & Styles Registered"]
    G --> I["Template Functions Available"]
```

## Adding New Include Files

1. Create a new PHP file in this directory
2. Add the file to `functions.php`:

   ```php
   require get_template_directory() . '/inc/your-file.php';
   ```

3. Hook your functions to appropriate WordPress actions

## Related Documentation

- [Block Patterns](../patterns/README.md)
- [WordPress Block Styles](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/)
- [Theme Functions](https://developer.wordpress.org/themes/basics/theme-functions/)
