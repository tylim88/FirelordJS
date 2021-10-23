module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	ignorePatterns: [
		'dist/**/*', // Ignore built files.
	],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'import/no-unresolved': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-namespace': 'off',
		'import/namespace': 'off',
		camelcase: 'off',
	},
}
