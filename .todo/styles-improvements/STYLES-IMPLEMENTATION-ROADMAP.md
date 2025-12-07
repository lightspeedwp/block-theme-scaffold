# Styles Folder Refactoring & WordPress 6.9 Enhancement Roadmap

## Overview

This document outlines all tasks required to fully leverage WordPress 6.9 capabilities and refactor the `styles/` folder for maintainability, composability, and consistency. Tasks are grouped by priority level and implementation phase.

**Current Status:** Framework solid, significant gaps in utilisation and architecture.

**Target Outcome:** Production-ready composable style system with complete block-level settings, comprehensive presets, and full WCAG AA accessibility compliance.

---

## Priority Matrix

### 🔴 P0: Critical Gaps (Must Fix Before Production)

These address fundamental gaps between declared capabilities and actual implementation.

#### P0-1: Implement Block-Level Settings Customisation

**Status:** ❌ Not started

**What it is:** WordPress 6.9 allows per-block preset restrictions and customisations in `theme.json`.

**Current gap:** All settings are global. No block-level customisation exists.

**Implementation:**

1. Add `settings.blocks` object to `theme.json`:

```json
{
  "settings": {
    "blocks": {
      "core/button": {
        "color": {
          "palette": [
            { "slug": "primary", "color": "#0066cc" },
            { "slug": "secondary", "color": "#cccccc" }
          ]
        },
        "typography": {
          "customFontSize": false
        }
      },
      "core/navigation": {
        "spacing": {
          "blockGap": "var:preset|spacing|20"
        }
      },
      "core/image": {
        "dimensions": {
          "aspectRatios": [
            { "slug": "16-9", "ratio": "16/9" },
            { "slug": "square", "ratio": "1" }
          ]
        }
      }
    }
  }
}
```

2. Document block customisations in `docs/block-level-customisation.md`
3. Add tests in `tests/theme-json-block-settings.test.js`

**Estimate:** 4-6 hours

**Blockers:** None

---

#### P0-2: Complete Shadow System Definition

**Status:** ⚠️ Partially done (presets exist, system incomplete)

**Current gap:** Shadows declared but no scale definition or dark mode optimisation.

**Implementation:**

1. Update `theme.json` shadows with system definition:

```json
{
  "settings": {
    "shadow": {
      "defaultPresets": true,
      "customShadow": true,
      "presets": [
        { "slug": "small", "name": "Small", "shadow": "0 1px 3px rgba(0, 0, 0, 0.12)" },
        { "slug": "medium", "name": "Medium", "shadow": "0 4px 6px rgba(0, 0, 0, 0.1)" },
        { "slug": "large", "name": "Large", "shadow": "0 10px 15px rgba(0, 0, 0, 0.1)" },
        { "slug": "x-large", "name": "Extra Large", "shadow": "0 20px 25px rgba(0, 0, 0, 0.15)" }
      ]
    }
  }
}
```

2. Update `dark.json` with enhanced shadow presets:

```json
{
  "settings": {
    "shadow": {
      "presets": [
        { "slug": "small", "name": "Small", "shadow": "0 1px 3px rgba(0, 0, 0, 0.3)" },
        { "slug": "medium", "name": "Medium", "shadow": "0 4px 6px rgba(0, 0, 0, 0.4)" },
        { "slug": "large", "name": "Large", "shadow": "0 10px 15px rgba(0, 0, 0, 0.5)" },
        { "slug": "x-large", "name": "Extra Large", "shadow": "0 20px 25px rgba(0, 0, 0, 0.6)" }
      ]
    }
  }
}
```

3. Apply shadow presets to all relevant blocks (buttons, cards, sections)
4. Add shadow references to `content-section.json`
5. Document in `styles/README.md`

**Estimate:** 3-4 hours

**Blockers:** None

---

#### P0-3: Define Complete Spacing Scale with Clamp()

