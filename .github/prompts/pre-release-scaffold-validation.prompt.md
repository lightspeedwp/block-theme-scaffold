---
title: "Pre-Release Scaffold Validation Prompt"
description: "Prompt for running pre-release validation steps only (lint, test, dry-run build, placeholder checks)."
category: "release-scaffold"
---

# Pre-Release Scaffold Validation

You are running the **release-scaffold agent** in **pre-release validation mode**. This mode uses the same wizard system as the full release process, but only performs validation steps (no changes are made).

**Wizard/Agent Integration:**

- This prompt is powered by `scripts/agents/release-scaffold.agent.js` (agent implementation) and `scripts/agents/release-scaffold.questions.js` (wizard questions/config).
- The wizard logic is implemented in `scripts/lib/wizard.js`.

**Relationship to Full Release:**

- This prompt is paired with `.github/prompts/release-scaffold.prompt.md`, which is used for the full scaffold release process after validation passes.
- Both prompts invoke the release-scaffold agent and the interactive wizard (see `scripts/lib/wizard.js`).
- To proceed to a full release, run the main release wizard after all validation checks pass.

**In this mode, only the following steps will be performed:**

- Linting (JS, PHP, CSS)
- Unit and integration tests
- Dry-run build (no files are published or changed)
- Mustache placeholder checks
- Validation of all release requirements

**No version bump, changelog update, packaging, or publishing will occur.**

If all checks pass, you may proceed to the full release process using `.github/prompts/release-scaffold.prompt.md`.

---

_This prompt is loaded automatically when pre-release validation mode is selected. See also: `.github/prompts/release-scaffold.prompt.md` for the next step in the workflow._
