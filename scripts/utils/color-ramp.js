/**
 * Derive lighter and darker shades from a configured six- or eight-digit hex color.
 * The alpha channel, when supplied, is kept for every shade.
 *
 * @param {string} color Hex color at step 500.
 * @return {Object} The surrounding shades indexed by step.
 */
function colorRamp( color ) {
	if ( ! /^#[\da-f]{6}(?:[\da-f]{2})?$/i.test( color ) ) {
		throw new Error( `Invalid ramp center color: ${ color }` );
	}

	const channels = [ 1, 3, 5 ].map( ( index ) =>
		parseInt( color.slice( index, index + 2 ), 16 )
	);
	const alpha = color.slice( 7 );
	const shades = {};
	for ( const step of [ 100, 200, 300, 400, 600, 700, 800, 900 ] ) {
		const amount = Math.abs( 500 - step ) / 500;
		const target = step < 500 ? 255 : 0;
		shades[ step ] = `#${ channels
			.map( ( channel ) =>
				Math.round( channel + ( target - channel ) * amount )
					.toString( 16 )
					.padStart( 2, '0' )
			)
			.join( '' ) }${ alpha }`;
	}
	return shades;
}

module.exports = colorRamp;
