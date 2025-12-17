const templateAgent = require( '../../scripts/agents/template.agent.js' );

describe( 'Template agent placeholder', () => {
	test( 'exports the expected helpers', () => {
		expect( templateAgent ).toHaveProperty( 'main' );
		expect( templateAgent ).toHaveProperty( 'getTemplateInfo' );
		expect( typeof templateAgent.getTemplateInfo ).toBe( 'function' );
	} );

	test( 'main throws when executed directly', () => {
		expect( () => templateAgent.main() ).toThrow(
			/placeholder/i
		);
	} );
} );
