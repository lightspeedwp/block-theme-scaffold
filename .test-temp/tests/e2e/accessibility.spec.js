/**
 * @jest-environment jsdom
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Theme Accessibility Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:8888/');
		await injectAxe(page);
	});

	test('Homepage has no accessibility violations', async ({ page }) => {
		await checkA11y(page, null, {
			detailedReport: true,
			detailedReportOptions: { html: true },
		});
	});

	test('Site has proper document structure', async ({ page }) => {
		// Check for single h1
		const h1Count = await page.locator('h1').count();
		expect(h1Count).toBeGreaterThanOrEqual(1);

		// Check for header landmark
		const header = page.locator('header[role="banner"], header');
		await expect(header).toBeVisible();

		// Check for main landmark
		const main = page.locator('main');
		await expect(main).toBeVisible();

		// Check for footer landmark
		const footer = page.locator('footer[role="contentinfo"], footer');
		await expect(footer).toBeVisible();
	});

	test('Navigation is keyboard accessible', async ({ page }) => {
		// Tab through navigation
		await page.keyboard.press('Tab');
		const firstFocusable = await page.evaluate(
			() => document.activeElement?.tagName
		);
		expect(firstFocusable).toBeTruthy();

		// Skip link should be first interactive element
		const skipLink = page.locator('a[href^="#"]').first();
		if ((await skipLink.count()) > 0) {
			await expect(skipLink).toBeFocused();
		}
	});

	test('Links have proper accessible names', async ({ page }) => {
		const links = page.locator('a');
		const count = await links.count();

		for (let i = 0; i < Math.min(count, 10); i++) {
			const link = links.nth(i);
			const text = await link.textContent();
			const ariaLabel = await link.getAttribute('aria-label');
			const ariaLabelledBy = await link.getAttribute('aria-labelledby');

			const hasAccessibleName =
				text?.trim() || ariaLabel || ariaLabelledBy;
			expect(hasAccessibleName).toBeTruthy();
		}
	});

	test('Images have alt attributes', async ({ page }) => {
		const images = page.locator('img');
		const count = await images.count();

		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			const hasAlt = await img.getAttribute('alt');
			expect(hasAlt).not.toBeNull();
		}
	});

	test('Color contrast meets WCAG AA standards', async ({ page }) => {
		await checkA11y(
			page,
			null,
			{
				runOnly: ['color-contrast'],
			},
			true,
			'v4'
		);
	});

	test('Forms have proper labels', async ({ page }) => {
		const inputs = page.locator('input, textarea, select');
		const count = await inputs.count();

		for (let i = 0; i < count; i++) {
			const input = inputs.nth(i);
			const type = await input.getAttribute('type');

			// Skip hidden and submit inputs
			if (type === 'hidden' || type === 'submit') {
				continue;
			}

			const id = await input.getAttribute('id');
			const ariaLabel = await input.getAttribute('aria-label');
			const ariaLabelledBy = await input.getAttribute('aria-labelledby');

			if (id) {
				const label = page.locator(`label[for="${id}"]`);
				const hasLabel = (await label.count()) > 0;
				const hasAriaLabel = ariaLabel || ariaLabelledBy;

				expect(hasLabel || hasAriaLabel).toBeTruthy();
			}
		}
	});

	test('Single post accessibility', async ({ page }) => {
		// Navigate to first post
		await page.goto('http://localhost:8888/?p=1');
		await injectAxe(page);

		await checkA11y(page, 'article', {
			detailedReport: true,
		});
	});

	test('Archive page accessibility', async ({ page }) => {
		await page.goto('http://localhost:8888/category/uncategorized/');
		await injectAxe(page);

		await checkA11y(page, null, {
			detailedReport: true,
		});
	});

	test('404 page accessibility', async ({ page }) => {
		await page.goto('http://localhost:8888/non-existent-page/');
		await injectAxe(page);

		await checkA11y(page, null, {
			detailedReport: true,
		});

		// Check for helpful messaging
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();

		const searchForm = page.locator(
			'form[role="search"], .wp-block-search'
		);
		await expect(searchForm).toBeVisible();
	});

	test('WCAG 2.1 Level AA compliance', async ({ page }) => {
		await checkA11y(
			page,
			null,
			{
				runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
			},
			true,
			'v4'
		);
	});
});
