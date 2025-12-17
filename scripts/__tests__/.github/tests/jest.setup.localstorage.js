/**
 * Jest Setup for localStorage
 *
 * Initializes localStorage for tests that require it
 */

const path = require( 'path' );
const fs = require( 'fs' );

// Ensure localStorage directory and file exist
const repoRoot = path.resolve( __dirname, '..', '..' );
const localStorageDir = path.join( repoRoot, '.test-temp', 'localstorage' );
const localStorageFile = path.join( localStorageDir, 'localstorage.json' );

// Create directory if it doesn't exist
if ( ! fs.existsSync( localStorageDir ) ) {
	fs.mkdirSync( localStorageDir, { recursive: true } );
}

// Create file if it doesn't exist
if ( ! fs.existsSync( localStorageFile ) ) {
	fs.writeFileSync( localStorageFile, '{}' );
}

// Set environment variables
process.env.LOCAL_STORAGE_DIRECTORY = localStorageDir;
process.env.LOCAL_STORAGE_FILE = localStorageFile;
