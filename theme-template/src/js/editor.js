/**
 * Editor script for {{theme_name}}.
 *
 * WordPress packages are imported, not read from the `wp` global, so the
 * build lists them in build/js/editor.asset.php and WordPress loads them first.
 */
import domReady from '@wordpress/dom-ready';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import { createElement } from '@wordpress/element';

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
 * Register the editor sidebar.
 */
export function init() {
	registerPlugin( '{{theme_slug}}-sidebar', {
		icon: 'admin-appearance',
		render: ThemeSidebar,
	} );
}

domReady( init );
