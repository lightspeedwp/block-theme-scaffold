# Project Summary: Dry-Run Release Smoke Tests

- **Status:** Completed
- **Outcome:** Demonstrated a release-safe path by running `npm run dry-run:release` and `npm run dry-run:release-scaffold`, ensuring both agents honor placeholder substitution before generating artifacts.
- **Notes:** The release helper (`scripts/dry-run/release-dry-run.js`) selects the correct agent (`release.agent.js` vs `release-scaffold.agent.js`), defaults to the `validate` command, and relies on `dry-run/with-dry-run.js` so nothing escapes the template folder.
- **Takeaways:** Blocking release checks via dry-run scripts is now documented in `.github/reports/research/placeholder-strategies.md`, and future release work should start from these smoke tests before running the real generation.
