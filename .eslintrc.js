module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		ecmaFeatures: {
			impliedStrict: true,
			experimentalObjectRestSpread: true
		},
		sourceType: 'module'
	},

	env: {
		browser: true,
		node: true,
		jest: true
	},

	extends: ['standard'],

	plugins: ['prettier'],

	rules: {
		indent: ['error', 'tab', { ignoredNodes: ['TemplateLiteral *'] }],
		'no-tabs': 0,
		semi: [1, 'always'],
		'space-before-function-paren': [
			'error',
			{ anonymous: 'always', named: 'never', asyncArrow: 'always' }
		]
	},

	globals: {
		document: false,
		window: false
	}
};
