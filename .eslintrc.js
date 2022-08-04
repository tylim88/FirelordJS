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
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	ignorePatterns: [
		'codeForDoc/**/*',
		'dist/**/*', // Ignore built files.
	],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'import/named': 'off',
		'import/no-unresolved': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off', // explicit function return type
		'@typescript-eslint/no-explicit-any': 'off',
		camelcase: 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-empty-function': 'warn',
		'spaced-comment': 'error',
	},
}
