#!/usr/bin/env node
/**
 * Wrapper for the dry-run test helper.
 *
 * This file exists to satisfy scripts that expect a root-level
 * `scripts/test-dry-run.js` entry point while delegating the actual
 * implementation to `scripts/dry-run/test-dry-run.js`.
 */

require('./dry-run/test-dry-run.js');
