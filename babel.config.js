module.exports = function (api) {
	api.cache(true)

	return {
		presets: ['@babel/preset-env', '@babel/preset-typescript'],
		plugins: [
			'@babel/plugin-proposal-export-namespace-from',
			[
				'module-resolver',
				{
					root: ['src'],
					extensions: ['.ts', '.tsx'],
					alias: {
						'*': '*',
					},
				},
			],
		],
	}
}
