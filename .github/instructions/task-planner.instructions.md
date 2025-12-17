---
name: "Task Planning and Project Management"
description: "Instructions for Claude, Gemini, and Copilot on creating and managing task plans and project documents"
applyTo: "**"
---

# Task Planning Instructions for AI Agents

## Overview

This guide defines how AI agents (Claude, Gemini, GitHub Copilot) should create, organize, and maintain task plans and project documents for the block-theme-scaffold project.

## Plan Storage Locations

All plans and project documents MUST be stored in `.github/projects/`:

```
.github/projects/
├── plans/              # Design documents and implementation plans
├── active/             # Currently active project documents
└── completed/          # Completed project archives
```

### Directory Purposes

#### plans/ - Planning Documents
- **Purpose:** Store design documents, implementation plans, and technical specifications
- **Naming:** `YYYY-MM-DD-descriptive-name.md`
- **Content:** Detailed implementation plans with phases, tasks, and technical details

**Examples:**
- `2025-12-17-feature-implementation-plan.md`
- `2025-12-17-refactoring-design.md`
- `2025-12-17-architecture-decisions.md`

#### active/ - Active Projects
- **Purpose:** Track currently active multi-day/multi-week projects
- **Naming:** `project-slug.md`
- **Content:** Project overview, status, tasks, blockers

**Examples:**
- `theme-generator-enhancement.md`
- `testing-infrastructure.md`

#### completed/ - Completed Projects
- **Purpose:** Archive completed projects for reference
- **Naming:** `YYYY-MM-DD-project-slug.md` (date of completion)
- **Content:** Final project state, outcomes, lessons learned

## Plan Document Format

### Implementation Plan Template

```markdown
---
title: "[Feature/Task Name]"
date: YYYY-MM-DD
status: planning|in-progress|completed
owner: [Owner Name/Team]
---

# [Feature/Task Name] Implementation Plan

## Overview
Brief description of what this plan covers.

## Goals
- Goal 1
- Goal 2

## Phases

### Phase 1: [Phase Name]
**Objective:** What this phase accomplishes

**Tasks:**
- [ ] Task 1.1
- [ ] Task 1.2

**Files to Modify:**
- `path/to/file1.js`
- `path/to/file2.php`

**Testing:**
- Unit tests for X
- Integration tests for Y

### Phase 2: [Phase Name]
...

## Dependencies
- Dependency 1
- Dependency 2

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| ... | ... | ... |

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Active Project Template

```markdown
---
title: "[Project Name]"
start_date: YYYY-MM-DD
status: active
owner: [Owner Name]
---

# [Project Name]

## Project Overview
Brief description of the project.

## Current Status
- **Phase:** [Current phase]
- **Progress:** [X/Y tasks completed]
- **Blockers:** [List any blockers]

## Tasks

### To Do
- [ ] Task 1
- [ ] Task 2

### In Progress
- [ ] Task 3 (Owner: X, Started: YYYY-MM-DD)

### Completed
- [x] Task 4 (Completed: YYYY-MM-DD)

## Recent Updates

### YYYY-MM-DD
- Update 1
- Update 2

## Links
- Plan: `.github/projects/plans/YYYY-MM-DD-plan-name.md`
- Reports: `.github/reports/projects/active/project-slug/`
```

## Workflow

### Creating a New Plan

1. **Create plan document** in `.github/projects/plans/`
2. **Use ISO date format** in filename: `YYYY-MM-DD-descriptive-name.md`
3. **Include frontmatter** with metadata
4. **Break into phases** with clear tasks and deliverables
5. **Link to related docs** and dependencies

### Starting a Project

1. **Create active project** document in `.github/projects/active/`
2. **Reference plan** from `.github/projects/plans/`
3. **Track progress** with task lists
4. **Update regularly** with status and blockers

### Completing a Project

1. **Mark status** as completed in active document
2. **Add completion date** to filename
3. **Move to completed/** directory
4. **Archive related reports** to `.github/reports/archived/`

## Integration with Reporting

Project plans should reference and be referenced by:

- **Progress Reports:** `.github/reports/projects/active/[project-slug]/YYYY-MM-DD-daily-progress.md`
- **Logs:** `logs/projects/YYYY-MM-DD-[project-slug].log`
- **Test Results:** Reports in `.github/reports/` subdirectories

## AI Agent Responsibilities

### Claude
- Create detailed implementation plans
- Break complex tasks into phases
- Identify dependencies and risks
- Track project progress

### Gemini
- Review and refine plans
- Identify missing considerations
- Suggest alternative approaches
- Validate technical feasibility

### GitHub Copilot
- Generate task lists from plans
- Create progress reports
- Update project status
- Link related documents

## Examples

### Creating a Plan

```bash
# Claude creates implementation plan
# Stored at: .github/projects/plans/2025-12-17-theme-json-enhancement.md
```

### Starting a Project

```bash
# Claude creates active project
# Stored at: .github/projects/active/theme-json-enhancement.md

# Links to plan:
# Plan: .github/projects/plans/2025-12-17-theme-json-enhancement.md
```

### Completing a Project

```bash
# Claude updates status to "completed"
# Moves file to: .github/projects/completed/2025-12-20-theme-json-enhancement.md
# (using completion date)
```

## Validation

- [ ] All plans use ISO date format in filename
- [ ] Frontmatter includes required metadata
- [ ] Active projects link to their plans
- [ ] Completed projects are dated with completion date
- [ ] Progress reports reference project documents

## Related Instructions

- `.github/instructions/reporting.instructions.md` - Progress report format
- `.github/instructions/planning.instructions.md` - General planning guidance
- `.github/instructions/folder-structure.instructions.md` - Complete folder structure
