/**
 * Lighthouse CI configuration.
 *
 * Runs against the wp-env site (`npm run env:start`), or WP_BASE_URL when
 * set, as the Playwright tests do. Query-string URLs work whatever the
 * permalink setting; there is no 404 URL, as Lighthouse will not audit a
 * page that answers 404. Accessibility and layout shift fail the run; the rest
 * only warn, so Lighthouse is not a compulsory gate.
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */
const baseUrl = ( process.env.WP_BASE_URL || 'http://localhost:8888' ).replace(
	/\/$/,
	''
);

module.exports = {
	ci: {
		collect: {
			url: [
				`${ baseUrl }/`,
				`${ baseUrl }/?p=1`,
				`${ baseUrl }/?cat=1`,
			],
			numberOfRuns: 3,
			settings: {
				// Lighthouse's default mobile emulation, without CPU or network
				// throttling: a local site has no real network to throttle.
				throttlingMethod: 'provided',
			},
		},
		assert: {
			assertions: {
				'categories:performance': [ 'warn', { minScore: 0.9 } ],
				'categories:accessibility': [ 'error', { minScore: 0.95 } ],
				'categories:best-practices': [ 'warn', { minScore: 0.9 } ],
				'categories:seo': [ 'warn', { minScore: 0.9 } ],
				'first-contentful-paint': [ 'warn', { maxNumericValue: 1800 } ],
				'largest-contentful-paint': [
					'warn',
					{ maxNumericValue: 2500 },
				],
				'cumulative-layout-shift': [
					'error',
					{ maxNumericValue: 0.1 },
				],
				'total-blocking-time': [ 'warn', { maxNumericValue: 200 } ],
				// Bytes over the wire, per page.
				'resource-summary:script:size': [
					'warn',
					{ maxNumericValue: 102400 },
				],
				'resource-summary:stylesheet:size': [
					'warn',
					{ maxNumericValue: 51200 },
				],
				'resource-summary:image:size': [
					'warn',
					{ maxNumericValue: 204800 },
				],
			},
		},
		upload: {
			target: 'filesystem',
			outputDir: './lighthouse-reports',
		},
	},
};
