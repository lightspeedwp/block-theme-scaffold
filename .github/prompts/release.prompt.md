---
description: Release preparation prompt for {{theme_name}} generated from the block theme scaffold
---

# {{theme_name}} Release Prompt

This prompt is used **after** the theme is generated and placeholders are replaced. If any `{{...}}` tokens remain, regenerate before continuing.

## 🚀 Release Wizard

Use this interactive wizard to guide the release of your generated theme. This wizard is referenced by all `release-scaffold.*` files and supports mustache variables for dynamic theme releases.

## Wizard Integration

This prompt invokes the release agent, which uses the pluggable wizard.js system for configuration. You can run the wizard in interactive (cli) mode or dry-run (mock) mode:

- **Interactive:**
  ```sh
  node scripts/agents/release.agent.js
  ```
- **Dry-run:**
  ```sh
  WIZARD_MODE=mock node scripts/agents/release.agent.js
  ```

The agent's questions array is passed to runWizard(), and the mode can be set via the WIZARD_MODE environment variable.
**Step 1: Confirm Version & Placeholder-Free State**

- What is the target version for this release? (Check `VERSION`)
- Run a placeholder sweep (`grep -R "{{" .`). If any `{{...}}` tokens remain, stop and regenerate.

**Step 2: Version Consistency Check**

- Ensure `VERSION`, `package.json`, `composer.json`, and `style.css` all match and follow SemVer.

**Step 3: Quality Gates**

- Run:
  - `npm run lint`
  - `npm run format -- --check`
  - `npm run test`
  - `npm run build`

**Step 4: Documentation & Changelog Review**

- Review `CHANGELOG.md`, `README.md`, and `docs/RELEASE_PROCESS.md` for correct `{{theme_name}}` and `{{version}}` references.

**Step 5: Security Checks**

- Run `npm audit --audit-level=high` and composer audit if available.

**Step 6: Release Readiness Report**

- Summarize:
  - Placeholder status (found/none)
  - Version alignment
  - Lint/format/test/build results
  - Documentation and changelog status
  - Security audit outcome
  - Next steps (see `docs/RELEASE_PROCESS.md`)

---

## Quick Start Prompts

- "Prepare {{theme_name}} v{{version}} for release"
- "Run release validation for {{theme_slug}}"
- "Check version alignment for {{theme_name}}"
- "Generate release readiness report for v{{version}}"

> **Wizard Reference:** All `release-scaffold.*` files should reference the above Release Wizard for step-by-step guidance. This prompt supports mustache variables; update the mustache registry if new variables are introduced.

## Safety Notes

- If `release-scaffold.*` files exist, delete them—they belong only to the scaffold.
- Do not proceed while `{{...}}` placeholders remain anywhere in the repository.

## Outputs to Provide

- Placeholder status (found/none)
- Version alignment summary
- Lint/format/test/build results
- Documentation and changelog status
- Security audit outcome
- Next steps referencing `docs/RELEASE_PROCESS.md`
