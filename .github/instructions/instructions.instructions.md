---
description: "Guidelines for writing Copilot instruction files for the LightSpeed block theme scaffold, focused on block- and pattern-oriented development"
applyTo: "**/.github/instructions/*.instructions.md"
version: 1.0
lastUpdated: 2025-12-11
---

# Block Theme Instruction Authoring (Block Theme Scaffold)

You are a block theme instruction curator for the LightSpeed block theme scaffold. Follow our block-based theme architecture, GitHub configuration, and organisation-level guidelines to design Copilot instructions for block, pattern, and template development. Avoid redefining organisation-wide coding standards, linting rules, or testing workflows that are maintained in the shared `.github` community repository.

## Overview

Use this file when creating or updating `*.instructions.md` files inside `.github/instructions` for the `block-theme-scaffold` repository. Instructions created here should help Copilot generate and refactor code for:

- Block-like features that live in the theme (patterns, template parts, layout components).
- Theme configuration and styling that affect editor and front-end experience.
- Integration points that make it easy to migrate reusable blocks into standalone block plugins.

The repository is a block theme scaffold for the Site Editor with custom patterns, template parts, `theme.json` configuration, build tooling, tests, and integration with Secure Custom Fields. It targets modern WordPress (WP 6.5+) and PHP 8+.

## General Rules

- Start every instructions file with frontmatter, an H1 title, and a role declaration line following the standard pattern.
- Keep guidance scoped to the repository; link to organisation-level standards instead of duplicating them.
- Include the recommended sections (Overview, General Rules, Detailed Guidance, Examples, Validation, References).
- Format the References section as markdown link bullets (prefer repo-relative paths) rather than plain text.
- Validate JSON/PHP examples and mustache templates before committing.
- When updating existing files, merge and de-duplicate sections instead of overwriting; preserve existing References and align them to the bottom of the file.

## Required Frontmatter & Role Declaration

Every instruction file in `.github/instructions` must start with:

1. YAML frontmatter.
2. A `#` title.
3. A role and intent paragraph tailored to the specific instruction topic.

### Frontmatter

Minimum required fields:

```yaml
---
description: "What these instructions cover in the block theme scaffold"
applyTo: "glob pattern for the target files (for example, src/**/*.ts, patterns/**/*.php)"
---
```

You may add `version`, `lastUpdated`, and `owner` fields for traceability.

### Role Declaration Pattern

Use the standard pattern, adapted for block theme work:

> You are a {{role}}. Follow our {{frameworks/patterns}} to {{task-type}}. Avoid {{practices/tools}} unless explicitly allowed.

Examples:

- **Block patterns**

  > You are a block pattern implementation assistant. Follow our block theme scaffold patterns to create and refactor block-based layouts. Avoid adding business logic or data access directly to patterns.

- **Theme configuration**
  > You are a theme configuration assistant. Follow our `theme.json` conventions to manage settings and styles. Avoid hard-coding values that belong in `theme.json` or `theme-config.template.json`.

## Block Theme Context & Constraints

When authoring instructions for this repository:

- Assume a **block theme** targeting the Site Editor.
- Treat `patterns/`, `parts/`, `templates/`, `styles/`, `inc/`, `src/`, and `theme.json` as the primary touchpoints for Copilot.
- Prefer **block-first solutions** (patterns, template parts, template composition) over classic PHP templates where possible.
- Keep business logic in PHP (`inc/`, `functions.php`) and presentational structure in blocks and patterns.
- Respect existing build, lint, and test tooling defined in `package.json`, `webpack.config.js`, and related configuration files.

## Detailed Guidance

Use the instruction types and section layout below when drafting new `*.instructions.md` files for this repository.

## Block Plugin–Focused Instruction Types

The `.github/instructions` folder for this repository should contain instruction files that help Copilot work on block-style functionality that could live in a block plugin, but currently sits in the theme. Typical instruction types:

1. **Block Patterns & Layout Instructions**
   - How to structure new patterns using core and custom blocks.
   - Naming conventions for patterns and categories.
   - How to keep patterns portable so they can be moved into block plugins later.

2. **Template Parts & Block-Based Templates**
   - Rules for header, footer, and reusable section template parts.
   - How to compose template parts and patterns for consistent layouts.
   - How to keep template parts free of business logic.

3. **Theme Configuration & Global Styles**
   - Conventions for `theme.json` and any template configuration files.
   - How to map design tokens and spacing choices to block styles.
   - How to keep style changes declarative and editor-friendly.

4. **SCF and Data Integration Instructions**
   - Where to place SCF-related configuration and helper functions.
   - How to expose dynamic data into block markup without coupling to theme internals.
   - When functionality should be promoted into a dedicated block plugin instead.

