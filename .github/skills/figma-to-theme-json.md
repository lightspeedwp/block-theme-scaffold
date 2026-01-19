---
name: figma-to-theme-json
description: Assist the user in extracting the Figma Variables from a design and its specific node.
tags:figma,theme.json
---

# Figma to theme.json Conversion Skill

## Purpose
Extract design variables from a Figma design system and convert them into a WordPress `theme.json` file.

## Prerequisites
- Figma MCP server must be configured and available
- Access to the Figma file and node ID

## Input Requirements
- **Figma File URL**: Must include file key and node ID
  - Format: `https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}`
  - Example: `https://www.figma.com/design/4x7b2gxbPg1xC1fQkOIzvP/Design-System?node-id=85-2500`

## Process Steps

### 1. Extract URL Components
From the Figma URL, extract:
- **File Key**: The alphanumeric string after `/design/` (e.g., `4x7b2gxbPg1xC1fQkOIzvP`)
- **Node ID**: Convert the `node-id` parameter from dash format to colon format (e.g., `85-2500` → `85:2500`)

### 2. Fetch Design Variables
Use the Figma MCP tool to retrieve variable definitions:

```
Tool: mcp_figma_dev-mod_get_variable_defs
Parameters:
  - fileKey: {extracted file key}
  - nodeId: {converted node ID}
  - clientFrameworks: "wordpress"
  - clientLanguages: "css,javascript"
```

This returns a JSON object with all design tokens including:
- Color values (hex codes)
- Typography settings (fonts, sizes, weights, line heights)
- Spacing values
- Component-specific values (buttons, etc.)

### 3. Map Variables to theme.json Structure

#### Color Palette
Map color variables to `settings.color.palette[]`:
- Extract hex color values
- Create slugs from variable names (kebab-case)
- Generate human-readable names
- Include global, brand, accent, system colors

#### Typography
Map to `settings.typography`:
- **Font Families**: Extract font-family variables → `fontFamilies[]`
- **Font Sizes**: Extract size values → `fontSizes[]` (convert px to rem)
- Include fluid typography where applicable

#### Spacing
Map to `settings.spacing.spacingSizes[]`:
- Extract spacing preset values
- Convert px to rem (divide by 16)

#### Custom Properties
Map component-specific values to `settings.custom`:
- Button properties (radius, padding, colors)
- Other custom design tokens

### 4. Generate Styles Section
Create `styles` object with:
- **Root styles**: Default background, text color, typography
- **Element styles**: Headings (h1-h6), links, buttons
- **Block styles**: Core WordPress blocks (paragraph, etc.)

## Output Structure

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "appearanceTools": true,
    "useRootPaddingAwareAlignments": true,
    "color": { /* palette */ },
    "typography": { /* fonts & sizes */ },
    "spacing": { /* spacing scale */ },
    "custom": { /* custom properties */ }
  },
  "styles": {
    "color": { /* root colors */ },
    "typography": { /* root typography */ },
    "elements": { /* heading, link, button styles */ },
    "blocks": { /* block-specific styles */ }
  }
}
```

## Variable Mapping Reference

### Color Variables
```
Figma Variable → theme.json Slug
-------------------------------------
global/base → base
global/contrast → contrast
global/neutral/100 → neutral-100
colours/text/body/contrast → (use for text color)
var(--wp--preset--color--*) → (already formatted)
```

### Typography Variables
```
Figma Variable → theme.json Property
----------------------------------------
font-family/heading → fontFamilies[].fontFamily
font-family/body → fontFamilies[].fontFamily
var(--wp--preset--font-size--*) → fontSizes[].size
Heading/H1, H2, etc. → styles.elements.h1, h2, etc.
Paragraph/* → styles.blocks.core/paragraph
```

### Spacing Variables
```
Figma Variable → theme.json
-----------------------------
var(--wp--preset--spacing--*) → spacingSizes[].size
```

### Button Variables
```
Figma Variable → theme.json Custom
--------------------------------------
button-radius → custom.button.border.radius
Button/* typography → styles.elements.button.typography
var(--wp--custom--button-*) → custom.button.*
```

## Conversion Rules

### Units
- Pixels to Rem: divide by 16 (e.g., `24px` → `1.5rem`)
- Keep original if using CSS variables

### Alpha/Opacity Colors
- Convert hex with alpha (e.g., `#0d66d01a`) to `rgba()` format
- Extract RGB values and opacity percentage

### Fluid Typography
- When Figma indicates fluid sizing, use `clamp()` function
- Format: `clamp(min, preferred, max)`

### Font Loading
- Add empty `fontFace[]` arrays for web fonts
- Populate with @font-face rules if font files available

## Example Usage

```bash
# User provides URL
https://www.figma.com/design/4x7b2gxbPg1xC1fQkOIzvP/Medical-Academic-Design-System?node-id=85-2500

# Agent extracts and calls
fileKey: "4x7b2gxbPg1xC1fQkOIzvP"
nodeId: "85:2500"

# Generates theme.json at
/path/to/theme/theme.json
```

## Quality Checks

Before finalizing, verify:
- [ ] All color variables are valid hex or rgba values
- [ ] Font sizes are in valid CSS units (rem, px, em)
- [ ] Spacing values are consistent and properly scaled
- [ ] Element styles match Figma specifications
- [ ] Button styles include all size variants
- [ ] Links include hover states
- [ ] JSON is valid and properly formatted

## Notes
- Theme.json schema version should be 3 (WordPress 6.5+)
- Enable `appearanceTools` for full editor control
- Set `defaultPalette: false` to use only custom colors
- Include `useRootPaddingAwareAlignments` for better layout control
