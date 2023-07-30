module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/typescript',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:json/recommended',
		'plugin:markdown/recommended',
		'plugin:yml/prettier',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	ignorePatterns: [
		'codeForDoc/**/*',
		'dist/**/*', // Ignore built files.
	],
	plugins: ['import', 'unused-imports'],
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
		'import/named': 'off',
		'import/no-unresolved': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off', // explicit function return type
		camelcase: 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-empty-function': 'warn',
		'spaced-comment': 'error',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
	},
}
