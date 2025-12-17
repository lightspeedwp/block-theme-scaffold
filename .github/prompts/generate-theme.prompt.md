---
description: "Gather the inputs needed to run the config-first block theme generator (scripts/generate-theme.js)"
---

# Generate Block Theme

This wizard prompt guides you through the configuration-first theme generator. It explains the decision points, the schema-backed inputs that must be provided, the mustache values that will be replaced in the scaffold, and the artifacts the generator produces.

## Wizard Flow

1. **Repository context.** Detect whether the command is running inside the scaffold (`generated-theme/` output) or in a new theme repo. When inside the scaffold, generation writes to `./generated-theme/` by default and leaves the scaffold untouched. In a standalone repo, files are replaced in-place.
2. **Config intake.** If a `theme-config.json` (or the new `theme-config.mock.json` fixture) is supplied, the script validates it against `.github/schemas/theme-config.schema.json` before continuing. If no config file is provided, the agent collects values interactively stage-by-stage using `CONFIG_SCHEMA` from `scripts/lib/define-config-schema.js`.
3. **Schema steps.** Required identity fields (`theme_slug`, `theme_name`, `author`) are collected first, followed by optional contact/license metadata, design system tokens, image sizes, content strings, structure choices, and feature toggles. Each stage calls `validateValue` and `applyDefaults`, so values can be corrected on the fly.
4. **Command preview.** After the responses are validated, `buildCommand` emits the CLI invocation that would recreate the same theme. This command is displayed alongside a JSON summary and saved in the generation log.
5. **Execution.** Running `node scripts/generate-theme.js --config path/to/theme-config.json` (or the interactive agent) generates the theme and logs output under `logs/generate-theme-{slug}.log`.

## Required Schema Fields

| Field | Notes | Source |
| --- | --- | --- |
| `theme_slug`, `theme_name`, `author` | Always required by the JSON schema; slug must match `^[a-z0-9-]{2,}$`. | `.github/schemas/theme-config.schema.json`
| `version`, `license`, `theme_uri`, `author_uri`, `author_username` | Required for clean metadata/WordPress fields at generation time. Defaults exist but can be overridden. | Schema defaults and generator helpers.
| `design_system` (colors, typography, layout) and `images`, `content` | Optional but strongly recommended because templates rely on these tokens. | Schema sections for predictable UI.
| `theme_structure.templates/patterns/style_variations` | Selects which templates, patterns, and style variation files to include in the generated theme. | `theme_structure` definition in schema.
| `features` | Enables/disables feature flags such as `editor_styles`, `post_thumbnails`, and `woocommerce_support`. | Schema `features` object.

The agent also surfaces extra prompts for `wizard_mode`, `emails`, and `urls` so you can tether the generated theme to your support/documentation stack.

## Mustache Values

The scaffold uses the `{{variable}}` motif (142 entries) captured by `scripts/scan-mustache-variables.js`. The dry-run helpers (`scripts/dry-run/dry-run-config.js`, `scripts/utils/placeholders.js`) provide concrete values for all of them so the lint/test/build tooling can run without generating a full theme. Key replacements include:

- **Identity:** `{{theme_slug}}`, `{{theme_name}}`, `{{author}}`, `{{theme_uri}}`, `{{theme_repo_url}}`
- **Design:** `{{primary_color}}`, `{{heading_font_family}}`, `{{content_width}}`, `{{wide_width}}`
- **Content:** `{{hero_title}}`, `{{cta_button_text}}`, `{{footer_text}}`
- **Assets:** `{{featured_image_width}}`, `{{gallery_image_height}}`

To exercise replacements manually, run `npm run dry-run:build` or `npm run dry-run:start`—both wrap the target command with `scripts/dry-run/with-dry-run.js`, which writes the replaced contents just long enough for `wp-scripts` to compile.

## Expected Outputs

- **Generated theme folder:** `generated-theme/{theme_slug}/` (or the current repo when running outside the scaffold). All `{{...}}` placeholders are resolved by the mustache engine, which is why the config file must be complete.
- **Logs:** `logs/generate-theme-{slug}.log` records the command, status, and replaced templates. Dry-run helpers log to `logs/dryrun-debug.log`, `logs/lint/*.log`, and `logs/test/*.log` so you can debug lint/test failures without writing files to `generated-theme/`.
- **Configuration assets:** `theme-config.json`, `theme-config.mock.json`, or CLI flag combinations (e.g., `--slug`, `--name`, `--author`). The agent reuses any provided config to speed up future runs.
- **Validators:** Running `npm run validate:config` or `npm run validate:config:schema` keeps the config aligned with the canonical schema, while `npm run test:dry-run:all` exercises the mustache substitution before the theme touches WordPress.

Use this prompt as your landing page for collecting wizard answers. If you need to preview the full schema, pass `--schema` to `scripts/agents/generate-theme.agent.js` or inspect `.github/schemas/theme-config.schema.json`. The fixture `theme-config.mock.json` mirrors that schema so the tooling has real data to reference during development and dry-runs.
