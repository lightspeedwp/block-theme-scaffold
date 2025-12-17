/**
 * Release Scaffold Agent Test Suite
 *
 * Tests for the scaffold release validation agent
 *
 * @jest-environment jsdom
 */

const fs = require( 'fs' );

// Mock filesystem and child_process before requiring the agent
jest.mock( 'fs' );
jest.mock( 'child_process' );

const { execSync } = require( 'child_process' );
const agent = require( '../release-scaffold.agent.js' );

describe( 'Release Scaffold Agent Tests', () => {
	// ========================================================================
	// SETUP & TEARDOWN
	// ========================================================================

	beforeEach( () => {
		// Reset mocks before each test
		jest.clearAllMocks();
		agent.resetResults();

		// Mock console methods to reduce test output noise
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		jest.spyOn( console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		// Restore console methods
		console.log.mockRestore();
		console.error.mockRestore();
	} );

	// ========================================================================
	// MODULE STRUCTURE TESTS
	// ========================================================================

	describe( 'Module Structure', () => {
		test( 'should export all required functions', () => {
			expect( agent ).toHaveProperty( 'checkVersionConsistency' );
			expect( agent ).toHaveProperty( 'checkPlaceholders' );
			expect( agent ).toHaveProperty( 'checkSchema' );
			expect( agent ).toHaveProperty( 'checkQuality' );
			expect( agent ).toHaveProperty( 'checkDocumentation' );
			expect( agent ).toHaveProperty( 'checkGeneration' );
			expect( agent ).toHaveProperty( 'checkSecurity' );
			expect( agent ).toHaveProperty( 'generateReport' );
			expect( agent ).toHaveProperty( 'runCommand' );
			expect( agent ).toHaveProperty( 'fileExists' );
			expect( agent ).toHaveProperty( 'readFile' );
			expect( agent ).toHaveProperty( 'addResult' );
			expect( agent ).toHaveProperty( 'resetResults' );
			expect( agent ).toHaveProperty( 'getResults' );
		} );

		test( 'should have executable functions', () => {
			expect( typeof agent.checkVersionConsistency ).toBe( 'function' );
			expect( typeof agent.checkPlaceholders ).toBe( 'function' );
			expect( typeof agent.checkSchema ).toBe( 'function' );
			expect( typeof agent.generateReport ).toBe( 'function' );
		} );
	} );

	// ========================================================================
	// HELPER FUNCTIONS TESTS
	// ========================================================================

	describe( 'Helper Functions', () => {
		describe( 'runCommand', () => {
			test( 'should execute command successfully', () => {
				execSync.mockReturnValue( 'command output' );

				const result = agent.runCommand( 'echo test', {
					silent: true,
				} );

				expect( result.success ).toBe( true );
				expect( result.output ).toBe( 'command output' );
				expect( execSync ).toHaveBeenCalledWith(
					'echo test',
					expect.objectContaining( {
						encoding: 'utf8',
						stdio: 'pipe',
					} )
				);
			} );

			test( 'should handle command failures', () => {
				const error = new Error( 'Command failed' );
				error.stdout = 'error output';
				execSync.mockImplementation( () => {
					throw error;
				} );

				const result = agent.runCommand( 'failing-command', {
					silent: true,
				} );

				expect( result.success ).toBe( false );
				expect( result.error ).toContain( 'Command failed' );
			} );
		} );

		describe( 'fileExists', () => {
			test( 'should return true when file exists', () => {
				fs.existsSync.mockReturnValue( true );

				const result = agent.fileExists( '/path/to/file.txt' );

				expect( result ).toBe( true );
				expect( fs.existsSync ).toHaveBeenCalledWith(
					'/path/to/file.txt'
				);
			} );

			test( 'should return false when file does not exist', () => {
				fs.existsSync.mockReturnValue( false );

				const result = agent.fileExists( '/path/to/missing.txt' );

				expect( result ).toBe( false );
			} );
		} );

		describe( 'readFile', () => {
			test( 'should read file successfully', () => {
				fs.readFileSync.mockReturnValue( 'file content' );

				const result = agent.readFile( '/path/to/file.txt' );

				expect( result.success ).toBe( true );
				expect( result.content ).toBe( 'file content' );
			} );

			test( 'should handle read errors', () => {
				fs.readFileSync.mockImplementation( () => {
					throw new Error( 'Read failed' );
				} );

				const result = agent.readFile( '/path/to/file.txt' );

				expect( result.success ).toBe( false );
				expect( result.error ).toContain( 'Read failed' );
			} );
		} );

		describe( 'addResult and resetResults', () => {
			test( 'should add passed result', () => {
				agent.addResult( 'critical', 'test', 'Test passed', 'pass' );

				const results = agent.getResults();
				expect( results.passed ).toHaveLength( 1 );
				expect( results.passed[ 0 ] ).toMatchObject( {
					category: 'test',
					message: 'Test passed',
					status: 'pass',
				} );
			} );

			test( 'should add failed result to critical list', () => {
				agent.addResult( 'critical', 'test', 'Test failed', 'fail' );

				const results = agent.getResults();
				expect( results.failed ).toHaveLength( 1 );
				expect( results.critical ).toHaveLength( 1 );
			} );

			test( 'should add warning result', () => {
				agent.addResult( 'important', 'test', 'Test warning', 'warn' );

				const results = agent.getResults();
				expect( results.warnings ).toHaveLength( 1 );
			} );

			test( 'should reset all results', () => {
				agent.addResult( 'critical', 'test', 'Test 1', 'pass' );
				agent.addResult( 'critical', 'test', 'Test 2', 'fail' );
				agent.resetResults();

				const results = agent.getResults();
				expect( results.passed ).toHaveLength( 0 );
				expect( results.failed ).toHaveLength( 0 );
				expect( results.critical ).toHaveLength( 0 );
				expect( results.warnings ).toHaveLength( 0 );
			} );
		} );
	} );

	// ========================================================================
	// VALIDATION FUNCTIONS TESTS
	// ========================================================================

	describe( 'Version Consistency Check', () => {
		test( 'should pass when all versions match', () => {
			fs.readFileSync.mockImplementation( ( filePath ) => {
				if ( filePath.includes( 'VERSION' ) ) {
					return '1.0.0\n';
				}
				if ( filePath.includes( 'package.json' ) ) {
					return JSON.stringify( { version: '1.0.0' } );
				}
				if ( filePath.includes( 'composer.json' ) ) {
					return JSON.stringify( { version: '1.0.0' } );
				}
				return '';
			} );

			const result = agent.checkVersionConsistency();

			expect( result ).toBe( true );
			const results = agent.getResults();
			expect( results.passed.length ).toBeGreaterThan( 0 );
		} );

		test( 'should fail when versions do not match', () => {
			fs.readFileSync.mockImplementation( ( filePath ) => {
				if ( filePath.includes( 'VERSION' ) ) {
					return '1.0.0\n';
				}
				if ( filePath.includes( 'package.json' ) ) {
					return JSON.stringify( { version: '1.0.1' } );
				}
				if ( filePath.includes( 'composer.json' ) ) {
					return JSON.stringify( { version: '1.0.0' } );
				}
				return '';
			} );

			const result = agent.checkVersionConsistency();

			expect( result ).toBe( false );
			const results = agent.getResults();
			expect( results.critical.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'Placeholder Verification', () => {
		test( 'should pass when placeholders are preserved', () => {
			fs.lstatSync.mockReturnValue( {
				isDirectory: () => false,
				isFile: () => true,
			} );
			fs.readFileSync.mockReturnValue(
				'Content with {{theme_name}} and {{theme_slug}}'
			);
			fs.existsSync.mockReturnValue( true );

			const result = agent.checkPlaceholders();

			expect( result ).toBe( true );
			const results = agent.getResults();
			expect( results.passed.length ).toBeGreaterThan( 0 );
		} );

		test( 'should fail when no placeholders found', () => {
			fs.lstatSync.mockReturnValue( {
				isDirectory: () => false,
				isFile: () => true,
			} );
			fs.readFileSync.mockReturnValue( 'Content without placeholders' );
			fs.existsSync.mockReturnValue( true );

			const result = agent.checkPlaceholders();

			expect( result ).toBe( false );
			const results = agent.getResults();
			expect( results.critical.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'Schema Validation', () => {
		test( 'should pass when schema validation succeeds', () => {
			execSync.mockReturnValue( 'Schema validation passed' );

			const result = agent.checkSchema();

			expect( result ).toBe( true );
			const results = agent.getResults();
			expect( results.passed.length ).toBeGreaterThan( 0 );
		} );

		test( 'should fail when schema validation fails', () => {
			execSync.mockImplementation( () => {
				throw new Error( 'Schema validation failed' );
			} );

			const result = agent.checkSchema();

			expect( result ).toBe( false );
			const results = agent.getResults();
			expect( results.critical.length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( 'Quality Gates', () => {
		test( 'should pass when all quality checks pass', () => {
			execSync.mockReturnValue( 'All checks passed' );

			const result = agent.checkQuality();

			expect( result ).toBe( true );
			const results = agent.getResults();
			expect( results.passed.length ).toBeGreaterThan( 0 );
		} );

		test( 'should fail when quality checks fail', () => {
			let callCount = 0;
			execSync.mockImplementation( () => {
				callCount++;
				if ( callCount === 1 ) {
					// First call (lint) fails
					throw new Error( 'Lint failed' );
				}
				return 'Success';
			} );

			const result = agent.checkQuality();

			expect( result ).toBe( false );
			const results = agent.getResults();
			expect( results.critical.length ).toBeGreaterThan( 0 );
		} );
	} );

	// ========================================================================
	// REPORT GENERATION TESTS
	// ========================================================================

	describe( 'Report Generation', () => {
		test( 'should generate report with passed checks', () => {
			agent.addResult( 'critical', 'test', 'All checks passed', 'pass' );

			const isReady = agent.generateReport();

			expect( isReady ).toBe( true );
		} );

		test( 'should generate report with failures', () => {
			agent.addResult( 'critical', 'test', 'Check failed', 'fail' );

			const isReady = agent.generateReport();

			expect( isReady ).toBe( false );
		} );

		test( 'should handle warnings without blocking', () => {
			agent.addResult( 'important', 'test', 'Warning detected', 'warn' );

			const isReady = agent.generateReport();

			expect( isReady ).toBe( true ); // Warnings don't block
		} );

		test( 'should show critical blockers in report', () => {
			agent.addResult( 'critical', 'test', 'Critical failure', 'fail' );
			agent.addResult( 'important', 'test', 'Minor warning', 'warn' );

			const isReady = agent.generateReport();

			expect( isReady ).toBe( false );
			const results = agent.getResults();
			expect( results.critical ).toHaveLength( 1 );
			expect( results.warnings ).toHaveLength( 1 );
		} );
	} );

	// ========================================================================
	// INTEGRATION TESTS
	// ========================================================================

	describe( 'Integration Tests', () => {
		test( 'should run full validation suite successfully', () => {
			// Mock all checks to pass
			fs.existsSync.mockReturnValue( true );
			fs.readFileSync.mockImplementation( ( filePath ) => {
				if ( filePath.includes( 'VERSION' ) ) {
					return '1.0.0\n';
				}
				if ( filePath.includes( '.json' ) ) {
					return JSON.stringify( { version: '1.0.0' } );
				}
				return 'Content with {{theme_name}}';
			} );
			fs.lstatSync.mockReturnValue( {
				isDirectory: () => false,
				isFile: () => true,
			} );
			execSync.mockReturnValue( 'success' );

			// Run validation
			agent.resetResults();
			agent.checkVersionConsistency();
			agent.checkPlaceholders();
			agent.checkSchema();

			const isReady = agent.generateReport();

			expect( isReady ).toBe( true );
			const results = agent.getResults();
			expect( results.critical ).toHaveLength( 0 );
		} );

		test( 'should fail validation with missing requirements', () => {
			// Mock failures
			fs.existsSync.mockReturnValue( false );

			// Run validation
			agent.resetResults();
			agent.checkVersionConsistency();

			const isReady = agent.generateReport();

			expect( isReady ).toBe( false );
			const results = agent.getResults();
			expect( results.critical.length ).toBeGreaterThan( 0 );
		} );
	} );

	// ========================================================================
	// ERROR HANDLING TESTS
	// ========================================================================

	describe( 'Error Handling', () => {
		test( 'should handle filesystem errors gracefully', () => {
			fs.existsSync.mockImplementation( () => {
				throw new Error( 'Filesystem error' );
			} );

			// Should not throw - error should be caught
			expect( () => agent.fileExists( '/path' ) ).not.toThrow();
		} );

		test( 'should handle command execution errors', () => {
			execSync.mockImplementation( () => {
				throw new Error( 'Command error' );
			} );

			const result = agent.runCommand( 'failing-command', {
				silent: true,
			} );

			expect( result.success ).toBe( false );
			expect( result.error ).toBeDefined();
		} );
	} );

	// ========================================================================
	// EDGE CASES
	// ========================================================================

	describe( 'Edge Cases', () => {
		test( 'should handle empty results gracefully', () => {
			agent.resetResults();

			const isReady = agent.generateReport();

			// No failures = ready
			expect( isReady ).toBe( true );
		} );

		test( 'should handle mixed pass/warn/fail results', () => {
			agent.addResult( 'critical', 'test1', 'Passed', 'pass' );
			agent.addResult( 'important', 'test2', 'Warning', 'warn' );
			agent.addResult( 'critical', 'test3', 'Failed', 'fail' );

			const isReady = agent.generateReport();

			expect( isReady ).toBe( false ); // Critical failure blocks
			const results = agent.getResults();
			expect( results.passed ).toHaveLength( 1 );
			expect( results.warnings ).toHaveLength( 1 );
			expect( results.failed ).toHaveLength( 1 );
		} );
	} );
} );
