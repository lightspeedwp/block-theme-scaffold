# Proposed Styles Folder Architecture

This document details the proposed refactored styles folder structure with complete file organization, inheritance patterns, and composition examples.

---

## Complete Directory Tree

```
styles/
│
├── README.md
│   └── Overview of styles architecture, composition patterns, and quick start guide
│
├── defaults.json
│   └── Base styles extracted from root theme.json
│   └── Inherited by: All variations
│   └── Size: ~3KB
│
├── color-palettes/
│   ├── README.md
│   │   └── Colour palette documentation and usage guide
│   │
│   ├── light.json
│   │   └── Default light mode palette
│   │   └── Colours: primary, secondary, accent-*, neutral-*
│   │   └── Inherited by: light mode (default)
│   │   └── Size: ~2KB
│   │
│   ├── dark.json
│   │   └── Dark mode colour overrides
│   │   └── Uses: @media (prefers-color-scheme: dark)
│   │   └── Colours: Darkened variants of light palette
│   │   └── Inherited by: dark variation, dark-high-contrast variation
│   │   └── Size: ~2KB
│   │
│   └── high-contrast.json
│       └── WCAG AAA compliant palette (7:1 minimum contrast)
│       └── Colours: Black (#000000), White (#FFFFFF), Yellow (#FFCC00)
│       └── Inherited by: high-contrast variation
│       └── Size: ~1.5KB
│
├── typesets/
│   ├── README.md
│   │   └── Typography presets documentation
│   │
│   ├── sans-serif.json
│   │   └── Default sans-serif font stack
│   │   └── Fonts: Primary sans-serif for headings + body
│   │   └── Inherited by: light, dark, ocean variations
│   │   └── Size: ~1KB
│   │
│   ├── serif.json
│   │   └── Serif font stack alternative
│   │   └── Fonts: Primary serif for editorial/heading emphasis
│   │   └── Inherited by: serif variation (optional mix-in)
│   │   └── Size: ~1KB
│   │
│   └── monospace.json
│       └── Monospace font stack for code blocks
│       └── Fonts: Monospace font family
│       └── Inherited by: All variations (applied to code blocks only)
│       └── Size: ~1KB
│
├── block-styles/
│   ├── README.md
│   │   └── Block styles catalogue and composition guide
│   │
│   ├── buttons/
│   │   ├── primary.json
│   │   │   └── Sharp, uppercase, bold button style
│   │   │   └── Colours: primary (bg), base (text)
│   │   │   └── Spacing: 20px padding
│   │   │   └── Border: small radius preset
│   │   │   └── Size: ~1KB
│   │   │
│   │   ├── rounded.json
│   │   │   └── Rounded 50px border-radius button
│   │   │   └── Colours: primary (bg), base (text)
│   │   │   └── Spacing: 20px padding
│   │   │   └── Border: full radius preset (50px)
│   │   │   └── Size: ~1KB
│   │   │
│   │   ├── outline.json (NEW)
│   │   │   └── Inverse/outline style button
│   │   │   └── Colours: base (bg), primary (text), primary (border)
│   │   │   └── Border: 2px solid primary
│   │   │   └── Size: ~1KB
│   │   │
│   │   └── ghost.json (NEW)
│   │       └── Transparent background button
│   │       └── Colours: transparent (bg), primary (text)
│   │       └── Border: Optional 1px primary
│   │       └── Size: ~1KB
│   │
│   ├── headings/
│   │   ├── serif.json
│   │   │   └── Serif font override for h1-h6
│   │   │   └── Font: serif preset
│   │   │   └── Size: ~1KB
│   │   │
│   │   └── sans.json (NEW)
│   │       └── Sans-serif explicit override
│   │       └── Font: sans-serif preset
│   │       └── Size: ~1KB
│   │
│   ├── quotes/
│   │   └── accent.json (NEW)
│   │       └── Accent-coloured blockquote with border-left
│   │       └── Colours: accent-1 (border), neutral-100 (bg)
│   │       └── Spacing: 20px padding, 4px border-left
│   │       └── Size: ~1.5KB
│   │
│   ├── images/
│   │   └── frame.json (NEW)
│   │       └── Image with frame and shadow
│   │       └── Border: medium radius preset
│   │       └── Shadow: small preset
│   │       └── Padding: 10px frame
│   │       └── Size: ~1KB
│   │
│   ├── lists/
│   │   └── compact.json (NEW)
│   │       └── Compact list spacing variant
│   │       └── Spacing: 5px between items (vs 15px default)
│   │       └── Font: 200 (small)
│   │       └── Size: ~1KB
│   │
│   ├── tables/
│   │   └── striped.json (NEW)
│   │       └── Striped table rows with alternating colours
│   │       └── Colours: alternating neutral-100 and white
│   │       └── Border: subtle dividers
│   │       └── Size: ~1.5KB
│   │
│   ├── code/
│   │   └── dark.json (NEW)
│   │       └── Dark code block theme
│   │       └── Colours: dark bg, light text
│   │       └── Font: monospace preset
│   │       └── Shadow: medium preset
│   │       └── Size: ~1KB
│   │
│   └── separators/
│       └── subtle.json (NEW)
│           └── Subtle horizontal line
│           └── Colours: neutral-200
│           └── Height: 1px
│           └── Margin: 30px top/bottom
│           └── Size: ~1KB
│
├── section-styles/
│   ├── README.md
│   │   └── Section styles catalogue and usage guide
│   │
│   ├── hero.json
│   │   └── Full-width hero cover section
│   │   └── Layout: 16:9 aspect ratio, 400px min-height
│   │   └── Spacing: 80px padding (responsive via clamp)
│   │   └── Colours: contrast overlay
│   │   └── Border: medium radius
│   │   └── Size: ~2KB
│   │
│   ├── content-box.json
│   │   └── Card-style content container
│   │   └── Spacing: 40px padding (responsive)
│   │   └── Shadow: small preset
│   │   └── Border: medium radius
│   │   └── Layout: Gap 30px (blockGap)
│   │   └── Size: ~2KB
│   │
│   ├── footer.json (NEW)
│   │   └── Footer-specific spacing and layout
│   │   └── Spacing: 60px top (section padding), 20px between columns
│   │   └── Background: neutral-900
│   │   └── Text colour: base
│   │   └── Size: ~1.5KB
│   │
│   ├── testimonial.json (NEW)
│   │   └── Testimonial card layout
│   │   └── Spacing: 40px padding
│   │   └── Border: small radius
│   │   └── Shadow: medium
│   │   └── Layout: Column with avatar + quote + name
│   │   └── Size: ~2KB
│   │
│   └── cta-banner.json (NEW)
│       └── High-contrast call-to-action banner
│       └── Colours: primary (bg), base (text)
│       └── Spacing: 60px padding (responsive)
│       └── Layout: Centered flex layout
│       └── Size: ~1.5KB
│
└── variations/
    ├── README.md
    │   └── Variation composition guide (refer to COMPOSITION-MATRIX.md)
    │   └── Rules: How to safely combine variations
    │   └── Inheritance: Which files override which
    │   └── Testing: How to validate combinations
    │
    ├── COMPOSITION-MATRIX.md
    │   └── Matrix showing which variations can be combined
    │   └── Example: dark + serif + high-contrast = valid
    │   └── Example: dark + light = invalid (mutual exclusion)
    │
    ├── dark.json
    │   ├── Composes: defaults + color-palettes/dark
    │   ├── What it does: Applies dark mode colours globally
    │   ├── Used when: @media (prefers-color-scheme: dark) matches
    │   ├── Customisations: Shadow opacity, text contrast
    │   └── Size: ~2KB
    │
    ├── high-contrast.json
    │   ├── Composes: defaults + color-palettes/high-contrast
    │   ├── What it does: WCAG AAA compliant styling
    │   ├── Used when: Explicitly selected by user or @media (prefers-contrast: more)
    │   ├── Customisations: All colours replaced, focus indicators thicker
    │   └── Size: ~2KB
    │
    ├── compact.json (NEW)
    │   ├── Composes: defaults + reduced spacing
    │   ├── What it does: Tighter spacing throughout theme
    │   ├── Customisations: All spacing reduced by 30%, font sizes reduced 10%
    │   └── Size: ~1.5KB
    │
    ├── ocean.json (NEW - EXAMPLE)
    │   ├── Composes: defaults + custom ocean colours
    │   ├── What it does: Alternative brand colour theme
    │   ├── Customisations: primary → #006994, accent → #0099cc
    │   └── Size: ~2KB
    │
    └── ocean-serif.json (NEW - EXAMPLE)
        ├── Composes: ocean + typesets/serif
        ├── What it does: Ocean colours + serif fonts
        ├── Customisations: Both colour and typography
        └── Size: ~2KB

```