**Status:** ⚠️ Partially done (clamp used but no scale documented)

**Current gap:** Spacing uses `clamp()` but no clear system or documentation for consistency.

**Implementation:**

1. Define complete `spacingSizes` with documented clamp values in `theme.json`:

```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        {
          "slug": "10",
          "name": "10px",
          "size": "clamp(0.5rem, 1vw, 0.625rem)"
        },
        {
          "slug": "20",
          "name": "20px",
          "size": "clamp(0.75rem, 1.5vw, 1.25rem)"
        },
        {
          "slug": "30",
          "name": "30px",
          "size": "clamp(1rem, 2vw, 1.875rem)"
        },
        {
          "slug": "40",
          "name": "40px",
          "size": "clamp(1.5rem, 2.5vw, 2.5rem)"
        },
        {
          "slug": "50",
          "name": "50px",
          "size": "clamp(2rem, 3vw, 3.125rem)"
        },
        {
          "slug": "60",
          "name": "60px",
          "size": "clamp(2.5rem, 4vw, 3.75rem)"
        },
        {
          "slug": "70",
          "name": "70px",
          "size": "clamp(3rem, 5vw, 4.375rem)"
        },
        {
          "slug": "80",
          "name": "80px",
          "size": "clamp(3.5rem, 6vw, 5rem)"
        },
        {
          "slug": "90",
          "name": "90px",
          "size": "clamp(4rem, 7vw, 5.625rem)"
        },
        {
          "slug": "100",
          "name": "100px",
          "size": "clamp(4.5rem, 8vw, 6.25rem)"
        }
      ]
    }
  }
}
```

2. Document clamp() formula in `docs/standardising-colours-fonts-spacing.md` (✅ Done)
3. Update all block/section styles to use spacing presets
4. Add validation test for spacing consistency

**Estimate:** 2-3 hours

**Blockers:** None

---

#### P0-4: Implement Typography Scale (Line-Height & Letter-Spacing)

**Status:** ❌ Not started

**Current gap:** Font sizes defined but no consistent line-height or letter-spacing scale.

**Implementation:**

1. Add line-height and letter-spacing scale to `theme.json`:

```json
{
  "settings": {
    "typography": {
      "lineHeightScale": {
        "values": {
          "tight": "1.1",
          "normal": "1.5",
          "loose": "1.75",
          "relaxed": "2"
        }
      },
      "letterSpacingScale": {
        "values": {
          "tight": "-0.02em",
          "normal": "0",
          "wide": "0.05em",
          "wider": "0.1em"
        }
      }
    }
  }
}
```

2. Apply consistent line-height to heading and body styles
3. Document in `docs/standardising-colours-fonts-spacing.md`
4. Add tests for typography consistency

**Estimate:** 3-4 hours

**Blockers:** None

---

#### P0-5: Add Contrast Validation Tests

**Status:** ❌ Not started

**Current gap:** No WCAG contrast validation in CI/CD pipeline.

**Implementation:**

1. Create `tests/theme-json-contrast.test.js`:

```javascript
const contrastRatio = require('polished').getLuminance; // or similar

test('all colour combinations meet WCAG AA (4.5:1)', () => {
  const palette = require('../theme.json').settings.color.palette;
  const darkPalette = require('../styles/dark.json').settings.color.palette;

  for (const bg of palette) {
    for (const fg of palette) {
      const ratio = calculateContrastRatio(bg.color, fg.color);
      if (ratio < 4.5) {
        console.warn(`${bg.slug} + ${fg.slug} = ${ratio}:1 (below AA)`);
      }
      // Only enforce strict for common combinations
    }
  }
});

test('focus indicators have 3:1 contrast', () => {
  // Verify focus outline colour vs background
});
```

2. Integrate into `npm run test` pipeline
3. Document requirements in `docs/contrast-requirements.md`

**Estimate:** 2-3 hours

**Blockers:** None

---

