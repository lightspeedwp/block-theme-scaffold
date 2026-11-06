---
title: Block theme scaffold structure audit
description: Comparison of ATI, KWV, SD, TSP, the org standards and the scaffold, with a proposed target structure and PR topics
category: Development
type: Report
audience: Developers
date: 2026-11-05
---

Read-only audit. Nothing in the scaffold or the reference themes was changed. Evidence was read from the working trees on 5 Nov 2026 (scaffold `develop` at `d9da229`) and from a theme generated with `scripts/fixtures/theme-config.mock.json`.

Reference themes: `ati-theme-2026` (ATI), `kwv-theme-2026` (KWV), `sd-theme-2026` (SD), `tsp-theme` (TSP). Standards: `~/Studio/lightspeed/.github/`, where `-aligned` files win over `-updated` files.

## 1. Comparison table

### 1.1 Folder tree and files

| Folder or convention | ATI | KWV | SD | TSP | Standards | Scaffold today |
| --- | --- | --- | --- | --- | --- | --- |
| `templates/` | 30 | 24 | 35 | 26 | WP slug names, `single-`/`archive-`/`page-` prefixes | 13 |
| `parts/` | 19 | 11 | 17 | 6 | kebab-case, role prefix (`header-default.html`) | 6 |
| `patterns/` | 31 | 75 | 72 | 18 | kebab-case file, slug `{theme}/{name}` | 18 |
| Pattern slug | `ati-theme-2026/...` (some names also repeat `ati-`) | `kwv/...` | `sd-theme-2026/...` | `tsp-theme/...` | `{theme}/{name}` | `{{theme_slug}}/...` |
| `styles/blocks/` | folders per block (`buttons/`, `cover/`, `yoast/`) | folders (`button/`, `media/`, `navigation/`, `paragraph/`) | folders (9 blocks) | flat files | `styles/blocks/**` JSON | flat files (3) |
| `styles/sections/` | 7 files | 10 files + `cards/` | 12 files + `cards/` | 2 files | `styles/sections/**` JSON | 2 files |
| `styles/presets/` (modular slices merged by `inc/presets.php`) | none | none | none | none | **Yes**, with `styles/presets/blocks/` | none |
| `styles/dark.json` | none | none | none | none | Yes, remap semantic tokens | yes |
| `styles/colors/` | none | none | none | none | not mentioned | `palette.json` |
| `styles/typography/`, `styles/headings/` | `headings/` | none | none | `typography/` | not mentioned | `typography/` |
| `assets/` | `fonts icons images js logos` | `fonts images js logos styles` | `fonts images js styles` | `fonts` only | `css js fonts images icons logos` | **none** (CSS built from `src/css` into `build/`) |
| **`assets/styles/` per-block CSS** | **none** (one `style.css`) | **30 files** | **31 files** | none | **not documented** (standard says `assets/css/`) | **none** |
| `inc/` | 4 migration classes | 11 feature modules | 10 feature modules | 3 files | `inc/` modules loaded from `functions.php` | 3 files |
| `functions.php` namespace | global `ati_theme_2026_` prefix | `namespace Kwv` | `namespace SdTheme2026` | global `tsp_` | not specified | `{{theme_slug\|snakeCase}}_` prefix |
| Build step | none (no build) | none, no `package.json` | none (npm used for lint and tests only) | `@wordpress/scripts` + webpack, `build/` | `assets/` served directly | webpack, `src/` to `build/` |
| Theme docs | `AGENTS.md`, `DESIGN.md` | `AGENTS.md`, `CHANGELOG.md` | `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `PATTERNS.md`, `CHANGELOG.md`, `CONTRIBUTING.md` | `guidelines/` folder, `DEVELOPMENT.md` | not specified | `CLAUDE.md`, `DEVELOPMENT.md`, `CONTRIBUTING.md` |
| Custom blocks | `blocks/team-contact-card` | none | none | none | not specified | none |
| `.specify/` (Spec Kit) | none | none | yes | yes | not specified | none |

Agreement: ATI, KWV and SD all ship no build step and serve CSS and JS straight from `assets/`; all three put theme.json at schema 6.9 and version 3; all four reference themes use spacing slugs `5` to `100` with `defaultSpacingSizes: false`; all use `templates/` + `parts/` + `patterns/` flat.

Disagreement: TSP and the scaffold use a webpack build and `src/`; the other three do not. Only KWV and SD load per-block CSS. Block style folders are per-block folders in ATI, KWV and SD, but flat files in TSP and the scaffold.

### 1.2 theme.json

| Item | ATI | KWV | SD | TSP | Standards | Scaffold today |
| --- | --- | --- | --- | --- | --- | --- |
| Colour ramps | neutral, brand, primary, cta, accent | neutral, brand | neutral, primary, brand, accent | brand, primary, cta, neutral | `base`, `contrast`, neutral/primary/cta/brand 100-900 (accent optional) | neutral, primary, brand, cta |
| Status colours | **missing** | present | present | present | `-foreground`/`-background` pairs | present |
| `custom.color` semantic group | `button, surface, text, action, border` (no `feedback`, `overlay`) | **none** | **none** | `overlay, shadow, text, surface, border, action, feedback` | text, surface, border, action, feedback, overlay | `text, surface, border, action, feedback, overlay` |
| Font sizes | 100-900 | 100-900 | 100-900 | 100-800 | numeric | 100-800 |
| Font families | `heading` only | heading, body, accent, monospace | heading, belleza, body, accent, la-belle-aurore, monospace | heading, body | not fixed | body, heading, serif |
| Spacing | 5-100 | 5-100 | 5-100 | 5-100 | 5-100 | 5-100 |
| Shadow slugs | `100 200 300 500 600` (no 400) | `100`-`600` | `100`-`600` | **words** (`x-small` to `huge`) plus 4 named | **numeric only, ship 100-600** | **words** (`x-small` to `huge`) |
| Radius slugs | `100 300 500 700 900` | `0, 100`-`500` | `0, 100`-`500` | `0, 100`-`600` | numeric | `0, 100`-`600` |
| `custom` groups | `color, border, typography, tour-operator` | `fontWeight, lineHeight, letterSpacing, spacing` | `fontWeight, fontSize, lineHeight, letterSpacing, spacing, mega-menu, borderWidth, header, footer` | `color, spacing, breakpoint` | `custom.[scope].[group].[token]` | `color, fontWeight, lineHeight, letterSpacing, borderWidth` |
| `custom.layer` / `custom.z-index` | none | none | none | none | **both, conflicting (see 3.1)** | none |
| `custom.motion` / `custom.animation` | none | none | none | none | **both, conflicting (see 3.1)** | none |
| Content width | 800px / 1320px | 900px / 1520px | 900px / 1200px | 768px / 1240px | `layout-standardised.md` | placeholder |
| `styles.blocks` entries | 10 | 31 | 26 | 3 | schema fields first | 3 |
| `customTemplates` | 0 | 4 | 7 | 3 | not specified | 3 |

Notes:

- The handover says KWV and SD are "the reference implementation" for the theme.json. In fact SD and KWV have **no `custom.color` semantic group**, so UI colour is bound to primitives. That disagrees with the agreed rule ("UI uses semantic tokens rather than primitives"). TSP and the scaffold follow it.
- Shadows: the standard says numeric 100-600. KWV and SD follow it. TSP and the scaffold use words. ATI skips 400.
- ATI has no status colours and its radius ladder has gaps.

### 1.3 Per-block stylesheet loading

| | KWV | SD | ATI | TSP | Scaffold |
| --- | --- | --- | --- | --- | --- |
| Folder | `assets/styles/` | `assets/styles/` | none | none | none |
| File count | 30 | 31 | 0 | 0 | 0 |
| Naming | `core-<block>.css` maps to `core/<block>`; other blocks named after the plugin or feature | same | n/a | n/a | n/a |
| Core blocks | one `glob( assets/styles/core-*.css )` loop in `functions.php`, `init` hook, calls `wp_enqueue_block_style( 'core/<block>', [ handle, src, path, ver ] )` | identical loop, handle `sd-theme-2026-block-{file}` | n/a | n/a | n/a |
| Non-core blocks | one `wp_enqueue_block_style()` call in the module under `inc/` (e.g. `inc/gravity-forms.php`, `inc/yoast-breadcrumbs.php`), because the `core-*` glob does not match them | same, per module (`facetwp`, `gravityforms`, `brand-regions`, `mega-menu`, `team-map`) | n/a | n/a | n/a |
| Cache busting | `asset_version()` helper | same | | | |
| Always-loaded CSS | `style.css` (small) | `style.css` | one big `style.css` enqueued with `wp_enqueue_style` | built `style.css` | built `style.css` |
| Scripts | no `wp_enqueue_block_script()` exists, so a module in `inc/` | same (`intro-collapse.php`, `review-slider.php`) | | | |
| `path` key | set, so WordPress inlines small sheets | same | | | |

Mechanism in one line: glob `assets/styles/core-*.css`, derive `core/<block>` from the filename, call `wp_enqueue_block_style()` on `init`. Non-core files each get an explicit call next to the code that owns them. Both themes also register block styles (`register_block_style`) from a table in `functions.php`, and AGENTS.md in SD says to prefer JSON partials over CSS where the schema can express the value.

The org standards do not describe this. Standard 07 documents `assets/css/` and a `functions.php` that loads `inc/animations.php`, `inc/gsap.php`, `inc/presets.php` (the "working theme", which is none of ATI, KWV, SD, TSP).

## 2. The theme the scaffold generates today

Generated from the mock fixture. Top level: `.agents .claude .github bin inc languages parts patterns src styles templates tests` plus config files (`webpack.config.js`, `vitest.config.mjs`, `phpcs.xml`, `phpstan.neon`, `playwright.config.js`, `lefthook.yml`, `composer.json`, `package.json`).

- 13 templates, 6 parts, 18 patterns; `styles/` has `blocks/` (3 flat files), `colors/palette.json`, `dark.json`, `sections/` (2), `typography/` (1).
- `functions.php` enqueues `build/css/style.css` and `build/js/theme.js` through `.asset.php` files. There is no `assets/` folder and no per-block loader.
- `inc/` holds `block-patterns.php`, `block-styles.php`, `template-functions.php`. No `presets.php`.
- No leftover `{{placeholders}}` in theme files. Matches in `.github/workflows/*.yml` are `${{ }}` Actions expressions and in `tests/php/IncludesTest.php` an assertion string; neither is a defect.
- The references carry 24 to 35 templates against the scaffold's 13, mostly post-type and page-specific ones.
- `styles/dark.json` covers 44 of the 45 semantic colour tokens. **`overlay` is missing** (confirms the handover's suspicion). The CodeRabbit commits `9efea26` and `62465c8` are still unreviewed.
- TSP's `theme.json` and `styles/` are a near copy of the scaffold's, minus `dark.json` and `colors/`. TSP has no dark mode.

## 3. Where the standards say something else, or nothing

### 3.1 Known conflict: `z-index` vs `layer`, `animation` vs `motion`

| Topic | `layer` / `motion` set | `z-index` / `animation` set |
| --- | --- | --- |
| Files | `layer-tokens-standardised.md`, `animations-updated.md` | `New files/Z-Index Updates/*`, `New files/Animations update/*` (named `...-aligned`) |
| Paths | `--wp--custom--layer--modal`, `--wp--custom--motion--duration--100`, `--motion--easing--standard`, `--motion--delay--small` | `--wp--custom--z-index--modal`, `--wp--custom--animation--duration--base`, `--animation--easing--emphasised`, `--animation--delay--enter`, `--animation--runtime--easing--standard` |
| Value naming | numeric duration (`100`), role easing | word duration (`base`, `reveal`) |
| File date | 13 Apr 2026, 06:40 and 07:01 | 13 Apr 2026, 09:36 and 09:07 (later) |

Two things matter here. The `z-index`/`animation` files carry the `-aligned` suffix, which the handover says wins over `-updated`, and they are newer. But `layer-tokens-standardised.md` argues explicitly for role-based `layer`, and the `motion` file uses numeric durations that match the numeric-slug rule used everywhere else. The sets also differ in structure for motion, not only the name.

**What WordPress core says (7.1.x).** I diffed the published `theme.json` schemas for 6.9, 7.0 and 7.1 from `schemas.wp.org`. Core has **no z-index, layer, motion, transition, duration or easing keys** in any of them, so both sets live under `settings.custom` and core settles nothing. What 7.1 adds is unrelated: `dimensionSizes` presets (`--wp--preset--dimension--{slug}`), `textShadow`, `textIndent`, `blockVisibility`, `viewport` (`@mobile`/`@tablet`) and a `core/breadcrumbs` and `core/icon` block. (The `trunk` URL returned an HTML page, so trunk was not checked.) A web search found no WordPress 7.1 announcement of z-index or motion tokens either.

**Needs your decision.** My suggestion: `custom.layer` (role based, matches the "token represents the role" reasoning) and `custom.motion` with numeric durations, and mark the `z-index`/`animation` set superseded. None of the four themes uses either set today, so adopting one costs nothing in migration.

### 3.2 Other gaps and disagreements

1. **Folder layout.** Standards describe `styles/presets/*.json` merged by `inc/presets.php`, `assets/css/`, and a no-build theme. No reference theme follows it. The standards' "working theme" (`ls-theme`) is not one of the four themes. Either the standard or the themes need to move.
2. **`assets/styles/` per-block CSS**: undocumented (see 4.2 for a draft).
3. **Shadow slugs**: standard numeric 100-600, TSP and scaffold use words, ATI skips 400.
4. **Semantic colour group**: KWV and SD have none; ATI has a partial one (`button` extra, no `feedback`, no `overlay`).
5. **Status colours**: ATI has none.
6. **`custom` groups**: scaffold has `fontWeight, lineHeight, letterSpacing, borderWidth`; TSP has `spacing, breakpoint`. SD has all of those plus `fontSize`, `mega-menu`, `header`, `footer`. The standard names `custom.[scope].[group].[token]` but does not fix a list. Rule agreed: lengths carry units (rem for spacing, px for breakpoints).
7. **Font size ladder**: 100-900 (ATI, KWV, SD) vs 100-800 (TSP, scaffold).
8. **Font families**: names differ (`serif` in the scaffold vs `accent`, `monospace`, brand names). Not standardised.
9. **Dark mode**: only the scaffold has `styles/dark.json`. No reference theme does.
10. **Namespacing**: KWV and SD use PHP namespaces, ATI and the scaffold use prefixed functions. Standard silent. Your coding preferences favour classes, but WordPress idiom is procedural. This is not decided.
11. **Spec Kit and `guidelines/`**: SD and TSP have `.specify/`; TSP has `guidelines/`; not in the scaffold. TSP guidelines are meant to stay light (see project notes).
12. **Radius**: slug sets differ (ATI `100,300,500,700,900`); standard says numeric; ladder not fixed.
13. **New in WordPress 7.1**: `dimensionSizes` could replace some `custom.spacing` and `custom.breakpoint` lengths (TSP, SD). Needs a decision, because `defaultSpacingSizes: false` is agreed for spacing.

## 4. Proposed target structure

### 4.1 Tree

```text
{theme}/
├── assets/
│   ├── fonts/
│   ├── images/
│   ├── js/
│   └── styles/               # one small CSS file per block, loaded on demand
│       ├── core-button.css   # core/button
│       └── gravity-forms.css # non-core, loaded from inc/gravity-forms.php
├── inc/
│   ├── block-styles.php      # register_block_style() table
│   ├── block-stylesheets.php # the core-* glob loader (new)
│   ├── block-patterns.php
│   └── template-functions.php
├── languages/
├── parts/
├── patterns/
├── styles/
│   ├── blocks/<block>/       # per-block variation JSON, folder per block
│   ├── sections/             # section style variations
│   ├── typography/
│   └── dark.json             # remaps every semantic token
├── templates/
├── functions.php             # light bootstrap
├── style.css                 # header plus a tiny always-loaded layer
└── theme.json
```

Open questions on the tree that need your call:

- **Build step.** Keep webpack and `src/` for JS only, and serve per-block CSS straight from `assets/styles/` (the KWV and SD way, no compile). I recommend this: it matches your themes and keeps generated CSS minimal.
- **`styles/colors/palette.json`**: the standards and the references do not have it. Candidate to drop.
- **`styles/presets/`** from the standards: not used anywhere. I suggest not adopting it until a theme needs it, and amending the standard.
- **Template coverage**: add the post-type templates only when a project needs them.

### 4.2 Draft addition to the org standards (for approval)

> **Per-block stylesheets.** A theme may keep one small stylesheet per block in `assets/styles/`. Name core block files `core-<block>.css`, which maps to `core/<block>` (for example `core-button.css` is loaded for `core/button`). Name non-core files after the plugin or feature (`gravity-forms.css`). Load core files with one loop in `inc/` that globs `assets/styles/core-*.css` and calls `wp_enqueue_block_style()` on `init`, passing `handle`, `src`, `path` and a file-mtime `ver`. Load non-core files with an explicit `wp_enqueue_block_style()` call in the module that owns that block. A sheet loads only when its block renders. Put values that `theme.json` can express in `styles.blocks` or `styles/blocks/**` first, and use these files only for selectors, pseudo-elements, media queries and interactions that JSON cannot express.

## 5. PR topics, in order

Each is one small PR, one Linear issue, branch `{type}/bts-{n}-{title}`.

| # | Topic | Size | Notes |
| --- | --- | --- | --- |
| 1 | `dark.json` missing `overlay`, review CodeRabbit commits `9efea26` and `62465c8` | tiny | Fix first, it is a correctness gap in what already merged. |
| 2 | Per-block stylesheet loading: add `assets/styles/`, `inc/block-stylesheets.php`, one example `core-button.css`, generator and test coverage | small | Needs your approval of 4.2. Mechanism copied from KWV and SD. |
| 3 | Decide and add `custom.layer` and `custom.motion` (or the z-index set) | small | Blocked on your decision in 3.1. |
| 4 | Shadow slugs to numeric 100-600 (TSP follows) | small | Standard says numeric; breaks any code using word slugs, so check generated patterns. |
| 5 | `styles/blocks/` to per-block folders, drop `styles/colors/` | small | Layout only. |
| 6 | Font size ladder (100-800 vs 100-900) and font family names | small | Needs your call. |
| 7 | Template coverage and pattern layout and naming | medium, split | Only what a new project needs. |
| 8 | Build config: webpack for JS only, drop the CSS build if topic 2 is approved | small | Overlaps BTS-23 (Warwick's CI work). Coordinate before touching. |
| 9 | Org standards updates (per-block CSS, layer/motion, `styles/presets` mismatch) | docs, in `lightspeedwp/.github` | Separate repo. Related: GIT-2755. |

Housekeeping noted by the handover (not part of this audit): remove the BTS-19 worktree and merged local branches, after asking.

## 6. Decisions (Zared, 5 Nov 2026)

These override the proposals above where they differ.

| Topic | Decision |
| --- | --- |
| Per-block CSS | Adopt it. One small file per block in `assets/styles/`, loaded with `wp_enqueue_block_style()`. Credit the pattern to [Ollie](https://olliewp.com/) in code comments and docs. |
| Build step for CSS | **Decided (6 Nov): webpack** ([BTS-25](https://linear.app/lightspeedwp/issue/BTS-25)). Sources in `src/styles/core-<block>.scss`, built to minified `build/styles/` with RTL, loaded by `inc/block-stylesheets.php` ([BTS-27](https://linear.app/lightspeedwp/issue/BTS-27)). This replaces `assets/styles/` in the rows above and in 4.2. |
| Stacking and motion tokens | `custom.layer` and `custom.motion`. The `z-index` / `animation` files are superseded. |
| WordPress 7.1 features | Turn on and use `dimensionSizes`, `textShadow` and `blockVisibility`, with values written where a theme needs them. They are **not** initial values in the scaffold. |
| Dark mode | `styles/dark.json` stays in the scaffold so it is wired up when a site needs it. It keeps the same palette as `theme.json` (inherited if WordPress allows it, otherwise copied) and only points the semantic tokens at different primitives. No reference site needed a second colour variation. |
| Semantic colour tokens | Usage comes from the TSP theme and the TSP Figma file. |
| `styles/presets/` | Not adopted. One `theme.json` holds all config (agreed with Warwick, 5 Nov). The org standard needs amending. |
| Shadow slugs | Numeric, as in KWV and SD. Change the scaffold, TSP and the TSP Figma file. |
| webpack | Keep it in the scaffold and TSP. More complex sites may need it, and it must stay wired up for them. |
| Template coverage and the rest of section 5 | Checked as part of the topics below. |
| Org standards | Note on the Linear issue, plus a separate issue to update the org standards (per-block CSS, layer/motion, no `styles/presets/`). |

### Revised topic order

Status updated 6 Nov 2026. Topics 4 to 7 are framed as "match what the theme.json skills write": each is checked by running the `figma-to-block-theme` Tokens mode on a generated theme.

| # | Topic | Status |
| --- | --- | --- |
| 1 | `dark.json`: add `overlay`, review CodeRabbit commits `9efea26` and `62465c8`, point semantic tokens at primitives | Done: [BTS-24](https://linear.app/lightspeedwp/issue/BTS-24), PR #36 |
| 2 | Per-block stylesheet loading (Ollie pattern), built by webpack | Done: [BTS-25](https://linear.app/lightspeedwp/issue/BTS-25) (decision), [BTS-27](https://linear.app/lightspeedwp/issue/BTS-27), PR #41 |
| 3 | `custom.layer` and `custom.motion` | Done: [BTS-26](https://linear.app/lightspeedwp/issue/BTS-26), PR #40 |
| - | Hero cover contrast (found by the tour-operator e2e run) | Done: [BTS-28](https://linear.app/lightspeedwp/issue/BTS-28), PR #43 |
| - | Colour ramps generated like the `site-to-design-tokens` skill | Done: [BTS-29](https://linear.app/lightspeedwp/issue/BTS-29), PR #45 |
| 4 | Numeric shadow slugs: scaffold, then TSP and the TSP Figma file | Scaffold: [BTS-30](https://linear.app/lightspeedwp/issue/BTS-30), PR #48. TSP: [TSP-57](https://linear.app/lightspeedwp/issue/TSP-57) |
| 5 | Semantic token usage aligned with TSP and Figma | Next |
| 6 | `dimensionSizes`, `textShadow`, `blockVisibility` enabled, not seeded | Ready |
| 7 | `styles/blocks/` per-block folders, drop `styles/colors/palette.json` if nothing reads it | Ready. Overlaps GIT-2755 |
| 8 | Font size ladder and family names | Needs Zared |
| 9 | Template and pattern coverage | Part of the work |
| 10 | Org standards update (`lightspeedwp/.github`) | [GIT-2756](https://linear.app/lightspeedwp/issue/GIT-2756) |
