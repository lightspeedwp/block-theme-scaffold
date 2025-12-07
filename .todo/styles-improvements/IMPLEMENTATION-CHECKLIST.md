# Implementation Checklist & Quick Reference

## Document Map

| Document | Purpose | Read Time | Action |
|----------|---------|-----------|--------|
| [WORDPRESS-6.9-COMPLIANCE-SUMMARY.md](WORDPRESS-6.9-COMPLIANCE-SUMMARY.md) | Executive overview, red flags, ROI analysis | 10 min | **Start here** |
| [STYLES-IMPLEMENTATION-ROADMAP.md](STYLES-IMPLEMENTATION-ROADMAP.md) | Complete task breakdown, P0-P2 priorities, effort estimates | 20 min | For planning |
| [PROPOSED-STYLES-ARCHITECTURE.md](PROPOSED-STYLES-ARCHITECTURE.md) | Folder structure, file templates, inheritance patterns | 15 min | For implementation |
| [docs/standardising-colours-fonts-spacing.md](docs/standardising-colours-fonts-spacing.md) | **Updated** with fluid typography, block-level settings, preset application | 30 min | Reference |

---

## One-Page Quick Reference

### Current Gaps (What's Missing)

| Gap | Priority | Impact | Est. Hours |
|-----|----------|--------|-----------|
| Block-level settings | P0 | Editors uncontrolled | 4-6 |
| Shadow system incomplete | P0 | Inconsistent depth | 3-4 |
| Spacing scale undocumented | P0 | Hidden logic | 2-3 |
| Typography scale incomplete | P0 | Inconsistent hierarchy | 3-4 |
| No contrast validation | P0 | Accessibility risk | 2-3 |
| Fragmented styles folder | P1 | Hard to maintain | 6-8 |
| Limited block styles | P1 | Poor editor UX | 8-10 |

**Total Phase 1 (P0):** 14-18 hours
**Total Phase 1+2:** 24-36 hours

---

### Proposed Folder Structure (at a glance)

```
styles/
├── defaults.json                          (base, inherited by all)
├── color-palettes/                        (light, dark, high-contrast)
├── typesets/                              (sans, serif, mono)
├── block-styles/                          (buttons, headings, quotes, images, lists, tables, code, separators)
├── section-styles/                        (hero, content-box, footer, testimonial, cta-banner)
└── variations/                            (dark, high-contrast, compact, ocean, ocean-serif)
```

**Result:** 27 files vs 7 files (today) = Modular, composable, maintainable

---

### Key Concepts Explained

#### 1. Why `clamp()` instead of `spacingScale` operator?

```css
spacingScale (old):  Math-based, fixed breakpoints, unpredictable
clamp()      (new):  Viewport-aware, smooth scaling, responsive without media queries

Example:
clamp(0.5rem, 1vw, 0.625rem)
       ↓       ↓     ↓
      min     preferred  max

At 320px:  0.5rem   (minimum)
At 640px:  0.57rem  (scaled, 1.6% of viewport)
At 1440px: 0.625rem (maximum, capped)
```

#### 2. Why numeric slugs instead of semantic names?

```
Semantic (❌): "extra-small", "small", "medium"
→ CSS: --wp--preset--spacing--extra-small (verbose, unclear)
→ Problem: Doesn't scale (what comes after "gigantic"?)

Numeric (✅): "10", "20", "30"
→ CSS: --wp--preset--spacing--10 (clean, predictable)
→ Advantage: Scales infinitely (10→100), machine-readable
```

#### 3. Block-level settings (what & why)

```json
{
  "settings": {
    "blocks": {
      "core/button": {
        "color": {
          "palette": [
            {"slug": "primary", "color": "#0066cc"},
            {"slug": "secondary", "color": "#cccccc"}
          ]
        }
      }
    }
  }
}
```

**Result:** Buttons restricted to 2 colours instead of 20 → Brand consistency ✅

#### 4. How presets apply across files

```
theme.json (global presets)
    ↓
button-primary.json (block style)
    ├─ color.background: var:preset|color|primary  → Looks up primary colour
    ├─ spacing.padding: var:preset|spacing|20      → Looks up spacing 20
    └─ border.radius: var:preset|border-radius|small → Looks up small radius

dark.json (active variation)
    ├─ Overrides: primary colour → darker version
    └─ Result: Button automatically uses dark primary colour ✅

No duplication, single source of truth
```

---

## Priority Implementation Order

### Phase 1: Critical Gaps (2 weeks)

**Focus:** Full WordPress 6.9 utilisation

- [ ] **P0-1:** Block-level settings configuration
- [ ] **P0-2:** Complete shadow system
- [ ] **P0-3:** Document spacing scale (clamp formulas)
- [ ] **P0-4:** Typography scale (line-height, letter-spacing)
- [ ] **P0-5:** Add contrast validation tests

**Deliverable:** theme.json fully leveraging WP 6.9

---

### Phase 2: Architecture Refactor (2 weeks)

**Focus:** Composable, maintainable structure

- [ ] **P1-1:** Refactor styles folder
- [ ] **P1-4:** Create typesets
- [ ] **P1-5:** Extract colour palettes
- [ ] **P1-6:** Document composition patterns

**Deliverable:** Modular styles architecture ready for scaling

---

### Phase 3: Enhancement (2 weeks)

**Focus:** Rich block/section library

- [ ] **P1-2:** Add 10+ block styles
- [ ] **P1-3:** Add 5 section styles
- [ ] **P1-7:** CI/CD integration

**Deliverable:** 15+ block styles + automated validation

---

### Phase 4: Polish (1+ week)

