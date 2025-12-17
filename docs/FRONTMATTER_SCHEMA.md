# Frontmatter Schema Reference

This document summarizes the metadata schema enforced by `.github/schemas/frontmatter.schema.json` so automation tooling stays aligned with the validator (`scripts/validation/validate-agent-frontmatter.js`).

## Schema Requirements

The JSON schema requires the following shape in every `.agent.md` spec:

| Field | Type | Notes |
| --- | --- | --- |
| `description` | `string` | Human-readable explanation of what the agent does; this is the only required top-level string. |
| `tools` | `array<string>` | Must be present and contain at least one string. Each entry describes the capabilities the agent may exercise (e.g., `read_file`, `run_in_terminal`). |
| `metadata.guardrails` | `string` | Nested in the `metadata` object, this field must spell out safety guardrails. |

All other values (such as `name`, `title`, `version`, `last_updated`, `owners`, `tags`, `status`, `apply_to`, `runtime`, `entrypoint`, `permissions`, `references`, and the rest of `metadata`) are optional, but they are still valuable for documentation and audits.

## Recommended Metadata Fields

It is best practice to keep the following keys even though the schema does not mark them as required:

| Field | Type | Description |
| --- | --- | --- |
| `name`/`title` | `string` | Human-friendly identifier for the agent. Keep both when possible (`name` for scripts, `title` for docs).
| `version` | `string` | Semantic version or revision tag for the spec.
| `last_updated` | `string` (`date`) | ISO-formatted date (YYYY-MM-DD) to indicate spec freshness; this is enforced via the `format` property in the schema.
| `owners` | `array<string>` | At least one owner should be listed so stakeholders know who maintains the agent.
| `tags` | `array<string>` | Helps group agents (e.g., `release`, `validation`).
| `status` | `string` | Lifecycle state such as `active`, `draft`, or `archived`.
| `apply_to` | `string|array<string>` | Glob or globs describing the files/workflows this agent touches.
| `runtime` | `string` | Host environment (`node`, `github-copilot`, etc.).
| `entrypoint` | `string` | Command or path used to launch the agent.
| `references` | `array<string>` | Related docs/tests/workflows (must include `.github/agents/agent.md`).
| `permissions` | `array<string>` | Optional; see the approved vocabulary below.
| `metadata` | `object` | Additional guardrails beyond `guardrails`; `additionalProperties` allowed by the schema.

## Tools Vocabulary

Every entry in `tools` must be a string. Common values we expect to see include:

- `read_file`, `write_file`, `create_file`, `delete_file`
- `search`, `edit`, `fetch`, `semantic_search`
- `run_in_terminal`, `execute`, `execute/runTask`
- `vscode`, `vscodeAPI`, `web`, `github:*`

Treat these as permissions. If a tool is omitted, operate as if that capability is unavailable.

## Permissions Vocabulary

The `permissions` array (when present) accepts the following values only, mirroring the schema enum: `read`, `write`, `execute`, `filesystem`, `network`, `shell`, `github:repo`, `github:issues`, `github:pulls`, `github:workflows`, `github:checks`, `github:actions`. Entries must be unique strings.

## Validator Notes

- `scripts/validation/validate-agent-frontmatter.js` confirms `tools` is a non-empty array, `permissions` entries belong to the approved vocabulary, and `metadata.guardrails` exists.
- `js-yaml` is used to parse the YAML frontmatter; keep the top/bottom `---` markers intact.
- Additional keys outside the schema are allowed (the schema sets `additionalProperties: true`).

To inspect the enforcement directly:

```sh
node scripts/validation/validate-agent-frontmatter.js
```

## Sample Frontmatter

```yaml
---
name: "Sample Agent"
description: "Automates theme validation"
version: "v1.0"
last_updated: "2025-12-20"
owners: ["LightSpeedWP Engineering"]
tags: ["validation","theme"]
status: "active"
apply_to: ".github/agents/*.agent.md"
runtime: "node"
entrypoint: "scripts/validation/validate-theme-config.js"
tools:
  - run_in_terminal
  - read_file
  - update_file
permissions:
  - read
  - write
  - shell
references:
  - ".github/agents/agent.md"
  - ".github/workflows/agent-build.yml"
metadata:
  guardrails: "Always validate config files before generation."
  notes: "This field may include release instructions later."
---
```

This example satisfies the schema because `description`, `tools`, and `metadata.guardrails` are present. The optional `permissions`, references, and metadata extensions are included for completeness.
