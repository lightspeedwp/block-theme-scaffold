/**
 * Front-end script for {{theme_name}}.
 *
 * Uses `@wordpress/escape-html` for safe HTML escaping and `@wordpress/a11y`
 * for screen reader announcements. Block themes get their skip link from
 * WordPress core, so this script does not add one.
 */
import { escapeHTML } from '@wordpress/escape-html';
import { announce } from '@wordpress/a11y';

/**
 * Smooth-scroll in-page links to their target, move focus there and
 * announce it.
 *
 * @param {Document} doc The document.
 */
export function setupAnchorLinks( doc = document ) {
	doc.querySelectorAll( 'a[href^="#"]' ).forEach( ( link ) => {
		link.addEventListener( 'click', ( event ) => {
			// "#" alone is not a selector; such links are left alone.
			const id = decodeURIComponent(
				link.getAttribute( 'href' ).slice( 1 )
			);
			const target = id && doc.getElementById( id );
			if ( ! target ) {
				return;
			}

			event.preventDefault();
			target.scrollIntoView( { behavior: 'smooth', block: 'start' } );
			if ( ! target.hasAttribute( 'tabindex' ) ) {
				target.setAttribute( 'tabindex', '-1' );
			}
			target.focus( { preventScroll: true } );

			const targetText =
				target.textContent?.trim().substring( 0, 50 ) || 'Section';
			announce( `Navigated to ${ escapeHTML( targetText ) }` );
		} );
	} );
}

/**
 * Keep aria-expanded on the navigation's open button in step with clicks.
 *
 * @param {Document} doc The document.
 */
export function setupNavigationToggle( doc = document ) {
	const toggle = doc.querySelector(
		'.wp-block-navigation__responsive-container-open'
	);
	if ( ! toggle ) {
		return;
	}
	toggle.addEventListener( 'click', () => {
		const expanded = toggle.getAttribute( 'aria-expanded' ) === 'true';
		toggle.setAttribute( 'aria-expanded', String( ! expanded ) );
	} );
}

/**
 * Add "is-visible" to .animate-on-scroll elements as they enter the viewport.
 *
 * @param {Document} doc The document.
 * @param {Window}   win The window.
 */
export function setupAnimations( doc = document, win = window ) {
	if ( typeof win.IntersectionObserver !== 'function' ) {
		return;
	}
	const observer = new win.IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
				}
			} );
		},
		{ threshold: 0.1 }
	);
	doc.querySelectorAll( '.animate-on-scroll' ).forEach( ( element ) =>
		observer.observe( element )
	);
}

/**
 * Swap data-src into src, for images marked up for lazy loading.
 *
 * @param {Document} doc The document.
 */
export function setupLazyLoading( doc = document ) {
	doc.querySelectorAll( 'img[data-src]' ).forEach( ( image ) => {
		image.setAttribute( 'loading', 'lazy' );
		image.src = image.dataset.src;
		image.removeAttribute( 'data-src' );
	} );
}

/**
 * Run every front-end enhancement.
 */
export function init() {
	setupAnchorLinks();
	setupNavigationToggle();
	setupAnimations();
	setupLazyLoading();
}

document.addEventListener( 'DOMContentLoaded', init );