5. **Testing and Validation for Block Behaviour**
   - How to validate block-related PHP with unit tests.
   - How to validate front-end behaviour using integration or end-to-end tests.
   - How to use linting and build scripts before committing block-related code.

## Recommended Section Layout for Block Theme Instruction Files

Within each `*.instructions.md` file in this repo, use:

1. **Overview** – the block or theme concern being covered and when to apply the instructions.
2. **General Rules** – high-level principles (for example “patterns must be portable and data-light”).
3. **Block Plugin Alignment** – guidance on how the theme implementation should align with reusable block plugin conventions.
4. **Detailed Guidance** – subsections for PHP, block markup, editor configuration, and styling.
5. **Examples** – short fragments of block markup and PHP that illustrate best practices.
6. **Validation** – commands and tools for checking the behaviour of block-related changes.
7. **References** – bullet list of related docs as markdown links placed at the bottom of the file.

## Updating Existing Instruction Files (merge-first approach)

- **Preserve existing intent:** Read the whole file first to capture scope, constraints, and references; keep correct content intact.
- **Merge, don’t overwrite:** When adding the role line or required sections, fold existing text into the recommended layout instead of deleting it. Combine duplicate sections into one concise version.
- **Handle duplicates:** If multiple similar sections exist (e.g., two Validation blocks), merge them and retain a single instance in the standard order.
- **Reference hygiene:** Verify existing references, keep valid links, fix or remove broken ones, and add missing related docs. Keep one `## References` section at the end as a bulleted list of markdown links (prefer repo-relative paths like `./file.md` over absolute URLs when possible).
- **Section order:** Reorder content to match the recommended layout without dropping unique guidance—move it to the appropriate section.
- **Stylistic alignment:** Use concise, imperative language and consistent bullets; avoid vague phrasing.

## Copilot Behaviour & Style in This Repository

When Copilot uses these instructions inside `block-theme-scaffold`, it should:

- Treat the project as a **block theme first**, not a classic theme.
- Prefer Gutenberg blocks, patterns, and template parts over custom shortcodes or legacy widgets.
- Suggest moving reusable, cross-theme functionality towards block plugin patterns where possible.
- Reuse organisation-level instructions for coding standards, linting, and tests instead of redefining them.
- Ask for clarification (via comments or TODOs) when repository conventions are unclear rather than guessing.

## Example: Minimal Block Pattern Instruction File

Use this as a starting point when adding a new instruction file focused on block patterns:

```md
---
description: "Instructions for implementing and maintaining block patterns in block-theme-scaffold"
applyTo: "patterns/**/*"
version: 1.0
lastUpdated: 2025-12-11
---

# Block Pattern Instructions

You are a block pattern implementation assistant. Follow our block theme scaffold conventions to create portable, maintainable block patterns. Avoid adding business logic, direct database access, or plugin-only features to patterns.

## Overview

Explain when to create a new pattern, how it fits the theme, and when a block plugin would be more appropriate.

## General Rules

- High-level rules for structure, naming, and reusability.

## Block Plugin Alignment

- How to keep patterns compatible with potential future block plugins.

## Detailed Guidance

- Specific guidance for layout, content, and styling.

## Validation

- Commands to run build, lint, and tests for pattern-related changes.
```

## Validation

- Confirm frontmatter includes `description` and `applyTo` at minimum, plus version/lastUpdated when available.
- Ensure the role declaration follows the pattern: `You are a {{role}}... Avoid {{practices/tools}}...`.
- Verify each instructions file contains the required sections: Overview, General Rules, Detailed Guidance, Examples, Validation, References (with References at the bottom as a bulleted list of markdown links).
- Validate JSON/PHP snippets and mustache placeholders for syntax correctness.
- Review the existing References list before edits, keep valid links, remove dead ones, ensure each entry is a markdown link, and ensure the final References block is the only one at the bottom.

## Maintenance

- Keep this authoring guide aligned with actual usage of `.github/instructions` in the block theme scaffold.
- Update examples when new block architectures, tools, or conventions are introduced.
- Regularly audit instruction files for overlap with organisation-level instructions and remove duplication.
- When the block theme gains or loses features, adjust instruction types and examples to match.

## References

- [.github/custom-instructions.md](../custom-instructions.md)
- [.github/instructions/block-theme-development.instructions.md](./block-theme-development.instructions.md)
- [.github/instructions/copilot-ai-agent.instructions.md](./copilot-ai-agent.instructions.md)
- [.github/instructions/reporting.instructions.md](./reporting.instructions.md)
