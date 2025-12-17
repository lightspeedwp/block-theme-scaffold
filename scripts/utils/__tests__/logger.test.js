describe('FileLogger', () => {

	let logger;
	const processName = 'test-process';
	const category = 'test-category';
	const mockDate = '2025-12-07T10:30:45.123Z';
	const mockDateOnly = '2025-12-07';
	let logDir;
	let logFile;

	beforeAll(() => {
		jest.useFakeTimers().setSystemTime(new Date(mockDate));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		fs.mkdir.mockClear();
		fs.writeFile.mockClear();
		fs.readdir.mockClear();
		fs.unlink.mockClear();
		logger = new FileLogger(processName, category);
		logDir = path.resolve(process.cwd(), 'logs', category);
		logFile = path.resolve(logDir, `${mockDateOnly}-${processName}.log`);
	});

	test('logs info, debug, warn, error at correct levels', () => {
		logger.info('info message');
		logger.debug('debug message');
		logger.warn('warn message');
		logger.error('error message');
		// By default, LOG_LEVEL=info, so debug is not logged
		expect(logger._logBuffer.length).toBe(3);
		// Should format messages with timestamp and level
		logger._logBuffer.forEach((msg) => {
			expect(msg).toMatch(/^\[2025-12-07T10:30:45.123Z\] \[(INFO|WARN|ERROR)\] .+/);
		});
		// Should not contain debug message
		expect(logger._logBuffer.some((msg) => msg.includes('debug message'))).toBe(false);
	});

	test('respects LOG_LEVEL env', () => {
		process.env.LOG_LEVEL = 'warn';
		logger = new FileLogger(processName, category);
		logger.info('info message');
		logger.debug('debug message');
		logger.warn('warn message');
		logger.error('error message');
		// Only warn and error should be buffered
		expect(logger._logBuffer.length).toBe(2);
		logger._logBuffer.forEach((msg) => {
			expect(msg).toMatch(/\[(WARN|ERROR)\]/);
		});
		delete process.env.LOG_LEVEL;
	});

	test('save() writes log file and clears buffer', async () => {
		logger.info('info message');
		logger.warn('warn message');
		fs.mkdir.mockResolvedValue();
		fs.writeFile.mockResolvedValue();
		fs.readdir.mockResolvedValue([]);
		await logger.save();
		expect(fs.mkdir).toHaveBeenCalledWith(logDir, { recursive: true });
		expect(fs.writeFile).toHaveBeenCalledWith(logFile, expect.stringContaining('info message'), { flag: 'a' });
		expect(logger._logBuffer.length).toBe(0);
	});

	test('log rotation deletes old logs', async () => {
		fs.mkdir.mockResolvedValue();
		fs.writeFile.mockResolvedValue();
		// Simulate old and new log files
		fs.readdir.mockResolvedValue([
			'2025-11-01-test-process.log', // old
			'2025-12-07-test-process.log', // new
			'not-a-log.txt',
		]);
		fs.unlink.mockResolvedValue();
		logger.info('info message');
		await logger.save();
		// Should attempt to delete the old log
		expect(fs.unlink).toHaveBeenCalledWith(path.join(logDir, '2025-11-01-test-process.log'));
	});
});



const fs = require('fs/promises');
const path = require('path');
const FileLogger = require('../logger');

jest.mock('fs/promises');


