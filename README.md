---
title: Block Theme Scaffold
description: Generator and tooling for creating WordPress block themes from a mustache template
category: Project
type: Index
audience: Developers
date: 2026-10-22
---

# Block Theme Scaffold

Generator and agent tooling for creating new WordPress block themes. The theme itself lives in [`theme-template/`](theme-template/); everything else in this repository is the tooling that turns that template into a ready-to-use theme.

## Repository layout

```text
block-theme-scaffold/
├── theme-template/     # The theme template: every file here is copied into a generated theme
│   ├── functions.php, style.css, theme.json
│   ├── inc/ parts/ patterns/ templates/ styles/ src/
│   ├── tests/          # PHPUnit and Playwright tests for the generated theme
│   └── package.json, composer.json, build/lint configs, README.md, README.txt
├── scripts/            # Generator, agents, dry-run, validation and utility scripts
├── .github/            # Agents, prompts, instructions, schemas and workflows for this repository
├── docs/               # Generator and release documentation
└── tests/              # Fixtures for the tooling tests
```

Files in `theme-template/` contain `{{mustache}}` placeholders (for example `{{theme_slug}}` and `{{theme_name}}`) that the generator replaces. Edit the template there; do not add theme files to the repository root.

## Generating a theme

```bash
npm install
node scripts/generate-theme.js --slug my-theme --name "My Theme" --author "Your Name" --author_uri "https://example.com" --theme_uri "https://example.com/my-theme"
```

Or from a JSON config:

```bash
node scripts/generate-theme.js --config theme-config.json
```

The theme is written to `./output-theme/<slug>/`. Copy that folder to `wp-content/themes/<slug>/`, or generate straight into place with `--output ~/Studio/my-site/wp-content/themes/my-theme` (the folder must not exist yet). Then run `npm install && composer install && npm run build` inside it.

### Fonts

The theme has four font families, named by role: `heading`, `body`, `accent` and `monospace`. Set them in the config under `design_system.typography`, each with a CSS stack and a display name (the real font's name):

| Role | Config keys | Default |
| --- | --- | --- |
| `heading` | `heading_font_family`, `heading_font_name` | System font stack, "System Font" |
| `body` | `body_font_family`, `body_font_name` | System font stack, "System Font" |
| `accent` | `accent_font_family`, `accent_font_name` | Georgia |
| `monospace` | `mono_font_family`, `mono_font_name` | System monospace stack, "System Monospace" |

The generator only sets the stacks. When a theme is built from a design or a live site, the theme skills (`figma-to-block-theme`, `site-to-design-tokens`) replace them with the real fonts and add the font files.

The interactive agent is available with `npm run agent:generate`. See [docs/GENERATE_THEME.md](docs/GENERATE_THEME.md) for every option and placeholder.

## Working on the tooling

```bash
npm run lint      # Lint the scripts
npm test          # Run the tooling test suite (Jest)
```

See [AGENTS.md](AGENTS.md) for the agent index and contribution rules, and [CHANGELOG.md](CHANGELOG.md) for release history.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
