/* global wp, __ */
// Editor theme utilities
const editorUtils = {
	/**
	 * Add custom classes to blocks based on attributes
	 */
	addBlockClasses: function () {
		const { addFilter } = wp.hooks;
		addFilter(
			'blocks.getSaveContent.extraProps',
			'{{theme_slug}}/add-block-classes',
			(props, blockType, attributes) => {
				if (blockType.name === 'core/group' && attributes.className) {
					props.className = attributes.className;
				}
				return props;
			}
		);
	},

	/**
	 * Customize block editor sidebar
	 */
	customizeSidebar: function () {
		const { registerPlugin } = wp.plugins;
		const { PluginSidebar } = wp.editPost;
		const { PanelBody } = wp.components;

		const Sidebar = () => {
			return wp.element.createElement(
				PluginSidebar,
				{
					name: '{{theme_slug}}-sidebar',
					title: __('{{theme_name}} Settings', '{{theme_slug}}'),
					icon: 'admin-appearance',
				},
				wp.element.createElement(
					PanelBody,
					{ title: __('Theme Options', '{{theme_slug}}') },
					wp.element.createElement(
						'p',
						null,
						'Custom theme options go here.'
					)
				)
			);
		};

		registerPlugin('{{theme_slug}}-sidebar', {
			icon: 'admin-appearance',
			render: Sidebar,
		});
	},
};

// Initialize editor enhancements
wp.domReady(function () {
	editorUtils.addBlockClasses();
	editorUtils.customizeSidebar();
});