### 🟡 P1: Important Improvements (Implement Next)

These enhance functionality and prepare the system for scale.

#### P1-1: Refactor Styles Folder for Composability

**Status:** ❌ Not started

**What it is:** Reorganise flat structure into semantic, composable folders.

**Current structure:**

```
styles/
├── blocks/
│   ├── button-primary.json
│   ├── button-rounded.json
│   └── heading-serif.json
├── sections/
│   ├── hero-section.json
│   └── content-section.json
└── dark.json
```

**Proposed structure:**

```
styles/
├── defaults.json                    # Base defaults (extracted from root theme.json)
├── color-palettes/
│   ├── light.json                   # Light mode (default)
│   ├── dark.json                    # Dark mode overrides
│   └── high-contrast.json           # WCAG AAA variant
├── typesets/
│   ├── sans-serif.json              # Default heading + body font
│   ├── serif.json                   # Alternative heading font
│   └── monospace.json               # Code blocks
├── block-styles/
│   ├── buttons/
│   │   ├── primary.json             # Sharp, uppercase
│   │   ├── rounded.json             # 50px border-radius
│   │   └── outline.json             # Inverse style (new)
│   ├── headings/
│   │   ├── serif.json               # Serif font override
│   │   └── sans.json                # Sans serif variant (new)
│   ├── quotes/
│   │   └── accent.json              # Accent-coloured quote (new)
│   ├── images/
│   │   └── frame.json               # Image frame style (new)
│   └── lists/
│       └── compact.json             # Compact list style (new)
├── section-styles/
│   ├── hero.json                    # 16:9 cover blocks
│   ├── content-box.json             # Shadowed container
│   ├── footer.json                  # Footer-specific spacing (new)
│   └── testimonial.json             # Testimonial section (new)
└── variations/
    ├── README.md                    # Variation composition guide
    ├── dark.json                    # Dark mode (composes: color-palettes/dark + defaults)
    ├── high-contrast.json           # High contrast (composes: color-palettes/high-contrast)
    └── compact.json                 # Reduced spacing (composes: defaults + spacing adjustments)
```

**Implementation:**

1. Create new folder structure
2. Extract defaults from root `theme.json` to `styles/defaults.json`
3. Move existing files to new locations
4. Create composition documentation in `styles/README.md`
5. Add validation test to ensure all files are valid

**Estimate:** 6-8 hours

**Blockers:** P0-1, P0-2, P0-3

---

#### P1-2: Create Comprehensive Block Styles Coverage

**Status:** ⚠️ Partial (3/10 core blocks)

**What it is:** Add style variations for all commonly-used WordPress core blocks.

**Current coverage:**

- ✅ Buttons (primary, rounded)
- ✅ Headings (serif)
- ✅ Sections (hero, content-box)
- ❌ Quotes
- ❌ Images
- ❌ Lists
- ❌ Tables
- ❌ Code blocks
- ❌ Separators
- ❌ Spacers

**Implementation for each new block:**

1. Create `styles/block-styles/[block-name]/[variant].json`
2. Reference presets from theme.json (no hardcoding)
3. Add unit test to verify preset references
4. Document in `styles/block-styles/README.md`

**New files to create:**

- `styles/block-styles/quotes/accent.json` — Accent-coloured quote with border
- `styles/block-styles/images/frame.json` — Image with frame and shadow
- `styles/block-styles/lists/compact.json` — Reduced spacing list variant
- `styles/block-styles/tables/striped.json` — Striped table rows
- `styles/block-styles/code/dark.json` — Dark code block theme
- `styles/block-styles/separator/subtle.json` — Subtle separator style

**Estimate:** 8-10 hours (1.5 hours per block)

**Blockers:** P1-1

---

#### P1-3: Create Section Style Variations

**Status:** ⚠️ Partial (2/5 core sections)

**Current coverage:**

