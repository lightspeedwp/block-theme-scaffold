/**
 * Jest setup file for block theme scaffold.
 *
 * @package
 */

// Import testing utilities
import '@testing-library/jest-dom';

// Import test logger
const TestLogger = require('./test-logger');
const logger = new TestLogger('jest');

// Log test session start
logger.info('Jest test session started');

// Mock WordPress dependencies
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
	_x: jest.fn((text) => text),
	_n: jest.fn((single, plural, number) => (number === 1 ? single : plural)),
	sprintf: jest.fn((format, ...args) => {
		return format.replace(/%[sdifF%]/g, () => args.shift());
	}),
}));

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	warn: jest.fn(),
	error: jest.fn(),
	log: jest.fn(),
};

// Set up global test environment
global.wp = {
	i18n: {
		__: jest.fn((text) => text),
		_x: jest.fn((text) => text),
		_n: jest.fn((single, plural, number) =>
			number === 1 ? single : plural
		),
		sprintf: jest.fn(),
	},
};

// Mock fetch for API calls
global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({}),
	})
);

// Reset mocks after each test
afterEach(() => {
	jest.clearAllMocks();
});

// Log test completion
afterAll(() => {
	logger.info('Jest test session completed');
});

// Export logger for use in tests
global.testLogger = logger;
