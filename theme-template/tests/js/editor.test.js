/**
 * Unit tests for src/js/editor.js.
 */
import { describe, expect, it, vi } from 'vitest';
import { addFilter } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';
import { addBlockClasses, init, ThemeSidebar } from '../../src/js/editor';

vi.mock( '@wordpress/dom-ready', () => ( { default: vi.fn() } ) );
vi.mock( '@wordpress/hooks', () => ( { addFilter: vi.fn() } ) );
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

describe( 'addBlockClasses', () => {
	it( "keeps a Group block's class name", () => {
		expect(
			addBlockClasses(
				{ className: 'wp-block-group' },
				{ name: 'core/group' },
				{ className: 'is-style-shadow' }
			)
		).toEqual( { className: 'is-style-shadow' } );
	} );

	it( 'leaves other blocks and Groups without a class name alone', () => {
		const props = { className: 'a' };
		expect( addBlockClasses( props, { name: 'core/paragraph' }, {} ) ).toBe(
			props
		);
		expect( addBlockClasses( props, { name: 'core/group' }, {} ) ).toBe(
			props
		);
	} );
} );

describe( 'init', () => {
	it( 'registers the save filter and the sidebar', () => {
		init();
		expect( addFilter ).toHaveBeenCalledWith(
			'blocks.getSaveContent.extraProps',
			'{{theme_slug}}/add-block-classes',
			addBlockClasses
		);
		expect( registerPlugin ).toHaveBeenCalledWith(
			'{{theme_slug}}-sidebar',
			{
				icon: 'admin-appearance',
				render: ThemeSidebar,
			}
		);
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