- ✅ Hero section
- ✅ Content box
- ❌ Footer
- ❌ Testimonial carousel
- ❌ CTA banner

**New files to create:**

- `styles/section-styles/footer.json` — Footer-specific spacing, navigation styling
- `styles/section-styles/testimonial.json` — Testimonial card layout with avatar
- `styles/section-styles/cta-banner.json` — High-contrast CTA section

**Estimate:** 6-8 hours

**Blockers:** P1-1

---

#### P1-4: Add TypeSet/Font-Family Variations

**Status:** ❌ Not started

**What it is:** Predefined font stacks for different design systems (sans-serif, serif, mono).

**Implementation:**

Create `styles/typesets/` folder:

- `styles/typesets/sans-serif.json` — Default sans-serif (headings + body)
- `styles/typesets/serif.json` — Serif for editorial content
- `styles/typesets/monospace.json` — Monospace for code blocks

Each file:

```json
{
  "version": 3,
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "slug": "heading",
          "name": "Heading Font",
          "fontFamily": "Serif font stack"
        },
        {
          "slug": "body",
          "name": "Body Font",
          "fontFamily": "Serif font stack"
        }
      ]
    }
  }
}
```

**Estimate:** 3-4 hours

**Blockers:** None

---

#### P1-5: Create Color Palette Variations

**Status:** ⚠️ Partial (light + dark)

**What it is:** Predefined colour palettes for different themes or brands.

**New folders/files:**

- `styles/color-palettes/light.json` — Default light palette
- `styles/color-palettes/dark.json` — Dark mode overrides
- `styles/color-palettes/high-contrast.json` — WCAG AAA variant

Each high-contrast palette:

```json
{
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#000000" },
        { "slug": "base", "color": "#FFFFFF" },
        { "slug": "accent-1", "color": "#FFCC00" }
      ]
    }
  }
}
```

**Estimate:** 3-4 hours

**Blockers:** P1-1

---

#### P1-6: Add Composable Variation System Documentation

**Status:** ❌ Not started

**What it is:** Guide for safely combining variations without duplication.

**Files to create:**

- `styles/variations/README.md` — Composition rules and inheritance patterns
- `styles/variations/COMPOSITION-MATRIX.md` — Which variations can be combined
- `tests/theme-json-composition.test.js` — Verify combined variations are valid

**Example composition matrix:**

```
| Variation | Base | Colors | Fonts | Custom |
|-----------|------|--------|-------|--------|
| light     | defaults | light | sans | none |
| dark      | defaults | dark | sans | none |
| ocean     | defaults | ocean | sans | accent |
| ocean-serif | defaults | ocean | serif | accent |
| high-contrast | defaults | high-contrast | sans | none |
```

**Estimate:** 4-6 hours

**Blockers:** P1-1

---

#### P1-7: Enhance Contrast Validation & CI Integration

**Status:** ❌ Not started

**What it is:** Automated contrast checking in GitHub Actions CI/CD.

**Implementation:**

1. Create `scripts/validate-contrast.js`
2. Add GitHub Action to `.github/workflows/`
3. Fail CI if contrast ratio < 4.5:1 for critical pairs
4. Generate contrast report in PR

**Estimate:** 3-4 hours

**Blockers:** P0-5

---

### 🟢 P2: Nice-to-Have Enhancements (Phase 2)

These add polish and advanced features.

#### P2-1: Implement Duotone & Gradient Presets

**Status:** ❌ Not started

**What it is:** Predefined duotone filters and gradient combinations.

**Implementation:**

```json
{
  "settings": {
    "color": {
      "duotone": [
        {
          "slug": "primary-accent",
          "name": "Primary Accent",
          "colors": ["#0066cc", "#ffcc00"]
        }
      ],
      "gradients": [
        {
          "slug": "primary-to-secondary",
          "name": "Primary to Secondary",
          "gradient": "linear-gradient(135deg, var:preset|color|primary, var:preset|color|secondary)"
        }
      ]
    }
  }
}
```

