---
description: "Extract design tokens from a Figma styleguide or design system and apply them to a WordPress block theme"
---

# Extract Design Tokens from Styleguide

This prompt guides AI agents through extracting design tokens from external design sources (Figma styleguides, brand guidelines, design systems) and integrating them into a WordPress block theme.

## What This Does

This workflow will:
1. Fetch and analyze design system documentation
2. Extract comprehensive design tokens (colors, typography, spacing, components)
3. Map tokens to WordPress theme.json structure
4. Update theme.json with all design system values
5. Create block style variations for component variants
6. Build branded patterns (header, footer, etc.)
7. Compile SCSS to CSS
8. Document design decisions and token sources

## Prerequisites

- A WordPress block theme based on block-theme-scaffold
- Access to design system documentation (Figma site URL, brand guidelines, or design file)
- Theme must have theme.json, block styles file, and SCSS structure

## Usage

### Option 1: Figma Published Site

```
Please extract design tokens from the following Figma styleguide and apply them to the theme:
https://example.figma.site/styleguide

Focus on:
- Complete color palette (primary, secondary, base colors)
- Typography (font families, sizes, heading hierarchy)
- Spacing scale
- Component variants (buttons, badges, cards)
- Layout widths
```

### Option 2: Figma Design File (with Figma MCP)

```
Please extract design tokens from Figma file [FILE_KEY] and apply them to the theme:

Use the Figma MCP tools to:
- Get design context and variables
- Extract color styles and typography
- Pull spacing and layout values
- Map to theme.json structure
```

### Option 3: Brand Guidelines Document

```
Please review the brand guidelines at [URL] and extract design tokens for the theme:

Extract:
- Brand colors with hex values
- Typography specifications
- Spacing and layout rules
- Component designs
```

## Expected Inputs

The AI agent will need:

1. **Design Source URL** - Figma site, brand guidelines, or design documentation
2. **Theme Directory** - Path to WordPress theme (usually current directory)
3. **Brand Information** - Theme name, slug, primary brand identity

## Workflow Steps

The agent will execute these steps automatically:

### Step 1: Fetch Design System

- Use `fetch_webpage` for web-based styleguides
- Use Figma MCP tools for Figma files
- Parse HTML/content to extract design tokens

### Step 2: Extract Tokens

Create comprehensive inventory:
- **Colors**: 10-15 semantic colors (primary, secondary, base, accent, states)
- **Typography**: Font families with weights, font size scale (8-12 sizes)
- **Spacing**: 8-10 spacing tokens in 4px or 8px increments
- **Layout**: Content width, wide width, container max-width
- **Radius**: 4-6 border radius values
- **Shadows**: 3-5 shadow presets
- **Components**: Button variants, badges, cards, forms

### Step 3: Update theme.json

Map extracted tokens to WordPress theme.json:
- `settings.color.palette` - All colors
- `settings.color.gradients` - Brand gradients
- `settings.typography.fontFamilies` - Font stacks
- `settings.typography.fontSizes` - Complete size scale
- `settings.spacing.spacingSizes` - Spacing tokens
- `settings.layout` - Content/wide widths
- `settings.border.customRadius` - Border radius values
- `styles.elements` - Global element styles (buttons, headings, links)

### Step 4: Register Block Styles

Update `inc/block-styles.php`:
- Button variants (secondary, outline, ghost, destructive)
- Badge/label styles
- Card group styles
- Quote styles
- Image variants

### Step 5: Style Components

Update `src/css/style.scss`:
- Button variant styles matching design system
- Badge component styles
- Card hover effects
- Quote with left border
- Article content typography
- Custom CSS variables for tokens

### Step 6: Build Patterns

Create or update branded patterns:
- Header pattern with brand colors and fonts
- Footer pattern with brand styling
- Front-page template
- Post card pattern
- Hero sections
- Call-to-action patterns

### Step 7: Compile & Validate

- Run `npm run build` to compile SCSS
- Validate theme.json syntax
- Check for compilation errors
- Document token sources

## Output Artifacts

After completion, you will have:

1. **Updated theme.json** with complete design system
2. **Block style registrations** in `inc/block-styles.php`
3. **CSS component styles** in `src/css/style.scss`
4. **Compiled CSS** in `build/css/` directory
5. **Branded patterns** in `patterns/` directory
6. **Updated templates** (if applicable)
7. **Design system documentation** (recommended)

