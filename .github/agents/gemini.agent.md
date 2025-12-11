---
title: Gemini Agent Specification
description: Documentation for the Gemini Master Control Program (MCP) agent
category: Project
type: Reference
audience: AI Assistants, Developers
date: 2025-12-01
---

## Overview

This document specifies the Gemini Master Control Program (MCP) agent. This agent acts as a primary interface for leveraging Google's Gemini models for advanced code generation, refactoring, and other development tasks within this repository.

**Related Files:**

- [Agent Script](../../scripts/gemini.agent.js)
- [Custom AI Instructions](../custom-instructions.md)
- [Main Agent Index](./agent.md)

---

## Agent: Gemini MCP

- **Agent Spec:** `.github/agents/gemini.agent.md`
- **Agent Script:** `scripts/gemini.agent.js`
- **Purpose:** To provide a powerful, centralized interface for Gemini-driven development, ensuring all interactions and code generation adhere to the repository's standards and best practices.
- **Usage:**
  - The agent is activated through the Gemini CLI.
  - It can be used for tasks such as:
    - Generating block patterns, templates, and `theme.json` configurations.
    - Refactoring PHP, JS, and SCSS code.
    - Writing tests for blocks and theme features.
    - Explaining complex code.
- **Maintenance:** The agent should be kept in sync with the latest Gemini models and the repository's coding standards.
