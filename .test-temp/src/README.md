---
title: Source Files
description: Source code and component files
category: Documentation
type: Reference
audience: Developers
date: 2025-12-01
---

# Source Files

This directory contains the source files for JavaScript and CSS that are compiled during the build process.

## Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart LR
    subgraph Source["src/"]
        subgraph JS["js/"]
            ThemeJS["theme.js"]
            EditorJS["editor.js"]
        end
        subgraph CSS["css/"]
            StyleSCSS["style.scss"]
            EditorSCSS["editor.scss"]
        end
    end

    subgraph Build["build/"]
        subgraph JSOut["js/"]
            ThemeOut["theme.js"]
            EditorOut["editor.js"]
        end
        subgraph CSSOut["css/"]
            StyleOut["style.css"]
            EditorCSSOut["editor.css"]
        end
    end

    ThemeJS --> ThemeOut
    EditorJS --> EditorOut
    StyleSCSS --> StyleOut
    EditorSCSS --> EditorCSSOut
```

## Directory Structure

```
src/
├── README.md           # This file
├── css/                # Stylesheet source files
│   ├── README.md
│   ├── style.scss      # Frontend styles
│   └── editor.scss     # Editor-only styles
└── js/                 # JavaScript source files
    ├── README.md
    ├── theme.js        # Frontend JavaScript
    └── editor.js       # Editor JavaScript
```

## Build Process

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#1e4d78', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#15354f', 'lineColor': '#333333', 'secondaryColor': '#f0f0f0', 'tertiaryColor': '#e8e8e8', 'background': '#ffffff', 'mainBkg': '#1e4d78', 'textColor': '#333333', 'nodeBorder': '#15354f', 'clusterBkg': '#f8f9fa', 'clusterBorder': '#dee2e6', 'titleColor': '#333333'}}}%%
flowchart TD
    subgraph Input["Source Files"]
        SCSS["SCSS Files"]
        JS["JavaScript Files"]
    end

    subgraph Process["wp-scripts build"]
        Sass["Sass Compiler"]
        Babel["Babel"]
        PostCSS["PostCSS"]
        Webpack["Webpack"]
    end

    subgraph Output["Build Output"]
        CSS["CSS Files"]
        JSOut["JS Bundles"]
        Assets["Asset Files (.asset.php)"]
    end

    SCSS --> Sass --> PostCSS --> CSS
    JS --> Babel --> Webpack --> JSOut
    Webpack --> Assets
```

## Entry Points

Defined in `webpack.config.cjs`:

| Entry | Source | Output |
|-------|--------|--------|
| `theme` | `src/js/theme.js` | `build/js/theme.js` |
| `editor` | `src/js/editor.js` | `build/js/editor.js` |
| `style` | `src/css/style.scss` | `build/css/style.css` |
| `editor-style` | `src/css/editor.scss` | `build/css/editor.css` |

## Development Commands

```bash
# Start development mode (watch + hot reload)
npm run start

# Build for production
npm run build
```

## File Purposes

### JavaScript

- **theme.js**: Frontend functionality loaded on the public site
- **editor.js**: Block editor customizations and extensions

### CSS

- **style.scss**: Frontend styles (loaded on site and in editor)
- **editor.scss**: Editor-only styles (admin panel styling)

## Path Aliases

Available in webpack configuration:

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@css` | `src/css/` |
| `@js` | `src/js/` |

**Usage:**

```javascript
import '@css/components/buttons.scss';
import { helper } from '@js/utils/helpers';
```

## Related Documentation

- [JavaScript README](./js/README.md)
- [CSS README](./css/README.md)
- [Build Process](../docs/BUILD-PROCESS.md)
- [wp-scripts Configuration](../docs/WP-SCRIPTS-CONFIGURATION.md)
