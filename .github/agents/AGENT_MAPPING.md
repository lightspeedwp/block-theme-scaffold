# Agent File Mapping

| Agent | Spec | Script | Instructions | Prompts | Tests | Workflow |
| --- | --- | --- | --- | --- | --- | --- |
| Block Theme Build | .github/agents/block-theme-build.agent.md | scripts/block-theme-build.agent.js | .github/instructions/block-theme-development.instructions.md | .github/prompts/block-theme-build.prompt.md | scripts/__tests__/block-theme-build.agent.test.js | .github/workflows/block-theme-build-and-e2e.yml |
| Generate Theme | .github/agents/generate-theme.agent.md | scripts/generate-theme.agent.js | .github/instructions/generate-theme.instructions.md | .github/prompts/generate-theme.prompt.md | tests/agents/generate-theme.agent.test.js | .github/workflows/agent-generate-theme.yml |
| Development Assistant | .github/agents/development-assistant.agent.md | scripts/development-assistant.agent.js | .github/instructions/copilot-ai-agent.instructions.md | .github/prompts/development-assistant.prompt.md | tests/agents/development-assistant.agent.test.js | _TBD_ |
| Gemini | .github/agents/gemini.agent.md | scripts/gemini.agent.js | .github/instructions/copilot-ai-agent.instructions.md | .github/prompts/gemini.prompt.md | tests/agents/gemini.agent.test.js | _TBD_ |
| Release Manager | .github/agents/release.agent.md | scripts/release.agent.js | docs/RELEASE_PROCESS.md | .github/prompts/release.prompt.md | tests/agents/release.agent.test.js | .github/workflows/agent-release.yml |
| Reporting | .github/agents/reporting.agent.md | scripts/reporting.agent.js | .github/instructions/reporting.instructions.md | _TBD_ | tests/agents/reporting.agent.test.js | .github/workflows/agent-reporting.yml |