---

## File Size Summary

| Category | Count | Avg Size | Total |
|----------|-------|----------|-------|
| Colour Palettes | 3 | 1.5KB | 4.5KB |
| TypeSets | 3 | 1KB | 3KB |
| Block Styles | 11 | 1.2KB | 13.2KB |
| Section Styles | 5 | 1.6KB | 8KB |
| Variations | 5 | 1.8KB | 9KB |
| **Total** | **27** | **1.4KB** | **37.7KB** |

**Comparison:**

- Current flat structure: ~8 files, ~12KB
- Proposed modular structure: ~27 files, ~37.7KB (distributed, composable)
- Per-file overhead negligible; gained reusability significant

---

## Inheritance Patterns

### Pattern 1: Simple Variation (Dark Mode)

```
defaults.json
    ↓
color-palettes/dark.json
    ↓
variations/dark.json
    ↓
RENDERED: Dark mode theme
```

### Pattern 2: Composition (Ocean + Serif)

```
defaults.json
    ├─ typesets/serif.json
    └─ color-palettes/ocean.json
        ↓
    variations/ocean-serif.json
        ↓
    RENDERED: Ocean colours + serif typography
```

### Pattern 3: Block Style Resolution

```
defaults.json (global presets)
    ↓
color-palettes/dark.json (active)
    ↓
block-styles/buttons/primary.json (preset references)
    ↓
RENDERED: Primary button with dark mode colours
```

