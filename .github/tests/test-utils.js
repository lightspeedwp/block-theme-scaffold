/**
 * Pruned test utilities for block theme scaffold
 * Only exports helpers relevant for block theme scaffold tests
 */

/**
 * Retry a test operation with exponential backoff
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
				logger.warn(
					`Attempt ${ attempt } failed: ${ error.message }`
				);
			}
			if ( attempt < maxRetries ) {
				if ( logger ) {
					logger.info( `Retrying in ${ delay }ms` );
				}
				await new Promise( ( resolve ) =>
					setTimeout( resolve, delay )
				);
				delay = Math.min( delay * backoffMultiplier, maxDelay );
			}
		}
	}
	throw new Error(
		`Operation failed after ${ maxRetries } attempts: ${ lastError.message }`
	);
}

/**
 * Assert with detailed error logging
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
 * Measure test execution time
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
 * Create a test context with cleanup
 */
function createTestContext( setup, cleanup, logger ) {
	const context = {
		cleanup: () => {
			try {
				if ( cleanup ) {
					cleanup();
					if ( logger ) {
						logger.info( 'Cleanup completed successfully' );
					}
				}
			} catch ( error ) {
				if ( logger ) {
					logger.error( 'Cleanup failed', error );
				}
				throw error;
			}
