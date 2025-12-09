---
title: Design System Standards - Colors, Spacing & Typography
description: Comprehensive design token system for WordPress block themes with AI agent constraints
date: 2025-12-09
audience: Developers, AI Agents
type: Standards
category: Design System
---

> ⚠️ **CRITICAL FOR AI AGENTS**: This document defines the **immutable design system architecture**. When generating themes, you MUST preserve the structure defined here and only replace mustache placeholder values (`{{variable}}`). **DO NOT rewrite or simplify the design token system**.

## Overview

This block theme scaffold implements a comprehensive design token system via `theme.json` following WordPress 6.9+ standards. The system uses:

- **Numeric spacing scale** (10-100) with fixed pixel/rem values
- **Numeric font size scale** (100-900) with fluid typography
- **Semantic color palette** with WCAG 2.2 AA compliance
- **Style variations** in `styles/` folder for theme variants

---

## 🚨 AI Agent Constraints

### MUST DO

✅ **Replace placeholder values only:**

```json
{
  "slug": "primary",
  "color": "{{primary_color}}"  // ← Replace this value
}
```

✅ **Preserve numeric scales:**

```json
{
  "slug": "100",  // ← Keep numeric slug
  "size": "0.75rem",
  "fluid": { "min": "0.65rem", "max": "0.75rem" }
}
```

✅ **Maintain structure:**

- Keep all font size slugs (100-900)
- Keep all spacing slugs (10-100)
- Keep fluid configuration objects
- Keep style variation files in `styles/`

### MUST NOT DO

❌ **DO NOT simplify to semantic names:**

```json
// ❌ WRONG - Do not replace numeric with semantic
{ "slug": "small", "size": "1rem" }

// ✅ CORRECT - Preserve numeric
{ "slug": "200", "size": "1rem", "fluid": {...} }
```

❌ **DO NOT remove fluid typography:**

```json
// ❌ WRONG - Missing fluid config
{ "slug": "400", "size": "1.5rem" }

// ✅ CORRECT - Keep fluid object
{
  "slug": "400",
  "size": "1.5rem",
  "fluid": { "min": "1.25rem", "max": "1.5rem" }
}
```

❌ **DO NOT delete spacing presets:**

```json
// ❌ WRONG - Only 3 sizes
"spacingSizes": [
  { "slug": "small", "size": "1rem" },
  { "slug": "medium", "size": "2rem" },
  { "slug": "large", "size": "3rem" }
]

// ✅ CORRECT - Full numeric scale (10-100)
"spacingSizes": [
  { "slug": "10", "size": "0.625rem" },
  { "slug": "20", "size": "1.25rem" },
  // ... (see full scale below)
  { "slug": "100", "size": "6.25rem" }
]
```

❌ **DO NOT remove style variations:**

- Keep `styles/dark.json`
- Keep `styles/blocks/*.json`
- Keep `styles/sections/*.json`

### Validation Checkpoint

Before finishing theme generation, verify:

```bash
# Check theme.json structure preserved
jq '.settings.typography.fontSizes | length' theme.json
# Should return: 9 (slugs 100-900)

jq '.settings.spacing.spacingSizes | length' theme.json
# Should return: 10 (slugs 10-100)

jq '.settings.typography.fontSizes[].slug' theme.json
# Should contain: "100", "200", ..., "900" (not "small", "medium", "large")

# Check no unreplaced mustache variables
grep -r "{{" theme.json styles/
# Should return: 0 matches
```

---

## Design Token System

### 1. Spacing Scale (Numeric)

The spacing system uses **numeric slugs 10-100** (increments of 10) for predictable scaling:

```json
{
  "settings": {
    "spacing": {
      "customSpacingSize": true,
      "units": ["px", "em", "rem", "vh", "vw", "%"],
      "spacingSizes": [
        { "slug": "10", "size": "0.625rem", "name": "10px" },
        { "slug": "20", "size": "1.25rem", "name": "20px" },
        { "slug": "30", "size": "1.875rem", "name": "30px" },
        { "slug": "40", "size": "2.5rem", "name": "40px" },
        { "slug": "50", "size": "3.125rem", "name": "50px" },
        { "slug": "60", "size": "3.75rem", "name": "60px" },
        { "slug": "70", "size": "4.375rem", "name": "70px" },
        { "slug": "80", "size": "5rem", "name": "80px" },
        { "slug": "90", "size": "5.625rem", "name": "90px" },
        { "slug": "100", "size": "6.25rem", "name": "100px" }
      ]
    }
  }
}
```

