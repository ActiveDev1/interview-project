module.exports = {
	root: true,
	env: {
		node: true,
		commonjs: true,
		es2022: true,
		jquery: false,
		jest: true,
		jasmine: true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		indent: ['warn', 'tab', { SwitchCase: 1 }],
		'no-var': ['error'],
		'no-console': ['off'],
		'no-unused-vars': ['warn'],
		'no-mixed-spaces-and-tabs': ['warn'],
		'prettier/prettier': [
			'error',
			{
				semi: false,
				printWidth: false,
				useTabs: true,
				endOfLine: 'auto',
				trailingComma: 'none'
			}
		]
	}
}
