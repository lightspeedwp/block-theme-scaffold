/**
 * Tests for validate-agent-frontmatter.js
 *
 * @jest-environment jsdom
 */

const { validateAgentFrontmatter } = require( '../../validation/validate-agent-frontmatter' );

const validAgentFile = `---
title: Test Agent
description: Test description
category: testing
type: agent
audience: developers
date: 2025-01-01
---

# Agent content`;

const agentWithPermissions = `---
title: Test Agent
description: Test description
category: testing
type: agent
audience: developers
date: 2025-01-01
permissions:
  - read
  - write
  - filesystem
---

# Agent content`;

const agentWithInvalidPermissions = `---
title: Test Agent
description: Test description
type: agent
audience: developers
date: 2025-01-01
permissions:
  - read
  - invalid_permission
---

# Agent content`;

const agentWithoutFrontmatter = `# Agent content without frontmatter`;

describe( 'validate-agent-frontmatter', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.spyOn( console, 'log' ).mockImplementation( () => {} );
		jest.spyOn( console, 'error' ).mockImplementation( () => {} );
	} );

	afterEach( () => {
		console.log.mockRestore();
		console.error.mockRestore();
	} );

	function withSpec( content ) {
		return () =>
			validateAgentFrontmatter( {
				'test.agent.md': content,
			} );
	}

	test( 'should validate agent frontmatter with required fields', () => {
		expect( withSpec( validAgentFile ) ).not.toThrow();
	} );

	test( 'should validate permissions array', () => {
		expect( withSpec( agentWithPermissions ) ).not.toThrow();
	} );

	test( 'should reject invalid permissions', () => {
		expect( withSpec( agentWithInvalidPermissions ) ).toThrow();
	} );

	test( 'should reject missing frontmatter', () => {
		expect( withSpec( agentWithoutFrontmatter ) ).toThrow();
	} );
} );