**Why numeric slugs?**

- Predictable progression (10 → 20 → 30)
- Design tool integration (Figma, Sketch)
- Shorter CSS variables: `var(--wp--preset--spacing--40)`
- Mathematical relationships between scales

**CSS Variable Usage:**

```css
.block {
  padding: var(--wp--preset--spacing--40);
  margin-block: var(--wp--preset--spacing--20);
  gap: var(--wp--preset--spacing--30);
}
```

### 2. Typography Scale (Numeric)

Font sizes use **numeric slugs 100-900** with fluid typography:

```json
{
  "settings": {
    "typography": {
      "fluid": {
        "minFontSize": "0.875rem",
        "maxViewportWidth": "1440px",
        "minViewportWidth": "320px"
      },
      "fontSizes": [
        {
          "slug": "100",
          "size": "0.75rem",
          "name": "Tiny",
          "fluid": { "min": "0.65rem", "max": "0.75rem" }
        },
        {
          "slug": "200",
          "size": "1rem",
          "name": "Base",
          "fluid": { "min": "0.875rem", "max": "1rem" }
        },
        {
          "slug": "300",
          "size": "1.25rem",
          "name": "Small",
          "fluid": { "min": "1rem", "max": "1.25rem" }
        },
        {
          "slug": "400",
          "size": "1.5rem",
          "name": "Medium",
          "fluid": { "min": "1.25rem", "max": "1.5rem" }
        },
        {
          "slug": "500",
          "size": "2rem",
          "name": "Large",
          "fluid": { "min": "1.5rem", "max": "2rem" }
        },
        {
          "slug": "600",
          "size": "2.5rem",
          "name": "X-Large",
          "fluid": { "min": "2rem", "max": "2.5rem" }
        },
        {
          "slug": "700",
          "size": "3rem",
          "name": "XX-Large",
          "fluid": { "min": "2.5rem", "max": "3rem" }
        },
        {
          "slug": "800",
          "size": "4rem",
          "name": "Huge",
          "fluid": { "min": "3rem", "max": "4rem" }
        },
        {
          "slug": "900",
          "size": "5rem",
          "name": "Gigantic",
          "fluid": { "min": "3.5rem", "max": "5rem" }
        }
      ]
    }
  }
}
```

**Fluid Typography Benefits:**

- Responsive without breakpoints
- Smooth scaling between viewport sizes
- Automatic clamping prevents too-small or too-large text
- Better accessibility on all devices

**Scale Mapping to Elements:**

```json
{
  "styles": {
    "elements": {
      "h1": { "typography": { "fontSize": "var(--wp--preset--font-size--900)" } },
      "h2": { "typography": { "fontSize": "var(--wp--preset--font-size--800)" } },
      "h3": { "typography": { "fontSize": "var(--wp--preset--font-size--700)" } },
      "h4": { "typography": { "fontSize": "var(--wp--preset--font-size--600)" } },
      "h5": { "typography": { "fontSize": "var(--wp--preset--font-size--500)" } },
      "h6": { "typography": { "fontSize": "var(--wp--preset--font-size--400)" } }
    }
  }
}
```

### 3. Color Palette (Semantic)