**Focus:** Advanced features

- [ ] **P2-1:** Duotone & gradient presets
- [ ] **P2-2:** Dark mode high-contrast variant
- [ ] **P2-3:** Animation/transition presets
- [ ] **P2-4:** Token mapping documentation
- [ ] **P2-5:** Preset generation script
- [ ] **P2-6:** E2E testing framework

**Deliverable:** Production-ready, fully-featured system

---

## Success Checklist

### Phase 1 Complete When

- [ ] All block-level settings configured
- [ ] Shadow, spacing, typography systems complete
- [ ] Contrast validation tests passing
- [ ] No hardcoded values in any file
- [ ] Documentation updated
- [ ] All tests passing

### Phase 2 Complete When

- [ ] Styles folder refactored
- [ ] Colour palettes extracted
- [ ] TypeSets created
- [ ] Composition patterns documented
- [ ] File count: 7 → 20+
- [ ] All tests passing

### Phase 3 Complete When

- [ ] 15+ block styles created
- [ ] 5+ section styles created
- [ ] CI/CD validation integrated
- [ ] Preset count: 20 → 40+
- [ ] All tests passing
- [ ] Editor experience improved

### Phase 4 Complete When

- [ ] Duotone/gradient presets working
- [ ] Dark mode high-contrast available
- [ ] Animation presets defined
- [ ] Token mapping documented
- [ ] Preset generation automated
- [ ] E2E tests passing across variations

---

## Testing Strategy

### Unit Tests (theme.json validation)

```bash
npm run test:theme-json
```

- [ ] Valid JSON structure
- [ ] All preset references resolve
- [ ] Block-level settings correct
- [ ] Contrast ratios ≥ 4.5:1

### Integration Tests (block editor)

```bash
npm run test:blocks
```

- [ ] All presets appear in editor
- [ ] Block restrictions working
- [ ] Styles apply correctly
- [ ] Dark mode toggles correctly

### E2E Tests (full page)

```bash
npm run test:e2e
```

- [ ] Fluid typography scales correctly (320px → 1440px)
- [ ] Focus indicators visible
- [ ] Colour combinations readable
- [ ] Variations compose without conflicts

### Contrast Validation (CI/CD)

```bash
npm run validate:contrast
```

- [ ] All colour pairs ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators ≥ 3:1
- [ ] Dark mode meets requirements
- [ ] High-contrast meets ≥ 7:1

---

## Effort Summary

| Phase | Duration | Tasks | Tests | Docs |
|-------|----------|-------|-------|------|
| **P0** (Critical) | 2 weeks | 5 | 8 | 3 |
| **P1** (Important) | 2 weeks | 6 | 12 | 5 |
| **P2** (Enhancement) | 2+ weeks | 6 | 8 | 3 |
| **Total** | ~6-7 weeks | 17 | 28 | 11 |

**Cost of inaction:** Design system remains fragmented, WordPress 6.9 features unused, block-level customisation not available.

**Cost of action:** 6-7 weeks investment, production-ready system, scalable for years.

---

## Resources Created

✅ **Updated Documentation**

- `docs/standardising-colours-fonts-spacing.md` (expanded with new sections)

✅ **Implementation Guides**

- `STYLES-IMPLEMENTATION-ROADMAP.md` (full task breakdown)
- `PROPOSED-STYLES-ARCHITECTURE.md` (folder structure + templates)
- `WORDPRESS-6.9-COMPLIANCE-SUMMARY.md` (executive summary)
- `IMPLEMENTATION-CHECKLIST.md` (this file)

✅ **Reference Materials**

- Fluid typography formulas
- Block-level customisation examples
- Preset resolution chains
- Composition patterns
- Migration path

---

## Getting Started

### Day 1: Alignment

1. Read WORDPRESS-6.9-COMPLIANCE-SUMMARY.md (10 min)
2. Review PROPOSED-STYLES-ARCHITECTURE.md (15 min)
3. Decide on approach (Phase 1 vs Phase 1+2 vs Full)
4. Identify any blockers

### Day 2-3: Planning

1. Schedule P0 task assignments
2. Create detailed sprint plan
3. Set up testing infrastructure
4. Prepare theme.json template

### Day 4+: Implementation

1. Begin with P0-1 (Block-level settings)
2. Progress through P0 tasks
3. Validate with tests
4. Document as you go

---

## Key Decisions Required

**Q: How much time can we invest?**

- Option A: Full 7 weeks (complete system)
- Option B: 2 weeks (Phase 1 only)
- Option C: 4 weeks (Phase 1 + 2)

**Q: Do we prioritise block styles or refactoring?**

- Option A: Refactor first (cleaner foundation)
- Option B: Block styles first (quicker ROI)
- Option C: Parallel (faster but more complex)

**Q: How many block styles do we need?**

- Minimum: 5-8 (buttons, headings, quotes)
- Recommended: 12-15 (above + images, lists, code, tables)
- Comprehensive: 20+ (above + separators, spacers, galleries)

---

## Contact & Support

- **Questions on strategy?** Happy to discuss priorities
- **Need detail on a task?** Refer to STYLES-IMPLEMENTATION-ROADMAP.md
- **Want architecture review?** Ready to pair on design
- **Ready to implement?** Can provide step-by-step guidance

---

## Final Note

Your scaffolds have a **solid foundation**. This plan takes you from good to **excellent** by:

1. ✅ Fully leveraging WordPress 6.9
2. ✅ Implementing production-ready patterns
3. ✅ Building for scale and maintainability
4. ✅ Ensuring accessibility compliance
5. ✅ Creating designer-friendly tools

The investment now pays dividends for years.
