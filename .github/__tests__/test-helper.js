/**
 * Shared test helpers for Jest and Playwright
 *
 * Use for common setup, teardown, and utility functions across JS and E2E tests.
 *
 * - Use TestLogger for consistent logging
 * - Use retryOperation for async retries
 * - Add Playwright helpers for block theme E2E
 */

const TestLogger = require('../.github/tests/test-logger');
const { retryOperation } = require('../scripts/utils/test-utils');

// Example: Playwright helper for theme activation
async function activateTheme(page, themeSlug) {
  await page.goto('/wp-admin/themes.php');
  await page.click(`button[aria-label="Activate ${themeSlug}"]`);
}

// Example: Playwright helper for block rendering
async function renderBlock(page, blockName) {
  await page.goto('/wp-admin/post-new.php');
  await page.click('button[aria-label="Add block"]');
  await page.type('input[placeholder="Search for a block"]', blockName);
  await page.click(`button[aria-label="${blockName}"]`);
}

module.exports = {
  TestLogger,
  retryOperation,
  activateTheme,
  renderBlock,
};