Colors use **semantic slugs** with mustache placeholders for values:

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "{{primary_color}}",
          "name": "Primary"
        },
        {
          "slug": "secondary",
          "color": "{{secondary_color}}",
          "name": "Secondary"
        },
        {
          "slug": "background",
          "color": "{{background_color}}",
          "name": "Background"
        },
        {
          "slug": "foreground",
          "color": "{{text_color}}",
          "name": "Foreground"
        },
        {
          "slug": "accent",
          "color": "{{accent_color}}",
          "name": "Accent"
        },
        {
          "slug": "neutral",
          "color": "{{neutral_color}}",
          "name": "Neutral"
        }
      ]
    }
  }
}
```

**WCAG 2.2 AA Requirements:**

- Text contrast: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum
- Always test color pairs with contrast checker

**Color Usage in Styles:**

```json
{
  "styles": {
    "elements": {
      "link": {
        "color": { "text": "var(--wp--preset--color--primary)" },
        ":hover": {
          "color": { "text": "var(--wp--preset--color--secondary)" }
        }
      }
    }
  }
}
```

### 4. Font Families

Font families use **semantic slugs** with mustache placeholders:

```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "{{heading_font_family}}",
          "slug": "heading",
          "name": "{{heading_font_name}}"
        },
        {
          "fontFamily": "{{body_font_family}}",
          "slug": "body",
          "name": "{{body_font_name}}"
        }
      ]
    }
  }
}
```

**Font Stack Best Practices:**

```json
// ✅ Good - Complete fallback chain
"fontFamily": "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif"

// ❌ Bad - Missing fallbacks
"fontFamily": "\"Inter\""
```

---

## Style Variations System

The `styles/` folder contains **style variations** that override theme.json settings:

### Folder Structure

```
styles/
├── dark.json              # Dark mode variant
├── blocks/                # Block-specific styles
│   ├── button-primary.json
│   ├── button-rounded.json
│   └── heading-serif.json
└── sections/              # Section-specific styles
    ├── hero-section.json
    └── content-section.json
```

### Dark Mode Example

`styles/dark.json` provides complete dark mode palette:

```json
{
  "version": 3,
  "title": "Dark",
  "settings": {
    "color": {
      "palette": [
        { "slug": "background", "color": "#1a1a1a", "name": "Background" },
        { "slug": "foreground", "color": "#ffffff", "name": "Foreground" },
        { "slug": "primary", "color": "#4a9eff", "name": "Primary" }
      ]
    }
  }
}
```

### Block Style Variations

`styles/blocks/button-primary.json`:

```json
{
  "version": 3,
  "title": "Primary Button",
  "styles": {
    "blocks": {
      "core/button": {
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "var(--wp--preset--color--background)"
        },
        "border": {
          "radius": "8px"
        }
      }
    }
  }
}
```

**AI Agent Rule:** Preserve all style variation files during theme generation. Only replace mustache variables within them.

---

## Global vs Block-Level Settings

### Global Settings (theme.json root)

Apply to **all blocks** by default:

```json
{
  "settings": {
    "color": { "palette": [...] },      // All blocks
    "typography": { "fontSizes": [...] }, // All blocks
    "spacing": { "spacingSizes": [...] }  // All blocks
  }
}
```

### Block-Level Settings (theme.json → blocks)

Override globals for **specific blocks**:

```json
{
  "settings": {
    "blocks": {
      "core/button": {
        "color": {
          "palette": [
            { "slug": "button-primary", "color": "#007cba" }
          ]
        }
      }
    }
  }
}
```

**When to use block-level:**

- Button colors different from global palette
- Heading sizes different from body text
- Card padding different from page padding

---

## CSS Custom Properties Reference

All design tokens generate CSS custom properties:

### Spacing Variables

```css
var(--wp--preset--spacing--10)  /* 10px */
var(--wp--preset--spacing--20)  /* 20px */
var(--wp--preset--spacing--30)  /* 30px */
var(--wp--preset--spacing--40)  /* 40px */
var(--wp--preset--spacing--50)  /* 50px */
var(--wp--preset--spacing--56)  /* 56px */
var(--wp--preset--spacing--60)  /* 60px */
var(--wp--preset--spacing--64)  /* 64px */
var(--wp--preset--spacing--72)  /* 72px */
var(--wp--preset--spacing--80)  /* 80px */
```

### Typography Variables

```css
var(--wp--preset--font-size--100)  /* 0.75rem - Tiny */
var(--wp--preset--font-size--200)  /* 1rem - Base */
var(--wp--preset--font-size--300)  /* 1.25rem - Small */
var(--wp--preset--font-size--400)  /* 1.5rem - Medium */
var(--wp--preset--font-size--500)  /* 2rem - Large */
var(--wp--preset--font-size--600)  /* 2.5rem - X-Large */
var(--wp--preset--font-size--700)  /* 3rem - XX-Large */
var(--wp--preset--font-size--800)  /* 4rem - Huge */
var(--wp--preset--font-size--900)  /* 5rem - Gigantic */
```

### Color Variables

```css
var(--wp--preset--color--primary)
var(--wp--preset--color--secondary)
var(--wp--preset--color--background)
var(--wp--preset--color--foreground)
var(--wp--preset--color--accent)
var(--wp--preset--color--neutral)
```

### Font Family Variables

```css
var(--wp--preset--font-family--heading)
var(--wp--preset--font-family--body)
```

---

## Usage Examples

### In Block Patterns

```php
<!-- wp:heading {"fontSize":"700"} -->
<h2 class="has-700-font-size">Hero Title</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
<p style="margin-top:var(--wp--preset--spacing--40)">Content</p>
<!-- /wp:paragraph -->
```

### In Custom CSS (style.css)

```css
.custom-block {
  /* Use spacing tokens */
  padding: var(--wp--preset--spacing--40);
  margin-block: var(--wp--preset--spacing--20);
  gap: var(--wp--preset--spacing--30);

  /* Use typography tokens */
  font-size: var(--wp--preset--font-size--400);
  font-family: var(--wp--preset--font-family--body);

  /* Use color tokens */
  color: var(--wp--preset--color--foreground);
  background: var(--wp--preset--color--background);
}
```

### In JavaScript (Block Editor)

```javascript
import { useBlockProps } from '@wordpress/block-editor';

