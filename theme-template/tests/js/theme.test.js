/**
 * Unit tests for src/js/theme.js.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announce } from '@wordpress/a11y';
import {
	init,
	setupAnchorLinks,
	setupAnimations,
	setupLazyLoading,
	setupNavigationToggle,
} from '../../src/js/theme';

vi.mock( '@wordpress/a11y', () => ( { announce: vi.fn() } ) );

beforeEach( () => {
	document.body.innerHTML = '';
	// jsdom does not implement scrolling.
	window.Element.prototype.scrollIntoView = vi.fn();
} );

afterEach( () => {
	vi.unstubAllGlobals();
} );

describe( 'setupAnchorLinks', () => {
	it( 'scrolls to, focuses and announces the target', () => {
		document.body.innerHTML =
			'<a href="#features">Go</a><section id="features"> Features <b>&</b> more </section>';
		setupAnchorLinks();

		const link = document.querySelector( 'a' );
		const target = document.getElementById( 'features' );
		const event = new window.MouseEvent( 'click', { cancelable: true } );
		link.dispatchEvent( event );

		expect( event.defaultPrevented ).toBe( true );
		expect( target.scrollIntoView ).toHaveBeenCalledWith( {
			behavior: 'smooth',
			block: 'start',
		} );
		expect( target.getAttribute( 'tabindex' ) ).toBe( '-1' );
		expect( document.activeElement ).toBe( target );
		expect( announce ).toHaveBeenCalledWith(
			'Navigated to Features &amp; more'
		);
	} );

	it( 'keeps an existing tabindex', () => {
		document.body.innerHTML =
			'<a href="#main">Go</a><main id="main" tabindex="0"></main>';
		setupAnchorLinks();
		document.querySelector( 'a' ).click();

		expect(
			document.getElementById( 'main' ).getAttribute( 'tabindex' )
		).toBe( '0' );
		expect( announce ).toHaveBeenCalledWith( 'Navigated to Section' );
	} );

	it( 'leaves "#" and links to missing targets alone', () => {
		document.body.innerHTML =
			'<a href="#">Top</a><a href="#nowhere">Nowhere</a>';
		setupAnchorLinks();

		for ( const link of document.querySelectorAll( 'a' ) ) {
			const event = new window.MouseEvent( 'click', {
				cancelable: true,
			} );
			expect( () => link.dispatchEvent( event ) ).not.toThrow();
			expect( event.defaultPrevented ).toBe( false );
		}
		expect( announce ).not.toHaveBeenCalled();
	} );
} );

describe( 'setupNavigationToggle', () => {
	it( 'flips aria-expanded on each click', () => {
		document.body.innerHTML =
			'<button class="wp-block-navigation__responsive-container-open" aria-expanded="false"></button>';
		setupNavigationToggle();
		const toggle = document.querySelector( 'button' );

		toggle.click();
		expect( toggle.getAttribute( 'aria-expanded' ) ).toBe( 'true' );
		toggle.click();
		expect( toggle.getAttribute( 'aria-expanded' ) ).toBe( 'false' );
	} );

	it( 'does nothing without a navigation', () => {
		expect( () => setupNavigationToggle() ).not.toThrow();
	} );
} );

describe( 'setupAnimations', () => {
	it( 'marks elements visible once they intersect', () => {
		document.body.innerHTML =
			'<div class="animate-on-scroll"></div><div class="animate-on-scroll"></div>';
		const observe = vi.fn();
		let callback;
		const win = {
			IntersectionObserver: vi.fn( function ( cb, options ) {
				callback = cb;
				this.options = options;
				this.observe = observe;
			} ),
		};
		setupAnimations( document, win );

		const [ first, second ] =
			document.querySelectorAll( '.animate-on-scroll' );
		expect( observe ).toHaveBeenCalledTimes( 2 );
		callback( [
			{ isIntersecting: true, target: first },
			{ isIntersecting: false, target: second },
		] );
		expect( first.classList.contains( 'is-visible' ) ).toBe( true );
		expect( second.classList.contains( 'is-visible' ) ).toBe( false );
	} );

	it( 'does nothing without IntersectionObserver', () => {
		document.body.innerHTML = '<div class="animate-on-scroll"></div>';
		expect( () => setupAnimations( document, {} ) ).not.toThrow();
	} );
} );

describe( 'setupLazyLoading', () => {
	it( 'moves data-src into src and sets loading="lazy"', () => {
		document.body.innerHTML = '<img data-src="https://example.test/a.jpg">';
		setupLazyLoading();
		const image = document.querySelector( 'img' );

		expect( image.getAttribute( 'src' ) ).toBe(
			'https://example.test/a.jpg'
		);
		expect( image.hasAttribute( 'data-src' ) ).toBe( false );
		expect( image.getAttribute( 'loading' ) ).toBe( 'lazy' );
	} );
} );

describe( 'init', () => {
	it( 'runs on DOMContentLoaded without errors', () => {
		vi.stubGlobal( 'IntersectionObserver', undefined );
		document.body.innerHTML = '<a href="#">Top</a>';
		expect( () =>
			document.dispatchEvent( new window.Event( 'DOMContentLoaded' ) )
		).not.toThrow();
		expect( () => init() ).not.toThrow();
	} );
} );
