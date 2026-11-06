/**
 * Colour ramps for the generated palette.
 *
 * A JavaScript port of the ramp builder in the lightspeedwp/.github skill
 * site-to-design-tokens (scripts/lib/color.ts), so a generated theme gets the
 * same 100-900 ramps as the Figma variables those skills create. Keep the two
 * in step: same target lightness per step, same chroma taper, same gamut fit.
 *
 * Ramps are built in OKLCH so lightness steps look even. The configured
 * colour keeps its exact value at the step whose target lightness it is
 * closest to; that is not always 500.
 */

const RAMP_STEPS = [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ];

/** Target OKLCH lightness per step, 100 lightest. */
const STEP_LIGHTNESS = {
	100: 0.97,
	200: 0.91,
	300: 0.83,
	400: 0.74,
	500: 0.64,
	600: 0.52,
	700: 0.42,
	800: 0.31,
	900: 0.2,
};

/** Maximum chroma for the neutral ramp, as in site-to-design-tokens. */
const NEUTRAL_MAX_CHROMA = 0.02;

/**
 * An sRGB colour with OKLCH conversion.
 */
class Color {
	/**
	 * @param {{r: number, g: number, b: number, a: number}} rgb Channels from 0 to 1.
	 */
	constructor( rgb ) {
		this.rgb = rgb;
	}

	/**
	 * Parse a six- or eight-digit hex colour.
	 *
	 * @param {string} value Hex colour.
	 * @return {Color} The colour.
	 */
	static fromHex( value ) {
		if ( ! /^#[\da-f]{6}(?:[\da-f]{2})?$/i.test( value ) ) {
			throw new Error( `Invalid ramp colour: ${ value }` );
		}
		const channel = ( i ) => parseInt( value.slice( i, i + 2 ), 16 ) / 255;
		return new Color( {
			r: channel( 1 ),
			g: channel( 3 ),
			b: channel( 5 ),
			a: value.length === 9 ? channel( 7 ) : 1,
		} );
	}

	/**
	 * @param {{l: number, c: number, h: number}} oklch OKLCH values.
	 * @return {Color} The opaque colour, possibly outside sRGB.
	 */
	static fromOklch( { l, c, h } ) {
		const rad = ( h * Math.PI ) / 180;
		const a = c * Math.cos( rad );
		const b = c * Math.sin( rad );
		const l1 = ( l + 0.3963377774 * a + 0.2158037573 * b ) ** 3;
		const m1 = ( l - 0.1055613458 * a - 0.0638541728 * b ) ** 3;
		const s1 = ( l - 0.0894841775 * a - 1.291485548 * b ) ** 3;
		return new Color( {
			r: Color.gammaEncode(
				4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1
			),
			g: Color.gammaEncode(
				-1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1
			),
			b: Color.gammaEncode(
				-0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1
			),
			a: 1,
		} );
	}

	/** @return {boolean} True when every channel is inside sRGB. */
	get inGamut() {
		return [ this.rgb.r, this.rgb.g, this.rgb.b ].every(
			( v ) => v >= -0.0005 && v <= 1.0005
		);
	}

	/** @return {string} Lower-case hex, with alpha only when not opaque. */
	toHex() {
		const channel = ( v ) =>
			Math.round( Math.min( Math.max( v, 0 ), 1 ) * 255 )
				.toString( 16 )
				.padStart( 2, '0' );
		const hex = `#${ channel( this.rgb.r ) }${ channel(
			this.rgb.g
		) }${ channel( this.rgb.b ) }`;
		return this.rgb.a >= 0.999 ? hex : `${ hex }${ channel( this.rgb.a ) }`;
	}

