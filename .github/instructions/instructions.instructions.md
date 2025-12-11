---
name: "Instruction Authoring Guidelines"
description: "How to craft repository-specific Copilot instruction files for the block theme scaffold"
applyTo: "**/*.instructions.md"
---

# Write Instructions
Define Copilot's role, focus, and what to avoid in these instructions. Example: "You are a {{role}}. Follow our {{framework/patterns}} to {{task-type}}. Avoid {{practices/tools}} unless specified".

## Core Principles
- Make every instruction actionable, specific, and scoped to this block theme scaffold.
- Prefer `theme.json`, block patterns, and block components over bespoke PHP, JS, or CSS.
- Reflect the automation stack: mustache variables for templates/configs, JSON and PHP validation, and block-theme build/test workflows.
- Link to existing standards instead of duplicating them; defer to `.github/instructions/*.instructions.md`, `.github/instructions/coding-standards.instructions.md`, and `.github/instructions/linting.instructions.md`.
- Keep language imperative and concise so Copilot and agents can follow without interpretation.

## Required Frontmatter
Every instruction file starts with YAML frontmatter containing at least `name`, `description`, and `applyTo`.

```yaml
---
name: "Concise file name that matches the topic"
description: "Brief description of the instruction purpose and scope"
applyTo: "**/*.instructions.md"
---
```

### Frontmatter Guidelines
- `name`: Human-friendly title (no markdown), short and descriptive.
- `description`: 1–500 characters explaining scope and intent; prefer present tense.
- `applyTo`: Glob(s) defining the target files; default to `**/*.instructions.md` for shared guidance or narrower patterns for topic-specific rules.
- Keep frontmatter valid YAML; avoid tabs and trailing commas.

## File Structure
- Place files in `.github/instructions/` using lowercase-kebab names ending with `.instructions.md`.
- Start with the frontmatter, then an `#` heading and a one-line summary that clarifies the role, focus, and exclusions.
- Use H2 sections to organize guidance; keep section titles clear and reusable by automation.

## Recommended Section Order
- `## Core Principles`: Anchor rules and priorities for the topic.
- `## Block Theme Requirements`: Call out theme.json, block usage, and any mustache templating needs.
- `## Naming Conventions`: File and identifier patterns tied to the topic.
- `## Content Guidelines`: Writing voice, required links, and scope boundaries.
- `## Validation Checklist`: How to self-check examples, links, and formatting.
- `## Examples`: Good/bad samples tailored to the topic.
- `## Related Documentation`: Pointers to other instruction files or upstream docs.
- `## Version History`: Table tracking edits.
- Add or remove sections as needed, but keep the first three (frontmatter, H1 summary, Core Principles) in place.

## Naming Conventions
- File names: lowercase with hyphens, e.g., `theme-json.instructions.md`, `a11y.instructions.md`.
- Headings: sentence case; avoid duplicates across sections.
- Reference other files by relative path (e.g., `.github/instructions/theme-json.instructions.md`).

## Content Guidelines
- Write in imperative mood; avoid ambiguous verbs like “should” or “might”.
- State the “why” briefly when it prevents misuse; keep each bullet single-topic.
- Prefer repo-native tools: mention `npm run lint`, `npm run test`, `composer run lint`, and `wp-scripts` tasks when describing validation.
- For code samples, match repository standards (WordPress coding standards, WPCS rules, block-first patterns) and keep them minimal but runnable.
- Highlight what to avoid (e.g., custom enqueue logic when theme.json suffices) directly under the relevant section.

## Block Theme Requirements
- Default to block-first solutions: theme.json for settings/styles, block patterns for layout, and block components for UI.
- Use mustache variables in generated configs/templates where the build agents expect them.
- Keep PHP minimal and follow WordPress nonces, escaping, and internationalization patterns referenced in `.github/instructions/security-nonce.instructions.md` and `.github/instructions/i18n.instructions.md`.
- Validate JSON and PHP snippets; avoid suggesting manual overrides that bypass existing build or lint workflows.

## Validation Checklist
- Frontmatter includes `name`, `description`, and `applyTo`; YAML parses cleanly.
- H1 summary states role, focus, and explicit avoidances.
- Sections follow the recommended order or a deliberate, documented variation.
- Links resolve locally; referenced scripts or workflows exist in the repo.
- Code samples comply with project linters (e.g., `npm run lint`, `composer run lint`, `wp-scripts lint-js`) when applicable.
- JSON and PHP snippets validate (use `jq`, `wp-scripts lint-pkg-json`, or `php -l` where relevant).

## Examples
```markdown
---
name: "Theme JSON Authoring"
description: "Rules for editing theme.json for the scaffold"
applyTo: "theme.json, styles/**/*.json"
---

# Guide theme.json Updates
You guide Copilot to edit theme.json using project presets and avoid bespoke CSS or inline styles.

## Core Principles
- Prefer presets and variables; avoid hard-coded colors or typography tokens.
- Align with `.github/instructions/theme-json.instructions.md`.

## Block Theme Requirements
- Use style variations via `styles/*.json` instead of custom CSS files.
- Keep spacing and typography tokens consistent with design tokens.

## Validation Checklist
- Run `npm run test:theme-json` for structural validation.
```

## Related Documentation
- `.github/instructions/theme-json.instructions.md`
- `.github/instructions/html-markup.instructions.md`
- `.github/instructions/a11y.instructions.md`
- `.github/instructions/block-theme-development.instructions.md`
- `.github/agents/block-theme-build.agent.md`

## Version History
| Date       | Change                                  |
| ---------- | --------------------------------------- |
| 2025-12-11 | Reworked for block-theme-first guidance |
