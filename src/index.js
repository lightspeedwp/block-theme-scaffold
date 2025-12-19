/**
 * Entry point for the scaffolded theme.
 *
 * Registers a handful of placeholder block definitions so the test suite can
 * verify that block registration happens during the build.
 *
 * @package Block Theme Scaffold
 */

const blockDefinitions = [
	{
		name: 'block-theme-scaffold/hero',
		title: 'Hero Section',
		category: 'layout',
	},
	{
		name: 'block-theme-scaffold/feature-list',
		title: 'Feature List',
		category: 'widgets',
	},
	{
		name: 'block-theme-scaffold/call-to-action',
		title: 'Call To Action',
		category: 'widgets',
	},
	{
		name: 'block-theme-scaffold/testimonial',
		title: 'Testimonial',
		category: 'widgets',
	},
];

const noopComponent = () => null;

const getWpBlocks = () => {
	const fallbackWp =
		typeof global !== 'undefined' && global.wp ? global.wp : undefined;
	const wp = globalThis.wp ?? fallbackWp ?? {};
	return wp.blocks ?? {};
};

function buildSettings(definition) {
	return {
		apiVersion: 2,
		title: definition.title,
		category: definition.category,
		edit: noopComponent,
		save: noopComponent,
	};
}

function registerThemeBlocks() {
	const blocks = getWpBlocks();
	const register = blocks.registerBlockType;
	if (typeof register !== 'function') {
		return [];
	}

	return blockDefinitions.map((config) => {
		register(config.name, buildSettings(config));
		return config.name;
	});
}

registerThemeBlocks();

module.exports = {
	blockDefinitions,
	registerThemeBlocks,
};