**Estimate:** 2-3 hours

**Blockers:** None

---

#### P2-2: Create Dark Mode High-Contrast Variant

**Status:** ❌ Not started

**What it is:** WCAG AAA compliant dark mode with enhanced contrast.

**Implementation:**

Create `styles/color-palettes/dark-high-contrast.json` with:

- Increased contrast ratios (7:1 minimum for text)
- Enhanced focus indicators
- Better readability on dark backgrounds

**Estimate:** 2-3 hours

**Blockers:** None

---

#### P2-3: Add Animation & Transition Presets

**Status:** ❌ Not started

**What it is:** Standardised animation timing and easing functions.

**Implementation:**

```json
{
  "settings": {
    "transitions": {
      "presets": [
        { "slug": "fade", "duration": "300ms", "easing": "ease-in-out" },
        { "slug": "slide", "duration": "400ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)" },
        { "slug": "bounce", "duration": "600ms", "easing": "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
      ]
    }
  }
}
```

**Estimate:** 3-4 hours

**Blockers:** None

---

#### P2-4: Document Token Mapping (Figma ↔ theme.json)

**Status:** ❌ Not started

**What it is:** Maintain mapping between Figma design tokens and theme.json presets.

**Files to create:**

- `docs/design-token-mapping.md` — Comprehensive token reference table
- `TOKENS.json` — Machine-readable token map

**Estimate:** 2-3 hours

**Blockers:** P1-1

---

#### P2-5: Create Preset Generation Script

**Status:** ❌ Not started

**What it is:** Automate preset generation from design tokens.

**Implementation:**

```bash
# Generate theme.json presets from tokens.json
npm run generate:presets

# Validate all presets exist
npm run validate:presets
```

**Estimate:** 4-6 hours

**Blockers:** P2-4

---

#### P2-6: Advanced Responsive Testing Framework

**Status:** ❌ Not started

**What it is:** E2E tests for responsive style behavior.

**Implementation:**

Create `tests/e2e/styles.spec.js`:

- Test clamp() scaling across viewports
- Verify presets render correctly
- Test dark mode switching
- Validate focus indicators

**Estimate:** 4-5 hours

**Blockers:** None

---

## Architecture Refactoring Summary

### Current State (Problematic)

```
styles/
├── dark.json              ❌ Global variation, can't be combined
├── blocks/
│   ├── button-*.json      ❌ Isolated, duplicated base styles
│   └── heading-*.json     ❌ No composition system
└── sections/
    ├── hero-section.json  ❌ Scattered definitions
    └── content-*.json     ❌ Hard to maintain
```

**Problems:**

- No reusability across variations
- Difficult to test combinations
- Scattered preset references
- No clear inheritance
- Documentation unclear

### Proposed State (Maintainable)

```
styles/
├── defaults.json                    ✅ Extracted base
├── color-palettes/
│   ├── light.json                   ✅ Compose: defaults + light colours
│   ├── dark.json                    ✅ Compose: defaults + dark colours
│   └── high-contrast.json           ✅ Compose: defaults + high-contrast colours
├── typesets/
│   ├── sans-serif.json              ✅ Compose: defaults + sans fonts
│   ├── serif.json                   ✅ Compose: defaults + serif fonts
│   └── monospace.json               ✅ Compose: defaults + mono fonts
├── block-styles/
│   ├── buttons/
│   │   ├── primary.json             ✅ Complete preset references
│   │   ├── rounded.json             ✅ Complete preset references
│   │   └── outline.json             ✅ Complete preset references (NEW)
│   ├── headings/
│   │   └── serif.json               ✅ Complete preset references
│   ├── quotes/
│   │   └── accent.json              ✅ NEW
│   └── ... (more blocks)
├── section-styles/
│   ├── hero.json                    ✅ Complete preset references
│   ├── content-box.json             ✅ Complete preset references
│   ├── footer.json                  ✅ NEW
│   └── ... (more sections)
└── variations/
    ├── README.md                    ✅ Composition guide
    ├── dark.json                    ✅ Composes: color-palettes/dark
    ├── high-contrast.json           ✅ Composes: color-palettes/high-contrast
    └── COMPOSITION-MATRIX.md        ✅ NEW
```

