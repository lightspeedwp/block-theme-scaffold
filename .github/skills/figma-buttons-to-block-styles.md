---
name: figma-to-button-styles
description: Assist the user in extracting the Figma Variables from a design and creating the relevant block style json files.
tags:figma,block styles
---

## Purpose
Extract button component variations from a Figma design system and convert them into WordPress block style variation JSON files for the core/button block.

## Prerequisites
- Figma MCP server must be configured and available
- Access to the Figma file with button components
- Existing theme.json with base button styling and color palette

## Input Requirements
- **Figma File URL**: Must include file key and node ID pointing to button components
  - Format: `https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}`
  - Example: `https://www.figma.com/design/4x7b2gxbPg1xC1fQkOIzvP/Medical-Academic-Design-System?node-id=32-191`

## Process Steps

### 1. Extract URL Components
From the Figma URL, extract:
- **File Key**: The alphanumeric string after `/design/`
- **Node ID**: Convert the `node-id` parameter from dash to colon format (e.g., `32-191` → `32:191`)

### 2. Gather Design Context
Use three Figma MCP tools in parallel to understand the button system:

```
Tool: mcp_figma_dev-mod_get_metadata
- Get the hierarchical structure of button components
- Identify button sizes (X-Small, Small, Medium, etc.)
- Identify button variants (Solid, Outline, etc.)
- Identify color schemes (CTA, Brand, Accent, etc.)
- Identify states (Default, Hover, Active, Disabled)

Tool: mcp_figma_dev-mod_get_variable_defs
- Extract actual color values for each button variant
- Get typography settings (already in theme.json)
- Get spacing/padding values (already in theme.json)

Tool: mcp_figma_dev-mod_get_screenshot
- Visual reference for verification
- Understand hover and state transitions
```

### 3. Review Existing Theme Configuration
Check the main theme.json for:
- [ ] Color palette definitions (avoid duplication)
- [ ] Base button element styles (typography, border radius, padding)
- [ ] Custom properties already defined

**Important**: Block style variations should ONLY define what changes from the base, not duplicate existing properties.

### 4. Identify Button Variations
From the Figma metadata, identify distinct button styles:

**Common Pattern**:
- Size variations (X-Small, Small, Medium, Large)
- Style variations (Solid, Outline, Ghost)
- Color schemes (CTA, Brand, Accent, Neutral, System)
- States (Default, Hover, Active, Disabled, Focus)

**Example Structure**:
```
Button / {Size} / {ColorScheme} {Style}
├── State=Default
├── State=Hover
├── State=Active
└── State=Disabled
```

### 5. Map Button Variations to Block Styles

#### Naming Convention
- **File**: `button-{color-scheme}-{style}.json`
- **Slug**: `{color-scheme}-{style}` (kebab-case)
- **Title**: `{Color Scheme} {Style}` (Title Case)

Examples:
- `button-cta-solid.json` → Slug: `cta-solid`, Title: "CTA Solid"
- `button-brand-outline.json` → Slug: `brand-outline`, Title: "Brand Outline"

#### Property Mapping

**Solid Buttons**:
```json
{
  "color": {
    "background": "var(--wp--preset--color--{scheme}-core)",
    "text": "var(--wp--preset--color--base)"
  },
  "border": {
    "color": "var(--wp--preset--color--{scheme}-core)",
    "width": "2px",
    "style": "solid"
  }
}
```

**Outline Buttons**:
```json
{
  "color": {
    "background": "transparent",
    "text": "var(--wp--preset--color--{scheme}-core)"
  },
  "border": {
    "color": "var(--wp--preset--color--{scheme}-core)",
    "width": "2px",
    "style": "solid"
  }
}
```

**Hover States**:
- Solid buttons: Darken to `-dark` variant
- Outline buttons: Fill with core color, text becomes base (white)

### 6. Create Block Style Variation Files

For each button variation, create a JSON file in `styles/blocks/`:

```json
{
  "version": 3,
  "$schema": "https://schemas.wp.org/wp/6.7/theme.json",
  "title": "{Display Name}",
  "slug": "{slug-name}",
  "blockTypes": ["core/button"],
  "styles": {
    "color": { /* colors */ },
    "border": { /* border styles */ },
    ":hover": { /* hover state */ }
  }
}
```

## File Structure

```
theme-root/
├── theme.json (base configuration)
└── styles/
    └── blocks/
        ├── button-cta-solid.json
        ├── button-cta-outline.json
        ├── button-brand-solid.json
        ├── button-brand-outline.json
        ├── button-accent-solid.json
        └── button-accent-outline.json
```

