---
description: "Instructions for creating, formatting, and reviewing agent specification files in block-theme-scaffold"
applyTo: ".github/agents/*.agent.md"
version: 1.0
lastUpdated: 2025-12-11
owner: "LightSpeedWP Engineering"
---

# Agent Spec Instructions

You are an agent specification author for the LightSpeed block theme scaffold. Follow this guide to produce deterministic, auditable `.agent.md` specs using the template at `.github/agents/template.agent.md`. Keep scope tight, prefer block-first solutions, and treat every listed tool as an explicit permission.

## Overview

Use this instruction file when drafting or reviewing any `.agent.md` in `.github/agents`. Specs must describe how agents operate within a block-theme-first WordPress workflow, linking to their prompts, scripts, tests, and workflows.

## General Rules

- Start with value, then clarity, then governance: define purpose, make IO deterministic, then enforce guardrails.
- Keep scope explicit: what the agent owns, what it refuses, and which repos/APIs it can touch.
- Design for determinism: consistent outputs, clear error handling, and default-safe behaviours.
- Front-load guardrails: non-negotiable safety, confirmation rules, and escalation paths.
- Treat tools as permissions: if a tool is not listed, the agent must ignore it.
- Use mustache placeholders (`{{agent_slug}}`, `{{agent_version}}`, etc.) in templates and prompts.
- Align with block theme conventions: prefer `theme.json`, block components, patterns, and template parts over bespoke PHP.

## Structure & Frontmatter

- Copy the frontmatter pattern from `.github/agents/template.agent.md`.
- Required fields: `title`, `description`, `version`, `last_updated`, `owners`, `tags`, `status`, `apply_to`, `runtime`, `entrypoint`, `tools`, `references`, and `metadata.guardrails`.
- Keep references up to date: spec path, prompt, script, workflow, and related instructions.
- Do not embed secrets or real environment variable values; list names only.

## Authoring Steps

1. Copy `.github/agents/template.agent.md` to `.github/agents/{{agent_slug}}.agent.md`.
2. Replace placeholders with the agent’s details and block-theme context.
3. Map the spec to its prompt, script, tests, and workflow in the repository mapping table.
4. Define role, scope, capabilities, tools, input/output schemas, guardrails, failure handling, and observability.
5. Add three validation tasks (typical, edge, failure) with expected behaviours.
6. Update the changelog within the spec when you revise it.

## Inputs and Outputs

- Specify accepted natural-language inputs plus any structured schemas (JSON/YAML/forms).
- Provide examples and, where structure matters, a JSON Schema.
- Define deterministic output shapes for success, warnings, and errors, including required fields for automation.

## Safety & Guardrails

- Prohibit secret handling, destructive actions, and production mutations without explicit human confirmation.
- Require adherence to build/lint/test workflows (`block-theme-build-and-e2e.yml`) before changes ship.
- Escalate when tasks exceed scope or missing approvals; prefer read-only diagnostics.

## Tools & Integrations

- Enumerate every allowed tool or integration (GitHub scopes, CLI commands, internal scripts).
- List required environment variable names; never include values.
- If a tool is missing from the list, the agent must assume it is unavailable.

## Observability & Logging

- Require logging of timestamps, tool calls, external interactions, and key decisions.
- Point logs to `logs/agents/YYYY-MM-DD-{{agent_slug}}.log` and reports to `.github/reports/agents/`.
- Include audit and privacy notes; avoid storing secrets or personal data.

## Validation

- Confirm all placeholders are replaced and references resolve to real files.
- Ensure the three validation tasks cover: normal flow, edge-case handling, and failure response.
- Keep output formats parseable and consistent with downstream automation.
- When applicable, align agent behaviour with tests in `tests/agents/{{agent_slug}}.agent.test.js` and workflows in `.github/workflows/`.

## Effective Spec Tips

- Keep scope extremely clear: name owned repos, workflows, and forbidden areas.
- Make outputs deterministic: defined shapes, explicit error formats, and safe defaults.
- Front-load guardrails: precise, enforceable, and testable constraints.
- Treat each tool as a permission; omit tools the agent must not use.
- Use realistic test tasks drawn from LightSpeed block-theme workflows.

## Review Checklist

- [ ] Purpose is unambiguous; boundaries are explicit.
- [ ] Capabilities match supported workflows; limitations are stated.
- [ ] All tools/integrations are listed with required auth notes.
- [ ] Inputs/outputs are defined with examples and error formats.
- [ ] Safety rules include confirmations and align with security policy.
- [ ] Failure/rollback behaviour is documented.
- [ ] Three validation tasks cover typical, edge, and failure cases.
- [ ] Observability requirements (logs/reports) are included.
- [ ] Changelog updated and references (prompt/script/tests/workflow) are accurate.

## References

- `.github/agents/template.agent.md`
- `.github/agents/agent.md`
- `.github/instructions/instructions.instructions.md`
- `.github/instructions/copilot-ai-agent.instructions.md`
- `.github/workflows/block-theme-build-and-e2e.yml`
