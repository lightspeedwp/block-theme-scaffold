# Claude Code: block-theme-scaffold

@AGENTS.md

- Skills in `.claude/skills/` are symlinks to `.agents/skills/` (see `.agents/README.md`). The WordPress skills are vendored from WordPress/agent-skills at the commit in `.agents/skills/VENDORED.md`; refresh them with `npm run sync:agent-skills`, never by editing them.
- `theme-template/` is the source of generated themes and has its own `.claude/` and `.agents/`. Changes to skills apply to both through `scripts/agent-skills.json`.
- Agent tooling in `scripts/` is TypeScript. `scripts/sync-agent-skills.ts` runs on Node 24.18+ directly (type stripping), with Jest tests in `scripts/__tests__/` (`npm run test:agent-skills`, 80% coverage enforced). Do not add shell scripts.
- Put machine-specific settings in `.claude/settings.local.json`, which Git ignores.
- `.claude/settings.json` enables the `ls-claude-agents-router` plugin from the `lightspeedwp` marketplace, which routes the organisation agents in `lightspeedwp/.github` into Claude Code. Claude Code offers to install it when you trust this folder. It needs `~/.github` cloned (on `develop`) and Git access to the private repository (`gh auth login`, then `gh auth setup-git`).
