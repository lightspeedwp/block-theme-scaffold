#!/bin/sh
# Pre-commit: a code change needs a new CHANGELOG.md entry under
# [Unreleased] (or a new version section, when a release moves the entries)
# in the same commit. Lefthook runs this only when code files are staged.

changelog_items() {
	awk '
		/^## \[/ { unreleased = /^## \[Unreleased\]/; if (!unreleased) print; next }
		unreleased && /^[[:space:]]*- [^[:space:]]/ { sub(/^[[:space:]]+/, ""); print }
	'
}

before=$(mktemp)
git show HEAD:CHANGELOG.md 2>/dev/null | changelog_items >"$before" || true
added=$(git show :CHANGELOG.md 2>/dev/null | changelog_items | grep -vxF -f "$before" || true)
rm -f "$before"

if [ -z "$added" ]; then
	echo "pre-commit: code changed without a new CHANGELOG.md entry. Add one under [Unreleased]." >&2
	exit 1
fi
