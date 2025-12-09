# Getting Started with Repository Governance

Welcome! This is your navigation hub for project governance, standards, and workflows.

## Essential Reading (15-20 min)

1. [GOVERNANCE.md](docs/GOVERNANCE.md) - Core policies
2. [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Project structure
3. [DEVELOPMENT.md](DEVELOPMENT.md) - Development quick start

**AI Agents:** See [.github/instructions/](.github/instructions/) for all AI-specific rules

## Quick Start Workflow

```bash
git checkout -b feature/your-feature
npm run lint && npm run test
git commit -m "feat: description"
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for complete workflow

## File Locations

| Type | Location |
|------|----------|
| JS/CSS source | `src/{js,css}/` |
| PHP code | `inc/` |
| Patterns | `patterns/` |
| Tests | `tests/` |
| Docs | `docs/` |

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete structure

## Naming Conventions

- Files: `kebab-case.{ext}`
- Docs: `UPPER-KEBAB.md`
- Logs: `YYYY-MM-DD-name.log`

See [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) for details

## Quality Standards

```bash
npm run lint && npm run test  # Required before commit
```

- Linting: Zero errors
- Tests: 80%+ coverage
- Docs: Updated with changes

See [GOVERNANCE.md](docs/GOVERNANCE.md) for complete requirements

## Documentation

**Core:** [docs/GOVERNANCE.md](docs/GOVERNANCE.md) | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | [DEVELOPMENT.md](DEVELOPMENT.md)

**All docs:** [docs/](docs/) directory

---

**Need help?** Check [docs/GOVERNANCE.md](docs/GOVERNANCE.md) or [CONTRIBUTING.md](CONTRIBUTING.md)
