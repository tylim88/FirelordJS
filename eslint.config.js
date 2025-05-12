// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config({
	rules: {
		'@typescript-eslint/no-unused-expressions': [
			'error',
			{ allowTaggedTemplates: true },
		],
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
	},
	files: ['src/**/*.ts', 'npx/**/*.ts'],
	plugins: {
		'unused-imports': unusedImports,
	},
	extends: [
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		eslintPluginPrettierRecommended, // must be the last recommendation
	],
})