### Pattern 4: Complex Composition (Dark + High-Contrast + Serif)

```
defaults.json
    ├─ color-palettes/dark.json
    ├─ color-palettes/high-contrast.json
    └─ typesets/serif.json
        ↓
    variations/dark.json (base)
    variations/high-contrast.json (override contrast)
    typesets/serif.json (override fonts)
        ↓
    RENDERED: Dark mode + high contrast + serif
    (Note: Only if all are specified as active)
```

---

## File Templates

### Block Style Template

```json
{
  "version": 3,
  "styles": {
    "blocks": {
      "core/[BLOCK_NAME]": {
        "color": {
          "background": "var:preset|color|[SLUG]",
          "text": "var:preset|color|[SLUG]"
        },
        "typography": {
          "fontSize": "var:preset|font-size|[SLUG]"
        },
        "spacing": {
          "padding": {
            "top": "var:preset|spacing|[SLUG]"
          }
        },
        "border": {
          "radius": "var:preset|border-radius|[SLUG]"
        }
      }
    }
  }
}
```

### Section Style Template

```json
{
  "version": 3,
  "styles": {
    "blocks": {
      "core/group": {
        "spacing": {
          "padding": {
            "top": "var:preset|spacing|[SLUG]",
            "right": "var:preset|spacing|[SLUG]",
            "bottom": "var:preset|spacing|[SLUG]",
            "left": "var:preset|spacing|[SLUG]"
          },
          "blockGap": "var:preset|spacing|[SLUG]"
        },
        "border": {
          "radius": "var:preset|border-radius|[SLUG]"
        }
      }
    }
  }
}
```

### Variation Template

```json
{
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#[HEX]", "name": "[NAME]" }
      ]
    }
  }
}
```

---

## Migration Path

### Phase 1: Structure (Week 1)

- [ ] Create new folder structure
- [ ] Extract `defaults.json` from root
- [ ] Move existing files to new locations
- [ ] Update imports in `theme.json`

### Phase 2: Extraction (Week 2)

- [ ] Extract `color-palettes/light.json`
- [ ] Move dark palette to `color-palettes/dark.json`
- [ ] Extract `typesets/sans-serif.json`

### Phase 3: Enhancement (Week 3)

- [ ] Create new block styles (10+)
- [ ] Create new section styles (5+)
- [ ] Create new variations (3+)

### Phase 4: Documentation (Week 4)

- [ ] Update all README files
- [ ] Create COMPOSITION-MATRIX.md
- [ ] Add unit tests
- [ ] Add CI/CD validation

---

## Quick Reference: Common Presets

### Colours

- `primary` — Main brand colour
- `secondary` — Secondary brand colour
- `accent-1` → `accent-9` — Accent variants
- `neutral-100` → `neutral-900` — Neutral scale
- `base` — Page background
- `contrast` — Text/foreground

### Spacing

- `10` → `100` — Numeric spacing scale
- All use `clamp()` for fluid responsiveness

### Font Sizes

- `100` → `900` — Numeric font size scale
- All use fluid typography

### Border Radius

- `none` — 0px
- `small` — 4px
- `medium` — 8px
- `large` — 16px
- `full` — 9999px (circles)

### Shadows

- `small` — 0 1px 3px
- `medium` — 0 4px 6px
- `large` — 0 10px 15px
- `x-large` — 0 20px 25px

---

## Next Steps

1. Create folder structure locally
2. Extract and move existing files
3. Update `theme.json` imports
4. Run tests to verify all presets resolve
5. Add new block and section styles
6. Create composition documentation
7. Implement CI/CD validation