const blockProps = useBlockProps({
  style: {
    padding: 'var(--wp--preset--spacing--40)',
    fontSize: 'var(--wp--preset--font-size--400)',
    color: 'var(--wp--preset--color--foreground)',
  }
});
```

---

## Mustache Placeholder Reference

### Design Token Placeholders

**Colors:**- `{{primary_color}}` - Primary brand color (default: `#0073aa`)

- `{{secondary_color}}` - Secondary brand color (default: `#005177`)
- `{{background_color}}` - Background color (default: `#ffffff`)
- `{{text_color}}` - Text/foreground color (default: `#1a1a1a`)
- `{{accent_color}}` - Accent/CTA color (default: `#ff6b35`)
- `{{neutral_color}}` - Neutral/gray color (default: `#6c757d`)

**Typography:**

- `{{heading_font_family}}` - CSS font stack for headings
- `{{heading_font_name}}` - Display name for headings font
- `{{body_font_family}}` - CSS font stack for body
- `{{body_font_name}}` - Display name for body font

**Font Weights & Line Heights:**

- `{{heading_font_weight}}` - Weight for headings (default: `700`)
- `{{body_line_height}}` - Line height for body (default: `1.6`)
- `{{heading_line_height}}` - Line height for headings (default: `1.2`)
- `{{button_font_weight}}` - Weight for buttons (default: `600`)
- `{{site_title_font_weight}}` - Weight for site title (default: `700`)

**Layout:**

- `{{content_width}}` - Max width for content (default: `720px`)
- `{{wide_width}}` - Max width for wide blocks (default: `1200px`)

**DO NOT REPLACE:** The spacing slugs (10-100) and font size slugs (100-900) are **structural** and should never be replaced with placeholders.

---

## Best Practices

### ✅ DO

1. **Use numeric scales consistently**
   - Spacing: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
   - Font sizes: 100, 200, 300, 400, 500, 600, 700, 800, 900

2. **Preserve fluid typography**
   - Every font size has `fluid: { min, max }` object
   - Enables responsive scaling without breakpoints

3. **Reference via CSS variables**
   - `var(--wp--preset--spacing--40)` not `40px`
   - `var(--wp--preset--font-size--400)` not `1.5rem`

4. **Test WCAG compliance**
   - All text/background pairs must meet 4.5:1 contrast
   - Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

