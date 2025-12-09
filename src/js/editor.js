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
	speak( __( 'Editor enhancements initializing', '{{theme_slug}}' ) );

	// Unregister unwanted core block styles
	wp.blocks.unregisterBlockStyle( 'core/quote', 'large' );
	wp.blocks.unregisterBlockStyle( 'core/separator', 'wide' );
	wp.blocks.unregisterBlockStyle( 'core/separator', 'dots' );

	// Register custom block variations
	wp.blocks.registerBlockVariation( 'core/group', {
		name: '{{theme_slug}}-card',
		title: __( '{{theme_name}} Card', '{{theme_slug}}' ),
		description: __( 'A styled card container', '{{theme_slug}}' ),
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
	wp.richText.registerFormatType( '{{theme_slug}}/highlight', {
		title: __( 'Highlight', '{{theme_slug}}' ),
		tagName: 'mark',
		className: 'highlight',
		edit( { isActive, value, onChange } ) {
			return wp.element.createElement(
				wp.blockEditor.RichTextToolbarButton,
				{
					icon: 'admin-appearance',
					title: __( 'Highlight', '{{theme_slug}}' ),
					onClick() {
						onChange(
							wp.richText.toggleFormat( value, {
								type: '{{theme_slug}}/highlight',
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
const {{theme_slug|camelCase}}Editor = {
	/**
	 * Add custom classes to blocks based on attributes
	 */
	addBlockClasses() {
		const { addFilter } = wp.hooks;

		addFilter(
			'blocks.getSaveContent.extraProps',
			'{{theme_slug}}/add-block-classes',
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

		const {{theme_slug|camelCase}}Sidebar = () => {
			return wp.element.createElement(
				PluginSidebar,
				{
					name: '{{theme_slug}}-sidebar',
					title: __(
						'{{theme_name}} Settings',
						'{{theme_slug}}'
					),
					icon: 'admin-appearance',
				},
				wp.element.createElement(
					PanelBody,
					{ title: __( 'Theme Options', '{{theme_slug}}' ) },
					wp.element.createElement(
						'p',
						null,
						__(
							'Custom theme settings will appear here.',
							'{{theme_slug}}'
						)
					)
				)
			);
		};

		registerPlugin( '{{theme_slug}}-sidebar', {
			render: {{theme_slug|camelCase}}Sidebar,
		} );
	},
};

// Initialize editor enhancements
wp.domReady( function () {
	{{theme_slug|camelCase}}Editor.addBlockClasses();
	{{theme_slug|camelCase}}Editor.customizeSidebar();
} );
