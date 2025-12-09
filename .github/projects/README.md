# Projects Directory

This directory contains AI/Copilot projects currently in development or being tracked.

## Purpose

Track active initiatives and work-in-progress projects that improve the block-theme-scaffold repository. Projects in this directory are ongoing efforts that will eventually be archived to the reports directory once completed.

## Status Tracking

Projects use status indicators to show current progress:

- **✅ Complete** - Task or phase finished
- **🔄 In Progress** - Actively being worked on
- **⏳ Pending** - Waiting to be started
- **❌ Blocked** - Blocked by dependencies or issues

## Current Projects

### context-reduction.md

**Status:** 🔄 In Progress (Phase 4 of 5)

**Purpose:** Comprehensive plan to reduce token bloat and context usage in the block-theme-scaffold repository.

**Phases:**

- ✅ Phase 1: Delete Model-Specific Files (~495 lines removed)
- ✅ Phase 2: Consolidate Documentation (merged governance and development docs)
- ✅ Phase 3: Optimize Core Index Files (reduced AGENTS.md, agent.md, prompts.md)
- 🔄 Phase 4: Streamline Instruction Files (currently in progress)
- ⏳ Phase 5: Reduce Frontmatter References (pending)

**Expected Outcome:** Reduce context token usage by 40-50% while maintaining documentation quality.

**Owner:** AI Agents / Copilot

**Last Updated:** December 9, 2025

## Project Workflow

### Starting a New Project

1. Create a markdown file in `.github/projects/`
   - Filename: `{project-name}.md`
   - Example: `context-reduction.md`

2. Include project header:

   ```markdown
   # Project Title

   **Status:** ⏳ Pending
   **Owner:** [Copilot/AI Agent/Developer Name]
   **Start Date:** YYYY-MM-DD
   **Expected Completion:** YYYY-MM-DD
   ```

3. Document project sections:
   - Objective/Goals
   - Scope/Deliverables
   - Tasks/Phases (with status indicators)
   - Success Criteria
   - Related Files

4. Track progress with status updates:
   - Update status regularly
   - Mark completed tasks
   - Note blockers or issues

### Completing a Project

1. Mark all tasks as ✅ Complete
2. Update status to `✅ Complete`
3. Add completion date
4. Move file to `.github/reports/` (rename to match report naming convention)
5. Create archive entry in reports directory

### Archive Strategy

- Keep projects in this directory while active
- Move to `.github/reports/` when 100% complete
- Archive projects older than 3 months (if still incomplete)
- Review archived projects quarterly for reference

## Moving to Reports

When a project is complete:

```bash
# Move completed project to reports
git mv .github/projects/{project-name}.md .github/reports/{project-name}-report.md

# Update file with completion date and final status
# Add "report" to filename to indicate it's archived
```

## Related Files

- [FILE_ORGANIZATION.md](../FILE_ORGANIZATION.md) - Overall file organization guide
- [.github/reports/](../reports/README.md) - Completed project reports
- [docs/](../../docs/README.md) - Permanent documentation
- [GOVERNANCE.md](../../docs/GOVERNANCE.md) - Project governance

## Best Practices

1. **Be Specific**: Clearly define project goals and deliverables
2. **Break Down Work**: Divide projects into manageable phases or tasks
3. **Track Progress**: Update status regularly (at least weekly)
4. **Link Dependencies**: Reference related files and dependencies
5. **Document Decisions**: Record why decisions were made
6. **Estimate Timelines**: Provide target dates for phases
7. **Archive Successfully**: Move completed projects to reports promptly

## Example Project Structure

```markdown
# Project: Performance Optimization Sprint

**Status:** 🔄 In Progress
**Owner:** Copilot Code Review Agent
**Start Date:** 2025-12-01
**Expected Completion:** 2025-12-15

## Objective

Reduce Lighthouse performance score to 90+ and bundle size by 20%.

## Phases

### Phase 1: Bundle Analysis
- 🔄 Generate webpack-bundle-analyzer report
- ⏳ Identify optimization opportunities
- ⏳ Prioritize high-impact changes

### Phase 2: Code Splitting
- ⏳ Implement lazy loading for editor.js
- ⏳ Separate theme.js utilities
- ⏳ Test performance impact

### Phase 3: Testing & Validation
- ⏳ Run lighthouse audit
- ⏳ Verify no regressions
- ⏳ Document improvements

## Success Criteria

- [ ] Lighthouse Performance ≥ 90
- [ ] Bundle size reduction ≥ 20%
- [ ] Zero performance regressions
- [ ] All tests passing

## Related Files

- reports/2025-12-01-bundle-analysis.json
- docs/PERFORMANCE.md
- webpack.config.js
```

---

**Last Updated:** December 9, 2025
**Version:** 1.0.0