5. **Maintain style variations**
   - Keep dark.json for dark mode
   - Keep block/*.json for block styles
   - Keep sections/*.json for section styles

### ❌ DON'T

1. **Don't simplify to semantic slugs**
   - ❌ `{ "slug": "small", "size": "1rem" }`
   - ✅ `{ "slug": "200", "size": "1rem", "fluid": {...} }`

2. **Don't remove fluid configuration**
   - ❌ `{ "slug": "400", "size": "1.5rem" }`
   - ✅ `{ "slug": "400", "size": "1.5rem", "fluid": {...} }`

3. **Don't use arbitrary values**
   - ❌ `<p style="font-size: 18px">`
   - ✅ `<p class="has-300-font-size">`

4. **Don't hardcode colors**
   - ❌ `background-color: #0073aa;`
   - ✅ `background-color: var(--wp--preset--color--primary);`

5. **Don't delete style variations**
   - All files in `styles/` folder are intentional
   - Removing them breaks theme functionality

---

## Validation & Testing

### Post-Generation Validation

After generating a theme, verify design system integrity:

```bash
# 1. Check font size scale
jq '.settings.typography.fontSizes | length' theme.json
# Expected: 9 (slugs 100-900)

jq '.settings.typography.fontSizes[].slug' theme.json
# Expected: "100", "200", "300", "400", "500", "600", "700", "800", "900"

# 2. Check spacing scale
jq '.settings.spacing.spacingSizes | length' theme.json
# Expected: 10 (slugs 10-80)

jq '.settings.spacing.spacingSizes[].slug' theme.json
# Expected: "10", "20", "30", "40", "50", "56", "60", "64", "72", "80"

# 3. Check fluid typography preserved
jq '.settings.typography.fontSizes[0].fluid' theme.json
# Expected: { "min": "...", "max": "..." }

# 4. Check no unreplaced mustache variables
grep -r "{{" theme.json styles/
# Expected: 0 matches

# 5. Validate theme.json schema
npx @wordpress/scripts check-engines
```

### Contrast Testing

Test all color combinations for WCAG compliance:

```javascript
// Example contrast ratios
primary (#0073aa) on background (#ffffff) = 6.47:1 ✅
secondary (#005177) on background (#ffffff) = 9.28:1 ✅
text (#1a1a1a) on background (#ffffff) = 16.10:1 ✅
```

**Tools:**

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Browser DevTools > Accessibility > Contrast

---

## Related Documentation

- **[.github/instructions/theme-json.instructions.md](../.github/instructions/theme-json.instructions.md)** - Complete theme.json configuration standards
- **[.github/instructions/generate-theme.instructions.md](../.github/instructions/generate-theme.instructions.md)** - Theme generation process and mustache variables
- **[theme.json](../theme.json)** - Live reference implementation
- **[styles/](../styles/)** - Style variation examples

### External Resources

- [WordPress theme.json Reference](https://developer.wordpress.org/themes/block-themes/theme-json-reference/)
- [Global Settings and Styles](https://developer.wordpress.org/themes/global-settings-and-styles/)
- [Fluid Typography in WordPress](https://make.wordpress.org/core/2022/10/03/fluid-font-sizes-in-wordpress-6-1/)
- [WCAG 2.2 Contrast Guidelines](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [CSS clamp() Function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

---

## Summary Checklist

When working with the design system:

- [ ] Numeric spacing scale (10-80) preserved
- [ ] Numeric font size scale (100-900) preserved
- [ ] Fluid typography configuration intact
- [ ] All mustache variables replaced (no `{{}}` remaining)
- [ ] Style variations files present in `styles/`
- [ ] Color contrast meets WCAG 2.2 AA (4.5:1 minimum)
- [ ] Font stacks include proper fallbacks
- [ ] CSS custom properties used throughout
- [ ] theme.json validates against WordPress schema
- [ ] No arbitrary hard-coded values in templates

**Version:** 2.0 (Enhanced with AI constraints)
**Last Updated:** 2025-12-09
**Maintained By:** LightSpeedWP Engineering
