import { defineConfig } from 'vitest/config';

export default defineConfig( {
	test: {
		environment: 'jsdom',
		globals: false,
		include: [ 'tests/js/**/*.test.js' ],
		restoreMocks: true,
		// Measures the files the tests load; fails the run below the thresholds.
		coverage: {
			enabled: true,
			provider: 'v8',
			include: [ 'src/**/*.js' ],
			reporter: [ 'text', 'lcovonly' ],
			thresholds: {
				branches: 70,
				statements: 80,
				functions: 80,
			},
		},
	},
} );
