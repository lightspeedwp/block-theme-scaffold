---
title: Gemini Instructions
description: Custom instructions for Google Gemini AI assistant
category: Project
type: Guide
audience: AI Assistants
date: 2025-12-01
---

---
title: Gemini Instructions
description: Custom instructions for the Google Gemini AI assistant
category: Project
type: Guide
audience: AI Assistants, Developers
date: 2025-12-01
---

## Overview & Related Files

This document provides guidelines for using the Gemini AI assistant for advanced code generation, refactoring, and documentation in this WordPress block theme repository. All interactions should adhere to the global AI rules and the specific agent specifications outlined in the project.

**Related Files:**
- **Gemini Agent Spec:** [.github/agents/gemini.agent.md](./.github/agents/gemini.agent.md)
- **Main Agent Index:** [.github/agents/agent.md](./.github/agents/agent.md)
- **Global AI Rules:** [AGENTS.md](./AGENTS.md)
- **Custom Instructions:** [.github/custom-instructions.md](./.github/custom-instructions.md)
- **Prompts:** [.github/prompts/prompts.md](./.github/prompts/prompts.md)

---

## Principles and Best Practices

When using Gemini, adhere to the following principles, which are aligned with the global repository standards defined in `AGENTS.md`:

- **Review and Test:** Always review and test Gemini-generated code before merging.
- **Follow Standards:** Adhere to the project's [Coding Standards](.github/instructions/coding-standards.instructions.md) and [Linting Standards](.github/instructions/linting.instructions.md).
- **Use Conventions:** Use mustache variables and established organizational naming conventions in all output.
- **Modularity:** Prefer modular, reusable code with minimal dependencies.
- **Security:** Never output secrets. Follow OWASP Top 10 security practices.
- **Performance & Accessibility:** These are non-negotiable. Highlight any potential issues.
- **Documentation:** Document all significant changes in PRs and commit messages.

---

## Example Prompts

Here are some examples of effective prompts for Gemini:

- "Generate a `theme.json` color palette with semantic and numeric tokens based on the project's design system."
- "Refactor the `[function_name]` PHP function in `[file_path]` for improved security and performance, ensuring it follows WordPress Coding Standards."
- "Create a Playwright E2E test for the navigation block to verify its responsiveness on mobile devices."
- "Add a dark mode style variation to `theme.json` that inverts the primary and background colors."
- "Explain the data flow in the `[component_name]` JavaScript component."

---

## Related Documentation

For a complete understanding of the AI and automation framework in this repository, refer to the following files:

- **Global AI & Agent Rules:** [AGENTS.md](./AGENTS.md)
- **Main Agent Index:** [.github/agents/agent.md](./.github/agents/agent.md)
- **Custom Instructions for all AIs:** [.github/custom-instructions.md](./.github/custom-instructions.md)
- **Prompt Library:** [.github/prompts/prompts.md](./.github/prompts/prompts.md)
- **All Instructions:** See the files in the [.github/instructions/](./.github/instructions/) directory.
