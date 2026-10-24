module.exports = {
	extends: [ '@wordpress/stylelint-config/scss' ],
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'layer',
					'config',
					'variants',
					'responsive',
					'screen',
				],
			},
		],
		'declaration-property-unit-allowed-list': {
			'line-height': [ 'px', 'em', 'rem', '%', '' ],
		},
		'selector-class-pattern': null,
		'selector-id-pattern': null,
	},
};
