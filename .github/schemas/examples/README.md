# Theme Configuration Examples

This directory contains pre-built configuration examples for common theme types. Use these as starting points for your own theme generation.

## Available Examples

### 1. Tour Operator (`tour-operator.config.json`)

A vibrant theme optimized for travel agencies, tour operators, and adventure guides.

**Features:**

- Green primary color (#2E7D32) for nature/travel feel
- Wide layout (900px content, 1400px wide)
- Poppins & Inter font combination for modern look
- Built for destination showcases and booking information

**Use when:**

- Creating travel/tourism websites
- Building tour operator platforms
- Designing adventure or eco-tourism sites

**Generate:**

```bash
cp tour-operator.config.json my-tour-theme.json
node scripts/generate-theme.js --config my-tour-theme.json
```

---

### 2. Blog Pro (`blog-pro.config.json`)

A clean, serif-based theme optimized for content creators and bloggers.

**Features:**

- Classic serif typography (Georgia & Lora) for readability
- Narrow content width (680px) for optimal reading
- Subtle color scheme for focus on content
- Optimized for long-form articles

**Use when:**

- Creating personal or professional blogs
- Building content publishing sites
- Designing writer/journalist portfolios

**Generate:**

```bash
cp blog-pro.config.json my-blog.json
node scripts/generate-theme.js --config my-blog.json
```

---

### 3. E-Commerce Hub (`ecommerce-hub.config.json`)

A feature-rich theme optimized for online stores and product catalogs.

**Features:**

- Bold primary color (#C41E3A) for conversion
- Wide layout (1000px content, 1400px wide) for product displays
- Sans-serif fonts (Montserrat & Open Sans) for clarity
- Accent color (#FFB300) for CTAs and highlights

**Use when:**

- Creating online stores
- Building product catalogs
- Designing e-commerce platforms
- Showcasing physical products

**Generate:**

```bash
cp ecommerce-hub.config.json my-store.json
node scripts/generate-theme.js --config my-store.json
```

---

### 4. Agency Pro (`agency-pro.config.json`)

A sophisticated, minimalist theme for creative studios and agencies.

**Features:**

- Monospace headings (Space Mono) for contemporary look
- Modern sans-serif body (Roboto)
- High contrast colors for portfolio showcase
- Accent color for project highlights

**Use when:**

- Creating agency portfolios
- Building creative studio websites
- Designing professional service sites
- Showcasing design work

**Generate:**

```bash
cp agency-pro.config.json my-agency.json
node scripts/generate-theme.js --config my-agency.json
```

---

## Using Examples

### Option 1: Copy and Customize

```bash
# Copy the example you like
cp tour-operator.config.json my-custom-theme.json

# Edit with your details
nano my-custom-theme.json

# Generate your theme
node scripts/generate-theme.js --config my-custom-theme.json
```

### Option 2: Reference Values

Look at the color palette, typography, and layout settings in your chosen example and use them as reference when generating interactively:

```bash
# Look at tour-operator.config.json
cat tour-operator.config.json

# Use values in interactive generation
node scripts/generate-theme.js
# Follow prompts, using values from example as inspiration
```

---

## Configuration Schema

All examples follow the JSON schema at `../../schemas/theme-config.schema.json`.

**Required fields in all examples:**

- `theme_slug` - URL-safe theme identifier
- `theme_name` - Display name
- `author` - Author name
- `author_uri` - Author website

**Optional sections in all examples:**

- `design_system.colors` - Color palette
- `design_system.typography` - Font families and weights
- `design_system.layout` - Content widths
- `content` - Default text strings

---

## Creating Your Own Example

To add a new example:

1. **Copy the template:**

   ```bash
   cp tour-operator.config.json my-example.config.json
   ```

2. **Customize values:**
   - Update `theme_slug`, `theme_name`, `author`
   - Adjust colors, fonts, and layout
   - Modify content strings if needed

3. **Validate:**

   ```bash
   node scripts/lib/config-schema.js --schema > schema.json
   ajv validate -s schema.json -d my-example.config.json
   ```

4. **Test generation:**

   ```bash
   node scripts/generate-theme.js --config my-example.config.json
   cd output-theme && npm run build
   ```

5. **Document in this README:**
   - Add section with theme purpose
   - List key features
   - Provide use cases
   - Include generation command

---

## Color Palette Reference

| Theme | Primary | Secondary | Accent | Text |
|-------|---------|-----------|--------|------|
| Tour Operator | #2E7D32 (Green) | #1565C0 (Blue) | #FF6F00 (Orange) | #212121 (Dark) |
| Blog Pro | #0073AA (Blue) | #005177 (Navy) | #C33C55 (Red) | #1A1A1A (Black) |
| E-Commerce | #C41E3A (Red) | #003F87 (Navy) | #FFB300 (Gold) | #222222 (Dark) |
| Agency Pro | #1A1A1A (Black) | #666666 (Gray) | #FF00FF (Magenta) | #333333 (Dark) |

---

## Typography Reference

| Theme | Headings | Body |
|-------|----------|------|
| Tour Operator | Poppins 700 | Inter 400 |
| Blog Pro | Georgia 700 | Lora 400 |
| E-Commerce | Montserrat 700 | Open Sans 400 |
| Agency Pro | Space Mono 700 | Roboto 400 |

---

## Tips for Customizing

### Color Selection

- **Primary**: Your brand color (most used)
- **Secondary**: Complementary color
- **Accent**: High-contrast for CTAs
- **Neutral**: Grays for text and borders

### Typography

- Pair fonts from [Google Fonts](https://fonts.google.com/metadata/fonts)
- Display + Body combinations work best
- Test readability at small sizes
- Ensure sufficient contrast (WCAG AA: 4.5:1)

### Layout

- **Narrow** (600-720px): Blog and reading-focused
- **Standard** (800-900px): Most websites
- **Wide** (1000px+): E-commerce and portfolios
- Set wide width 1.5x to 2x wider than content width

---

## Troubleshooting

**Schema validation errors?**

```bash
# Check if config matches schema
node scripts/lib/config-schema.js --schema
```

**Theme generation fails?**

```bash
# Test config validation
node scripts/generate-theme.js --config my-theme.json
```

**Colors not looking right?**

- Use hex color picker (e.g., [Coolors.co](https://coolors.co))
- Verify colors pass accessibility check (4.5:1 contrast)
- Test with color blindness simulator

---

## Related Documentation

- [GENERATE_THEME.md](../../docs/GENERATE_THEME.md) - Complete theme generation guide
- [theme-config.schema.json](../theme-config.schema.json) - JSON Schema definition
- [theme-config.template.json](../../theme-config.template.json) - Blank template
- [generate-theme.instructions.md](../instructions/generate-theme.instructions.md) - Detailed instructions

---

**Last updated:** 2025-12-10
**Status:** ✅ Ready for use
