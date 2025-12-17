/**
 * Main theme JavaScript
 *
 * Uses WordPress packages:
 * - @wordpress/escape-html: For safe HTML escaping
 * - @wordpress/a11y: For accessibility announcements
 */

const { escapeHTML } = require('@wordpress/escape-html');
const { announce } = require('@wordpress/a11y');

// Skip link functionality
document.addEventListener( 'DOMContentLoaded', function () {
	// Add skip link with escaped content
	const skipLink = document.createElement( 'a' );
	skipLink.href = '#main';
	skipLink.className = 'skip-link screen-reader-text';
	skipLink.textContent = escapeHTML( '{{skip_link_text}}' );
	document.body.insertBefore( skipLink, document.body.firstChild );

	// Announce skip link to screen readers
	announce( 'Skip link added' );

	// Smooth scroll for anchor links with accessibility announcement
	const anchorLinks = document.querySelectorAll( 'a[href^="#"]' );
	anchorLinks.forEach( ( link ) => {
		link.addEventListener( 'click', function ( e ) {
			const href = this.getAttribute( 'href' );
			const target = document.querySelector( href );

			if ( target ) {
				e.preventDefault();
				target.scrollIntoView( {
					behavior: 'smooth',
					block: 'start',
				} );
				// Announce to screen readers
				const targetText =
					target.textContent?.substring( 0, 50 ) || 'Section';
				announce( `Navigated to ${ escapeHTML( targetText ) }` );
			}
		} );
	} );

	// Mobile menu accessibility
	const navToggle = document.querySelector(
		'.wp-block-navigation__responsive-container-open'
	);
	if ( navToggle ) {
		navToggle.addEventListener( 'click', function () {
			const expanded = this.getAttribute( 'aria-expanded' ) === 'true';
			this.setAttribute( 'aria-expanded', ! expanded );
		} );
	}

	// Focus management for modal dialogs
	const modals = document.querySelectorAll( '[role="dialog"]' );
	modals.forEach( ( modal ) => {
		const focusableElements = modal.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		if ( focusableElements.length > 0 ) {
			focusableElements[ 0 ].focus();
		}
	} );
} );

// Theme utilities
const themeUtils = {
	/**
	 * Initialize theme features
	 */
	init() {
		this.setupAnimations();
		this.setupLazyLoading();
	},

	/**
	 * Setup scroll animations
	 */
	setupAnimations() {
		// eslint-disable-next-line no-undef
		if ( 'IntersectionObserver' in window ) {
			// eslint-disable-next-line no-undef
			const observer = new IntersectionObserver(
				( entries ) => {
					entries.forEach( ( entry ) => {
						if ( entry.isIntersecting ) {
							entry.target.classList.add( 'is-visible' );
						}
					} );
				},
				{
					threshold: 0.1,
				}
			);

			const animatedElements =
				document.querySelectorAll( '.animate-on-scroll' );
			animatedElements.forEach( ( el ) => observer.observe( el ) );
		}
	},

	/**
	 * Setup lazy loading for images
	 */
	setupLazyLoading() {
		// eslint-disable-next-line no-undef
		if ( 'loading' in HTMLImageElement.prototype ) {
			const images = document.querySelectorAll( 'img[data-src]' );
			images.forEach( ( img ) => {
				img.src = img.dataset.src;
				img.removeAttribute( 'data-src' );
			} );
		} else {
			// Fallback for browsers without native lazy loading
			const script = document.createElement( 'script' );
			script.src =
				'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.js';
			document.head.appendChild( script );
		}
	},
};

// Initialize theme
document.addEventListener( 'DOMContentLoaded', () => {
	themeUtils.init();
} );
