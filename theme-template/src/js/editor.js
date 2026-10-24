/**
 * Editor script for {{theme_name}}.
 *
 * WordPress packages are imported, not read from the `wp` global, so the
 * build lists them in build/js/editor.asset.php and WordPress loads them first.
 */
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import { createElement } from '@wordpress/element';

/**
 * Keep a Group block's custom class name on save.
 *
 * @param {Object} props      Props applied to the block's saved element.
 * @param {Object} blockType  Block type definition.
 * @param {Object} attributes Block attributes.
 * @return {Object} The props.
 */
export function addBlockClasses( props, blockType, attributes ) {
	if ( blockType.name === 'core/group' && attributes.className ) {
		return { ...props, className: attributes.className };
	}
	return props;
}

/**
 * The theme's editor sidebar.
 *
 * @return {Element} The sidebar.
 */
export function ThemeSidebar() {
	return createElement(
		PluginSidebar,
		{
			name: '{{theme_slug}}-sidebar',
			title: __( '{{theme_name}} Settings', '{{theme_slug}}' ),
			icon: 'admin-appearance',
		},
		createElement(
			PanelBody,
			{ title: __( 'Theme Options', '{{theme_slug}}' ) },
			createElement(
				'p',
				null,
				__( 'Custom theme options go here.', '{{theme_slug}}' )
			)
		)
	);
}

/**
 * Register the editor filter and sidebar.
 */
export function init() {
	addFilter(
		'blocks.getSaveContent.extraProps',
		'{{theme_slug}}/add-block-classes',
		addBlockClasses
	);
	registerPlugin( '{{theme_slug}}-sidebar', {
		icon: 'admin-appearance',
		render: ThemeSidebar,
	} );
}

domReady( init );
