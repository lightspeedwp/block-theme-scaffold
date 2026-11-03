/**
 * Unit tests for src/js/editor.js.
 */
import { describe, expect, it, vi } from 'vitest';
import { registerPlugin } from '@wordpress/plugins';
import { init, ThemeSidebar } from '../../src/js/editor';

vi.mock( '@wordpress/dom-ready', () => ( { default: vi.fn() } ) );
vi.mock( '@wordpress/plugins', () => ( { registerPlugin: vi.fn() } ) );
vi.mock( '@wordpress/editor', () => ( { PluginSidebar: 'PluginSidebar' } ) );
vi.mock( '@wordpress/components', () => ( { PanelBody: 'PanelBody' } ) );
vi.mock( '@wordpress/element', () => ( {
	createElement: ( type, props, ...children ) => ( {
		type,
		props,
		children,
	} ),
} ) );
vi.mock( '@wordpress/i18n', () => ( { __: ( text ) => text } ) );

describe( 'init', () => {
	it( 'registers the sidebar', () => {
		init();
		// A variable keeps the call on one line whatever the slug.
		const sidebarName = '{{theme_slug}}-sidebar';
		expect( registerPlugin ).toHaveBeenCalledWith( sidebarName, {
			icon: 'admin-appearance',
			render: ThemeSidebar,
		} );
	} );
} );

describe( 'ThemeSidebar', () => {
	it( 'renders a translated PluginSidebar with a panel', () => {
		const sidebar = ThemeSidebar();
		expect( sidebar.type ).toBe( 'PluginSidebar' );
		expect( sidebar.props ).toEqual( {
			name: '{{theme_slug}}-sidebar',
			title: '{{theme_name}} Settings',
			icon: 'admin-appearance',
		} );
		expect( sidebar.children[ 0 ].type ).toBe( 'PanelBody' );
	} );
} );
