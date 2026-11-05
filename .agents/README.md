# Shared Skills

Skills shared by Claude Code, Codex and Gemini CLI. Root `AGENTS.md` (where present) comes first, and the LightSpeed organisation rules come before it.

| Location | Purpose |
| --- | --- |
| `skills/<name>/SKILL.md` | Skills. The WordPress skills are vendored from [WordPress/agent-skills](https://github.com/WordPress/agent-skills); see `skills/VENDORED.md` for the pinned commit. |

## How Each Tool Finds Them

- **Claude Code**: each folder in `.claude/skills/` is a relative symlink to the folder here.
- **Codex** and **Gemini CLI**: read `skills/` here directly.

Keep the symlinks: Git stores them, so do not replace them with copies.

## Updating the vendored skills

Do not edit vendored skills here. In the scaffold repository, change `scripts/agent-skills.json` (skill list or pinned commit) and run `npm run sync:agent-skills`, then `npm run sync:agent-skills:check`.

## Limits

A skill describes how to do the work. It does not grant permission to push, publish, release or contact anyone; that comes from the user, and the organisation's rules still apply.
