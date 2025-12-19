---
title: "Pre-Release Validation Prompt"
description: "Prompt for running pre-release validation steps only (lint, test, dry-run build, placeholder checks) for {{theme_name}}."
category: "release"
---

# Pre-Release Validation for {{theme_name}}

You are running the release agent in **pre-release validation mode** for the generated theme **{{theme_name}}**.

**In this mode, only the following steps will be performed:**

- Linting (JS, PHP, CSS)
- Unit and integration tests
- Dry-run build (no files are published or changed)
- Mustache placeholder checks (no `{{...}}` tokens should remain)
- Validation of all release requirements

**No version bump, changelog update, packaging, or publishing will occur.**

If all checks pass, you may proceed to the full release process.

---

_This prompt is loaded automatically when pre-release validation mode is selected for {{theme_name}}._
