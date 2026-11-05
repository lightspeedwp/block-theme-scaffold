# Claude Code: {{theme_name}}

{{theme_name}} is a WordPress block theme generated from LightSpeed's block-theme-scaffold.

- Prefer `theme.json` settings and styles, block markup, patterns and template parts over custom CSS and PHP.
- Skills in `.claude/skills/` are symlinks to `.agents/skills/` (see `.agents/README.md`). Use `wp-block-themes` for `theme.json`, templates, parts and style variations, `wp-patterns` for patterns, and `wp-block-development` for custom blocks. The WordPress skills are unmodified copies; see `.agents/skills/VENDORED.md`.
- Run `npm run lint` and `npm test` before handing work over.
- Put machine-specific settings in `.claude/settings.local.json`, which Git ignores.
- `.claude/settings.json` enables the `ls-claude-agents-router` plugin from the `lightspeedwp` marketplace, which routes the organisation agents in `lightspeedwp/.github` into Claude Code. Claude Code offers to install it when you trust this folder. It needs `~/.github` cloned (on `develop`) and Git access to the private repository (`gh auth login`, then `gh auth setup-git`).
