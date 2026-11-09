---
title: Generating a Theme
description: How to generate a WordPress block theme from the scaffold, with every option, the output, the checks to run and how placeholders work
category: Development
type: Guide
audience: Developers
date: 2026-11-09
---

The generator copies `theme-template/` into a new folder and replaces its `{{placeholders}}` with your theme's details. This guide covers the options, where the theme goes, what to run afterwards and how to change the template.

## Quick start

```bash
npm install
node scripts/generate-theme.js \
  --slug my-theme \
  --name "My Theme" \
  --author "LightSpeed" \
  --author_uri "https://lightspeedwp.agency" \
  --theme_uri "https://lightspeedwp.agency/themes/my-theme"
```

The theme is written to `./output-theme/my-theme/`. To generate it straight into a Studio site, add `--output ~/Studio/my-site/wp-content/themes/my-theme`.

Then, inside the theme folder:

```bash
npm install
composer install
npm run build
```

## Two ways to pass the details

### Command-line options

| Option | Required | Default | Notes |
| --- | --- | --- | --- |
| `--slug` | yes | | Lowercase letters, numbers and hyphens. Becomes the folder name, text domain and function prefix. |
| `--name` | yes | | Theme name in `style.css`. |
| `--author` | yes | | Author or organisation. |
| `--theme_uri` | yes | | Theme homepage, `http://` or `https://`. The generator stops without it. |
| `--author_uri` | no | `https://example.com` | Also sets the support and security email domains. |
| `--description` | no | "A WordPress block theme." | |
| `--version` | no | `1.0.0` | |
| `--min_wp_version` | no | `7.1` | "Requires at least". |
| `--tested_wp_version` | no | `7.1` | "Tested up to". |
| `--min_php_version` | no | `8.0` | |
| `--license`, `--license_uri` | no | GPL-2.0-or-later | |
| `--theme_repo_url` | no | `https://github.com/<author>/<slug>` | Used for the docs and changelog links. |
| `--output` | no | `./output-theme/<slug>/` | Any folder that doesn't exist yet. |
| `--config` | no | | A JSON config file (below). |
| `--help` | | | Shows every option. |

### A config file

For colours, fonts, image sizes and the rest, use a config file:

```bash
cp scripts/fixtures/theme-config.template.json my-theme.json
# edit my-theme.json
node scripts/generate-theme.js --config my-theme.json
```

The config needs `theme_slug`, `theme_name`, `author` and `theme_uri`. `.github/schemas/theme-config.schema.json` describes every key, and VS Code autocompletes them from the template's `$schema` line. The main groups:

| Group | What it sets |
| --- | --- |
| `design_system.colors` | The colours each palette ramp is built around: primary, secondary, accent, neutral, background and text. |
| `design_system.typography` | The four font roles, `heading`, `body`, `accent` and `monospace` (`*_font_family` and `*_font_name`), plus weights and line heights. See [Fonts](../README.md#fonts). |
| `design_system.layout` | Content and wide widths. |
| `images` | Featured image, thumbnail, gallery and logo sizes. |
| `urls`, `emails` | Support, docs, changelog and contact details. |
| `content` | Excerpt length, "read more" text, skip link text. |

Options on the command line override the same values in a config, so `--config my-theme.json --version 2.0.0` changes only the version.

The example configs in `.github/schemas/examples/` show complete themes.

## The output

- The theme goes to `./output-theme/<slug>/`, or to `--output`. The generator stops if the folder exists.
- Copy `output-theme/<slug>/` to the site's `wp-content/themes/<slug>/`, or generate it there with `--output`.
- `output-theme/` is ignored by git in this repository.
- Each run writes a log to `logs/`.

## After generating

Inside the theme:

```bash
npm install        # also installs the git hooks once the theme is a git checkout
composer install
npm run build
npm run lint       # JavaScript, CSS, package.json and theme JSON files
npm run lint:php   # PHPCS
npm test           # unit tests
```

Then activate the theme on a WordPress 7.1 site and check the editor and the front end. `npm run test:e2e` runs the Playwright tests against a site.

The generator only sets starting values. To build a real theme from a design or a live site, use the theme skills in [lightspeedwp/.github](https://github.com/lightspeedwp/.github): `site-to-design-tokens` or `figma-to-block-theme` for `theme.json`, and `theme-screenshot` for `screenshot.png`.

## How placeholders work

Every file the generator uses lives in `theme-template/`. Nothing outside it is copied. Local artefacts in it (`node_modules/`, `vendor/`, `build/`, `dist/`) are skipped.

In each file, the generator replaces placeholders such as `{{theme_slug}}`, `{{theme_name}}` and `{{theme_uri}}`. A filter changes the format:

| Placeholder | `my-theme` becomes |
| --- | --- |
| `{{theme_slug}}` | `my-theme` |
| `{{theme_slug\|snakeCase}}` | `my_theme` (PHP function prefixes) |
| `{{theme_slug\|upper}}` | `MY_THEME` (PHP constants) |
| `{{theme_slug\|pascalCase}}` | `MyTheme` |
| `{{theme_slug\|camelCase}}` | `myTheme` |

In `.json` files, values are escaped for JSON, so a font stack such as `"Argesta Display", Georgia, serif` keeps `theme.json` valid.

Every placeholder and the files that use it are listed in `scripts/mustache-variables-registry.json`.

### Adding a placeholder

1. Use it in a file in `theme-template/`, for example `{{my_value}}`.
2. Give it a value in the `placeholders` object in `scripts/generate-theme.js`, read from the config (flattened, for example `design_system_colors_primary_color`) or a command-line option, with a default.
3. If it comes from the config, add the key to `.github/schemas/theme-config.schema.json` and `scripts/fixtures/theme-config.template.json`. A test fails when the schema offers a key the generator doesn't read.
4. Run `node scripts/utils/update-mustache-registry.js` to refresh the registry, then `npm test`. A test fails if a generated theme still contains a placeholder.

## Troubleshooting

| Message | Fix |
| --- | --- |
| "Theme URI is required" | Pass `--theme_uri "https://…"` or set `theme_uri` in the config. |
| "Output directory … already exists" | Delete that folder, or choose another with `--output`. |
| "Invalid theme slug provided" | Use lowercase letters, numbers and hyphens only. |
| "Invalid author URI" or "Invalid theme URI" | Start the URL with `http://` or `https://`. |
| "Configuration failed schema validation" | Check the config against `.github/schemas/theme-config.schema.json`. |
| `npm install` warns about install scripts | Allow the package with `npm install-scripts approve <package>`. The theme's `allowScripts` already denies the ones it doesn't need. |

## Related

- [README](../README.md): generating a theme and the font options
- [Structure audit](STRUCTURE_AUDIT.md): why the template is laid out the way it is
- [Releasing the scaffold](RELEASE_PROCESS_SCAFFOLD.md)
- The generated theme's own `README.md` and `DEVELOPMENT.md`
