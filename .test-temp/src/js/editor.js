/**
 * Editor JavaScript enhancements
 *
 * Imports WordPress packages for:
 * - @wordpress/i18n: Internationalization
 * - @wordpress/a11y: Accessibility announcements
 */

import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

// Register custom block styles in the editor
wp.domReady( function () {
	// Announce action to screen readers using @wordpress/a11y
	speak( __( 'Editor enhancements initializing', 'block-theme-scaffold' ) );

	// Unregister unwanted core block styles
	wp.blocks.unregisterBlockStyle( 'core/quote', 'large' );
	wp.blocks.unregisterBlockStyle( 'core/separator', 'wide' );
	wp.blocks.unregisterBlockStyle( 'core/separator', 'dots' );

	// Register custom block variations
	wp.blocks.registerBlockVariation( 'core/group', {
		name: 'block-theme-scaffold-card',
		title: __( 'Block Theme Scaffold Card', 'block-theme-scaffold' ),
		description: __( 'A styled card container', 'block-theme-scaffold' ),
		category: 'design',
		icon: 'admin-page',
		attributes: {
			className: 'is-style-shadow',
			style: {
				spacing: {
					padding: {
						top: 'var:preset|spacing|medium',
						right: 'var:preset|spacing|medium',
						bottom: 'var:preset|spacing|medium',
						left: 'var:preset|spacing|medium',
					},
				},
			},
		},
	} );

	// Add custom formatting options
	wp.richText.registerFormatType( 'block-theme-scaffold/highlight', {
		title: __( 'Highlight', 'block-theme-scaffold' ),
		tagName: 'mark',
		className: 'highlight',
		edit( { isActive, value, onChange } ) {
			return wp.element.createElement(
				wp.blockEditor.RichTextToolbarButton,
				{
					icon: 'admin-appearance',
					title: __( 'Highlight', 'block-theme-scaffold' ),
					onClick() {
						onChange(
							wp.richText.toggleFormat( value, {
								type: 'block-theme-scaffold/highlight',
							} )
						);
					},
					isActive,
				}
			);
		},
	} );
} );

// Editor theme utilities
const blockThemeScaffoldEditor = {
	/**
	 * Add custom classes to blocks based on attributes
	 */
	addBlockClasses() {
		const { addFilter } = wp.hooks;

		addFilter(
			'blocks.getSaveContent.extraProps',
			'block-theme-scaffold/add-block-classes',
			( props, blockType, attributes ) => {
				if ( blockType.name === 'core/group' && attributes.className ) {
					props.className = attributes.className;
				}
				return props;
			}
		);
	},

	/**
	 * Customize block editor sidebar
	 */
	customizeSidebar() {
		const { registerPlugin } = wp.plugins;
		const { PluginSidebar } = wp.editPost;
		const { PanelBody } = wp.components;

		const blockThemeScaffoldSidebar = () => {
			return wp.element.createElement(
				PluginSidebar,
				{
					name: 'block-theme-scaffold-sidebar',
					title: __(
						'Block Theme Scaffold Settings',
						'block-theme-scaffold'
					),
					icon: 'admin-appearance',
				},
				wp.element.createElement(
					PanelBody,
					{ title: __( 'Theme Options', 'block-theme-scaffold' ) },
					wp.element.createElement(
						'p',
						null,
						__(
							'Custom theme settings will appear here.',
							'block-theme-scaffold'
						)
					)
				)
			);
		};

		registerPlugin( 'block-theme-scaffold-sidebar', {
			render: blockThemeScaffoldSidebar,
		} );
	},
};

// Initialize editor enhancements
wp.domReady( function () {
	blockThemeScaffoldEditor.addBlockClasses();
	blockThemeScaffoldEditor.customizeSidebar();
} );
