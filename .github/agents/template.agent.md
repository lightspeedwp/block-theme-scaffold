---
name: "Template: Agent Specification"
description: "Reusable LightSpeedWP agent spec template covering role, behaviours, tooling, schemas, safety, and validation for block-theme-scaffold."
version: "v1.1"
last_updated: "2025-12-11"
owners: ["LightSpeedWP Engineering"]
tags: ["agent", "spec", "template", "copilot", "block-theme"]
status: "draft"
apply_to: [".github/agents/*.agent.md"]
file_type: "template"
tools: ["Copilot Agents"]
permissions: ["read", "write", "filesystem"]
metadata:
  guardrails: |
    Only apply types/labels from canonical configs. Never overwrite without warning. Validate all content. Log all actions. Preserve user data integrity.
    Agents must never perform destructive or irreversible actions without explicit confirmation.
---

# Template Usage

- Copy this file to `.github/agents/{{agent_slug}}.agent.md`.
- Replace `{{placeholders}}` with the agent's values; keep the section order.
- Link the spec to its script, prompt, workflow, and tests in the **Repository Mapping** table.
- Align guardrails with `.github/instructions/agent-spec.instructions.md`, `AGENTS.md`, and security policy.

## Copyable Frontmatter (update per agent)

```yaml
---
title: "{{agent_title}}"
description: "{{agent_summary}}"
version: "{{agent_version}}"
last_updated: "{{last_updated}}"
owners: ["{{owner}}"]
tags: ["agent", "{{team}}", "{{domain}}"]
status: "{{status}}"
apply_to: [".github/agents/{{agent_slug}}.agent.md"]
runtime: "{{runtime_or_host}}"
entrypoint: "{{script_path_or_command}}"
tools:
  - run_in_terminal
  - read_file
  - file_search
references:
  - "AGENTS.md"
  - ".github/instructions/agent-spec.instructions.md"
  - ".github/prompts/{{agent_slug}}.prompt.md"
  - ".github/workflows/{{agent_workflow}}.yml"
metadata:
  guardrails: "{{short_guardrail_summary}}"
---
```

# Repository Mapping

| Area     | Path/ID placeholder                          | Notes                               |
| -------- | -------------------------------------------- | ----------------------------------- |
| Spec     | `.github/agents/{{agent_slug}}.agent.md`     | This file                           |
| Prompt   | `.github/prompts/{{agent_slug}}.prompt.md`   | Input patterns, required variables  |
| Script   | `scripts/{{agent_slug}}.agent.js`            | Implementation/entrypoint           |
| Tests    | `tests/agents/{{agent_slug}}.agent.test.js`  | Validation suite (unit/integration) |
| Workflow | `.github/workflows/{{agent_workflow}}.yml`   | CI trigger for build/lint/e2e       |
| Reports  | `.github/reports/agents/{{date}}-{{slug}}.*` | Logs/outputs written by the agent   |

# 1. Role & Scope

- **Role:** `{{agent_role}}`
- **Scope:** `{{boundaries_and_context}}` (block-theme-first; prefers `theme.json`, block components, and patterns)
- **Supported systems:** `{{systems_repos_apis}}`
- Clarify what the agent must decline (out-of-scope repos, infra, billing, deployments).

# 2. Responsibilities & Capabilities

- List allowed actions (`{{capabilities}}`) and explicit stops (`{{limitations}}`).
- Note block theme preferences: use `theme.json`, blocks, patterns, and template parts; avoid bespoke PHP unless necessary.
- Include automation rules, defaults, and required confirmations.

# 3. Allowed Tools & Integrations

- Enumerate tools and permissions (GitHub scopes, CLI commands, internal scripts).
- List required env vars (names only) and data classification rules.
- If a tool is not listed, the agent must treat it as unavailable.

# 4. Input Specification

- Define accepted inputs: natural language + structured payloads (JSON/YAML/forms).
- Provide JSON Schema where structure matters; include mustache variables for templated prompts.
- Add concrete examples for happy path and edge cases.

# 5. Output Specification

- Specify required output shape (success/warning/error) with deterministic fields.
- Formatting rules (Markdown, JSON blocks, tables) and parsing needs.
- Include log references/paths when outputs produce artifacts.

# 6. Safety Guardrails

- Non-negotiable prohibitions: no secrets, no destructive actions without confirmation, no production mutations without approval.
- Refuse tasks outside scope; prefer read-only for diagnostics.
- Escalation/approval rules and rate/moderation limits.
- Block theme constraint: do not bypass build/lint workflows; prefer declarative changes.

# 7. Failure & Rollback Strategy

- How to respond to invalid inputs, missing context, and failing tools.
- Steps for partial success handling and rollback expectations or limitations.
- Recovery defaults (for example restore from git; never delete user files to recover).

# 8. Test Tasks (for Validation)

- Provide three minimal tasks with expected results:
  - **Typical task** → expected behaviour and outputs.
  - **Edge case** → safe handling and confirmations required.
  - **Failure case** → deterministic error/rollback response.
- Reference the workflow or test file that validates these behaviours.

# 9. Observability & Logging

- Required logs: timestamps, tool calls, external interactions, decisions.
- Storage locations: `logs/agents/{{date}}-{{slug}}.log`, `.github/reports/agents/{{date}}-{{slug}}.*`.
- Metrics/audit rules and privacy notes (do not store secrets/PPI).

# 10. Changelog

- Keep an ordered list of spec changes with version and date.
- Example: `v1.1 (2025-12-11) – Updated guardrails; clarified rollback behaviour; aligned with block-theme-scaffold.`