## Duplication Prevention Rules

### DO NOT Duplicate
- ❌ Border radius (defined in theme.json `styles.elements.button.border.radius`)
- ❌ Typography (font family, size, weight, line-height, letter-spacing)
- ❌ Padding/spacing (defined in `settings.custom.button.padding`)
- ❌ Color definitions (should reference palette, not hardcode)

### DO Define
- ✅ Background color (specific to variant)
- ✅ Text color (specific to variant)
- ✅ Border color (specific to variant)
- ✅ Border width (if different from base)
- ✅ Hover states (color changes)

## Color Scheme Mapping

From Figma variables to theme.json color references:

```
Figma Variable               → WordPress Color Ref
----------------------------------------
var(--wp--preset--color--cta-core)   → var(--wp--preset--color--cta-core)
var(--wp--preset--color--cta-dark)   → var(--wp--preset--color--cta-dark)
var(--wp--preset--color--brand-core) → var(--wp--preset--color--brand-core)
var(--wp--preset--color--brand-dark) → var(--wp--preset--color--brand-dark)
var(--wp--preset--color--accent-core)→ var(--wp--preset--color--accent-core)
var(--wp--preset--color--accent-dark)→ var(--wp--preset--color--accent-dark)
global/base                          → var(--wp--preset--color--base)
```

## Button States Translation

### Figma States → WordPress Pseudo-selectors
- `State=Default` → base styles (no pseudo-selector)
- `State=Hover` → `:hover` pseudo-selector
- `State=Active` → can use `:active` or same as hover
- `State=Disabled` → handled by WordPress core (not customizable in theme.json)
- `State=Focus` → `:focus` pseudo-selector

## Example Implementation

### Input
```
Figma Node: Button / Small / CTA Solid
States:
- Default: bg=#e85e2e, text=#ffffff
- Hover: bg=#c75128, text=#ffffff
- Active: bg=#c75128, text=#ffffff
```

### Output: button-cta-solid.json
```json
{
  "version": 3,
  "$schema": "https://schemas.wp.org/wp/6.7/theme.json",
  "title": "CTA Solid",
  "slug": "cta-solid",
  "blockTypes": ["core/button"],
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--cta-core)",
      "text": "var(--wp--preset--color--base)"
    },
    "border": {
      "color": "var(--wp--preset--color--cta-core)",
      "width": "2px",
      "style": "solid"
    },
    ":hover": {
      "color": {
        "background": "var(--wp--preset--color--cta-dark)",
        "text": "var(--wp--preset--color--base)"
      },
      "border": {
        "color": "var(--wp--preset--color--cta-dark)"
      }
    }
  }
}
```

## Quality Checks

Before finalizing, verify:
- [ ] All color values use theme.json palette references (no hardcoded hex)
- [ ] No duplication of base button properties (typography, radius, padding)
- [ ] Hover states are defined for interactive feedback
- [ ] File names match slug names
- [ ] Slug uses kebab-case
- [ ] Title uses proper Title Case
- [ ] JSON is valid and properly formatted
- [ ] Files are in `styles/blocks/` directory
- [ ] BlockTypes array includes `["core/button"]`

## Common Button Patterns

### Solid Pattern
- Filled background with core color
- White text
- Hover: darker background variant
- Border matches background

### Outline Pattern  
- Transparent background
- Text color matches scheme
- Border in scheme color
- Hover: fills with core color, text becomes white

### Ghost Pattern (if applicable)
- Transparent background
- Text color matches scheme
- No border or subtle border
- Hover: subtle background tint

## Size Variations
**Note**: Size variations are typically handled through the WordPress button size controls (Small, Medium, Large) rather than separate style variations. The base padding and typography for different sizes should be defined in theme.json, not in block style variations.

If your design system requires specific named size variants (e.g., "Hero Button", "Compact Button"), create those as separate style variations.

## Testing in WordPress
After creating the files:
1. Refresh the WordPress editor
2. Add a Button block
3. Check the Styles panel for your new variations
4. Test hover states in the frontend
5. Verify responsive behavior across screen sizes

## Notes
- Block style variations are automatically discovered by WordPress from the `styles/blocks/` directory
- The `blockTypes` array determines which block(s) the style applies to
- Multiple blockTypes can be specified for shared styles
- Variations appear in the block inspector Styles panel
- Base button styles inherit from `theme.json` → `styles.elements.button`
