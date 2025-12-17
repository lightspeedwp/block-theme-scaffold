# Frontmatter Schema Reference

This document summarizes the metadata schema shared by `.agent.md` specs, ensuring automation tooling (`scripts/validation/validate-agent-frontmatter.js`, lint rules, and doc readers) stays aligned.

## Frontmatter Structure

Each agent spec must include the following keys in its YAML frontmatter:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | ✅ | Human-readable name for the agent. |
| `description` | string | ✅ | Brief summary of the agent’s role. |
| `version` | string | ✅ | SemVer-style identifier for the spec. |
| `last_updated` | string | ✅ | ISO date when the spec was last refreshed. |
| `owners` | array | ✅ | Team/person responsible for the agent. |
| `tags` | array | ✅ | List of keywords (e.g., `["release","automation"]`). |
| `status` | string | ✅ | Current lifecycle state (`active`, `draft`, etc.). |
| `apply_to` | string\|array | ✅ | File glob that this spec describes. |
| `runtime` | string | ✅ | Execution host (e.g., `node`, `github-copilot`). |
| `entrypoint` | string | ✅ | Path or command that launches the agent. |
| `tools` | array | ✅ | Approved tool permissions (see below). |
| `permissions` | array | ⚪️ | Optional scopes (see “Permission Vocabulary”). |
| `references` | array | ✅ | Related docs/tests/workflows (must include `.github/agents/agent.md`). |
| `metadata.guardrails` | string | ✅ | Mandatory guardrail summary for safety review. |

Specs may include additional fields if required, but they must keep the above keys intact to satisfy CI validation.

## Tool Vocabulary

The `tools` array enumerates the agent’s allowed capabilities. Common entries include:

- `search`, `edit`, `fetch`, `semantic_search` for knowledge work.
- `read_file`, `update_file`, `create_file`, `delete_file`, `move_file` for file operations.
- `run_in_terminal`, `execute`, `execute/runTask`, etc., for CLI interactions.
- `vscode`, `vscodeAPI`, `web`, `github:*` for IDE or API access.

Treat each listed tool as a permission. If a tool is missing, the agent must behave as if the capability is unavailable.

## Permission Vocabulary

The new `permissions` array documents scopes beyond tooling (e.g., GitHub scopes, shell access). Keep the entries within this approved vocabulary:

- `read`
- `write`
- `execute`
- `filesystem`
- `network`
- `shell`
- `github:repo`
- `github:issues`
- `github:pulls`
- `github:workflows`
- `github:checks`
- `github:actions`

When the vocabulary grows, update this document, the schema’s enum, `.github/instructions/agent-spec.instructions.md`, and the validator before adjusting specs so validation, documentation, and automation stay in sync.

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
  - edit
permissions:
  - read
  - write
  - shell
references:
  - ".github/agents/agent.md"
  - ".github/workflows/agent-build.yml"
metadata:
  guardrails: "Always validate config files before generation."
---
```

## Keeping the Schema Updated

*Any* addition to the tools/permissions vocabulary must:

1. Update `.github/schemas/frontmatter.schema.json` so the enum includes the new value.
2. Refresh `docs/FRONTMATTER_SCHEMA.md` to describe the new scope.
3. Ensure validation tooling (e.g., `scripts/validation/validate-agent-frontmatter.js`) can handle the expanded values.

This keeps the docs, schema, and automation grounded in the same contract.
