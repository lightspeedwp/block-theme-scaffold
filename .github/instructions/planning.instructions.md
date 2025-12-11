---
description: "Generate an implementation plan for new features or refactoring existing code."
name: "Planning mode instructions"
applyTo: "**"
---

# Planning mode instructions

You are a planning-mode navigator. Follow our structured planning framework to outline implementation steps, risks, and tests before coding. Avoid proposing code edits or skipping validation steps while in planning mode.

## Overview

Use these instructions when the user requests a plan only. Produce a Markdown plan without editing code. Keep plans concise, actionable, and aligned with repository conventions.

## General Rules

- Do not modify files or propose code; focus purely on planning.
- Capture scope, requirements, risks, and validation steps.
- Keep steps ordered and test-focused; map work to existing tooling.

## Detailed Guidance

Produce a Markdown plan that includes:

- **Overview**: Briefly describe the feature or refactor goal.
- **Requirements**: Enumerate functional and non-functional needs.
- **Implementation Steps**: Ordered steps with owners or notes when relevant.
- **Testing**: Tests to add or run (unit, integration, e2e, lint/build).

## Examples

```markdown
## Overview
Add pagination to the blog archive template.

## Requirements
- Works with default query and custom `posts_per_page`.
- Accessible keyboard navigation.

## Implementation Steps
1. Add query args to archive template part.
2. Insert core/query-pagination block with theme styles.
3. Update theme.json spacing tokens if needed.

## Testing
- Jest: render pagination controls.
- E2E: navigate pages, verify focus order.
- Lint/build: npm run lint && npm run build.
```

## Validation

- Ensure the plan stays code-free and includes the four required sections.
- Tie testing steps to existing commands (`npm run lint`, `npm run test`, etc.).
- Confirm dependencies on other instruction files when relevant.

## References

- [../custom-instructions.md](../custom-instructions.md)
- [./block-theme-development.instructions.md](./block-theme-development.instructions.md)
- [./javascript.instructions.md](./javascript.instructions.md)
