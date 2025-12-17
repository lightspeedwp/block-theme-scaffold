---
name: "Research and Investigation"
description: "Instructions for AI agents on conducting research, documenting findings, and storing research outputs"
applyTo: "**"
---

# Task Researcher Instructions for AI Agents

## Overview

This guide defines how AI agents should conduct research, document findings, and organize research outputs for the block-theme-scaffold project.

## Research Output Locations

All research outputs MUST be stored in `.github/reports/research/`:

```
.github/reports/research/
├── YYYY-MM-DD-topic-name.md           # Research findings
├── YYYY-MM-DD-topic-name-summary.json # Structured data
└── YYYY-MM-DD-comparative-analysis.md # Comparisons
```

**Note:** Research differs from project plans:
- **Research** (`.github/reports/research/`) - Investigation findings, data analysis, comparative studies
- **Plans** (`.github/projects/plans/`) - Implementation plans and design documents

## Research Document Format

### Research Report Template

```markdown
---
title: "[Research Topic]"
date: YYYY-MM-DD
researcher: [Agent Name]
status: in-progress|completed
category: [technical|design|performance|security|best-practices]
---

# [Research Topic]

## Research Question
What specific question or problem is being investigated?

## Background
Context and motivation for the research.

## Methodology
How the research was conducted:
- Sources consulted
- Tools used
- Analysis approach

## Findings

### Key Finding 1
Detailed description with evidence and examples.

**Evidence:**
- Source 1: [Link]
- Source 2: [Link]

**Examples:**
```[language]
// Code example
```

### Key Finding 2
...

## Comparative Analysis

| Approach A | Approach B | Approach C |
|------------|------------|------------|
| Pro/Con | Pro/Con | Pro/Con |

## Recommendations

1. **Recommendation 1**
   - Rationale
   - Implementation notes
   - Trade-offs

2. **Recommendation 2**
   ...

## References

- [Source 1 Title](URL)
- [Source 2 Title](URL)
- [Source 3 Title](URL)

## Next Steps

- [ ] Action item 1
- [ ] Action item 2

## Related Documents

- Plans: `.github/projects/plans/YYYY-MM-DD-related-plan.md`
- Reports: `.github/reports/analysis/YYYY-MM-DD-related-analysis.json`
```

### Structured Data Format

For machine-readable research outputs, create JSON files:

```json
{
  "title": "[Research Topic]",
  "date": "YYYY-MM-DD",
  "researcher": "[Agent Name]",
  "category": "technical|design|performance|security",
  "status": "completed",
  "findings": [
    {
      "topic": "Finding 1",
      "description": "...",
      "sources": ["URL1", "URL2"],
      "confidence": "high|medium|low",
      "recommendations": ["..."]
    }
  ],
  "references": [
    {"title": "...", "url": "...", "type": "documentation|article|repository"}
  ]
}
```

## Research Categories

### Technical Research
- **Purpose:** Investigate technical solutions, libraries, APIs
- **Output:** Technical analysis with code examples
- **Storage:** `.github/reports/research/YYYY-MM-DD-technical-topic.md`

### Design Research
- **Purpose:** Explore design patterns, UX best practices
- **Output:** Design recommendations with mockups/examples
- **Storage:** `.github/reports/research/YYYY-MM-DD-design-topic.md`

### Performance Research
- **Purpose:** Analyze performance metrics, optimization strategies
- **Output:** Performance data and recommendations
- **Storage:** `.github/reports/research/YYYY-MM-DD-performance-topic.md`

### Security Research
- **Purpose:** Investigate security concerns, vulnerabilities, best practices
- **Output:** Security analysis and mitigation strategies
- **Storage:** `.github/reports/research/YYYY-MM-DD-security-topic.md`

### Best Practices Research
- **Purpose:** Document industry standards, WordPress guidelines
- **Output:** Best practices guide with examples
- **Storage:** `.github/reports/research/YYYY-MM-DD-best-practices-topic.md`

## Workflow

### 1. Initiate Research

```markdown
**Research Task:** [Topic]
**Question:** [Specific question]
**Context:** [Why this research is needed]
**Deliverable:** [Expected output format]
```

### 2. Conduct Research

- Review official documentation
- Examine existing implementations
- Test approaches where applicable
- Document findings as you go
- Cite sources for all claims

### 3. Document Findings

- Create research document in `.github/reports/research/`
- Use ISO date format: `YYYY-MM-DD-topic-name.md`
- Include frontmatter metadata
- Structure findings clearly with evidence
- Add code examples where relevant

### 4. Deliver Recommendations

- Provide actionable recommendations
- Document trade-offs and considerations
- Link to related plans or reports
- Create follow-up tasks if needed

### 5. Archive and Reference

- Research remains in `.github/reports/research/` permanently
- Link from project plans when applicable
- Reference in implementation documentation
- Update if findings change over time

## Integration with Other Processes

### Link to Planning
- Research informs implementation plans
- Plans reference research documents
- Research questions may spawn new plans

**Example Link in Plan:**
```markdown
## Research
- Security considerations: `.github/reports/research/2025-12-17-security-nonce-patterns.md`
- Performance analysis: `.github/reports/research/2025-12-17-build-optimization.md`
```

### Link to Reporting
- Research findings inform decisions
- Analysis reports may reference research
- Progress reports cite research outcomes

## Validation

- [ ] All research documents use ISO date format
- [ ] Frontmatter includes all required metadata
- [ ] Findings include evidence and sources
- [ ] Recommendations are actionable
- [ ] Related documents are linked
- [ ] Files stored in `.github/reports/research/`

## Related Instructions

- `.github/instructions/reporting.instructions.md` - Report storage and structure
- `.github/instructions/task-planner.instructions.md` - Creating implementation plans
- `.github/instructions/folder-structure.instructions.md` - Complete folder structure
