/**
 * Lightweight test utilities for the block-theme scaffold.
 *
 * @module scripts/utils/test-utils
 */

/**
 * Retry an async operation with exponential backoff.
 *
 * @param {() => Promise<*>} operation
 * @param {object} [options]
 * @param {number} [options.maxRetries=3]
 * @param {number} [options.initialDelay=1000]
 * @param {number} [options.maxDelay=5000]
 * @param {number} [options.backoffMultiplier=2]
 * @param {object} [options.logger]
 */
async function retryOperation( operation, options = {} ) {
	const {
		maxRetries = 3,
		initialDelay = 1000,
		maxDelay = 5000,
		backoffMultiplier = 2,
		logger = null,
	} = options;

	let lastError;
	let delay = initialDelay;

	for ( let attempt = 1; attempt <= maxRetries; attempt++ ) {
		try {
			if ( logger ) {
				logger.info( `Attempt ${ attempt }/${ maxRetries }` );
			}
			return await operation();
		} catch ( error ) {
			lastError = error;
			if ( logger ) {
				logger.warn( `Attempt ${ attempt } failed: ${ error.message }` );
			}
			if ( attempt < maxRetries ) {
				if ( logger ) {
					logger.info( `Retrying in ${ delay }ms` );
				}
				await new Promise( ( resolve ) => setTimeout( resolve, delay ) );
				delay = Math.min( delay * backoffMultiplier, maxDelay );
			}
		}
	}

	throw new Error(
		`Operation failed after ${ maxRetries } attempts: ${ lastError?.message }`
	);
}

/**
 * Assertion helper that logs details when failures occur.
 *
 * @param {boolean} condition
 * @param {string} message
 * @param {object} logger
 * @param {*} [details]
 */
function assertWithLog( condition, message, logger, details ) {
	if ( ! condition ) {
		if ( logger ) {
			logger.error( message, details );
		}
		throw new Error( `Assertion failed: ${ message }` );
	}
	if ( logger ) {
		logger.info( `Assertion passed: ${ message }` );
	}
}

/**
 * Measure synchronous execution time.
 *
 * @param {() => *} fn
 * @param {object} logger
 * @returns {{result: *, duration: number}}
 */
function measureExecutionTime( fn, logger ) {
	const start = Date.now();
	try {
		const result = fn();
		const duration = Date.now() - start;
		if ( logger ) {
			logger.info( `Execution completed in ${ duration }ms` );
		}
		return { result, duration };
	} catch ( error ) {
		const duration = Date.now() - start;
		if ( logger ) {
			logger.error( `Execution failed after ${ duration }ms`, error );
		}
		throw error;
	}
}

/**
 * Create a cleanup-aware test context.
 *
 * @param {Function} setup
 * @param {Function} cleanup
 * @param {object} logger
 */
function createTestContext( setup, cleanup, logger ) {
	const context = {
		cleanup: () => {
			try {
				if ( cleanup ) {
					cleanup();
				}
				if ( logger ) {
					logger.info( 'Cleanup completed successfully' );
				}
			} catch ( error ) {
				if ( logger ) {
					logger.error( 'Cleanup failed', error );
				}
				throw error;
			}
		},
	};

	try {
		const setupResult = setup();
		if ( logger ) {
			logger.info( 'Setup completed successfully' );
		}
		return { ...context, ...setupResult };
	} catch ( error ) {
		if ( logger ) {
			logger.error( 'Setup failed', error );
		}
		context.cleanup();
		throw error;
	}
}

/**
 * Basic metrics collector for tests.
 */
class TestMetrics {
	constructor() {
		this.metrics = {
			totalTests: 0,
			passedTests: 0,
			failedTests: 0,
			skippedTests: 0,
			totalDuration: 0,
			errors: [],
			warnings: [],
		};
	}

	recordTest( name, status, duration, error = null ) {
		this.metrics.totalTests++;
		this.metrics.totalDuration += duration;
		switch ( status ) {
			case 'passed':
				this.metrics.passedTests++;
				break;
			case 'failed':
				this.metrics.failedTests++;
				if ( error ) {
					this.metrics.errors.push( {
						test: name,
						error: error.message,
					} );
				}
				break;
			case 'skipped':
				this.metrics.skippedTests++;
				break;
		}
	}

	recordWarning( test, warning ) {
		this.metrics.warnings.push( { test, warning } );
	}

	getSummary() {
		const successRate =
			this.metrics.totalTests > 0
				? (
						( this.metrics.passedTests /
							this.metrics.totalTests ) *
						100
				  ).toFixed( 2 )
				: '0.00';
		const averageDuration =
			this.metrics.totalTests > 0
				? (
						this.metrics.totalDuration /
						this.metrics.totalTests
				  ).toFixed( 2 )
				: '0.00';
		return {
			...this.metrics,
			successRate,
			averageDuration,
		};
	}
}

module.exports = {
	retryOperation,
	assertWithLog,
	measureExecutionTime,
	createTestContext,
	TestMetrics,
};