## Example Invocation

### Full Extraction

```
I have a Figma styleguide at https://brand.figma.site/design-system

Please extract the complete design system and apply it to this WordPress theme:
1. Extract all colors, typography, spacing, and component specs
2. Update theme.json with all design tokens
3. Create block styles for button variants, badges, and cards
4. Update the header and footer patterns with brand styling
5. Build the theme assets
6. Document the design decisions

The theme is called "My Brand" with slug "my-brand-theme"
```

### Incremental Update

```
Please review the updated brand guidelines at [URL] and update only the color palette and typography in theme.json. Keep existing spacing and layout values.
```

### Component-Focused

```
From the design system at [URL], extract only the button variants and badge styles. Create block style registrations and CSS for:
- Primary, secondary, outline, ghost, and destructive buttons
- Default, secondary, and outline badges
```

## Configuration Options

### Color Extraction
- Include hover/active states: `yes/no`
- Extract gradients: `yes/no`
- Semantic naming only: `yes/no`

### Typography Extraction
- Fluid typography for headings: `yes/no`
- Include font weights: `yes/no`
- Extract line heights: `yes/no`

### Component Generation
- Create all button variants: `yes/no`
- Generate badge styles: `yes/no`
- Build card components: `yes/no`
- Create patterns: `yes/no`

## Validation Checklist

After extraction, verify:
- [ ] All colors use semantic names (not "red" or "blue")
- [ ] Font sizes include heading hierarchy (H1-H6)
- [ ] Spacing scale uses consistent base unit
- [ ] Layout widths are appropriate (typically 900px content, 1280px wide)
- [ ] Button variants have hover states
- [ ] Block styles registered in PHP
- [ ] Component CSS compiled successfully
- [ ] `npm run build` completes without errors
- [ ] theme.json validates successfully

## Troubleshooting

### Figma Site Not Loading
- Verify URL is a published Figma site (*.figma.site/*)
- Check if site requires authentication
- Try alternative: Share PDF export or screenshots

### Missing Design Tokens
- Styleguide may not include all tokens
- Agent will use sensible defaults for missing values
- Review and adjust extracted values manually if needed

### CSS Compilation Errors
- Check SCSS syntax in `src/css/style.scss`
- Verify CSS variable references are correct
- Run `npm run lint:css` to identify issues

### Theme.json Validation Errors
- Run `npm run validate:theme-json`
- Check JSON syntax (trailing commas, quotes)
- Verify color/font values are valid

## Best Practices

1. **Start with complete extraction** - Get all tokens in one pass
2. **Use semantic naming** - `primary` not `red`, `secondary` not `blue`
3. **Include hover states** - All interactive elements need :hover styles
4. **Document sources** - Note where design tokens came from
5. **Test in WordPress** - View theme in WordPress editor to verify
6. **Commit incrementally** - Commit theme.json, block styles, CSS separately

## Related Documentation

- See `.github/instructions/design-tokens-extraction.instructions.md` for complete workflow
- See `.github/instructions/theme-json.instructions.md` for theme.json standards
- See `.github/instructions/block-theme-development.instructions.md` for patterns and templates
- See `docs/THEME_JSON.md` for theme.json structure reference

## Example: Die Papier Workflow

```
User: "Please review the styleguide at https://diepapier-alt.figma.site/stylgids and extract the design system for Die Papier theme"

Agent Actions:
1. ✅ Fetched styleguide HTML
2. ✅ Extracted 10 brand colors (primary #D70025, secondary #142135, etc.)
3. ✅ Extracted typography (Inter for body, Raleway for headings)
4. ✅ Extracted spacing scale (4px-40px)
5. ✅ Updated theme.json with 8+ modifications
6. ✅ Registered 11 block styles (buttons, badges, cards)
7. ✅ Created component CSS with brand styling
8. ✅ Built header/footer patterns with navy branding
9. ✅ Created front-page template with news grid
10. ✅ Compiled SCSS successfully

Result: Fully branded Die Papier theme with complete design system integration
```

## Success Criteria

A successful design token extraction results in:
- Complete theme.json with all design system values
- All component variants styled and functional
- Branded patterns (header, footer, templates)
- Compiled CSS without errors
- Validated theme.json
- Documentation of design decisions
- Theme ready for WordPress activation

Use this prompt to guide AI agents in extracting and applying design tokens from any design system to a WordPress block theme.
