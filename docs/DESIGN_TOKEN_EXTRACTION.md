# Design Token Extraction from Styleguides

This guide explains how to use the design token extraction skill to bring external design systems (Figma styleguides, brand guidelines) into your WordPress block theme.

## Overview

The design token extraction skill automates the process of:
- Fetching design system specifications from external sources
- Extracting comprehensive design tokens (colors, typography, spacing, components)
- Mapping tokens to WordPress theme.json structure
- Creating block style variations for component variants
- Building branded patterns and templates
- Compiling SCSS to production CSS

## What You Need

1. **Design Source**: URL to one of the following:
   - Figma published styleguide (*.figma.site/*)
   - Brand guidelines website
   - Design system documentation
   - Figma design file (with Figma MCP integration)

2. **WordPress Block Theme**: Based on this scaffold with:
   - `theme.json` configuration file
   - `inc/block-styles.php` for registering block variants
   - `src/css/style.scss` for component styling
   - Build system (`npm run build`)

3. **Theme Identity**: 
   - Theme name and slug
   - Author information
   - Primary brand details

## Quick Start

### Option 1: Using the Prompt File

1. Reference the prompt in your AI chat:
   ```
   Use .github/prompts/extract-design-tokens.prompt.md
   
   Please extract design tokens from: https://example.figma.site/styleguide
   
   Theme name: My Brand
   Theme slug: my-brand-theme
   ```

2. The AI agent will:
   - Fetch the styleguide
   - Extract all design tokens
   - Update theme.json completely
   - Create block styles and CSS
   - Build branded patterns
   - Compile assets

### Option 2: Direct Request

Simply ask the AI assistant:

```
Please review the styleguide at [URL] and extract the design system for my theme.

Extract:
- All brand colors with semantic names
- Typography (font families, sizes, heading hierarchy)
- Spacing scale
- Component variants (buttons, badges, cards)
- Layout widths

Then update theme.json, create block styles, and build the theme assets.
```

## What Gets Extracted

### Required Design Tokens

The skill extracts these essential design tokens:

#### Colors (10-15 tokens)
- Primary brand color
- Primary hover/active states
- Secondary/accent colors
- Base colors (white, light grays)
- Contrast colors (dark grays, black)
- Semantic colors (success, warning, error)
- Text colors (body, headings, muted)

Example output in theme.json:
```json
{
  "settings": {
    "color": {
      "palette": [
        {"slug": "primary", "color": "#D70025", "name": "Primary"},
        {"slug": "primary-hover", "color": "#9E0918", "name": "Primary Hover"},
        {"slug": "secondary", "color": "#142135", "name": "Secondary"}
      ]
    }
  }
}
```

#### Typography (Complete Font System)
- Font families with fallback stacks
- Font weights available
- Font size scale (8-12 sizes)
- Heading hierarchy (H1-H6)
- Body/UI text sizes
- Line heights

Example:
```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "slug": "inter",
          "fontFamily": "Inter, -apple-system, sans-serif",
          "name": "Inter"
        }
      ],
      "fontSizes": [
        {"slug": "xs", "size": "0.75rem", "name": "XS"},
        {"slug": "sm", "size": "0.875rem", "name": "SM"},
        {"slug": "base", "size": "1rem", "name": "Base"}
      ]
    }
  }
}
```

#### Spacing (8-10 tokens)
- Base unit (4px or 8px)
- Scale tokens (1x, 2x, 3x, 4x, 5x, 6x, 8x, 10x)
- Component padding/margins
- Section spacing

Example:
```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        {"slug": "10", "size": "4px", "name": "1"},
        {"slug": "20", "size": "8px", "name": "2"},
        {"slug": "30", "size": "12px", "name": "3"}
      ]
    }
  }
}
```

#### Layout Widths
- Content width (typically 700-900px)
- Wide width (typically 1200-1400px)
- Container max-width

#### Components
- Button variants (primary, secondary, outline, ghost, destructive)
- Badge/label styles
- Card designs
- Form inputs
- Quote styles

### Optional Tokens

If available in the design system:
- Border radius values
- Shadow presets
- Gradient definitions
- Custom icon sets
- Animation/transition timings

## What Gets Generated

After extraction, you'll have:

### 1. Updated theme.json
Complete WordPress theme configuration with:
- Color palette (all brand colors)
- Typography scale (fonts, sizes, weights)
- Spacing system (8-10 tokens)
- Layout widths (content/wide)
- Border radius values
- Global element styles (buttons, headings, links)
- Heading styles (H1-H6)

### 2. Block Style Registrations
File: `inc/block-styles.php`

Registered block variants:
- Button styles (secondary, outline, ghost, destructive)
- Badge/label styles (for paragraphs)
- Card styles (for groups)
- Image variants (rounded, rounded-lg)
- Quote styles

### 3. Component CSS
File: `src/css/style.scss`

SCSS with:
- Button variant styles
- Badge component styles
- Card hover effects
- Quote left border
- Article content typography
- Custom CSS variables

### 4. Branded Patterns
Files: `patterns/*.php`

Updated patterns:
- Header (with brand colors, fonts)
- Footer (branded styling)
- Post cards (matching design system)
- Optional: Hero, CTA, Newsletter sections

### 5. Compiled Assets
Directory: `build/`

Production-ready:
- Compiled CSS (`build/css/style.css`)
- Minified JavaScript
- RTL stylesheets
- Source maps

## Example: Die Papier Workflow

Real-world example from Die Papier theme generation:

**Input:**
```
Please review the styleguide at https://diepapier-alt.figma.site/stylgids
and build the design system into the theme.
```

**Agent Actions:**
1. ✅ Fetched Figma styleguide HTML
2. ✅ Extracted 10 brand colors (primary #D70025 red, secondary #142135 navy)
3. ✅ Extracted typography (Inter body, Raleway headings with weights)
4. ✅ Extracted spacing scale (4px-40px in 8 steps)
5. ✅ Updated theme.json (8 major updates: colors, fonts, sizes, spacing, layout, radius, global styles, headings)
6. ✅ Registered 11 block styles (3 buttons, 3 badges, 1 card, 2 images, 2 quotes)
7. ✅ Created component CSS (button variants, badges, cards with shadows)
8. ✅ Built header pattern (navy background, white text, Raleway 900 logo)
9. ✅ Built footer pattern (3-column, social links, Afrikaans content)
10. ✅ Created front-page template (hero, 3-col news grid, newsletter CTA)
11. ✅ Compiled SCSS successfully

**Result:**
- Fully branded Die Papier theme
- Complete design system in theme.json
- 11 component variants ready to use
- Production CSS compiled
- Ready for WordPress activation

## Validation & Testing

### Automated Checks

The skill runs these validations:

```bash
# Validate theme.json syntax
npm run validate:theme-json

# Build assets
npm run build

# Lint CSS
npm run lint:css

# Lint JavaScript
npm run lint:js
```

### Manual Verification

After extraction, verify:

1. **theme.json**
   - [ ] All colors use semantic names (not "red" or "blue")
   - [ ] Font sizes include heading hierarchy
   - [ ] Spacing uses consistent base unit
   - [ ] Layout widths are appropriate

2. **Block Styles**
   - [ ] All variants registered in `inc/block-styles.php`
   - [ ] CSS exists for each variant
   - [ ] Hover states work correctly
   - [ ] Colors match design system

3. **Patterns**
   - [ ] Header uses brand colors
   - [ ] Footer styled correctly
   - [ ] Content matches brand voice

4. **Build**
   - [ ] `npm run build` completes without errors
   - [ ] CSS compiles successfully
   - [ ] No linting errors

### Test in WordPress

1. Activate theme in WordPress
2. Create a new post
3. Test block styles (buttons, badges, cards)
4. Verify colors in editor match styleguide
5. Check typography renders correctly
6. Test responsive behavior

## Customization Options

### Extract Only Specific Tokens

```
Please extract only the color palette and typography from [URL].
Keep existing spacing and layout values.
```

### Component-Focused Extraction

```
From the design system at [URL], extract only button variants:
- Primary, secondary, outline, ghost, destructive
Create block styles and CSS for these buttons only.
```

### Incremental Updates

```
Please review the updated brand guidelines at [URL] and update
the color palette in theme.json. The primary color changed from
#D70025 to #E60028.
```

## Troubleshooting

### Issue: Styleguide Not Accessible

**Problem:** AI cannot fetch the design system URL

**Solutions:**
- Verify URL is publicly accessible
- Check if authentication is required
- Try alternative: Export PDF and share publicly
- Use Figma MCP tools with design file instead

### Issue: Missing Design Tokens

**Problem:** Styleguide doesn't include all tokens

**Solutions:**
- Agent will use sensible defaults for missing values
- Review extracted values and adjust manually
- Reference WordPress theme defaults for guidance
- Consult brand team for missing specifications

### Issue: CSS Compilation Errors

**Problem:** `npm run build` fails with SCSS errors

**Solutions:**
- Check SCSS syntax in `src/css/style.scss`
- Verify CSS variable references: `var(--wp--preset--color--primary)`
- Run `npm run lint:css` to identify issues
- Check for typos in color/spacing slugs

### Issue: theme.json Validation Errors

**Problem:** Invalid JSON syntax

**Solutions:**
- Run `npm run validate:theme-json`
- Check for trailing commas (not allowed in JSON)
- Verify all quotes are double quotes
- Ensure color hex values include `#`

## Best Practices

### 1. Complete Extraction First
Extract the entire design system in one pass rather than incrementally. This ensures consistency across all tokens.

### 2. Use Semantic Naming
- ✅ Good: `primary`, `secondary`, `accent`, `base`, `contrast`
- ❌ Bad: `red`, `blue`, `gray`, `black`, `color1`

### 3. Include Interactive States
All interactive components need hover states:
- Buttons: `:hover`, `:active`, `:disabled`
- Links: `:hover`, `:visited`
- Forms: `:focus`, `:focus-visible`

### 4. Document Token Sources
Add comments in theme.json:
```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "_comment": "Design tokens from Brand Styleguide (https://...) - Extracted Feb 2026"
}
```

### 5. Test Thoroughly
- Test in WordPress block editor
- Verify all patterns render correctly
- Check responsive behavior
- Test dark mode (if applicable)
- Validate accessibility

### 6. Commit Incrementally
Break changes into logical commits:
1. `theme.json` updates
2. Block style registrations
3. Component CSS
4. Pattern updates
5. Compiled assets

## Related Documentation

- [Design Token Extraction Instructions](../.github/instructions/design-tokens-extraction.instructions.md) - Complete AI workflow
- [Theme.json Instructions](../.github/instructions/theme-json.instructions.md) - Theme configuration standards
- [Block Theme Development](../.github/instructions/block-theme-development.instructions.md) - General theme guidelines

## Need Help?

If you encounter issues with design token extraction:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [instruction file](../.github/instructions/design-tokens-extraction.instructions.md) for detailed workflow
3. See the [Die Papier example](#example-die-papier-workflow) for reference
4. Ask the AI: "Please review the design token extraction errors and suggest fixes"

## Summary

The design token extraction skill provides:
- **Automated workflow** for bringing external design systems into WordPress
- **Complete theme.json updates** with all design tokens properly mapped
- **Block style variations** for component-based design
- **Branded patterns** matching your design system
- **Production-ready assets** compiled and optimized

Start by referencing [.github/prompts/extract-design-tokens.prompt.md](../.github/prompts/extract-design-tokens.prompt.md) and providing your styleguide URL, and the AI will handle the rest.
