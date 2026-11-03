#!/bin/sh
# Pre-commit: commit on a working branch whose prefix comes from
# branch-types.yml in lightspeedwp/.github.

fail() {
	echo "pre-commit: $1" >&2
	exit 1
}

branch=$(git symbolic-ref --quiet --short HEAD || true)
[ -n "$branch" ] || exit 0

case "$branch" in
	main | develop | release/*)
		fail "commit on a working branch, not directly on $branch."
		;;
	claude/* | copilot/* | openai/*)
		fail "'${branch%%/*}/' is not an allowed branch prefix."
		;;
	feat/?* | task/?* | proto/?* | fix/?* | hotfix/?* | revert/?* | \
		refactor/?* | chore/?* | docs/?* | doc/?* | i18n/?* | test/?* | \
		perf/?* | ci/?* | build/?* | deps/?* | security/?* | design/?* | \
		ds/?* | a11y/?* | ux/?* | ops/?* | audit/?* | codex/?* | \
		research/?* | api/?* | schema/?* | content/?* | seo/?* | \
		config/?* | migrate/?* | qa/?* | uat/?* | aiops/?* | \
		automation/?* | telemetry/?* | epic/?*)
		;;
	*)
		fail "branch '$branch' needs a type prefix such as feat/, fix/, chore/, test/ or docs/."
		;;
esac