**Advantages:**

- ✅ Clear separation of concerns
- ✅ Composable variations (dark + serif + accent)
- ✅ Single-source-of-truth presets
- ✅ Easy to add new blocks/sections
- ✅ Documented inheritance
- ✅ Testable combinations

---

## Implementation Timeline

### Phase 1: Critical Gaps (Weeks 1-2)

- P0-1: Block-level settings ✓
- P0-2: Shadow system ✓
- P0-3: Spacing scale ✓
- P0-4: Typography scale ✓
- P0-5: Contrast tests ✓

**Deliverable:** `theme.json` fully leveraging WordPress 6.9 capabilities.

### Phase 2: Refactoring (Weeks 3-4)

- P1-1: Refactor styles folder ✓
- P1-4: TypeSets ✓
- P1-5: Colour palettes ✓
- P1-6: Composition documentation ✓

**Deliverable:** Composable, maintainable styles architecture.

### Phase 3: Enhancements (Weeks 5-6)

- P1-2: Block styles coverage ✓
- P1-3: Section styles ✓
- P1-7: CI/CD integration ✓

**Deliverable:** Comprehensive block/section library.

### Phase 4: Polish (Week 7+)

- P2-1 through P2-6

**Deliverable:** Advanced features and automation.

---

## Testing Checklist

- [ ] All JSON files pass schema validation
- [ ] All preset references resolve correctly
- [ ] Block-level settings restrict options as intended
- [ ] Colour combinations meet WCAG AA contrast
- [ ] Variations compose without conflicts
- [ ] Fluid typography scales correctly (320px → 1440px)
- [ ] Dark mode overrides all colours correctly
- [ ] Focus indicators visible and high-contrast
- [ ] Editor UI reflects all presets
- [ ] No console errors when loading block editor

---

## Documentation Checklist

- [ ] `docs/standardising-colours-fonts-spacing.md` updated ✓
- [ ] `docs/block-level-customisation.md` created
- [ ] `docs/contrast-requirements.md` created
- [ ] `styles/README.md` updated with folder structure
- [ ] `styles/variations/README.md` created with composition guide
- [ ] `styles/variations/COMPOSITION-MATRIX.md` created
- [ ] `docs/design-token-mapping.md` created (P2-4)
- [ ] All new block/section styles documented

---

## Success Metrics

✅ **By end of Phase 3:**

- 100% of WordPress 6.9 features utilised
- 15+ block styles with complete preset references
- 5+ section styles with consistent spacing/sizing
- 3+ colour palette variations (light, dark, high-contrast)
- 100% WCAG AA contrast compliance
- 0 hardcoded values in any style file
- Composable variation system (documented + tested)
- CI/CD integration with validation checks

---

## Quick Start: Adding a New Block Style

Once refactoring complete (Phase 2), adding a new block style takes 15 minutes:

1. Copy existing similar block: `cp styles/block-styles/buttons/primary.json styles/block-styles/buttons/ghost.json`
2. Update `slug`, `name`, preset references only
3. Verify JSON: `npm run test`
4. Add to `styles/block-styles/README.md`
5. Commit

No need to touch `theme.json` or worry about duplication.

---

## Questions & Next Steps

1. **Ready to start Phase 1?** Begin with P0-1 (Block-level settings)
2. **Want to prioritise differently?** Let's discuss which features matter most
3. **Need estimated hours adjusted?** I can detail breakdown by task
4. **Prefer async or async support?** Happy to pair-program or async review
