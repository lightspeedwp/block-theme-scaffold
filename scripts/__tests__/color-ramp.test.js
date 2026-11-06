/**
 * Tests for scripts/utils/color-ramp.js.
 *
 * The cases mirror the RampBuilder tests in the lightspeedwp/.github skill
 * site-to-design-tokens (scripts/__tests__/color.test.ts), so the scaffold
 * and the Figma variables build the same ramps.
 */
const colorRamp = require( '../utils/color-ramp' );

const { Color, RampBuilder, RAMP_STEPS } = colorRamp;

describe( 'Color', () => {
	it( 'round-trips through OKLCH', () => {
		for ( const hex of [
			'#8d621f',
			'#565b3d',
			'#a31700',
			'#262423',
			'#ffffff',
			'#000000',
		] ) {
			const color = Color.fromHex( hex );
			expect( Color.fromOklch( color.toOklch() ).toHex() ).toBe( hex );
		}
		expect( Color.fromHex( '#808080' ).toOklch().c ).toBeLessThan( 0.001 );
	} );

	it( 'keeps alpha and rejects values it cannot read', () => {
		expect( Color.fromHex( '#00000080' ).toHex() ).toBe( '#00000080' );
		expect( () => Color.fromHex( '#fff' ) ).toThrow(
			'Invalid ramp colour'
		);
		expect( () => Color.fromHex( 'red' ) ).toThrow( 'Invalid ramp colour' );
	} );
} );

describe( 'RampBuilder', () => {
	const builder = new RampBuilder();

	it( 'keeps the anchor exactly at its nearest step', () => {
		const ramp = builder.build( '#8d621f' );

		expect( ramp.steps[ ramp.anchorStep ] ).toBe( '#8d621f' );
		expect( ramp.anchorStep ).toBe( 600 );
	} );

	it( 'gets darker from 100 to 900 and stays in gamut', () => {
		for ( const anchor of [ '#565b3d', '#a31700', '#ce9e57', '#0047d0' ] ) {
			const ramp = builder.build( anchor );
			const lightness = RAMP_STEPS.map(
				( s ) => Color.fromHex( ramp.steps[ s ] ).toOklch().l
			);
			for ( let i = 1; i < lightness.length; i++ ) {
				expect( lightness[ i ] ).toBeLessThan( lightness[ i - 1 ] );
			}
			for ( const step of RAMP_STEPS ) {
				expect( ramp.steps[ step ] ).toMatch( /^#[0-9a-f]{6}$/ );
			}
		}
	} );

	it( 'caps chroma for neutral ramps', () => {
		const ramp = builder.build( '#8a8580', { maxChroma: 0.01 } );
		expect( Color.fromHex( ramp.steps[ 100 ] ).toOklch().c ).toBeLessThan(
			0.012
		);
	} );
} );

describe( 'colorRamp', () => {
	it( 'returns all nine steps and caps neutral chroma at 0.02', () => {
		const ramp = colorRamp( '#6b7280', true );
		expect( Object.keys( ramp ).map( Number ) ).toEqual( RAMP_STEPS );
		expect( Object.values( ramp ) ).toContain( '#6b7280' );
		expect( Color.fromHex( ramp[ 100 ] ).toOklch().c ).toBeLessThan(
			0.021
		);
	} );
} );