	/** @return {{l: number, c: number, h: number}} OKLCH values. */
	toOklch() {
		const lr = Color.gammaDecode( this.rgb.r );
		const lg = Color.gammaDecode( this.rgb.g );
		const lb = Color.gammaDecode( this.rgb.b );
		const l1 = Math.cbrt(
			0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
		);
		const m1 = Math.cbrt(
			0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
		);
		const s1 = Math.cbrt(
			0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
		);
		const L = 0.2104542553 * l1 + 0.793617785 * m1 - 0.0040720468 * s1;
		const A = 1.9779984951 * l1 - 2.428592205 * m1 + 0.4505937099 * s1;
		const B = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.808675766 * s1;
		const c = Math.sqrt( A * A + B * B );
		const h =
			c < 1e-6
				? 0
				: ( ( Math.atan2( B, A ) * 180 ) / Math.PI + 360 ) % 360;
		return { l: L, c, h };
	}

	static gammaDecode( v ) {
		return v <= 0.04045 ? v / 12.92 : ( ( v + 0.055 ) / 1.055 ) ** 2.4;
	}

	static gammaEncode( v ) {
		return v <= 0.0031308
			? 12.92 * v
			: 1.055 * Math.sign( v ) * Math.abs( v ) ** ( 1 / 2.4 ) - 0.055;
	}
}

/**
 * Builds a 100-900 ramp around an anchor colour.
 */
class RampBuilder {
	/**
	 * The anchor keeps its exact value at the step nearest its lightness.
	 * Other steps use the target lightness, the anchor's hue, and a chroma
	 * that tapers towards the light and dark ends, reduced further until it
	 * fits in sRGB.
	 *
	 * @param {string}               anchorHex Six- or eight-digit hex.
	 * @param {{maxChroma?: number}} options   Chroma cap (neutral ramps).
	 * @return {{anchorStep: number, steps: Object<number, string>}} The ramp.
	 */
	build( anchorHex, options = {} ) {
		const anchor = Color.fromHex( anchorHex );
		const base = anchor.toOklch();
		const anchorStep = this.nearestStep( base.l );
		const chroma = Math.min( base.c, options.maxChroma ?? Infinity );
		const steps = {};

		for ( const step of RAMP_STEPS ) {
			if ( step === anchorStep ) {
				steps[ step ] = anchor.toHex();
				continue;
			}
			const l = STEP_LIGHTNESS[ step ];
			// Chroma peaks near the anchor and tapers to 25% at the ends.
			const spread = Math.abs( l - base.l ) / 0.8;
			let c = chroma * Math.max( 0.25, 1 - spread );
			let color = Color.fromOklch( { l, c, h: base.h } );
			while ( ! color.inGamut && c > 0.0005 ) {
				c *= 0.92;
				color = Color.fromOklch( { l, c, h: base.h } );
			}
			steps[ step ] = color.toHex();
		}

		return { anchorStep, steps };
	}

	/**
	 * @param {number} lightness OKLCH lightness.
	 * @return {number} The step whose target lightness is closest.
	 */
	nearestStep( lightness ) {
		return RAMP_STEPS.reduce( ( best, step ) =>
			Math.abs( STEP_LIGHTNESS[ step ] - lightness ) <
			Math.abs( STEP_LIGHTNESS[ best ] - lightness )
				? step
				: best
		);
	}
}

const builder = new RampBuilder();

/**
 * All nine steps of a palette ramp, keyed 100 to 900.
 *
 * @param {string}  color   Configured colour (six- or eight-digit hex).
 * @param {boolean} neutral Cap the chroma, as for the neutral ramp.
 * @return {Object<number, string>} Hex colour per step.
 */
function colorRamp( color, neutral = false ) {
	return builder.build(
		color,
		neutral ? { maxChroma: NEUTRAL_MAX_CHROMA } : {}
	).steps;
}

module.exports = colorRamp;
module.exports.Color = Color;
module.exports.RampBuilder = RampBuilder;
module.exports.RAMP_STEPS = RAMP_STEPS;
module.exports.STEP_LIGHTNESS = STEP_LIGHTNESS;
